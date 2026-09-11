export interface ConversationCreationLock {
  adquirir(idPessoa: string, ttlSeconds: number): Promise<string | null>;

  liberar(idPessoa: string, token: string): Promise<void>;
}