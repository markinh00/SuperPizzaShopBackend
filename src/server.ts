import { fastifySwaggerUi } from '@fastify/swagger-ui';
import { jsonSchemaTransform, serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod';
import { fastifyCors } from '@fastify/cors';
import { fastify } from 'fastify';
import { fastifySwagger } from '@fastify/swagger';
import { productsRoutes } from './routes/product.route';

const port = 8000;

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.setErrorHandler((error, request, reply) => {
    if (error.validation) {
        reply.status(400).send({
            statusCode: 400,
            error: 'Bad Request',
            message: error.validation.map(e => `${e.message}`).join('; '),
        });
    } else {
        reply.send(error);
    }
})

app.register(fastifyCors, { origin: "*" });

app.register(fastifySwagger, {
    openapi: {
        info: {
            title: "Coding Sans Backend challenge",
            version: "1.0.0"
        }
    },
    transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUi, {
    routePrefix: "/docs",
})

app.get("/", () => {
    return { message: "see the documentation at /docs" }
})

app.register(productsRoutes, { prefix: "/products" })

app.listen({ port: port }).then(() => {
    console.log(`HTTP server running at ${8000}`)
}).catch(error => {
    console.log(error);
});
