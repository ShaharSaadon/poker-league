import { db } from '@vercel/postgres';

const client = await db.connect();

async function listGames() {
  const data = await client.sql`
    SELECT games.amount, players.name
    FROM games
    JOIN players ON games.player_id = players.id
    WHERE games.amount = 666;
  `;

  return data.rows;
}

export async function GET() {
  try {
    return Response.json(await listGames());
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
