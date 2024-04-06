/*
  Warnings:

  - You are about to drop the column `markdown` on the `Audits` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Auditors" DROP CONSTRAINT "Auditors_auditId_fkey";

-- DropForeignKey
ALTER TABLE "Auditors" DROP CONSTRAINT "Auditors_userId_fkey";

-- DropForeignKey
ALTER TABLE "Audits" DROP CONSTRAINT "Audits_auditeeId_fkey";

-- AlterTable
ALTER TABLE "Auditors" ADD COLUMN     "findings" TEXT;

-- AlterTable
ALTER TABLE "Audits" DROP COLUMN "markdown",
ADD COLUMN     "details" TEXT;

-- AddForeignKey
ALTER TABLE "Audits" ADD CONSTRAINT "Audits_auditeeId_fkey" FOREIGN KEY ("auditeeId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Auditors" ADD CONSTRAINT "Auditors_auditId_fkey" FOREIGN KEY ("auditId") REFERENCES "Audits"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Auditors" ADD CONSTRAINT "Auditors_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
