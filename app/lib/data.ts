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
    const data = await sql<LatestGameRaw>`
      SELECT games.amount, players.name, players.image_url, players.email, games.id
      FROM games
      JOIN players ON games.player_id = players.id
      ORDER BY games.date DESC
      LIMIT 5`;

    const latestGames = data.rows.map((game) => ({
      ...game,
      amount: formatCurrency(game.amount),
    }));
    return latestGames;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest games.');
  }
}

export async function fetchCardData() {
  try {
    const gameCountPromise = sql`SELECT COUNT(*) FROM games`;
    const playerCountPromise = sql`SELECT COUNT(*) FROM players`;
    const gameStatusPromise = sql`SELECT
         SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
         SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
         FROM games`;

    const data = await Promise.all([
      gameCountPromise,
      playerCountPromise,
      gameStatusPromise,
    ]);

    const numberOfGames = Number(data[0].rows[0].count ?? '0');
    const numberOfPlayers = Number(data[1].rows[0].count ?? '0');
    const totalPaidGames = formatCurrency(data[2].rows[0].paid ?? '0');
    const totalPendingGames = formatCurrency(data[2].rows[0].pending ?? '0');

    return {
      numberOfPlayers,
      numberOfGames,
      totalPaidGames,
      totalPendingGames,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredGames(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const games = await sql<GamesTable>`
      SELECT
        games.id,
        games.amount,
        games.date,
        games.status,
        players.name,
        players.email,
        players.image_url
      FROM games
      JOIN players ON games.player_id = players.id
      WHERE
        players.name ILIKE ${`%${query}%`} OR
        players.email ILIKE ${`%${query}%`} OR
        games.amount::text ILIKE ${`%${query}%`} OR
        games.date::text ILIKE ${`%${query}%`} OR
        games.status ILIKE ${`%${query}%`}
      ORDER BY games.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return games.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch games.');
  }
}

export async function fetchGamesPages(query: string) {
  try {
    const count = await sql`SELECT COUNT(*)
    FROM games
    JOIN players ON games.player_id = players.id
    WHERE
      players.name ILIKE ${`%${query}%`} OR
      players.email ILIKE ${`%${query}%`} OR
      games.amount::text ILIKE ${`%${query}%`} OR
      games.date::text ILIKE ${`%${query}%`} OR
      games.status ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of games.');
  }
}

export async function fetchGameById(id: string) {
  try {
    const data = await sql<GameForm>`
      SELECT
        games.id,
        games.player_id,
        games.amount,
        games.status
      FROM games
      WHERE games.id = ${id};
    `;

    const game = data.rows.map((game) => ({
      ...game,
      // Convert amount from cents to dollars
      amount: game.amount / 100,
    }));
    return game[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch game.');
  }
}

export async function fetchPlayers() {
  try {
    const data = await sql<PlayerField>`
      SELECT
        id,
        name
      FROM players
      ORDER BY name ASC
    `;

    const players = data.rows;
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
