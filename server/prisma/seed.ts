
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';



const prisma = new PrismaClient({} as any);

async function main() {
    // Create Roles
    const managerRole = await prisma.role.upsert({
        where: { name: 'MANAGER' },
        update: {},
        create: { name: 'MANAGER' },
    });

    const storeKeeperRole = await prisma.role.upsert({
        where: { name: 'STORE_KEEPER' },
        update: {},
        create: { name: 'STORE_KEEPER' },
    });

    console.log({ managerRole, storeKeeperRole });

    // Create Admin User
    const passwordHash = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@example.com' },
        update: {},
        create: {
            email: 'admin@example.com',
            passwordHash,
            roleId: managerRole.id,
        },
    });

    console.log({ admin });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
