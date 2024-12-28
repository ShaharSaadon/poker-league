// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.

export type Revenue = {
  month: string;
  revenue: number;
};

export type LatestGame = {
  id: string;
  name: string;
  image_url: string;
  email: string;
  amount: string;
};

// The database returns a number for amount, but we later format it to a string with the formatCurrency function
export type LatestGameRaw = Omit<LatestGame, 'amount'> & {
  amount: number;
};

export type GamesTable = {
  id: string;
  player_id: string;
  name: string;
  email: string;
  image_url: string;
  date: string;
  amount: number;
  status: 'pending' | 'paid';
};

export type PlayersTableType = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_games: number;
  total_pending: number;
  total_paid: number;
};

export type FormattedPlayersTable = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_games: number;
  total_pending: string;
  total_paid: string;
};

export type PlayerField = {
  id: string;
  name: string;
};

export type GameForm = {
  id: string;
  player_id: string;
  amount: number;
  status: 'pending' | 'paid';
};
