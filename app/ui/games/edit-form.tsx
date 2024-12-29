'use client';

import { useState } from 'react';
import { Player } from '@/app/lib/definitions';
import { updateBuyIn } from '@/app/lib/actions/buyin';
import { formatCurrency } from '@/app/lib/utils';
import { calculateExchanges } from '@/app/lib/actions/exchange';

export default function EditGameForm({
  game,
  players,
}: {
  game: {
    id: string;
    tableId: string;
    status: string;
    createdById: string;
    startAmount: number;
    createdAt: Date;
    finishedAt: Date | null;
    host: string;
  };
  players: Player[];
}) {
  const [buyIns, setBuyIns] = useState<Record<string, number[]>>(
    players.reduce((acc, player) => {
      acc[player.id] = player.gameBuyIns || [];
      return acc;
    }, {} as Record<string, number[]>)
  );
  const [exchangesSummary, setExchangesSummary] = useState<string[]>([]);
  const [finalBalances, setFinalBalances] = useState<Record<string, string>>(
    players.reduce((acc, player) => {
      acc[player.id] = '';
      return acc;
    }, {} as Record<string, string>)
  );
  const handleBalanceChange = (playerId: string, value: string) => {
    setFinalBalances((prev) => ({
      ...prev,
      [playerId]: value,
    }));
  };
  const addBuyIn = async (playerId: string, gameId: string, amount: number) => {
    setBuyIns((prev) => ({
      ...prev,
      [playerId]: [...prev[playerId], amount],
    }));

    try {
      await updateBuyIn(playerId, gameId, amount);
      console.log(`Buy-in of ${amount} added for player ${playerId}`);
    } catch (error) {
      console.error(`Failed to add buy-in for player ${playerId}:`, error);
    }
  };

  const finishGame = async () => {
    const parsedFinalBalances = Object.entries(finalBalances).reduce(
      (acc, [playerId, balance]) => {
        const totalBuyIns =
          buyIns[playerId]?.reduce((sum, amount) => sum + amount, 0) || 0;
        acc[playerId] = parseFloat(balance) - totalBuyIns;
        return acc;
      },
      {} as Record<string, number>
    );

    try {
      const exchanges = await calculateExchanges(game.id, parsedFinalBalances);
      console.log('Game finished and exchanges calculated.');

      const senders: string[] = [];
      const receivers: string[] = [];

      exchanges.forEach((exchange) => {
        const sender =
          players.find((player) => player.id === exchange.fromPlayerId)?.name ||
          'Unknown Sender';
        const receiver =
          players.find((player) => player.id === exchange.toPlayerId)?.name ||
          'Unknown Receiver';
        senders.push(
          `${sender} sent${formatCurrency(exchange.amount)} to ${receiver}`
        );
        receivers.push(
          `${receiver} received${formatCurrency(
            exchange.amount
          )} from ${sender}`
        );
      });

      setExchangesSummary([...senders, ...receivers]);
    } catch (error) {
      console.error('Failed to finish game and calculate exchanges:', error);
    }
  };

  const totalTableBuyIns = Object.values(buyIns).reduce(
    (total, amounts) => total + amounts.reduce((sum, a) => sum + a, 0),
    0
  );

  return (
    <form>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <h2 className="mb-4 text-xl font-bold">Manage Game</h2>

        {/* Player Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {players.map((player) => (
            <div
              key={player.id}
              className="rounded-lg border border-gray-200 p-4 shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-medium">{player.name}</h3>
                <input
                  type="number"
                  placeholder="Final Balance"
                  value={finalBalances[player.id]}
                  onChange={(e) =>
                    handleBalanceChange(player.id, e.target.value)
                  }
                  className="w-24 rounded-md border-gray-300 px-2 py-1 text-sm"
                />
              </div>
              <p className="text-sm text-gray-500">
                Total Buy-Ins:
                {formatCurrency(
                  buyIns[player.id]?.reduce((sum, amount) => sum + amount, 0) ||
                    0
                )}
              </p>
              <button
                type="button"
                onClick={() => addBuyIn(player.id, game.id, 50)}
                className="mt-2 rounded-md bg-blue-500 px-3 py-1 text-sm font-medium text-white hover:bg-blue-600"
              >
                Add Buy-In
              </button>
            </div>
          ))}
        </div>

        {/* Total Table Buy-Ins */}
        <div className="mt-6 text-lg font-bold text-gray-700">
          Total Table Buy-Ins: {formatCurrency(totalTableBuyIns)}
        </div>

        <button
          type="button"
          onClick={finishGame}
          className="mt-4 rounded-md bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600"
        >
          Finish Game
        </button>

        {/* Exchanges Summary */}
        {exchangesSummary.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-bold">Exchanges Summary</h3>
            <ul className="mt-2 list-disc pl-5">
              {exchangesSummary.map((summary, index) => (
                <li key={index} className="text-sm text-gray-700">
                  {summary}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </form>
  );
}
