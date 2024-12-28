import { sql } from '@vercel/postgres';
import {
  PlayerField,
  PlayersTableType,
  GameForm,
  GamesTable,
  LatestGameRaw,
  Revenue,
} from './definitions';
import { formatCurrency } from './utils';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const ITEMS_PER_PAGE = 6;

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

export async function fetchLatestGames() {
  try {
    // Fetch the latest 5 games with players
    const latestGames = await prisma.game.findMany({
      orderBy: { date: 'desc' },
      take: 5,
      include: {
        players: {
          include: {
            player: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
                email: true,
              },
            },
          },
        },
      },
    });

    // Format the data
    const formattedGames = latestGames.map((game) => ({
      id: game.id,
      date: game.date,
      status: game.status,
      host: game.host,
      amount: formatCurrency(game.amount / 100), // Assuming `amount` is stored in cents
      players: game.players.map((playerRelation) => ({
        id: playerRelation.player.id,
        name: playerRelation.player.name,
        image: playerRelation.player.imageUrl,
        email: playerRelation.player.email,
      })),
    }));

    return formattedGames;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest games.');
  }
}

export async function fetchCardData() {
  try {
    const gameCountPromise = prisma.game.count();
    const playerCountPromise = prisma.player.count();
    const gamesPromise = prisma.game.findMany({
      select: {
        status: true,
        amount: true,
      },
    });

    const [numberOfGames, numberOfPlayers, games] = await Promise.all([
      gameCountPromise,
      playerCountPromise,
      gamesPromise,
    ]);

    const totals = games.reduce((acc, game) => {
      acc += game.amount;
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
                player: {
                  name: {
                    contains: query,
                    mode: 'insensitive',
                  },
                },
              },
            },
          },
          {
            players: {
              some: {
                player: {
                  email: {
                    contains: query,
                    mode: 'insensitive',
                  },
                },
              },
            },
          },
          {
            amount: {
              equals: isNaN(Number(query)) ? undefined : Number(query),
            },
          },
          {
            date: {
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
      orderBy: {
        date: 'desc',
      },
      skip,
      take,
      include: {
        players: {
          include: {
            player: {
              select: {
                name: true,
                email: true,
                imageUrl: true,
              },
            },
          },
        },
      },
    });

    // Format the results
    const formattedGames = games.map((game) => ({
      id: game.id,
      date: game.date,
      status: game.status,
      amount: game.amount, // Assuming the amount is already in the correct format
      players: game.players.map((relation) => ({
        name: relation.player.name,
        email: relation.player.email,
        image: relation.player.imageUrl,
      })),
    }));

    return formattedGames;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch games.');
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
                player: {
                  name: {
                    contains: query,
                    mode: 'insensitive',
                  },
                },
              },
            },
          },
          {
            players: {
              some: {
                player: {
                  email: {
                    contains: query,
                    mode: 'insensitive',
                  },
                },
              },
            },
          },
          {
            amount: {
              equals: isNaN(Number(query)) ? undefined : Number(query),
            },
          },
          {
            date: {
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

function isValidDate(date: string): boolean {
  const parsedDate = new Date(date);
  return !isNaN(parsedDate.getTime());
}
export async function fetchGameById(id: string) {
  try {
    const game = await prisma.game.findUnique({
      where: { id },
      include: {
        players: {
          include: {
            player: {
              select: {
                id: true,
                name: true,
                email: true,
                imageUrl: true,
              },
            },
          },
        },
      },
    });

    if (!game) {
      throw new Error('Game not found.');
    }

    return {
      id: game.id,
      amount: game.amount / 100, // Convert amount from cents to dollars
      status: game.status,
      players: game.players.map((relation) => ({
        id: relation.player.id,
        name: relation.player.name,
        email: relation.player.email,
        imageUrl: relation.player.imageUrl,
      })),
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch game.');
  }
}

export async function fetchPlayers() {
  try {
    const players = await prisma.player.findMany({
      select: {
        id: true,
        name: true,
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
export async function fetchFilteredPlayers(query: string) {
  try {
    const data = await sql<PlayersTableType>`
		SELECT
		  players.id,
		  players.name,
		  players.email,
		  players.image_url,
		  COUNT(games.id) AS total_games,
		  SUM(CASE WHEN games.status = 'pending' THEN games.amount ELSE 0 END) AS total_pending,
		  SUM(CASE WHEN games.status = 'paid' THEN games.amount ELSE 0 END) AS total_paid
		FROM players
		LEFT JOIN games ON players.id = games.player_id
		WHERE
		  players.name ILIKE ${`%${query}%`} OR
        players.email ILIKE ${`%${query}%`}
		GROUP BY players.id, players.name, players.email, players.image_url
		ORDER BY players.name ASC
	  `;

    const players = data.rows.map((player) => ({
      ...player,
      total_pending: formatCurrency(player.total_pending),
      total_paid: formatCurrency(player.total_paid),
    }));

    return players;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch player table.');
  }
}
