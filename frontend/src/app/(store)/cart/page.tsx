'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

// 1. Khai báo kiểu dữ liệu đàng hoàng thay vì dùng any
interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  max: number;
  image: string;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('wibu_cart') || '[]');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCartItems(cart);
  }, []);

  const updateQuantity = (id: number, delta: number) => {
    const updatedCart = cartItems.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    });
    setCartItems(updatedCart);
    localStorage.setItem('wibu_cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cartUpdated')); 
  };

  const removeItem = (id: number) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem('wibu_cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cartUpdated')); 
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 rounded-lg bg-white px-4 py-3 shadow-sm border border-sakura-100 text-sm text-gray-500">
        <Link href="/" className="hover:text-sakura-500">Trang chủ</Link>
        <span className="mx-2">/</span>
        <span className="font-semibold text-sakura-500">Giỏ hàng</span>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-sakura-100 p-6 md:p-8 min-h-100">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Giỏ hàng của bạn</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 mb-4 text-lg">Bạn chưa chốt đơn waifu nào cả (╥﹏╥)</p>
            <Link href="/" className="rounded-xl bg-sakura-500 px-8 py-3 font-bold text-white transition hover:bg-sakura-600 shadow-sm">
              Đi săn sale ngay
            </Link>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-left border-collapse min-w-150">
                <thead>
                  <tr className="border-b-2 border-sakura-100 text-gray-600 uppercase text-sm">
                    <th className="py-4 font-bold">Sản phẩm</th>
                    <th className="py-4 font-bold text-center w-32">Số lượng</th>
                    <th className="py-4 font-bold text-right w-32">Thành tiền</th>
                    <th className="py-4 font-bold text-center w-16">Xóa</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.id} className="border-b border-gray-100 transition hover:bg-sakura-50/50">
                      <td className="py-4 flex items-center gap-4">
                        <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden border border-gray-200">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <Link href={`/product/${item.id}`} className="font-semibold text-gray-800 hover:text-sakura-500 transition line-clamp-2">
                          {item.name}
                        </Link>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center justify-center border border-gray-300 rounded-lg overflow-hidden w-28 mx-auto bg-white">
                          <button onClick={() => updateQuantity(item.id, -1)} className="px-3 py-1 text-gray-600 hover:text-sakura-500 transition font-bold">-</button>
                          <input type="number" readOnly value={item.quantity} className="w-10 text-center font-semibold text-gray-800 outline-none" />
                          <button onClick={() => updateQuantity(item.id, 1)} className="px-3 py-1 text-gray-600 hover:text-sakura-500 transition font-bold">+</button>
                        </div>
                      </td>
                      <td className="py-4 text-right font-bold text-sakura-500 text-lg">
                        {(item.price * item.quantity).toLocaleString('vi-VN')}₫
                      </td>
                      <td className="py-4 text-center">
                        <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500 transition">
                          <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50 p-6 rounded-xl border border-gray-100">
              <Link href="/" className="font-semibold text-gray-600 hover:text-sakura-500 transition flex items-center">
                <span className="mr-2">←</span> Tiếp tục mua sắm
              </Link>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="text-xl">
                  Tổng tiền: <span className="font-black text-sakura-500 text-2xl">{totalPrice.toLocaleString('vi-VN')}₫</span>
                </div>
                <Link href="/checkout" className="rounded-xl bg-sakura-500 px-8 py-3.5 font-bold text-white shadow-lg shadow-sakura-200 transition hover:bg-sakura-600 uppercase tracking-wide">
                  THANH TOÁN NGAY
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}