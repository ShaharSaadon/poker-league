'use client';

import { formatCurrency } from '@/app/lib/utils';

export default function ViewGamePage({
  game,
  players,
}: {
  game: {
    id: string;
    status: string;
    createdById: string;
    startAmount: number;
    createdAt: Date;
    finishedAt: Date | null;
    host: string;
    exchanges: Array<{
      fromPlayerId: string;
      toPlayerId: string;
      amount: number;
    }>;
  };
  players: Array<{
    id: string;
    name: string;
    gameBuyIns: number[];
  }>;
}) {
  if (game.status === 'Playing') {
    return (
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <h2 className="text-xl font-bold text-red-500">
          This game is still in progress. Viewing is restricted to completed
          games.
        </h2>
      </div>
    );
  }

  const totalTableBuyIns = players.reduce(
    (total, player) =>
      total + player.gameBuyIns.reduce((sum, amount) => sum + amount, 0),
    0
  );

  return (
    <div className="rounded-md bg-gray-50 p-4 md:p-6">
      <h2 className="mb-4 text-xl font-bold">Game Overview</h2>

      {/* Display All Buy-Ins */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-700">Player Buy-Ins</h3>
        <ul className="mt-2 list-disc pl-5 text-sm text-gray-700">
          {players.map((player) => (
            <li key={player.id}>
              <strong>{player.name}</strong>:{' '}
              {formatCurrency(
                player.gameBuyIns.reduce((sum, amount) => sum + amount, 0)
              )}
            </li>
          ))}
        </ul>
        <div className="mt-4 text-lg font-bold">
          Total Table Buy-Ins: {formatCurrency(totalTableBuyIns)}
        </div>
      </div>

      {/* Display Exchanges */}
      <div>
        <h3 className="text-lg font-bold text-gray-700">Exchanges Summary</h3>
        {game.exchanges.length > 0 ? (
          <ul className="mt-2 list-disc pl-5 text-sm text-gray-700">
            {game.exchanges.map((exchange, index) => {
              const sender =
                players.find((player) => player.id === exchange.fromPlayerId)
                  ?.name || 'Unknown Sender';
              const receiver =
                players.find((player) => player.id === exchange.toPlayerId)
                  ?.name || 'Unknown Receiver';

              return (
                <li key={index}>
                  {sender} sent {formatCurrency(exchange.amount)} to {receiver}
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">
            No exchanges recorded for this game.
          </p>
        )}
      </div>
    </div>
  );
}
