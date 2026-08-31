-- CreateEnum
CREATE TYPE "Canal" AS ENUM ('WHATSAPP', 'WEB', 'TELEGRAM');

-- CreateEnum
CREATE TYPE "MotivoFinalizacao" AS ENUM ('CONCLUIDA', 'HANDOFF', 'RECUSADA', 'ABANDONO');

-- CreateTable
CREATE TABLE "Conversation" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "canal" "Canal" NOT NULL,
    "idPessoa" TEXT NOT NULL,
    "flowId" TEXT NOT NULL,
    "dadosColetados" JSONB NOT NULL DEFAULT '{}',
    "iniciadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ultimaMensagemEm" TIMESTAMP(3),
    "finalizadaEm" TIMESTAMP(3),
    "motivoFinalizacao" "MotivoFinalizacao",
    "ultimoFlowId" TEXT NOT NULL DEFAULT '',
    "ultimoNodeId" TEXT NOT NULL DEFAULT '',
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "csat" DOUBLE PRECISION,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Conversation_idPessoa_idx" ON "Conversation"("idPessoa");

-- CreateIndex
CREATE INDEX "Conversation_sessionId_idx" ON "Conversation"("sessionId");

-- CreateIndex
CREATE INDEX "Conversation_flowId_idx" ON "Conversation"("flowId");

-- CreateIndex
CREATE INDEX "Conversation_canal_idx" ON "Conversation"("canal");

-- CreateIndex
CREATE INDEX "Conversation_iniciadoEm_idx" ON "Conversation"("iniciadoEm");

-- CreateIndex
CREATE INDEX "Conversation_finalizadaEm_idx" ON "Conversation"("finalizadaEm");
