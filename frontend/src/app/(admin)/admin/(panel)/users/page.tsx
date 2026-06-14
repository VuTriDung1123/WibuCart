'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

// 1. Định nghĩa cấu trúc dữ liệu User
interface User {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  total_points: number;
  rank_id: string;
}

export default function AdminUsers() {
  // 2. Thay thế any[] bằng User[]
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    axios.get('http://localhost:8000/api/admin/users', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setUsers(res.data));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">👥 Dữ Liệu Khách Hàng</h2>
          <p className="mt-1 text-sm text-gray-500">Thông tin tài khoản và điểm tích lũy thành viên.</p>
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
                <th className="px-6 py-4 font-bold uppercase">ID</th>
                <th className="px-6 py-4 font-bold uppercase">Khách hàng</th>
                <th className="px-6 py-4 font-bold uppercase">Email / Liên hệ</th>
                <th className="px-6 py-4 text-center font-bold uppercase">Điểm Wibu</th>
                <th className="px-6 py-4 font-bold uppercase">Hạng thẻ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map(u => (
                <tr key={u.id} className="transition hover:bg-sakura-50/50">
                  <td className="px-6 py-4 font-medium text-gray-500">#{u.id}</td>
                  <td className="px-6 py-4 font-bold text-gray-800">{u.name}</td>
                  <td className="px-6 py-4">
                    <div className="text-gray-800">{u.email}</div>
                    <div className="mt-0.5 text-xs text-gray-400">{u.phone || 'Chưa cập nhật SĐT'}</div>
                  </td>
                  <td className="px-6 py-4 text-center font-bold text-orange-500">
                    ⭐ {u.total_points}
                  </td>
                  <td className="px-6 py-4">
                    <span className="rounded-lg border border-gray-200 bg-gray-100 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-gray-700">
                      {u.rank_id}
                    </span>
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