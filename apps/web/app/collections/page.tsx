import { CollectionGrid } from '../../components/collection-card';

export default function Collections() {
  return <main className="shell collections-shell">
    <div className="eyebrow">ALIASYS / Merchandise directory</div>
    <h1>کالکشن‌ها</h1>
    <p className="muted collections-lede">دسته‌بندی‌های اصلی فروشگاه؛ هر کالکشن با نمونه محصول واقعی و مسیر مستقیم برای مشاهده و خرید با امتیاز.</p>
    <CollectionGrid />
  </main>;
}
