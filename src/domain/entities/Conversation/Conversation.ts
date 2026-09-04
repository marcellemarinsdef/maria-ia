import { Canal } from "../../value-objects/Canal.js";
import { MotivoFinalizacao } from "../../value-objects/MotivoFinalizacao.js";
import { randomUUID } from "crypto";

class Conversation {
  id: string;
  sessionId: string;
  canal: Canal;
  idPessoa: string;
  flowId: string;

  dadosColetados: Record<string, unknown>;

  iniciadoEm: Date;
  ultimaMensagemEm: Date | null;
  finalizadaEm: Date | null;

  motivoFinalizacao: MotivoFinalizacao | null;

  ultimoFlowId: string;
  ultimoNodeId: string;

  tags: string[];
  csat: number | null;

  constructor(params: {
    id?: string;
    sessionId?: string;
    canal: Canal;
    idPessoa: string;
    flowId: string;

    dadosColetados?: Record<string, unknown>;
    iniciadoEm?: Date;

    ultimaMensagemEm?: Date | null;
    finalizadaEm?: Date | null;
    motivoFinalizacao?: MotivoFinalizacao | null;

    ultimoFlowId?: string;
    ultimoNodeId?: string;

    tags?: string[];
    csat?: number | null;
  }) {
    this.id = params.id ?? randomUUID();
    this.sessionId = params.sessionId ?? randomUUID();
    this.canal = params.canal;
    this.idPessoa = params.idPessoa;
    this.flowId = params.flowId;

    this.dadosColetados = params.dadosColetados ?? {};
    this.iniciadoEm = params.iniciadoEm ?? new Date();

    this.ultimaMensagemEm = params.ultimaMensagemEm ?? null;
    this.finalizadaEm = params.finalizadaEm ?? null;
    this.motivoFinalizacao = params.motivoFinalizacao ?? null;

    this.ultimoFlowId = params.ultimoFlowId ?? "";
    this.ultimoNodeId = params.ultimoNodeId ?? "";

    this.tags = params.tags ?? [];
    this.csat = params.csat ?? null;
  }

 podeReabrir(data: Date, janelaMinutos: number): boolean {
  if (this.estaFinalizada()) return false;
  if (!this.ultimaMensagemEm) return false;

  const decorrido =
    data.getTime() - this.ultimaMensagemEm.getTime();

  const janelaEmMilissegundos = janelaMinutos * 60_000;

  return decorrido >= 0 && decorrido < janelaEmMilissegundos;
}

estaAbandonada(data: Date, janelaMinutos: number): boolean {
  if (this.estaFinalizada()) return false;

  return !this.podeReabrir(data, janelaMinutos);
}

  finalizar(motivo: MotivoFinalizacao): void {
    if (this.finalizadaEm) throw new Error("Conversa já finalizada")
    this.finalizadaEm = new Date()
    this.motivoFinalizacao = motivo
  }

  estaFinalizada(): boolean {
    return this.finalizadaEm != null
  }

reabrirConversa(dataMensagemNova: Date): Conversation {
    return new Conversation({
      id: this.id,
      sessionId: this.sessionId,
      canal: this.canal,
      idPessoa: this.idPessoa,
      flowId: this.flowId,
      dadosColetados: this.dadosColetados,
      tags: this.tags,
      ultimaMensagemEm: dataMensagemNova,
    });
}

criarConversaRelacionadaAoSessionID(dataMensagemNova: Date): Conversation {
    return new Conversation({
    id: randomUUID(),
    sessionId: this.sessionId,
    canal: this.canal,
    idPessoa: this.idPessoa,
    flowId: this.flowId,
    tags: this.tags,
    ultimaMensagemEm: dataMensagemNova,
  });
}

}

export { Conversation };