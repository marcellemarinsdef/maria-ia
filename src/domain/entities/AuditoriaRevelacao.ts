class AuditoriaRevelacao {
    id: string;
    operadorId: string;
    conversationId: string;
    campoRevelado: string;
    reveladoEm: Date;

    constructor(params: {
        id: string;
        operadorId: string;
        conversationId: string;
        campoRevelado: string;
        reveladoEm: Date;
    }) {
        this.id = params.id;
        this.operadorId = params.operadorId;
        this.conversationId = params.conversationId;
        this.campoRevelado = params.campoRevelado;
        this.reveladoEm = params.reveladoEm;
    }
}