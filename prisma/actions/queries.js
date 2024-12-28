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
    prisma.table.create({
      data: {
        name: 'Table 4',
        createdBy: {
          connect: { id: users[3].id },
        },
        players: {
          connect: [{ id: players[0].id }, { id: players[3].id }],
        },
      },
    }),
    prisma.table.create({
      data: {
        name: 'Table 5',
        createdBy: {
          connect: { id: users[4].id },
        },
        players: {
          connect: [{ id: players[2].id }, { id: players[4].id }],
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
    prisma.game.create({
      data: {
        table: {
          connect: { id: tables[3].id },
        },
        createdBy: {
          connect: { id: users[3].id },
        },
        players: {
          connect: [{ id: players[0].id }, { id: players[3].id }],
        },
        startAmount: 250,
        createdAt: new Date(),
      },
    }),
    prisma.game.create({
      data: {
        table: {
          connect: { id: tables[4].id },
        },
        createdBy: {
          connect: { id: users[4].id },
        },
        players: {
          connect: [{ id: players[2].id }, { id: players[4].id }],
        },
        startAmount: 300,
        createdAt: new Date(),
      },
    }),
  ]);

  console.log(`Created games: ${games.map((game) => game.id).join(', ')}`);

  // Seed BuyIns
  const buyIns = await Promise.all([
    prisma.buyIn.create({
      data: {
        player: {
          connect: { id: players[0].id },
        },
        game: {
          connect: { id: games[0].id },
        },
        amount: 50,
      },
    }),
    prisma.buyIn.create({
      data: {
        player: {
          connect: { id: players[1].id },
        },
        game: {
          connect: { id: games[0].id },
        },
        amount: 70,
      },
    }),
    prisma.buyIn.create({
      data: {
        player: {
          connect: { id: players[2].id },
        },
        game: {
          connect: { id: games[1].id },
        },
        amount: 100,
      },
    }),
    prisma.buyIn.create({
      data: {
        player: {
          connect: { id: players[3].id },
        },
        game: {
          connect: { id: games[1].id },
        },
        amount: 120,
      },
    }),
    prisma.buyIn.create({
      data: {
        player: {
          connect: { id: players[4].id },
        },
        game: {
          connect: { id: games[2].id },
        },
        amount: 80,
      },
    }),
  ]);

  console.log(`Created buy-ins.`);

  // Seed Exchanges
  const exchanges = await Promise.all([
    prisma.exchange.create({
      data: {
        fromPlayer: {
          connect: { id: players[0].id },
        },
        toPlayer: {
          connect: { id: players[1].id },
        },
        game: {
          connect: { id: games[0].id },
        },
        amount: 30,
      },
    }),
    prisma.exchange.create({
      data: {
        fromPlayer: {
          connect: { id: players[2].id },
        },
        toPlayer: {
          connect: { id: players[3].id },
        },
        game: {
          connect: { id: games[1].id },
        },
        amount: 50,
      },
    }),
    prisma.exchange.create({
      data: {
        fromPlayer: {
          connect: { id: players[4].id },
        },
        toPlayer: {
          connect: { id: players[0].id },
        },
        game: {
          connect: { id: games[2].id },
        },
        amount: 20,
      },
    }),
  ]);

  console.log(`Created exchanges.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
