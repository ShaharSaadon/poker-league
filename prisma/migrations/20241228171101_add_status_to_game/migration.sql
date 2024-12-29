-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "host" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'Playing';
