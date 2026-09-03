import { FastifyError, FastifyReply, FastifyRequest } from "fastify";

import { ApplicationError } from "../../application/errors/AplicationError.js";
import { BancoError } from "../../infrastructure/database/errors/BancoError.js";

export function errorHandler(
  error: FastifyError | Error,
  request: FastifyRequest,
  reply: FastifyReply,
): void {
  request.log.error(error);

  if (error instanceof ApplicationError) {
    reply.status(error.statusCode).send({
      error: error.code,
      message: error.message,
    });

    return;
  }

  if (error instanceof BancoError) {
    reply.status(500).send({
      error: "BANCO_ERROR",
      message: "Não foi possível concluir a operação.",
    });

    return;
  }

  reply.status(500).send({
    error: "INTERNAL_SERVER_ERROR",
    message: "Ocorreu um erro interno no servidor.",
  });
}