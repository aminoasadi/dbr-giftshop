'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const footerLinks = [
  ['خانه', '/'],
  ['محصولات', '/products'],
  ['کالکشن‌ها', '/collections'],
  ['راهنما', '/faq'],
];

const accountLinks = [
  ['ورود', '/login'],
  ['شارژ اعتبار', '/account/redeem'],
  ['سفارش‌ها', '/account/orders'],
];

export function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith('/admin')) return null;

  return <footer className="site-footer" aria-label="پاورقی سایت">
    <div className="site-footer-brand">
      <Link className="footer-brand" href="/">
        <span>دیپ بلو</span>
        <strong>شاپ</strong>
      </Link>
      <p>فروشگاه هدیه و اعتبار برنامه وفاداری دیپ بلو. امتیازها اینجا به انتخاب واقعی تبدیل می‌شوند.</p>
    </div>

    <nav className="site-footer-nav" aria-label="لینک‌های اصلی">
      <p>مسیرها</p>
      {footerLinks.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
    </nav>

    <nav className="site-footer-nav" aria-label="حساب کاربری">
      <p>حساب</p>
      {accountLinks.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
    </nav>

    <div className="site-footer-meta">
      <p>DBR GIFT SHOP</p>
      <span>House of Technocrats</span>
      <span>Community rewards and merchandise.</span>
    </div>
  </footer>;
}
