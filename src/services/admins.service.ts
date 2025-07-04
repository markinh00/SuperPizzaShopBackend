import { Prisma } from "@prisma/client";
import { CreateAdmin } from "../schemas/admins.schema";
import { getHashedPassword } from "../utils/hash";
import prisma from "../utils/prisma";
import { ConflictError, InternalServerError, NotFoundError } from "../utils/errors";

export async function createAdmin(input: CreateAdmin) {
    try {
        const hash = await getHashedPassword(input.password);

        const newCustomer = await prisma.admin.create({
            data: { ...input, password: hash }
        });

        return newCustomer;
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2002") {
                throw new ConflictError(`Email ${input.email} already exists`)
            }
        } else {
            throw new InternalServerError(error)
        }
    }
}

export async function getAdminById(adminId: string) {
    try {
        const admin = prisma.admin.findUnique({
            where: { id: adminId }
        })

        return admin;
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2025") {
                throw new NotFoundError(`Admin with ID ${adminId}`)
            }
        } else {
            throw new InternalServerError(error)
        }
    }
}