import Pagination from '@/app/ui/games/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/games/table';
import { CreateGame } from '@/app/ui/games/buttons';
import { lusitana } from '@/app/ui/fonts';
import { GamesTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { fetchGamesPages } from '@/app/lib/data';
import { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Games',
};
export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchGamesPages(query);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Games</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search games..." />
        <CreateGame />
      </div>
      <Suspense key={query + currentPage} fallback={<GamesTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
