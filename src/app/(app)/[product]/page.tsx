import { notFound, redirect } from 'next/navigation';
import { getProduct, firstItem } from '@/config/nav';

/**
 * A product root (e.g. `/reach`) has no page of its own — send it to the
 * product's first nav item (its Overview dashboard). Applies to every module.
 */
export default async function ProductPage({
  params,
}: {
  params: Promise<{ product: string }>;
}) {
  const { product: key } = await params;
  const product = getProduct(key);
  if (!product) notFound();

  const item = firstItem(product);
  if (item) redirect(`/${key}/${item.slug}`);
  notFound();
}
