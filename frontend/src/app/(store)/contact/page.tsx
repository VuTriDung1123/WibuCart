import Link from 'next/link';

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-4">
      <div className="mb-4 rounded-lg bg-white px-4 py-3 shadow-sm border border-sakura-100 text-sm text-gray-500">
        <Link href="/" className="hover:text-sakura-500">Trang chủ</Link>
        <span className="mx-2">/</span>
        <span className="font-semibold text-sakura-500">Liên hệ</span>
      </div>

      <div className="rounded-2xl border border-sakura-100 bg-white p-6 shadow-sm md:p-10">
        <h1 className="mb-8 text-3xl font-bold uppercase text-gray-800">Liên Hệ WibuCart</h1>
        
        <div className="grid gap-10 lg:grid-cols-2">
          {/* Cột Thông tin */}
          <div>
            <h2 className="mb-4 text-xl font-semibold text-gray-800">Thông tin cửa hàng</h2>
            <p className="mb-3 text-gray-700"><strong>📍 Địa chỉ:</strong> UTH - TP.HCM</p>
            <p className="mb-3 text-gray-700"><strong>📞 Hotline:</strong> <a href="tel:0388852343" className="hover:text-sakura-500">038 885 2343</a></p>
            <p className="mb-6 text-gray-700"><strong>✉️ Email:</strong> <a href="mailto:contact@wibucart.com" className="hover:text-sakura-500">contact@wibucart.com</a></p>
            
            <div className="h-64 w-full rounded-xl bg-sakura-100 flex items-center justify-center text-sakura-500 font-semibold border-2 border-dashed border-sakura-300">
              [Bản đồ Map]
            </div>
          </div>

          {/* Cột Form */}
          <div className="rounded-xl bg-sakura-50 p-6">
            <h2 className="mb-4 text-xl font-semibold text-gray-800">Gửi lời nhắn</h2>
            <form className="space-y-4">
              <input type="text" placeholder="Họ tên *" className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-sakura-500 focus:outline-none" required />
              <input type="email" placeholder="Email *" className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-sakura-500 focus:outline-none" required />
              <textarea placeholder="Lời nhắn *" rows={4} className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-sakura-500 focus:outline-none" required></textarea>
              <button type="submit" className="w-full rounded-lg bg-sakura-500 px-6 py-3 font-bold text-white transition hover:bg-sakura-600">Gửi liên hệ</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}