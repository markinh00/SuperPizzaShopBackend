import { FastifyReply, FastifyRequest } from "fastify";
import { CreateProduct, ProductParams, ProductQuery, UpdateProduct } from "../schemas/products.schema";
import { createProduct, deleteProduct, getAllProducts, getProductById, updateProduct } from "../services/products.service";

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
        return reply.code(500).send(error);
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
        return reply.code(500).send(error);
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
            return reply.code(404).send({ message: `Product with id ${productId} not found` });
        }

        return reply.code(200).send(product);
    } catch (error) {
        console.log(error);
        return reply.code(500).send(error);
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
            return reply.code(404).send({ message: `Product with id ${productId} not found` });
        }

        return reply.code(200).send(updatedProduct);
    } catch (error) {
        console.log(error);
        return reply.code(500).send(error);
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
            return reply.code(404).send({ message: `Product with id ${productId} not found` });
        }

        return reply.code(200).send(deletedProduct);
    } catch (error) {
        console.log(error);
        return reply.code(500).send(error);
    }
}