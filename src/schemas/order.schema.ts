import { z } from "zod/v4";
import { paginationSchema } from "./pagination.schema";
import { productInCreateOrderSchema, productInOrderResponseSchema } from "./products.schema";

export const createOrderSchema = z.object({
    customerId: z.uuidv4({
        error: (issue) => issue.input === undefined
            ? "Field 'customerId' is required"
            : "Field 'customerId' must be a uuidv4"
    }),
    products: z.array(productInCreateOrderSchema),
    address: z.string({
        error: (issue) => issue.input === undefined
            ? "Field 'address' is required"
            : "Field 'address' must be a string"
    }),
});

export type CreateOrder = z.infer<typeof createOrderSchema>;

export const orderStatusEnumSchema = z.enum(["CANCELED", "REVIEWING", "ONGOING", "DELIVERED"]);

export type OrderStatus = z.infer<typeof orderStatusEnumSchema>;

export const orderResponseSchema = z.object({
    id: z.uuidv4(),
    customerId: z.uuidv4(),
    totalPriceInCents: z.int(),
    createdAt: z.date(),
    updatedAt: z.date(),
    productsInOrder: z.array(productInOrderResponseSchema),
    status: orderStatusEnumSchema,
});

export type OrderResponse = z.infer<typeof orderResponseSchema>;

const enumValues = Object.keys(orderResponseSchema.shape).filter((key) => key !== 'products');
export const orderQuerySchema = paginationSchema.extend({
    orderBy: z.enum([...enumValues]).default(enumValues[3])
});

export type OrderQuery = z.infer<typeof orderQuerySchema>;

export const orderParamsSchema = z.object({
    orderId: z.uuidv4({ message: "Order ID must be a valid UUID" }),
});

export type OrderParams = z.infer<typeof orderParamsSchema>;

export const productListSchema = z.array(
    z.object({
        productId: z.uuidv4(),
        quantity: z.int(),
    })
);

export type ProductList = z.infer<typeof productListSchema>;

export const updateOrderSchema = z.object({
    address: z.string().optional(),
    status: z.enum(['CANCELED', 'REVIEWING', 'ONGOING', 'DELIVERED']).optional(),
});

export type UpdateOrder = z.infer<typeof updateOrderSchema>;