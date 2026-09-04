import { FastifyInstance } from "fastify";
import { ConversationController } from "../controllers/ConversationController.js";
import { CriarConversaSchema, FinalizarConversasAbandonadasSchema, ProcessarNovaMensagemSchema } from "./schemas/conversationSchemas.js";


export async function conversationRoutes(fastify: FastifyInstance, controller: ConversationController) {
    fastify.post("/conversas/criar",{schema: CriarConversaSchema},
        controller.criarConversa.bind(controller),
        );
        fastify.post("/conversas/finalizarAbandonadas",{schema: FinalizarConversasAbandonadasSchema},
        controller.finalizarConversasAbandonadas.bind(controller),
        );
        fastify.post("/conversas/processarNovaMensagem",{schema: ProcessarNovaMensagemSchema},
        controller.processarNovaMensagem.bind(controller),
        );
}

