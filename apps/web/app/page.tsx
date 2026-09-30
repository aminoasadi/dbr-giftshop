import Link from 'next/link';
import type { ReactNode } from 'react';
import { HomeCollectionGrid } from '../components/home-collections';
import { assetUrl } from '../lib/assets';

const missions = [
  ['تجربه کن.', 'تجربه‌های دیجیتال', 'تجربه‌های دیجیتال کمپین را ببین و مسیر هر تجربه را دنبال کن. آشنایی تو با ایده‌ها و محصولات ما، بخشی از مشارکت تو در کمپین است.'],
  ['در جریان بمان.', 'عضویت در خبرنامه', 'عضو خبرنامه شو و از تجربه‌های تازه، محتواها و برنامه‌های بعدی باخبر بمان.'],
  ['وارد گفت‌وگو شو.', 'کامیونیتی دیسکورس', 'به کامیونیتی ما در دیسکورس بپیوند؛ جایی برای پرسیدن، به‌اشتراک‌گذاشتن تجربه و گفت‌وگو با دیگر اعضا.'],
  ['همراه ما بمان.', 'اینستاگرام', 'صفحهٔ اینستاگرام ما را دنبال کن و همراه روایت‌ها، اتفاق‌ها و فراخوان‌های کمپین باش.'],
  ['صدایت را ثبت کن.', 'ضبط پادکست', 'در استودیوی ما پادکست ضبط کن. تجربه و دیدگاهت را به بخشی از محتوای کامیونیتی تبدیل کن.'],
  ['حضوری همراه شو.', 'برنامه‌های حضوری', 'در برنامه‌های حضوری خانهٔ تکنوکرات‌ها شرکت کن؛ فرصتی برای آشنایی، یادگیری و گفت‌وگو از نزدیک.'],
];

const steps = [
  ['مأموریتت را انجام بده.', 'از تجربه‌های دیجیتال تا حضور در رویدادها؛ با مشارکت در مأموریت‌های برنامهٔ وفاداری امتیاز کسب می‌کنی.'],
  ['امتیازت را وارد حساب کن.', 'با ایمیل و کد ورود وارد شو. کد پنج‌رقمی کارت امتیازت را در پروفایل ثبت کن تا اعتبار خریدت به حساب اضافه شود.'],
  ['هدیه‌ات را انتخاب کن.', 'ارزش محصولات با امتیاز مشخص شده است. اعتبار حاصل از همراهی‌ات در کمپین را برای سفارش محصول دلخواهت خرج کن.'],
];

const missionPoints = [100, 50, 150, 50, 500, 300];
const missionIconNames = ['compass', 'mail', 'message', 'instagram', 'mic', 'users'] as const;
const journeyIconNames = ['flag', 'key', 'gift'] as const;

function MissionStrokeIcon({ name }: { name: (typeof missionIconNames)[number] }) {
  const paths: Record<(typeof missionIconNames)[number], ReactNode> = {
    compass: <><circle cx="12" cy="12" r="8" /><path d="m14.7 9.3-1.6 4.4-4.4 1.6 1.6-4.4 4.4-1.6Z" /></>,
    mail: <><rect x="4" y="6" width="16" height="12" rx="2" /><path d="m5 8 7 5 7-5" /></>,
    message: <><path d="M5 7.8A3.8 3.8 0 0 1 8.8 4h6.4A3.8 3.8 0 0 1 19 7.8v3.9a3.8 3.8 0 0 1-3.8 3.8H11l-4.4 3v-3.2A3.8 3.8 0 0 1 5 12.1V7.8Z" /><path d="M9 9h6M9 12h4" /></>,
    instagram: <><rect x="5" y="5" width="14" height="14" rx="4" /><circle cx="12" cy="12" r="3.2" /><path d="M16.4 7.8h.1" /></>,
    mic: <><rect x="9" y="4" width="6" height="10" rx="3" /><path d="M6.5 11.5a5.5 5.5 0 0 0 11 0M12 17v3M9 20h6" /></>,
    users: <><path d="M9.5 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM4.5 19a5 5 0 0 1 10 0" /><path d="M16 11.4a2.6 2.6 0 1 0-1.2-5M16.6 18.6A4.2 4.2 0 0 0 13.8 15" /></>,
  };

  return <svg className="mission-stroke-svg" viewBox="0 0 24 24" aria-hidden="true">
    {paths[name]}
  </svg>;
}

function JourneyStrokeIcon({ name }: { name: (typeof journeyIconNames)[number] }) {
  const paths: Record<(typeof journeyIconNames)[number], ReactNode> = {
    flag: <><path d="M6 20V5" /><path d="M6 5h9.2l-1.4 3 1.4 3H6" /></>,
    key: <><circle cx="8.5" cy="12" r="3.5" /><path d="M12 12h8M16 12v3M19 12v2" /></>,
    gift: <><path d="M4.5 10h15v10h-15V10Z" /><path d="M4 10h16M12 10v10M7.4 7.4C6.6 6.6 6.8 5 8.3 5c2.2 0 3.7 5 3.7 5s-3.6-.6-4.6-2.6ZM16.6 7.4c.8-.8.6-2.4-.9-2.4-2.2 0-3.7 5-3.7 5s3.6-.6 4.6-2.6Z" /></>,
  };

  return <svg className="journey-stroke-svg" viewBox="0 0 24 24" aria-hidden="true">
    {paths[name]}
  </svg>;
}

