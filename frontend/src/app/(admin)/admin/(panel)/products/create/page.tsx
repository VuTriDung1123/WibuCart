'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface MetaItem { id: number; name: string; }
interface MetaData { categories: MetaItem[]; series: MetaItem[]; manufacturers: MetaItem[]; }

export default function CreateProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [meta, setMeta] = useState<MetaData>({ categories: [], series: [], manufacturers: [] });
  const [imageUrls, setImageUrls] = useState<string[]>(['']);
  
  const [formData, setFormData] = useState({
    name: '', description: '', base_price: '', stock_quantity: '',
    category_id: '', series_id: '', manufacturer_id: '', is_preorder: false, badge: 'new'
  });

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    axios.get('http://localhost:8000/api/admin/create-metadata', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setMeta(res.data)).catch(() => {});
  }, []);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ show: true, message, type });
    if (type === 'success') {
      // Đợi 1.5s cho user đọc thông báo rồi mới chuyển trang
      setTimeout(() => {
        router.push('/admin/products');
        router.refresh();
      }, 1500);
    } else {
      setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    const checked = isCheckbox ? (e.target as HTMLInputElement).checked : false;
    setFormData({ ...formData, [name]: isCheckbox ? checked : value });
  };

  const handleImageChange = (index: number, value: string) => {
    const newUrls = [...imageUrls];
    newUrls[index] = value;
    setImageUrls(newUrls);
  };
  const addImageInput = () => setImageUrls([...imageUrls, '']);
  const removeImageInput = (index: number) => {
    if (imageUrls.length > 1) setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('admin_token');
    const payload = { ...formData, image_urls: imageUrls.filter(url => url.trim() !== '') };

    try {
      await axios.post('http://localhost:8000/api/admin/products', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast('Đã lưu sản phẩm thành công!', 'success');
    } catch (error: unknown) {
      const errorMsg = axios.isAxiosError(error)
        ? error.response?.data?.error || error.response?.data?.message || 'Vui lòng kiểm tra lại thông tin!'
        : 'Vui lòng kiểm tra lại thông tin!';
      showToast(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto relative">
      {toast.show && (
        <div className={`fixed top-10 left-1/2 -translate-x-1/2 px-8 py-4 rounded-xl text-white font-bold shadow-2xl z-50 animate-fade-in ${toast.type === 'success' ? 'bg-sakura-500' : 'bg-red-500'}`}>
          {toast.message}
        </div>
      )}

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">✨ Thêm Sản Phẩm Mới</h2>
        <Link href="/admin/products" className="text-sakura-500 font-semibold hover:underline">🔙 Hủy & Quay lại</Link>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Tên Sản Phẩm *</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:border-sakura-400 outline-none bg-gray-50 focus:bg-white transition" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Mô tả sản phẩm</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows={5} className="w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:border-sakura-400 outline-none bg-gray-50 focus:bg-white transition"></textarea>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Thư viện Hình Ảnh (Link Ảnh)</label>
              {imageUrls.map((url, index) => (
                <div key={index} className="flex gap-2 mb-3 items-start">
                  <div className="flex-1">
                    <input type="url" value={url} onChange={(e) => handleImageChange(index, e.target.value)} placeholder="https://..." className="w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:border-sakura-400 outline-none bg-gray-50 focus:bg-white transition" />
                  </div>
                  {url && (
                    <div className="w-11 h-11 shrink-0 rounded border border-gray-200 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt="pic" className="w-full h-full object-cover" />
                    </div>
                  )}
                  {imageUrls.length > 1 && (
                    <button type="button" onClick={() => removeImageInput(index)} className="px-3 py-2.5 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition font-bold">X</button>
                  )}
                </div>
              ))}
              <button type="button" onClick={addImageInput} className="text-sm font-bold text-sakura-500 hover:text-sakura-600 transition">+ Thêm Ảnh Nữa</button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Giá bán (VNĐ) *</label>
              <input type="number" name="base_price" value={formData.base_price} onChange={handleChange} required min="0" className="w-full rounded-xl border border-gray-300 px-4 py-2.5 outline-none bg-gray-50 focus:bg-white" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Số lượng trong kho *</label>
              <input type="number" name="stock_quantity" value={formData.stock_quantity} onChange={handleChange} required min="0" className="w-full rounded-xl border border-gray-300 px-4 py-2.5 outline-none bg-gray-50 focus:bg-white" />
            </div>
            <div className="border-t border-gray-100 pt-5">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Danh mục *</label>
              <select name="category_id" value={formData.category_id} onChange={handleChange} required className="w-full rounded-xl border border-gray-300 px-4 py-2.5 bg-gray-50 outline-none">
                <option value="">-- Chọn Danh Mục --</option>
                {meta.categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Series / Anime *</label>
              <select name="series_id" value={formData.series_id} onChange={handleChange} required className="w-full rounded-xl border border-gray-300 px-4 py-2.5 bg-gray-50 outline-none">
                <option value="">-- Chọn Series --</option>
                {meta.series.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Thương hiệu *</label>
              <select name="manufacturer_id" value={formData.manufacturer_id} onChange={handleChange} required className="w-full rounded-xl border border-gray-300 px-4 py-2.5 bg-gray-50 outline-none">
                <option value="">-- Chọn Thương Hiệu --</option>
                {meta.manufacturers.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Mục hiển thị Trang chủ *</label>
              <select name="badge" value={formData.badge} onChange={handleChange} className="w-full rounded-xl border border-gray-300 px-4 py-2.5 bg-gray-50 outline-none focus:bg-white focus:border-sakura-400">
                <option value="new">Sản Phẩm Mới</option>
                <option value="hot">Sản Phẩm Bán Chạy</option>
                <option value="sale">Sản Phẩm Giảm Giá</option>
                <option value="normal">Sản Phẩm CÒN HÀNG (Ẩn khỏi trang chủ)</option>
              </select>
            </div>
            <label className="flex items-center space-x-3 cursor-pointer pt-3">
              <input type="checkbox" name="is_preorder" checked={formData.is_preorder} onChange={handleChange} className="w-5 h-5 accent-sakura-500 rounded border-gray-300" />
              <span className="font-semibold text-gray-800">Hàng Đặt Trước (Pre-order)</span>
            </label>
          </div>
          <button type="submit" disabled={loading} className="w-full rounded-xl bg-sakura-500 py-4 text-lg font-bold text-white shadow-lg transition hover:bg-sakura-600 disabled:opacity-70">
            {loading ? 'Đang lưu...' : 'LƯU SẢN PHẨM'}
          </button>
        </div>
      </form>
    </div>
  );
}