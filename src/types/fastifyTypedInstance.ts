import { FastifyBaseLogger, FastifyInstance, FastifyRequest, RawReplyDefaultExpression, RawRequestDefaultExpression, RawServerDefault } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { UserRole } from "../schemas/users.schema";

export type FastifyTypedInstance = FastifyInstance<
    RawServerDefault,
    RawRequestDefaultExpression,
    RawReplyDefaultExpression,
    FastifyBaseLogger,
    ZodTypeProvider
> & {
    authorizedRoles: (roles: UserRole[]) => any;
}

export type FastifyTypedRequest = FastifyRequest & {
    user: {
        id: string
        email: string;
        role: UserRole;
    };
}