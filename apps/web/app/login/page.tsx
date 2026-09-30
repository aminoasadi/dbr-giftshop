'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { api } from '../../lib/api';
import './login.css';

function LoginForm() {
  const q = useSearchParams();
  const [email, setEmail] = useState(q.get('email') || '');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  async function request(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      const response = await api.post('/auth/otp/request', { email });
      setStep('otp');
      setMessage(response.data.devOtp ? `کد ورود توسعه: ${response.data.devOtp}` : 'کد پنج‌رقمی به ایمیل شما ارسال شد.');
    } catch (err: any) {
      setError(err.response?.data?.message || 'ارسال کد ورود ناموفق بود.');
    }
  }

  async function verify(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      const response = await api.post('/auth/otp/verify', { email, code });
      localStorage.setItem('token', response.data.accessToken);
      window.dispatchEvent(new Event('auth-change'));
      router.push('/account');
    } catch (err: any) {
      setError(err.response?.data?.message || 'کد ورود نادرست است.');
    }
  }

  return <main className="shell login-shell">
    <section className="login-hero" aria-labelledby="login-title">
      <div className="login-copy">
        <p className="aida-label">ورود امن / شارژ اعتبار</p>
        <h1 id="login-title">حسابت را باز کن؛ امتیازت را شارژ کن.</h1>
        <p className="login-lede">با ایمیل وارد شو، کد یک‌بارمصرف را تأیید کن و در پروفایل خودت کد پنج‌رقمی کارت وفاداری را ثبت کن. اعتبار شارژشده همان امتیازی است که برای انتخاب هدیه‌ها خرج می‌کنی.</p>
        <div className="login-actions">
          <a className="aida-command" href="/account/redeem">بعد از ورود: شارژ اعتبار <span aria-hidden>←</span></a>
          <a className="aida-command" href="/products">دیدن هدیه‌ها <span aria-hidden>←</span></a>
        </div>
      </div>

      <form className="login-panel" onSubmit={step === 'email' ? request : verify}>
        <div>
          <p className="aida-label">{step === 'email' ? 'مرحلهٔ اول' : 'مرحلهٔ دوم'}</p>
          <h2>{step === 'email' ? 'دریافت کد ورود' : 'تأیید کد ایمیل'}</h2>
          <p>ورود با ایمیل انجام می‌شود؛ بعد از ورود، دکمهٔ «پروفایل من» جای ورود را می‌گیرد.</p>
        </div>

        <label className="login-field">
          <span>ایمیل</span>
          <input aria-label="ایمیل" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required disabled={step === 'otp'} />
        </label>

        {step === 'otp' && <label className="login-field">
          <span>کد یک‌بارمصرف</span>
          <input aria-label="کد پنج‌رقمی" inputMode="numeric" pattern="[0-9]{5}" maxLength={5} placeholder="کد پنج‌رقمی ایمیل" value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 5))} required />
        </label>}

        {message && <p className="login-notice" role="status">{message}</p>}
        {error && <p className="login-notice is-error" role="alert">{error}</p>}

        <div className="login-row">
          <button className="button primary">{step === 'email' ? 'دریافت کد ورود' : 'ورود به حساب'}</button>
          {step === 'otp' && <button type="button" className="button secondary" onClick={() => {
            setStep('email');
            setCode('');
            setMessage('');
          }}>تغییر ایمیل</button>}
        </div>
      </form>
    </section>

    <section className="login-credit-strip" aria-label="مسیر شارژ اعتبار">
      {[
        ['۰۱', 'ورود با ایمیل', 'کد ورود فقط برای ورود امن به پروفایل است.'],
        ['۰۲', 'ثبت کد کارت', 'کد پنج‌رقمی کارت وفاداری را در بخش شارژ اعتبار وارد می‌کنی.'],
        ['۰۳', 'خرید با امتیاز', 'اعتبار حساب برای انتخاب هدیه از محصولات فروشگاه خرج می‌شود.'],
      ].map(([index, title, description]) => <article className="login-step" key={index}>
        <span>{index}</span>
        <h3>{title}</h3>
        <p>{description}</p>
      </article>)}
    </section>
  </main>;
}

export default function Login() {
  return <Suspense fallback={<main className="shell login-shell"><p className="notice" role="status">در حال آماده‌سازی ورود…</p></main>}>
    <LoginForm />
  </Suspense>;
}
