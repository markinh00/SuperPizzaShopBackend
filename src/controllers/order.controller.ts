import { FastifyReply, FastifyRequest } from "fastify";
import { CreateOrder, OrderParams, OrderQuery, ProductList, UpdateOrder } from "../schemas/order.schema";
import { addProductsToOrder, createOrder, deleteOrder, getAllOrders, getOrderById, removeProductsFromOrder, updateOrder } from "../services/order.service";
import { NotFoundError, UnauthorizedError } from "../utils/errors";
import { RequestUser, UserRole } from "../schemas/users.schema";

export async function createOrderHandler(
    request: FastifyRequest<{ Body: CreateOrder }>,
    reply: FastifyReply
) {
    const newOrderData = request.body

    const newOrder = await createOrder(newOrderData);

    return reply.code(201).send(newOrder);
}

export async function getAllOrdersHandler(
    request: FastifyRequest<{ Querystring: OrderQuery }>,
    reply: FastifyReply
) {
    const query = request.query;

    const orders = await getAllOrders(query);

    return reply.code(200).send(orders);
}

export async function getOrderByIdHandler(
    request: FastifyRequest<{ Params: OrderParams }>,
    reply: FastifyReply
) {
    const { orderId } = request.params;

    const order = await getOrderById(orderId);

    if (!order) {
        throw new NotFoundError(`Order with ID ${orderId}`);
    }

    const { id, role } = request.user as RequestUser;

    if (role !== UserRole.ADMIN && id !== order.customerId) {
        throw new UnauthorizedError(`A customer cannot access another customer's data`);
    }

    return reply.code(200).send(order);
}

export async function updateOrderHandler(
    request: FastifyRequest<{ Params: OrderParams, Body: UpdateOrder }>,
    reply: FastifyReply
) {
    const { orderId } = request.params;
    const updateData = request.body;

    const { role, id } = request.user as RequestUser;

    const order = await getOrderById(orderId);

    if (!order) {
        throw new NotFoundError(`Order with ID ${orderId}`);
    }

    if (role !== UserRole.ADMIN && updateData.status) {
        throw new UnauthorizedError(`Access Denied`);
    }

    if (role !== UserRole.ADMIN && id !== order.id) {
        throw new UnauthorizedError(`A customer cannot change another customer's data`);
    }

    const updatedOrder = await updateOrder(orderId, updateData);

    return reply.code(200).send(updatedOrder);
}

export async function addProductsToOrderHandler(
    request: FastifyRequest<{ Params: OrderParams, Body: ProductList }>,
    reply: FastifyReply
) {
    const { orderId } = request.params;
    const products = request.body;

    const updatedOrder = await addProductsToOrder(orderId, products);

    return reply.code(200).send(updatedOrder);
}

export async function removeProductsFromOrderHandler(
    request: FastifyRequest<{ Params: OrderParams, Body: ProductList }>,
    reply: FastifyReply
) {
    const { orderId } = request.params;
    const products = request.body;

    const updatedOrder = await removeProductsFromOrder(orderId, products);

    return reply.code(200).send(updatedOrder);
}

export async function deleteOrderHandler(
    request: FastifyRequest<{ Params: OrderParams }>,
    reply: FastifyReply
) {
    const { orderId } = request.params;
    const { id, role } = request.user as RequestUser;

    const order = await getOrderById(orderId);

    if (!order) {
        throw new NotFoundError(`Order with ID ${orderId}`);
    }

    if (role !== UserRole.ADMIN && id !== order.id) {
        throw new UnauthorizedError(`A customer cannot delete another customer's data`);
    }

    const deletedOrder = await deleteOrder(orderId);

    return reply.code(200).send(deletedOrder);
}