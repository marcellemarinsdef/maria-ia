import { MotivoFinalizacao } from "../../../domain/value-objects/MotivoFinalizacao.js";
import { ConversationRepository } from "../../../domain/ports/ConversationRepository.js";

interface FinalizarConversasAbandonadasInput {
  janelaMinutos: number;
}

export class FinalizarConversasAbandonadas {
  constructor(
    private readonly conversationRepository: ConversationRepository,
  ) {}

  async executar(
    input: FinalizarConversasAbandonadasInput,
  ): Promise<void> {
    const conversas =
      await this.conversationRepository.buscarParaAbandono({
        
      });

    for (const conversa of conversas) {
      if (conversa.estaFinalizada()) {
        continue;
      }

      if (conversa.podeReabrir(input.janelaMinutos)) {
        continue;
      }

      conversa.finalizar(MotivoFinalizacao.ABANDONO);

      await this.conversationRepository.salvar(conversa);
    }
  }
}
