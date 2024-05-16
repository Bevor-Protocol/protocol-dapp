/*
  Warnings:

  - The required column `id` was added to the `Auditors` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `updatedAt` to the `Auditors` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "HistoryAction" AS ENUM ('APPROVED', 'REJECTED', 'LEFT', 'LOCKED', 'OPENED', 'EDITED', 'FINALIZED', 'FINDINGS', 'MINTED');

-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('AUDITEE', 'AUDITOR');

-- AlterTable
ALTER TABLE "Auditors" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD CONSTRAINT "Auditors_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "History" (
    "id" TEXT NOT NULL,
    "auditId" TEXT NOT NULL,
    "auditorId" TEXT,
    "action" "HistoryAction" NOT NULL,
    "userType" "UserType" NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "History_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_history_audit" ON "History"("auditId");

-- CreateIndex
CREATE INDEX "idx_history_auditor" ON "History"("auditorId");

-- AddForeignKey
ALTER TABLE "History" ADD CONSTRAINT "History_auditId_fkey" FOREIGN KEY ("auditId") REFERENCES "Audits"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "History" ADD CONSTRAINT "History_auditorId_fkey" FOREIGN KEY ("auditorId") REFERENCES "Auditors"("id") ON DELETE CASCADE ON UPDATE CASCADE;
