import { notFound } from 'next/navigation';
import { PlaceholderPage } from '@/components/app/placeholder-page';
import { getProduct, findItem } from '@/config/nav';

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

  return (
    <PlaceholderPage title={item.label} subtitle={product.name} icon={item.icon} />
  );
}
