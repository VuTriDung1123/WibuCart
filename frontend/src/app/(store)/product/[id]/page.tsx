'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function ProductDetailPage() {
  // Tạm thời hardcode state giao diện, sau này sẽ thay bằng axios gọi API get Product
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState('https://placehold.co/600x600/fbcfe8/ec4899?text=Miku+Main');
  
  // Mock data ảnh phụ
  const gallery = [
    'https://placehold.co/600x600/fbcfe8/ec4899?text=Miku+Main',
    'https://placehold.co/600x600/fbcfe8/ec4899?text=Miku+Angle+1',
    'https://placehold.co/600x600/fbcfe8/ec4899?text=Miku+Angle+2',
    'https://placehold.co/600x600/fbcfe8/ec4899?text=Miku+Box'
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-6 text-sm text-gray-500">
        <Link href="/" className="hover:text-sakura-500 transition">Trang chủ</Link>
        <span className="mx-2">/</span>
        <Link href="/category/figures" className="hover:text-sakura-500 transition">Mô Hình</Link>
        <span className="mx-2">/</span>
        <span className="font-semibold text-sakura-500">Mô Hình Hatsune Miku: Sakura Dress Ver.</span>
      </div>

      <div className="flex flex-col gap-10 lg:flex-row bg-white p-6 rounded-3xl shadow-sm border border-sakura-100">
        
        {/* CỘT TRÁI: THƯ VIỆN ẢNH */}
        <div className="w-full lg:w-1/2">
          {/* Ảnh chính */}
          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 mb-4 aspect-square">
            <img 
              src={activeImage} 
              alt="Miku Main" 
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
          
          {/* Ảnh nhỏ (Thumbnails) */}
          <div className="grid grid-cols-4 gap-4">
            {gallery.map((img, index) => (
              <button 
                key={index} 
                onClick={() => setActiveImage(img)}
                className={`overflow-hidden rounded-xl border-2 aspect-square transition ${activeImage === img ? 'border-sakura-500' : 'border-transparent hover:border-sakura-200'}`}
              >
                <img src={img} className="w-full h-full object-cover" alt={`Thumb ${index}`} />
              </button>
            ))}
          </div>
        </div>

        {/* CỘT PHẢI: THÔNG TIN SẢN PHẨM */}
        <div className="w-full lg:w-1/2 flex flex-col">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Good Smile Company</span>
          <h1 className="text-3xl font-bold text-gray-800 leading-tight mb-4">
            Mô Hình Hatsune Miku: Sakura Dress Ver. 1/7 Scale Figure
          </h1>
          
          {/* Giá và Trạng thái */}
          <div className="flex items-end gap-4 mb-6 pb-6 border-b border-gray-100">
            <span className="text-4xl font-black text-sakura-500">3.500.000₫</span>
            <span className="rounded-md bg-green-100 px-2.5 py-1 text-sm font-bold text-green-700 mb-1">Kho: 15</span>
          </div>

          {/* Mô tả ngắn */}
          <p className="text-gray-600 mb-8 leading-relaxed">
            Mô hình tỷ lệ 1/7 tuyệt đẹp của Hatsune Miku trong bộ váy hoa anh đào lộng lẫy. Thiết kế tinh xảo, màu sắc tươi sáng chuẩn phong cách Kawaii. Một sản phẩm không thể thiếu trong bộ sưu tập của các fan Vocaloid.
          </p>

          {/* Khu vực Chọn Số lượng & Thêm Giỏ Hàng */}
          <div className="mt-auto flex flex-col sm:flex-row gap-4 bg-sakura-50 p-6 rounded-2xl border border-sakura-100">
            {/* Bộ chọn số lượng */}
            <div className="flex h-14 items-center rounded-xl border border-gray-300 bg-white">
              <button 
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="px-5 text-xl font-medium text-gray-500 hover:text-sakura-500 transition"
              >
                -
              </button>
              <input 
                type="number" 
                value={quantity} 
                readOnly 
                className="w-12 text-center text-lg font-semibold text-gray-800 outline-none"
              />
              <button 
                onClick={() => setQuantity(q => q + 1)}
                className="px-5 text-xl font-medium text-gray-500 hover:text-sakura-500 transition"
              >
                +
              </button>
            </div>

            {/* Nút Action */}
            <button className="flex-1 h-14 rounded-xl bg-sakura-500 px-8 text-lg font-bold text-white shadow-lg shadow-sakura-200 transition-all hover:bg-sakura-600 hover:-translate-y-1">
              Thêm vào giỏ hàng 🛒
            </button>
          </div>

          {/* Thông tin thêm */}
          <div className="mt-8 grid grid-cols-2 gap-y-4 text-sm text-gray-600">
            <p><strong>Series:</strong> Hatsune Miku</p>
            <p><strong>Kích thước:</strong> ~24cm</p>
            <p><strong>Chất liệu:</strong> PVC, ABS</p>
            <p><strong>Phát hành:</strong> 06/2026</p>
          </div>
        </div>

      </div>
    </div>
  );
}