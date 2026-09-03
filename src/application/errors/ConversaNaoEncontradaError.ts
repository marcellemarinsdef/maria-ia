import { ApplicationError } from "./AplicationError.js";

export class ConversaNaoEncontradaError extends ApplicationError {
  readonly statusCode = 404;
  readonly code = "CONVERSA_NAO_ENCONTRADA";

  constructor() {
    super("Nenhuma conversa encontrada");
  }
}