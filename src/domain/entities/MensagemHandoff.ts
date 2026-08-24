import { RemetenteHandoff } from "../value-objects/RemetenteHandoff.js";

class MensagemHandoff {
    id: string;
    conversationId: string;
    remetente: RemetenteHandoff;
    texto: string;
    enviadaEm: Date;

    constructor(params: {
        id: string;
        conversationId: string;
        remetente: RemetenteHandoff;
        texto: string;
        enviadaEm: Date;
    }) {
        this.id = params.id;
        this.conversationId = params.conversationId;
        this.remetente = params.remetente;
        this.texto = params.texto;
        this.enviadaEm = params.enviadaEm;
    }
}