import { FastifyReply, FastifyRequest } from "fastify";
import { CreateProduct, ProductParams, ProductQuery, UpdateProduct } from "../schemas/products.schema";
import { createProduct, deleteProduct, getAllProducts, getProductById, updateProduct } from "../services/products.service";
import { InternalServerError, NotFoundError } from "../utils/errors";

export async function createProductHandler(
    request: FastifyRequest<{ Body: CreateProduct }>,
    reply: FastifyReply
) {
    const newProductData = request.body;

    try {
        const product = await createProduct(newProductData);

        return reply.code(201).send(product);
    } catch (error) {
        console.log(error);
        throw new InternalServerError(error);
    }
}

export async function getAllProductsHandler(
    request: FastifyRequest<{ Querystring: ProductQuery }>,
    reply: FastifyReply
) {
    const query = request.query;

    try {
        const products = await getAllProducts(query)

        return reply.code(200).send(products);
    } catch (error) {
        console.log(error);
        throw new InternalServerError(error);
    }
}

export async function getProductByIdHandler(
    request: FastifyRequest<{ Params: ProductParams }>,
    reply: FastifyReply
) {
    const { productId } = request.params;

    try {
        const product = await getProductById(productId);

        if (!product) {
            throw new NotFoundError(`Product with ID ${productId}`)
        }

        return reply.code(200).send(product);
    } catch (error) {
        console.log(error);
        throw new InternalServerError(error);
    }
}

export async function updateProductHandler(
    request: FastifyRequest<{
        Params: ProductParams,
        Body: UpdateProduct,
    }>,
    reply: FastifyReply
) {
    const { productId } = request.params;
    const updateProductData = request.body;

    try {
        const updatedProduct = await updateProduct(productId, updateProductData);

        if (!updatedProduct) {
            throw new NotFoundError(`Product with ID ${productId}`)
        }

        return reply.code(200).send(updatedProduct);
    } catch (error) {
        console.log(error);
        throw new InternalServerError(error);
    }
}

export async function deleteProductHandler(
    request: FastifyRequest<{ Params: ProductParams }>,
    reply: FastifyReply
) {
    const { productId } = request.params;

    try {
        const deletedProduct = await deleteProduct(productId);

        if (!deletedProduct) {
            throw new NotFoundError(`Product with ID ${productId}`)
        }

        return reply.code(200).send(deletedProduct);
    } catch (error) {
        console.log(error);
        throw new InternalServerError(error);
    }
}