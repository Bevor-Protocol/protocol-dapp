-- CreateEnum
CREATE TYPE "AuditStatus" AS ENUM ('OPEN', 'ATTESTATION', 'ONGOING', 'FINAL');

-- CreateEnum
CREATE TYPE "AuditorStatus" AS ENUM ('VERIFIED', 'REQUESTED', 'REJECTED');

-- CreateTable
CREATE TABLE "Users" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "auditeeRole" BOOLEAN NOT NULL DEFAULT false,
    "auditorRole" BOOLEAN NOT NULL DEFAULT false,
    "name" TEXT,
    "image" TEXT,
    "available" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Audits" (
    "id" TEXT NOT NULL,
    "auditeeId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "markdown" TEXT,
    "price" INTEGER NOT NULL DEFAULT 0,
    "duration" INTEGER NOT NULL DEFAULT 6,
    "status" "AuditStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Audits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Auditors" (
    "auditId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "AuditorStatus" NOT NULL,
    "attestedTerms" BOOLEAN NOT NULL DEFAULT false,
    "acceptedTerms" BOOLEAN NOT NULL DEFAULT false
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_address_key" ON "Users"("address");

-- CreateIndex
CREATE UNIQUE INDEX "Auditors_auditId_userId_key" ON "Auditors"("auditId", "userId");

-- AddForeignKey
ALTER TABLE "Audits" ADD CONSTRAINT "Audits_auditeeId_fkey" FOREIGN KEY ("auditeeId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Auditors" ADD CONSTRAINT "Auditors_auditId_fkey" FOREIGN KEY ("auditId") REFERENCES "Audits"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Auditors" ADD CONSTRAINT "Auditors_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
