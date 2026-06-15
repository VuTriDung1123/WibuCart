'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface Product {
  id: number;
  name: string;
  slug: string;
  base_price: number;
  image_url: string | null;
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/store/home-products')
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="container mx-auto px-4">
      {/* Banner */}
      <section className="mb-8 overflow-hidden rounded-2xl bg-white shadow-sm h-75 flex items-center justify-center border-2 border-sakura-200">
         <span className="text-sakura-400 font-bold text-xl">Banner Sự kiện</span>
      </section>

      {/* Sản phẩm nổi bật */}
      <section className="rounded-xl bg-white p-6 shadow-sm">
        <div className="mb-6 border-b border-sakura-100 pb-2">
          <h2 className="text-2xl font-bold uppercase text-gray-800">
            <span className="border-b-4 border-sakura-500 pb-2">Anime Hot Bán Chạy</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {products.length === 0 ? (
            <div className="col-span-full py-10 text-center text-gray-500">Đang tải dữ liệu sản phẩm...</div>
          ) : (
            products.map((item) => (
              <div key={item.id} className="group flex flex-col rounded-lg border border-gray-100 p-3 transition-shadow hover:shadow-md">
                <div className="relative mb-3 aspect-square w-full overflow-hidden rounded-md bg-gray-50 border border-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={item.image_url || 'https://placehold.co/600x600/fbcfe8/ec4899?text=No+Image'} 
                    alt={item.name} 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
                  />
                </div>
                <h3 className="line-clamp-2 text-sm font-semibold text-gray-800 hover:text-sakura-500">
                  <Link href={`/product/${item.id}`}>
                    {item.name}
                  </Link>
                </h3>
                <p className="mt-auto pt-2 text-base font-bold text-sakura-500">
                  {Number(item.base_price).toLocaleString('vi-VN')}₫
                </p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}