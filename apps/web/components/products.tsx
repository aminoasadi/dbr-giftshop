'use client';

import Link from 'next/link';
import { ProductImage } from './product-image';
import { useMemo, useState } from 'react';
import { toman } from '../lib/api';
import { useCart } from './cart';
import { merchandise, merchandiseCategories } from '../lib/merchandise';
import { productSortLabels, sortProducts, type ProductSort } from '../lib/product-sort';
import { useId } from 'react';
import './product-sort.css';

export type Product = {
  id: string; slug: string; name: string; description: string; price: number;
  salePrice?: number; stock: number; image: string; category?: { name: string; slug: string };
  createdAt?: string; catalogOrder?: number; popularity?: number;
};

export function ProductGrid({ initial, initialCategory = 'all' }: { initial?: Product[]; initialCategory?: string }) {
  const [products] = useState<Product[]>(initial || merchandise);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [sort, setSort] = useState<ProductSort>('newest');
  const sortId = useId();
  const { add } = useCart();
  const visibleProducts = useMemo(
    () => sortProducts(activeCategory === 'all' ? products : products.filter((product) => product.category?.slug === activeCategory), sort),
    [activeCategory, products, sort],
  );

  return <>
    <div className="merch-categories" aria-label="دسته‌بندی محصولات">
      <button className={activeCategory === 'all' ? 'is-active' : ''} onClick={() => setActiveCategory('all')}>همه</button>
      {merchandiseCategories.map((category) =>
        <button className={activeCategory === category.slug ? 'is-active' : ''} key={category.slug} onClick={() => setActiveCategory(category.slug)}>{category.name}</button>,
      )}
    </div>
    <div className="merch-sortbar">
      <p role="status">{new Intl.NumberFormat('fa-IR').format(visibleProducts.length)} محصول</p>
      <div className="merch-sort-control"><label htmlFor={sortId}>مرتب‌سازی بر اساس</label>
        <select id={sortId} value={sort} onChange={event => setSort(event.target.value as ProductSort)}>
          {Object.entries(productSortLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
      </div>
    </div>
    {sort === 'popular' && visibleProducts.length > 0 && !visibleProducts.some(product => (product.popularity ?? 0) > 0) && <p className="merch-sort-note" role="status">هنوز آمار محبوبیت این محصولات ثبت نشده است؛ ترتیب فعلی حفظ شده است.</p>}
    {!visibleProducts.length ? <p className="notice">محصولی پیدا نشد.</p> :
      <div className="grid merch-grid">
        {visibleProducts.map((product, index) =>
          <article className="card merch-card" key={product.id}>
            <Link href={`/products/${product.slug}`}>
              <span className={`merch-visual merch-tone-${index % 3}`}>
                {product.image.startsWith('/')
                  ? <ProductImage src={product.image} alt={`محصول ${product.name}`} />
                  : <span className="product-icon">{product.image}</span>}
                <span className="merch-pill">{product.category?.name || 'محصول'}</span>
                <span className="merch-code">ALIASYS / {String(index + 1).padStart(2, '0')}</span>
              </span>
              <b>{product.name}</b>
              <p className="merch-description">{product.description}</p>
            </Link>
            <div className="price"><span className="price-label">ارزش اعتباری</span>{toman(product.salePrice ?? product.price)}{product.salePrice != null && <span className="old">{toman(product.price)}</span>}</div>
            <div className="merch-card-footer">
              <button className="button secondary" aria-label={`افزودن ${product.name} به سبد`} disabled={!product.stock} onClick={() => add({ productId: product.id, name: product.name, price: product.salePrice ?? product.price, quantity: 1, image: product.image })}>{product.stock ? 'افزودن به سبد' : 'ناموجود'}</button>
              <span>{product.category?.name}</span>
            </div>
          </article>
        )}
      </div>}
  </>;
}
