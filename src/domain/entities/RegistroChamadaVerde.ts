class RegistroChamadaVerde{
    id: string;
    conversationId: string;
    idPessoa: string;
    tipo: string;
    payloadEnviado: Record<string, unknown>;
    respostaRecebida: Record<string, unknown>;
    timestamp: Date;

    constructor(params: {
        id: string;
        conversationId: string;
        idPessoa: string;
        tipo: string;
        payloadEnviado: Record<string, unknown>;
        respostaRecebida: Record<string, unknown>;
        timestamp: Date;
    }) {
        this.id = params.id;
        this.conversationId = params.conversationId;
        this.idPessoa = params.idPessoa;
        this.tipo = params.tipo;
        this.payloadEnviado = params.payloadEnviado ?? {};
        this.respostaRecebida = params.respostaRecebida ?? {};
        this.timestamp = params.timestamp ?? new Date(); 
    }
}