import { PrismaClient, Conversation as PrismaConversation} from "@prisma/client";
import { Conversation } from "../../../domain/entities/Conversation.js";
import { ConversationRepository } from "../../../domain/ports/ConversationRepository.js";
import { Canal } from "../../../domain/value-objects/Canal.js";



export class PrismaConversationRepository
  implements ConversationRepository
{
  constructor(
    private readonly prisma: PrismaClient,
  ) {}

  async acharPorSessionId(
    sessionId: string,
  ): Promise<Conversation | null> {
    const conversa = await this.prisma.conversation.findFirst({
      where: {
        sessionId,
      },
    });

    if (!conversa) {
      return null;
    }

    return this.toDomain(conversa);
  }

  async acharUltimaPorSessionId(
    sessionId: string,
  ): Promise<Conversation | null> {
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
  }

  async buscarCandidatasAAbandono(
    janelaMinutos: number,
  ): Promise<Conversation[]> {
    const dataLimiteAbandono = new Date(
      Date.now() - janelaMinutos * 60_000,
    );

    const conversas =
      await this.prisma.conversation.findMany({
        where: {
          ultimaMensagemEm: {
            lt: dataLimiteAbandono,
          },
        },
      });

    return conversas.map((conversa) =>
      this.toDomain(conversa),
    );
  }

  async salvar(
    conversa: Conversation,
  ): Promise<void> {
    await this.prisma.conversation.upsert({
      where: {
        id: conversa.id,
      },
      update: {
        sessionId: conversa.sessionId,
        ultimaMensagemEm: conversa.ultimaMensagemEm,
      },
      create: {
        id: conversa.id,
        sessionId: conversa.sessionId,
        ultimaMensagemEm: conversa.ultimaMensagemEm,
        canal: conversa.canal,
        idPessoa: conversa.idPessoa,
        flowId: conversa.flowId
      },
    });
  }

private toDomain(
  conversa: PrismaConversation,
): Conversation {
  return new Conversation({
    id: conversa.id,
    sessionId: conversa.sessionId,
    canal: Canal[conversa.canal],
    idPessoa: conversa.idPessoa,
    flowId: conversa.flowId,
    iniciadoEm: conversa.iniciadoEm,
    ultimaMensagemEm: conversa.ultimaMensagemEm,
  });
}

}
