-- CreateTable
CREATE TABLE "HistoryView" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "historyId" TEXT NOT NULL,
    "hasViewed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "HistoryView_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HistoryView_userId_historyId_key" ON "HistoryView"("userId", "historyId");

-- AddForeignKey
ALTER TABLE "HistoryView" ADD CONSTRAINT "HistoryView_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoryView" ADD CONSTRAINT "HistoryView_historyId_fkey" FOREIGN KEY ("historyId") REFERENCES "History"("id") ON DELETE CASCADE ON UPDATE CASCADE;
