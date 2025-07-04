import { FastifyReply, FastifyRequest } from "fastify";
import { CreateCustomer } from "../../schemas/customers.schema";
import { InternalServerError } from "../../utils/errors";

export async function registerHandler(
    request: FastifyRequest<{ Body: CreateCustomer }>,
    reply: FastifyReply
) {
    const customerData = request.body;

    try {
        
    } catch (error) {
        console.log(error);
        throw new InternalServerError(error);
    }
}