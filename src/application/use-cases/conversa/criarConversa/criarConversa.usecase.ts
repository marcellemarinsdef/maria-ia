import { Conversation } from "../../../../domain/entities/Conversation/Conversation.js";
import { ConversationRepository } from "../../../../domain/ports/ConversationRepository.js";
import { ConversationCreationLock } from "../../../../domain/ports/ConversationCreationLock.js";
import { CriarConversaInput } from "./criarConversa.dto.js";
// import { setTimeout } from "node:timers/promises";


export class CriarConversaUseCase {

  private readonly lockTtlSeconds = 30;

  constructor(
    private readonly conversationRepository: ConversationRepository,
    private readonly conversationCreationLock: ConversationCreationLock,
  ) {}

  async executar(input: CriarConversaInput): Promise<Conversation> {

    const token = await this.conversationCreationLock.adquirir(input.idPessoa,this.lockTtlSeconds);

    if (!token) {
      throw new Error(
        "Já existe uma tentativa de criação de conversa para esta pessoa.",
      );
    }

    try {

     // await setTimeout(10_000);
      const conversa = new Conversation({
        ultimaMensagemEm: input.ultimaMensagemEm,
        canal: input.canal,
        idPessoa: input.idPessoa,
        flowId: input.flowId,
      });

      return await this.conversationRepository.salvar(conversa);

    } finally {

      await this.conversationCreationLock.liberar(input.idPessoa,token);
    }
  }
}