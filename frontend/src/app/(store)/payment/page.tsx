'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

// Component con để bọc logic lấy Query Params (chuẩn Next.js 13+)
function PaymentContent() {
  const searchParams = useSearchParams();
  const orderCode = searchParams.get('order_code') || 'WIBU-XXX';
  const method = searchParams.get('method') || 'bank';
  const amountStr = searchParams.get('amount') || '0';
  const amount = Number(amountStr);

  const [isPaid, setIsPaid] = useState(false);

  // MÀN HÌNH THEO DÕI VẬN CHUYỂN (SAU KHI ĐÃ TRẢ TIỀN)
  if (isPaid) {
    return (
      <div className="bg-white rounded-3xl shadow-xl border border-sakura-100 p-8 md:p-12 w-full max-w-3xl text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Thanh toán & Đặt hàng thành công!</h1>
        <p className="text-gray-500 mb-8">Mã đơn hàng của bạn là: <strong className="text-sakura-500">{orderCode}</strong></p>

        <div className="relative flex flex-col md:flex-row justify-between items-center w-full max-w-2xl mx-auto my-12 before:absolute before:inset-0 before:top-1/2 before:-translate-y-1/2 before:h-1 before:bg-gray-100 md:before:block before:hidden z-0">
          <div className="relative z-10 flex flex-col items-center bg-white md:bg-transparent mb-6 md:mb-0 px-2">
            <div className="w-12 h-12 bg-sakura-500 text-white rounded-full flex items-center justify-center font-bold shadow-md shadow-sakura-200 border-4 border-white mb-2">1</div>
            <span className="text-sm font-bold text-sakura-500">Đã thanh toán</span>
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
          <h3 className="font-bold text-gray-800 mb-4 border-b border-sakura-200 pb-2">Hóa đơn thanh toán</h3>
          <p className="text-sm text-gray-700 mb-2">Phương thức: <strong className="uppercase">{method}</strong></p>
          <p className="text-sm text-gray-700">Đã thanh toán: <strong className="text-sakura-500 text-lg">{amount.toLocaleString('vi-VN')}₫</strong></p>
        </div>

        <Link href="/profile" className="inline-block rounded-xl bg-gray-800 px-8 py-3.5 font-bold text-white shadow-lg transition hover:bg-sakura-500 uppercase tracking-wide">
          Xem đơn hàng
        </Link>
      </div>
    );
  }

  // MÀN HÌNH QUÉT QR
  return (
    <div className="bg-white rounded-3xl shadow-xl border border-sakura-100 p-8 md:p-12 w-full max-w-2xl text-center">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Cổng thanh toán an toàn</h1>
      <p className="text-gray-500 mb-8">Vui lòng quét mã QR bên dưới để hoàn tất đơn hàng <strong className="text-sakura-500">{orderCode}</strong></p>

      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 mb-8 inline-block">
        {method === 'momo' ? (
          <>
            <div className="bg-pink-500 text-white font-bold py-2 px-6 rounded-full inline-block mb-6">Thanh toán qua MoMo</div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=MOMO_${orderCode}_${amount}`} alt="MoMo QR" className="mx-auto border-8 border-white shadow-md rounded-xl w-48 h-48" />
          </>
        ) : (
          <>
            <div className="bg-blue-600 text-white font-bold py-2 px-6 rounded-full inline-block mb-6">Chuyển khoản Ngân hàng</div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=BANK_${orderCode}_${amount}`} alt="Bank QR" className="mx-auto border-8 border-white shadow-md rounded-xl w-48 h-48" />
            <div className="mt-6 text-sm text-gray-700 bg-white p-4 rounded-xl border border-gray-200 text-left">
              <p><strong>Ngân hàng:</strong> TPBank</p>
              <p><strong>Số tài khoản:</strong> 07166092801</p>
              <p><strong>Chủ tài khoản:</strong> VU TRI DUNG</p>
              <p className="mt-2 text-sakura-500 font-bold text-center">Nội dung: {orderCode}</p>
            </div>
          </>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <p className="text-2xl font-black text-gray-800">Cần thanh toán: <span className="text-sakura-500">{amount.toLocaleString('vi-VN')}₫</span></p>
        <p className="text-sm text-gray-400 mb-4">Hệ thống sẽ tự động xác nhận trong vòng 1-5 phút.</p>
        
        <button 
          onClick={() => setIsPaid(true)} 
          className="w-full md:w-2/3 mx-auto rounded-xl bg-sakura-500 py-4 font-bold text-white shadow-lg shadow-sakura-200 transition hover:bg-sakura-600 text-lg uppercase tracking-wider"
        >
          TÔI ĐÃ THANH TOÁN
        </button>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <div className="container mx-auto px-4 py-12 flex justify-center">
      <Suspense fallback={<div className="font-bold text-sakura-500">Đang tải cổng thanh toán...</div>}>
        <PaymentContent />
      </Suspense>
    </div>
  );
}