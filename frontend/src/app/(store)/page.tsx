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
  discount_percent?: number;
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

  // THUẬT TOÁN LÀM TRÒN THEO HÀNG CHỤC NGHÌN VNĐ
  const calculateSalePrice = (base: number, percent?: number) => {
    if (!percent || percent <= 0) return base;
    const discountedPrice = base * (1 - percent / 100);
    return Math.round(discountedPrice / 10000) * 10000;
  };

  const renderProductGrid = (products: Product[]) => {
    if (!products || products.length === 0) {
      return <p className="text-gray-500 py-6 italic text-center bg-white rounded-2xl border border-dashed border-gray-200">Chưa có sản phẩm nào trong mục này.</p>;
    }
    
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {products.map((item) => {
          const isSale = item.badge === 'sale' && item.discount_percent && item.discount_percent > 0;
          const currentPrice = calculateSalePrice(item.base_price, item.discount_percent);

          return (
            <div key={item.id} className="group flex flex-col rounded-2xl border border-sakura-100 bg-white p-4 transition-all hover:shadow-lg hover:border-sakura-300 relative overflow-hidden">
              
              {/* THẺ TAG (BADGE) NỔI BẬT */}
              <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
                {item.is_preorder === 1 && <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-1 rounded shadow-sm uppercase tracking-wider">Pre-order</span>}
                {item.badge === 'new' && <span className="bg-green-500 text-white text-[10px] font-black px-2 py-1 rounded shadow-sm uppercase tracking-wider">Mới</span>}
                {item.badge === 'hot' && <span className="bg-orange-500 text-white text-[10px] font-black px-2 py-1 rounded shadow-sm uppercase tracking-wider">Hot</span>}
                {isSale && <span className="bg-red-500 text-white text-[11px] font-black px-2 py-1 rounded shadow-sm uppercase tracking-wider">GIẢM {item.discount_percent}%</span>}
              </div>

              <div className="relative mb-4 aspect-square w-full overflow-hidden rounded-xl bg-gray-50">
                <img src={item.image_url || 'https://placehold.co/600x600/fbcfe8/ec4899?text=No+Image'} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              </div>
              
              <h3 className="line-clamp-2 text-sm font-bold text-gray-800 hover:text-sakura-600 transition mb-3 mt-auto">
                <Link href={`/product/${item.id}`}>{item.name}</Link>
              </h3>
              
              <div className="mt-auto pt-2 border-t border-gray-50">
                {isSale ? (
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-black text-red-500">{currentPrice.toLocaleString('vi-VN')}₫</p>
                    </div>
                    <p className="text-xs font-semibold text-gray-400 line-through">{Number(item.base_price).toLocaleString('vi-VN')}₫</p>
                  </div>
                ) : (
                  <p className="text-lg font-black text-sakura-500">
                    {Number(item.base_price).toLocaleString('vi-VN')}₫
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  if (!data) return <div className="text-center py-32 text-sakura-500 font-bold text-xl animate-pulse">🌸 Đang tải thiên đường 2D...</div>;

  return (
    <div className="container mx-auto px-4 space-y-16">
      <section className="overflow-hidden rounded-3xl bg-white shadow-sm h-75 flex items-center justify-center border-2 border-sakura-200">
         <span className="text-sakura-400 font-bold text-xl">Banner Sự kiện Lễ Hội Hoa Anh Đào</span>
      </section>

      <section>
        <div className="mb-6 flex items-center justify-between border-b-2 border-sakura-100 pb-3">
          <h2 className="text-2xl font-black uppercase text-gray-800 flex items-center gap-3"><span className="text-3xl">✨</span> <Link href="/category/tat-ca" className="hover:text-sakura-500 transition">Sản Phẩm Mới</Link></h2>
          <Link href="/category/tat-ca" className="text-sm font-bold text-sakura-500 hover:text-sakura-600 hover:underline transition">Xem tất cả &raquo;</Link>
        </div>
        {renderProductGrid(data.new_products)}
      </section>

      <section>
        <div className="mb-6 flex items-center justify-between border-b-2 border-sakura-100 pb-3">
          <h2 className="text-2xl font-black uppercase text-gray-800 flex items-center gap-3"><span className="text-3xl">🔥</span> <Link href="/category/tat-ca" className="hover:text-sakura-500 transition">Sản Phẩm Bán Chạy</Link></h2>
          <Link href="/category/tat-ca" className="text-sm font-bold text-sakura-500 hover:text-sakura-600 hover:underline transition">Xem tất cả &raquo;</Link>
        </div>
        {renderProductGrid(data.hot_products)}
      </section>

      <section>
        <div className="mb-6 flex items-center justify-between border-b-2 border-sakura-100 pb-3">
          <h2 className="text-2xl font-black uppercase text-red-600 flex items-center gap-3"><span className="text-3xl">💸</span> <Link href="/category/tat-ca" className="hover:text-red-500 transition">Sản Phẩm Giảm Giá</Link></h2>
          <Link href="/category/tat-ca" className="text-sm font-bold text-red-500 hover:text-red-600 hover:underline transition">Xem tất cả &raquo;</Link>
        </div>
        {renderProductGrid(data.sale_products)}
      </section>

      <section>
        <div className="mb-6 flex items-center justify-between border-b-2 border-sakura-100 pb-3">
          <h2 className="text-2xl font-black uppercase text-gray-800 flex items-center gap-3"><span className="text-3xl">⏳</span> <Link href="/category/tat-ca" className="hover:text-sakura-500 transition">Pre-Order Cọc Trước</Link></h2>
          <Link href="/category/tat-ca" className="text-sm font-bold text-sakura-500 hover:text-sakura-600 hover:underline transition">Xem tất cả &raquo;</Link>
        </div>
        {renderProductGrid(data.preorder_products)}
      </section>
    </div>
  );
}