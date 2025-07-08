import { z } from "zod/v4";

export const LoginInputSchema = z.object({
    email: z
        .email({
            error: (issue) => issue.input === undefined
                ? "Field 'email' is required"
                : "Field 'email' must be a string"
        }),
    password: z
        .string({
            error: (issue) => issue.input === undefined
                ? "Field 'password' is required"
                : "Field 'password' must be a string",
        }),
});

export type LoginInput = z.infer<typeof LoginInputSchema>;

export const TokenSchema = z.object({
    token: z.string(),
    type: z.string()
});

export type Token = z.infer<typeof TokenSchema>;