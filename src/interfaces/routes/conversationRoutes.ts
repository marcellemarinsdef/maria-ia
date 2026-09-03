import { FastifyInstance } from "fastify";
import { ConversationController } from "../controllers/ConversationController.js";

export async function conversationRoutes(fastify: FastifyInstance, controller: ConversationController) {
    fastify.post("/conversas/criar", async (request, reply) => {
        await controller.criarConversa(request, reply);
    });
        fastify.post("/conversas/finalizarAbandonadas", async (request, reply) => {
        await controller.finalizarConversasAbandonadas(request, reply);
    });
        fastify.post("/conversas/processarNovaMensagem", async (request, reply) => {
        await controller.processarNovaMensagem(request, reply);
    });
}