export default function Home() {
  return <main className="aida-shell">
    <section className="aida-hero hero" data-chamfer="bl" data-cut="64" data-radius="12" data-fillet="10">
      <img className="aida-hero-photo" src={assetUrl('/products/home/hero-lifestyle.png')} alt="" aria-hidden="true" />
      <div className="aida-hero-copy">
        <p className="aida-label">دیپ بلو شاپ / گیفت‌شاپ برنامهٔ وفاداری و کامیونیتی</p>
        <h1>همراه شو. امتیاز بگیر.<br />هدیهٔ واقعی ببر.</h1>
        <p className="aida-lede">اینجا امتیازهای کامیونیتی دیپ بلو خرج می‌شوند. با انجام مأموریت‌های کمپین، از تجربه‌های دیجیتال تا برنامه‌های حضوری، اعتبار می‌گیری و با آن محصول دلخواهت را می‌خری. این هدیه، پاداش همراهی تو با ماست.</p>
        <div className="aida-actions">
          <Link className="button aida-primary" href="#missions">مأموریت‌ها را ببین <span aria-hidden>↓</span></Link>
          <Link className="button aida-secondary" href="/products">امتیاز دارم؛ انتخاب هدیه</Link>
        </div>
      </div>
    </section>

    <section className="aida-section" id="collections" aria-labelledby="gifts-title">
      <header className="aida-heading"><div><p className="aida-label">انتخاب با امتیازهای تو</p><h2 id="gifts-title">همراهی‌ات را با خودت ببر.</h2></div><Link className="aida-command" href="/collections">همهٔ کالکشن‌ها <span aria-hidden>←</span></Link></header>
      <p className="aida-lede" style={{ maxWidth: 'none', marginBottom: 24 }}>از پوشاک و اکسسوری تا کیف و محصولات الکترونیکی؛ هدیه‌ای انتخاب کن که به کارت بیاید. ارزش هر محصول را با امتیاز ببین و اعتبار برنامهٔ وفاداری‌ات را برای خرید آن خرج کن.</p>
      <HomeCollectionGrid />
    </section>

    <section className="aida-section" id="missions" style={{ scrollMarginTop: 140 }} aria-labelledby="missions-title">
      <header className="aida-heading"><div><p className="aida-label">مأموریت‌های برنامهٔ وفاداری</p><h2 id="missions-title">همراهی تو امتیاز دارد.</h2></div><p>مخاطب و مشتری ما هستی؛ مشارکتت در کمپین، اعتبار انتخاب هدیه می‌سازد.</p></header>
      <div className="aida-grid three-up">
        {missions.map(([title, label, description], index) => <article className="feature-card aida-card mission-card" key={label}>
          <div className="mission-card-head">
            <span className="aida-index">{new Intl.NumberFormat('fa-IR', { minimumIntegerDigits: 2 }).format(index + 1)} / {label}</span>
            <span className="mission-stroke-icon"><MissionStrokeIcon name={missionIconNames[index]} /></span>
          </div>
          <h3>{title}</h3><p>{description}</p>
          <span className="aida-command">پاداش مأموریت: {new Intl.NumberFormat('fa-IR').format(missionPoints[index])} امتیاز</span>
        </article>)}
      </div>
    </section>

    <section className="aida-section journey-section" aria-labelledby="how-title">
      <header className="aida-heading"><div><p className="aida-label">از مشارکت تا خرید</p><h2 id="how-title">مأموریت آنجا. هدیه اینجا.</h2></div></header>
      <div className="journey-timeline">{steps.map(([title, description], index) => <article className="journey-step" key={title}>
        <span className="journey-node"><JourneyStrokeIcon name={journeyIconNames[index]} /></span>
        <span className="journey-index">{new Intl.NumberFormat('fa-IR', { minimumIntegerDigits: 2 }).format(index + 1)}</span>
        <h3>{title}</h3>
        <p>{description}</p>
        {index === 1 && <Link className="journey-command" href="/account/redeem">ثبت کد و شارژ امتیاز <span aria-hidden>←</span></Link>}
        {index === 2 && <Link className="journey-command" href="/products">دیدن هدیه‌ها <span aria-hidden>←</span></Link>}
      </article>)}</div>
    </section>

    <section className="aida-cta" data-chamfer="bl" data-cut="44" data-radius="12" data-fillet="10">
      <p className="aida-label">پاداش همراهی تو با کامیونیتی دیپ بلو</p>
      <h2>امتیازش را گرفتی.<br />حالا هدیه‌اش را انتخاب کن.</h2>
      <Link className="button aida-primary" href="/products">شروع خرید <span aria-hidden>←</span></Link>
    </section>
  </main>;
}
