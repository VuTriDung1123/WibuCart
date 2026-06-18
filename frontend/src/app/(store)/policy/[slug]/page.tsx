'use client';
import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import { ReactNode } from 'react';

// Định nghĩa cấu trúc dữ liệu không dùng `any`
interface PolicyContent {
  title: string;
  content: ReactNode;
}

export default function PolicyPage() {
  const params = useParams();
  const slug = params.slug as string;

  // DỮ LIỆU CÁC TRANG CHÍNH SÁCH
  const policies: Record<string, PolicyContent> = {
    'about': {
      title: 'Về WibuCart',
      content: (
        <div className="space-y-6">
          <p className="font-bold text-lg text-sakura-500">🇻🇳 VI | 🇬🇧 EN | 🇯🇵 日本語 | 🇨🇳 中文</p>
          <div>
            <h3 className="text-xl font-bold mb-2">Về WibuCart</h3>
            <p>Chào mừng các bạn đến với WibuCart — cửa hàng chuyên mô hình anime figure chính hãng tại TP.HCM.</p>
            <p>WibuCart được thành lập bởi một sinh viên IT đam mê anime & manga, mong muốn mang những sản phẩm chất lượng, đa dạng từ dòng phổ biến đến các phiên bản giới hạn, độc quyền.</p>
            <p>Chúng mình cam kết: 100% chính hãng, minh bạch thông tin, đóng gói an toàn và tạo ra cộng đồng chia sẻ đam mê figure chân thành.</p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">Dành cho Nhà phân phối</h3>
            <p>Chúng mình ưu tiên xây dựng quan hệ bền vững dựa trên chất lượng, uy tín và chăm sóc khách hàng. WibuCart có kinh nghiệm tối ưu quy trình nhập hàng, kiểm soát chất lượng và truyền thông đến nhóm khách 14–30 tuổi tại Việt Nam.</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <p><strong>Địa chỉ:</strong> Số abc, phường Bình Lợi Trung, TP.Hồ Chí Minh</p>
            <p><strong>Email:</strong> vutridung.contact@gmail.com</p>
            <p><strong>Website:</strong> wibucart.local</p>
          </div>
        </div>
      )
    },
    'privacy': {
      title: 'Chính sách bảo mật',
      content: (
        <div className="space-y-4">
          <h3 className="font-bold text-lg">1. Mục đích và phạm vi thu thập</h3>
          <p>Việc thu thập dữ liệu trên website bao gồm: họ tên, email, điện thoại, địa chỉ khách hàng. Đây là các thông tin bắt buộc để chúng tôi liên hệ xác nhận đơn hàng nhằm đảm bảo quyền lợi cho người tiêu dùng.</p>
          <h3 className="font-bold text-lg">2. Phạm vi sử dụng thông tin</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Liên hệ xác nhận đơn hàng và giao hàng.</li>
            <li>Cung cấp thông tin sản phẩm nếu có yêu cầu.</li>
            <li>Gửi email tiếp thị, khuyến mại.</li>
            <li>Không sử dụng thông tin ngoài mục đích xác nhận giao dịch.</li>
          </ul>
          <h3 className="font-bold text-lg">3. Địa chỉ đơn vị quản lý thông tin</h3>
          <p>HỘ KINH DOANH WIBUCART<br/>Địa chỉ: Số abc, phường Bình Lợi Trung, TP.HCM.</p>
        </div>
      )
    },
    'shipping': {
      title: 'Chính sách vận chuyển',
      content: (
        <div className="space-y-4">
          <h3 className="font-bold text-lg">1. Các phương thức giao hàng</h3>
          <p>WibuCart sử dụng các dịch vụ của đối tác uy tín. Đối tác chính là Giao Hàng Tiết Kiệm và SuperShip. Giao hỏa tốc nội thành qua Ahamove, GrabExpress.</p>
          <h3 className="font-bold text-lg">2. Thời gian giao hàng</h3>
          <p>Nội thành TP.HCM: 1-2 ngày. Đơn hỏa tốc trong 2 giờ.<br/>Ngoại thành / Tỉnh: 2-5 ngày làm việc.</p>
          <h3 className="font-bold text-lg">3. Hàng hoàn do giao thất bại</h3>
          <p>Nếu sai SĐT/địa chỉ hoặc khách từ chối nhận, hàng sẽ hoàn kho. Chi phí phát sinh khách hàng chịu trách nhiệm thanh toán.</p>
        </div>
      )
    },
    'return': {
      title: 'Chính sách đổi trả và bảo hành',
      content: (
        <div className="space-y-4">
          <h3 className="font-bold text-lg">1. Điều kiện đổi trả</h3>
          <p>Quý khách có thể yêu cầu đổi trả khi: Hàng không đúng mẫu mã, thiếu số lượng, hoặc hư hỏng nặng do vận chuyển (cần có Video Unbox).</p>
          <h3 className="font-bold text-lg">2. Thời gian đổi trả</h3>
          <p>Trong vòng 48 giờ kể từ khi nhận hàng. Gửi trả trực tiếp về kho tại: Số 2 Võ Oanh, Phường 25, Bình Thạnh, TP.HCM.</p>
          <h3 className="font-bold text-lg">3. Chi phí hoàn trả</h3>
          <p>Nếu lỗi do WibuCart, chúng tôi chịu 100% phí ship hoàn. Nếu do nhu cầu khách hàng, khách hàng vui lòng thanh toán phí ship.</p>
        </div>
      )
    },
    'inspection': {
      title: 'Chính sách kiểm hàng',
      content: (
        <div className="space-y-4">
          <h3 className="font-bold text-lg">1. Thời điểm kiểm hàng (Đồng kiểm)</h3>
          <p>WibuCart chấp nhận cho khách hàng đồng kiểm với shipper ngay tại thời điểm nhận hàng. <strong>Bắt buộc quay video unbox.</strong></p>
          <h3 className="font-bold text-lg">2. Phạm vi kiểm tra</h3>
          <ul className="list-disc pl-5 space-y-1 text-red-600 font-semibold">
            <li>Tuyệt đối không bóc seal, tem niêm phong hộp sản phẩm.</li>
            <li>Không cào mã tích điểm đổi quà.</li>
          </ul>
          <h3 className="font-bold text-lg">3. Xử lý khi có sai sót</h3>
          <p>Gọi ngay Hotline: <strong>012 345 6789</strong> để được hỗ trợ gửi lại đơn mới hoặc hoàn tiền.</p>
        </div>
      )
    },
    'payment': {
      title: 'Chính sách thanh toán',
      content: (
        <div className="space-y-4">
          <h3 className="font-bold text-lg">1. Thanh toán tiền mặt (COD)</h3>
          <p>Kiểm tra hàng và thanh toán trực tiếp cho Shipper. Không phát sinh chi phí ngầm.</p>
          <h3 className="font-bold text-lg">2. Chuyển khoản ngân hàng</h3>
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 inline-block">
            <p><strong>Ngân hàng:</strong> TPBank</p>
            <p><strong>Chủ tài khoản:</strong> VU TRI DUNG</p>
            <p className="text-xl font-black text-blue-600">07166092801</p>
          </div>
          <p>Nội dung chuyển khoản: Tên KH + SĐT đặt hàng.</p>
        </div>
      )
    }
  };

  const currentPolicy = policies[slug];
  if (!currentPolicy) return notFound();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 rounded-lg bg-white px-4 py-3 shadow-sm border border-sakura-100 text-sm text-gray-500">
        <Link href="/" className="hover:text-sakura-500 transition">Trang chủ</Link>
        <span className="mx-2">/</span>
        <span className="font-semibold text-sakura-500">{currentPolicy.title}</span>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* LỜI CẢNH BÁO MƯU SINH CỦA DEV QUÈN */}
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-5 mb-8 rounded-r-2xl shadow-sm">
          <h4 className="font-black text-lg mb-1 flex items-center gap-2">⚠️ CẢNH BÁO MƯU SINH</h4>
          <p className="text-sm leading-relaxed">
            Web này chỉ là 1 sản phẩm lập trình (Portfolio) của một thằng dev quèn (Vũ Trí Dũng) để đi xin việc kiếm cơm mang cá :v. 
            Đừng xem web này như web bán hàng thật, không có hàng đâu mà giao, đừng chuyển tiền kẻo mất ráng chịu nha!
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12">
          <h1 className="text-3xl font-black text-gray-800 mb-8 uppercase text-center border-b pb-6">{currentPolicy.title}</h1>
          <div className="prose max-w-none text-gray-700 leading-relaxed text-[15px]">
            {currentPolicy.content}
          </div>
        </div>
      </div>
    </div>
  );
}