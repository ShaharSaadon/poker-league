'use client';

import { useState } from 'react';
import { Player } from '@/app/lib/definitions';

export default function EditTableForm({
  players: initialPlayers,
}: {
  table: {
    id: string;
    createdById: string;
    createdAt: Date;
  };
  players: Player[];
}) {
  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [searchTerm, setSearchTerm] = useState('');
  const [newPlayer, setNewPlayer] = useState({
    name: '',
    email: '',
  });

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleAddPlayer = () => {
    if (newPlayer.name.trim() === '') return;

    const newPlayerData: Player = {
      id: Math.random().toString(36).substr(2, 9), // Temporary ID, replace with actual backend-generated ID
      name: newPlayer.name,
      email: newPlayer.email,
      userId: null,
      createdAt: new Date(),
      gameBuyIns: [],
      buyIns: [],
      exchangesSent: [],
      exchangesReceived: [],
    };

    setPlayers([...players, newPlayerData]);
    setNewPlayer({ name: '', email: '' });
  };

  const handleDeletePlayer = (id: string) => {
    setPlayers(players.filter((player) => player.id !== id));
  };

  const filteredPlayers = players.filter((player) =>
    player.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <form>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <h2 className="mb-4 text-xl font-bold">Manage Players</h2>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Search players..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full rounded-md border border-gray-300 p-2"
          />
        </div>

        <ul className="mb-4">
          {filteredPlayers.map((player) => (
            <li
              key={player.id}
              className="mb-2 flex justify-between items-center border-b pb-2"
            >
              <span>{player.name}</span>
              <button
                type="button"
                onClick={() => handleDeletePlayer(player.id)}
                className="rounded-md bg-red-500 px-2 py-1 text-white hover:bg-red-600"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>

        <div className="mb-4">
          <h3 className="text-lg font-medium">Add New Player</h3>
          <input
            type="text"
            placeholder="Player Name"
            value={newPlayer.name}
            onChange={(e) =>
              setNewPlayer({ ...newPlayer, name: e.target.value })
            }
            className="w-full rounded-md border border-gray-300 p-2 mb-2"
          />
          <input
            type="email"
            placeholder="Player Email (optional)"
            value={newPlayer.email}
            onChange={(e) =>
              setNewPlayer({ ...newPlayer, email: e.target.value })
            }
            className="w-full rounded-md border border-gray-300 p-2 mb-2"
          />
          <button
            type="button"
            onClick={handleAddPlayer}
            className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Add Player
          </button>
        </div>
      </div>
    </form>
  );
}
