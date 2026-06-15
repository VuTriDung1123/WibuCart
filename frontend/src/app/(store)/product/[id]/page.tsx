'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';

interface ProductCartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  max: number;
  image: string;
}

interface Product {
  id: number;
  name: string;
  base_price: number;
  brand_name?: string;
  description?: string;
}

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id;

  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState('');
  
  // State hứng data thật
  const [productData, setProductData] = useState<Product | null>(null);
  const [stock, setStock] = useState(0);
  const [gallery, setGallery] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:8000/api/store/product/${productId}`)
      .then(res => {
        setProductData(res.data.product);
        setStock(res.data.stock_quantity);
        const imgs = res.data.images;
        // Nếu không có ảnh, cho 1 cái ảnh giữ chỗ
        const finalImgs = imgs.length > 0 ? imgs : ['https://placehold.co/600x600/fbcfe8/ec4899?text=No+Image'];
        setGallery(finalImgs);
        setActiveImage(finalImgs[0]); // Mặc định hiển thị ảnh đầu tiên
        setLoading(false);
      })
      .catch(() => {
        alert('Sản phẩm không tồn tại!');
        router.push('/');
      });
  }, [productId, router]);

  if (loading || !productData) {
    return <div className="text-center py-20 font-bold text-sakura-500">Đang tải Waifu/Husbando...</div>;
  }

  const addToCartStorage = () => {
    const existingCart: ProductCartItem[] = JSON.parse(localStorage.getItem('wibu_cart') || '[]');
    const itemIndex = existingCart.findIndex((item) => item.id === productData.id);

    if (itemIndex >= 0) {
      existingCart[itemIndex].quantity += quantity; 
    } else {
      existingCart.push({ 
        id: productData.id,
        name: productData.name,
        price: productData.base_price,
        quantity: quantity,
        max: stock,
        image: gallery[0] // Lấy ảnh đầu tiên làm ảnh giỏ hàng
      }); 
    }

    localStorage.setItem('wibu_cart', JSON.stringify(existingCart));
    window.dispatchEvent(new Event('cartUpdated')); 
  };

  const handleAddToCart = () => {
    addToCartStorage();
    alert('Đã thêm thành công vào giỏ hàng! 🌸');
  };

  const handleBuyNow = () => {
    addToCartStorage();
    router.push('/cart'); // Sửa lại: Mua ngay bay vào Giỏ Hàng trước (như ảnh chụp của bạn)
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 text-sm text-gray-500">
        <Link href="/" className="hover:text-sakura-500 transition">Trang chủ</Link>
        <span className="mx-2">/</span>
        <span className="font-semibold text-sakura-500">{productData.name}</span>
      </div>

      <div className="flex flex-col gap-10 lg:flex-row bg-white p-6 rounded-3xl shadow-sm border border-sakura-100">
        <div className="w-full lg:w-1/2">
          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 mb-4 aspect-square">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={activeImage} alt={productData.name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
          </div>
          {gallery.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {gallery.map((img, index) => (
                <button key={index} onClick={() => setActiveImage(img)} className={`overflow-hidden rounded-xl border-2 aspect-square transition ${activeImage === img ? 'border-sakura-500' : 'border-transparent hover:border-sakura-200'}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} className="w-full h-full object-cover" alt={`Thumb ${index}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="w-full lg:w-1/2 flex flex-col">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">{productData.brand_name || 'Đang cập nhật hãng'}</span>
          <h1 className="text-3xl font-bold text-gray-800 leading-tight mb-4">{productData.name}</h1>
          
          <div className="flex items-end gap-4 mb-6 pb-6 border-b border-gray-100">
            <span className="text-4xl font-black text-sakura-500">{Number(productData.base_price).toLocaleString('vi-VN')}₫</span>
            <span className="rounded-md bg-green-100 px-2.5 py-1 text-sm font-bold text-green-700 mb-1">Kho: {stock}</span>
          </div>

          <p className="text-gray-600 mb-8 leading-relaxed whitespace-pre-line">
            {productData.description || 'Chưa có mô tả cho sản phẩm này.'}
          </p>

          <div className="mt-auto bg-sakura-50 p-6 rounded-2xl border border-sakura-100 space-y-4">
            <div className="flex items-center gap-4">
              <span className="font-semibold text-gray-700">Số lượng:</span>
              <div className="flex h-12 items-center rounded-lg border border-gray-300 bg-white">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-4 text-lg font-bold text-gray-500 hover:text-sakura-500">-</button>
                <input type="number" value={quantity} readOnly className="w-12 text-center font-bold text-gray-800 outline-none" />
                <button onClick={() => setQuantity(q => Math.min(stock, q + 1))} className="px-4 text-lg font-bold text-gray-500 hover:text-sakura-500">+</button>
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