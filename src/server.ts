import { fastifySwaggerUi } from '@fastify/swagger-ui';
import { jsonSchemaTransform, serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod';
import { fastifyCors } from '@fastify/cors';
import { fastify } from 'fastify';
import { fastifySwagger } from '@fastify/swagger';
import { productsRoutes } from './routes/products.route';
import { customersRoutes } from './routes/customers.route';
import errorHandler from './utils/errorHandler';
import jwtPlugin from './plugins/jwt';
import { authRoutes } from './routes/auth.route';

const port = process.env.PORT || "8000";

const app = fastify({ logger: true }).withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.setErrorHandler(errorHandler)

app.register(fastifyCors, { origin: "*" });

app.register(fastifySwagger, {
    openapi: {
        info: {
            title: "Super Pizza Shop Backend",
            version: "1.0.0"
        }
    },
    transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUi, {
    routePrefix: "/docs",
})

app.register(jwtPlugin)

app.get("/", () => {
    return { message: "see the documentation at /docs" }
})

app.register(authRoutes, { prefix: "/auth" })
app.register(productsRoutes, { prefix: "/products" })
app.register(customersRoutes, { prefix: "/customers" })

app.listen({ port: parseInt(port), host: '0.0.0.0' }).then(() => {
    console.log(`HTTP server running at ${parseInt(port)}`)
});
