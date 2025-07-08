import "@fastify/jwt";
import { FastifyBaseLogger, RawReplyDefaultExpression, RawRequestDefaultExpression, RawServerDefault } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { UserRole } from "../schemas/users.schema";

declare module "fastify" {
    interface FastifyInstance<
        RawServer extends RawServerDefault = RawServerDefault,
        RawRequest extends RawRequestDefaultExpression<RawServer> = RawRequestDefaultExpression<RawServer>,
        RawReply extends RawReplyDefaultExpression<RawServer> = RawReplyDefaultExpression<RawServer>,
        Logger extends FastifyBaseLogger = FastifyBaseLogger,
        TypeProvider extends ZodTypeProvider = ZodTypeProvider,
    > {
        authorizedRoles: (roles: UserRole[]) => any;
    }

    interface FastifyRequest {
        user: {
            id: string
            email: string;
            role: UserRole;
        };
    }
}
