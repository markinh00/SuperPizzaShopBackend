import { Admin, Customer } from "@prisma/client"
import { z } from "zod/v4"
import { adminResponseSchema } from "./admins.schema"
import { customerResponseSchema } from "./customers.schema"

export enum UserRole {
    ADMIN = "admin",
    CUSTOMER = "customer"
};

export const userResponseSchema = z.object({
    data: z.union([adminResponseSchema, customerResponseSchema]),
    role: z.enum(["admin", "customer"])
});

export type User = {
    data: Customer | Admin
    role: UserRole
}

export type RequestUser = {
    id: string,
    email: string,
    role: UserRole
}
