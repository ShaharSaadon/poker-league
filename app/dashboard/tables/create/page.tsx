import Form from '@/app/ui/tables/create-form';
import Breadcrumbs from '@/app/ui/tables/breadcrumbs';
import { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Create Table',
};
export default async function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Tables', href: '/dashboard/tables' },
          {
            label: 'Create Table',
            href: '/dashboard/tables/create',
            active: true,
          },
        ]}
      />
      <Form />
    </main>
  );
}
