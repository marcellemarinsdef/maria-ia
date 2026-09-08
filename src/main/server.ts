import Fastify from "fastify";
import { PrismaClient } from "@prisma/client";

import { ConversationController } from "../interfaces/controllers/ConversationController.js";
import { conversationRoutes } from "../interfaces/routes/conversationRoutes.js";

import { CriarConversaUseCase } from "../application/use-cases/conversa/criarConversa/criarConversa.usecase.js";
import { FinalizarConversasAbandonadas } from "../application/use-cases/conversa/finalizarConversasAbandonadas/finalizarConversasAbandonadas.usecase.js";
import { ProcessarNovaMensagemUseCase } from "../application/use-cases/conversa/ProcessarNovaMensagemUseCase/ProcessarNovaMensagemUseCase.js";
import { CriarConversaRelacionadaAoSessionIdUseCase } from "../application/use-cases/conversa/criarConversaComMesmoSessionId/criarNovaConversaComMesmoSessionId.usecase.js";
import { ReabrirConversaUseCase } from "../application/use-cases/conversa/ReabrirConversa/reabrirConversa.usecase.js";

import { PrismaConversationRepository } from "../infrastructure/database/prisma/PrismaConversationRepository.js";

import { errorHandler } from "../interfaces/errors/errorHandler.js";

import { setupSwagger } from "../interfaces/swagger/swagger.js";

/*
const app = Fastify({
  logger: true,
});

const prisma = new PrismaClient();

const conversationRepository =
  new PrismaConversationRepository(prisma);

const criarConversaUseCase =
  new CriarConversaUseCase(
    conversationRepository,
  );

const finalizarConversasAbandonadasUseCase =
  new FinalizarConversasAbandonadas(
    conversationRepository,
  );

const reabrirConversaUseCase =
  new ReabrirConversaUseCase(
    conversationRepository,
  );

const criarConversaRelacionadaAoSessionIdUseCase =
  new CriarConversaRelacionadaAoSessionIdUseCase(
    conversationRepository,
  );

const processarNovaMensagemUseCase =
  new ProcessarNovaMensagemUseCase(
    conversationRepository,
    reabrirConversaUseCase,
    criarConversaRelacionadaAoSessionIdUseCase,
  );

const conversationController =
  new ConversationController(
    criarConversaUseCase,
    finalizarConversasAbandonadasUseCase,
    processarNovaMensagemUseCase,
  );

app.setErrorHandler(errorHandler);

await setupSwagger(app);

await app.register(
  async (fastify) => {
    await conversationRoutes(
      fastify,
      conversationController,
    );
  },
);

try {
  await app.listen({
    port: 3000,
    host: "0.0.0.0",
  });
} catch (error) {
  app.log.error(error);

  await prisma.$disconnect();

  process.exit(1);
} */

  import { buildApp } from "./app.js";

const { app, prisma } = await buildApp();

try {
  await app.listen({
    port: 3000,
    host: "0.0.0.0",
  });
} catch (error) {
  app.log.error(error);

  await prisma.$disconnect();

  process.exit(1);
}