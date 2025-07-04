import z from "zod/v4";

export const paginationSchema = z.object({
    page: z.coerce.number({ error: "Field 'page' must be a number" })
        .gte(1, { message: "Field 'page' must be at least 1." })
        .optional()
        .default(1),
    size: z.coerce.number({ error: "Field 'size' must be a number" })
        .gte(1, { message: "Field 'size' must be at least 1." })
        .lte(200, { message: "Field 'size' cannot be greater than 200." })
        .optional()
        .default(50),
    desc: z.coerce.boolean({ error: "Field 'desc' must be a boolean" }).default(false),
});

export type Pagination = z.infer<typeof paginationSchema>;