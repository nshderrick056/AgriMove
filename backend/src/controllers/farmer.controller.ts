import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma';
import { DeliveryStatus } from '@prisma/client';

// ── Helpers ───────────────────────────────────────────────────────────────────

const ACTIVE_STATUSES: DeliveryStatus[] = ['PENDING', 'ASSIGNED', 'EN_ROUTE'];

function startOfMonth() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

const LOCATION_MAP: Record<string, [number, number]> = {
  "Kigali Market":         [30.0619, -1.9441],
  "Kigali":                [30.0619, -1.9441],
  "Nyagatare Farm":        [30.3285, -1.2986],
  "Nyagatare":             [30.3285, -1.2986],
  "Huye Depot":            [29.7394, -2.5995],
  "Huye":                  [29.7394, -2.5995],
  "Musanze Hub":           [29.6047, -1.4988],
  "Musanze":               [29.6047, -1.4988],
  "Rubavu":                [29.3480, -1.6810],
  "Rwamagana":             [30.4346, -1.9495],
  "Kayonza":               [30.6483, -1.8881],
  "Bugesera Farm":         [30.2318, -2.1976],
  "Bugesera":              [30.2318, -2.1976],
  "Muhanga":               [29.7500, -2.0839],
  "Kamonyi":               [29.8768, -2.0285],
  "Ruhango":               [29.7793, -2.2168],
  "Kirehe":                [30.6615, -2.0993],
  "Ngoma":                 [30.4842, -2.1634],
  "Rulindo":               [30.0285, -1.7198],
  "Gakenke":               [29.7794, -1.6860],
  "Gicumbi":               [30.0500, -1.5802],
  "Burera":                [29.8441, -1.3650],
  "Nyabihu":               [29.5041, -1.6534],
  "Karongi":               [29.3500, -2.0673],
  "Rutsiro":               [29.4132, -1.9259],
  "Nyamasheke":            [29.1355, -2.3322],
  "Rusizi":                [28.9075, -2.4815],
  "Gisagara":              [29.8000, -2.5830],
  "Nyanza":                [29.7500, -2.3542],
};

function getCoordsBackend(loc: string): [number, number] {
  if (!loc) return [30.0619, -1.9441];
  const trimmed = loc.trim();
  const match = trimmed.match(/(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)/);
  if (match) {
    const n1 = parseFloat(match[1]);
    const n2 = parseFloat(match[2]);
    if (!isNaN(n1) && !isNaN(n2)) {
      if (Math.abs(n1) <= 90 && Math.abs(n2) <= 180) return [n2, n1];
      if (Math.abs(n2) <= 90 && Math.abs(n1) <= 180) return [n1, n2];
    }
  }
  if (LOCATION_MAP[trimmed]) return LOCATION_MAP[trimmed];
  const lower = trimmed.toLowerCase();
  const key = Object.keys(LOCATION_MAP).find((k) => k.toLowerCase() === lower);
  if (key) return LOCATION_MAP[key];
  const partial = Object.keys(LOCATION_MAP).find((k) => lower.includes(k.toLowerCase()) || k.toLowerCase().includes(lower));
  if (partial) return LOCATION_MAP[partial];
  return [30.0619, -1.9441];
}

function calculateDistanceKmBackend(pickup: string, destination: string): number {
  const [lng1, lat1] = getCoordsBackend(pickup);
  const [lng2, lat2] = getCoordsBackend(destination);

  if (Math.abs(lng1 - lng2) < 0.0001 && Math.abs(lat1 - lat2) < 0.0001) return 5;

  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const roadKm = R * c * 1.35;
  return Math.max(5, Math.round(roadKm * 10) / 10);
}

/**
 * Estimates delivery cost in RWF based dynamically on distance and weight.
 * Formula: base (RWF 2,000) + distance (RWF 100/km) + weight (RWF 10/kg)
 */
