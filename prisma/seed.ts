import { PrismaClient, user_role } from '@prisma/client';
import { passwordEncryption } from '../src/utils';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.users.upsert({
    where: { email: 'admiuser@test.com' },
    update: {},
    create: {
      email: 'admiuser@test.com',
      name: 'Admin User',
      password: await passwordEncryption('admin'),
      role: user_role.ADMIN,
    },
  });

  console.log({ user });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
