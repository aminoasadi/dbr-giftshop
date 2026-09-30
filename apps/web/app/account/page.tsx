'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { api, toman } from '../../lib/api';

export default function Account() {
  const [user, setUser] = useState<any>();
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      router.replace('/login');
      return;
    }
    api.get('/auth/me').then((response) => setUser(response.data)).catch(() => {
      localStorage.removeItem('token');
      window.dispatchEvent(new Event('auth-change'));
      router.replace('/login');
    });
  }, [router]);

  function logout() {
    localStorage.removeItem('token');
    window.dispatchEvent(new Event('auth-change'));
    router.replace('/login');
  }

  if (user === undefined) return <main className="shell"><p className="notice">در حال دریافت پروفایل…</p></main>;

  return <main className="shell">
    <h1>پروفایل من</h1>
    <div className="account-grid">
      <aside className="card">
        <b>{user.fullName}</b>
        <p>{user.email}</p>
        <Link href="/account/orders">سفارش‌ها</Link><br />
        <Link href="/account/redeem">شارژ اعتبار</Link>
        <div style={{ marginTop: 18 }}>
          <button className="button secondary" onClick={logout}>خروج</button>
        </div>
      </aside>
      <section className="panel hero-copy">
        <div className="eyebrow">امتیاز قابل استفاده</div>
        <h2>{toman(Number(user.balance))}</h2>
        <p className="muted">با کد پنج‌رقمی کارت وفاداری شارژ می‌شود و در مرحله خرید خرج می‌شود.</p>
      </section>
    </div>
  </main>;
}
