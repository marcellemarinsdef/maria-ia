import { PrismaClient, Prisma, Conversation as PrismaConversation} from "@prisma/client";
import { Conversation } from "../../../domain/entities/Conversation.js";
import { ConversationRepository } from "../../../domain/ports/ConversationRepository.js";
import { Canal } from "../../../domain/value-objects/Canal.js";

import {BancoError} from "../errors/BancoError.js";



export class PrismaConversationRepository
  implements ConversationRepository
{
  constructor(
    private readonly prisma: PrismaClient,
  ) {}

  async acharPorSessionId(
    sessionId: string,
  ): Promise<Conversation | null> {
    try {
      const conversa = await this.prisma.conversation.findFirst({
        where: {
          sessionId,
        },
      });

      if (!conversa) {
        return null;
      }

      return this.toDomain(conversa);
    } catch (error) {
      throw this.mapDatabaseError(
        error,
        "Erro ao buscar conversa por sessionId.",
      );
    }
  }

  async acharUltimaPorSessionId(
    sessionId: string,
  ): Promise<Conversation | null> {
    try {
      const conversa = await this.prisma.conversation.findFirst({
        where: {
          sessionId,
        },
        orderBy: {
          ultimaMensagemEm: "desc",
        },
      });

      if (!conversa) {
        return null;
      }

      return this.toDomain(conversa);
    } catch (error) {
      throw this.mapDatabaseError(
        error,
        "Erro ao buscar a última conversa por sessionId.",
      );
    }
  }

  async buscarCandidatasAAbandono(
    janelaMinutos: number,
  ): Promise<Conversation[]> {
    try {
      const dataLimiteAbandono = new Date(
        Date.now() - janelaMinutos * 60_000,
      );

      const conversas =
        await this.prisma.conversation.findMany({
          where: {
            ultimaMensagemEm: {
              lt: dataLimiteAbandono,
            },
            finalizadaEm: null,
          },
        });

      return conversas.map((conversa) =>
        this.toDomain(conversa),
      );
    } catch (error) {
      throw this.mapDatabaseError(
        error,
        "Erro ao buscar conversas candidatas a abandono.",
      );
    }
  }

  async salvar(
    conversa: Conversation,
  ): Promise<void> {
    try {
      await this.prisma.conversation.upsert({
        where: {
          id: conversa.id,
        },

        update: {
          ultimaMensagemEm: conversa.ultimaMensagemEm,
          finalizadaEm: conversa.finalizadaEm,
          motivoFinalizacao: conversa.motivoFinalizacao,
          ultimoFlowId: conversa.ultimoFlowId,
          ultimoNodeId: conversa.ultimoNodeId,
          tags: conversa.tags,
          csat: conversa.csat,
        },

        create: {
          id: conversa.id,
          sessionId: conversa.sessionId,
          ultimaMensagemEm: conversa.ultimaMensagemEm,
          canal: conversa.canal,
          idPessoa: conversa.idPessoa,
          flowId: conversa.flowId,
        },
      });
    } catch (error) {
      throw this.mapDatabaseError(
        error,
        "Erro ao salvar conversa.",
      );
    }
  }

  private toDomain(
    conversa: PrismaConversation,
  ): Conversation {
    return new Conversation({
      id: conversa.id,
      sessionId: conversa.sessionId,
      canal: Canal[conversa.canal as keyof typeof Canal],
      idPessoa: conversa.idPessoa,
      flowId: conversa.flowId,
      iniciadoEm: conversa.iniciadoEm,
      ultimaMensagemEm: conversa.ultimaMensagemEm,
    });
  }

  private mapDatabaseError(
    error: unknown,
    message: string,
  ): BancoError {
    return new BancoError(message, error);
  }
}