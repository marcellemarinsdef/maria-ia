import { describe, it, expect, jest } from '@jest/globals';
import { Conversation } from '../../../../domain/entities/Conversation.js';
import { Canal } from '../../../../domain/value-objects/Canal.js';
import { MotivoFinalizacao } from '../../../../domain/value-objects/MotivoFinalizacao.js';

describe("Iniciar Conversa", () => {
  it("deve iniciar a conversa com sucesso", () => {
    const conversa = new Conversation({ canal: Canal.WHATSAPP, idPessoa: "123", flowId: "flow1" });
    console.log(conversa);
    expect(conversa).toEqual({
        canal: Canal.WHATSAPP,
        idPessoa: "123",
        flowId: "flow1",
        dadosColetados: {},
        iniciadoEm: expect.any(Date),
        ultimaMensagemEm: null,
        finalizadaEm: null,
        motivoFinalizacao: null,
        ultimoFlowId: "",
        ultimoNodeId: "",
        tags: [],
        csat: null,
        id: expect.any(String),
        sessionId: expect.any(String)
    })
  });
});

describe("verificar se a conversa está finalizada", () => {
  it("deve retornar true se a conversa estiver finalizada", () => {
    const conversa = new Conversation({ canal: Canal.WHATSAPP, idPessoa: "123", flowId: "flow1" });
    conversa.finalizar(MotivoFinalizacao.CONCLUIDA);
    console.log(conversa);
    expect(conversa.estaFinalizada()).toBe(true);
  });

  it("deve retornar false se a conversa não estiver finalizada", () => {
    const conversa = new Conversation({ canal: Canal.WHATSAPP, idPessoa: "123", flowId: "flow1" });
    console.log(conversa);
    expect(conversa.estaFinalizada()).toBe(false);
  });
});

describe("Finalizar Conversa", () => {
  it("deve finalizar a conversa com sucesso", () => {
    const conversa = new Conversation({ canal: Canal.WHATSAPP, idPessoa: "123", flowId: "flow1" });
    conversa.finalizar(MotivoFinalizacao.ABANDONO);
    console.log(conversa);
    expect(conversa.estaFinalizada()).toBe(true);
  });
});

describe("Não finalizar a conversa", () => {
  it("não deve finalizar a conversa se ela já estiver finalizada", () => {
    const conversa = new Conversation({ canal: Canal.WHATSAPP, idPessoa: "123", flowId: "flow1" });
    conversa.finalizar(MotivoFinalizacao.CONCLUIDA);
    console.log(conversa);
    expect(() => {
      conversa.finalizar(MotivoFinalizacao.ABANDONO);
    }).toThrow("Conversa já finalizada");
  });
});

describe("Verificar se a conversa pode ser reaberta", () => {
  it("deve retornar true se a conversa não estiver finalizada e estiver dentro da janela de reabertura", () => {
    const conversa = new Conversation({
      canal: Canal.WHATSAPP,
      idPessoa: "123",
      flowId: "flow1",
    });

    conversa.ultimaMensagemEm = new Date(Date.now());

    expect(conversa.podeReabrir(new Date(), 24 * 60)).toBe(true);
  });

  it("deve retornar false se a conversa estiver finalizada", () => {
    const conversa = new Conversation({
      canal: Canal.WHATSAPP,
      idPessoa: "123",
      flowId: "flow1",
    });

    conversa.ultimaMensagemEm = new Date(Date.now());
    conversa.finalizar(MotivoFinalizacao.CONCLUIDA);

    expect(conversa.podeReabrir(new Date(), 24 * 60)).toBe(false);
  });

  it("deve retornar false se a conversa estiver fora da janela de reabertura", () => {
    const conversa = new Conversation({
      canal: Canal.WHATSAPP,
      idPessoa: "123",
      flowId: "flow1",
    });

    conversa.ultimaMensagemEm = new Date(
      Date.now() - 25 * 60 * 60 * 1000
    );

    expect(conversa.podeReabrir(new Date(), 24 * 60)).toBe(false);
  });
});

