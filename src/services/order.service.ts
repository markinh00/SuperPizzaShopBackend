import { CreateOrder, OrderQuery, UpdateOrder } from "../schemas/order.schema";
import { InternalServerError, NotFoundError } from "../utils/errors";
import { getCustomerById } from "./customers.service";
import { getManyById } from "./products.service";
import prisma from "../utils/prisma";
import { Prisma } from "@prisma/client";

export async function createOrder(input: CreateOrder) {
    const customer = await getCustomerById(input.customerId);

    if (!customer) {
        throw new NotFoundError(`Customer with ID ${input.customerId}`)
    }

    const products = await getManyById(input.products.map(p => p.productId));

    const productsInOrder = input.products.map((item) => {
        const product = products.find((p) => p.id === item.productId);
        if (!product) {
            throw new NotFoundError(`Product with ID ${item.productId}`);
        }

        return {
            name: product.name,
            description: product.description,
            category: product.category,
            priceInCents: product.priceInCents,
            quantity: item.quantity,
            product: {
                connect: { id: product.id },
            },
        };
    });

    const totalPriceInCents = productsInOrder.reduce((sum, p) => {
        return sum + p.priceInCents * p.quantity;
    }, 0);


    const newOrder = prisma.order.create({
        data: {
            totalPriceInCents: Math.floor(totalPriceInCents),
            address: input.address,
            customer: {
                connect: { id: customer.id }
            },
            productsInOrder: {
                create: productsInOrder
            }
        },
        include: {
            productsInOrder: true,
        },
    });

    return newOrder;
}

export async function getAllOrders(query: OrderQuery) {
    const { page, size } = query;

    const orders = await prisma.order.findMany({
        skip: (page - 1) * size,
        take: size,
        orderBy: {
            [query.orderBy]: query.desc ? "desc" : "asc"
        },
        include: { productsInOrder: true }
    });

    return orders;
}

export async function getOrderById(orderId: string) {
    const order = prisma.order.findUnique({
        where: { id: orderId },
        include: { productsInOrder: true }
    })

    return order;
}

export async function addProductsToOrder(
    orderId: string,
    products: { productId: string; quantity: number }[]
) {
    const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { productsInOrder: true },
    });

    if (!order) {
        throw new NotFoundError(`Order with ID ${orderId}`);
    }

    const productsFound = await getManyById(products.map((p) => p.productId));

    let totalPriceInCents = 0;

    for (const item of products) {
        const product = productsFound.find((p) => p.id === item.productId);
        if (!product) {
            throw new NotFoundError(`Product with ID ${item.productId}`);
        }

        const existingProductInOrder = order.productsInOrder.find(
            (p) => p.productId === item.productId
        );

        if (existingProductInOrder) {
            await prisma.productInOrder.update({
                where: { id: existingProductInOrder.id },
                data: {
                    quantity: existingProductInOrder.quantity + item.quantity,
                },
            });
        } else {
            await prisma.productInOrder.create({
                data: {
                    name: product.name,
                    description: product.description,
                    category: product.category,
                    priceInCents: product.priceInCents,
                    quantity: item.quantity,
                    order: { connect: { id: orderId } },
                    product: { connect: { id: product.id } },
                },
            });
        }
    }

    const updatedProductsInOrder = await prisma.productInOrder.findMany({
        where: { orderId },
    });

    totalPriceInCents = updatedProductsInOrder.reduce(
        (sum, p) => sum + p.priceInCents * p.quantity,
        0
    );

    const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: { totalPriceInCents: Math.floor(totalPriceInCents) },
        include: { productsInOrder: true },
    });

    return updatedOrder;
}

export async function removeProductsFromOrder(
    orderId: string,
    products: { productId: string; quantity: number }[]
) {
    const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { productsInOrder: true },
    });

    if (!order) {
        throw new NotFoundError(`Order with ID ${orderId}`);
    }

    for (const item of products) {
        const existingProductInOrder = order.productsInOrder.find(
            (p) => p.productId === item.productId
        );

        if (!existingProductInOrder) {
            throw new NotFoundError(
                `Product with ID ${item.productId} is not in order ${orderId}`
            );
        }

        if (item.quantity >= existingProductInOrder.quantity) {
            await prisma.productInOrder.delete({
                where: { id: existingProductInOrder.id },
            });
        } else {
            await prisma.productInOrder.update({
                where: { id: existingProductInOrder.id },
                data: {
                    quantity: existingProductInOrder.quantity - item.quantity,
                },
            });
        }
    }

    const updatedProductsInOrder = await prisma.productInOrder.findMany({
        where: { orderId },
    });

    const newTotal = updatedProductsInOrder.reduce(
        (sum, p) => sum + p.priceInCents * p.quantity,
        0
    );

    const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: { totalPriceInCents: Math.floor(newTotal) },
        include: { productsInOrder: true },
    });

    return updatedOrder;
}

export async function updateOrder(orderId: string, updateData: UpdateOrder) {
    const cleanedData = Object.fromEntries(
        Object.entries(updateData).filter(([_, value]) => value !== undefined)
    );

    try {
        const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: cleanedData,
            include: { productsInOrder: true }
        });
        return updatedOrder;
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2025") {
                throw new NotFoundError(`Order with ID ${orderId}`)
            }
            throw InternalServerError(error)
        }
        throw InternalServerError(error)
    }
}

export async function deleteOrder(orderId: string) {
    try {
        const deletedOrder = await prisma.order.delete({
            where: { id: orderId },
            include: { productsInOrder: true },
        });

        return deletedOrder;
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2025") {
                throw new NotFoundError(`Order with ID ${orderId}`)
            }
            throw InternalServerError(error)
        }
        throw InternalServerError(error)
    }
}