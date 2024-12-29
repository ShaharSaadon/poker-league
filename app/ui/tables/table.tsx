import { getFilteredTables } from '@/app/lib/actions/tables';
import Link from 'next/link';

export default async function TablesTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const tables = await getFilteredTables(query, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <table className="min-w-full text-gray-900">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Table Name
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Number of Players
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {tables?.map((table) => (
                <tr
                  key={table.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <Link
                      href={`/dashboard/tables/${table.id}/view`}
                      className="rounded-md border p-2 hover:bg-gray-100"
                    >
                      {table.name}
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {table.players.length}
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
