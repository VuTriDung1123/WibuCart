/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface CheckoutCartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Ward { code: string; name: string; }
interface District { code: string; name: string; wards: Ward[]; }
interface Province { code: string; name: string; districts: District[]; }

export default function CheckoutPage() {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [voucher, setVoucher] = useState('');
  const [note, setNote] = useState(''); 
  const [user, setUser] = useState({ name: '', phone: '', email: '' });
  const [cartItems, setCartItems] = useState<CheckoutCartItem[]>([]);

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  
  const [selectedProv, setSelectedProv] = useState('');
  const [selectedDist, setSelectedDist] = useState('');
  const [selectedWard, setSelectedWard] = useState('');

  // Dùng riêng cho thanh toán COD
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [orderCode, setOrderCode] = useState('');

  useEffect(() => {
    const userDataStr = localStorage.getItem('user_data');
    if (userDataStr) {
      try {
        const parsed = JSON.parse(userDataStr);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUser({ name: parsed.name || '', phone: parsed.phone || '', email: parsed.email || '' });
      } catch {}
    } else {
      alert('Vui lòng đăng nhập để tiến hành đặt hàng!');
      router.push('/login');
    }

    const cart = JSON.parse(localStorage.getItem('wibu_cart') || '[]');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCartItems(cart);

    axios.get('https://provinces.open-api.vn/api/?depth=3')
      .then(res => setProvinces(res.data))
      .catch(() => console.error('Lỗi API Tỉnh Thành'));
  }, [router]);

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const pCode = e.target.value;
    setSelectedProv(pCode);
    setSelectedDist('');
    setSelectedWard('');
    setWards([]);
    const prov = provinces.find(p => p.code == pCode);
    setDistricts(prov ? prov.districts : []);
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const dCode = e.target.value;
    setSelectedDist(dCode);
    setSelectedWard('');
    const dist = districts.find(d => d.code == dCode);
    setWards(dist ? dist.wards : []);
  };

  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = cartTotal > 0 ? 30000 : 0; 
  const finalTotal = cartTotal + shippingFee;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return alert('Giỏ hàng đang trống!');
    if (!selectedProv || !selectedDist || !selectedWard) return alert('Vui lòng chọn đầy đủ Tỉnh/Huyện/Xã!');

    const provName = provinces.find(p => p.code == selectedProv)?.name || '';
    const distName = districts.find(d => d.code == selectedDist)?.name || '';
    const wardName = wards.find(w => w.code == selectedWard)?.name || '';
    const specificAddress = (document.getElementById('specificAddress') as HTMLInputElement)?.value || '';
    
    const fullAddress = `${specificAddress}, ${wardName}, ${distName}, ${provName}`;
    
    const payload = {
      cart_items: cartItems,
      customer_name: user.name,
      phone: user.phone,
      address: fullAddress,
      payment_method: paymentMethod,
      note: note 
    };

    try {
      const token = localStorage.getItem('user_token');
      const headers = { Authorization: `Bearer ${token}` }; 

      const res = await axios.post('http://localhost:8000/api/store/checkout', payload, { headers });
      
      localStorage.removeItem('wibu_cart');
      window.dispatchEvent(new Event('cartUpdated'));

      const code = res.data.order_code;

      // CHUYỂN HƯỚNG THEO PHƯƠNG THỨC THANH TOÁN
      if (paymentMethod === 'cod') {
        setOrderCode(code);
        setIsOrderPlaced(true); // COD thì hiện vận chuyển luôn
      } else {
        // MoMo/Bank thì đẩy sang trang QR
        router.push(`/payment?order_code=${code}&method=${paymentMethod}&amount=${finalTotal}`);
      }

    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const msg = error.response?.data?.error || error.response?.data?.message || error.message || 'Lỗi không xác định';
        alert('Lỗi đặt hàng: ' + msg);
      } else {
        alert('Lỗi đặt hàng không xác định!');
      }
    }
  };

  // MÀN HÌNH TRACKING (CHỈ HIỂN THỊ KHI LÀ COD)
  if (isOrderPlaced) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <div className="bg-white rounded-3xl shadow-xl border border-sakura-100 p-8 md:p-12 w-full max-w-3xl text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Đặt hàng thành công!</h1>
          <p className="text-gray-500 mb-8">Cảm ơn bạn đã ủng hộ. Mã đơn hàng của bạn là: <strong className="text-sakura-500">{orderCode}</strong></p>

          <div className="relative flex flex-col md:flex-row justify-between items-center w-full max-w-2xl mx-auto my-12 before:absolute before:inset-0 before:top-1/2 before:-translate-y-1/2 before:h-1 before:bg-gray-100 md:before:block before:hidden z-0">
            <div className="relative z-10 flex flex-col items-center bg-white md:bg-transparent mb-6 md:mb-0 px-2">
              <div className="w-12 h-12 bg-sakura-500 text-white rounded-full flex items-center justify-center font-bold shadow-md shadow-sakura-200 border-4 border-white mb-2">1</div>
              <span className="text-sm font-bold text-sakura-500">Chờ xác nhận</span>
            </div>
            <div className="relative z-10 flex flex-col items-center bg-white md:bg-transparent mb-6 md:mb-0 px-2">
              <div className="w-12 h-12 bg-sakura-100 text-sakura-300 rounded-full flex items-center justify-center font-bold border-4 border-white mb-2">2</div>
              <span className="text-sm font-semibold text-gray-400">Đóng gói</span>
            </div>
            <div className="relative z-10 flex flex-col items-center bg-white md:bg-transparent mb-6 md:mb-0 px-2">
              <div className="w-12 h-12 bg-sakura-100 text-sakura-300 rounded-full flex items-center justify-center font-bold border-4 border-white mb-2">3</div>
              <span className="text-sm font-semibold text-gray-400">Vận chuyển</span>
            </div>
            <div className="relative z-10 flex flex-col items-center bg-white md:bg-transparent px-2">
              <div className="w-12 h-12 bg-sakura-100 text-sakura-300 rounded-full flex items-center justify-center font-bold border-4 border-white mb-2">4</div>
              <span className="text-sm font-semibold text-gray-400">Giao thành công</span>
            </div>
          </div>

          <div className="bg-sakura-50 p-6 rounded-2xl border border-sakura-100 text-left mb-8">
            <h3 className="font-bold text-gray-800 mb-4 border-b border-sakura-200 pb-2">Thông tin thanh toán</h3>
            <p className="text-sm text-gray-700 mb-2">Phương thức: <strong className="uppercase">{paymentMethod}</strong></p>
            <p className="text-sm text-gray-700">Tổng tiền: <strong className="text-sakura-500 text-lg">{finalTotal.toLocaleString('vi-VN')}₫</strong></p>
          </div>

          <Link href="/profile" className="inline-block rounded-xl bg-gray-800 px-8 py-3.5 font-bold text-white shadow-lg transition hover:bg-sakura-500 uppercase tracking-wide">
            Xem đơn hàng
          </Link>
        </div>
      </div>
    );
  }

  // MÀN HÌNH ĐIỀN THÔNG TIN FORM
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 rounded-lg bg-white px-4 py-3 shadow-sm border border-sakura-100 text-sm text-gray-500">
        <Link href="/" className="hover:text-sakura-500">Trang chủ</Link>
        <span className="mx-2">/</span>
        <Link href="/cart" className="hover:text-sakura-500">Giỏ hàng</Link>
        <span className="mx-2">/</span>
        <span className="font-semibold text-sakura-500">Thanh toán</span>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-sakura-100 p-6 md:p-8">
            <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
              <h2 className="text-2xl font-bold text-gray-800">Thông tin nhận hàng</h2>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Họ và tên *</label>
                  <input type="text" value={user.name} onChange={e => setUser({...user, name: e.target.value})} required className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 focus:bg-white focus:border-sakura-400 outline-none transition" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Số điện thoại *</label>
                  <input type="tel" value={user.phone} onChange={e => setUser({...user, phone: e.target.value})} required className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 focus:bg-white focus:border-sakura-400 outline-none transition" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Tỉnh / Thành phố *</label>
                  <select required value={selectedProv} onChange={handleProvinceChange} className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 focus:bg-white focus:border-sakura-400 outline-none transition">
                    <option value="">Chọn Tỉnh</option>
                    {provinces.map(p => (
                      <option key={p.code} value={p.code}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Quận / Huyện *</label>
                  <select required value={selectedDist} onChange={handleDistrictChange} disabled={!selectedProv} className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 focus:bg-white focus:border-sakura-400 outline-none transition disabled:opacity-50">
                    <option value="">Chọn Quận</option>
                    {districts.map(d => (
                      <option key={d.code} value={d.code}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Phường / Xã *</label>
                  <select required value={selectedWard} onChange={e => setSelectedWard(e.target.value)} disabled={!selectedDist} className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 focus:bg-white focus:border-sakura-400 outline-none transition disabled:opacity-50">
                    <option value="">Chọn Phường</option>
                    {wards.map(w => (
                      <option key={w.code} value={w.code}>{w.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Địa chỉ cụ thể *</label>
                <input type="text" id="specificAddress" placeholder="Số nhà, tên đường..." required className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 focus:bg-white focus:border-sakura-400 outline-none transition" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Ghi chú cho đơn hàng</label>
                <textarea rows={3} value={note} onChange={e => setNote(e.target.value)} className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 focus:bg-white focus:border-sakura-400 outline-none transition"></textarea>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-sakura-100 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-100 pb-3">Phương thức thanh toán</h2>
            <div className="space-y-3">
              <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition ${paymentMethod === 'cod' ? 'border-sakura-500 bg-sakura-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                <input type="radio" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="w-4 h-4 text-sakura-600 focus:ring-sakura-500" />
                <span className="ml-3 font-semibold text-gray-800">Thanh toán khi nhận hàng (COD)</span>
              </label>

              <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition ${paymentMethod === 'momo' ? 'border-sakura-500 bg-sakura-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                <input type="radio" value="momo" checked={paymentMethod === 'momo'} onChange={() => setPaymentMethod('momo')} className="w-4 h-4 text-sakura-600 focus:ring-sakura-500" />
                <span className="ml-3 font-semibold text-gray-800 flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-pink-500 text-white rounded text-xs font-bold">MoMo</span> Quét mã QR
                </span>
              </label>

              <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition ${paymentMethod === 'bank' ? 'border-sakura-500 bg-sakura-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                <input type="radio" value="bank" checked={paymentMethod === 'bank'} onChange={() => setPaymentMethod('bank')} className="w-4 h-4 text-sakura-600 focus:ring-sakura-500" />
                <span className="ml-3 font-semibold text-gray-800">Chuyển khoản ngân hàng</span>
              </label>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-sakura-100 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-100 pb-3">Tổng kết đơn hàng</h2>
            
            <div className="flex gap-2 mb-6">
              <input type="text" placeholder="Mã giảm giá" value={voucher} onChange={(e) => setVoucher(e.target.value)} className="flex-1 rounded-xl border border-gray-300 bg-gray-50 px-4 py-2 focus:bg-white focus:border-sakura-400 outline-none transition" />
              <button type="button" className="bg-gray-800 text-white font-bold px-4 rounded-xl hover:bg-sakura-500 transition">Áp dụng</button>
            </div>

            <div className="space-y-3 text-sm text-gray-600 border-b border-gray-100 pb-4 mb-4">
              <div className="flex justify-between">
                <span>Tạm tính ({cartItems.reduce((s, i) => s + i.quantity, 0)} sản phẩm)</span>
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

            <button type="submit" className="w-full rounded-xl bg-sakura-500 py-4 font-bold text-white shadow-lg shadow-sakura-200 transition hover:bg-sakura-600 text-lg uppercase tracking-wider">
              {paymentMethod === 'cod' ? 'Hoàn tất đặt hàng' : 'Tiến hành thanh toán'}
            </button>
          </div>

        </div>
      </form>
    </div>
  );
}