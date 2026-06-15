'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

interface Product {
  id: number;
  name: string;
  base_price: string | number;
  is_preorder: boolean | number;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const fetchProducts = () => {
    const token = localStorage.getItem('admin_token');
    axios.get('http://localhost:8000/api/admin/products', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setProducts(res.data));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này không?')) return;
    
    const token = localStorage.getItem('admin_token');
    try {
      await axios.delete(`http://localhost:8000/api/admin/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast('Đã xóa sản phẩm thành công!', 'success');
      fetchProducts(); // Tải lại danh sách
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      showToast('Lỗi khi xóa sản phẩm!', 'error');
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* Thông báo Toast hiện lên ở góc dưới phải */}
      {toast.show && (
        <div className={`fixed bottom-6 right-6 px-6 py-4 rounded-xl text-white font-bold shadow-2xl transition-all z-50 animate-fade-in ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
          {toast.message}
        </div>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">📦 Quản lý Sản Phẩm</h2>
          <p className="mt-1 text-sm text-gray-500">Danh sách tất cả mô hình và phụ kiện đang bán.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/dashboard" className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 shadow-sm transition hover:bg-gray-50 hover:text-sakura-500">
            🔙 Về Tổng Quan
          </Link>
          <Link href="/admin/products/create" className="rounded-xl bg-sakura-500 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-sakura-600 hover:shadow-md">
            + Thêm Sản Phẩm Mới
          </Link>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="border-b border-sakura-100 bg-sakura-50 text-sakura-600">
              <tr>
                <th className="px-6 py-4 font-bold uppercase">ID</th>
                <th className="px-6 py-4 font-bold uppercase">Tên sản phẩm</th>
                <th className="px-6 py-4 font-bold uppercase">Giá gốc</th>
                <th className="px-6 py-4 font-bold uppercase">Trạng thái</th>
                <th className="px-6 py-4 text-right font-bold uppercase">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.length === 0 ? (
                <tr><td colSpan={5} className="py-8 text-center italic text-gray-400">Chưa có sản phẩm nào.</td></tr>
              ) : null}
              {products.map(p => (
                <tr key={p.id} className="transition hover:bg-sakura-50/50">
                  <td className="px-6 py-4 font-medium text-gray-900">#{p.id}</td>
                  <td className="px-6 py-4 font-semibold text-gray-800">{p.name}</td>
                  <td className="px-6 py-4 font-bold text-sakura-500">{Number(p.base_price).toLocaleString('vi-VN')}₫</td>
                  <td className="px-6 py-4">
                    {p.is_preorder 
                      ? <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">Pre-order</span>
                      : <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">Sẵn hàng</span>
                    }
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <Link href={`/admin/products/edit/${p.id}`} className="font-bold text-blue-500 transition hover:text-blue-700 hover:underline">Sửa</Link>
                    <button onClick={() => handleDelete(p.id)} className="font-bold text-red-500 transition hover:text-red-700 hover:underline">Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}