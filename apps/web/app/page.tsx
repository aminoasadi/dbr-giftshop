import Link from 'next/link';
import { HomeCollectionGrid } from '../components/home-collections';

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

const questions = [
  ['دیپ بلو شاپ چه ارتباطی با برنامهٔ وفاداری دارد؟', 'اینجا گیفت‌شاپ برنامهٔ وفاداری و کامیونیتی دیپ بلو است. مخاطبان و مشتریانی که در کمپین همراه ما هستند، با انجام مأموریت‌ها امتیاز می‌گیرند و آن امتیاز را اینجا برای خرید محصول خرج می‌کنند.'],
  ['اعتبار خرید من از کجا می‌آید؟', 'از مشارکت تو در برنامهٔ وفاداری؛ مثل تجربه‌کردن محتواهای دیجیتال، عضویت در خبرنامه و کامیونیتی، دنبال‌کردن اینستاگرام، ضبط پادکست و حضور در برنامه‌ها. هر مأموریت، پاداش و شرایط خودش را دارد.'],
  ['هر مأموریت چند امتیاز دارد؟', 'تجربهٔ دیجیتال ۱۰۰، عضویت در خبرنامه ۵۰، عضویت در دیسکورس ۱۵۰، دنبال‌کردن اینستاگرام ۵۰، ضبط پادکست ۵۰۰ و شرکت در برنامهٔ حضوری ۳۰۰ امتیاز دارد. امتیاز هر مأموریت پس از تأیید انجام آن قابل دریافت است.'],
  ['کد پنج‌رقمی کارت را کجا ثبت کنم؟', 'از دکمهٔ ورود، با ایمیل و کد یک‌بارمصرف وارد شو. سپس در بخش شارژ اعتبار پروفایلت، کد پنج‌رقمی کارت را ثبت کن. این کد با کد ورود ایمیلی متفاوت است.'],
  ['آیا عضویت یا دنبال‌کردن صفحه، حسابم را خودکار شارژ می‌کند؟', 'برای دریافت امتیاز، شرایط اعلام‌شدهٔ همان مأموریت را دنبال کن. در مسیر فعلی فروشگاه، اعتبار با ثبت کد کارت در حساب شارژ می‌شود.'],
];

export default function Home() {
  return <main className="aida-shell">
    <section className="aida-hero hero" data-chamfer="bl" data-cut="64" data-radius="12" data-fillet="10">
      <img className="aida-hero-photo" src="/products/home/hero-lifestyle.png" alt="" aria-hidden="true" />
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
        {missions.map(([title, label, description], index) => <article className="feature-card aida-card" key={label}>
          <span className="aida-index">{new Intl.NumberFormat('fa-IR', { minimumIntegerDigits: 2 }).format(index + 1)} / {label}</span>
          <h3>{title}</h3><p>{description}</p>
          <span className="aida-command">پاداش مأموریت: {new Intl.NumberFormat('fa-IR').format(missionPoints[index])} امتیاز</span>
        </article>)}
      </div>
    </section>

    <section className="aida-section" aria-labelledby="how-title">
      <header className="aida-heading"><div><p className="aida-label">از مشارکت تا خرید</p><h2 id="how-title">مأموریت آنجا. هدیه اینجا.</h2></div><p>اعتباری که اینجا خرج می‌کنی، حاصل حضورت در برنامهٔ وفاداری است.</p></header>
      <div className="aida-grid three-up">{steps.map(([title, description], index) => <article className="feature-card aida-card" key={title}>
        <span className="aida-index">{new Intl.NumberFormat('fa-IR', { minimumIntegerDigits: 2 }).format(index + 1)}</span>
        <h3>{title}</h3><p>{description}</p>
        {index === 1 && <Link className="aida-command" href="/account/redeem">ثبت کد و شارژ امتیاز <span aria-hidden>←</span></Link>}
        {index === 2 && <Link className="aida-command" href="/products">دیدن هدیه‌ها <span aria-hidden>←</span></Link>}
      </article>)}</div>
    </section>

    <section className="aida-section faq-section" aria-labelledby="faq-title">
      <header className="aida-heading"><div><p className="aida-label">دربارهٔ مأموریت، امتیاز و خرید</p><h2 id="faq-title">قبل از شروع بدان.</h2></div></header>
      <div className="faq-list">{questions.map(([question, answer], index) => <details className="aida-faq" key={question} open={index === 0}>
        <summary><span>{question}</span><b aria-hidden>+</b></summary><p>{answer}</p>
      </details>)}</div>
    </section>

    <section className="aida-cta" data-chamfer="bl" data-cut="44" data-radius="12" data-fillet="10">
      <p className="aida-label">پاداش همراهی تو با کامیونیتی دیپ بلو</p>
      <h2>امتیازش را گرفتی.<br />حالا هدیه‌اش را انتخاب کن.</h2>
      <Link className="button aida-primary" href="/products">شروع خرید <span aria-hidden>←</span></Link>
    </section>
  </main>;
}
