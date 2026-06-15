'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';


export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // XỬ LÝ ĐĂNG NHẬP HOẶC ĐĂNG KÝ BẰNG EMAIL
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const endpoint = isLogin ? 'login' : 'register';

    try {
      const response = await axios.post(`http://localhost:8000/api/${endpoint}`, formData);
      
      // Lưu token của khách hàng vào máy
      localStorage.setItem('user_token', response.data.access_token);
      localStorage.setItem('user_data', JSON.stringify(response.data.user));
      localStorage.setItem('login_method', 'email');
      alert(isLogin ? 'Đăng nhập thành công!' : 'Đăng ký tài khoản thành công!');
      router.push('/'); 
      router.refresh();
      
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || err.response?.data?.message || 'Có lỗi xảy ra!');
      }
    }
  };

  // XỬ LÝ ĐĂNG NHẬP BẰNG GOOGLE THÀNH CÔNG
  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    setError('');
    try {
      const response = await axios.post('http://localhost:8000/api/google-login', {
        id_token: credentialResponse.credential
      });

      localStorage.setItem('user_token', response.data.access_token);
      localStorage.setItem('user_data', JSON.stringify(response.data.user));
      localStorage.setItem('login_method', 'google');
      alert('Đăng nhập bằng Google thành công!');
      router.push('/');
      router.refresh();
    } catch { 
      // Đã xóa 'err: unknown' đi để không bị báo lỗi unused
      setError('Đăng nhập bằng Google thất bại!');
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center py-10 px-4">
      <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-xl border border-sakura-100">
        
        <div className="bg-sakura-50 px-8 py-6 text-center border-b border-sakura-100">
          <Link href="/" className="inline-block text-3xl font-bold text-sakura-500 mb-2">WibuCart 🌸</Link>
          <h1 className="text-xl font-bold text-gray-800">{isLogin ? 'Chào mừng trở lại!' : 'Tạo tài khoản mới'}</h1>
        </div>

        <div className="p-8">
          {error && <div className="mb-4 rounded-lg bg-red-100 p-3 text-center text-sm font-bold text-red-600">{error}</div>}

          {/* NÚT BẤM GOOGLE THẬT */}
          <div className="flex justify-center mb-6">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Đăng nhập Google thất bại!')}
              useOneTap
            />
          </div>

          <div className="relative mb-6 flex items-center justify-center">
            <span className="absolute inset-x-0 h-px bg-gray-200"></span>
            <span className="relative bg-white px-4 text-sm font-medium text-gray-400">HOẶC</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">Tên hiển thị</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-800 outline-none focus:border-sakura-400" required={!isLogin} />
              </div>
            )}

            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">Email của bạn</label>
              <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-800 outline-none focus:border-sakura-400" required />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">Mật khẩu</label>
              <input type="password" name="password" value={formData.password} onChange={handleInputChange} className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-800 outline-none focus:border-sakura-400" required />
            </div>

            <button type="submit" className="mt-4 w-full rounded-xl bg-sakura-500 py-3.5 text-lg font-bold text-white shadow-lg shadow-sakura-200 transition hover:bg-sakura-600">
              {isLogin ? 'Đăng Nhập' : 'Tạo Tài Khoản'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm font-medium text-gray-600">
            {isLogin ? 'Chưa có tài khoản? ' : 'Đã có tài khoản? '}
            <button onClick={() => setIsLogin(!isLogin)} className="text-sakura-500 hover:text-sakura-600 font-bold hover:underline">
              {isLogin ? 'Đăng ký ngay' : 'Đăng nhập'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}