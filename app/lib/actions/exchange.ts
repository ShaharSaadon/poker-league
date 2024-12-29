'use server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export async function calculateExchanges(
  gameId: string,
  finalBalances: Record<string, number>
) {
  try {
    const players = Object.keys(finalBalances);
    const exchanges: {
      fromPlayerId: string;
      toPlayerId: string;
      amount: number;
    }[] = [];

    players.forEach((payer) => {
      players.forEach((payee) => {
        if (finalBalances[payer] < 0 && finalBalances[payee] > 0) {
          const amount = Math.min(
            Math.abs(finalBalances[payer]),
            finalBalances[payee]
          );
          if (amount > 0) {
            exchanges.push({ fromPlayerId: payer, toPlayerId: payee, amount });
            finalBalances[payer] += amount;
            finalBalances[payee] -= amount;
          }
        }
      });
    });

    for (const exchange of exchanges) {
      await prisma.exchange.create({
        data: {
          fromPlayerId: exchange.fromPlayerId,
          toPlayerId: exchange.toPlayerId,
          gameId,
          amount: exchange.amount,
        },
      });
    }

    console.log('Exchanges recorded:', exchanges);
    return exchanges; // Return the exchanges array
  } catch (error) {
    console.error('Failed to calculate exchanges:', error);
    throw error;
  }
}
