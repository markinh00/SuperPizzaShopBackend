import { FastifyReply, FastifyRequest } from "fastify";
import { CreateCustomer } from "../schemas/customers.schema";
import { createCustomer } from "../services/customers.service";
import { FastifyTypedInstance } from "../types/fastifyTypedInstance";
import { NotFoundError } from "../utils/errors";
import { authenticateUser, getCurrentUser } from "../utils/auth";
import { RequestUser, UserRole } from "../schemas/users.schema";
import { LoginInput } from "../schemas/auth.schema";

export function registerHandler(server: FastifyTypedInstance) {
    return async function (
        request: FastifyRequest<{ Body: CreateCustomer }>,
        reply: FastifyReply
    ) {
        const customerData = request.body;

        const newUser = await createCustomer(customerData);

        const token = server.jwt.sign(
            { id: newUser.id, email: newUser.email, role: UserRole.CUSTOMER },
            { expiresIn: process.env.EXPIRES_IN_SECONDS || "24h" }
        );

        return reply.code(201).send({ token, type: "Bearer" });
    }
}

export function loginHandler(server: FastifyTypedInstance) {
    return async function (
        request: FastifyRequest<{ Body: LoginInput }>,
        reply: FastifyReply
    ) {
        const { email, password } = request.body;
        try {
            const user = await authenticateUser(email, password);

            if (!user) {
                throw new NotFoundError(`Incorrect email or password`);
            }

            const token = server.jwt.sign(
                { id: user.data.id, email: user.data.email, role: user.role },
                { expiresIn: process.env.EXPIRES_IN_SECONDS || "24h" }
            )

            return reply.code(200).send({ token, type: "Bearer" });
        } catch (error) {
            throw error
        }
    }
}

export async function getCurrentUserHandler(
    request: FastifyRequest,
    reply: FastifyReply
) {
    const { id } = request.user as RequestUser
    try {
        const user = await getCurrentUser(id)

        if (!user) {
            throw new NotFoundError(`User with ID ${id}`)
        }

        return reply.code(200).send(user);
    } catch (error) {
        throw error
    }
}
