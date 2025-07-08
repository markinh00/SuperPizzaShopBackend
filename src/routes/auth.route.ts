import { getCurrentUserHandler, loginHandler, registerHandler } from "../controllers/auth.controller";
import { LoginInputSchema, TokenSchema } from "../schemas/auth.schema";
import { createCustomerSchema, customerResponseSchema } from "../schemas/customers.schema";
import { userResponseSchema, UserRole } from "../schemas/users.schema";
import { FastifyTypedInstance } from "../types/fastifyTypedInstance";

export async function authRoutes(server: FastifyTypedInstance) {
    server.post(
        "/register",
        {
            schema: {
                tags: ["Auth"],
                summary: "Register a user",
                body: createCustomerSchema,
                response: {
                    200: TokenSchema
                }
            }
        },
        registerHandler(server)
    );

    server.post(
        "/login",
        {
            schema: {
                tags: ["Auth"],
                summary: "Login a user",
                body: LoginInputSchema,
                response: {
                    200: TokenSchema
                }
            }
        },
        loginHandler(server)
    );

    server.get(
        "/me",
        {
            preValidation: [server.authorizedRoles([UserRole.ADMIN, UserRole.CUSTOMER])],
            schema: {
                tags: ["Auth"],
                summary: "Get current user",
                response: {
                    200: userResponseSchema
                }
            }
        },
        getCurrentUserHandler
    )
}