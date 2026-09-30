'use client';

import { FormEvent, useEffect, useState } from 'react';
import { api, toman } from '../../../lib/api';

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [message, setMessage] = useState('');

  function load() {
    api.get('/admin/users').then(response => setUsers(response.data)).catch(() => setUsers([]));
  }

  useEffect(load, []);

  async function bonus(event: FormEvent<HTMLFormElement>, id: string) {
    event.preventDefault();
    setMessage('');
    const form = new FormData(event.currentTarget);
    try {
      await api.post(`/admin/users/${id}/bonus`, { amount: Number(form.get('amount') || 0), reason: String(form.get('reason') || 'امتیاز مضاعف') });
      setMessage('امتیاز کاربر به‌روزرسانی شد.');
      event.currentTarget.reset();
      load();
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'افزودن امتیاز انجام نشد.');
    }
  }

  return <main className="shell">
    <h1>کاربران</h1>
    <p className="muted">کاربرانی که وارد سیستم شده‌اند، امتیاز فعلی و سابقه امتیازشان را اینجا می‌بینید.</p>
    {message && <p className="notice">{message}</p>}
    <div className="table-wrap">
      <table className="table">
        <thead><tr><th>کاربر</th><th>نقش</th><th>امتیاز</th><th>آخرین تراکنش‌ها</th><th>امتیاز مضاعف</th></tr></thead>
        <tbody>{users.map(user => <tr key={user.id}>
          <td><b>{user.fullName}</b><br /><span className="muted">{user.email}</span></td>
          <td>{user.role === 'admin' ? 'مدیر' : 'مشتری'}</td>
          <td>{toman(Number(user.balance))}</td>
          <td>{(user.creditTransactions || []).length ? (user.creditTransactions || []).slice(-2).reverse().map((item: any, index: number) => <div key={index}>{toman(Number(item.amount))}، {item.reason}</div>) : 'تراکنشی ندارد'}</td>
          <td>
            <form className="inline-form" onSubmit={event => bonus(event, user.id)}>
              <input name="amount" type="number" min="1" placeholder="امتیاز" required />
              <input name="reason" placeholder="دلیل" defaultValue="امتیاز مضاعف" required />
              <button className="button primary">افزودن</button>
            </form>
          </td>
        </tr>)}</tbody>
      </table>
    </div>
  </main>;
}
