import type { Product } from '../components/products';

export type ProductSort = 'cheapest' | 'expensive' | 'newest' | 'popular';
export const productSortLabels: Record<ProductSort, string> = {
  cheapest: 'کمترین ارزش اعتباری',
  expensive: 'بیشترین ارزش اعتباری',
  newest: 'جدیدترین',
  popular: 'محبوب‌ترین',
};

export function sortProducts(products: Product[], sort: ProductSort): Product[] {
  return [...products].sort((a, b) => {
    if (sort === 'cheapest') return Number(a.salePrice ?? a.price) - Number(b.salePrice ?? b.price);
    if (sort === 'expensive') return Number(b.salePrice ?? b.price) - Number(a.salePrice ?? a.price);
    if (sort === 'popular') return (b.popularity ?? 0) - (a.popularity ?? 0);
    const aDate = a.createdAt ? Date.parse(a.createdAt) : NaN;
    const bDate = b.createdAt ? Date.parse(b.createdAt) : NaN;
    if (Number.isFinite(aDate) && Number.isFinite(bDate)) return bDate - aDate;
    return (b.catalogOrder ?? 0) - (a.catalogOrder ?? 0);
  });
}
