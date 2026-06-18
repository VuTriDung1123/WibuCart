'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface Product {
  id: number;
  name: string;
  slug: string;
  base_price: number;
  is_preorder: number;
  badge: string;
  image_url: string | null;
}

interface HomeData {
  new_products: Product[];
  hot_products: Product[];
  sale_products: Product[];
  preorder_products: Product[];
}

export default function HomePage() {
  const [data, setData] = useState<HomeData | null>(null);

  useEffect(() => {
    axios.get('http://localhost:8000/api/store/home-products')
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, []);

  // Hàm render giao diện Lưới sản phẩm tái sử dụng cho 4 mục
  const renderProductGrid = (products: Product[]) => {
    if (!products || products.length === 0) {
      return <p className="text-gray-500 py-6 italic text-center bg-white rounded-2xl border border-dashed border-gray-200">Chưa có sản phẩm nào trong mục này.</p>;
    }
    
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {products.map((item) => (
          <div key={item.id} className="group flex flex-col rounded-2xl border border-sakura-100 bg-white p-4 transition-all hover:shadow-lg hover:border-sakura-300 relative overflow-hidden">
            
            {/* THẺ TAG (BADGE) NỔI BẬT */}
            <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
              {item.is_preorder === 1 && <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-1 rounded shadow-sm uppercase tracking-wider">Pre-order</span>}
              {item.badge === 'new' && <span className="bg-green-500 text-white text-[10px] font-black px-2 py-1 rounded shadow-sm uppercase tracking-wider">Mới</span>}
              {item.badge === 'hot' && <span className="bg-orange-500 text-white text-[10px] font-black px-2 py-1 rounded shadow-sm uppercase tracking-wider">Hot</span>}
              {item.badge === 'sale' && <span className="bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded shadow-sm uppercase tracking-wider">Sale</span>}
            </div>

            <div className="relative mb-4 aspect-square w-full overflow-hidden rounded-xl bg-gray-50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={item.image_url || 'https://placehold.co/600x600/fbcfe8/ec4899?text=No+Image'} 
                alt={item.name} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
              />
            </div>
            
            <h3 className="line-clamp-2 text-sm font-bold text-gray-800 hover:text-sakura-600 transition mb-3 mt-auto">
              <Link href={`/product/${item.id}`}>{item.name}</Link>
            </h3>
            
            <div className="mt-auto">
              <p className="text-lg font-black text-sakura-500">
                {Number(item.base_price).toLocaleString('vi-VN')}₫
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (!data) return <div className="text-center py-32 text-sakura-500 font-bold text-xl animate-pulse">🌸 Đang tải thiên đường 2D...</div>;

  return (
    <div className="container mx-auto px-4 space-y-16">
      {/* BANNER */}
      <section className="overflow-hidden rounded-3xl bg-white shadow-sm h-75 flex items-center justify-center border-2 border-sakura-200">
         <span className="text-sakura-400 font-bold text-xl">Banner Sự kiện Lễ Hội Hoa Anh Đào</span>
      </section>

      {/* 1. SẢN PHẨM MỚI */}
      <section>
        <div className="mb-6 flex items-center justify-between border-b-2 border-sakura-100 pb-3">
          <h2 className="text-2xl font-black uppercase text-gray-800 flex items-center gap-3">
            <span className="text-3xl">✨</span> 
            <Link href="/category/tat-ca" className="hover:text-sakura-500 transition">Sản Phẩm Mới</Link>
          </h2>
          <Link href="/category/tat-ca" className="text-sm font-bold text-sakura-500 hover:text-sakura-600 hover:underline transition">Xem tất cả &raquo;</Link>
        </div>
        {renderProductGrid(data.new_products)}
      </section>

      {/* 2. SẢN PHẨM BÁN CHẠY */}
      <section>
        <div className="mb-6 flex items-center justify-between border-b-2 border-sakura-100 pb-3">
          <h2 className="text-2xl font-black uppercase text-gray-800 flex items-center gap-3">
            <span className="text-3xl">🔥</span> 
            <Link href="/category/tat-ca" className="hover:text-sakura-500 transition">Sản Phẩm Bán Chạy</Link>
          </h2>
          <Link href="/category/tat-ca" className="text-sm font-bold text-sakura-500 hover:text-sakura-600 hover:underline transition">Xem tất cả &raquo;</Link>
        </div>
        {renderProductGrid(data.hot_products)}
      </section>

      {/* 3. SẢN PHẨM GIẢM GIÁ */}
      <section>
        <div className="mb-6 flex items-center justify-between border-b-2 border-sakura-100 pb-3">
          <h2 className="text-2xl font-black uppercase text-gray-800 flex items-center gap-3">
            <span className="text-3xl">💸</span> 
            <Link href="/category/tat-ca" className="hover:text-sakura-500 transition">Sản Phẩm Giảm Giá</Link>
          </h2>
          <Link href="/category/tat-ca" className="text-sm font-bold text-sakura-500 hover:text-sakura-600 hover:underline transition">Xem tất cả &raquo;</Link>
        </div>
        {renderProductGrid(data.sale_products)}
      </section>

      {/* 4. PRE-ORDER */}
      <section>
        <div className="mb-6 flex items-center justify-between border-b-2 border-sakura-100 pb-3">
          <h2 className="text-2xl font-black uppercase text-gray-800 flex items-center gap-3">
            <span className="text-3xl">⏳</span> 
            <Link href="/category/tat-ca" className="hover:text-sakura-500 transition">Pre-Order Cọc Trước</Link>
          </h2>
          <Link href="/category/tat-ca" className="text-sm font-bold text-sakura-500 hover:text-sakura-600 hover:underline transition">Xem tất cả &raquo;</Link>
        </div>
        {renderProductGrid(data.preorder_products)}
      </section>
    </div>
  );
}