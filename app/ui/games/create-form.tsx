'use client';

import { useEffect, useState } from 'react';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { createGame } from '@/app/lib/actions/games';
import { getTables } from '@/app/lib/actions/tables';
import { getPlayersByTable } from '@/app/lib/actions/players';
import { Player, Table } from '@prisma/client';

export default function Form() {
  const [tables, setTables] = useState<Table[]>([]);
  const [players, setPlayers] = useState<Player[]>([]); // Players fetched for the table
  const [availablePlayers, setAvailablePlayers] = useState<Player[]>([]); // Available players to select
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]); // Selected player IDs
  const [selectedTable, setSelectedTable] = useState('');
  const [host, setHost] = useState('');
  const [startAmount, setStartAmount] = useState(0);
  // Fetch tables on mount
  useEffect(() => {
    async function fetchTables() {
      try {
        const data: Table[] = await getTables(); // Ensure `getTables` returns the correct structure
        setTables(data); // Update state with fetched data
      } catch (error) {
        console.error('Failed to fetch tables:', error);
      }
    }

    fetchTables();
  }, []);

  // Fetch players for the selected table
  useEffect(() => {
    async function fetchPlayersForTable() {
      if (!selectedTable) return;

      try {
        const data = await getPlayersByTable(selectedTable); // Fetch players for the selected table
        setPlayers(data);
        setAvailablePlayers(data); // Initialize available players
      } catch (error) {
        console.error('Failed to fetch players:', error);
      }
    }
    fetchPlayersForTable();
  }, [selectedTable]);

  const handlePlayerSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedPlayerId = event.target.value;

    if (selectedPlayerId) {
      setSelectedPlayers((prev) => [...prev, selectedPlayerId]);
      setAvailablePlayers((prev) =>
        prev.filter((player) => player.id !== selectedPlayerId)
      );
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Extract data from the form
    const formData = new FormData(event.currentTarget);
    const host = formData.get('host') as string;
    const startAmount = parseInt(formData.get('startAmount') as string, 10);
    const rawStartAmount = formData.get('startAmount');
    console.log('Raw startAmount:', rawStartAmount);
    // Construct the object to match the expected type
    const gameData = {
      host: host || 'Tubul',
      tableId: selectedTable,
      playerIds: selectedPlayers,
      startAmount: startAmount || 100,
      createdById: '4fb78be3-3f89-4826-9457-856928d330ef',
    };
    console.log('gameData:', gameData);
    try {
      await createGame(gameData); // Pass the object, not FormData
      console.log('Game created successfully!');
    } catch (error) {
      console.log('Failed to create game.', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Table Selection */}
        <div className="mb-4">
          <label htmlFor="table" className="mb-2 block text-sm font-medium">
            Select a Table
          </label>
          <select
            id="table"
            value={selectedTable}
            onChange={(e) => setSelectedTable(e.target.value)}
            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm"
          >
            <option value="" disabled>
              Choose a table
            </option>
            {tables.map((table) => (
              <option key={table.id} value={table.id}>
                {table.name}
              </option>
            ))}
          </select>
        </div>

        {/* Host Input */}
        <div className="mb-4">
          <label htmlFor="host" className="mb-2 block text-sm font-medium">
            Host Name
          </label>
          <input
            id="host"
            value={host}
            onChange={(e) => setHost(e.target.value)}
            placeholder="Enter host name"
            className="peer block w-full rounded-md border border-gray-200 py-2 text-sm"
          />
        </div>

        {/* Start Amount */}
        <div className="mb-4">
          <label
            htmlFor="startAmount"
            className="mb-2 block text-sm font-medium"
          >
            Starting Amount
          </label>
          <input
            id="startAmount"
            type="number"
            value={startAmount}
            onChange={(e) =>
              setStartAmount(e.target.value === '' ? 0 : Number(e.target.value))
            }
            placeholder="Enter starting amount"
            className="peer block w-full rounded-md border border-gray-200 py-2 text-sm"
          />
          <CurrencyDollarIcon className="absolute left-3 top-1/2 h-5 w-5 text-gray-500" />
        </div>

        {/* Player Selection */}
        <div className="mb-4">
          <label htmlFor="player" className="mb-2 block text-sm font-medium">
            Select Players
          </label>
          <select
            id="player"
            onChange={handlePlayerSelect}
            className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm"
          >
            <option value="" disabled>
              Choose players
            </option>
            {availablePlayers.map((player) => (
              <option key={player.id} value={player.id}>
                {player.name}
              </option>
            ))}
          </select>
        </div>

        {/* Selected Players */}
        <div>
          <p>Selected Players:</p>
          <ul>
            {selectedPlayers.map((playerId) => {
              const player = players.find((p) => p.id === playerId);
              return <li key={playerId}>{player?.name}</li>;
            })}
          </ul>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          className="rounded-lg bg-blue-500 px-4 py-2 text-white"
        >
          Create Game
        </button>
      </div>
    </form>
  );
}
