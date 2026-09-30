import Link from 'next/link';
import { merchandise, merchandiseCategories } from '../lib/merchandise';
import { ProductImage } from './product-image';

const nf = new Intl.NumberFormat('fa-IR');

const collectionPreview: Record<string, string> = {
  tshirt: '/products/categories/tshirt-preview.png',
  electronics: '/products/categories/electronics-preview.png',
};

const collectionCopy: Record<string, string> = {
  tshirt: 'تیشرت‌های برندشده برای رویداد، تیم و هدیه‌های روزمره.',
  hoodie: 'هودی‌های راحت و کاربردی با چاپ ظریف روی سینه چپ.',
  polo: 'پولوشرت‌های نیمه‌رسمی برای جلسات، رویدادها و تیم‌ها.',
  cap: 'کلاه‌های مینیمال با نشان برند و رنگ‌های آبی/کروم.',
  duffel: 'ساک‌های دستی مردانه برای سفر کوتاه، باشگاه و استفاده کاری.',
  backpack: 'کوله‌پشتی‌های روزانه برای لپ‌تاپ و رفت‌وآمد شهری.',
  accessory: 'بطری، ماگ، دفترچه، خودکار و ابزارهای کاربردی میز کار.',
  electronics: 'محصولات الکترونیکی و ابزارهای امن برای دارایی دیجیتال.',
};

function faIndex(index: number) {
  return String(index + 1).padStart(2, '0').replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]);
}

export function CollectionGrid({ className = '', limit }: { className?: string; limit?: number }) {
  const categories = typeof limit === 'number' ? merchandiseCategories.slice(0, limit) : merchandiseCategories;

  return <section className={`collections-grid ${className}`.trim()} aria-label="کالکشن‌های محصولات">
    {categories.map((category, index) => {
      const products = merchandise.filter((product) => product.category?.slug === category.slug);
      const preview = products[0];
      const previewImage = collectionPreview[category.slug] || preview?.image;

      return <Link className="card collection-card" href={`/collections/${category.slug}`} aria-label={`مشاهده کالکشن ${category.name}`} key={category.slug}>
        <span className={`collection-preview merch-tone-${index % 3}`}>
          {previewImage && <ProductImage src={previewImage} alt={`نمونه محصول ${category.name}`} />}
          <small>{nf.format(products.length)} محصول</small>
        </span>
        <span className="aida-index">{faIndex(index)}</span>
        <p>{collectionCopy[category.slug] || 'محصولات منتخب با طراحی برند و آماده سفارش سازمانی.'}</p>
        <span className="collection-arrow" aria-hidden>←</span>
      </Link>;
    })}
  </section>;
}
