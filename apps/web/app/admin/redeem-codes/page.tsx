'use client';

import { FormEvent, useEffect, useState } from 'react';
import { api, toman } from '../../../lib/api';

export default function Codes() {
  const [codes, setCodes] = useState<any[]>([]);
  const [message, setMessage] = useState('');

  function load() {
    api.get('/admin/redeem-codes').then(response => setCodes(response.data)).catch(() => setCodes([]));
  }

  useEffect(load, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setMessage('');
    const form = new FormData(formElement);
    const payload = {
      amount: Number(form.get('amount') || 0),
      count: Number(form.get('count') || 1),
      multiUse: form.get('multiUse') === 'on',
    };
    try {
      const response = await api.post('/admin/redeem-codes', payload);
      const created = Array.isArray(response.data) ? response.data.length : 1;
      setMessage(`${created.toLocaleString('fa-IR')} کد ساخته شد.`);
      formElement.reset();
      load();
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'تولید کد انجام نشد.');
    }
  }

  return <main className="shell">
    <h1>کدهای شارژ</h1>
    <section className="panel admin-section">
      <h2>تولید کد</h2>
      <form className="form admin-form" onSubmit={submit}>
        <div className="admin-form-grid">
          <label>امتیاز هر کد<input name="amount" type="number" min="1" required /></label>
          <label>تعداد<input name="count" type="number" min="1" max="100" defaultValue={1} required /></label>
        </div>
        <label className="checkbox-row"><input name="multiUse" type="checkbox" /> چندبارمصرف باشد</label>
        <button className="button primary">تولید کد</button>
        {message && <p className="notice">{message}</p>}
      </form>
    </section>
    <div className="table-wrap">
      <table className="table">
        <thead><tr><th>کد</th><th>امتیاز</th><th>وضعیت</th><th>نوع</th><th>استفاده‌شده توسط</th></tr></thead>
        <tbody>{codes.map(code => <tr key={code.id}>
          <td dir="ltr">{code.code}</td>
          <td>{toman(Number(code.amount))}</td>
          <td>{code.status === 'active' ? 'فعال' : 'مصرف‌شده'}</td>
          <td>{code.multiUse ? 'چندبارمصرف' : 'یک‌بارمصرف'}</td>
          <td>{code.usedById || 'استفاده نشده'}</td>
        </tr>)}</tbody>
      </table>
    </div>
  </main>;
}
