import { FastifyInstance } from "fastify";
import { ConversationController } from "../controllers/ConversationController.js";

export async function conversationRoutes(fastify: FastifyInstance, controller: ConversationController) {
    fastify.post("/conversas", async (request, reply) => {
        await controller.criarConversa(request, reply);
    });
}