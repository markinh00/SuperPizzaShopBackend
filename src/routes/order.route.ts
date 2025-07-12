import { z } from "zod/v4";
import { addProductsToOrderHandler, createOrderHandler, deleteOrderHandler, getAllOrdersHandler, getOrderByIdHandler, removeProductsFromOrderHandler, updateOrderHandler } from "../controllers/order.controller";
import { createOrderSchema, orderParamsSchema, orderQuerySchema, orderResponseSchema, productListSchema, updateOrderSchema } from "../schemas/order.schema";
import { FastifyTypedInstance } from "../types/fastifyTypedInstance";
import { UserRole } from "../schemas/users.schema";

export function ordersRoutes(server: FastifyTypedInstance) {
    server.post(
        "/",
        {
            preValidation: [server.authorizedRoles([UserRole.ADMIN, UserRole.CUSTOMER])],
            schema: {
                tags: ['Orders'],
                summary: 'Create a order',
                body: createOrderSchema,
                response: {
                    200: orderResponseSchema
                }
            }
        },
        createOrderHandler
    );

    server.get(
        "/",
        {
            preValidation: [server.authorizedRoles([UserRole.ADMIN])],
            schema: {
                tags: ['Orders'],
                summary: 'Get many orders',
                querystring: orderQuerySchema,
                response: {
                    200: z.array(orderResponseSchema),
                }
            }
        },
        getAllOrdersHandler
    );

    server.get(
        "/:orderId",
        {
            preValidation: [server.authorizedRoles([UserRole.ADMIN, UserRole.CUSTOMER])],
            schema: {
                tags: ['Orders'],
                summary: 'Get a order',
                params: orderParamsSchema,
                response: {
                    200: orderResponseSchema,
                }
            }
        },
        getOrderByIdHandler,
    );

    server.put(
        "/add/:orderId",
        {
            preValidation: [server.authorizedRoles([UserRole.ADMIN])],
            schema: {
                tags: ['Orders'],
                summary: 'Add products to a order',
                params: orderParamsSchema,
                body: productListSchema,
                response: {
                    200: orderResponseSchema,
                }
            }
        },
        addProductsToOrderHandler,
    );

    server.put(
        "/remove/:orderId",
        {
            preValidation: [server.authorizedRoles([UserRole.ADMIN])],
            schema: {
                tags: ['Orders'],
                summary: 'Remove products from a order',
                params: orderParamsSchema,
                body: productListSchema,
                response: {
                    200: orderResponseSchema,
                }
            }
        },
        removeProductsFromOrderHandler,
    );

    server.put(
        "/:orderId",
        {
            preValidation: [server.authorizedRoles([UserRole.ADMIN, UserRole.CUSTOMER])],
            schema: {
                tags: ['Orders'],
                summary: 'Update a order',
                params: orderParamsSchema,
                body: updateOrderSchema,
                response: {
                    200: orderResponseSchema,
                }
            }
        },
        updateOrderHandler,
    );

    server.delete(
        "/:orderId",
        {
            preValidation: [server.authorizedRoles([UserRole.ADMIN, UserRole.CUSTOMER])],
            schema: {
                tags: ['Orders'],
                summary: 'Delete a order',
                params: orderParamsSchema,
                response: {
                    200: orderResponseSchema,
                }
            }
        },
        deleteOrderHandler,
    );
}