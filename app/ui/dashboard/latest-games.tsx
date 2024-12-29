import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import { getLatestGames } from '@/app/lib/actions/games';

export default async function LatestGames() {
  const latestGames = await getLatestGames();

  return (
    <div className="flex w-full flex-col md:col-span-4">
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Latest Games
      </h2>
      <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-4">
        {
          <div className="bg-white px-6">
            {latestGames.map((game) => (
              <div
                key={game.id}
                className="flex flex-row items-center justify-between py-4 border-t"
              >
                <div className="flex flex-col">
                  <p className="truncate text-sm font-semibold md:text-base">
                    Table: {game.table.name} {/* Access table name */}
                  </p>
                  <p className="text-sm text-gray-500">Host: {game.host}</p>
                  <p className="text-sm text-gray-500">
                    Players: {game.players.length} {/* Compute player count */}
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <p className="text-sm font-medium md:text-base">
                    Amount: ${game.startAmount}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(game.date).toLocaleString()} {/* Format date */}
                  </p>
                </div>
              </div>
            ))}
          </div>
        }
        <div className="flex items-center pb-2 pt-6">
          <ArrowPathIcon className="h-5 w-5 text-gray-500" />
          <h3 className="ml-2 text-sm text-gray-500 ">Updated just now</h3>
        </div>
      </div>
    </div>
  );
}
