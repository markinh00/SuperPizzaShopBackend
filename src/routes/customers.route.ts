import z from "zod/v4";
import { deleteCustomerHandler, getAllCustomersHandler, getCustomerByIdHandler, updateCustomerHandler } from "../controllers/customers.controller";
import { customerParamsSchema, customerQuerySchema, customerResponseSchema, updateCustomerSchema } from "../schemas/customers.schema";
import { FastifyTypedInstance } from "../types/fastifyTypedInstance";
import { UserRole } from "../schemas/users.schema";

export async function customersRoutes(server: FastifyTypedInstance) {
    server.get(
        "/",
        {
            preValidation: [server.authorizedRoles([UserRole.ADMIN])],
            schema: {
                tags: ["Customers"],
                summary: "Get many customers",
                querystring: customerQuerySchema,
                response: {
                    200: z.array(customerResponseSchema),
                }
            }
        },
        getAllCustomersHandler
    );

    server.get(
        "/:customerId",
        {
            preValidation: [server.authorizedRoles([UserRole.ADMIN, UserRole.CUSTOMER])],
            schema: {
                tags: ["Customers"],
                summary: "Get a customer",
                params: customerParamsSchema,
                response: {
                    200: customerResponseSchema,
                }
            }
        },
        getCustomerByIdHandler
    );

    server.put(
        "/:customerId",
        {
            preValidation: [server.authorizedRoles([UserRole.ADMIN, UserRole.CUSTOMER])],
            schema: {
                tags: ["Customers"],
                summary: "Update a customer",
                params: customerParamsSchema,
                body: updateCustomerSchema,
                response: {
                    200: customerResponseSchema,
                }
            }
        },
        updateCustomerHandler
    );

    server.delete(
        "/:customerId",
        {
            preValidation: [server.authorizedRoles([UserRole.ADMIN, UserRole.CUSTOMER])],
            schema: {
                tags: ["Customers"],
                summary: "Delete a customer",
                params: customerParamsSchema,
                response: {
                    200: customerResponseSchema,
                }
            }
        },
        deleteCustomerHandler
    );
}