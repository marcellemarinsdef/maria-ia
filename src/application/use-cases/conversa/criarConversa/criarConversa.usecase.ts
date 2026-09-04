import { Conversation } from "../../../../domain/entities/Conversation/Conversation.js";
import { ConversationRepository } from "../../../../domain/ports/ConversationRepository.js";
import { CriarConversaInput } from "./criarConversa.dto.js";

export class CriarConversaUseCase {
    constructor(
        private readonly conversationRepository: ConversationRepository,
    ) {}

    async executar(input: CriarConversaInput): Promise<void> {
        const conversa = new Conversation({
            ultimaMensagemEm: input.ultimaMensagemEm,
            canal: input.canal,
            idPessoa: input.idPessoa,
            flowId: input.flowId,
        });
            await this.conversationRepository.salvar(conversa);

    }
}