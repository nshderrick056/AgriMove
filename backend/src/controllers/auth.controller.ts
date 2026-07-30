import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import prisma from '../lib/prisma';
import { Role } from '@prisma/client';
import { sendPasswordResetEmail, sendVerificationEmail } from '../lib/email.service';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret_fallback_key';

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fullName, email, phone, password, role } = req.body;
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPhone = (phone || '').trim();
    const cleanPassword = (password || '').trim();

    if (!cleanEmail || !cleanPassword || !fullName) {
      res.status(400).json({ error: 'Full name, email, and password are required' });
      return;
    }

    // Check if user exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: { equals: cleanEmail, mode: 'insensitive' } },
          ...(cleanPhone ? [{ phone: cleanPhone }] : []),
        ],
      },
    });

    if (existingUser) {
      res.status(400).json({ error: 'User already exists with this email or phone' });
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(cleanPassword, salt);

    // Verification token
    const verifyToken = crypto.randomBytes(32).toString('hex');

    // Driver/Transporter accounts require admin approval before becoming Active
    const initialStatus = (role === 'TRANSPORTER' || role === 'DRIVER') ? 'Pending' : 'Active';

    // Create user
    const user = await prisma.user.create({
      data: {
        fullName: fullName.trim(),
        email: cleanEmail,
        phone: cleanPhone || null,
        password: passwordHash,
        role: (role as Role) || 'FARMER',
        status: initialStatus,
        emailVerified: false,
        verificationToken: verifyToken,
      },
    });

    // Send verification email
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const verifyLink = `${frontendUrl}/#verify-email?token=${verifyToken}`;
    await sendVerificationEmail(user.email, verifyLink, user.fullName);

    // Return registration message requiring email verification (no token generated for auto-login)
    res.status(201).json({
      requiresVerification: true,
      message: initialStatus === 'Pending' 
        ? 'Account registered successfully! A confirmation link has been sent to your email. Please verify your email before logging in. Note: Transporter accounts also require admin approval.'
        : 'Account registered successfully! A confirmation link has been sent to your email. Please verify your email before logging in.',
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.body;
    if (!token) {
      res.status(400).json({ error: 'Verification token is required' });
      return;
    }

    const user = await prisma.user.findFirst({
      where: { verificationToken: token },
    });

    if (!user) {
      res.status(400).json({ error: 'Invalid or expired email verification token' });
      return;
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verificationToken: null,
      },
    });

    res.status(200).json({ message: 'Email address verified successfully! You can now log in.' });
  } catch (error) {
    console.error('verifyEmail error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const cleanIdentifier = (email || '').trim();
    const cleanPassword = (password || '').trim();

    if (!cleanIdentifier || !cleanPassword) {
      res.status(400).json({ error: 'Email/phone and password are required' });
      return;
    }

    // Find user by email or phone
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: { equals: cleanIdentifier, mode: 'insensitive' } },
          { phone: cleanIdentifier },
        ],
      },
    });

    if (!user) {
      res.status(400).json({ error: 'Invalid credentials' });
      return;
    }
    if (user.status === 'Suspended') {
      res.status(403).json({ error: 'Your account has been suspended. Please contact support.' });
      return;
    }

    // Check if email is verified (Exempt ADMIN role and admin@agrimove.com)
    if (!user.emailVerified && user.role !== 'ADMIN' && user.email.toLowerCase() !== 'admin@agrimove.com') {
      res.status(403).json({
        error: 'Please verify your email address before logging in. Check your email inbox for the verification link.',
      });
      return;
    }

    // Check password
    const isMatch = await bcrypt.compare(cleanPassword, user.password);
    if (!isMatch) {
      res.status(400).json({ error: 'Invalid credentials' });
      return;
    }

    // Generate token
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({
      message: 'Logged in successfully',
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        status: user.status,
        emailVerified: user.emailVerified,
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    const cleanEmail = (email || '').trim().toLowerCase();
    if (!cleanEmail) {
      res.status(400).json({ error: 'Email address is required' });
      return;
    }

    const user = await prisma.user.findFirst({
      where: { email: { equals: cleanEmail, mode: 'insensitive' } },
    });

    if (!user) {
      res.status(200).json({ message: 'If an account exists with this email, a password reset link has been sent.' });
      return;
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 30 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: token,
        resetTokenExpires: expires,
      },
    });

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetLink = `${frontendUrl}/#reset-password?token=${token}`;

    await sendPasswordResetEmail(user.email, resetLink);

    res.status(200).json({ message: 'Password reset link sent to your email.' });
  } catch (error) {
    console.error('forgotPassword error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token, newPassword } = req.body;
    const cleanToken = (token || '').trim();
    const cleanPassword = (newPassword || '').trim();

    if (!cleanToken || !cleanPassword) {
      res.status(400).json({ error: 'Token and new password are required' });
      return;
    }

    const user = await prisma.user.findFirst({
      where: {
        resetToken: cleanToken,
        resetTokenExpires: { gte: new Date() },
      },
    });

    if (!user) {
      res.status(400).json({ error: 'Invalid or expired password reset link' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(cleanPassword, salt);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: passwordHash,
        resetToken: null,
        resetTokenExpires: null,
      },
    });

    console.log(`[resetPassword] Successfully updated password for user: ${user.email}`);

    res.status(200).json({ message: 'Password updated successfully. You can now log in.' });
  } catch (error) {
    console.error('resetPassword error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
