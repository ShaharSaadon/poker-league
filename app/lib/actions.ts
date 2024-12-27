'use server';

import { sql } from '@vercel/postgres';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
// import { signIn } from '@/auth';
import { AuthError, User } from 'next-auth';
import { signIn } from '@/auth';

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
  // Perform validation
  const validatedFields = z
    .object({
      playerIds: z
        .array(z.string().uuid())
        .nonempty('Please select at least one player.'),
    })
    .safeParse({
      playerIds: formData.getAll('playerIds') as string[],
    });

  if (!validatedFields.success) {
    return {
      ...state, // Preserve the existing state
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Game.',
    };
  }

  const { playerIds } = validatedFields.data;
  const formattedPlayerIds = `{${playerIds.join(',')}}`;
  const date = new Date().toISOString().split('T')[0];

  try {
    await sql`
      INSERT INTO games (player_ids, date)
      VALUES (${formattedPlayerIds}::uuid[], ${date})
    `;
    return {
      ...state,
      message: 'Game created successfully.',
    };
  } catch (error) {
    return {
      ...state,
      message: 'Database Error: Failed to Create Game.',
      error,
    };
  }
}

export async function updateGame(
  id: string,
  prevState: State,
  formData: FormData
) {
  const validatedFields = UpdateGame.safeParse({
    playerIds: formData.getAll('playerIds') as string[],
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Game.',
    };
  }

  const { playerIds } = validatedFields.data;
  const formattedPlayerIds = `{${playerIds.join(',')}}`; // Format array for PostgreSQL

  try {
    await sql`
      UPDATE games
      SET player_ids = ${formattedPlayerIds}::uuid[]
      WHERE id = ${id}
    `;
  } catch (error) {
    return { message: 'Database Error: Failed to Update Game.', error };
  }

  revalidatePath('/dashboard/games');
  redirect('/dashboard/games');
}

export async function getGames() {
  try {
    const games = await sql`
      SELECT id, player_ids, date
      FROM games
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
    playerIds?: string[];
  };
  message?: string;
  error?: unknown;
};
