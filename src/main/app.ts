import Fastify from "fastify";
import { PrismaClient } from "../generated/prisma/index.js";

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
import { conectarRedis, redis } from "../infrastructure/redis/redis.js";
import { RedisConversationCreationLock } from "../infrastructure/redis/RedisConversationCreationLock.js";

export async function buildApp() {
  const app = Fastify({
    logger: true,
  });

  await conectarRedis();

  const prisma = new PrismaClient();

  const conversationRepository =
    new PrismaConversationRepository(prisma);

  const conversationCreationLock =
  new RedisConversationCreationLock(redis);

  const criarConversaUseCase =
  new CriarConversaUseCase(conversationRepository, conversationCreationLock);

  const finalizarConversasAbandonadasUseCase =
    new FinalizarConversasAbandonadas(conversationRepository);

  const reabrirConversaUseCase =
    new ReabrirConversaUseCase(conversationRepository);

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

  await app.register(async (fastify) => {
    await conversationRoutes(
      fastify,
      conversationController,
    );
  });

  return { app, prisma };
}
