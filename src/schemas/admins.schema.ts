import z from "zod/v4";

export const createAdminSchema = z.object({
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
});

export type CreateAdmin = z.infer<typeof createAdminSchema>;

export const adminResponseSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
});
