/*
  Warnings:

  - The values [OPEN,ONGOING,FINAL] on the enum `AuditStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AuditStatus_new" AS ENUM ('DISCOVERY', 'ATTESTATION', 'AUDITING', 'CHALLENGEABLE', 'FINALIZED');
ALTER TABLE "Audits" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Audits" ALTER COLUMN "status" TYPE "AuditStatus_new" USING ("status"::text::"AuditStatus_new");
ALTER TYPE "AuditStatus" RENAME TO "AuditStatus_old";
ALTER TYPE "AuditStatus_new" RENAME TO "AuditStatus";
DROP TYPE "AuditStatus_old";
ALTER TABLE "Audits" ALTER COLUMN "status" SET DEFAULT 'DISCOVERY';
COMMIT;

-- AlterTable
ALTER TABLE "Audits" ALTER COLUMN "status" SET DEFAULT 'DISCOVERY';
