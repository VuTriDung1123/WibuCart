import Header from "@/components/Header";
import Link from "next/link";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* HEADER */}
      <Header />

      {/* MAIN CONTENT */}
      <main className="flex-1 bg-sakura-50 pb-12 pt-6">
        {children}
      </main>

      {/* FOOTER ĐƯỢC LÀM LẠI CHUẨN E-COMMERCE */}
      <footer className="bg-[#1a1a1a] text-gray-300">
        
        {/* Nửa giữa: Các cột thông tin */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Cột 1: Thông tin cửa hàng */}
            <div className="space-y-4">
              <h3 className="text-white font-bold border-l-4 border-sakura-500 pl-3 uppercase tracking-wider mb-6">WibuCart Figure</h3>
              <p className="font-bold text-gray-100">HỘ KINH DOANH WIBUCART</p>
              <p className="text-sm leading-relaxed">Giấy phép kinh doanh số 99999999 cấp ngày 28/08/2025 tại Sở Kế hoạch và Đầu tư TP.HCM.</p>
              <p className="text-sm">Giờ mở cửa: 09:00 - 20:00</p>
              <div className="pt-2 space-y-2 text-sm">
                <p className="flex items-start gap-2"><span>📍</span> Số 2 Võ Oanh, Phường 25, Bình Thạnh, TP.Hồ Chí Minh.</p>
                <p className="flex items-center gap-2"><span>📞</span> <a href="tel:0388852343" className="hover:text-sakura-400">038 885 2343</a></p>
                <p className="flex items-center gap-2"><span>✉️</span> <a href="mailto:vutridung.contact@gmail.com" className="hover:text-sakura-400">vutridung.contact@gmail.com</a></p>
              </div>
              
              <div className="flex items-center gap-3 pt-4">
                <span className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white cursor-pointer hover:scale-110 transition">Fb</span>
                <span className="w-8 h-8 rounded-full bg-pink-600 flex items-center justify-center text-white cursor-pointer hover:scale-110 transition">Ig</span>
                <span className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white cursor-pointer hover:scale-110 transition">X</span>
                <span className="w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center text-white cursor-pointer hover:scale-110 transition">Za</span>
              </div>
            </div>

            {/* Cột 2: Chính sách */}
            <div>
              <h3 className="text-white font-bold uppercase tracking-wider mb-6">Chính Sách</h3>
              <ul className="space-y-3 text-sm">
                {/* ĐÃ SỬA: Link Tìm kiếm trỏ về /category/tat-ca */}
                <li><Link href="/category/tat-ca" className="hover:text-sakura-400 transition flex items-center before:content-['•'] before:mr-2 before:text-sakura-500">Tìm kiếm</Link></li>
                
                <li><Link href="/policy/about" className="hover:text-sakura-400 transition flex items-center before:content-['•'] before:mr-2 before:text-sakura-500">Giới thiệu</Link></li>
                <li><Link href="/policy/privacy" className="hover:text-sakura-400 transition flex items-center before:content-['•'] before:mr-2 before:text-sakura-500">Chính sách bảo mật</Link></li>
                <li><Link href="/policy/shipping" className="hover:text-sakura-400 transition flex items-center before:content-['•'] before:mr-2 before:text-sakura-500">Chính sách vận chuyển</Link></li>
                <li><Link href="/policy/return" className="hover:text-sakura-400 transition flex items-center before:content-['•'] before:mr-2 before:text-sakura-500">Chính sách đổi trả và bảo hành</Link></li>
                <li><Link href="/policy/inspection" className="hover:text-sakura-400 transition flex items-center before:content-['•'] before:mr-2 before:text-sakura-500">Chính sách kiểm hàng</Link></li>
                <li><Link href="/policy/payment" className="hover:text-sakura-400 transition flex items-center before:content-['•'] before:mr-2 before:text-sakura-500">Chính sách thanh toán</Link></li>
                <li><Link href="/contact" className="hover:text-sakura-400 transition flex items-center before:content-['•'] before:mr-2 before:text-sakura-500">Liên hệ</Link></li>
              </ul>
            </div>

            {/* Cột 3: Hướng dẫn */}
            <div>
              <h3 className="text-white font-bold uppercase tracking-wider mb-6">Hướng Dẫn</h3>
              <ul className="space-y-3 text-sm">
                <li><Link href="/guide/international-shipping" className="hover:text-sakura-400 transition flex items-center before:content-['•'] before:mr-2 before:text-sakura-500">Vận chuyển quốc tế</Link></li>
                <li><Link href="/guide/pvc-maintenance" className="hover:text-sakura-400 transition flex items-center before:content-['•'] before:mr-2 before:text-sakura-500">Cách bảo quản và vệ sinh mô hình PVC</Link></li>
              </ul>
            </div>

            {/* Cột 4: Hotline & Thanh toán */}
            <div>
              <h3 className="text-white font-bold uppercase tracking-wider mb-6">Hotline Hỗ Trợ</h3>
              <ul className="space-y-3 text-sm mb-8">
                <li className="flex justify-between"><span>Gọi mua hàng:</span> <a href="tel:012345678" className="text-blue-400 hover:text-sakura-400 font-bold">012.345.678</a></li>
                <li className="flex justify-between"><span>Gọi bảo hành:</span> <a href="tel:012345678" className="text-blue-400 hover:text-sakura-400 font-bold">012.345.678</a></li>
                <li className="flex justify-between"><span>Hợp tác kinh doanh:</span> <a href="tel:012345678" className="text-blue-400 hover:text-sakura-400 font-bold">012.345.678</a></li>
              </ul>
              
              <h3 className="text-white font-bold uppercase tracking-wider mb-4">Phương Thức Thanh Toán</h3>
              <div className="flex gap-2 bg-white p-2 rounded inline-block">
                <span className="text-gray-800 font-black text-xs border border-gray-300 px-2 py-1 rounded">VISA</span>
                <span className="text-gray-800 font-black text-xs border border-gray-300 px-2 py-1 rounded">ATM</span>
                <span className="text-gray-800 font-black text-xs border border-gray-300 px-2 py-1 rounded">MoMo</span>
                <span className="text-gray-800 font-black text-xs border border-gray-300 px-2 py-1 rounded">COD</span>
              </div>
            </div>

          </div>
        </div>

        {/* Nửa dưới cùng: Disclaimer mang tính mưu sinh */}
        <div className="border-t border-gray-800 py-6 bg-black">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sakura-400 font-black text-lg mb-2">© 2026 WIBUCART - MANG THẾ GIỚI 2D VÀO TẦM TAY</p>
            <p className="text-xs text-gray-500 max-w-3xl mx-auto leading-relaxed">
              <strong>⚠️ LƯU Ý QUAN TRỌNG:</strong> Trang web này hoàn toàn không phải là một cửa hàng thật. 
              Đây chỉ là một dự án phần mềm cá nhân (Portfolio) của Vũ Trí Dũng (Sinh viên ngành Công nghệ thông tin - UTH) xây dựng với mục đích học tập, demo kỹ năng lập trình và làm CV đi xin việc kiếm cơm mang cá 🐟. 
              Mọi sản phẩm, giá tiền và thông tin giao dịch trên hệ thống này đều là dữ liệu giả lập. Vui lòng <strong>KHÔNG</strong> thực hiện các giao dịch chuyển tiền thật.
            </p>
          </div>
        </div>
        
      </footer>
    </div>
  );
}