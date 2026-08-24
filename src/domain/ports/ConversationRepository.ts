import { Conversation } from "../entities/Conversation.js";

export interface ConversationRepository{
  buscarPorId(id: string): Promise<Conversation | null>;

  buscarAtivaPorCanal(
    sessionId: string,
    canal: string,
  ): Promise<Conversation | null>;

buscarParaAbandono(params: {
}): Promise<Conversation[]>;

  salvar(conversation: Conversation): Promise<void>;
}