import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.middleware';
import {
  getDashboard,
  getAvailableJobs,
  acceptJob,
  rejectJob,
  getActiveDelivery,
  updateStatus,
  getEarnings,
  getHistory,
  getNotifications,
  markNotificationRead,
  getProfile,
  updateProfile,
  createComplaint,
  getComplaints,
} from '../controllers/driver.controller';

const router = Router();

// All driver routes require authentication + TRANSPORTER role
router.use(requireAuth, requireRole('TRANSPORTER'));

// Dashboard
router.get('/dashboard', getDashboard);

// Available jobs
router.get('/jobs',            getAvailableJobs);
router.post('/jobs/:id/accept', acceptJob);
router.post('/jobs/:id/reject', rejectJob);

// Active delivery
router.get('/active',                  getActiveDelivery);
router.patch('/active/:id/status',     updateStatus);

// Earnings
router.get('/earnings', getEarnings);

// History
router.get('/history', getHistory);

// Notifications
router.get('/notifications',            getNotifications);
router.patch('/notifications/:id/read', markNotificationRead);

// Complaints
router.get('/complaints',  getComplaints);
router.post('/complaints', createComplaint);

// Profile
router.get('/profile',   getProfile);
router.patch('/profile', updateProfile);

export default router;
