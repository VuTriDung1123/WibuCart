'use client'; // Bắt buộc dùng vì có xử lý Form (Client Component)

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [email, setEmail] = useState('admin@wibucart.com');
  const [password, setPassword] = useState('123456');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:8000/api/login', {
        email,
        password,
      });

      // Lưu Token vào localStorage (Tương tự SharedPreferences trên Mobile)
      const token = response.data.access_token;
      localStorage.setItem('admin_token', token);
      
      // Đăng nhập thành công, chuyển hướng vào Dashboard
      alert('Đăng nhập thành công! Chào mừng ngài Admin.');
      router.push('/admin/dashboard'); 
      
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || 'Lỗi kết nối đến Server!');
      } else {
        setError('Lỗi không xác định!');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-sakura-50 px-4">
      {/* Box Đăng nhập mang phong cách Kawaii */}
      <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-xl border border-sakura-200">
        
        {/* Phần Header Form */}
        <div className="bg-sakura-100 py-6 text-center">
          <h1 className="text-3xl font-bold text-sakura-500">WibuCart</h1>
          <p className="mt-1 text-sm font-medium text-gray-600">Trang Quản Trị Hệ Thống</p>
        </div>

        {/* Phần Nhập liệu */}
        <div className="p-8">
          {error && (
            <div className="mb-4 rounded-lg bg-red-100 p-3 text-center text-sm font-semibold text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">Email Quản trị</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-800 transition focus:border-sakura-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sakura-100"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">Mật khẩu</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-800 transition focus:border-sakura-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sakura-100"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full rounded-xl bg-sakura-500 py-3 text-lg font-bold text-white transition hover:bg-sakura-600 disabled:opacity-70"
            >
              {loading ? 'Đang xác thực...' : 'ĐĂNG NHẬP'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}