function estimateCost(pickup: string, destination: string, weightKg: number): number {
  const distanceKm = calculateDistanceKmBackend(pickup, destination);
  const BASE = 2000;
  const PER_KM = 100;
  const PER_KG = 10;

  const rawTotal = BASE + (distanceKm * PER_KM) + (weightKg * PER_KG);
  return Math.round(rawTotal / 100) * 100;
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

/**
 * GET /api/farmer/dashboard
 * Returns summary metrics for the logged-in farmer.
 */
export const getDashboard = async (req: Request, res: Response): Promise<void> => {
  try {
    const farmerId = req.user!.id;

    const [activeCount, monthlyDeliveries, user] = await Promise.all([
      // Active deliveries
      prisma.delivery.count({
        where: { farmerId, status: { in: ACTIVE_STATUSES } },
      }),
      // All deliveries this month
      prisma.delivery.findMany({
        where: {
          farmerId,
          createdAt: { gte: startOfMonth() },
        },
        select: { totalCost: true, status: true },
      }),
      // Farmer profile
      prisma.user.findUnique({
        where: { id: farmerId },
        select: { fullName: true, region: true },
      }),
    ]);

    const deliveriesThisMonth = monthlyDeliveries.length;

    // Estimate savings vs. traditional transport (20% of totalCost spent this month)
    const totalSpent = monthlyDeliveries
      .filter((d) => d.status === 'DELIVERED')
      .reduce((sum, d) => sum + (d.totalCost ?? 0), 0);
    const estimatedSavings = Math.round(totalSpent * 0.2);

    res.json({
      activeDeliveries: activeCount,
      deliveriesThisMonth,
      estimatedSavings,
      farmer: user,
    });
  } catch (err) {
    console.error('getDashboard error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ── Active Deliveries ─────────────────────────────────────────────────────────

/**
 * GET /api/farmer/deliveries?status=PENDING
 * Returns active (non-historical) deliveries for the logged-in farmer.
 */
export const getDeliveries = async (req: Request, res: Response): Promise<void> => {
  try {
    const farmerId = req.user!.id;
    const { status } = req.query;

    const whereClause: any = { farmerId };

    const VALID_STATUSES = ['PENDING', 'ASSIGNED', 'EN_ROUTE', 'DELIVERED', 'CANCELLED'];

    if (status && typeof status === 'string') {
      const normalized = status.trim().toUpperCase().replace(/\s+/g, '_');
      if (VALID_STATUSES.includes(normalized)) {
        whereClause.status = normalized as DeliveryStatus;
      } else if (normalized === 'ALL' || normalized === 'ALL_STATUSES') {
        // Return all if explicitly requested
      } else {
        whereClause.status = { in: ['PENDING', 'ASSIGNED', 'EN_ROUTE'] };
      }
    } else {
      whereClause.status = { in: ['PENDING', 'ASSIGNED', 'EN_ROUTE'] };
    }

    const deliveries = await prisma.delivery.findMany({
      where: whereClause,
      include: {
        driver: { select: { fullName: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(deliveries);
  } catch (err: any) {
    console.error('getDeliveries error:', err);
    res.status(500).json({ error: err?.message || 'Internal server error' });
  }
};

/**
 * GET /api/farmer/deliveries/:id
 * Returns a single delivery's full detail (farmer must own it).
 */
export const getDeliveryById = async (req: Request, res: Response): Promise<void> => {
  try {
    const farmerId = req.user!.id;
    const id = req.params.id as string;

    const delivery = await prisma.delivery.findFirst({
      where: { id, farmerId },
      include: {
        driver: { select: { fullName: true, phone: true } },
      },
    });

    if (!delivery) {
      res.status(404).json({ error: 'Delivery not found' });
      return;
    }

    res.json(delivery);
  } catch (err) {
    console.error('getDeliveryById error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ── Create Delivery ───────────────────────────────────────────────────────────

/**
 * POST /api/farmer/deliveries
 * Creates a new delivery request for the logged-in farmer.
 * Body: { cargo, weightKg, pickup, destination, preferredDate?, notes? }
 */
export const createDelivery = async (req: Request, res: Response): Promise<void> => {
  try {
    const farmerId = req.user!.id;
    const { cargo, weightKg, pickup, destination, preferredDate, notes } = req.body;

    // Validation
    if (!cargo || typeof cargo !== 'string' || cargo.trim() === '') {
      res.status(400).json({ error: 'Cargo type is required' });
      return;
    }
    const weight = parseFloat(weightKg);
    if (isNaN(weight) || weight <= 0) {
      res.status(400).json({ error: 'Weight must be a positive number' });
      return;
    }
    if (!pickup || !destination) {
      res.status(400).json({ error: 'Pickup location and destination are required' });
      return;
    }

    const estimatedCost = estimateCost(pickup, destination, weight);
    const eta = preferredDate ? new Date(preferredDate) : null;

    const delivery = await prisma.delivery.create({
      data: {
        cargo: cargo.trim(),
        weightKg: weight,
        pickup,
        destination,
        status: 'PENDING',
        eta,
        totalCost: estimatedCost,
        currency: 'RWF',
        farmerId,
      },
    });

    // Notify the farmer themselves about the submission
    await prisma.notification.create({
      data: {
        userId: farmerId,
        message: `Your delivery request for ${cargo} (${delivery.id}) has been submitted`,
        type: 'success',
      },
    });

    res.status(201).json({ message: 'Delivery request created', delivery });
  } catch (err) {
    console.error('createDelivery error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ── Cancel Delivery ───────────────────────────────────────────────────────────

/**
 * DELETE /api/farmer/deliveries/:id
 * Cancels a delivery — only allowed when status is PENDING and the farmer owns it.
 */
export const cancelDelivery = async (req: Request, res: Response): Promise<void> => {
  try {
    const farmerId = req.user!.id;
    const id = req.params.id as string;

    const delivery = await prisma.delivery.findFirst({
      where: { id, farmerId },
    });

    if (!delivery) {
      res.status(404).json({ error: 'Delivery not found' });
      return;
    }

    if (delivery.status !== 'PENDING') {
      res.status(403).json({
        error: `Cannot cancel a delivery with status "${delivery.status}". Only PENDING deliveries can be cancelled.`,
      });
      return;
    }

    const updated = await prisma.delivery.update({
      where: { id: delivery.id },
      data: { status: 'CANCELLED' },
    });

    await prisma.notification.create({
      data: {
        userId: farmerId,
        message: `Delivery ${delivery.id} has been cancelled`,
        type: 'info',
      },
    });

    res.json({ message: 'Delivery cancelled', delivery: updated });
  } catch (err) {
    console.error('cancelDelivery error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ── Delivery History ──────────────────────────────────────────────────────────

/**
 * GET /api/farmer/history
 * Returns completed and cancelled deliveries for the farmer.
 */
export const getHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const farmerId = req.user!.id;

    const history = await prisma.delivery.findMany({
      where: {
        farmerId,
        status: { in: ['DELIVERED', 'CANCELLED'] },
      },
      include: {
        driver: { select: { fullName: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });

    res.json(history);
  } catch (err: any) {
    console.error('getHistory error:', err);
    res.status(500).json({ error: err?.message || 'Internal server error' });
  }
};

// ── Track Shipment ────────────────────────────────────────────────────────────

/**
 * GET /api/farmer/track/:id
 * Returns delivery status + ETA + driver for the given delivery ID (farmer must own it).
 */
export const trackDelivery = async (req: Request, res: Response): Promise<void> => {
  try {
    const farmerId = req.user!.id;
    const id = req.params.id as string;

    const delivery = await prisma.delivery.findFirst({
      where: { id, farmerId },
      select: {
        id: true,
        cargo: true,
        weightKg: true,
        pickup: true,
        destination: true,
        status: true,
        eta: true,
        driver: { select: { fullName: true } },
      },
    });

    if (!delivery) {
      res.status(404).json({ error: 'Delivery not found or not accessible' });
      return;
    }

    res.json(delivery);
  } catch (err) {
    console.error('trackDelivery error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ── Notifications ─────────────────────────────────────────────────────────────

/**
 * GET /api/farmer/notifications
 * Returns the notification feed for the farmer (most recent first).
 */
export const getNotifications = async (req: Request, res: Response): Promise<void> => {
  try {
    const farmerId = req.user!.id;

    const notifs = await prisma.notification.findMany({
      where: { userId: farmerId },
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
 * PATCH /api/farmer/notifications/:id/read
 * Marks a single notification as read.
 */
export const markNotificationRead = async (req: Request, res: Response): Promise<void> => {
  try {
    const farmerId = req.user!.id;
    const id = req.params.id as string;

    const notif = await prisma.notification.findFirst({
      where: { id, userId: farmerId },
    });

    if (!notif) {
      res.status(404).json({ error: 'Notification not found' });
      return;
    }

    const updated = await prisma.notification.update({
      where: { id: notif.id },
      data: { read: true },
    });

    res.json(updated);
  } catch (err) {
    console.error('markNotificationRead error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ── Profile ───────────────────────────────────────────────────────────────────

/**
 * GET /api/farmer/profile
 * Returns the farmer's profile info.
 */
export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const farmerId = req.user!.id;

    const user = await prisma.user.findUnique({
      where: { id: farmerId },
      select: { id: true, fullName: true, email: true, phone: true, region: true, role: true },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json(user);
  } catch (err) {
    console.error('getProfile error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * PATCH /api/farmer/profile
 * Updates personal info and/or password.
 * Body: { fullName?, phone?, region?, currentPassword?, newPassword? }
 */
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const farmerId = req.user!.id;
    const { fullName, phone, region, currentPassword, newPassword } = req.body;

    // Password change flow
    if (newPassword) {
      if (!currentPassword) {
        res.status(400).json({ error: 'Current password is required to set a new password' });
        return;
      }

      const user = await prisma.user.findUnique({ where: { id: farmerId } });
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        res.status(400).json({ error: 'Current password is incorrect' });
        return;
      }

      const hashed = await bcrypt.hash(newPassword, 10);
      await prisma.user.update({
        where: { id: farmerId },
        data: { password: hashed },
      });
    }

    // Profile info update
    const updated = await prisma.user.update({
      where: { id: farmerId },
      data: {
        ...(fullName !== undefined && { fullName }),
        ...(phone !== undefined && { phone }),
        ...(region !== undefined && { region }),
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
    const farmerId = req.user!.id;
    const { issue, priority } = req.body;

    if (!issue || typeof issue !== 'string' || issue.trim() === '') {
      res.status(400).json({ error: 'Issue description is required' });
      return;
    }

    const complaint = await prisma.complaint.create({
      data: {
        userId: farmerId,
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
    const farmerId = req.user!.id;
    const complaints = await prisma.complaint.findMany({
      where: { userId: farmerId },
      orderBy: { createdAt: 'desc' },
    });
    res.json(complaints);
  } catch (err) {
    console.error('getComplaints error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
