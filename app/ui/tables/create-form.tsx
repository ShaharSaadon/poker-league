'use client';

import { useEffect, useState } from 'react';
import { Player } from '@prisma/client';
import { getPlayers } from '@/app/lib/actions/players';
import { createTable } from '@/app/lib/actions/tables';

export default function CreateTableForm() {
  const [players, setPlayers] = useState<Player[]>([]); // All players
  const [searchQuery, setSearchQuery] = useState(''); // Search input
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]); // Selected player IDs
  const [tableName, setTableName] = useState(''); // Table name input

  // Fetch all players and tables on mount
  useEffect(() => {
    async function fetchData() {
      try {
        const playerData: Player[] = await getPlayers();
        setPlayers(playerData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    }

    fetchData();
  }, []);

  const filteredPlayers = players.filter((player) =>
    player.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePlayerSelect = (playerId: string) => {
    if (!selectedPlayers.includes(playerId)) {
      setSelectedPlayers((prev) => [...prev, playerId]);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await createTable({
        name: tableName || 'Untitled Table',
        createdById: '4fb78be3-3f89-4826-9457-856928d330ef',
        playerIds: selectedPlayers,
      });

      console.log('Table created successfully!');
    } catch (error) {
      console.log('Failed to create table.', error);
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="rounded-md bg-gray-50 p-4 md:p-6"
      >
        {/* Table Name Input */}
        <div className="mb-4">
          <label htmlFor="tableName" className="mb-2 block text-sm font-medium">
            Table Name
          </label>
          <input
            id="tableName"
            type="text"
            value={tableName}
            onChange={(e) => setTableName(e.target.value)}
            placeholder="Enter table name"
            className="peer block w-full rounded-md border border-gray-200 py-2 text-sm"
          />
        </div>

        {/* Search Input */}
        <div className="mb-4">
          <label htmlFor="search" className="mb-2 block text-sm font-medium">
            Search Players
          </label>
          <input
            id="search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name"
            className="peer block w-full rounded-md border border-gray-200 py-2 text-sm"
          />
        </div>

        {/* Player List */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {filteredPlayers.map((player) => (
            <div
              key={player.id}
              className={`rounded-md border p-4 text-center shadow-sm cursor-pointer ${
                selectedPlayers.includes(player.id)
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-800'
              }`}
              onClick={() => handlePlayerSelect(player.id)}
            >
              {player.name}
            </div>
          ))}
        </div>

        {/* Selected Players */}
        <div className="mt-6">
          <p className="text-sm font-medium">Selected Players:</p>
          <ul className="mt-2 list-disc pl-5 text-sm">
            {selectedPlayers.map((playerId) => {
              const player = players.find((p) => p.id === playerId);
              return <li key={playerId}>{player?.name}</li>;
            })}
          </ul>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Create Table
          </button>
        </div>
      </form>

      {/* Tables Overview */}
      {/* <div className="mt-6 flow-root">
        <div className="inline-block min-w-full align-middle">
          <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
            <table className="min-w-full text-gray-900">
              <thead className="rounded-lg text-left text-sm font-normal">
                <tr>
                  <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                    Name
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    Players
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {tables.map((table) => (
                  <tr
                    key={table.id}
                    className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                  >
                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                      {table.name}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      {table.players.map((player) => player.name).join(', ')}
                    </td>
                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                      <button
                        className="rounded-md bg-green-500 px-3 py-1 text-white hover:bg-green-600"
                        onClick={() =>
                          alert('Add Player functionality coming soon!')
                        }
                      >
                        Add Player
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div> */}
    </div>
  );
}
