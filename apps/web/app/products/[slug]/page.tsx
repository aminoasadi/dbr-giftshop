'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { ProductImage } from '../../../components/product-image';
import type { Product } from '../../../components/products';
import { api, points } from '../../../lib/api';
import { merchandise } from '../../../lib/merchandise';
import { useCart } from '../../../components/cart';
import './product-detail.css';

type DetailProduct = Product & { sku?: string; color?: string };
const number = new Intl.NumberFormat('fa-IR');

export default function Detail() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<DetailProduct | null>();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const zoom = useRef<HTMLDialogElement>(null);
  const { add, items } = useCart();

  useEffect(() => {
    const controller = new AbortController();
    const localProduct = merchandise.find(item => item.slug === slug);
    setProduct(localProduct);
    setQuantity(1);
    setAdded(false);
    api.get('/products/' + encodeURIComponent(slug), { signal: controller.signal })
      .then(response => { if (!controller.signal.aborted) setProduct(response.data); })
      .catch(() => { if (!controller.signal.aborted) setProduct(localProduct || null); });
    return () => controller.abort();
  }, [slug]);

  if (product === undefined) return <main className="shell pdp"><p className="notice" role="status">در حال دریافت اطلاعات محصول…</p></main>;
  if (!product) return <main className="shell pdp"><h1>محصول پیدا نشد.</h1><p className="muted">از میان محصولات موجود، هدیهٔ دیگری انتخاب کن.</p><Link className="button primary" href="/products">بازگشت به محصولات</Link></main>;

  const price = Number(product.salePrice ?? product.price);
  const stock = Math.max(0, Number(product.stock) || 0);
  const inCart = items.find((item: { productId: string }) => item.productId === product.id)?.quantity || 0;
  const available = Math.max(0, stock - inCart);
  const selectedQuantity = Math.min(quantity, Math.max(1, available));
  const related = merchandise.filter(item => item.category?.slug === product.category?.slug && item.slug !== product.slug).slice(0, 4);

  function addToCart() {
    if (!product || !available) return;
    add({ productId: product.id, name: product.name, price, quantity: selectedQuantity, image: product.image });
    setAdded(true);
    setQuantity(1);
  }

  return <main className="shell pdp">
    <nav className="pdp-breadcrumb" aria-label="مسیر صفحه">
      <Link href="/">خانه</Link><span aria-hidden>/</span><Link href="/products">محصولات</Link>
      {product.category && <><span aria-hidden>/</span><Link href={`/collections/${product.category.slug}`}>{product.category.name}</Link></>}
      <span aria-hidden>/</span><span aria-current="page">{product.name}</span>
    </nav>

    <section className="pdp-main" aria-labelledby="product-title">
      <div className="pdp-gallery">
        <button className="product-detail-visual pdp-photo" onClick={() => zoom.current?.showModal()} aria-label={`بزرگ‌نمایی تصویر ${product.name}`}>
          <ProductImage src={product.image} alt={product.name} />
          <span className="pdp-zoom-hint">بزرگ‌نمایی تصویر ↗</span>
        </button>
        <p className="pdp-caption">دیپ بلو شاپ <span>هدیه‌های کامیونیتی</span></p>
      </div>

      <div className="pdp-info">
        <div className="pdp-kicker"><span>{product.category?.name || 'محصولات کامیونیتی'}</span><span className="pdp-stock">{stock ? 'موجود در فروشگاه' : 'ناموجود'}</span></div>
        <h1 id="product-title">{product.name}</h1>
        <p className="pdp-description">{product.description}</p>
        <div className="pdp-pricing"><span>ارزش هر محصول</span><div><strong>{points(price)}</strong>{Number(product.price) > price && <del>{points(product.price)}</del>}</div></div>
        <p className="pdp-credit-note">این محصول را با امتیازهایی بخر که از همراهی در برنامهٔ وفاداری و مأموریت‌های کمپین گرفته‌ای.</p>

        <div className="pdp-order">
          <div className="pdp-quantity-row"><span id="quantity-label">تعداد</span><div className="pdp-quantity" role="group" aria-labelledby="quantity-label">
            <button aria-label="کاهش تعداد" disabled={selectedQuantity <= 1 || !available} onClick={() => { setQuantity(selectedQuantity - 1); setAdded(false); }}>−</button>
            <output aria-live="polite">{number.format(selectedQuantity)}</output>
            <button aria-label="افزایش تعداد" disabled={selectedQuantity >= available} onClick={() => { setQuantity(selectedQuantity + 1); setAdded(false); }}>+</button>
          </div><span className="pdp-remaining">{stock ? `${number.format(stock)} عدد موجود` : 'فعلاً قابل سفارش نیست'}</span></div>
          {selectedQuantity > 1 && <p className="pdp-total">جمع امتیاز این انتخاب <strong>{points(price * selectedQuantity)}</strong></p>}
          <button className="button primary pdp-add" disabled={!available} onClick={addToCart}>{!stock ? 'ناموجود' : !available ? 'موجودی قابل سفارش در سبد شماست' : 'افزودن به سبد خرید'}<span aria-hidden>←</span></button>
          <div className="pdp-feedback" role="status">{added ? 'محصول به سبد خریدت اضافه شد.' : inCart > 0 ? `${number.format(inCart)} عدد از این محصول در سبد توست.` : 'انتخابت را به سبد اضافه کن؛ سپس سفارش را تکمیل کن.'}</div>
          {inCart > 0 && <Link className="pdp-cart-link" href="/cart">مشاهدهٔ سبد و ادامهٔ خرید ←</Link>}
        </div>

        <div className="pdp-loyalty"><strong>کد امتیاز داری؟</strong><p>با ایمیلت وارد شو و کد پنج‌رقمی کارت را در پروفایلت ثبت کن.</p><Link href="/account/redeem">ورود و شارژ اعتبار ←</Link></div>
      </div>
    </section>

    <section className="pdp-details" aria-label="اطلاعات تکمیلی محصول">
      <div><p className="aida-label">قبل از انتخاب</p><h2>دربارهٔ این محصول</h2><p>{product.description}</p><dl>
        {product.category && <div><dt>دسته‌بندی</dt><dd>{product.category.name}</dd></div>}
        {product.sku && <div><dt>شناسهٔ کالا</dt><dd><bdi>{product.sku}</bdi></dd></div>}
        {product.color && <div><dt>رنگ</dt><dd>{product.color}</dd></div>}
        <div><dt>روش خرید</dt><dd>با اعتبار برنامهٔ وفاداری</dd></div><div><dt>ارزش امتیازی</dt><dd>{points(price)}</dd></div>
      </dl></div>
      <div className="pdp-guide"><p className="aida-label">از امتیاز تا هدیه</p><h2>چطور سفارش بدهم؟</h2>
        <ol><li><strong>اعتبارت را فعال کن.</strong><p>کد کارت امتیازت را در حساب ثبت کن.</p></li><li><strong>انتخابت را به سبد اضافه کن.</strong><p>تعداد و جمع امتیاز محصولات را بررسی کن.</p></li><li><strong>سفارشت را تکمیل کن.</strong><p>در ادامهٔ خرید، اطلاعات گیرنده و نشانی را وارد کن.</p></li></ol>
        <Link href="/#missions">برای امتیاز بیشتر، مأموریت‌ها را ببین ←</Link>
      </div>
    </section>

    {!!related.length && <section className="pdp-related" aria-labelledby="related-title"><header><div><p className="aida-label">در همین کالکشن</p><h2 id="related-title">انتخاب‌های دیگر</h2></div><Link href={`/collections/${product.category?.slug}`}>مشاهدهٔ کالکشن ←</Link></header><div className="pdp-related-grid">{related.map(item => <Link className="card pdp-related-card" key={item.id} href={`/products/${item.slug}`}><div className="product-detail-visual"><ProductImage src={item.image} alt={item.name} /></div><div className="pdp-related-copy"><h3>{item.name}</h3><span>{points(item.salePrice ?? item.price)}</span></div></Link>)}</div></section>}

    <dialog ref={zoom} className="pdp-zoom" aria-label={`تصویر بزرگ ${product.name}`} onClick={event => { if (event.target === event.currentTarget) zoom.current?.close(); }}>
      <button className="pdp-close" onClick={() => zoom.current?.close()} aria-label="بستن تصویر">×</button><div className="product-detail-visual"><ProductImage src={product.image} alt={product.name} /></div>
    </dialog>
  </main>;
}
