/*
  Warnings:

  - You are about to drop the column `playerIds` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the `_PlayerGames` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_PlayerTables` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_PlayerGames" DROP CONSTRAINT "_PlayerGames_A_fkey";

-- DropForeignKey
ALTER TABLE "_PlayerGames" DROP CONSTRAINT "_PlayerGames_B_fkey";

-- DropForeignKey
ALTER TABLE "_PlayerTables" DROP CONSTRAINT "_PlayerTables_A_fkey";

-- DropForeignKey
ALTER TABLE "_PlayerTables" DROP CONSTRAINT "_PlayerTables_B_fkey";

-- AlterTable
ALTER TABLE "Game" DROP COLUMN "playerIds",
ADD COLUMN     "tableId" TEXT;

-- DropTable
DROP TABLE "_PlayerGames";

-- DropTable
DROP TABLE "_PlayerTables";

-- CreateTable
CREATE TABLE "BuyIn" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BuyIn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameSummary" (
    "id" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "owesToId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GameSummary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayerOnGame" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,

    CONSTRAINT "PlayerOnGame_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayerOnTable" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "tableId" TEXT NOT NULL,

    CONSTRAINT "PlayerOnTable_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_tableId_fkey" FOREIGN KEY ("tableId") REFERENCES "Table"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuyIn" ADD CONSTRAINT "BuyIn_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuyIn" ADD CONSTRAINT "BuyIn_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameSummary" ADD CONSTRAINT "GameSummary_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameSummary" ADD CONSTRAINT "GameSummary_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameSummary" ADD CONSTRAINT "GameSummary_owesToId_fkey" FOREIGN KEY ("owesToId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerOnGame" ADD CONSTRAINT "PlayerOnGame_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerOnGame" ADD CONSTRAINT "PlayerOnGame_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerOnTable" ADD CONSTRAINT "PlayerOnTable_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerOnTable" ADD CONSTRAINT "PlayerOnTable_tableId_fkey" FOREIGN KEY ("tableId") REFERENCES "Table"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
