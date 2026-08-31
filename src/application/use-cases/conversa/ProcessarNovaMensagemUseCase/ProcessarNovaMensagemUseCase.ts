import { ConversationRepository } from "../../../../domain/ports/ConversationRepository.js";
import { ReabrirConversaUseCase } from "../ReabrirConversa/reabrirConversa.usecase.js";
import { CriarConversaRelacionadaAoSessionIdUseCase } from "../criarConversaComMesmoSessionId/criarNovaConversaComMesmoSessionId.usecase.js";

export class ProcessarNovaMensagemUseCase {
  constructor(
    private readonly conversationRepository: ConversationRepository,
    private readonly reabrirConversaUseCase: ReabrirConversaUseCase,
    private readonly criarConversaRelacionadaAoSessionIdUseCase: CriarConversaRelacionadaAoSessionIdUseCase,
  ) {}

  async executar(sessionId: string, dataMensagemNova: Date): Promise<void> {
    const conversa =
      await this.conversationRepository.acharUltimaPorSessionId(sessionId);

    if (!conversa) {
      return;
    }

    if (
      conversa.podeReabrir(dataMensagemNova, 24 * 60 )
    ) {
      await this.reabrirConversaUseCase.executar(conversa, dataMensagemNova);

      return;
    }

    await this.criarConversaRelacionadaAoSessionIdUseCase.executar(conversa, dataMensagemNova);
  }
}

