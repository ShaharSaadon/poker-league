import Form from '@/app/ui/games/edit-form';
import Breadcrumbs from '@/app/ui/games/breadcrumbs';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getGameById } from '@/app/lib/actions/games';
import { getPlayersByGame } from '@/app/lib/actions/players';
export const metadata: Metadata = {
  title: 'Edit Game',
};
export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  const id = params.id;
  const [game, players] = await Promise.all([
    getGameById(id),
    (async () => {
      const game = await getGameById(id);
      return getPlayersByGame(id);
    })(),
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
            label: 'Manage Game',
            href: `/dashboard/games/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form game={game} players={players} />
    </main>
  );
}
