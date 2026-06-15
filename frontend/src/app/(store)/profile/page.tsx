'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();
  
  // 1. Quản lý trạng thái Tab đang hiển thị ('info', 'edit', 'password')
  const [activeTab, setActiveTab] = useState('info');
  
  // 2. State chứa dữ liệu người dùng
  const [user, setUser] = useState({
    name: 'Đang tải...',
    email: '',
    phone: null as string | null,
    rank_id: 'Dong',
  });

  // Load dữ liệu từ LocalStorage khi vào trang
  useEffect(() => {
    const token = localStorage.getItem('user_token');
    const userDataStr = localStorage.getItem('user_data');

    if (!token || !userDataStr) {
      router.push('/login'); // Chưa đăng nhập thì đuổi về
      return;
    }

    try {
      const parsedUser = JSON.parse(userDataStr);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser({
        name: parsedUser.name || 'Wibu Vô Danh',
        email: parsedUser.email || 'Chưa có email',
        phone: parsedUser.phone || null,
        rank_id: parsedUser.rank_id || 'Dong',
      });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      console.error('Lỗi đọc dữ liệu User');
    }
  }, [router]);

  // Xử lý Đăng xuất
  const handleLogout = () => {
    localStorage.removeItem('user_token');
    localStorage.removeItem('user_data');
    localStorage.removeItem('user_name'); // Clear luôn cái cũ cho sạch
    router.push('/');
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6 rounded-lg bg-white px-4 py-3 shadow-sm border border-sakura-100 text-sm text-gray-500">
        <Link href="/" className="hover:text-sakura-500">Trang chủ</Link>
        <span className="mx-2">/</span>
        <span className="font-semibold text-sakura-500">Trang khách hàng</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* ================= CỘT TRÁI: NỘI DUNG ĐỘNG ================= */}
        <div className="w-full lg:w-2/3 flex flex-col gap-6">
          
          {/* 2 Khối tĩnh luôn luôn hiển thị ở trên cùng */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-sm border border-sakura-100 hover:border-sakura-300 transition group">
              <svg className="w-10 h-10 text-sakura-400 mb-2 group-hover:text-sakura-600 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
              <span className="font-bold text-gray-700">Lịch sử đơn hàng</span>
            </button>

            <div className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-sm border border-sakura-100">
              <svg className="w-10 h-10 text-sakura-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.846.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <span className="font-bold text-gray-700">Xin chào, <span className="text-sakura-500">{user.name}</span>!</span>
            </div>
          </div>

          {/* KHU VỰC THAY ĐỔI THEO TAB */}
          <div className="bg-white rounded-xl shadow-sm border border-sakura-100 p-6 transition-all">
            
            {/* TAB 1: THÔNG TIN CÁ NHÂN */}
            {activeTab === 'info' && (
              <div className="animate-fade-in">
                <h2 className="text-xl font-bold text-sakura-500 mb-6 border-b border-sakura-100 pb-3">Thông tin tài khoản</h2>
                <div className="space-y-4 text-gray-700 text-base">
                  <p><strong className="text-gray-900 w-32 inline-block">Họ tên:</strong> {user.name}</p>
                  <p><strong className="text-gray-900 w-32 inline-block">Email:</strong> {user.email}</p>
                  <p><strong className="text-gray-900 w-32 inline-block">Số điện thoại:</strong> {user.phone ? user.phone : <span className="text-gray-400 italic">Chưa cập nhật</span>}</p>
                  <p><strong className="text-gray-900 w-32 inline-block">Hạng thẻ:</strong> <span className="uppercase font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded">{user.rank_id}</span></p>
                </div>
              </div>
            )}

            {/* TAB 2: CHỈNH SỬA THÔNG TIN */}
            {activeTab === 'edit' && (
              <div className="animate-fade-in">
                <h2 className="text-xl font-bold text-sakura-500 mb-6 border-b border-sakura-100 pb-3">Chỉnh sửa thông tin</h2>
                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <label className="sm:w-1/3 font-semibold text-gray-700 mb-1 sm:mb-0">Họ và tên</label>
                    <input type="text" defaultValue={user.name} className="sm:w-2/3 rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 focus:bg-white focus:border-sakura-400 focus:outline-none" />
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <label className="sm:w-1/3 font-semibold text-gray-700 mb-1 sm:mb-0">Số điện thoại</label>
                    <input type="tel" defaultValue={user.phone || ''} placeholder="Nhập số điện thoại" className="sm:w-2/3 rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 focus:bg-white focus:border-sakura-400 focus:outline-none" />
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <label className="sm:w-1/3 font-semibold text-gray-700 mb-1 sm:mb-0">Email</label>
                    <input type="email" value={user.email} disabled className="sm:w-2/3 rounded-lg border border-gray-200 bg-gray-100 text-gray-500 px-4 py-2.5 cursor-not-allowed" />
                  </div>
                  <div className="flex justify-end pt-4">
                    <button type="submit" className="rounded-lg bg-gray-800 px-6 py-2.5 font-bold text-white transition hover:bg-sakura-500">Cập nhật lưu</button>
                  </div>
                </form>
              </div>
            )}

            {/* TAB 3: ĐỔI MẬT KHẨU */}
            {activeTab === 'password' && (
              <div className="animate-fade-in">
                <h2 className="text-xl font-bold text-sakura-500 mb-6 border-b border-sakura-100 pb-3">Thay đổi mật khẩu</h2>
                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <label className="sm:w-1/3 font-semibold text-gray-700 mb-1 sm:mb-0">* Mật khẩu cũ:</label>
                    <input type="password" required className="sm:w-2/3 rounded-lg border border-gray-300 px-4 py-2.5 focus:border-sakura-400 focus:outline-none" />
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <label className="sm:w-1/3 font-semibold text-gray-700 mb-1 sm:mb-0">* Mật khẩu mới:</label>
                    <input type="password" required className="sm:w-2/3 rounded-lg border border-gray-300 px-4 py-2.5 focus:border-sakura-400 focus:outline-none" />
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <label className="sm:w-1/3 font-semibold text-gray-700 mb-1 sm:mb-0">* Nhập lại mật mới:</label>
                    <input type="password" required className="sm:w-2/3 rounded-lg border border-gray-300 px-4 py-2.5 focus:border-sakura-400 focus:outline-none" />
                  </div>
                  <div className="flex justify-start pt-4">
                    <button type="submit" className="rounded-lg border border-gray-300 bg-white px-8 py-2.5 font-bold text-gray-700 transition hover:bg-sakura-50 hover:border-sakura-400 hover:text-sakura-500 shadow-sm">Xác nhận</button>
                  </div>
                </form>
              </div>
            )}

          </div>
        </div>

        {/* ================= CỘT PHẢI: MENU ĐIỀU HƯỚNG ================= */}
        <div className="w-full lg:w-1/3">
          <div className="bg-white rounded-xl shadow-sm border border-sakura-100 overflow-hidden">
            <nav className="flex flex-col">
              
              <button 
                onClick={() => setActiveTab('info')} 
                className={`flex items-center px-6 py-4 font-semibold transition border-l-4 border-b ${activeTab === 'info' ? 'border-l-sakura-500 border-b-sakura-100 bg-sakura-50 text-sakura-600' : 'border-l-transparent border-b-gray-100 text-gray-600 hover:bg-gray-50'}`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                Thông tin cá nhân
              </button>
              
              <button 
                onClick={() => setActiveTab('edit')} 
                className={`flex items-center px-6 py-4 font-semibold transition border-l-4 border-b ${activeTab === 'edit' ? 'border-l-sakura-500 border-b-sakura-100 bg-sakura-50 text-sakura-600' : 'border-l-transparent border-b-gray-100 text-gray-600 hover:bg-gray-50'}`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                Chỉnh sửa thông tin
              </button>
              
              <button 
                onClick={() => setActiveTab('password')} 
                className={`flex items-center px-6 py-4 font-semibold transition border-l-4 border-b ${activeTab === 'password' ? 'border-l-sakura-500 border-b-sakura-100 bg-sakura-50 text-sakura-600' : 'border-l-transparent border-b-gray-100 text-gray-600 hover:bg-gray-50'}`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
                Đổi mật khẩu
              </button>
              
              <button onClick={handleLogout} className="flex items-center px-6 py-4 font-semibold text-red-500 hover:bg-red-50 transition border-l-4 border-transparent text-left">
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