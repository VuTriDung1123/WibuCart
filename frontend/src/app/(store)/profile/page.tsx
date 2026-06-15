'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('info');
  const [loginMethod, setLoginMethod] = useState('email');
  const [token, setToken] = useState('');
  
  const [user, setUser] = useState({ name: '...', email: '', phone: '', rank_id: 'Dong' });
  const [editForm, setEditForm] = useState({ name: '', phone: '' });
  const [passForm, setPassForm] = useState({ old_password: '', new_password: '', new_password_confirmation: '' });

  useEffect(() => {
    const storedToken = localStorage.getItem('user_token');
    const userDataStr = localStorage.getItem('user_data');
    const method = localStorage.getItem('login_method') || 'email';

    if (!storedToken || !userDataStr) {
      router.push('/login');
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setToken(storedToken);
    setLoginMethod(method);

    try {
      const parsedUser = JSON.parse(userDataStr);
      setUser({
        name: parsedUser.name || '',
        email: parsedUser.email || '',
        phone: parsedUser.phone || '',
        rank_id: parsedUser.rank_id || 'Dong',
      });
      // Đổ dữ liệu có sẵn vào form Edit
      setEditForm({
        name: parsedUser.name || '',
        phone: parsedUser.phone || ''
      });
    } catch (e) {
      console.error('Lỗi đọc dữ liệu User');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.clear(); // Xóa sạch sẽ mọi token, data, method
    router.push('/');
  };

  // 1. HÀM XỬ LÝ NÚT: CẬP NHẬT THÔNG TIN
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/profile/update', editForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      localStorage.setItem('user_data', JSON.stringify(response.data.user));
      
      alert('Cập nhật thông tin thành công!');
      window.location.reload(); 
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.error || 'Có lỗi xảy ra khi cập nhật!');
      } else {
        alert('Có lỗi xảy ra khi cập nhật!');
      }
    }
  };

  // 2. HÀM XỬ LÝ NÚT: ĐỔI MẬT KHẨU
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passForm.new_password !== passForm.new_password_confirmation) {
      alert('Mật khẩu nhập lại không khớp!');
      return;
    }
    try {
      await axios.post('http://localhost:8000/api/profile/change-password', passForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Đổi mật khẩu thành công! Vui lòng dùng mật khẩu mới cho lần đăng nhập sau.');
      setPassForm({ old_password: '', new_password: '', new_password_confirmation: '' });
      setActiveTab('info');
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.error || 'Mật khẩu cũ không đúng hoặc có lỗi!');
      } else {
        alert('Có lỗi xảy ra!');
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6 rounded-lg bg-white px-4 py-3 shadow-sm border border-sakura-100 text-sm text-gray-500">
        <Link href="/" className="hover:text-sakura-500">Trang chủ</Link>
        <span className="mx-2">/</span>
        <span className="font-semibold text-sakura-500">Trang khách hàng</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* ================= CỘT TRÁI ================= */}
        <div className="w-full lg:w-2/3 flex flex-col gap-6">
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

          <div className="bg-white rounded-xl shadow-sm border border-sakura-100 p-6 transition-all min-h-[300px]">
            
            {/* TAB 1 */}
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

            {/* TAB 2 */}
            {activeTab === 'edit' && (
              <div className="animate-fade-in">
                <h2 className="text-xl font-bold text-sakura-500 mb-6 border-b border-sakura-100 pb-3">Chỉnh sửa thông tin</h2>
                <form className="space-y-4" onSubmit={handleUpdateProfile}>
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <label className="sm:w-1/3 font-semibold text-gray-700 mb-1 sm:mb-0">Họ và tên</label>
                    <input type="text" value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})} required className="sm:w-2/3 rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 focus:bg-white focus:border-sakura-400 focus:outline-none" />
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <label className="sm:w-1/3 font-semibold text-gray-700 mb-1 sm:mb-0">Số điện thoại</label>
                    <input type="tel" value={editForm.phone} onChange={(e) => setEditForm({...editForm, phone: e.target.value})} placeholder="Nhập số điện thoại" className="sm:w-2/3 rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 focus:bg-white focus:border-sakura-400 focus:outline-none" />
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <label className="sm:w-1/3 font-semibold text-gray-700 mb-1 sm:mb-0">Email</label>
                    <input type="email" value={user.email} disabled className="sm:w-2/3 rounded-lg border border-gray-200 bg-gray-100 text-gray-500 px-4 py-2.5 cursor-not-allowed" />
                  </div>
                  <div className="flex justify-end pt-4">
                    <button type="submit" className="rounded-lg bg-sakura-500 px-6 py-2.5 font-bold text-white transition hover:bg-sakura-600 shadow-sm">Cập nhật lưu</button>
                  </div>
                </form>
              </div>
            )}

            {/* TAB 3 */}
            {activeTab === 'password' && (
              <div className="animate-fade-in">
                <h2 className="text-xl font-bold text-sakura-500 mb-6 border-b border-sakura-100 pb-3">Thay đổi mật khẩu</h2>
                
                {/* LƯỚI CHẶN GOOGLE LOGIN */}
                {loginMethod === 'google' ? (
                  <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-6 flex flex-col items-center justify-center text-center">
                    <svg className="w-16 h-16 text-yellow-500 mb-4" viewBox="0 0 24 24"><path fill="#FBBC05" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#4285F4" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 15.02 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                    <h3 className="text-lg font-bold text-yellow-800 mb-2">Tài khoản liên kết với Google</h3>
                    <p className="text-yellow-700">Tài khoản này được đăng nhập thông qua Google OAuth. Bạn không cần và không thể đổi mật khẩu tại hệ thống WibuCart.</p>
                  </div>
                ) : (
                  <form className="space-y-4" onSubmit={handleChangePassword}>
                    <div className="flex flex-col sm:flex-row sm:items-center">
                      <label className="sm:w-1/3 font-semibold text-gray-700 mb-1 sm:mb-0">* Mật khẩu cũ:</label>
                      <input type="password" required value={passForm.old_password} onChange={(e) => setPassForm({...passForm, old_password: e.target.value})} className="sm:w-2/3 rounded-lg border border-gray-300 px-4 py-2.5 focus:border-sakura-400 focus:outline-none" />
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center">
                      <label className="sm:w-1/3 font-semibold text-gray-700 mb-1 sm:mb-0">* Mật khẩu mới:</label>
                      <input type="password" required value={passForm.new_password} onChange={(e) => setPassForm({...passForm, new_password: e.target.value})} className="sm:w-2/3 rounded-lg border border-gray-300 px-4 py-2.5 focus:border-sakura-400 focus:outline-none" />
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center">
                      <label className="sm:w-1/3 font-semibold text-gray-700 mb-1 sm:mb-0">* Nhập lại mật mới:</label>
                      <input type="password" required value={passForm.new_password_confirmation} onChange={(e) => setPassForm({...passForm, new_password_confirmation: e.target.value})} className="sm:w-2/3 rounded-lg border border-gray-300 px-4 py-2.5 focus:border-sakura-400 focus:outline-none" />
                    </div>
                    <div className="flex justify-start pt-4">
                      <button type="submit" className="rounded-lg border border-gray-300 bg-white px-8 py-2.5 font-bold text-gray-700 transition hover:bg-sakura-50 hover:border-sakura-400 hover:text-sakura-500 shadow-sm">Xác nhận</button>
                    </div>
                  </form>
                )}
              </div>
            )}

          </div>
        </div>

        {/* ================= CỘT PHẢI ================= */}
        <div className="w-full lg:w-1/3">
          <div className="bg-white rounded-xl shadow-sm border border-sakura-100 overflow-hidden">
            <nav className="flex flex-col">
              <button onClick={() => setActiveTab('info')} className={`flex items-center px-6 py-4 font-semibold transition border-l-4 border-b ${activeTab === 'info' ? 'border-l-sakura-500 border-b-sakura-100 bg-sakura-50 text-sakura-600' : 'border-l-transparent border-b-gray-100 text-gray-600 hover:bg-gray-50'}`}>
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                Thông tin cá nhân
              </button>
              <button onClick={() => setActiveTab('edit')} className={`flex items-center px-6 py-4 font-semibold transition border-l-4 border-b ${activeTab === 'edit' ? 'border-l-sakura-500 border-b-sakura-100 bg-sakura-50 text-sakura-600' : 'border-l-transparent border-b-gray-100 text-gray-600 hover:bg-gray-50'}`}>
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                Chỉnh sửa thông tin
              </button>
              <button onClick={() => setActiveTab('password')} className={`flex items-center px-6 py-4 font-semibold transition border-l-4 border-b ${activeTab === 'password' ? 'border-l-sakura-500 border-b-sakura-100 bg-sakura-50 text-sakura-600' : 'border-l-transparent border-b-gray-100 text-gray-600 hover:bg-gray-50'}`}>
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