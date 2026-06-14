'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function DashboardOverview() {
  const [data, setData] = useState({ total_revenue: 0, new_orders: 0, total_users: 0, low_stock: 0 });

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    axios.get('http://localhost:8000/api/admin/dashboard', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setData(res.data)).catch(err => console.log(err));
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Tổng doanh thu</p>
          <p className="mt-2 text-2xl font-bold text-gray-800">{Number(data.total_revenue).toLocaleString('vi-VN')}₫</p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Đơn hàng mới chờ xử lý</p>
          <p className="mt-2 text-2xl font-bold text-gray-800">{data.new_orders}</p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Tổng User đăng ký</p>
          <p className="mt-2 text-2xl font-bold text-gray-800">{data.total_users}</p>
        </div>
      </div>
    </div>
  );
}