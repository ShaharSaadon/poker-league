'use server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function updateBuyIn(
  playerId: string,
  gameId: string,
  amount: number
) {
  try {
    await prisma.buyIn.create({
      data: {
        playerId,
        gameId,
        amount,
      },
    });
    console.log(`Buy-ins updated for player ${playerId}`);
  } catch (error) {
    console.error(`Failed to update buy-ins for player ${playerId}:`, error);
  }
}
