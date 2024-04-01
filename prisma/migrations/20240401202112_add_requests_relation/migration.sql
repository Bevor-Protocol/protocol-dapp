-- CreateTable
CREATE TABLE "_UserRequests" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserRequests_AB_unique" ON "_UserRequests"("A", "B");

-- CreateIndex
CREATE INDEX "_UserRequests_B_index" ON "_UserRequests"("B");

-- AddForeignKey
ALTER TABLE "_UserRequests" ADD CONSTRAINT "_UserRequests_A_fkey" FOREIGN KEY ("A") REFERENCES "Audit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserRequests" ADD CONSTRAINT "_UserRequests_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
