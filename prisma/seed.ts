import { PrismaClient } from '@prisma/client'
import { getHashedPassword } from '../src/utils/hash'

const prisma = new PrismaClient()

const adminData = {
    name: process.env.ADMIN_NAME || "admin",
    email: process.env.ADMIN_EMAIL || "admin@example.com",
    password: process.env.ADMIN_PASSWORD || "123456",
}

async function main() {
    const hash = await getHashedPassword(adminData.password);

    const admin = await prisma.admin.upsert({
        where: { email: "admin@example.com" },
        update: {},
        create: {
            name: adminData.name,
            email: adminData.email,
            password: hash
        }
    });

    console.log(`Admin with email ${admin.email} create successfully!`)
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    });