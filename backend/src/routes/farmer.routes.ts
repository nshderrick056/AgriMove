import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.middleware';
import {
  getDashboard,
  getDeliveries,
  getDeliveryById,
  createDelivery,
  cancelDelivery,
  getHistory,
  trackDelivery,
  getNotifications,
  markNotificationRead,
  getProfile,
  updateProfile,
  createComplaint,
  getComplaints,
} from '../controllers/farmer.controller';

const router = Router();

// All farmer routes require authentication + FARMER role
router.use(requireAuth, requireRole('FARMER'));

// Dashboard
router.get('/dashboard', getDashboard);

// Deliveries
router.get('/deliveries',        getDeliveries);
router.get('/deliveries/:id',    getDeliveryById);
router.post('/deliveries',       createDelivery);
router.delete('/deliveries/:id', cancelDelivery);

// Track
router.get('/track/:id', trackDelivery);

// History
router.get('/history', getHistory);

// Notifications
router.get('/notifications',             getNotifications);
router.patch('/notifications/:id/read',  markNotificationRead);

// Complaints
router.get('/complaints',  getComplaints);
router.post('/complaints', createComplaint);

// Profile
router.get('/profile',   getProfile);
router.patch('/profile', updateProfile);

export default router;
