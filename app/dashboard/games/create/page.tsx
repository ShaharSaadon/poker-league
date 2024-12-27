import Form from '@/app/ui/games/create-form';
import Breadcrumbs from '@/app/ui/games/breadcrumbs';
import { fetchPlayers } from '@/app/lib/data';
import { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Create Game',
};
export default async function Page() {
  const players = await fetchPlayers();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Games', href: '/dashboard/games' },
          {
            label: 'Create Game',
            href: '/dashboard/games/create',
            active: true,
          },
        ]}
      />
      <Form players={players} />
    </main>
  );
}
