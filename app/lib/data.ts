import { sql } from '@vercel/postgres';
import { ITEMS_PER_PAGE, Revenue } from './definitions';
import { formatCurrency } from './utils';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// export const data = await sql<LatestGameRaw>`
//   SELECT games.amount, players.name, players.image_url, players.email
//   FROM games
//   JOIN players ON games.player_id = players.id
//   ORDER BY games.date DESC
//   LIMIT 5`;

export async function fetchRevenue() {
  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    const data = await sql<Revenue>`SELECT * FROM revenue`;

    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchCardData() {
  try {
    const gameCountPromise = prisma.game.count();
    const playerCountPromise = prisma.player.count();
    const gamesPromise = prisma.game.findMany({
      select: {
        status: true,
        startAmount: true,
      },
    });

    const [numberOfGames, numberOfPlayers, games] = await Promise.all([
      gameCountPromise,
      playerCountPromise,
      gamesPromise,
    ]);

    const totals = games.reduce((acc, game) => {
      acc += game.startAmount;
      return acc;
    }, 0);

    const totalGames = formatCurrency(totals);

    return {
      numberOfPlayers,
      numberOfGames,
      totalGames,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

export async function fetchGamesPages(query: string) {
  // Helper to check if a query is a valid date
  const isValidDate = (value: string) => {
    const date = new Date(value);
    return !isNaN(date.getTime());
  };

  try {
    const totalGames = await prisma.game.count({
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
        ],
      },
    });

    // Calculate the total number of pages
    const totalPages = Math.ceil(totalGames / ITEMS_PER_PAGE);

    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of games.');
  }
}

export async function fetchFilteredPlayers(query: string) {
  try {
    // Fetch players and aggregate game data
    const players = await prisma.player.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: {
        games: {
          select: {
            status: true,
            startAmount: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    // Process the data to calculate aggregates
    const formattedPlayers = players.map((player) => {
      const totalGames = player.games.length;
      const totalPending = player.games
        .filter((game) => game.status === 'pending')
        .reduce((sum, game) => sum + (game.startAmount || 0), 0);
      const totalPaid = player.games
        .filter((game) => game.status === 'paid')
        .reduce((sum, game) => sum + (game.startAmount || 0), 0);

      return {
        id: player.id,
        name: player.name,
        email: player.email,
        total_games: totalGames,
        total_pending: formatCurrency(totalPending),
        total_paid: formatCurrency(totalPaid),
      };
    });

    return formattedPlayers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch player table.');
  }
}
