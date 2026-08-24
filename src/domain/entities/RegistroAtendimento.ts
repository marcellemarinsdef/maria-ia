class RegistroAtendimento {

    id: string;
    conversationId: string;
    idPessoa: string;
    idAssunto: number;
    idOrgao: number;
    numeroAgendamento: number;
    resumoAtendimento: string;
    data: Date;

    constructor(params: {
        id: string;
        conversationId: string;
        idPessoa: string;
        idAssunto: number;
        idOrgao: number;
        numeroAgendamento: number;
        resumoAtendimento: string;
        data: Date;
    }) {
        this.id = params.id;
        this.conversationId = params.conversationId;
        this.idPessoa = params.idPessoa;
        this.idAssunto = params.idAssunto;
        this.idOrgao = params.idOrgao;
        this.numeroAgendamento = params.numeroAgendamento;
        this.resumoAtendimento = params.resumoAtendimento;
        this.data = params.data ?? new Date();
    }
}