import { Canal } from "../value-objects/Canal.js";
import { MotivoFinalizacao } from "../value-objects/MotivoFinalizacao.js";
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
    this.id = params.id ?? crypto.randomUUID();
    this.sessionId = params.sessionId ?? crypto.randomUUID();
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

  finalizar(motivo: MotivoFinalizacao): void {
    if (this.finalizadaEm) throw new Error("Conversa já finalizada")
    this.finalizadaEm = new Date()
    this.motivoFinalizacao = motivo
  }

  estaFinalizada(): boolean {
    return this.finalizadaEm != null
  }

  podeReabrir(janelaMinutos: number): boolean {
    if (this.estaFinalizada()) return false
    const decorrido = this.ultimaMensagemEm
  ? Date.now() - this.ultimaMensagemEm.getTime()  : 0;
    return decorrido < janelaMinutos * 60_000
  }

  verificarAbandono(janelaMinutos: number): void {
    if (this.estaFinalizada()) {
      return;
    }

    const decorrido = this.ultimaMensagemEm
      ? Date.now() - this.ultimaMensagemEm.getTime()
      : 0;

    if (decorrido >= janelaMinutos * 60_000) {
      this.finalizar(MotivoFinalizacao.ABANDONO);
    }
  }

}

export { Conversation };