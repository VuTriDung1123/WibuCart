'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

// 1. Định nghĩa cấu trúc dữ liệu Order
interface Order {
  id: number;
  order_code: string;
  created_at: string;
  final_amount: string | number;
  status: string;
}

export default function AdminOrders() {
  // 2. Thay thế any[] bằng Order[]
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    axios.get('http://localhost:8000/api/admin/orders', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setOrders(res.data));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">🛒 Quản lý Đơn Hàng</h2>
          <p className="mt-1 text-sm text-gray-500">Theo dõi tiến trình vận chuyển và thanh toán.</p>
        </div>
        <Link href="/admin/dashboard" className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 shadow-sm transition hover:bg-gray-50 hover:text-sakura-500">
          🔙 Về Tổng Quan
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="border-b border-sakura-100 bg-sakura-50 text-sakura-600">
              <tr>
                <th className="px-6 py-4 font-bold uppercase">Mã Đơn</th>
                <th className="px-6 py-4 font-bold uppercase">Ngày tạo</th>
                <th className="px-6 py-4 font-bold uppercase">Tổng tiền</th>
                <th className="px-6 py-4 font-bold uppercase">Trạng thái</th>
                <th className="px-6 py-4 text-right font-bold uppercase">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.length === 0 ? (
                <tr><td colSpan={5} className="py-8 text-center italic text-gray-400">Không có đơn hàng nào cần xử lý.</td></tr>
              ) : null}
              {orders.map(o => (
                <tr key={o.id} className="transition hover:bg-sakura-50/50">
                  <td className="px-6 py-4 font-bold text-gray-900">{o.order_code}</td>
                  <td className="px-6 py-4">{new Date(o.created_at).toLocaleDateString('vi-VN')}</td>
                  <td className="px-6 py-4 font-bold text-sakura-500">{Number(o.final_amount).toLocaleString('vi-VN')}₫</td>
                  <td className="px-6 py-4">
                    <span className="rounded-full border border-yellow-200 bg-yellow-100 px-3 py-1 text-xs font-bold capitalize text-yellow-700">
                      {o.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="font-medium text-sakura-400 transition hover:text-sakura-600 hover:underline">Chi tiết</button>
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