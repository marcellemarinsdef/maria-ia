import { describe, it, expect } from '@jest/globals';
import { Conversation } from "../../../../domain/entities/Conversation/Conversation.js";
import { Canal } from "../../../../domain/value-objects/Canal.js";
import { InMemoryConversationRepository } from "../../../../infrastructure/repositories/InMemoryConversationRepository.js";
import { MotivoFinalizacao } from "../../../../domain/value-objects/MotivoFinalizacao.js";
import { ProcessarNovaMensagemUseCase } from "../../../use-cases/conversa/ProcessarNovaMensagemUseCase/ProcessarNovaMensagemUseCase.js";
import { ReabrirConversaUseCase } from '../ReabrirConversa/reabrirConversa.usecase.js';
import { CriarConversaRelacionadaAoSessionIdUseCase } from '../criarConversaComMesmoSessionId/criarNovaConversaComMesmoSessionId.usecase.js';
import { ConversaNaoEncontradaError } from '../../../errors/ConversaNaoEncontradaError.js';

describe("ProcessarNovaMensagemUseCase", () => {
  it("lança um erro quando não existe conversa para a sessão", async () => {
    const repository = new InMemoryConversationRepository();
    const mensagemAtualEm = new Date("2026-08-25T18:02:02.021Z");
    const reabrirUseCase = new ReabrirConversaUseCase(repository);
    const criarConversaUseCase = new CriarConversaRelacionadaAoSessionIdUseCase(repository);

    const useCase = new ProcessarNovaMensagemUseCase(
      repository,
      reabrirUseCase,
      criarConversaUseCase
    );

    await expect(
      useCase.executar("session-inexistente", mensagemAtualEm)
    ).rejects.toThrow(ConversaNaoEncontradaError);
  });

  it("mantém a mesma conversa quando a última mensagem foi há menos de 24 horas", async () => {
    const repository = new InMemoryConversationRepository();
    const mensagemAtualEm = new Date("2026-08-25T18:02:02.021Z");
    const reabrirUseCase = new ReabrirConversaUseCase(repository);
    const criarConversaUseCase = new CriarConversaRelacionadaAoSessionIdUseCase(repository);

    const conversa = new Conversation({
      sessionId: "session-123",
      canal: Canal.WHATSAPP,
      idPessoa: "pessoa-123",
      flowId: "flow-123",
      ultimaMensagemEm: new Date(Date.now() - 1 * 60 * 60 * 1000),
    });

    await repository.salvar(conversa);

    const useCase = new ProcessarNovaMensagemUseCase(
      repository,
      reabrirUseCase,
      criarConversaUseCase
    );

    await useCase.executar("session-123", mensagemAtualEm);

    const resultado =
      await repository.acharUltimaPorSessionId("session-123");

    expect(resultado).not.toBeNull();
    expect(resultado?.id).toBe(conversa.id);
    expect(resultado?.sessionId).toBe(conversa.sessionId);
  });

it("cria uma nova conversa quando a última mensagem tem mais de 24 horas", async () => {
  const repository = new InMemoryConversationRepository();
      const reabrirUseCase = new ReabrirConversaUseCase(repository);
    const criarConversaUseCase = new CriarConversaRelacionadaAoSessionIdUseCase(repository);

  const mensagemAtualEm = new Date(
    "2026-08-25T18:02:02.021Z",
  );

  const conversaOriginal = new Conversation({
    sessionId: "session-123",
    canal: Canal.WHATSAPP,
    idPessoa: "pessoa-123",
    flowId: "flow-123",
    iniciadoEm: new Date(
      "2026-06-24T16:33:02.200Z",
    ),
    ultimaMensagemEm: new Date(
      "2026-07-24T16:33:02.200Z",
    ),
    tags: ["cliente-vip"],
  });

  await repository.salvar(conversaOriginal);

  const useCase =
    new ProcessarNovaMensagemUseCase(
      repository,
      reabrirUseCase,
      criarConversaUseCase
    );

  await useCase.executar(
    "session-123",
    mensagemAtualEm,
  );

  const resultado =
    await repository.acharUltimaPorSessionId(
      "session-123",
    );


        console.log("conversaOriginal", conversaOriginal);
    console.log("resultado", resultado);
  expect(resultado).not.toBeNull();

  expect(resultado?.id).not.toBe(
    conversaOriginal.id,
  );

  expect(resultado?.sessionId).toBe(
    conversaOriginal.sessionId,
  );

  expect(resultado?.canal).toBe(
    conversaOriginal.canal,
  );

  expect(resultado?.idPessoa).toBe(
    conversaOriginal.idPessoa,
  );

  expect(resultado?.flowId).toBe(
    conversaOriginal.flowId,
  );

  expect(resultado?.tags).toEqual(
    conversaOriginal.tags,
  );

  expect(resultado?.ultimaMensagemEm).toEqual(
    mensagemAtualEm,
  );
});

  it("cria uma nova conversa quando a conversa está finalizada", async () => {
    const repository = new InMemoryConversationRepository();
    const mensagemAtualEm = new Date(
  "2026-08-25T18:02:02.021Z",
);

    const conversaOriginal = new Conversation({
      sessionId: "session-123",
      canal: Canal.WHATSAPP,
      idPessoa: "pessoa-123",
      flowId: "flow-123",
      ultimaMensagemEm: new Date(
        "2026-08-25T17:02:02.021Z",
      ),
    });

    conversaOriginal.finalizar( MotivoFinalizacao.CONCLUIDA);

    await repository.salvar(conversaOriginal);

    const reabrirUseCase = new ReabrirConversaUseCase(repository);
    const criarConversaUseCase = new CriarConversaRelacionadaAoSessionIdUseCase(repository);

    const useCase = new ProcessarNovaMensagemUseCase(
      repository,
      reabrirUseCase,
      criarConversaUseCase
    );

    await useCase.executar("session-123", mensagemAtualEm);

    const resultado =
      await repository.acharUltimaPorSessionId("session-123");

      

    expect(resultado).not.toBeNull();
    expect(resultado?.id).not.toBe(conversaOriginal.id);
    expect(resultado?.sessionId).toBe(conversaOriginal.sessionId);
  });
});
