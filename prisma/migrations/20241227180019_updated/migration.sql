/*
  Warnings:

  - You are about to drop the column `createdBy` on the `Table` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "createdById" TEXT;

-- AlterTable
ALTER TABLE "Table" DROP COLUMN "createdBy",
ADD COLUMN     "createdById" TEXT;

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PlayerTables" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PlayerTables_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_PlayerGames" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PlayerGames_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "_PlayerTables_B_index" ON "_PlayerTables"("B");

-- CreateIndex
CREATE INDEX "_PlayerGames_B_index" ON "_PlayerGames"("B");

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Table" ADD CONSTRAINT "Table_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PlayerTables" ADD CONSTRAINT "_PlayerTables_A_fkey" FOREIGN KEY ("A") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PlayerTables" ADD CONSTRAINT "_PlayerTables_B_fkey" FOREIGN KEY ("B") REFERENCES "Table"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PlayerGames" ADD CONSTRAINT "_PlayerGames_A_fkey" FOREIGN KEY ("A") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PlayerGames" ADD CONSTRAINT "_PlayerGames_B_fkey" FOREIGN KEY ("B") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;
