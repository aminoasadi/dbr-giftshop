'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api, toman } from '../../../lib/api';

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    api.get('/admin/products').then(response => setProducts(response.data)).catch(() => setProducts([]));
  }, []);

  return <main className="shell">
    <div className="row between">
      <div>
        <h1>محصولات</h1>
        <p className="muted">محصول‌ها، توضیحات، امتیاز، موجودی و وضعیت انتشار را مدیریت کنید.</p>
      </div>
      <Link className="button primary" href="/admin/products/new">محصول جدید</Link>
    </div>
    <div className="table-wrap">
      <table className="table">
        <thead><tr><th>محصول</th><th>امتیاز</th><th>امتیاز نمایش</th><th>موجودی</th><th>وضعیت</th><th>عملیات</th></tr></thead>
        <tbody>{products.map(product => <tr key={product.id}>
          <td><b>{product.name}</b><br /><span className="muted">{product.sku}</span></td>
          <td>{toman(Number(product.salePrice || product.price))}</td>
          <td>{Number(product.rating || 0).toLocaleString('fa-IR')} از ۵</td>
          <td>{Number(product.stock || 0).toLocaleString('fa-IR')}</td>
          <td>{product.status === 'active' ? 'فعال' : product.status}</td>
          <td><Link href={`/admin/products/${product.id}/edit`}>ویرایش</Link></td>
        </tr>)}</tbody>
      </table>
    </div>
  </main>;
}
