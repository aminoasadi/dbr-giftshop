'use client';

import { FormEvent, useEffect, useState } from 'react';
import { api, toman } from '../../../lib/api';

export default function Missions() {
  const [missions, setMissions] = useState<any[]>([]);
  const [message, setMessage] = useState('');

  function load() {
    api.get('/admin/missions').then(response => setMissions(response.data)).catch(() => setMissions([]));
  }

  useEffect(load, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');
    const form = new FormData(event.currentTarget);
    const payload = {
      title: String(form.get('title') || '').trim(),
      description: String(form.get('description') || '').trim(),
      points: Number(form.get('points') || 0),
      status: String(form.get('status') || 'active'),
      startsAt: String(form.get('startsAt') || '') || undefined,
      endsAt: String(form.get('endsAt') || '') || undefined,
    };
    try {
      await api.post('/admin/missions', payload);
      setMessage('مأموریت اضافه شد.');
      event.currentTarget.reset();
      load();
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'ذخیره مأموریت انجام نشد.');
    }
  }

  async function setStatus(id: string, status: string) {
    const mission = missions.find(item => item.id === id);
    if (!mission) return;
    await api.patch(`/admin/missions/${id}`, {
      title: mission.title,
      description: mission.description,
      points: Number(mission.points),
      startsAt: mission.startsAt || undefined,
      endsAt: mission.endsAt || undefined,
      status,
    });
    load();
  }

  return <main className="shell">
    <h1>مأموریت‌ها</h1>
    <section className="panel admin-section">
      <h2>مأموریت جدید</h2>
      <form className="form admin-form" onSubmit={submit}>
        <label>عنوان مأموریت<input name="title" required /></label>
        <label>توضیحات<textarea name="description" rows={4} required /></label>
        <div className="admin-form-grid">
          <label>امتیاز<input name="points" type="number" min="1" required /></label>
          <label>وضعیت<select name="status" defaultValue="active"><option value="active">فعال</option><option value="draft">پیش‌نویس</option><option value="archived">آرشیو</option></select></label>
          <label>شروع<input name="startsAt" type="date" /></label>
          <label>پایان<input name="endsAt" type="date" /></label>
        </div>
        <button className="button primary">افزودن مأموریت</button>
        {message && <p className="notice">{message}</p>}
      </form>
    </section>
    <div className="table-wrap">
      <table className="table">
        <thead><tr><th>مأموریت</th><th>امتیاز</th><th>زمان</th><th>وضعیت</th><th>عملیات</th></tr></thead>
        <tbody>{missions.map(mission => <tr key={mission.id}>
          <td><b>{mission.title}</b><br /><span className="muted">{mission.description}</span></td>
          <td>{toman(Number(mission.points))}</td>
          <td>{mission.startsAt ? new Date(mission.startsAt).toLocaleDateString('fa-IR') : 'همیشه'} تا {mission.endsAt ? new Date(mission.endsAt).toLocaleDateString('fa-IR') : 'بدون پایان'}</td>
          <td>{mission.status === 'active' ? 'فعال' : mission.status === 'draft' ? 'پیش‌نویس' : 'آرشیو'}</td>
          <td><button className="button secondary" onClick={() => setStatus(mission.id, mission.status === 'active' ? 'archived' : 'active')}>{mission.status === 'active' ? 'آرشیو' : 'فعال‌سازی'}</button></td>
        </tr>)}</tbody>
      </table>
    </div>
  </main>;
}
