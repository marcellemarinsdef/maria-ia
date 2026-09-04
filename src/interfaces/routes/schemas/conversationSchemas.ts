export const CriarConversaSchema = {
  tags: ["Conversas"],
  summary: "Criar conversa",
  description: "Cria uma nova conversa.",

  body: {
    type: "object",
    required: ["ultimaMensagemEm", "canal", "idPessoa", "flowId"],
    properties: {
      ultimaMensagemEm: {
        type: "string",
        format: "date-time",
      },

      canal: {
        type: "string",
        enum: ["WHATSAPP", "WEB", "TELEGRAM"],
      },

      idPessoa: {
        type: "string",
      },

      flowId: {
        type: "string",
      },
    },
  },

  response: {
    201: {
      type: "null",
    },
  },
};

export const FinalizarConversasAbandonadasSchema = {
  tags: ["Conversas"],
  summary: "Finalizar conversas abandonadas",
  description: "Finaliza conversas que foram abandonadas.",

  body: {
    type: "object",
    required: ["janelaMinutos"],
    properties: {
      janelaMinutos: {
        type: "number",
      },
    },
  },

  response: {
    200: {
      type: "null",
    },
  },
};

export const ProcessarNovaMensagemSchema = {
  tags: ["Conversas"],
  summary: "Processar nova mensagem",
  description: "Processa uma nova mensagem recebida em uma conversa.",

  body: {
    type: "object",
    required: ["sessionId", "dataMensagemNova"],
    properties: {
      sessionId: {
        type: "string",
      },

      dataMensagemNova: {
        type: "string",
        format: "date-time",
      },
    },
  },

  response: {
    200: {
      type: "null",
    },
  },
};