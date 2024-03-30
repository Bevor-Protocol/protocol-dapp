-- DropForeignKey
ALTER TABLE "Terms" DROP CONSTRAINT "Terms_auditId_fkey";

-- AddForeignKey
ALTER TABLE "Terms" ADD CONSTRAINT "Terms_auditId_fkey" FOREIGN KEY ("auditId") REFERENCES "Audit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
