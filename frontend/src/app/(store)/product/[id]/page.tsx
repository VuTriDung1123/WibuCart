'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface ProductCartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export default function ProductDetailPage() {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState('https://placehold.co/600x600/fbcfe8/ec4899?text=Miku+Main');
  
  const productData = {
    id: 1, 
    name: 'Mô Hình Hatsune Miku: Sakura Dress Ver. 1/7 Scale Figure',
    price: 3500000,
    image: 'https://placehold.co/600x600/fbcfe8/ec4899?text=Miku+Main'
  };

  const gallery = [
    'https://placehold.co/600x600/fbcfe8/ec4899?text=Miku+Main',
    'https://placehold.co/600x600/fbcfe8/ec4899?text=Miku+Angle+1',
    'https://placehold.co/600x600/fbcfe8/ec4899?text=Miku+Angle+2',
    'https://placehold.co/600x600/fbcfe8/ec4899?text=Miku+Box'
  ];

  const addToCartStorage = () => {
    const existingCart: ProductCartItem[] = JSON.parse(localStorage.getItem('wibu_cart') || '[]');
    const itemIndex = existingCart.findIndex((item) => item.id === productData.id);

    if (itemIndex >= 0) {
      existingCart[itemIndex].quantity += quantity; 
    } else {
      existingCart.push({ ...productData, quantity }); 
    }

    localStorage.setItem('wibu_cart', JSON.stringify(existingCart));
    window.dispatchEvent(new Event('cartUpdated')); 
  };

  const handleAddToCart = () => {
    addToCartStorage();
    alert('Đã thêm thành công waifu vào giỏ hàng! 🌸');
  };

  const handleBuyNow = () => {
    addToCartStorage();
    router.push('/checkout'); 
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* ... (Toàn bộ phần HTML render phía dưới giữ nguyên như cũ, chỉ cập nhật logic bên trên) ... */}
      <div className="mb-6 text-sm text-gray-500">
        <Link href="/" className="hover:text-sakura-500 transition">Trang chủ</Link>
        <span className="mx-2">/</span>
        <Link href="/category/figures" className="hover:text-sakura-500 transition">Mô Hình</Link>
        <span className="mx-2">/</span>
        <span className="font-semibold text-sakura-500">Mô Hình Hatsune Miku</span>
      </div>

      <div className="flex flex-col gap-10 lg:flex-row bg-white p-6 rounded-3xl shadow-sm border border-sakura-100">
        <div className="w-full lg:w-1/2">
          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 mb-4 aspect-square">
            <img src={activeImage} alt="Miku" className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {gallery.map((img, index) => (
              <button key={index} onClick={() => setActiveImage(img)} className={`overflow-hidden rounded-xl border-2 aspect-square transition ${activeImage === img ? 'border-sakura-500' : 'border-transparent hover:border-sakura-200'}`}>
                <img src={img} className="w-full h-full object-cover" alt={`Thumb ${index}`} />
              </button>
            ))}
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex flex-col">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Good Smile Company</span>
          <h1 className="text-3xl font-bold text-gray-800 leading-tight mb-4">{productData.name}</h1>
          
          <div className="flex items-end gap-4 mb-6 pb-6 border-b border-gray-100">
            <span className="text-4xl font-black text-sakura-500">{productData.price.toLocaleString('vi-VN')}₫</span>
            <span className="rounded-md bg-green-100 px-2.5 py-1 text-sm font-bold text-green-700 mb-1">Kho: 15</span>
          </div>

          <p className="text-gray-600 mb-8 leading-relaxed">
            Mô hình tỷ lệ 1/7 tuyệt đẹp của Hatsune Miku trong bộ váy hoa anh đào lộng lẫy. Thiết kế tinh xảo, màu sắc tươi sáng chuẩn phong cách Kawaii.
          </p>

          <div className="mt-auto bg-sakura-50 p-6 rounded-2xl border border-sakura-100 space-y-4">
            <div className="flex items-center gap-4">
              <span className="font-semibold text-gray-700">Số lượng:</span>
              <div className="flex h-12 items-center rounded-lg border border-gray-300 bg-white">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-4 text-lg font-bold text-gray-500 hover:text-sakura-500">-</button>
                <input type="number" value={quantity} readOnly className="w-12 text-center font-bold text-gray-800 outline-none" />
                <button onClick={() => setQuantity(q => q + 1)} className="px-4 text-lg font-bold text-gray-500 hover:text-sakura-500">+</button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button onClick={handleBuyNow} className="flex-1 h-14 rounded-xl bg-blue-500 px-8 text-lg font-bold text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-600 hover:-translate-y-1">
                MUA NGAY
              </button>
              <button onClick={handleAddToCart} className="flex-1 h-14 rounded-xl bg-sakura-100 border-2 border-sakura-500 px-8 text-lg font-bold text-sakura-600 transition-all hover:bg-sakura-500 hover:text-white hover:-translate-y-1">
                THÊM VÀO GIỎ HÀNG
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}