/*
  Warnings:

  - A unique constraint covering the columns `[currentGameId]` on the table `Table` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Game_tableId_key";

-- AlterTable
ALTER TABLE "Table" ADD COLUMN     "currentGameId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Table_currentGameId_key" ON "Table"("currentGameId");

-- RenameForeignKey
ALTER TABLE "Game" RENAME CONSTRAINT "Game_tableId_fkey" TO "Game_AllGames_fkey";

-- AddForeignKey
ALTER TABLE "Table" ADD CONSTRAINT "Table_CurrentGame_fkey" FOREIGN KEY ("currentGameId") REFERENCES "Game"("id") ON DELETE SET NULL ON UPDATE CASCADE;
