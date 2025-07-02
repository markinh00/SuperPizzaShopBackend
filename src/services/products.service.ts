import { Prisma } from "@prisma/client";
import { CreateProduct, ProductQuery, UpdateProduct } from "../schemas/products.schema";
import prisma from "../utils/prisma";

export async function createProduct(input: CreateProduct) {
    const product = prisma.product.create({
        data: input,
    });

    return product;
}

export async function getAllProducts(query: ProductQuery) {
    const { page, size } = query;

    const products = await prisma.product.findMany({
        skip: (page - 1) * size,
        take: size,
    });

    return products;
}

export async function getProductById(productId: string) {
    const product = prisma.product.findUnique({
        where: { id: productId }
    })

    return product;
}

export async function updateProduct(productId: string, productUpdateData: UpdateProduct) {
    const cleanedData = Object.fromEntries(
        Object.entries(productUpdateData).filter(([_, value]) => value !== undefined)
    );

    try {
        const updatedProduct = await prisma.product.update({
            where: { id: productId },
            data: cleanedData,
        });
        return updatedProduct;
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2025") {
                return undefined
            }
        } else {
            throw error
        }
    }
}

export async function deleteProduct(productId: string) {
    try {
        const deletedProduct = await prisma.product.delete({
            where: { id: productId }
        });

        return deletedProduct;
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2025") {
                return undefined
            }
        } else {
            throw error
        }
    }
}