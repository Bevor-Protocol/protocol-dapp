-- DropForeignKey
ALTER TABLE "Audit" DROP CONSTRAINT "Audit_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "AuditMembership" DROP CONSTRAINT "AuditMembership_userId_fkey";

-- DropForeignKey
ALTER TABLE "AuditMembership" DROP CONSTRAINT "AuditMembership_auditId_fkey";

-- DropForeignKey
ALTER TABLE "Action" DROP CONSTRAINT "Action_membershipId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_userId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_actionId_fkey";

-- DropForeignKey
ALTER TABLE "Wishlist" DROP CONSTRAINT "Wishlist_senderId_fkey";

-- DropForeignKey
ALTER TABLE "Wishlist" DROP CONSTRAINT "Wishlist_receiverId_fkey";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "Audit";

-- DropTable
DROP TABLE "AuditMembership";

-- DropTable
DROP TABLE "Action";

-- DropTable
DROP TABLE "Notification";

-- DropTable
DROP TABLE "Wishlist";

-- DropEnum
DROP TYPE "AuditStatusType";

-- DropEnum
DROP TYPE "MembershipStatusType";

-- DropEnum
DROP TYPE "ActionType";

-- DropEnum
DROP TYPE "RoleType";

