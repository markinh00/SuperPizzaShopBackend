import { z } from "zod/v4";
import {
    createProductHandler,
    deleteProductHandler,
    getAllProductsHandler,
    getProductByIdHandler,
    updateProductHandler
} from "../controllers/product.controller";
import {
    createProductSchema,
    productParamsSchema,
    productQuerySchema,
    productResponseSchema,
    updateProductSchema
} from "../schemas/products.schema";
import { FastifyTypedInstance } from "../types/fastifyTypedInstance";
import { UserRole } from "../schemas/users.schema";

export async function productsRoutes(server: FastifyTypedInstance) {
    server.post(
        "/",
        {
            preValidation: [server.authorizedRoles([UserRole.ADMIN])],
            schema: {
                tags: ["Products"],
                summary: "Create a product",
                body: createProductSchema,
                response: {
                    201: productResponseSchema,
                }
            },
        },
        createProductHandler
    );

    server.get(
        "/",
        {
            preValidation: [server.authorizedRoles([UserRole.ADMIN, UserRole.CUSTOMER])],
            schema: {
                tags: ["Products"],
                summary: "Get many products",
                querystring: productQuerySchema,
                response: {
                    200: z.array(productResponseSchema),
                }
            }
        },
        getAllProductsHandler
    );

    server.get(
        "/:productId",
        {
            schema: {
                preValidation: [server.authorizedRoles([UserRole.ADMIN, UserRole.CUSTOMER])],
                tags: ["Products"],
                summary: "Get a product",
                params: productParamsSchema,
                response: {
                    200: productResponseSchema,
                }
            }
        },
        getProductByIdHandler
    );

    server.put(
        "/:productId",
        {
            schema: {
                preValidation: [server.authorizedRoles([UserRole.ADMIN])],
                tags: ["Products"],
                summary: "Update a product",
                params: productParamsSchema,
                body: updateProductSchema,
                response: {
                    200: productResponseSchema,
                }
            }
        },
        updateProductHandler
    );

    server.delete(
        "/:productId",
        {
            schema: {
                preValidation: [server.authorizedRoles([UserRole.ADMIN])],
                tags: ["Products"],
                summary: "Delete a product",
                params: productParamsSchema,
                response: {
                    200: productResponseSchema,
                }
            }
        },
        deleteProductHandler
    );
}