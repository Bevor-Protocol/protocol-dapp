/*
  Warnings:

  - You are about to drop the column `isFinal` on the `Terms` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Audit" ADD COLUMN     "isFinal" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isLocked" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Terms" DROP COLUMN "isFinal";
