import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import authRoutes   from './routes/auth.routes';
import farmerRoutes from './routes/farmer.routes';
import driverRoutes from './routes/driver.routes';
import adminRoutes  from './routes/admin.routes';
import { seedAdmin } from './lib/seedAdmin';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth',   authRoutes);
app.use('/api/farmer', farmerRoutes);
app.use('/api/driver', driverRoutes);
app.use('/api/admin',  adminRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'AgriMove API is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  seedAdmin();
});
