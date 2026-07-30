import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma';

// ── Helpers ───────────────────────────────────────────────────────────────────

function startOfDay(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function startOfWeek(): Date {
  const d = new Date();
  d.setDate(d.getDate() - 6); // last 7 days rolling
  d.setHours(0, 0, 0, 0);
  return d;
}

function startOfMonth(): Date {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const WEEK_LABELS = ['W1', 'W2', 'W3', 'W4'];

// ── Dashboard ─────────────────────────────────────────────────────────────────

/**
 * GET /api/driver/dashboard
 * Returns today's earnings, this-week delivery count, and active delivery preview.
 */
export const getDashboard = async (req: Request, res: Response): Promise<void> => {
  try {
    const driverId = req.user!.id;

    const [todayDeliveries, weekDeliveries, activeDelivery, driver] = await Promise.all([
      // Today's completed deliveries for earnings
      prisma.delivery.findMany({
        where: { driverId, status: 'DELIVERED', updatedAt: { gte: startOfDay() } },
        select: { totalCost: true, currency: true },
      }),
      // This week's delivery count
      prisma.delivery.count({
        where: { driverId, status: 'DELIVERED', updatedAt: { gte: startOfWeek() } },
      }),
      // Current active delivery
      prisma.delivery.findFirst({
        where: { driverId, status: { in: ['ASSIGNED', 'EN_ROUTE'] } },
        include: { farmer: { select: { fullName: true, phone: true } } },
        orderBy: { updatedAt: 'desc' },
      }),
      // Driver profile
      prisma.user.findUnique({
        where: { id: driverId },
        select: { fullName: true, region: true },
      }),
    ]);

    const currency = todayDeliveries[0]?.currency ?? 'RWF';
    const todayEarnings = todayDeliveries.reduce((sum, d) => sum + (d.totalCost ?? 0), 0);

    res.json({
      todayEarnings,
      currency,
      deliveriesThisWeek: weekDeliveries,
      activeDelivery,
      driver,
    });
  } catch (err) {
    console.error('getDashboard error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ── Available Jobs ────────────────────────────────────────────────────────────

/**
 * GET /api/driver/jobs?cargo=Tomatoes
 * Returns PENDING unassigned deliveries (available for any driver to accept).
 */
export const getAvailableJobs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { cargo } = req.query;

    const jobs = await prisma.delivery.findMany({
      where: {
        status: 'PENDING',
        driverId: null,
        ...(cargo ? { cargo: { contains: cargo as string, mode: 'insensitive' } } : {}),
      },
      include: {
        farmer: { select: { fullName: true, region: true, phone: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(jobs);
  } catch (err) {
    console.error('getAvailableJobs error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ── Accept Job ────────────────────────────────────────────────────────────────

/**
 * POST /api/driver/jobs/:id/accept
 * Assigns this driver to a PENDING delivery → status becomes ASSIGNED.
 */
export const acceptJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const driverId = req.user!.id;
    const id = req.params.id as string;

    // Check driver doesn't already have an active delivery
    const alreadyActive = await prisma.delivery.findFirst({
      where: { driverId, status: { in: ['ASSIGNED', 'EN_ROUTE'] } },
    });
    if (alreadyActive) {
      res.status(400).json({ error: 'You already have an active delivery. Complete it before accepting a new one.' });
      return;
    }

    const delivery = await prisma.delivery.findFirst({
      where: { id, status: 'PENDING', driverId: null },
    });
    if (!delivery) {
      res.status(404).json({ error: 'Job not found or already taken' });
      return;
    }

    const updated = await prisma.delivery.update({
      where: { id: delivery.id },
      data: { status: 'ASSIGNED', driverId },
    });

    // Notify the farmer
    const driver = await prisma.user.findUnique({
      where: { id: driverId },
      select: { fullName: true },
    });
    await prisma.notification.create({
      data: {
        userId: delivery.farmerId,
        message: `Driver ${driver?.fullName ?? 'A driver'} has accepted your delivery ${delivery.id}`,
        type: 'success',
      },
    });

    // Notify the driver themselves
    await prisma.notification.create({
      data: {
        userId: driverId,
        message: `You accepted delivery ${delivery.id} (${delivery.cargo} · ${delivery.weightKg} kg)`,
        type: 'info',
      },
    });

    res.json({ message: 'Job accepted', delivery: updated });
  } catch (err) {
    console.error('acceptJob error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ── Reject Job ────────────────────────────────────────────────────────────────

/**
 * POST /api/driver/jobs/:id/reject
 * Driver skips a job — job stays PENDING for other drivers.
 * Records a notification for tracking purposes.
 */
export const rejectJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const driverId = req.user!.id;
    const id = req.params.id as string;

    const delivery = await prisma.delivery.findFirst({
      where: { id, status: 'PENDING', driverId: null },
    });
    if (!delivery) {
      res.status(404).json({ error: 'Job not found or already taken' });
      return;
    }

    await prisma.notification.create({
      data: {
        userId: driverId,
        message: `You passed on delivery ${delivery.id} (${delivery.cargo})`,
        type: 'info',
      },
    });

    res.json({ message: 'Job rejected' });
  } catch (err) {
    console.error('rejectJob error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ── Active Delivery ───────────────────────────────────────────────────────────

/**
 * GET /api/driver/active
 * Returns the driver's current ASSIGNED or EN_ROUTE delivery.
 */
export const getActiveDelivery = async (req: Request, res: Response): Promise<void> => {
  try {
    const driverId = req.user!.id;

    const delivery = await prisma.delivery.findFirst({
      where: { driverId, status: { in: ['ASSIGNED', 'EN_ROUTE'] } },
      include: {
        farmer: { select: { fullName: true, phone: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });

    res.json(delivery ?? null);
  } catch (err) {
    console.error('getActiveDelivery error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ── Update Delivery Status ────────────────────────────────────────────────────

/**
 * PATCH /api/driver/active/:id/status
 * Advances delivery status: ASSIGNED → EN_ROUTE → DELIVERED.
 * Body: { status: 'EN_ROUTE' | 'DELIVERED' }
 */
export const updateStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const driverId = req.user!.id;
    const id = req.params.id as string;
    const { status: newStatus } = req.body;

    if (!['EN_ROUTE', 'DELIVERED'].includes(newStatus)) {
      res.status(400).json({ error: 'Status must be EN_ROUTE or DELIVERED' });
      return;
    }

    const delivery = await prisma.delivery.findFirst({
      where: { id, driverId },
    });
    if (!delivery) {
      res.status(404).json({ error: 'Delivery not found' });
      return;
    }

    // Enforce forward-only progression
    const ORDER: Record<string, number> = {
      PENDING: 0, ASSIGNED: 1, EN_ROUTE: 2, DELIVERED: 3, CANCELLED: -1,
    };
    if (ORDER[newStatus] <= ORDER[delivery.status]) {
      res.status(400).json({
        error: `Cannot move status from ${delivery.status} to ${newStatus}`,
      });
      return;
    }

    const updated = await prisma.delivery.update({
      where: { id: delivery.id },
      data: { status: newStatus },
    });

    // Notify farmer
    const notifMsg =
      newStatus === 'EN_ROUTE'
        ? `Driver is now en route with your delivery ${delivery.id}`
        : `Your delivery ${delivery.id} has been delivered`;

    await prisma.notification.create({
      data: { userId: delivery.farmerId, message: notifMsg, type: newStatus === 'DELIVERED' ? 'success' : 'info' },
    });

    // Send email notification to farmer
    const farmerUser = await prisma.user.findUnique({ where: { id: delivery.farmerId }, select: { email: true } });
    if (farmerUser?.email) {
      try {
        const { sendDeliveryStatusEmail } = await import('../lib/email.service');
        sendDeliveryStatusEmail(farmerUser.email, delivery.id, delivery.cargo, newStatus).catch(() => {});
      } catch {}
    }

    res.json({ message: 'Status updated', delivery: updated });
  } catch (err) {
    console.error('updateStatus error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * POST /api/driver/deliveries/:id/proof
 * Uploads delivery proof image for an assigned job.
 */
export const uploadProofImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const driverId = req.user!.id;
    const id = req.params.id as string;
    const file = req.file;

    if (!file) {
      res.status(400).json({ error: 'No image file uploaded' });
      return;
    }

    const delivery = await prisma.delivery.findFirst({
      where: { id, driverId },
    });
    if (!delivery) {
      res.status(404).json({ error: 'Delivery not found' });
      return;
    }

    const proofImageUrl = `/uploads/proofs/${file.filename}`;

    const updated = await prisma.delivery.update({
      where: { id: delivery.id },
      data: { proofImageUrl },
    });

    res.json({ message: 'Delivery proof uploaded successfully', delivery: updated, proofImageUrl });
  } catch (err) {
    console.error('uploadProofImage error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ── Earnings ──────────────────────────────────────────────────────────────────

/**
 * GET /api/driver/earnings?period=weekly|monthly
 * Returns pre-grouped earnings data ready for Recharts.
 * weekly  → [ { day: 'Mon', earnings: 18500 }, … ] (last 7 days)
 * monthly → [ { week: 'W1', earnings: 142000 }, … ] (current month)
 */
export const getEarnings = async (req: Request, res: Response): Promise<void> => {
  try {
    const driverId = req.user!.id;
    const period = (req.query.period as string) ?? 'weekly';

    const since = period === 'monthly' ? startOfMonth() : startOfWeek();

    const deliveries = await prisma.delivery.findMany({
      where: { driverId, status: 'DELIVERED', updatedAt: { gte: since } },
      select: { totalCost: true, currency: true, updatedAt: true },
    });

    const currency = deliveries[0]?.currency ?? 'RWF';

    if (period === 'weekly') {
      // Group by day-of-week label over last 7 days
      const buckets: Record<string, number> = {};
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        buckets[DAY_LABELS[d.getDay()]] = 0;
      }
      for (const d of deliveries) {
        const label = DAY_LABELS[new Date(d.updatedAt).getDay()];
        if (label in buckets) buckets[label] = (buckets[label] ?? 0) + (d.totalCost ?? 0);
      }
      const data = Object.entries(buckets).map(([day, earnings]) => ({ day, earnings }));
      const totalThisWeek = data.reduce((s, r) => s + r.earnings, 0);
      res.json({ period: 'weekly', data, total: totalThisWeek, currency });
    } else {
      // Group by calendar week within the current month (W1–W4)
      const buckets: Record<string, number> = { W1: 0, W2: 0, W3: 0, W4: 0 };
      for (const d of deliveries) {
        const day = new Date(d.updatedAt).getDate();
        const weekLabel = WEEK_LABELS[Math.min(Math.floor((day - 1) / 7), 3)];
        buckets[weekLabel] = (buckets[weekLabel] ?? 0) + (d.totalCost ?? 0);
      }
      const data = Object.entries(buckets).map(([week, earnings]) => ({ week, earnings }));
      const totalThisMonth = data.reduce((s, r) => s + r.earnings, 0);
      res.json({ period: 'monthly', data, total: totalThisMonth, currency });
    }
  } catch (err) {
    console.error('getEarnings error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ── Delivery History ──────────────────────────────────────────────────────────

/**
 * GET /api/driver/history
 * Returns completed and cancelled deliveries for this driver.
 */
export const getHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const driverId = req.user!.id;

    const history = await prisma.delivery.findMany({
      where: { driverId, status: { in: ['DELIVERED', 'CANCELLED'] } },
      include: { farmer: { select: { fullName: true } } },
      orderBy: { updatedAt: 'desc' },
    });

    res.json(history);
  } catch (err) {
    console.error('getHistory error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ── Notifications ─────────────────────────────────────────────────────────────

/**
 * GET /api/driver/notifications
 */
export const getNotifications = async (req: Request, res: Response): Promise<void> => {
  try {
    const driverId = req.user!.id;
    const notifs = await prisma.notification.findMany({
      where: { userId: driverId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    res.json(notifs);
  } catch (err) {
    console.error('getNotifications error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * PATCH /api/driver/notifications/:id/read
 */
export const markNotificationRead = async (req: Request, res: Response): Promise<void> => {
  try {
    const driverId = req.user!.id;
    const id = req.params.id as string;

    const notif = await prisma.notification.findFirst({ where: { id, userId: driverId } });
    if (!notif) {
      res.status(404).json({ error: 'Notification not found' });
      return;
    }
    const updated = await prisma.notification.update({ where: { id: notif.id }, data: { read: true } });
    res.json(updated);
  } catch (err) {
    console.error('markNotificationRead error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ── Profile ───────────────────────────────────────────────────────────────────

/**
 * GET /api/driver/profile
 */
export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const driverId = req.user!.id;
    const user = await prisma.user.findUnique({
      where: { id: driverId },
      select: { id: true, fullName: true, email: true, phone: true, region: true, role: true },
    });
    if (!user) { res.status(404).json({ error: 'User not found' }); return; }
    res.json(user);
  } catch (err) {
    console.error('getProfile error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * PATCH /api/driver/profile
 * Body: { fullName?, phone?, region?, currentPassword?, newPassword? }
 */
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const driverId = req.user!.id;
    const { fullName, phone, region, currentPassword, newPassword } = req.body;

    if (newPassword) {
      if (!currentPassword) {
        res.status(400).json({ error: 'Current password is required to set a new password' });
        return;
      }
      const user = await prisma.user.findUnique({ where: { id: driverId } });
      if (!user) { res.status(404).json({ error: 'User not found' }); return; }
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) { res.status(400).json({ error: 'Current password is incorrect' }); return; }
      const hashed = await bcrypt.hash(newPassword, 10);
      await prisma.user.update({ where: { id: driverId }, data: { password: hashed } });
    }

    const updated = await prisma.user.update({
      where: { id: driverId },
      data: {
        ...(fullName !== undefined && { fullName }),
        ...(phone   !== undefined && { phone }),
        ...(region  !== undefined && { region }),
      },
      select: { id: true, fullName: true, email: true, phone: true, region: true, role: true },
    });

    res.json({ message: 'Profile updated', user: updated });
  } catch (err) {
    console.error('updateProfile error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ── Complaints ────────────────────────────────────────────────────────────────

export const createComplaint = async (req: Request, res: Response): Promise<void> => {
  try {
    const driverId = req.user!.id;
    const { issue, priority } = req.body;

    if (!issue || typeof issue !== 'string' || issue.trim() === '') {
      res.status(400).json({ error: 'Issue description is required' });
      return;
    }

    const complaint = await prisma.complaint.create({
      data: {
        userId: driverId,
        issue: issue.trim(),
        priority: priority || 'Medium',
      },
    });

    res.status(201).json({ message: 'Complaint submitted', complaint });
  } catch (err) {
    console.error('createComplaint error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getComplaints = async (req: Request, res: Response): Promise<void> => {
  try {
    const driverId = req.user!.id;
    const complaints = await prisma.complaint.findMany({
      where: { userId: driverId },
      orderBy: { createdAt: 'desc' },
    });
    res.json(complaints);
  } catch (err) {
    console.error('getComplaints error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
