import Link from 'next/link';
import { assetUrl } from '../lib/assets';

const nf = new Intl.NumberFormat('fa-IR');

const homeCollections = [
  {
    title: 'تیشرت',
    slug: 'tshirt',
    count: 6,
    image: '/products/home/bento-tshirt.png',
    copy: 'لباس روزمرهٔ کمپین؛ ساده، کاربردی و آمادهٔ استفاده در رویدادها.',
    tileClass: 'home-collection-card--feature',
  },
  {
    title: 'هودی',
    slug: 'hoodie',
    count: 6,
    image: '/products/home/bento-hoodie.png',
    copy: 'هودی‌های نرم و تمیز برای اعضایی که همیشه همراه کامیونیتی‌اند.',
    tileClass: 'home-collection-card--tile',
  },
  {
    title: 'پولوشرت',
    slug: 'polo',
    count: 6,
    image: '/products/home/bento-polo.png',
    copy: 'پوشاک نیمه‌رسمی برای جلسه، رویداد و حضورهای حرفه‌ای‌تر.',
    tileClass: 'home-collection-card--small',
  },
  {
    title: 'کلاه',
    slug: 'cap',
    count: 6,
    image: '/products/home/bento-cap.png',
    copy: 'کلاه مینیمال با نشان واقعی ALIASYS برای استفادهٔ روزانه.',
    tileClass: 'home-collection-card--small',
  },
  {
    title: 'کوله پشتی',
    slug: 'backpack',
    count: 6,
    image: '/products/home/bento-backpack.png',
    copy: 'کولهٔ شهری برای لپ‌تاپ، کارت‌ها و وسایل ضروری روز.',
    tileClass: 'home-collection-card--tile',
  },
];

function faIndex(index: number) {
  return String(index + 1).padStart(2, '0').replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]);
}

export function HomeCollectionGrid() {
  return <section className="home-collections-grid" aria-label="کالکشن‌های منتخب هوم">
    {homeCollections.map((item, index) => <Link className={`home-collection-card ${item.tileClass}`} href={`/collections/${item.slug}`} key={item.slug}>
      <span className="home-collection-media">
        <img className="home-collection-fill" src={assetUrl(item.image)} alt="" aria-hidden="true" />
        <img className="home-collection-photo" src={assetUrl(item.image)} alt={`استفاده واقعی از ${item.title}`} />
        <small>{nf.format(item.count)} محصول</small>
      </span>
      <span className="home-collection-copy">
        <span className="aida-index">{faIndex(index)}</span>
        <strong>{item.title}</strong>
        <em>مشاهده کالکشن <b aria-hidden>←</b></em>
      </span>
    </Link>)}
  </section>;
}
