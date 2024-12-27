import Form from '@/app/ui/games/edit-form';
import Breadcrumbs from '@/app/ui/games/breadcrumbs';
import { fetchGameById, fetchPlayers } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Edit Game',
};
export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  const id = params.id;
  const [game, players] = await Promise.all([
    fetchGameById(id),
    fetchPlayers(),
  ]);

  if (!game) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Games', href: '/dashboard/games' },
          {
            label: 'Edit Game',
            href: `/dashboard/games/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form game={game} players={players} />
    </main>
  );
}
