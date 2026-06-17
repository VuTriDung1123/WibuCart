'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

// 1. Định nghĩa Type chuẩn xác, CẤM DÙNG ANY
interface OrderDetail {
  order_code: string;
  created_at: string;
  email: string | null;
  note: string | null;
  status: string;
  payment_method: string;
  total_amount: number | string;
  shipping_fee: number | string;
  final_amount: number | string;
}

interface OrderItem {
  name: string;
  sku_code: string;
  image_url: string | null;
  price_at_purchase: number | string;
  quantity: number;
  subtotal: number | string;
}

export default function AdminOrderDetail() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id;

  // 2. Gắn Type vào State
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    axios.get(`http://localhost:8000/api/admin/orders/${orderId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setOrder(res.data.order);
      setItems(res.data.items);
      setLoading(false);
    })
    .catch(() => {
      alert('Không tìm thấy đơn hàng!');
      router.push('/admin/orders');
    });
  }, [orderId, router]);

  if (loading || !order) return <div className="text-center py-20 font-bold text-gray-500">Đang tải hóa đơn...</div>;

  // Lấy thông tin Tên, SĐT, Địa chỉ từ chuỗi Note đã lưu lúc Checkout
  // Note Format: "Ghi chú KH | Giao tới: Tên - SĐT - Địa chỉ"
  const noteParts = order.note ? order.note.split(' | Giao tới: ') : ['', ''];
  const userNote = noteParts[0] || 'Không có ghi chú';
  const deliveryInfo = noteParts[1] ? noteParts[1].split(' - ') : ['Khách vãng lai', 'Không có SĐT', 'Không có địa chỉ'];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">📄 Chi tiết Đơn hàng <span className="text-sakura-500">#{order.order_code}</span></h2>
          <p className="mt-1 text-sm text-gray-500">Ngày đặt: {new Date(order.created_at).toLocaleString('vi-VN')}</p>
        </div>
        <Link href="/admin/orders" className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 shadow-sm transition hover:bg-gray-50 hover:text-sakura-500">
          🔙 Quay lại danh sách
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CỘT THÔNG TIN KHÁCH */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4 border-b pb-2">Thông tin Khách hàng</h3>
            <p className="text-sm text-gray-600 mb-2">👤 <strong>Người nhận:</strong> {deliveryInfo[0]}</p>
            <p className="text-sm text-gray-600 mb-2">📞 <strong>SĐT:</strong> <span className="font-bold text-blue-600">{deliveryInfo[1]}</span></p>
            <p className="text-sm text-gray-600 mb-2">✉️ <strong>Email:</strong> {order.email || 'Khách không đăng nhập'}</p>
            <p className="text-sm text-gray-600">📍 <strong>Địa chỉ:</strong> {deliveryInfo[2]}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4 border-b pb-2">Ghi chú của khách</h3>
            <p className="text-sm text-gray-700 italic bg-yellow-50 p-3 rounded-lg border border-yellow-100">
              {userNote}     
            </p>
          </div>
        </div>

        {/* CỘT SẢN PHẨM & TỔNG TIỀN */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h3 className="font-bold text-gray-800">Danh sách Sản phẩm</h3>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                order.status === 'shipping' ? 'bg-blue-100 text-blue-700' :
                order.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
              }`}>
                {order.status}
              </span>
            </div>

            <div className="space-y-4">
              {items.map((item, idx) => (
                <div key={idx} className="flex gap-4 items-center border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                  <div className="w-16 h-16 shrink-0 border border-gray-200 rounded-lg overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.image_url || 'https://placehold.co/100x100'} alt="pic" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-800 line-clamp-1">{item.name}</p>
                    <p className="text-xs text-gray-400">SKU: {item.sku_code}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-600">{Number(item.price_at_purchase).toLocaleString('vi-VN')}₫ x {item.quantity}</p>
                    <p className="font-bold text-sakura-500 mt-1">{Number(item.subtotal).toLocaleString('vi-VN')}₫</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4 border-b pb-2">Thanh toán ({order.payment_method})</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between"><p>Tổng tiền hàng:</p><p className="font-semibold">{Number(order.total_amount).toLocaleString('vi-VN')}₫</p></div>
              <div className="flex justify-between"><p>Phí vận chuyển:</p><p className="font-semibold">{Number(order.shipping_fee).toLocaleString('vi-VN')}₫</p></div>
              <div className="flex justify-between text-lg pt-3 border-t mt-2">
                <p className="font-bold text-gray-800">CẦN THANH TOÁN:</p>
                <p className="font-black text-sakura-500 text-xl">{Number(order.final_amount).toLocaleString('vi-VN')}₫</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}