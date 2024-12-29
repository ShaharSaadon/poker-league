'use server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getPlayers() {
  try {
    const players = await prisma.player.findMany({
      select: {
        id: true,
        name: true,
        createdAt: true,
        userId: true,
        email: true,
        buyIns: true,
        gameBuyIns: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return players;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all players.');
  }
}

export async function getPlayersByTable(tableId: string) {
  return await prisma.player.findMany({
    where: {
      tables: {
        some: {
          id: tableId,
        },
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
      userId: true,
      createdAt: true,
      gameBuyIns: true,
      buyIns: true,
      exchangesSent: true,
      exchangesReceived: true,
    },
  });
}
export async function getPlayersByGame(gameId: string): Promise<
  {
    id: string;
    name: string;
    email: string | null;
    userId: string | null;
    createdAt: Date;
    gameBuyIns: number[];
    buyIns: { amount: number; gameId: string }[];
    exchangesSent: { id: string; amount: number; toPlayerId: string }[];
    exchangesReceived: { id: string; amount: number; fromPlayerId: string }[];
  }[]
> {
  try {
    const players = await prisma.player.findMany({
      where: {
        games: {
          some: { id: gameId }, // Filter players connected to the specific game
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        userId: true,
        createdAt: true,
        buyIns: {
          where: { gameId },
          select: {
            amount: true,
            gameId: true,
          },
        },
        exchangesSent: {
          select: {
            id: true,
            amount: true,
            toPlayerId: true,
          },
        },
        exchangesReceived: {
          select: {
            id: true,
            amount: true,
            fromPlayerId: true,
          },
        },
      },
    });

    // Add `gameBuyIns` as an array of buy-in amounts for the specific game
    return players.map((player) => ({
      ...player,
      gameBuyIns: player.buyIns.map((buyIn) => buyIn.amount), // Extract amounts for the game
    }));
  } catch (error) {
    console.error('Error fetching players by game:', error);
    throw new Error('Failed to fetch players for the specific game.');
  }
}
