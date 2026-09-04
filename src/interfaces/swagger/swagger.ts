import { FastifyInstance } from "fastify";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";

export async function setupSwagger(fastify: FastifyInstance) {
    await fastify.register(swagger, {
        openapi: {
            openapi: "3.0.3",
            info: {
                title: "Maria API",
                description: "Documentação da API da Maria",
                version: "1.0.0",
            },
            tags: [
                {
                    name: "Conversas",
                    description: "Endpoints relacionados a conversas",
                },
            ],
        },
    });

    await fastify.register(swaggerUi, {
        routePrefix: "/docs",
    });
}
