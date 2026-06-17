'use client';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface Product {
  id: number;
  name: string;
  slug: string;
  base_price: number;
  image_url: string | null;
}

// 1. Thêm từ điển để ánh xạ Tên hiển thị chuẩn
const categoryMap: Record<string, string> = {
  'mo-hinh': 'Mô Hình',
  'nendoroid': 'Nendoroid',
  'pack-card': 'Pack Card',
  'blind-box': 'Blind Box',
  'phu-kien': 'Phụ Kiện',
};

export default function CategoryPage() {
  const params = useParams();
  const currentSlug = params.slug as string;
  
  const [products, setProducts] = useState<Product[]>([]);
  // Lấy tên từ từ điển, nếu không có thì để Đang tải
  const [displayName, setDisplayName] = useState(categoryMap[currentSlug] || 'Đang tải...');

  useEffect(() => {
    axios.get(`http://localhost:8000/api/store/category/${currentSlug}`)
      .then(res => {
        setProducts(res.data.products);
        // Ưu tiên tên từ Backend, nếu Backend trả về "Tất cả" thì lấy tên từ Map của Frontend
        if (res.data.category_name !== 'Tất cả sản phẩm') {
          setDisplayName(res.data.category_name);
        } else {
          setDisplayName(categoryMap[currentSlug] || 'Tất cả sản phẩm');
        }
      })
      .catch(() => {
        setDisplayName(categoryMap[currentSlug] || 'Tất cả sản phẩm');
      });
  }, [currentSlug]);

  return (
    <div className="container mx-auto px-4 py-4">
      {/* Breadcrumb */}
      <div className="mb-4 rounded-lg bg-white px-4 py-3 shadow-sm border border-sakura-100 text-sm text-gray-500">
        <Link href="/" className="hover:text-sakura-500">Trang chủ</Link>
        <span className="mx-2">/</span>
        <span className="font-semibold text-sakura-500 uppercase">{displayName}</span>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* SIDEBAR FILTER */}
        <aside className="w-full lg:w-1/4">
          <div className="rounded-xl border border-sakura-100 bg-white p-5 shadow-sm">
            <h2 className="mb-4 border-b border-sakura-100 pb-2 text-lg font-bold uppercase text-gray-800">
              Bộ lọc: {displayName}
            </h2>
            <div className="mb-6">
              <h3 className="mb-3 font-semibold text-sakura-500">Thương hiệu</h3>
              <ul className="space-y-2 text-sm text-gray-700 max-h-48 overflow-y-auto">
                <li><label className="flex cursor-pointer items-center hover:text-sakura-500"><input type="checkbox" className="mr-2 h-4 w-4 accent-sakura-500 rounded" /> Good Smile Company</label></li>
                <li><label className="flex cursor-pointer items-center hover:text-sakura-500"><input type="checkbox" className="mr-2 h-4 w-4 accent-sakura-500 rounded" /> Kotobukiya</label></li>
                <li><label className="flex cursor-pointer items-center hover:text-sakura-500"><input type="checkbox" className="mr-2 h-4 w-4 accent-sakura-500 rounded" /> Bandai Spirits</label></li>
              </ul>
            </div>
          </div>
        </aside>

        {/* LƯỚI SẢN PHẨM REAL */}
        <main className="w-full lg:w-3/4">
          <div className="mb-4 rounded-xl bg-white p-4 shadow-sm border border-sakura-100 flex flex-col sm:flex-row justify-between items-center">
            <h1 className="text-xl font-bold uppercase text-gray-800">{displayName}</h1>
            <select className="rounded-md border border-gray-300 px-3 py-1.5 focus:border-sakura-500 focus:outline-none">
              <option>Mới nhất</option>
              <option>Giá tăng dần</option>
              <option>Giá giảm dần</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
            {products.length === 0 ? (
              <div className="col-span-full py-10 text-center text-gray-500">
                Chưa có sản phẩm nào trong danh mục này.
              </div>
            ) : (
              products.map((item) => (
                <div key={item.id} className="group relative flex flex-col rounded-xl border border-gray-100 bg-white p-3 transition hover:border-sakura-400 hover:shadow-lg">
                  <div className="relative mb-3 aspect-square w-full overflow-hidden rounded-lg bg-gray-50 border border-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={item.image_url || 'https://placehold.co/600x600/fbcfe8/ec4899?text=No+Image'} 
                      alt={item.name} 
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
                    />
                  </div>
                  <h3 className="line-clamp-2 text-sm font-semibold text-gray-800 transition hover:text-sakura-500">
                    <Link href={`/product/${item.id}`}>{item.name}</Link>
                  </h3>
                  <div className="mt-auto pt-3">
                    <p className="text-lg font-bold text-sakura-500">
                      {Number(item.base_price).toLocaleString('vi-VN')}₫
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}