# فروشگاه هدیه DBR

مونوریپو MVP فروشگاه هدیه با Next.js، NestJS و PostgreSQL. رابط فارسی RTL مطابق DBR/AIDA است.

## اجرا

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.local.example apps/web/.env.local
docker compose up -d postgres
npm install
npm run dev:api
npm run dev:web
```

- وب: `http://localhost:3000`
- API: `http://localhost:4000/api`
- Swagger: `http://localhost:4000/docs`
- دادهٔ seed در اولین اجرای API اعمال می‌شود. برای اجرای صریح: `npm run seed --workspace=@gift-shop/api`

## حساب‌های seed و ورود

- ادمین: `admin@gift.local` / `Admin123!`
- مشتری: `customer@gift.local`

ورود مشتری با ایمیل و OTP پنج‌رقمی انجام می‌شود. در محیط توسعه، کد OTP علاوه بر لاگ backend در پاسخ endpoint نیز با `devOtp` برمی‌گردد تا تست دستی سریع باشد.

کدهای شارژ پنج‌رقمی seed:

- `10000` → ۱۰۰ امتیاز
- `25000` → ۲۵۰ امتیاز
- `50050` → ۵۰ امتیاز

## پرداخت

درگاه پرداخت یک adapter نمایشی است: دکمهٔ «پرداخت موفق» سفارش را paid می‌کند، امتیاز/اعتبار مصرف‌شده را کم و تراکنش ثبت می‌کند. هیچ تراکنش مالی واقعی انجام نمی‌شود.
