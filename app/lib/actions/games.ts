'use server';

import { PrismaClient } from '@prisma/client';
import { ITEMS_PER_PAGE, State } from '../definitions';
import { formatCurrency } from '../utils';

const prisma = new PrismaClient();

export async function getGames() {
  try {
    const games = await prisma.game.findMany({
      select: {
        id: true,
        players: {
          select: {
            id: true,
            name: true,
          },
        },
        createdAt: true,
      },
    });

    // Format the data if needed
    return games.map((game) => ({
      id: game.id,
      players: game.players.map((player) => ({
        id: player.id,
        name: player.name,
      })),
      date: game.createdAt,
    }));
  } catch (error) {
    console.error('Failed to fetch games:', error);
    throw new Error('Failed to fetch games.');
  }
}

export async function getGameById(id: string) {
  try {
    const game = await prisma.game.findUnique({
      where: { id },
      include: {
        players: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!game) {
      throw new Error('Game not found.');
    }

    return {
      id: game.id,
      startAmount: game.startAmount,
      status: game.status,
      tableId: game.tableId,
      createdById: game.createdById,
      createdAt: new Date(),
      host: game.host,
      finishedAt: null,
      players: game.players.map((player) => ({
        id: player.id,
        name: player.name,
        email: player.email,
      })),
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch game.');
  }
}

export async function createGame({
  host,
  tableId,
  playerIds,
  startAmount,
  createdById,
}: {
  host: string;
  tableId: string;
  playerIds: string[];
  startAmount: number;
  createdById: string;
}) {
  try {
    console.log('host:', host);
    console.log('tableId:', tableId);
    console.log('playerIds:', playerIds);
    console.log('startAmount:', startAmount);
    console.log('createdById:', createdById);
    const game = await prisma.game.create({
      data: {
        host,
        startAmount,
        table: {
          connect: {
            id: tableId, // Ensure tableId is valid
          },
        },
        createdBy: {
          connect: {
            id: createdById,
          },
        },
        players: {
          connect: playerIds.map((playerId) => ({ id: playerId })),
        },
      },
    });

    return game;
  } catch (error) {
    console.error('Error creating game:', error);
    throw new Error('Failed to create game.');
  }
}

export async function updateGame(
  id: string,
  prevState: State,
  formData: FormData
): Promise<State> {
  const playerIds = formData.getAll('playerIds') as string[];

  // Validate the form data
  if (!playerIds || playerIds.length === 0) {
    return {
      ...prevState,
      errors: { playerIds: ['Please select at least one player.'] },
      message: 'Missing Fields. Failed to Update Game.',
    };
  }

  try {
    // Update the game and its associated players
    await prisma.game.update({
      where: { id },
      data: {
        players: {
          set: playerIds.map((playerId) => ({ id: playerId })), // Replace existing players with new ones
        },
      },
    });

    return {
      ...prevState,
      errors: {},
      message: 'Game updated successfully!',
    };
  } catch (error) {
    console.error('Database Error:', error);

    return {
      ...prevState,
      errors: {},
      message: 'Database Error: Failed to Update Game.',
      error,
    };
  }
}

export async function getLatestGames() {
  try {
    // Fetch the latest 5 games with associated data
    const latestGames = await prisma.game.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        players: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        table: {
          select: {
            id: true,
            name: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Format the data
    const formattedGames = latestGames.map((game) => ({
      id: game.id,
      date: game.createdAt,
      status: game.status,
      host: game.host,
      table: {
        id: game.table.id,
        name: game.table.name,
      },
      createdBy: {
        id: game.createdBy.id,
        name: game.createdBy.name,
      },
      startAmount: formatCurrency(game.startAmount),
      players: game.players.map((player) => ({
        id: player.id,
        name: player.name,
        email: player.email,
      })),
    }));

    return formattedGames;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest games.');
  }
}

export async function fetchFilteredGames(query: string, currentPage: number) {
  const skip = (currentPage - 1) * ITEMS_PER_PAGE;
  const take = ITEMS_PER_PAGE;

  // Helper to check if a query is a valid date
  const isValidDate = (value: string) => {
    const date = new Date(value);
    return !isNaN(date.getTime());
  };

  try {
    const games = await prisma.game.findMany({
      where: {
        OR: [
          {
            players: {
              some: {
                name: {
                  contains: query,
                  mode: 'insensitive',
                },
              },
            },
          },
          {
            players: {
              some: {
                email: {
                  contains: query,
                  mode: 'insensitive',
                },
              },
            },
          },
          {
            startAmount: {
              equals: isNaN(Number(query)) ? undefined : Number(query),
            },
          },
          {
            createdAt: {
              equals: isValidDate(query) ? new Date(query) : undefined,
            },
          },
          {
            status: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            host: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take,
      include: {
        players: {
          select: {
            id: true,
            name: true,
            buyIns: {
              select: {
                amount: true,
              },
            },
          },
        },
        table: {
          select: {
            id: true,
            name: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        buyIns: {
          select: {
            amount: true,
          },
        },
      },
    });

    // Helper function to calculate totalAmount (accumulated buy-ins)
    const calculateTotalAmount = (buyIns: { amount: number }[]) =>
      buyIns.reduce((total, buyIn) => total + buyIn.amount, 0);

    // Format the results
    const formattedGames = games.map((game) => ({
      id: game.id,
      date: game.createdAt,
      totalAmount: calculateTotalAmount(game.buyIns),
      host: game.host,
      totalHands: game.players.length,
      status: game.status,
      table: {
        id: game.table?.id,
        name: game.table?.name,
      },
      createdBy: {
        id: game.createdBy?.id,
        name: game.createdBy?.name,
        email: game.createdBy?.email,
      },
      players: game.players.map((player) => ({
        id: player.id,
        name: player.name,
        totalPlayerBuyIns: calculateTotalAmount(player.buyIns),
      })),
    }));

    return formattedGames;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch games.');
  }
}
