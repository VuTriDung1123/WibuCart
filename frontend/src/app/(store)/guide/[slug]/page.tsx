'use client';
import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import { ReactNode } from 'react';

interface GuideContent {
  title: string;
  content: ReactNode;
}

export default function GuidePage() {
  const params = useParams();
  const slug = params.slug as string;

  const guides: Record<string, GuideContent> = {
    'international-shipping': {
      title: 'Vận chuyển quốc tế',
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-sakura-500">WibuCart Authentic Anime Figurines with Worldwide Shipping</h2>
          <p className="font-bold">Hỗ trợ vận chuyển quốc tế: Uy Tín, Tiết Kiệm, Nhanh Chóng</p>
          <p>Tại WibuCart, chúng tôi không chỉ cung cấp mô hình anime chất lượng cao, mà còn đảm bảo vận chuyển quốc tế uy tín. Với các lựa chọn như EMS và DHL, bạn có thể yên tâm rằng dù bạn ở đâu trên thế giới, sản phẩm sẽ được giao an toàn.</p>
          
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mt-6">
            <h3 className="font-bold text-lg mb-2">Đại lý vận chuyển: Wibu Express</h3>
            <p>Wibu Express cung cấp dịch vụ chuyển phát nhanh Quốc tế đi hơn 200 quốc gia.</p>
            <ul className="mt-2 space-y-1 text-sm">
              <li><strong>Địa chỉ:</strong> Số abc, phường Bình Lợi Trung, TP.HCM</li>
              <li><strong>Hotline:</strong> 012 345 6789 (Vũ Trí Dũng)</li>
              <li><strong>Email:</strong> vutridung.contact@gmail.com</li>
            </ul>
          </div>
        </div>
      )
    },
    'pvc-maintenance': {
      title: 'Cách bảo quản và vệ sinh mô hình PVC',
      content: (
        <div className="space-y-6">
          <p>Bảo quản và vệ sinh chu đáo sẽ giúp figure của bạn luôn như mới. Dưới đây là bí kíp từ WibuCart:</p>
          
          <h3 className="font-bold text-lg border-l-4 border-sakura-500 pl-3">Các lưu ý khi bảo quản</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Tránh ánh nắng trực tiếp:</strong> Dễ làm phai màu và chảy nhựa.</li>
            <li><strong>Kiểm soát nhiệt độ:</strong> Trưng bày nơi thoáng mát, tránh cục nóng điều hòa hoặc dàn máy tính.</li>
            <li><strong>Tủ trưng bày kín:</strong> Giúp tránh bụi và ẩm mốc hiệu quả.</li>
          </ul>

          <h3 className="font-bold text-lg border-l-4 border-sakura-500 pl-3">Các câu hỏi thường gặp (FAQ)</h3>
          <div className="space-y-4">
            <div>
              <p className="font-semibold text-gray-800">Q: Làm sao vệ sinh mà không hỏng sơn?</p>
              <p className="text-gray-600">A: Dùng cọ trang điểm mềm quét bụi. Nếu dính bẩn, dùng khăn ẩm lau nhẹ. Tuyệt đối không dùng cồn hoặc chất tẩy rửa mạnh.</p>
            </div>
            <div>
              <p className="font-semibold text-gray-800">Q: Mô hình PVC bị dính, chảy mồ hôi?</p>
              <p className="text-gray-600">A: Xảy ra khi cất trong hộp quá lâu không thoát khí. Cứ bình tĩnh ngâm qua nước sạch pha chút sữa tắm nhẹ, sau đó phơi khô ở nơi thoáng mát.</p>
            </div>
            <div>
              <p className="font-semibold text-gray-800">Q: Lỡ tay làm gãy phụ kiện thì dán bằng gì?</p>
              <p className="text-gray-600">A: Tuyệt đối không dùng keo 502 vì nó làm cháy nhựa và để lại vệt trắng. Hãy dùng keo dán mô hình chuyên dụng (Tamiya Cement) hoặc liên hệ WibuCart để được hướng dẫn.</p>
            </div>
          </div>
        </div>
      )
    }
  };

  const currentGuide = guides[slug];
  if (!currentGuide) return notFound();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 rounded-lg bg-white px-4 py-3 shadow-sm border border-sakura-100 text-sm text-gray-500">
        <Link href="/" className="hover:text-sakura-500 transition">Trang chủ</Link>
        <span className="mx-2">/</span>
        <span className="font-semibold text-sakura-500">{currentGuide.title}</span>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* LỜI CẢNH BÁO MƯU SINH */}
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-5 mb-8 rounded-r-2xl shadow-sm">
          <h4 className="font-black text-lg mb-1 flex items-center gap-2">⚠️ CẢNH BÁO MƯU SINH</h4>
          <p className="text-sm leading-relaxed">
            Web này chỉ là 1 sản phẩm lập trình (Portfolio) của một thằng dev quèn (Vũ Trí Dũng) để đi xin việc kiếm cơm mang cá :v. 
            Đừng xem web này như web bán hàng thật, không có hàng đâu mà giao, đừng chuyển tiền kẻo mất ráng chịu nha!
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12">
          <h1 className="text-3xl font-black text-gray-800 mb-8 uppercase text-center border-b pb-6">{currentGuide.title}</h1>
          <div className="prose max-w-none text-gray-700 leading-relaxed text-[15px]">
            {currentGuide.content}
          </div>
        </div>
      </div>
    </div>
  );
}