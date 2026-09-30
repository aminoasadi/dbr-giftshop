'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api, toman } from '../../lib/api';
import { merchandise } from '../../lib/merchandise';

const actions = [
  ['افزودن محصول', '/admin/products/new'],
  ['تعریف مأموریت', '/admin/missions'],
  ['تولید کد شارژ', '/admin/redeem-codes'],
  ['مدیریت کاربران', '/admin/users'],
];

const merchandiseStats = {
  products: merchandise.length,
  stock: merchandise.reduce((sum, item) => sum + Number(item.stock || 0), 0),
};

export default function Admin() {
  const [stats, setStats] = useState({ products: merchandiseStats.products, users: 0, missions: 0, codes: 0, stock: merchandiseStats.stock });

  useEffect(() => {
    let active = true;
    Promise.all([
      api.get('/admin/products').then(response => response.data).catch(() => []),
      api.get('/admin/users').then(response => response.data).catch(() => []),
      api.get('/admin/missions').then(response => response.data).catch(() => []),
      api.get('/admin/redeem-codes').then(response => response.data).catch(() => []),
    ]).then(([products, users, missions, codes]) => {
      if (!active) return;
      const realProducts = products.length ? products : merchandise;
      setStats({
        products: realProducts.length,
        users: users.length,
        missions: missions.filter((item: any) => item.status === 'active').length,
        codes: codes.filter((item: any) => item.status === 'active').length,
        stock: realProducts.reduce((sum: number, item: any) => sum + Number(item.stock || 0), 0),
      });
    });
    return () => { active = false; };
  }, []);

  return <main className="shell admin-dashboard">
    <section className="admin-kpis" aria-label="شاخص‌های فروشگاه">
      <div className="admin-kpi"><span>محصول فعال</span><strong>{stats.products.toLocaleString('fa-IR')}</strong></div>
      <div className="admin-kpi"><span>کاربر ثبت‌شده</span><strong>{stats.users.toLocaleString('fa-IR')}</strong></div>
      <div className="admin-kpi"><span>مأموریت فعال</span><strong>{stats.missions.toLocaleString('fa-IR')}</strong></div>
      <div className="admin-kpi"><span>کد شارژ فعال</span><strong>{stats.codes.toLocaleString('fa-IR')}</strong></div>
    </section>

    <section className="admin-dashboard-grid">
      <div className="panel admin-section">
        <h2>اقدام‌های سریع</h2>
        <div className="admin-actions">{actions.map(([label, href]) => <Link className="button secondary" href={href} key={href}>{label}</Link>)}</div>
      </div>
      <div className="panel admin-section">
        <h2>وضعیت امتیاز و موجودی</h2>
        <div className="admin-status-row"><span>کل موجودی قابل عرضه</span><strong>{stats.stock.toLocaleString('fa-IR')}</strong></div>
        <div className="admin-status-row"><span>ارزش نمونه کد شارژ</span><strong>{toman(100)}</strong></div>
        <p className="muted">برای تغییر امتیاز کاربران از بخش کاربران و برای تولید کدهای خودکار از بخش کدهای شارژ استفاده کنید.</p>
      </div>
    </section>
  </main>;
}
