import { z } from "zod/v4";
import { paginationSchema } from "./pagination.schema";

export const createProductSchema = z.object({
    name: z
        .string({
            error: (issue) => issue.input === undefined
                ? "Field 'name' is required"
                : "Field 'name' must be a string",
        }),
    description: z
        .string()
        .optional(),
    category: z
        .string()
        .optional(),
    priceInCents: z
        .number({
            error: (issue) => issue.input === undefined
                ? "Field 'priceInCents' is required"
                : "Field 'priceInCents' must be a integer",
        })
        .int("Field 'priceInCents' must be an integer (no decimal values allowed)")
        .nonnegative("Field 'priceInCents' must be zero or positive"),
})

export type CreateProduct = z.infer<typeof createProductSchema>;

export const productResponseSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().nullable(),
    category: z.string().nullable(),
    priceInCents: z.int(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export type ProducResponse = z.infer<typeof productResponseSchema>;

const enumValues = Object.keys(productResponseSchema.shape);
export const productQuerySchema = paginationSchema.extend({
    orderBy: z.enum(enumValues).optional().default(enumValues[3]),
});

export type ProductQuery = z.infer<typeof productQuerySchema>;

export const productParamsSchema = z.object({
    productId: z.uuidv4({ message: "Product ID must be a valid UUID" }),
});

export type ProductParams = z.infer<typeof productParamsSchema>;

export const updateProductSchema = z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    category: z.string().optional(),
    priceInCents: z.int().nonnegative().optional(),
});

export type UpdateProduct = z.infer<typeof updateProductSchema>;