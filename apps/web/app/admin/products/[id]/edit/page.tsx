'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { api } from '../../../../../lib/api';
import { ProductForm } from '../../product-form';

export default function EditProduct() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>();

  useEffect(() => {
    api.get(`/admin/products/${id}`).then(response => setProduct(response.data)).catch(() => setProduct(null));
  }, [id]);

  if (product === undefined) return <main className="shell"><p className="notice">در حال دریافت محصول…</p></main>;
  if (product === null) return <main className="shell"><p className="notice">محصول پیدا نشد.</p></main>;

  return <main className="shell">
    <h1>ویرایش محصول</h1>
    <ProductForm product={product} />
  </main>;
}
