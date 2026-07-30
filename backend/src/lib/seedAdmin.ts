import bcrypt from 'bcryptjs';
import prisma from './prisma';

/**
 * Seeds the default Admin account if not present:
 * Email: admin@agrimove.com
 * Password: 1234567890
 * Full Name: admin
 * Role: ADMIN
 */
export async function seedAdmin(): Promise<void> {
  try {
    const adminEmail = 'admin@agrimove.com';
    const existing = await prisma.user.findUnique({ where: { email: adminEmail } });

    if (!existing) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash('1234567890', salt);

      await prisma.user.create({
        data: {
          fullName: 'admin',
          email: adminEmail,
          password: passwordHash,
          role: 'ADMIN',
          phone: '+250 788 000 000',
          region: 'Kigali, Rwanda',
          status: 'Active',
        },
      });

      console.log('✅ Default Admin account created: admin@agrimove.com');
    }
  } catch (err) {
    console.error('Error seeding default admin user:', err);
  }
}
