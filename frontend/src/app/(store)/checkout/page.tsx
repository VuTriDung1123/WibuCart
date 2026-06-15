'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface CheckoutCartItem {
  id: number;
  price: number;
  quantity: number;
}

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [voucher, setVoucher] = useState('');
  const [user, setUser] = useState({ name: '', phone: '', email: '' });
  
  const [cartItems, setCartItems] = useState<CheckoutCartItem[]>([]);

  useEffect(() => {
    const userDataStr = localStorage.getItem('user_data');
    if (userDataStr) {
      try {
        const parsed = JSON.parse(userDataStr);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUser({ name: parsed.name || '', phone: parsed.phone || '', email: parsed.email || '' });
      } catch {
        // Đã bỏ (e)
      }
    }

    const cart = JSON.parse(localStorage.getItem('wibu_cart') || '[]');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCartItems(cart);
  }, []);

  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const shippingFee = cartTotal > 0 ? 30000 : 0; 
  const finalTotal = cartTotal + shippingFee;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* ... (Giữ nguyên toàn bộ phần HTML render phía dưới như cũ, không thay đổi UI) ... */}
      <div className="mb-6 rounded-lg bg-white px-4 py-3 shadow-sm border border-sakura-100 text-sm text-gray-500">
        <Link href="/" className="hover:text-sakura-500">Trang chủ</Link>
        <span className="mx-2">/</span>
        <Link href="/cart" className="hover:text-sakura-500">Giỏ hàng</Link>
        <span className="mx-2">/</span>
        <span className="font-semibold text-sakura-500">Thanh toán</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ================= CỘT TRÁI ================= */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-sakura-100 p-6 md:p-8">
            <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
              <h2 className="text-2xl font-bold text-gray-800">Thông tin nhận hàng</h2>
              {!user.name && (
                <Link href="/login" className="text-sm font-semibold text-sakura-500 hover:underline">
                  Đăng nhập để nhận điểm
                </Link>
              )}
            </div>

            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Họ và tên *</label>
                  <input type="text" defaultValue={user.name} required className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 focus:bg-white focus:border-sakura-400 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Số điện thoại *</label>
                  <input type="tel" defaultValue={user.phone} required className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 focus:bg-white focus:border-sakura-400 focus:outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Tỉnh / Thành phố *</label>
                  <select required className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 focus:bg-white focus:border-sakura-400 focus:outline-none">
                    <option value="">Chọn Tỉnh</option>
                    <option value="hcm">Hồ Chí Minh</option>
                    <option value="hn">Hà Nội</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Quận / Huyện *</label>
                  <select required className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 focus:bg-white focus:border-sakura-400 focus:outline-none">
                    <option value="">Chọn Quận</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Phường / Xã *</label>
                  <select required className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 focus:bg-white focus:border-sakura-400 focus:outline-none">
                    <option value="">Chọn Phường</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Địa chỉ cụ thể *</label>
                <input type="text" placeholder="Số nhà, tên đường..." required className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 focus:bg-white focus:border-sakura-400 focus:outline-none" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Ghi chú cho đơn hàng</label>
                <textarea rows={3} className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 focus:bg-white focus:border-sakura-400 focus:outline-none"></textarea>
              </div>
            </form>
          </div>
        </div>

        {/* ================= CỘT PHẢI ================= */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-white rounded-2xl shadow-sm border border-sakura-100 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-100 pb-3">Phương thức thanh toán</h2>
            <div className="space-y-3">
              <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition ${paymentMethod === 'cod' ? 'border-sakura-500 bg-sakura-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="w-4 h-4 text-sakura-600 focus:ring-sakura-500" />
                <span className="ml-3 font-semibold text-gray-800">Thanh toán khi nhận hàng (COD)</span>
              </label>

              <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition ${paymentMethod === 'momo' ? 'border-sakura-500 bg-sakura-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                <input type="radio" name="payment" value="momo" checked={paymentMethod === 'momo'} onChange={() => setPaymentMethod('momo')} className="w-4 h-4 text-sakura-600 focus:ring-sakura-500" />
                <span className="ml-3 font-semibold text-gray-800 flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-pink-500 text-white rounded text-xs font-bold">MoMo</span> Quét mã QR
                </span>
              </label>

              <label className={`flex flex-col border rounded-xl cursor-pointer transition ${paymentMethod === 'bank' ? 'border-sakura-500 bg-sakura-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                <div className="flex items-center p-4" onClick={() => setPaymentMethod('bank')}>
                  <input type="radio" name="payment" value="bank" checked={paymentMethod === 'bank'} onChange={() => setPaymentMethod('bank')} className="w-4 h-4 text-sakura-600 focus:ring-sakura-500" />
                  <span className="ml-3 font-semibold text-gray-800">Chuyển khoản ngân hàng</span>
                </div>
                {paymentMethod === 'bank' && (
                  <div className="px-11 pb-4 text-sm text-gray-700">
                    <div className="bg-white p-3 rounded-lg border border-sakura-200">
                      <p><strong>Ngân hàng:</strong> TPBank</p>
                      <p><strong>STK:</strong> 07166092801</p>
                      <p><strong>Chủ thẻ:</strong> VU TRI DUNG</p>
                    </div>
                  </div>
                )}
              </label>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-sakura-100 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-100 pb-3">Tổng kết đơn hàng</h2>
            
            <div className="flex gap-2 mb-6">
              <input type="text" placeholder="Mã giảm giá" value={voucher} onChange={(e) => setVoucher(e.target.value)} className="flex-1 rounded-xl border border-gray-300 bg-gray-50 px-4 py-2 focus:bg-white focus:border-sakura-400 focus:outline-none" />
              <button className="bg-gray-800 text-white font-bold px-4 rounded-xl hover:bg-sakura-500 transition">Áp dụng</button>
            </div>

            <div className="space-y-3 text-sm text-gray-600 border-b border-gray-100 pb-4 mb-4">
              <div className="flex justify-between">
                <span>Tạm tính ({totalQuantity} sản phẩm)</span>
                <span className="font-semibold text-gray-800">{cartTotal.toLocaleString('vi-VN')}₫</span>
              </div>
              <div className="flex justify-between">
                <span>Phí vận chuyển</span>
                <span className="font-semibold text-gray-800">{shippingFee.toLocaleString('vi-VN')}₫</span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-6">
              <span className="text-lg font-bold text-gray-800">Tổng cộng</span>
              <span className="text-2xl font-black text-sakura-500">{finalTotal.toLocaleString('vi-VN')}₫</span>
            </div>

            <button className="w-full rounded-xl bg-sakura-500 py-4 font-bold text-white shadow-lg shadow-sakura-200 transition hover:bg-sakura-600 text-lg uppercase tracking-wider">
              Hoàn tất đặt hàng
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}