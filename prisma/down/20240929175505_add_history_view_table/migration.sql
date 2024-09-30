-- DropForeignKey
ALTER TABLE "HistoryView" DROP CONSTRAINT "HistoryView_userId_fkey";

-- DropForeignKey
ALTER TABLE "HistoryView" DROP CONSTRAINT "HistoryView_historyId_fkey";

-- DropTable
DROP TABLE "HistoryView";

