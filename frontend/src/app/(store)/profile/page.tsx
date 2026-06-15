'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();
  const [userName, setUserName] = useState('Đang tải...');

  useEffect(() => {
    const token = localStorage.getItem('user_token');
    if (!token) {
      router.push('/login'); // Nếu chưa đăng nhập thì đuổi về trang Login
      return;
    }
    // Lấy tên từ bộ nhớ tạm
    const storedName = localStorage.getItem('user_name');
    setUserName(storedName || 'Thành Viên WibuCart');
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user_token');
    localStorage.removeItem('user_name');
    router.push('/');
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <div className="mb-6 rounded-lg bg-white px-4 py-3 shadow-sm border border-sakura-100 text-sm text-gray-500">
        <Link href="/" className="hover:text-sakura-500">Trang chủ</Link>
        <span className="mx-2">/</span>
        <span className="font-semibold text-sakura-500">Trang khách hàng</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* CỘT TRÁI: NỘI DUNG CHÍNH */}
        <div className="w-full lg:w-2/3 flex flex-col gap-6">
          {/* 2 Khối trên cùng */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/profile/orders" className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-sm border border-sakura-100 hover:border-sakura-300 transition group">
              <svg className="w-10 h-10 text-sakura-400 mb-2 group-hover:text-sakura-600 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
              </svg>
              <span className="font-bold text-gray-700">Lịch sử đơn hàng</span>
            </Link>

            <div className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-sm border border-sakura-100">
              <svg className="w-10 h-10 text-sakura-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.846.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span className="font-bold text-gray-700">Xin chào, <span className="text-sakura-500">{userName}</span>!</span>
            </div>
          </div>

          {/* Khối Thông tin tài khoản */}
          <div className="bg-white rounded-xl shadow-sm border border-sakura-100 p-6">
            <h2 className="text-xl font-bold text-sakura-500 mb-4">Thông tin tài khoản</h2>
            <div className="space-y-3 text-gray-700">
              <p><strong className="text-gray-900">Họ tên:</strong> {userName}</p>
              <p><strong className="text-gray-900">Email:</strong> wibu@example.com</p>
              <p><strong className="text-gray-900">Số điện thoại:</strong> Chưa cập nhật</p>
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: MENU SIDEBAR */}
        <div className="w-full lg:w-1/3">
          <div className="bg-white rounded-xl shadow-sm border border-sakura-100 overflow-hidden">
            <nav className="flex flex-col">
              <Link href="/profile" className="flex items-center px-6 py-4 font-bold text-sakura-500 bg-sakura-50 border-b border-sakura-100">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                Thông tin cá nhân
              </Link>
              <Link href="#" className="flex items-center px-6 py-4 font-semibold text-gray-600 hover:bg-gray-50 border-b border-gray-100 transition">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>
                Chỉnh sửa thông tin
              </Link>
              <Link href="#" className="flex items-center px-6 py-4 font-semibold text-gray-600 hover:bg-gray-50 border-b border-gray-100 transition">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
                Đổi mật khẩu
              </Link>
              <button onClick={handleLogout} className="flex items-center px-6 py-4 font-semibold text-red-500 hover:bg-red-50 transition w-full text-left">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                Đăng xuất
              </button>
            </nav>
          </div>
        </div>

      </div>
    </div>
  );
}