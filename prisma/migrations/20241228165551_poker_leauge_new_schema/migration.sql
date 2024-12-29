/*
  Warnings:

  - You are about to drop the column `amount` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `host` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `playerIds` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `totalGamesPlayed` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `totalMoneyEarned` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the `GameSummary` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PlayerOnGame` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PlayerOnTable` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[tableId]` on the table `Game` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `Player` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `startAmount` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Made the column `createdById` on table `Game` required. This step will fail if there are existing NULL values in that column.
  - Made the column `tableId` on table `Game` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdById` on table `Table` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Game" DROP CONSTRAINT "Game_createdById_fkey";

-- DropForeignKey
ALTER TABLE "Game" DROP CONSTRAINT "Game_tableId_fkey";

-- DropForeignKey
ALTER TABLE "GameSummary" DROP CONSTRAINT "GameSummary_gameId_fkey";

-- DropForeignKey
ALTER TABLE "GameSummary" DROP CONSTRAINT "GameSummary_owesToId_fkey";

-- DropForeignKey
ALTER TABLE "GameSummary" DROP CONSTRAINT "GameSummary_playerId_fkey";

-- DropForeignKey
ALTER TABLE "PlayerOnGame" DROP CONSTRAINT "PlayerOnGame_gameId_fkey";

-- DropForeignKey
ALTER TABLE "PlayerOnGame" DROP CONSTRAINT "PlayerOnGame_playerId_fkey";

-- DropForeignKey
ALTER TABLE "PlayerOnTable" DROP CONSTRAINT "PlayerOnTable_playerId_fkey";

-- DropForeignKey
ALTER TABLE "PlayerOnTable" DROP CONSTRAINT "PlayerOnTable_tableId_fkey";

-- DropForeignKey
ALTER TABLE "Table" DROP CONSTRAINT "Table_createdById_fkey";

-- DropIndex
DROP INDEX "Player_email_key";

-- AlterTable
ALTER TABLE "BuyIn" ALTER COLUMN "amount" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Game" DROP COLUMN "amount",
DROP COLUMN "date",
DROP COLUMN "host",
DROP COLUMN "playerIds",
DROP COLUMN "status",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "finishedAt" TIMESTAMP(3),
ADD COLUMN     "startAmount" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "createdById" SET NOT NULL,
ALTER COLUMN "tableId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Player" DROP COLUMN "imageUrl",
DROP COLUMN "totalGamesPlayed",
DROP COLUMN "totalMoneyEarned",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "userId" TEXT,
ALTER COLUMN "email" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Table" ALTER COLUMN "createdById" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "playerId" TEXT;

-- DropTable
DROP TABLE "GameSummary";

-- DropTable
DROP TABLE "PlayerOnGame";

-- DropTable
DROP TABLE "PlayerOnTable";

-- CreateTable
CREATE TABLE "Exchange" (
    "id" TEXT NOT NULL,
    "fromPlayerId" TEXT NOT NULL,
    "toPlayerId" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reminderSent" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Exchange_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_TablePlayers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_TablePlayers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_UserRegisteredTables" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_UserRegisteredTables_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_PlayerGames" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PlayerGames_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_TablePlayers_B_index" ON "_TablePlayers"("B");

-- CreateIndex
CREATE INDEX "_UserRegisteredTables_B_index" ON "_UserRegisteredTables"("B");

-- CreateIndex
CREATE INDEX "_PlayerGames_B_index" ON "_PlayerGames"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Game_tableId_key" ON "Game"("tableId");

-- CreateIndex
CREATE UNIQUE INDEX "Player_userId_key" ON "Player"("userId");

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Table" ADD CONSTRAINT "Table_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_tableId_fkey" FOREIGN KEY ("tableId") REFERENCES "Table"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exchange" ADD CONSTRAINT "Exchange_fromPlayerId_fkey" FOREIGN KEY ("fromPlayerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exchange" ADD CONSTRAINT "Exchange_toPlayerId_fkey" FOREIGN KEY ("toPlayerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exchange" ADD CONSTRAINT "Exchange_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TablePlayers" ADD CONSTRAINT "_TablePlayers_A_fkey" FOREIGN KEY ("A") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TablePlayers" ADD CONSTRAINT "_TablePlayers_B_fkey" FOREIGN KEY ("B") REFERENCES "Table"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserRegisteredTables" ADD CONSTRAINT "_UserRegisteredTables_A_fkey" FOREIGN KEY ("A") REFERENCES "Table"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserRegisteredTables" ADD CONSTRAINT "_UserRegisteredTables_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PlayerGames" ADD CONSTRAINT "_PlayerGames_A_fkey" FOREIGN KEY ("A") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PlayerGames" ADD CONSTRAINT "_PlayerGames_B_fkey" FOREIGN KEY ("B") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;
