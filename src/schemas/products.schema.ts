import { z } from "zod/v4";

export const createProductSchema = z.object({
    name: z
        .string({
            error: (issue) => issue.input === undefined
                ? "Field 'name' is required"
                : "Field 'name' must be a string",
        }),
    description: z
        .string({
            error: (issue) => issue.input === undefined
                ? "Field 'description' is required"
                : "Field 'description' must be a string",
        }),
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
    description: z.string(),
    priceInCents: z.int(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export type ProducResponse = z.infer<typeof productResponseSchema>;

export const productQuerySchema = z.object({
    page: z.coerce.number({ error: "Field 'page' must be a number" })
        .gte(1, { message: "Field 'page' must be at least 1." })
        .optional()
        .default(1),
    size: z.coerce.number({ error: "Field 'size' must be a number" })
        .gte(1, { message: "Field 'size' must be at least 1." })
        .lte(200, { message: "Field 'size' cannot be greater than 200." })
        .optional()
        .default(50),
});

export type ProductQuery = z.infer<typeof productQuerySchema>;

export const productParamsSchema = z.object({
    productId: z.string().uuid({ message: "Product ID must be a valid UUID" }),
});

export type ProductParams = z.infer<typeof productParamsSchema>;

export const updateProductSchema = z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    priceInCents: z.int().nonnegative().optional(),
});

export type UpdateProduct = z.infer<typeof updateProductSchema>;