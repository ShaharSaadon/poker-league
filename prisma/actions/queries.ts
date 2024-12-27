import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

const prisma = new PrismaClient().$extends(withAccelerate());

async function main() {
  const user1Email = `player1_${Date.now()}@game.com`;
  const user2Email = `player2_${Date.now()}@game.com`;

  // Seed Users
  const user1 = await prisma.user.create({
    data: {
      email: user1Email,
      name: 'Admin',
      password: 'password123',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: user2Email,
      name: 'Manager',
      password: 'password123',
    },
  });

  console.log(`Created users: ${user1.name} and ${user2.name}`);

  // Create Players
  const player1 = await prisma.player.create({
    data: {
      name: 'Alice',
      email: `alice_${Date.now()}@game.com`,
      totalGamesPlayed: 5,
      totalMoneyEarned: 150.5,
    },
  });

  const player2 = await prisma.player.create({
    data: {
      name: 'Bob',
      email: `bob_${Date.now()}@game.com`,
      totalGamesPlayed: 3,
      totalMoneyEarned: 100.0,
    },
  });

  console.log(`Created players: ${player1.name}, ${player2.name}`);

  // Create Table and link players
  const table = await prisma.table.create({
    data: {
      name: 'Table 1',
      createdBy: {
        connect: { id: user1.id },
      },
      players: {
        connect: [{ id: player1.id }, { id: player2.id }],
      },
    },
  });

  console.log(`Created table with players: ${table.name}`);

  // Create Game and link players
  const game = await prisma.game.create({
    data: {
      createdBy: {
        connect: { id: user1.id },
      },
      players: {
        connect: [{ id: player1.id }, { id: player2.id }],
      },
      status: 'completed',
    },
  });

  console.log(`Created game with players: ${game.id}`);
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

//   // Create a new post (written by an already existing user with email alice@prisma.io)
//   const newPost = await prisma.post.create({
//     data: {
//       title: 'Join the Prisma Discord community',
//       content: 'https://pris.ly/discord',
//       published: false,
//       author: {
//         connect: {
//           email: user1Email,
//         },
//       },
//     },
//   });
//   console.log(`Created a new post: ${JSON.stringify(newPost)}`);

//   // Publish the new post
//   const updatedPost = await prisma.post.update({
//     where: {
//       id: newPost.id,
//     },
//     data: {
//       published: true,
//     },
//   });
//   console.log(
//     `Published the newly created post: ${JSON.stringify(updatedPost)}`
//   );

//   // Retrieve all posts by user with email alice@prisma.io
//   const postsByUser = await prisma.post.findMany({
//     where: {
//       author: {
//         email: user1Email,
//       },
//     },
//   });
//   console.log(
//     `Retrieved all posts from a specific user: ${JSON.stringify(postsByUser)}`
//   );
// }
