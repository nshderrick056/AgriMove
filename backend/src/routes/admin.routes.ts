import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.middleware';
import {
  getDashboard,
  getUsers,
  updateUserStatus,
  getAllDeliveries,
  cancelDelivery,
  deleteDelivery,
  generateReport,
  getComplaints,
  resolveComplaint,
  getSystemLogs,
  getProfile,
  updateProfile,
} from '../controllers/admin.controller';

const router = Router();

// All admin routes require authentication + ADMIN role
router.use(requireAuth, requireRole('ADMIN'));

// Dashboard & Users
router.get('/dashboard',              getDashboard);
router.get('/users',                  getUsers);
router.patch('/users/:id/status',     updateUserStatus);

// Deliveries
router.get('/deliveries',              getAllDeliveries);
router.post('/deliveries/:id/cancel',  cancelDelivery);
router.patch('/deliveries/:id/cancel', cancelDelivery);
router.patch('/deliveries/:id',        cancelDelivery);
router.delete('/deliveries/:id',       deleteDelivery);

// Reports & Complaints
router.post('/reports/generate',      generateReport);
router.get('/complaints',             getComplaints);
router.patch('/complaints/:id/resolve', resolveComplaint);

// System Logs & Profile
router.get('/logs',                   getSystemLogs);
router.get('/profile',                getProfile);
router.patch('/profile',              updateProfile);

export default router;
