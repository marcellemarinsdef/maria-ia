import { Canal } from "../../../../domain/value-objects/Canal.js";

export interface CriarConversaInput {
    ultimaMensagemEm: Date;
    canal: Canal;
    idPessoa: string;
    flowId: string;
}