import bcrypt from 'bcrypt';
import { db, sql } from '@vercel/postgres';
import { games, players, revenue, users } from '../lib/placeholder-data';

const client = await db.connect();

async function seedUsers() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await client.sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `;

  const insertedUsers = await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return client.sql`
        INSERT INTO users (id, name, email, password)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword})
        ON CONFLICT (id) DO NOTHING;
      `;
    })
  );

  console.log('Users seeded:', insertedUsers.length);
}

async function seedGames() {
  await sql`
    CREATE TABLE IF NOT EXISTS games (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      player_ids UUID[] NOT NULL,
      date DATE NOT NULL
    );
  `;

  for (const game of games) {
    const playerIdsFormatted = `{${game.player_ids.join(',')}}`; // Format as PostgreSQL array
    await sql`
      INSERT INTO games (player_ids, date)
      VALUES (${playerIdsFormatted}::uuid[], ${game.date})
    `;
  }

  console.log(`Inserted ${games.length} games`);
}

async function seedPlayers() {
  await client.sql`
    CREATE TABLE IF NOT EXISTS players (
      id UUID PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      image_url VARCHAR(255) NOT NULL,
      total_games_played INT DEFAULT 0,
      total_money_earned NUMERIC DEFAULT 0
    );
  `;

  const insertedPlayers = await Promise.all(
    players.map((player) => {
      return client.sql`
        INSERT INTO players (id, name, email, image_url)
        VALUES (${player.id}, ${player.name}, ${player.email}, ${player.image_url})
        ON CONFLICT (id) DO NOTHING;
      `;
    })
  );

  console.log('Players seeded:', insertedPlayers.length);
}

async function seedRevenue() {
  await client.sql`
    CREATE TABLE IF NOT EXISTS revenue (
      month VARCHAR(4) NOT NULL PRIMARY KEY,
      revenue INT NOT NULL
    );
  `;

  const insertedRevenue = await Promise.all(
    revenue.map((rev) => {
      return client.sql`
        INSERT INTO revenue (month, revenue)
        VALUES (${rev.month}, ${rev.revenue})
        ON CONFLICT (month) DO NOTHING;
      `;
    })
  );

  console.log('Revenue seeded:', insertedRevenue.length);
}

export async function GET() {
  try {
    await client.sql`BEGIN`;
    await seedUsers();
    await seedPlayers();
    await seedGames();
    await seedRevenue();
    await client.sql`COMMIT`;

    return Response.json({ message: 'Database seeded successfully' });
  } catch (error) {
    await client.sql`ROLLBACK`;
    return Response.json({ error }, { status: 500 });
  }
}
