import createError from '@fastify/error';


export const NotFoundError = createError(
    'APP_NOT_FOUND',
    'Resource not found: %s',
    404
);

export const ConflictError = createError(
    'APP_CONFLICT',
    'Conflict: %s',
    409
);

export const InternalServerError = createError(
    'APP_INTERNAL_SERVER_ERROR',
    'An unexpected error occurred: %s',
    500
);
