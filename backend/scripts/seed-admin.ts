import bcrypt from 'bcryptjs';
import prisma from '../src/lib/prisma';

async function main() {
  const email = 'admin@agrimove.com';
  const password = 'adminpassword123';
  const fullName = 'System Administrator';

  const existingAdmin = await prisma.user.findUnique({ where: { email } });
  
  if (existingAdmin) {
    console.log('Admin user already exists.');
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const admin = await prisma.user.create({
    data: {
      fullName,
      email,
      password: passwordHash,
      role: 'ADMIN',
    },
  });

  console.log(`Admin user created successfully!`);
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
