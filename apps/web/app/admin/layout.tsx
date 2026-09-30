'use client';

import Link from 'next/link';
import { FormEvent, ReactNode, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { api } from '../../lib/api';

const navItems = [
  ['داشبورد', '/admin'],
  ['محصولات', '/admin/products'],
  ['مأموریت‌ها', '/admin/missions'],
  ['کدهای شارژ', '/admin/redeem-codes'],
  ['کاربران', '/admin/users'],
  ['سفارش‌ها', '/admin/orders'],
  ['موجودی', '/admin/inventory'],
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [allowed, setAllowed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    document.body.classList.add('admin-mode');
    return () => document.body.classList.remove('admin-mode');
  }, []);

  useEffect(() => {
    let active = true;
    setChecking(true);
    api.get('/admin/products').then(() => { if (active) setAllowed(true); }).catch(() => {
      if (active) setAllowed(false);
    }).finally(() => { if (active) setChecking(false); });
    return () => { active = false; };
  }, [pathname]);

  async function login(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const response = await api.post('/auth/admin/login', { email, password });
      localStorage.setItem('adminToken', response.data.accessToken);
      setPassword('');
      setAllowed(true);
    } catch (err: any) {
      setError(err.response?.status === 401 ? 'ایمیل یا رمز عبور نادرست است.' : 'ارتباط با سرور برقرار نشد. دوباره تلاش کنید.');
    } finally { setBusy(false); }
  }

  function logout() {
    localStorage.removeItem('adminToken');
    setAllowed(false);
  }

  if (checking) return <main className="shell"><p role="status">در حال بررسی دسترسی…</p></main>;
  if (!allowed) return <main className="shell"><form className="card" onSubmit={login} style={{ maxWidth: 440, margin: '48px auto', display: 'grid', gap: 16 }}>
    <h1 style={{ fontSize: 28 }}>ورود مدیریت</h1>
    <label htmlFor="admin-email">ایمیل</label>
    <input id="admin-email" type="email" dir="ltr" autoComplete="username" value={email} onChange={e => setEmail(e.target.value)} required />
    <label htmlFor="admin-password">رمز عبور</label>
    <input id="admin-password" type="password" dir="ltr" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} required />
    {error && <p role="alert">{error}</p>}
    <button className="button primary" disabled={busy}>{busy ? 'در حال ورود…' : 'ورود'}</button>
  </form></main>;

  return <div className="admin-app">
    <aside className="admin-sidebar" aria-label="ناوبری مدیریت">
      <Link className="admin-brand" href="/admin">
        <span>دیپ بلو شاپ</span>
        <small>پنل مدیریت</small>
      </Link>
      <nav className="admin-nav">
        {navItems.map(([label, href]) => {
          const active = href === '/admin' ? pathname === href : pathname.startsWith(href);
          return <Link className={active ? 'active' : ''} href={href} key={href}>{label}</Link>;
        })}
      </nav>
      <button className="button secondary admin-logout" onClick={logout}>خروج</button>
    </aside>
    <section className="admin-main">
      <header className="admin-toolbar">
        <div>
          <div className="eyebrow">داشبورد مدیریتی</div>
          <h1>{navItems.find(([, href]) => href === '/admin' ? pathname === href : pathname.startsWith(href))?.[0] || 'مدیریت'}</h1>
        </div>
        <Link className="button primary" href="/admin/products/new">محصول جدید</Link>
      </header>
      {children}
    </section>
  </div>;
}
