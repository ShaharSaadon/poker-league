'use server';

import { sql } from '@vercel/postgres';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

import { AuthError, User } from 'next-auth';
import { signIn } from '@/auth';
const prisma = new PrismaClient();

const FormSchema = z.object({
  id: z.string(),
  playerIds: z
    .array(z.string().uuid(), {
      invalid_type_error: 'Please select at least one player.',
    })
    .nonempty('Please select at least one player.'),
  date: z.string(),
});

// const CreateGame = FormSchema.omit({ id: true, date: true });
const UpdateGame = FormSchema.omit({ id: true, date: true });

export async function createGame(
  state: State,
  formData: FormData
): Promise<State> {
  const playerIds = formData.getAll('playerIds') as string[];
  console.log('formData:', formData);

  // Validate form data
  const validatedFields = z
    .object({
      playerIds: z
        .array(z.string().uuid())
        .nonempty('Please select at least one player.'),
      host: z.string().min(1, 'Host is required.'),
      amount: z.preprocess(
        (value) => parseInt(value as string, 10),
        z.number().positive('Amount must be a positive number.')
      ),
    })
    .safeParse({
      playerIds,
      host: formData.get('host') as string,
      amount: formData.get('amount') as string,
    });

  console.log('validatedFields:', validatedFields);

  if (!validatedFields.success) {
    return {
      ...state,
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Validation failed: Missing or invalid fields.',
    };
  }

  const { playerIds: validatedPlayerIds, host, amount } = validatedFields.data;
  const date = new Date();

  try {
    // Create the game and link players using the players relation
    await prisma.game.create({
      data: {
        host,
        amount: amount * 100, // Store amount in cents
        date,
        players: {
          create: validatedPlayerIds.map((playerId) => ({
            player: { connect: { id: playerId } },
          })),
        },
      },
    });

    return {
      ...state,
      message: 'Game created successfully.',
    };
  } catch (error) {
    console.error('Database Error:', error);

    return {
      ...state,
      message: 'Database Error: Failed to create game.',
      error,
    };
  }
}

export async function updateGame(
  id: string,
  prevState: State,
  formData: FormData
): Promise<State> {
  const validatedFields = UpdateGame.safeParse({
    playerIds: formData.getAll('playerIds') as string[],
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Game.',
      error: undefined, // Add this explicitly
    };
  }

  const { playerIds } = validatedFields.data;
  const formattedPlayerIds = `{${playerIds.join(',')}}`; // Format array for PostgreSQL

  try {
    await sql`
      UPDATE game
      SET player_ids = ${formattedPlayerIds}::uuid[]
      WHERE id = ${id}
    `;
    return {
      errors: {},
      message: 'Game updated successfully!',
      error: undefined,
    };
  } catch (error) {
    return {
      errors: {},
      message: 'Database Error: Failed to Update Game.',
      error,
    };
  }
}

export async function getGames() {
  try {
    const games = await sql`
      SELECT id, player_ids, date
      FROM game
    `;
    return games.rows;
  } catch (error) {
    console.error('Failed to fetch games:', error);
    throw new Error('Failed to fetch games.');
  }
}

export async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;
    return user.rows[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}
export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

export type State = {
  errors?: {
    status?: string[];
    playerIds?: string[];
    amount?: string[];
    host?: string[];
  };
  message: string;
  error?: unknown;
};
