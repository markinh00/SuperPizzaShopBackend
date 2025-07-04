import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';

export default function errorHandler(
    error: FastifyError,
    request: FastifyRequest,
    reply: FastifyReply
) {
    if (error.validation) {
        reply.status(400).send({
            statusCode: 400,
            error: 'Bad Request',
            message: error.validation.map(e => `${e.message}`).join('; '),
            code: "APP_BAD_REQUEST",
        });
    } else {
        reply.send(error);
    }
}