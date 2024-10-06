-- CreateEnum
CREATE TYPE "AuditStatusType" AS ENUM ('DISCOVERY', 'ATTESTATION', 'AUDITING', 'CHALLENGEABLE', 'FINALIZED');

-- CreateEnum
CREATE TYPE "MembershipStatusType" AS ENUM ('VERIFIED', 'REQUESTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "ActionType" AS ENUM ('AUDITOR_TERMS_APPROVED', 'AUDITOR_TERMS_REJECTED', 'AUDITOR_FINDINGS', 'AUDITOR_LEFT', 'OWNER_APPROVED', 'OWNER_LOCKED', 'OWNER_OPENED', 'OWNER_EDITED', 'OWNER_FINALIZED', 'OWNER_REVEALED');

-- CreateEnum
CREATE TYPE "RoleType" AS ENUM ('OWNER', 'AUDITOR');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "ownerRole" BOOLEAN NOT NULL DEFAULT false,
    "auditorRole" BOOLEAN NOT NULL DEFAULT false,
    "name" TEXT,
    "image" TEXT,
    "available" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Audit" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "details" TEXT,
    "price" INTEGER NOT NULL DEFAULT 0,
    "duration" INTEGER NOT NULL DEFAULT 30,
    "cliff" INTEGER NOT NULL DEFAULT 3,
    "token" TEXT,
    "onchainAuditInfoId" TEXT,
    "onchainNftId" TEXT,
    "status" "AuditStatusType" NOT NULL DEFAULT 'DISCOVERY',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Audit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditMembership" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "auditId" TEXT NOT NULL,
    "role" "RoleType" NOT NULL,
    "status" "MembershipStatusType" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "attestedTerms" BOOLEAN NOT NULL DEFAULT false,
    "acceptedTerms" BOOLEAN NOT NULL DEFAULT false,
    "findings" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AuditMembership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Action" (
    "id" TEXT NOT NULL,
    "membershipId" TEXT NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "ActionType" NOT NULL,

    CONSTRAINT "Action_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "actionId" TEXT NOT NULL,
    "hasViewed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wishlist" (
    "id" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Wishlist_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_address_key" ON "User"("address");

-- CreateIndex
CREATE INDEX "AuditMembership_userId_auditId_isActive_idx" ON "AuditMembership"("userId", "auditId", "isActive");

-- CreateIndex
CREATE INDEX "AuditMembership_userId_auditId_isActive_status_idx" ON "AuditMembership"("userId", "auditId", "isActive", "status");

-- CreateIndex
CREATE UNIQUE INDEX "AuditMembership_userId_auditId_key" ON "AuditMembership"("userId", "auditId");

-- CreateIndex
CREATE INDEX "Notification_userId_idx" ON "Notification"("userId");

-- CreateIndex
CREATE INDEX "Notification_userId_hasViewed_idx" ON "Notification"("userId", "hasViewed");

-- CreateIndex
CREATE UNIQUE INDEX "Notification_userId_actionId_key" ON "Notification"("userId", "actionId");

-- CreateIndex
CREATE UNIQUE INDEX "Wishlist_senderId_receiverId_key" ON "Wishlist"("senderId", "receiverId");

-- AddForeignKey
ALTER TABLE "Audit" ADD CONSTRAINT "Audit_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditMembership" ADD CONSTRAINT "AuditMembership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditMembership" ADD CONSTRAINT "AuditMembership_auditId_fkey" FOREIGN KEY ("auditId") REFERENCES "Audit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Action" ADD CONSTRAINT "Action_membershipId_fkey" FOREIGN KEY ("membershipId") REFERENCES "AuditMembership"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "Action"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wishlist" ADD CONSTRAINT "Wishlist_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wishlist" ADD CONSTRAINT "Wishlist_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
