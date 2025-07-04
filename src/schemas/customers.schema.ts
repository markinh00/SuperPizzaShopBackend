import { z } from "zod/v4";
import { paginationSchema } from "./pagination.schema";

export const createCustomerSchema = z.object({
    name: z
        .string({
            error: (issue) => issue.input === undefined
                ? "Field 'name' is required"
                : "Field 'name' must be a string",
        }),
    email: z
        .email({
            error: (issue) => issue.input === undefined
                ? "Field 'email' is required"
                : "Field 'email' must be a string",
        }),
    password: z
        .string({
            error: (issue) => issue.input === undefined
                ? "Field 'password' is required"
                : "Field 'password' must be a string",
        }),
    phone: z
        .string({
            error: (issue) => issue.input === undefined
                ? "Field 'phone' is required"
                : "Field 'phone' must be a string",
        }),
});

export type CreateCustomer = z.infer<typeof createCustomerSchema>;

export const customerResponseSchema = z.object({
    id: z.uuidv4(),
    name: z.string(),
    email: z.email(),
    phone: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export type CustomerResponse = z.infer<typeof customerResponseSchema>

const enumValues = Object.keys(customerResponseSchema.shape);
export const customerQuerySchema = paginationSchema.extend({
    orderBy: z.enum(enumValues).optional().default(enumValues[0]),
});

export type CustomerQuery = z.infer<typeof customerQuerySchema>;

export const customerParamsSchema = z.object({
    customerId: z.uuidv4({ message: "Customer ID must be a valid UUID" }),
});

export type CustomerParams = z.infer<typeof customerParamsSchema>;

export const updateCustomerSchema = z.object({
    name: z.string().optional(),
    email: z.email().optional(),
    phone: z.string().optional(),
});

export type UpdateCustomer = z.infer<typeof updateCustomerSchema>;