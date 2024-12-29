import Form from '@/app/ui/tables/edit-form';
import Breadcrumbs from '@/app/ui/tables/breadcrumbs';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getTableById } from '@/app/lib/actions/tables';
import { getPlayersByTable } from '@/app/lib/actions/players';

export const metadata: Metadata = {
  title: 'Edit Table',
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;

  const [table, players] = await Promise.all([
    getTableById(id), // Ensure this fetches all required fields
    getPlayersByTable(id),
  ]);

  if (!table) {
    notFound();
  }

  // Pass both table and players to the Form component
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Tables', href: '/dashboard/tables' },
          {
            label: 'Edit Table',
            href: `/dashboard/tables/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form table={table} players={players} />
    </main>
  );
}
