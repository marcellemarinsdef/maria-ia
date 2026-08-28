import { Conversation } from "../../domain/entities/Conversation.js";
import { ConversationRepository } from "../../domain/ports/ConversationRepository.js";

export class InMemoryConversationRepository
  implements ConversationRepository
{

  private conversas: Conversation[] = [];

async acharPorSessionId(
  sessionId: string,
): Promise<Conversation | null> {
  const conversa = this.conversas.find(
    (conversa) => conversa.sessionId === sessionId,
  );

  return conversa ?? null;
}

async buscarCandidatasAAbandono(
  janelaMinutos: number,
): Promise<Conversation[]> {
  const dataLimiteAbandono = new Date(
    Date.now() - janelaMinutos * 60_000,
  );

  return this.conversas.filter((conversa) => {
    if (!conversa.ultimaMensagemEm) {
      return false;
    }

    return conversa.ultimaMensagemEm < dataLimiteAbandono;
  });
}

  

async acharUltimaPorSessionId(
  sessionId: string,
): Promise<Conversation | null> {
  const conversas = this.conversas
    .filter(
      (conversa) =>
        conversa.sessionId === sessionId,
    )
    .sort((a, b) => {
      const dataA =
        a.ultimaMensagemEm?.getTime() ?? 0;

      const dataB =
        b.ultimaMensagemEm?.getTime() ?? 0;

      return dataB - dataA;
    });

  return conversas[0] ?? null;
}

  async salvar(
    conversa: Conversation,
  ): Promise<void> {
    const index = this.conversas.findIndex(
      (item) => item.id === conversa.id,
    );

    if (index >= 0) {
      this.conversas[index] = conversa;
      return;
    }

    this.conversas.push(conversa);
  }
  
}
