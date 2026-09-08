import { describe, expect, it, beforeEach, afterAll } from '@jest/globals';
import { Conversation } from './Conversation.js';
import { Canal } from '../../value-objects/Canal.js';
import { MotivoFinalizacao } from '../../value-objects/MotivoFinalizacao.js';
import { PrismaConversationRepository } from "../../../infrastructure/database/prisma/PrismaConversationRepository.js";
import { prisma } from "../../../infrastructure/database/prisma/prisma.js";
import { CriarConversaUseCase } from "../../../application/use-cases/conversa/criarConversa/criarConversa.usecase.js";
import { request } from 'https';
import { buildApp } from '../../../main/app.js';

describe('CriarConversa', () => {
        beforeEach ( async () => {
            await prisma.conversation.deleteMany();
        });

        afterAll(async () => {
            await prisma.$disconnect();
        })

        it('deve criar uma conversa no banco de dados', async () => {

            const repository = new PrismaConversationRepository(prisma);
            const sut = new CriarConversaUseCase(repository);

            const conversa = await sut.executar({
                ultimaMensagemEm: new Date("2024-11-17T08:42:31.527Z"),
                canal: Canal.WHATSAPP,
                idPessoa: "123",
                flowId: "flow1"
            });
            expect(conversa).toEqual(expect.objectContaining({                
                ultimaMensagemEm: new Date("2024-11-17T08:42:31.527Z"),
                canal: Canal.WHATSAPP,
                idPessoa: "123",
                flowId: "flow1"
            }))

            const userOnDatabase = await prisma.conversation.findFirst({
                where: {
                    idPessoa: "123"
                }
            })

            expect(userOnDatabase).not.toBeNull();
            expect(userOnDatabase).toEqual(expect.objectContaining({
                ultimaMensagemEm: new Date("2024-11-17T08:42:31.527Z"),
                canal: Canal.WHATSAPP,
                idPessoa: "123",
                flowId: "flow1"
            }))
        });
});

describe('Post /conversas', () => {
    beforeEach(async () => {
        await prisma.conversation.deleteMany();
    })

    afterAll(async () => {
        await prisma.$disconnect();
    })

    it('deve criar uma conversa', async () => {
     const testApp = await buildApp();
     const response = await testApp.app.inject({
      method: "POST",
      url: "/conversas/criar",
      payload: {
        ultimaMensagemEm: "2024-11-17T08:42:31.527Z",
        canal: Canal.WHATSAPP,
        idPessoa: "123",
        flowId: "flow1",
      },
    });

    expect(response.statusCode).toBe(201);

    expect(response.body).toEqual(
      expect.objectContaining({
        ultimaMensagemEm: new Date("2024-11-17T08:42:31.527Z"),
        canal: Canal.WHATSAPP,
        idPessoa: "123",
        flowId: "flow1"
      }),
    );

    const user = await prisma.conversation.findFirst({
      where: {
        idPessoa: "123",
      },
    });

    expect(user).not.toBeNull();
  });
})
