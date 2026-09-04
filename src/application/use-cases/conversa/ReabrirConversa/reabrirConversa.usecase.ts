import { Conversation } from "../../../../domain/entities/Conversation/Conversation.js";
import { ConversationRepository } from "../../../../domain/ports/ConversationRepository.js";

export class ReabrirConversaUseCase {
  constructor(
    private readonly conversationRepository: ConversationRepository,
  ) {}

  async executar(conversa: Conversation, dataMensagemNova: Date,): Promise<void> {
    const novaConversa = conversa.reabrirConversa(dataMensagemNova);

    await this.conversationRepository.salvar(novaConversa);
  }
}

