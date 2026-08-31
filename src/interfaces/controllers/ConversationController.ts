import { PrismaClient, Conversation as PrismaConversation} from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";
import { CriarConversaUseCase } from "../../application/use-cases/conversa/criarConversa/criarConversa.usecase.js";
import { CriarConversaRelacionadaAoSessionIdUseCase } from "../../application/use-cases/conversa/criarConversaComMesmoSessionId/criarNovaConversaComMesmoSessionId.usecase.js";
import { FinalizarConversasAbandonadas } from "../../application/use-cases/conversa/finalizarConversasAbandonadas/finalizarConversasAbandonadas.usecase.js";
import { ProcessarNovaMensagemUseCase } from "../../application/use-cases/conversa/ProcessarNovaMensagemUseCase/ProcessarNovaMensagemUseCase.js";
import { ReabrirConversaUseCase } from "../../application/use-cases/conversa/ReabrirConversa/reabrirConversa.usecase.js";
import { Canal } from "../../domain/value-objects/Canal.js";

export class ConversationController {
    constructor(
       private readonly criarConversaUseCase: CriarConversaUseCase,
   /*    private readonly criarNovaConversaComMesmoSessionIdUseCase: CriarConversaRelacionadaAoSessionIdUseCase,
       private readonly finalizarConversasAbandonadasUseCase: FinalizarConversasAbandonadas,
       private readonly processarNovaMensagemUseCase: ProcessarNovaMensagemUseCase,
       private readonly reabrirConversaUseCase: ReabrirConversaUseCase,*/
    ) {}

    async criarConversa(request: FastifyRequest, reply: FastifyReply): Promise<void> {
        const {ultimaMensagemEm, canal, idPessoa, flowId } = request.body as {
            ultimaMensagemEm: Date;
            canal: Canal;
            idPessoa: string;
            flowId: string;
        };

        await this.criarConversaUseCase.executar({
            ultimaMensagemEm,
            canal,
            idPessoa,
            flowId
        });

        reply.status(201).send();
    }
    
}