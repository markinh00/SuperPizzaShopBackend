import { FastifyReply, FastifyRequest } from "fastify";
import { CustomerParams, CustomerQuery, UpdateCustomer } from "../schemas/customers.schema";
import { InternalServerError, NotFoundError, UnauthorizedError } from "../utils/errors";
import { deleteCustomer, getAllCustomers, getCustomerById, updateCustomer } from "../services/customers.service";
import { RequestUser, UserRole } from "../schemas/users.schema";

export async function getAllCustomersHandler(
    request: FastifyRequest<{ Querystring: CustomerQuery }>,
    reply: FastifyReply
) {
    const query = request.query;

    try {
        const customers = await getAllCustomers(query)

        return reply.code(200).send(customers);
    } catch (error) {
        console.log(error);
        throw new InternalServerError(error);
    }
}

export async function getCustomerByIdHandler(
    request: FastifyRequest<{ Params: CustomerParams }>,
    reply: FastifyReply
) {
    const { customerId } = request.params;
    const { id, role } = request.user as RequestUser;

    if (id !== customerId && role !== UserRole.ADMIN) {
        throw new UnauthorizedError("A customer cannot see other's customer data")
    }

    try {
        const customer = await getCustomerById(customerId);

        if (!customer) {
            throw new NotFoundError(`Customer with ID ${customerId}`)
        }

        return reply.code(200).send(customer);
    } catch (error) {
        console.log(error);
        throw new InternalServerError(error);
    }
}

export async function updateCustomerHandler(
    request: FastifyRequest<{
        Params: CustomerParams,
        Body: UpdateCustomer,
    }>,
    reply: FastifyReply
) {
    const { customerId } = request.params;
    const updateCustomerData = request.body;
    const { id, role } = request.user as RequestUser;

    if (id !== customerId && role !== UserRole.ADMIN) {
        throw new UnauthorizedError("A customer cannot change other's customer data")
    }

    try {
        const updatedCustomer = await updateCustomer(customerId, updateCustomerData);

        if (!updatedCustomer) {
            throw new NotFoundError(`Customer with ID ${customerId}`)
        }

        return reply.code(200).send(updatedCustomer);
    } catch (error) {
        console.log(error);
        throw new InternalServerError(error);
    }
}

export async function deleteCustomerHandler(
    request: FastifyRequest<{ Params: CustomerParams }>,
    reply: FastifyReply
) {
    const { customerId } = request.params;
    const { id, role } = request.user as RequestUser;

    if (id !== customerId && role !== UserRole.ADMIN) {
        throw new UnauthorizedError("A customer cannot delete other's customer data")
    }

    try {
        const deletedCustomer = await deleteCustomer(customerId);

        if (!deletedCustomer) {
            throw new NotFoundError(`Customer with ID ${customerId}`)
        }

        return reply.code(200).send(deletedCustomer);
    } catch (error) {
        console.log(error);
        throw new InternalServerError(error);
    }
}