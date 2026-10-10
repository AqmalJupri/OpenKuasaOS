import { notFound } from 'next/navigation';
import { PlaceholderPage } from '@/components/app/placeholder-page';
import { getProduct, findItem } from '@/config/nav';
import { SCREENS } from '@/screens/registry';
import CrmContactsPage from '@/screens/crm/contacts-page';
import CrmDealsPage from '@/screens/crm/deals-page';

export default async function ItemPage({
  params,
}: {
  params: Promise<{ product: string; item: string }>;
}) {
  const { product: key, item: slug } = await params;
  const product = getProduct(key);
  if (!product) notFound();

  const item = findItem(product, slug);
  if (!item) notFound();

  if (key === 'crm' && slug === 'contacts') return <CrmContactsPage />;
  if (key === 'crm' && slug === 'deals') return <CrmDealsPage />;

  const Screen = SCREENS[`${key}/${slug}`];
  if (Screen) return <Screen />;

  return (
    <PlaceholderPage title={item.label} subtitle={product.name} icon={item.icon} />
  );
}
