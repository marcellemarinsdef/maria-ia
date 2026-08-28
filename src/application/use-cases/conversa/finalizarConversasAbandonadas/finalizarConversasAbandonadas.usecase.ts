import { MotivoFinalizacao } from "../../../../domain/value-objects/MotivoFinalizacao.js";
import { ConversationRepository } from "../../../../domain/ports/ConversationRepository.js";
import { FinalizarConversasAbandonadasInput } from "./finalizarConversasAbandonadas.dto.js";

export class FinalizarConversasAbandonadas {
  constructor(
    private readonly conversationRepository: ConversationRepository,
  ) {}

 async executar(input: FinalizarConversasAbandonadasInput): Promise<void> {
  const dataAtual = new Date();

  const conversas =
    await this.conversationRepository.buscarCandidatasAAbandono(input.janelaMinutos);

  for (const conversa of conversas) {
    if (!conversa.estaAbandonada(dataAtual, input.janelaMinutos)) {
      continue;
    }

    conversa.finalizar(MotivoFinalizacao.ABANDONO);

    await this.conversationRepository.salvar(conversa);
  }
}

}
