import { notFound } from 'next/navigation';
import { PlaceholderPage } from '@/components/app/placeholder-page';
import { getProduct, firstItem } from '@/config/nav';

export default async function ProductPage({
  params,
}: {
  params: Promise<{ product: string }>;
}) {
  const { product: key } = await params;
  const product = getProduct(key);
  if (!product) notFound();

  const item = firstItem(product);
  return (
    <PlaceholderPage
      title={item?.label ?? product.name}
      subtitle={product.tagline}
      icon={item?.icon ?? product.icon}
    />
  );
}
