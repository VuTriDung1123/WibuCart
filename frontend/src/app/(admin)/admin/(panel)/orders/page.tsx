'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

interface Order {
  id: number;
  order_code: string;
  created_at: string;
  final_amount: string | number;
  status: string;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);

  const fetchOrders = () => {
    const token = localStorage.getItem('admin_token');
    axios.get('http://localhost:8000/api/admin/orders', { headers: { Authorization: `Bearer ${token}` } })
         .then(res => setOrders(res.data)).catch(() => {});
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    if (newStatus === 'cancelled' && !confirm('Bạn chắc chắn muốn hủy đơn hàng này?')) return;
    
    const token = localStorage.getItem('admin_token');
    try {
      await axios.put(`http://localhost:8000/api/admin/orders/${orderId}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Cập nhật trạng thái thành công!');
      fetchOrders(); // Tải lại list
    } catch {
      alert('Lỗi cập nhật trạng thái!');
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">🛒 Quản lý Đơn Hàng</h2>
          <p className="mt-1 text-sm text-gray-500">Theo dõi tiến trình vận chuyển và thanh toán.</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600 min-w-[800px]">
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
                    <select 
                      value={o.status} 
                      onChange={(e) => handleStatusChange(o.id, e.target.value)}
                      className={`rounded-full border px-3 py-1 text-xs font-bold capitalize outline-none cursor-pointer transition ${
                        o.status === 'pending' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                        o.status === 'shipping' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                        o.status === 'completed' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-700 border-gray-200'
                      }`}
                    >
                      <option value="pending">Chờ xác nhận</option>
                      <option value="shipping">Đang giao hàng</option>
                      <option value="completed">Thành công</option>
                      <option value="cancelled">Hủy đơn</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    {/* BẤM VÀO ĐÂY ĐỂ VÀO TRANG CHI TIẾT */}
                    <Link href={`/admin/orders/${o.id}`} className="font-bold text-blue-500 hover:text-blue-700 hover:underline">Chi tiết</Link>
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