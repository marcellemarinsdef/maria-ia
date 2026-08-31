import Fastify from "fastify";
import { PrismaClient } from "@prisma/client";
import { ConversationController } from "../interfaces/controllers/ConversationController.js";
import { conversationRoutes } from "../interfaces/routes/conversationRoutes.js";
import { CriarConversaUseCase } from "../application/use-cases/conversa/criarConversa/criarConversa.usecase.js";
import { PrismaConversationRepository } from "../infrastructure/database/prisma/PrismaConversationRepository.js";

const app = Fastify({
  logger: true,
});

const prisma = new PrismaClient();

const conversationRepository =
  new PrismaConversationRepository(prisma);

const CriarConversa =
  new CriarConversaUseCase(
    conversationRepository,
  );

const conversationController =
  new ConversationController(
    CriarConversa
  );

  await app.register(async (fastify) => {
  await conversationRoutes(
    fastify,
    conversationController,
  );
});

app.listen({
  port: 3000,
  host: "0.0.0.0",
});
