import { describe, it, expect, beforeEach,afterEach, jest } from '@jest/globals';
import { FinalizarConversasAbandonadas } from "./finalizarConversasAbandonadas.usecase.js";
import { ConversationRepository } from "../../../../domain/ports/ConversationRepository.js";
import { Conversation } from "../../../../domain/entities/Conversation/Conversation.js";
import { MotivoFinalizacao } from "../../../../domain/value-objects/MotivoFinalizacao.js";

describe("FinalizarConversasAbandonadas", () => {
  const agora = new Date("2026-08-24T15:00:00.000Z");

  let repository: jest.Mocked<ConversationRepository>;
  let useCase: FinalizarConversasAbandonadas;

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(agora);

    repository = {
      buscarCandidatasAAbandono: jest.fn(),
      salvar: jest.fn(),
      acharPorSessionId: jest.fn(),
      acharUltimaPorSessionId: jest.fn(),
    };

    useCase = new FinalizarConversasAbandonadas(repository);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("deve buscar candidatas e finalizar as conversas abandonadas", async () => {
    const conversa = {
      estaAbandonada: jest.fn().mockReturnValue(true),
      finalizar: jest.fn(),
    } as unknown as Conversation;

    repository.buscarCandidatasAAbandono.mockResolvedValue([
      conversa,
    ]);

    await useCase.executar({
      janelaMinutos: 24 * 60,
    });

    expect(
      repository.buscarCandidatasAAbandono,
    ).toHaveBeenCalledWith(24 * 60);

    expect(conversa.estaAbandonada).toHaveBeenCalledWith(
      agora,
      24 * 60,
    );

    expect(conversa.finalizar).toHaveBeenCalledWith(
      MotivoFinalizacao.ABANDONO,
    );

    expect(repository.salvar).toHaveBeenCalledWith(conversa);
  });

  it("não deve finalizar nem salvar uma conversa que não esteja abandonada", async () => {
    const conversa = {
      estaAbandonada: jest.fn().mockReturnValue(false),
      finalizar: jest.fn(),
    } as unknown as Conversation;

    repository.buscarCandidatasAAbandono.mockResolvedValue([
      conversa,
    ]);

    await useCase.executar({
      janelaMinutos: 24 * 60,
    });

    expect(conversa.estaAbandonada).toHaveBeenCalledWith(
      agora,
      24 * 60,
    );

    expect(conversa.finalizar).not.toHaveBeenCalled();

    expect(repository.salvar).not.toHaveBeenCalled();
  });

  it("deve processar todas as candidatas e salvar apenas as abandonadas", async () => {
    const conversaAbandonada = {
      estaAbandonada: jest.fn().mockReturnValue(true),
      finalizar: jest.fn(),
    } as unknown as Conversation;

    const conversaNaoAbandonada = {
      estaAbandonada: jest.fn().mockReturnValue(false),
      finalizar: jest.fn(),
    } as unknown as Conversation;

    repository.buscarCandidatasAAbandono.mockResolvedValue([
      conversaAbandonada,
      conversaNaoAbandonada,
    ]);

    await useCase.executar({
      janelaMinutos: 24 * 60,
    });

    expect(conversaAbandonada.finalizar).toHaveBeenCalledWith(
      MotivoFinalizacao.ABANDONO,
    );

    expect(conversaNaoAbandonada.finalizar).not.toHaveBeenCalled();

    expect(repository.salvar).toHaveBeenCalledTimes(1);
    expect(repository.salvar).toHaveBeenCalledWith(
      conversaAbandonada,
    );
  });

  it("não deve fazer nada quando não houver candidatas", async () => {
    repository.buscarCandidatasAAbandono.mockResolvedValue([]);

    await useCase.executar({
      janelaMinutos: 24 * 60,
    });

    expect(
      repository.buscarCandidatasAAbandono,
    ).toHaveBeenCalledTimes(1);

    expect(repository.salvar).not.toHaveBeenCalled();
  });
});
