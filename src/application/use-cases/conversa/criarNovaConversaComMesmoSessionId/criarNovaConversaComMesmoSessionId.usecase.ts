import { Conversation } from "../../../../domain/entities/Conversation.js";
import { ConversationRepository } from "../../../../domain/ports/ConversationRepository.js";

export class CriarConversaRelacionadaAoSessionIdUseCase {
  constructor(
    private readonly conversationRepository: ConversationRepository,
  ) {}

  async executar(conversa: Conversation, dataMensagemNova: Date): Promise<void> {
    const novaConversa = conversa.criarConversaRelacionadaAoSessionID(dataMensagemNova);

    await this.conversationRepository.salvar(novaConversa);
  }
}

