'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface OrderHistory {
  id: number;
  order_code: string;
  created_at: string;
  final_amount: number | string;
  status: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('history');
  const [loginMethod, setLoginMethod] = useState('email');
  const [token, setToken] = useState('');
  const [orders, setOrders] = useState<OrderHistory[]>([]);
  
  const [user, setUser] = useState({ name: '...', email: '', phone: '', rank_id: 'Dong' });
  const [editForm, setEditForm] = useState({ name: '', phone: '' });
  const [passForm, setPassForm] = useState({ old_password: '', new_password: '', new_password_confirmation: '' });

  const fetchOrders = (currentToken: string) => {
    axios.get('http://localhost:8000/api/profile/orders', {
      headers: { Authorization: `Bearer ${currentToken}` }
    }).then(res => setOrders(res.data)).catch(() => {});
  };

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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoginMethod(method);

    try {
      const parsedUser = JSON.parse(userDataStr);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser({
        name: parsedUser.name || '',
        email: parsedUser.email || '',
        phone: parsedUser.phone || '',
        rank_id: parsedUser.rank_id || 'Dong',
      });
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEditForm({ name: parsedUser.name || '', phone: parsedUser.phone || '' });
    } catch {
      console.error('Lỗi đọc dữ liệu User');
    }

    fetchOrders(storedToken);
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    router.push('/');
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/profile/update', editForm, { headers: { Authorization: `Bearer ${token}` } });
      localStorage.setItem('user_data', JSON.stringify(response.data.user));
      alert('Cập nhật thông tin thành công!');
      window.location.reload(); 
    } catch (error: unknown) {
      alert('Có lỗi xảy ra khi cập nhật!');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passForm.new_password !== passForm.new_password_confirmation) return alert('Mật khẩu nhập lại không khớp!');
    try {
      await axios.post('http://localhost:8000/api/profile/change-password', passForm, { headers: { Authorization: `Bearer ${token}` } });
      alert('Đổi mật khẩu thành công!');
      setPassForm({ old_password: '', new_password: '', new_password_confirmation: '' });
      setActiveTab('info');
    } catch (error: unknown) {
      alert('Mật khẩu cũ không đúng hoặc có lỗi!');
    }
  };

  const handleCancelOrder = async (orderId: number) => {
    if (!confirm('Bạn có chắc muốn hủy đơn hàng này không?')) return;
    try {
      await axios.put(`http://localhost:8000/api/profile/orders/${orderId}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Hủy đơn hàng thành công!');
      fetchOrders(token); 
    } catch {
      alert('Không thể hủy đơn hàng này!');
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
        <div className="w-full lg:w-2/3 flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button onClick={() => setActiveTab('history')} className={`flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-sm border transition group ${activeTab === 'history' ? 'border-sakura-500 bg-sakura-50' : 'border-sakura-100 hover:border-sakura-300'}`}>
              <svg className={`w-10 h-10 mb-2 transition ${activeTab === 'history' ? 'text-sakura-600' : 'text-sakura-400 group-hover:text-sakura-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
              <span className="font-bold text-gray-700">Lịch sử đơn hàng</span>
            </button>
            <div className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-sm border border-sakura-100">
              <svg className="w-10 h-10 text-sakura-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.846.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <span className="font-bold text-gray-700">Xin chào, <span className="text-sakura-500">{user.name}</span>!</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-sakura-100 p-6 transition-all min-h-[300px]">
            {/* TAB LỊCH SỬ ĐƠN HÀNG */}
            {activeTab === 'history' && (
              <div className="animate-fade-in">
                <h2 className="text-xl font-bold text-sakura-500 mb-6 border-b border-sakura-100 pb-3">Lịch sử mua hàng</h2>
                {orders.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-gray-500 mb-4">Bạn chưa có đơn hàng nào.</p>
                    <Link href="/" className="px-6 py-2 bg-sakura-100 text-sakura-600 font-bold rounded-lg hover:bg-sakura-200 transition">Đi săn waifu ngay!</Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map(order => (
                      <div key={order.id} className="border border-gray-100 bg-gray-50 rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center hover:shadow-md hover:border-sakura-200 transition gap-4">
                        <div>
                          <p className="font-bold text-gray-800">Mã đơn: <span className="text-sakura-500">{order.order_code}</span></p>
                          <p className="text-sm text-gray-500 mt-1">Ngày đặt: {new Date(order.created_at).toLocaleDateString('vi-VN')}</p>
                          <p className="text-lg text-gray-800 font-black mt-2">{Number(order.final_amount).toLocaleString('vi-VN')}₫</p>
                        </div>
                        <div className="flex flex-col items-end gap-2 w-full md:w-auto">
                          <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                            order.status === 'shipping' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                            order.status === 'completed' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-gray-200 text-gray-700 border border-gray-300'
                          }`}>
                            {order.status === 'pending' ? 'Chờ xác nhận' :
                             order.status === 'shipping' ? 'Đang giao hàng' :
                             order.status === 'completed' ? 'Thành công' : 'Đã hủy'}
                          </span>
                          {order.status === 'pending' && (
                            <button onClick={() => handleCancelOrder(order.id)} className="text-xs font-bold text-red-500 hover:underline mt-2">Hủy đơn hàng</button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB THÔNG TIN */}
            {activeTab === 'info' && (
              <div className="animate-fade-in">
                <h2 className="text-xl font-bold text-sakura-500 mb-6 border-b border-sakura-100 pb-3">Thông tin tài khoản</h2>
                <div className="space-y-4 text-gray-700 text-base">
                  <p><strong className="text-gray-900 w-32 inline-block">Họ tên:</strong> {user.name}</p>
                  <p><strong className="text-gray-900 w-32 inline-block">Email:</strong> {user.email}</p>
                  <p><strong className="text-gray-900 w-32 inline-block">Số điện thoại:</strong> {user.phone || <span className="text-gray-400 italic">Chưa cập nhật</span>}</p>
                  <p><strong className="text-gray-900 w-32 inline-block">Hạng thẻ:</strong> <span className="uppercase font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded border border-orange-200">{user.rank_id}</span></p>
                </div>
              </div>
            )}

            {/* TAB CHỈNH SỬA */}
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

            {/* TAB ĐỔI MẬT KHẨU */}
            {activeTab === 'password' && (
              <div className="animate-fade-in">
                <h2 className="text-xl font-bold text-sakura-500 mb-6 border-b border-sakura-100 pb-3">Thay đổi mật khẩu</h2>
                {loginMethod === 'google' ? (
                  <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-6 flex flex-col items-center justify-center text-center">
                    <h3 className="text-lg font-bold text-yellow-800 mb-2">Tài khoản liên kết với Google</h3>
                    <p className="text-yellow-700">Tài khoản này được đăng nhập thông qua Google OAuth. Không thể đổi mật khẩu.</p>
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

        {/* CỘT MENU PHẢI */}
        <div className="w-full lg:w-1/3">
          <div className="bg-white rounded-xl shadow-sm border border-sakura-100 overflow-hidden">
            <nav className="flex flex-col">
              <button onClick={() => setActiveTab('history')} className={`flex items-center px-6 py-4 font-semibold transition border-l-4 border-b ${activeTab === 'history' ? 'border-l-sakura-500 bg-sakura-50 text-sakura-600' : 'border-l-transparent text-gray-600 hover:bg-gray-50'}`}>Lịch sử đơn hàng</button>
              <button onClick={() => setActiveTab('info')} className={`flex items-center px-6 py-4 font-semibold transition border-l-4 border-b ${activeTab === 'info' ? 'border-l-sakura-500 bg-sakura-50 text-sakura-600' : 'border-l-transparent text-gray-600 hover:bg-gray-50'}`}>Thông tin cá nhân</button>
              <button onClick={() => setActiveTab('edit')} className={`flex items-center px-6 py-4 font-semibold transition border-l-4 border-b ${activeTab === 'edit' ? 'border-l-sakura-500 bg-sakura-50 text-sakura-600' : 'border-l-transparent text-gray-600 hover:bg-gray-50'}`}>Chỉnh sửa thông tin</button>
              <button onClick={() => setActiveTab('password')} className={`flex items-center px-6 py-4 font-semibold transition border-l-4 border-b ${activeTab === 'password' ? 'border-l-sakura-500 bg-sakura-50 text-sakura-600' : 'border-l-transparent text-gray-600 hover:bg-gray-50'}`}>Đổi mật khẩu</button>
              <button onClick={handleLogout} className="flex items-center px-6 py-4 font-semibold text-red-500 hover:bg-red-50 text-left">Đăng xuất</button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}