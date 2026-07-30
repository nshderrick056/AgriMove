import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma';
import { Role } from '@prisma/client';

// ── Helpers ───────────────────────────────────────────────────────────────────

function startOfDay(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

// ── Dashboard Overview ────────────────────────────────────────────────────────

/**
 * GET /api/admin/dashboard
 */
export const getDashboard = async (req: Request, res: Response): Promise<void> => {
  try {
    const [activeUsersCount, deliveriesToday, openComplaintsCount, recentDeliveries, adminUser] = await Promise.all([
      prisma.user.count({ where: { status: 'Active' } }),
      prisma.delivery.count({ where: { createdAt: { gte: startOfDay() } } }),
      prisma.complaint.count({ where: { resolved: false } }),
      prisma.delivery.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          farmer: { select: { fullName: true } },
          driver: { select: { fullName: true } },
        },
      }),
      prisma.user.findUnique({
        where: { id: req.user!.id },
        select: { fullName: true, email: true, region: true },
      }),
    ]);

    res.json({
      activeUsersCount,
      deliveriesToday,
      systemUptime: '99.8%',
      openComplaintsCount,
      recentDeliveries,
      admin: adminUser,
    });
  } catch (err) {
    console.error('admin getDashboard error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ── User Management ───────────────────────────────────────────────────────────

/**
 * GET /api/admin/users?role=FARMER
 */
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { role } = req.query;

    const whereClause: any = {};
    if (role && typeof role === 'string') {
      const normalizedRole = role.trim().toUpperCase();
      if (normalizedRole === 'FARMER' || normalizedRole === 'TRANSPORTER' || normalizedRole === 'DRIVER') {
        whereClause.role = normalizedRole === 'DRIVER' ? 'TRANSPORTER' : (normalizedRole as Role);
      }
    }

    const users = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        region: true,
        role: true,
        status: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(users);
  } catch (err) {
    console.error('admin getUsers error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * PATCH /api/admin/users/:id/status
 * Body: { status: 'Active' | 'Suspended' }
 */
export const updateUserStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { status } = req.body;

    if (!['Active', 'Suspended'].includes(status)) {
      res.status(400).json({ error: 'Status must be Active or Suspended' });
      return;
    }

    const targetUser = await prisma.user.findUnique({ where: { id } });
    if (!targetUser) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Prevent suspending self if admin
    if (targetUser.id === req.user!.id) {
      res.status(400).json({ error: 'Cannot suspend your own admin account' });
      return;
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { status },
      select: { id: true, fullName: true, email: true, role: true, status: true },
    });

    res.json({ message: `User status updated to ${status}`, user: updated });
  } catch (err) {
    console.error('admin updateUserStatus error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ── All Deliveries ────────────────────────────────────────────────────────────

/**
 * GET /api/admin/deliveries
 */
export const getAllDeliveries = async (req: Request, res: Response): Promise<void> => {
  try {
    const deliveries = await prisma.delivery.findMany({
      include: {
        farmer: { select: { fullName: true } },
        driver: { select: { fullName: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(deliveries);
  } catch (err) {
    console.error('admin getAllDeliveries error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * POST or PATCH /api/admin/deliveries/:id/cancel
 * Admin cancels a delivery request.
 */
export const cancelDelivery = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    console.log(`[AdminController] cancelDelivery request received for ID: "${id}"`);

    let delivery = await prisma.delivery.findUnique({ where: { id } });
    if (!delivery) {
      delivery = await prisma.delivery.findFirst({ where: { id } });
    }

    if (!delivery) {
      console.warn(`[AdminController] Delivery "${id}" not found in database.`);
      res.status(404).json({ error: `Delivery request ${id} not found in database` });
      return;
    }

    if (delivery.status === 'CANCELLED') {
      res.status(400).json({ error: 'Delivery request is already cancelled' });
      return;
    }

    const updated = await prisma.delivery.update({
      where: { id: delivery.id },
      data: { status: 'CANCELLED' },
      include: {
        farmer: { select: { fullName: true } },
        driver: { select: { fullName: true } },
      },
    });

    await prisma.systemLog.create({
      data: {
        level: 'WARN',
        msg: `Admin cancelled delivery ${delivery.id} (${delivery.cargo})`,
      },
    });

    if (delivery.farmerId) {
      await prisma.notification.create({
        data: {
          userId: delivery.farmerId,
          message: `Delivery ${delivery.id} has been cancelled by administration`,
          type: 'warning',
        },
      });
    }

    res.json({ message: 'Delivery request cancelled by admin', delivery: updated });
  } catch (err) {
    console.error('admin cancelDelivery error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * DELETE /api/admin/deliveries/:id
 * Admin permanently deletes a delivery request.
 */
export const deleteDelivery = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    console.log(`[AdminController] deleteDelivery request received for ID: "${id}"`);

    let delivery = await prisma.delivery.findUnique({ where: { id } });
    if (!delivery) {
      delivery = await prisma.delivery.findFirst({ where: { id } });
    }

    if (!delivery) {
      console.warn(`[AdminController] Delivery "${id}" not found in database.`);
      res.status(404).json({ error: `Delivery request ${id} not found in database` });
      return;
    }

    await prisma.delivery.delete({ where: { id: delivery.id } });

    await prisma.systemLog.create({
      data: {
        level: 'WARN',
        msg: `Admin permanently deleted delivery ${delivery.id} (${delivery.cargo})`,
      },
    });

    res.json({ message: `Delivery request ${delivery.id} permanently deleted` });
  } catch (err) {
    console.error('admin deleteDelivery error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ── Reports ───────────────────────────────────────────────────────────────────

/**
 * POST /api/admin/reports/generate
 * Body: { reportType: string, dateFrom?: string, dateTo?: string, format?: 'csv' | 'json' }
 */
export const generateReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const { reportType, dateFrom, dateTo, format } = req.body;

    const where: any = {};
    if (dateFrom) where.createdAt = { ...(where.createdAt || {}), gte: new Date(dateFrom) };
    if (dateTo) where.createdAt = { ...(where.createdAt || {}), lte: new Date(dateTo) };

    const deliveries = await prisma.delivery.findMany({
      where,
      include: { farmer: { select: { fullName: true } }, driver: { select: { fullName: true } } },
      orderBy: { createdAt: 'desc' },
    });

    if (format === 'csv') {
      const header = 'ID,Cargo,WeightKg,Pickup,Destination,Status,TotalCost,Currency,Farmer,Driver,CreatedAt\n';
      const rows = deliveries.map((d) =>
        `"${d.id}","${d.cargo}",${d.weightKg},"${d.pickup}","${d.destination}","${d.status}",${d.totalCost ?? 0},"${d.currency}","${d.farmer?.fullName ?? ''}","${d.driver?.fullName ?? ''}","${d.createdAt.toISOString()}"`
      ).join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="report_${reportType || 'summary'}.csv"`);
      res.send(header + rows);
      return;
    }

    res.json({
      reportType: reportType || 'Delivery summary',
      generatedAt: new Date().toISOString(),
      recordCount: deliveries.length,
      deliveries,
    });
  } catch (err) {
    console.error('admin generateReport error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ── Complaints ────────────────────────────────────────────────────────────────

/**
 * GET /api/admin/complaints
 */
export const getComplaints = async (req: Request, res: Response): Promise<void> => {
  try {
    const complaints = await prisma.complaint.findMany({
      include: { user: { select: { fullName: true, role: true } } },
      orderBy: { createdAt: 'desc' },
    });

    res.json(complaints);
  } catch (err) {
    console.error('admin getComplaints error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * PATCH /api/admin/complaints/:id/resolve
 */
export const resolveComplaint = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const complaint = await prisma.complaint.findUnique({ where: { id } });

    if (!complaint) {
      res.status(404).json({ error: 'Complaint not found' });
      return;
    }

    const updated = await prisma.complaint.update({
      where: { id },
      data: { resolved: !complaint.resolved },
    });

    res.json({ message: `Complaint resolution set to ${updated.resolved}`, complaint: updated });
  } catch (err) {
    console.error('admin resolveComplaint error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ── System Logs ───────────────────────────────────────────────────────────────

/**
 * GET /api/admin/logs
 */
export const getSystemLogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const logs = await prisma.systemLog.findMany({
      take: 50,
      orderBy: { createdAt: 'desc' },
    });

    res.json(logs);
  } catch (err) {
    console.error('admin getSystemLogs error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ── Profile & Settings ────────────────────────────────────────────────────────

/**
 * GET /api/admin/profile
 */
export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { id: true, fullName: true, email: true, phone: true, region: true, role: true },
    });
    if (!user) { res.status(404).json({ error: 'User not found' }); return; }
    res.json(user);
  } catch (err) {
    console.error('admin getProfile error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * PATCH /api/admin/profile
 */
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const adminId = req.user!.id;
    const { fullName, phone, region, currentPassword, newPassword } = req.body;

    if (newPassword) {
      if (!currentPassword) {
        res.status(400).json({ error: 'Current password is required to set a new password' });
        return;
      }
      const user = await prisma.user.findUnique({ where: { id: adminId } });
      if (!user) { res.status(404).json({ error: 'User not found' }); return; }
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) { res.status(400).json({ error: 'Current password is incorrect' }); return; }
      const hashed = await bcrypt.hash(newPassword, 10);
      await prisma.user.update({ where: { id: adminId }, data: { password: hashed } });
    }

    const updated = await prisma.user.update({
      where: { id: adminId },
      data: {
        ...(fullName !== undefined && { fullName }),
        ...(phone   !== undefined && { phone }),
        ...(region  !== undefined && { region }),
      },
      select: { id: true, fullName: true, email: true, phone: true, region: true, role: true },
    });

    res.json({ message: 'Profile updated', user: updated });
  } catch (err) {
    console.error('admin updateProfile error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
