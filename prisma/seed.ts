import { PrismaClient } from '@prisma/client'
import { getHashedPassword } from '../src/utils/hash'

const prisma = new PrismaClient()

const adminData = {
    name: process.env.ADMIN_NAME || "admin",
    email: process.env.ADMIN_EMAIL || "admin@example.com",
    password: process.env.ADMIN_PASSWORD || "123456",
}

async function main() {
    const existingAdmin = await prisma.admin.findFirst({ where: { email: adminData.email } });

    if (existingAdmin) {
        console.log(`Admin with email ${adminData.email} already exists!`)
        return
    }

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

    console.log(`Admin with email ${admin.email} create successfully!`);

    const pizzas = [
        {
            name: "Margherita (Small)",
            description: "Classic Margherita pizza with fresh tomatoes, mozzarella, and basil.",
            category: "Pizza",
            priceInCents: 800,
        },
        {
            name: "Margherita (Medium)",
            description: "Classic Margherita pizza with fresh tomatoes, mozzarella, and basil.",
            category: "Pizza",
            priceInCents: 1200,
        },
        {
            name: "Margherita (Large)",
            description: "Classic Margherita pizza with fresh tomatoes, mozzarella, and basil.",
            category: "Pizza",
            priceInCents: 1600,
        },
        {
            name: "Pepperoni (Small)",
            description: "Delicious Pepperoni pizza with mozzarella and spicy pepperoni slices.",
            category: "Pizza",
            priceInCents: 900,
        },
        {
            name: "Pepperoni (Medium)",
            description: "Delicious Pepperoni pizza with mozzarella and spicy pepperoni slices.",
            category: "Pizza",
            priceInCents: 1400,
        },
        {
            name: "Pepperoni (Large)",
            description: "Delicious Pepperoni pizza with mozzarella and spicy pepperoni slices.",
            category: "Pizza",
            priceInCents: 1800,
        },
        {
            name: "Veggie (Small)",
            description: "Healthy Veggie pizza loaded with mushrooms, bell peppers, and olives.",
            category: "Pizza",
            priceInCents: 850,
        },
        {
            name: "Veggie (Medium)",
            description: "Healthy Veggie pizza loaded with mushrooms, bell peppers, and olives.",
            category: "Pizza",
            priceInCents: 1300,
        },
        {
            name: "Veggie (Large)",
            description: "Healthy Veggie pizza loaded with mushrooms, bell peppers, and olives.",
            category: "Pizza",
            priceInCents: 1700,
        },
    ];


    const drinks = [
        {
            name: "Coke",
            description: "Refreshing Coca-Cola 350ml can.",
            category: "Drink",
            priceInCents: 300,
        },
        {
            name: "Orange Juice",
            description: "Freshly squeezed orange juice 300ml.",
            category: "Drink",
            priceInCents: 400,
        },
        {
            name: "Sparkling Water",
            description: "Sparkling mineral water 500ml bottle.",
            category: "Drink",
            priceInCents: 250,
        },
    ];

    const products = [...pizzas, ...drinks];

    for (const product of products) {
        const exists = await prisma.product.findFirst({
            where: { name: product.name },
        });

        if (!exists) {
            await prisma.product.create({ data: product });
            console.log(`Created: ${product.name}`);
        } else {
            console.log(`Skipped (already exists): ${product.name}`);
        }
    }

    console.log("Seed completed!");
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