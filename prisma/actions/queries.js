import { withAccelerate } from '@prisma/extension-accelerate';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Seed Users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: `admin_${Date.now()}@game.com`,
        name: 'Admin',
        password: 'password123',
      },
    }),
    prisma.user.create({
      data: {
        email: `manager_${Date.now()}@game.com`,
        name: 'Manager',
        password: 'password123',
      },
    }),
    prisma.user.create({
      data: {
        email: `player1_${Date.now()}@game.com`,
        name: 'Player1',
        password: 'password123',
      },
    }),
    prisma.user.create({
      data: {
        email: `player2_${Date.now()}@game.com`,
        name: 'Player2',
        password: 'password123',
      },
    }),
    prisma.user.create({
      data: {
        email: `player3_${Date.now()}@game.com`,
        name: 'Player3',
        password: 'password123',
      },
    }),
  ]);

  console.log(`Created users: ${users.map((user) => user.name).join(', ')}`);

  // Seed Players
  const players = await Promise.all([
    prisma.player.create({
      data: {
        name: 'Alice',
        email: `alice_${Date.now()}@game.com`,
        user: {
          connect: { id: users[0].id },
        },
      },
    }),
    prisma.player.create({
      data: {
        name: 'Bob',
        email: `bob_${Date.now()}@game.com`,
        user: {
          connect: { id: users[1].id },
        },
      },
    }),
    prisma.player.create({
      data: {
        name: 'Charlie',
        email: `charlie_${Date.now()}@game.com`,
      },
    }),
    prisma.player.create({
      data: {
        name: 'Diana',
        email: `diana_${Date.now()}@game.com`,
      },
    }),
    prisma.player.create({
      data: {
        name: 'Eve',
        email: `eve_${Date.now()}@game.com`,
      },
    }),
  ]);

  console.log(
    `Created players: ${players.map((player) => player.name).join(', ')}`
  );

  // Seed Tables
  const tables = await Promise.all([
    prisma.table.create({
      data: {
        name: 'Table 1',
        createdBy: {
          connect: { id: users[0].id },
        },
        players: {
          connect: [{ id: players[0].id }, { id: players[1].id }],
        },
      },
    }),
    prisma.table.create({
      data: {
        name: 'Table 2',
        createdBy: {
          connect: { id: users[1].id },
        },
        players: {
          connect: [{ id: players[2].id }, { id: players[3].id }],
        },
      },
    }),
    prisma.table.create({
      data: {
        name: 'Table 3',
        createdBy: {
          connect: { id: users[2].id },
        },
        players: {
          connect: [{ id: players[4].id }],
        },
      },
    }),
  ]);

  console.log(
    `Created tables: ${tables.map((table) => table.name).join(', ')}`
  );

  // Seed Games
  const games = await Promise.all([
    prisma.game.create({
      data: {
        table: {
          connect: { id: tables[0].id },
        },
        createdBy: {
          connect: { id: users[0].id },
        },
        players: {
          connect: [{ id: players[0].id }, { id: players[1].id }],
        },
        startAmount: 100,
        createdAt: new Date(),
      },
    }),
    prisma.game.create({
      data: {
        table: {
          connect: { id: tables[1].id },
        },
        createdBy: {
          connect: { id: users[1].id },
        },
        players: {
          connect: [{ id: players[2].id }, { id: players[3].id }],
        },
        startAmount: 200,
        createdAt: new Date(),
      },
    }),
    prisma.game.create({
      data: {
        table: {
          connect: { id: tables[2].id },
        },
        createdBy: {
          connect: { id: users[2].id },
        },
        players: {
          connect: [{ id: players[4].id }],
        },
        startAmount: 150,
        createdAt: new Date(),
      },
    }),
  ]);

  console.log(`Created games: ${games.map((game) => game.id).join(', ')}`);

  // Assign currentGame to Tables
  await Promise.all([
    prisma.table.update({
      where: { id: tables[0].id },
      data: { currentGame: { connect: { id: games[0].id } } },
    }),
    prisma.table.update({
      where: { id: tables[1].id },
      data: { currentGame: { connect: { id: games[1].id } } },
    }),
    prisma.table.update({
      where: { id: tables[2].id },
      data: { currentGame: { connect: { id: games[2].id } } },
    }),
  ]);

  console.log(`Assigned current games to tables.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
