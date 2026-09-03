export interface ProcessarNovaMensagemDTO {
  sessionId: string;
  dataMensagemNova: Date;
}

export class ProcessarNovaMensagemDTOFactory {
  static criar(body: {
    sessionId: string;
    dataMensagemNova: string;
  }): ProcessarNovaMensagemDTO {
    const dataMensagemNova = new Date(body.dataMensagemNova);

    if (Number.isNaN(dataMensagemNova.getTime())) {
      throw new Error('dataMensagemNova inválida');
    }

    return {
      sessionId: body.sessionId,
      dataMensagemNova,
    };
  }
}