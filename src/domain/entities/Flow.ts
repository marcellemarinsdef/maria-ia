type NodeType =
  | "mensagem"
  | "pergunta"
  | "condicao"
  | "api"
  | "atribuir"
  | "subfluxo"
  | "encerrar"
  | "tag"
  | "transferir_humano";

type NodeFlow = {
  id: string;
  tipo: NodeType;
  data?: Record<string, unknown>;
};

type Edge = {
  id: string;
  source: string;
  target: string;
};

class Flow {
  id: string;
  nome: string;
  ativo: boolean;
  nodes: NodeFlow[];
  edges: Edge[];

  constructor(params: {
    id: string;
    nome: string;
    ativo: boolean;
    nodes: NodeFlow[];
    edges: Edge[];
  }) {
    this.id = params.id;
    this.nome = params.nome;
    this.ativo = params.ativo;
    this.nodes = params.nodes;
    this.edges = params.edges;
  }
}