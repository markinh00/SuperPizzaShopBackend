import { Prisma } from "@prisma/client";
import { CreateCustomer, CustomerQuery, UpdateCustomer } from "../schemas/customers.schema";
import { getHashedPassword } from "../utils/hash";
import prisma from "../utils/prisma";
import { ConflictError, InternalServerError, NotFoundError } from "../utils/errors";

export async function createCustomer(input: CreateCustomer) {
    try {
        const hash = await getHashedPassword(input.password);

        const newCustomer = await prisma.customer.create({
            data: { ...input, password: hash }
        });

        return newCustomer;
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2002") {
                throw new ConflictError(`Email ${input.email} already exists`);
            }
            throw new InternalServerError(error);
        }
        throw new InternalServerError(error);
    }
}

export async function getAllCustomers(query: CustomerQuery) {
    const { page, size } = query;

    const customers = await prisma.customer.findMany({
        skip: (page - 1) * size,
        take: size,
        orderBy: {
            [query.orderBy]: query.desc ? "desc" : "asc"
        }
    });

    return customers;
}

export async function getCustomerById(customerId: string) {
    try {
        const customer = await prisma.customer.findUnique({
            where: { id: customerId }
        })

        return customer;
    } catch (error) {
        throw new InternalServerError(error)
    }
}

export async function getCustomerByEmail(customerEmail: string) {
    try {
        const customer = await prisma.customer.findUnique({
            where: { email: customerEmail }
        })

        return customer;
    } catch (error) {
        throw new InternalServerError(error)
    }
}

export async function updateCustomer(customerId: string, updateData: UpdateCustomer) {
    const cleanedData = Object.fromEntries(
        Object.entries(updateData).filter(([_, value]) => value !== undefined)
    );

    try {
        const updatedCustomer = await prisma.customer.update({
            where: { id: customerId },
            data: cleanedData,
        });
        return updatedCustomer;
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2025") {
                throw new NotFoundError(`Customer with ID ${customerId}`)
            }
            if (error.code === "P2002") {
                throw new ConflictError(`Email ${updateData.email} already exists`)
            }
            throw new InternalServerError(error)
        }
        throw new InternalServerError(error)
    }
}

export async function deleteCustomer(customerId: string) {
    try {
        const deletedCustomer = await prisma.customer.delete({
            where: { id: customerId }
        });

        return deletedCustomer;
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2025") {
                throw new NotFoundError(`Customer with ID ${customerId}`)
            }
            throw InternalServerError(error)
        }
        throw InternalServerError(error)
    }
}