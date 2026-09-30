'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../../lib/api';

type Product = {
  id?: string;
  name?: string;
  slug?: string;
  description?: string;
  sku?: string;
  price?: number;
  salePrice?: number | null;
  rating?: number;
  stock?: number;
  color?: string;
  image?: string;
  status?: string;
  giftSuitable?: boolean;
  categoryId?: string | null;
  collectionId?: string | null;
};

export function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const [catalog, setCatalog] = useState<{ categories: any[]; collections: any[] }>({ categories: [], collections: [] });
  const [message, setMessage] = useState('');
  const editing = Boolean(product?.id);

  useEffect(() => {
    api.get('/catalog').then(response => setCatalog(response.data)).catch(() => setCatalog({ categories: [], collections: [] }));
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');
    const form = new FormData(event.currentTarget);
    const salePrice = String(form.get('salePrice') || '').trim();
    const payload = {
      name: String(form.get('name') || '').trim(),
      slug: String(form.get('slug') || '').trim(),
      description: String(form.get('description') || '').trim(),
      sku: String(form.get('sku') || '').trim(),
      price: Number(form.get('price') || 0),
      salePrice: salePrice ? Number(salePrice) : undefined,
      rating: Number(form.get('rating') || 0),
      stock: Number(form.get('stock') || 0),
      color: String(form.get('color') || '').trim(),
      image: await productImage(form),
      status: String(form.get('status') || 'active'),
      giftSuitable: form.get('giftSuitable') === 'on',
      categoryId: String(form.get('categoryId') || '') || undefined,
      collectionId: String(form.get('collectionId') || '') || undefined,
    };
    try {
      if (editing) await api.patch(`/admin/products/${product!.id}`, payload);
      else await api.post('/admin/products', payload);
      router.push('/admin/products');
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'ذخیره محصول انجام نشد.');
    }
  }

  async function productImage(form: FormData) {
    const file = form.get('imageFile');
    if (file instanceof File && file.size > 0) {
      const uploadForm = new FormData();
      uploadForm.append('file', file);
      const response = await api.post('/admin/uploads/product-image', uploadForm);
      return response.data.image || response.data.url;
    }
    return String(form.get('image') || '').trim() || '🎁';
  }

  return <form className="form admin-form" onSubmit={submit}>
    <label>نام محصول<input name="name" defaultValue={product?.name || ''} required /></label>
    <label>اسلاگ انگلیسی<input name="slug" dir="ltr" defaultValue={product?.slug || ''} required /></label>
    <label>توضیحات<textarea name="description" rows={5} defaultValue={product?.description || ''} required /></label>
    <div className="admin-form-grid">
      <label>شناسه SKU<input name="sku" dir="ltr" defaultValue={product?.sku || ''} required /></label>
      <label>ارزش امتیازی<input name="price" type="number" min="0" defaultValue={product?.price ?? ''} required /></label>
      <label>امتیاز با تخفیف<input name="salePrice" type="number" min="0" defaultValue={product?.salePrice ?? ''} /></label>
      <label>امتیاز نمایش<input name="rating" type="number" min="0" max="5" defaultValue={product?.rating ?? 0} /></label>
      <label>موجودی<input name="stock" type="number" min="0" defaultValue={product?.stock ?? 0} required /></label>
      <label>رنگ<input name="color" defaultValue={product?.color || ''} /></label>
      <label>تصویر یا ایموجی<input name="image" defaultValue={product?.image || '🎁'} /></label>
      <label>آپلود تصویر محصول<input name="imageFile" type="file" accept="image/*" /></label>
      <label>وضعیت<select name="status" defaultValue={product?.status || 'active'}><option value="active">فعال</option><option value="draft">پیش‌نویس</option><option value="archived">آرشیو</option></select></label>
      <label>دسته<select name="categoryId" defaultValue={product?.categoryId || ''}><option value="">بدون دسته</option>{catalog.categories.map(item => <option value={item.id} key={item.id}>{item.name}</option>)}</select></label>
      <label>کالکشن<select name="collectionId" defaultValue={product?.collectionId || ''}><option value="">بدون کالکشن</option>{catalog.collections.map(item => <option value={item.id} key={item.id}>{item.name}</option>)}</select></label>
    </div>
    <label className="checkbox-row"><input name="giftSuitable" type="checkbox" defaultChecked={product?.giftSuitable ?? true} /> مناسب هدیه است</label>
    {message && <p className="notice" role="alert">{message}</p>}
    <div className="row"><button className="button primary">{editing ? 'ذخیره تغییرات' : 'افزودن محصول'}</button><button className="button secondary" type="button" onClick={() => router.push('/admin/products')}>انصراف</button></div>
  </form>;
}
