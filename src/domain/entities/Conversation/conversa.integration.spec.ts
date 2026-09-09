import { describe, expect, it, beforeEach, afterAll } from '@jest/globals';
import { Canal } from '../../value-objects/Canal.js';
import { PrismaConversationRepository } from "../../../infrastructure/database/prisma/PrismaConversationRepository.js";
import { prisma } from "../../../infrastructure/database/prisma/prisma.js";
import { CriarConversaUseCase } from "../../../application/use-cases/conversa/criarConversa/criarConversa.usecase.js";
import { buildApp } from '../../../main/app.js';

describe('CriarConversa', () => {
    beforeEach(async () => {
        await prisma.conversation.deleteMany();
    });

it('deve criar uma conversa no banco de dados', async () => {

    const repository = new PrismaConversationRepository(prisma);

    const sut = new CriarConversaUseCase(repository);


    const conversa = await sut.executar({
        ultimaMensagemEm: new Date('2024-11-17T08:42:31.527Z'),
        canal: Canal.WHATSAPP,
        idPessoa: '123',
        flowId: 'flow1',
    });


    expect(conversa).toEqual(
        expect.objectContaining({
            ultimaMensagemEm:new Date('2024-11-17T08:42:31.527Z'),
            canal: Canal.WHATSAPP,
            idPessoa: '123',
            flowId: 'flow1',
        }),
    );


    const conversationOnDatabase =
        await prisma.conversation.findFirst({
            where: {
                idPessoa: '123',
            },
        });


    expect(conversationOnDatabase).not.toBeNull();


    expect(conversationOnDatabase).toEqual(
        expect.objectContaining({
            ultimaMensagemEm:new Date('2024-11-17T08:42:31.527Z'),
            canal: Canal.WHATSAPP,
            idPessoa: '123',
            flowId: 'flow1',
        }),
    );
});

});

describe('POST /conversas/criar', () => {

beforeEach(async () => {
    await prisma.conversation.deleteMany();
});


it('deve criar uma conversa', async () => {

    const testApp = await buildApp();


    const response =
        await testApp.app.inject({
            method: 'POST',
            url: '/conversas/criar',
            payload: {
                ultimaMensagemEm:
                    '2024-11-17T08:42:31.527Z',
                canal: Canal.WHATSAPP,
                idPessoa: '123',
                flowId: 'flow1',
            },
        });


    expect(response.statusCode)
        .toBe(201);
});

});

describe('POST /conversas/finalizarAbandonadas', () => {

beforeEach(async () => {
    await prisma.conversation.deleteMany();
});


it('deve finalizar uma conversa que excedeu o limite de tempo da janela', async () => {

    const testApp =
        await buildApp();


    const response =
        await testApp.app.inject({
            method: 'POST',
            url: '/conversas/finalizarAbandonadas',
            payload: {
                janelaMinutos: '1440',
            },
        });


    expect(response.statusCode)
        .toBe(200);
});

});

describe('POST /conversas/processarNovaMensagem', () => {

beforeEach(async () => {

    await prisma.conversation.deleteMany();


    const repository =
        new PrismaConversationRepository(prisma);


    const sut =
        new CriarConversaUseCase(repository);


    await sut.executar({
        ultimaMensagemEm: new Date('2026-09-01T18:00:00.000Z'),
        canal: Canal.WHATSAPP,
        idPessoa: '123',
        flowId: 'flow1',
    });
});


it('deve processar uma nova mensagem e reabrir uma conversa antiga ou criar uma nova', async () => {

    const userOnDatabase =
        await prisma.conversation.findFirst({
            where: {
                idPessoa: '123',
            },
        });


    expect(userOnDatabase).not.toBeNull();


    const testApp = await buildApp();


    const response = await testApp.app.inject({
            method: 'POST',
            url: '/conversas/processarNovaMensagem',
            payload: {
                sessionId:
                    userOnDatabase!.sessionId,
                dataMensagemNova:
                    '2026-09-02T18:00:00.000Z',
            },
        });
        
    expect(response.statusCode)
        .toBe(200);
});

});