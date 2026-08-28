import { Conversation } from "../entities/Conversation.js";

export interface ConversationRepository {

  acharPorSessionId(sessionId: string): Promise<Conversation | null>;
  acharUltimaPorSessionId(
    sessionId: string,
  ): Promise<Conversation | null>;

  buscarCandidatasAAbandono(
    janelaMinutos: number,
  ): Promise<Conversation[]>;
    

  salvar(conversation: Conversation): Promise<void>;


}