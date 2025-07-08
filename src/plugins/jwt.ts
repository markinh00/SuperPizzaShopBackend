import fp from "fastify-plugin";
import { FastifyInstance, FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";
import { RequestUser, UserRole } from "../schemas/users.schema";
import { UnauthorizedError } from "../utils/errors";
import { getCurrentUser } from "../utils/auth";

const jwtPlugin: FastifyPluginAsync = fp(async (fastify: FastifyInstance) => {
    fastify.register(require("@fastify/jwt"), {
        secret: process.env.SECRET || "supersecret",
    });

    fastify.decorate("authorizedRoles", function (roles: UserRole[]) {
        return async function (request: FastifyRequest, reply: FastifyReply) {
            try {
                const authHeader = request.headers['authorization'];

                if (!authHeader) {
                    throw new UnauthorizedError("Authorization header is missing");
                }

                const token = authHeader.slice(7);
                const payload = fastify.jwt.verify<RequestUser>(token);

                if (!payload) {
                    throw new UnauthorizedError("Invalid Token")
                }

                const { id, role } = payload;
                const user = await getCurrentUser(id);

                if (!user) {
                    throw new UnauthorizedError("Could not validate credentials")
                }

                if (!roles.includes(role) || role !== user.role) {
                    throw new UnauthorizedError("Access denied");
                }

                request.user = payload;
            } catch (err) {
                reply.send(err);
            }
        };
    });
});

export default jwtPlugin;
