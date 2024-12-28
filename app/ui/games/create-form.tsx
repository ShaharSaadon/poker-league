'use client';

import { useState } from 'react';
import { PlayerField } from '@/app/lib/definitions';
import Link from 'next/link';
import {
  CurrencyDollarIcon,
  // CheckIcon,
  // ClockIcon,
  // CurrencyDollarIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { useActionState } from 'react';
import { createGame, State } from '@/app/lib/actions';

export default function Form({ players }: { players: PlayerField[] }) {
  const initialState: State = { message: '', errors: {} };
  const [state, formAction] = useActionState(createGame, initialState);
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [availablePlayers, setAvailablePlayers] = useState(players);

  const handlePlayerSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedPlayerId = event.target.value;

    if (selectedPlayerId) {
      setSelectedPlayers((prev) => [...prev, selectedPlayerId]);
      setAvailablePlayers((prev) =>
        prev.filter((player) => player.id !== selectedPlayerId)
      );
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData();

    // Add all selected player IDs to the FormData
    if (selectedPlayers.length > 0) {
      selectedPlayers.forEach((playerId) => {
        formData.append('playerIds', playerId);
      });
    }

    // Add other form fields
    formData.append('host', event.currentTarget.host.value);
    formData.append('amount', event.currentTarget.amount.value);

    formAction(formData); // Use the provided formAction
  };

  return (
    <form onSubmit={handleSubmit} aria-describedby="form-error">
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Table */}
        <div className="mb-4">
          <label htmlFor="table" className="mb-2 block text-sm font-medium">
            Enter a table
          </label>
          <div className="relative mt-2 rounded-md">
            <input
              id="table"
              name="table"
              type="checkbox"
              placeholder="Enter a table name"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="table-error"
            />
          </div>
        </div>
        {/* Host */}
        <div className="mb-4">
          <label htmlFor="host" className="mb-2 block text-sm font-medium">
            Enter an host
          </label>
          <div className="relative mt-2 rounded-md">
            <input
              id="host"
              name="host"
              type="text"
              placeholder="Enter a host name"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="host-error"
            />
          </div>
        </div>
        {/* Starting Game Amount */}
        <div className="mb-4">
          <label htmlFor="amount" className="mb-2 block text-sm font-medium">
            Choose an amount
          </label>
          <div className="relative mt-2 rounded-md">
            <input
              id="amount"
              name="amount"
              type="number"
              placeholder="Enter USD amount"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="amount-error"
            />
            <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
        </div>
        {/* Player Selection */}
        <div className="mb-4">
          <label htmlFor="player" className="mb-2 block text-sm font-medium">
            Choose player
          </label>
          <div className="relative">
            <select
              id="player"
              name="playerId"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue=""
              onChange={handlePlayerSelect}
            >
              <option value="" disabled>
                Select a player
              </option>
              {availablePlayers.map((player) => (
                <option key={player.id} value={player.id}>
                  {player.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <p>Selected Players:</p>
        {/* Selected Players */}
        {selectedPlayers.map((playerId) => {
          const selectedPlayer = players.find(
            (player) => player.id === playerId
          );
          return (
            <div key={playerId} className="mb-4">
              <li>{selectedPlayer?.name}</li>
            </div>
          );
        })}
        <div id="form-error" aria-live="polite" aria-atomic="true">
          {state.message && (
            <p className="mt-2 text-sm text-red-500">{state.message}</p>
          )}
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex h-10 items-center rounded-lg bg-blue-500 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-600"
        >
          Create Game
        </button>
      </div>
    </form>
  );
}

/* Game Status */

/* <fieldset>
  <legend className="mb-2 block text-sm font-medium">
    Set the game status
  </legend>
   <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
            <div className="flex gap-4">
              <div className="flex items-center">
                <input
                  id="pending"
                  name="status"
                  type="radio"
                  value="pending"
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                />
                <label
                  htmlFor="pending"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
                >
                  Pending <ClockIcon className="h-4 w-4" />
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="paid"
                  name="status"
                  type="radio"
                  value="paid"
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                />
                <label
                  htmlFor="paid"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white"
                >
                  Paid <CheckIcon className="h-4 w-4" />
                </label>
              </div>
            </div>
          </div> 
</fieldset>; */
