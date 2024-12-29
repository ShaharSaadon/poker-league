import { UpdateGame, ViewGame } from '@/app/ui/games/buttons';
import GameStatus from '@/app/ui/games/status';
import { formatDateToLocal, formatCurrency } from '@/app/lib/utils';
import { fetchFilteredGames } from '@/app/lib/actions/games';

export default async function GamesTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const games = await fetchFilteredGames(query, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {games?.map((game) => (
              <div
                key={game.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p>{game?.date.toString()}</p>
                    </div>
                    <p>Host: {game.host}</p>
                    <p>Number of Hands: {game.totalHands}</p>
                  </div>
                  <GameStatus status={game.status} />
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-xl font-medium">
                      {formatCurrency(game.totalAmount)}
                    </p>
                  </div>
                  <div className="flex justify-end gap-2">
                    {game.status === 'Playing' ? (
                      <UpdateGame id={game.id} />
                    ) : (
                      <ViewGame id={game.id} />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Date
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Total Amount
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Number of Hands
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Host
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Game Status
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {games?.map((game) => (
                <tr
                  key={game.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p>{formatDateToLocal(game.date.toDateString())}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatCurrency(game.totalAmount)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {game.totalHands}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">{game.host}</td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <GameStatus status={game.status} />
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-2">
                      {game.status === 'Playing' ? (
                        <UpdateGame id={game.id} />
                      ) : (
                        <ViewGame id={game.id} />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
