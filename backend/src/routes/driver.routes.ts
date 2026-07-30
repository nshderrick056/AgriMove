import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.middleware';
import {
  getDashboard,
  getAvailableJobs,
  acceptJob,
  rejectJob,
  getActiveDelivery,
  updateStatus,
  uploadProofImage,
  getEarnings,
  getHistory,
  getNotifications,
  markNotificationRead,
  getProfile,
  updateProfile,
  createComplaint,
  getComplaints,
} from '../controllers/driver.controller';

const proofStorageDir = path.join(__dirname, '../../uploads/proofs');
if (!fs.existsSync(proofStorageDir)) {
  fs.mkdirSync(proofStorageDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req: any, _file: any, cb: (error: Error | null, destination: string) => void) => cb(null, proofStorageDir),
  filename: (_req: any, file: any, cb: (error: Error | null, filename: string) => void) => {
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, `proof_${Date.now()}_${Math.random().toString(36).substring(2, 7)}${ext}`);
  },
});
const upload = multer({ storage });

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
router.post('/active/:id/proof',       upload.single('proofImage'), uploadProofImage);

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
