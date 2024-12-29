import Pagination from '@/app/ui/tables/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/tables/table';
import { CreateTable } from '@/app/ui/tables/buttons';
import { lusitana } from '@/app/ui/fonts';
import { GameSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { Metadata } from 'next';
import { getTablePages } from '@/app/lib/actions/tables';
export const metadata: Metadata = {
  title: 'Tables',
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
  const totalPages = await getTablePages(query);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Tables</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search tables..." />
        <CreateTable />
      </div>
      <Suspense key={query + currentPage} fallback={<GameSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
