'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export function Header() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const syncAuth = () => setIsLoggedIn(Boolean(localStorage.getItem('token')));
    syncAuth();
    window.addEventListener('storage', syncAuth);
    window.addEventListener('focus', syncAuth);
    window.addEventListener('auth-change', syncAuth);
    return () => {
      window.removeEventListener('storage', syncAuth);
      window.removeEventListener('focus', syncAuth);
      window.removeEventListener('auth-change', syncAuth);
    };
  }, [pathname]);

  return <header className="top" aria-label="ناوبری اصلی">
    <Link className="brand" href="/">
      <span className="brand-kicker">دیپ بلو</span>
      <span>شاپ</span>
    </Link>
    <nav className="nav" aria-label="منوی اصلی">
      <Link href="/">خانه</Link>
      <Link href="/products">محصولات</Link>
      <Link href="/collections">کالکشن‌ها</Link>
      <Link href="/faq">راهنما</Link>
    </nav>
    <div className="header-tools">
      <Link className="header-login button primary" href={isLoggedIn ? '/account' : '/login'}>
        {isLoggedIn ? 'پروفایل من' : 'ورود'}
      </Link>
    </div>
  </header>;
}
