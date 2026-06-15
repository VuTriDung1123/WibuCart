'use client';
import { useState } from 'react';
import axios from 'axios';

export default function TaxonomyPage() {
  const [catName, setCatName] = useState('');
  const [seriesName, setSeriesName] = useState('');
  const [brandName, setBrandName] = useState('');

  const handleAdd = async (type: 'category' | 'series' | 'manufacturer', name: string, setName: (val: string) => void) => {
    if (!name) return alert('Vui lòng nhập tên!');
    try {
      const token = localStorage.getItem('admin_token');
      await axios.post(`http://localhost:8000/api/admin/${type}`, { name }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Thêm thành công!');
      setName(''); // Xóa trắng ô input
    } catch {
      alert('Có lỗi xảy ra!');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">🏷️ Quản lý Thuộc tính Sản phẩm</h2>
        <p className="mt-1 text-sm text-gray-500">Thêm các tùy chọn mới cho hộp thả xuống khi tạo sản phẩm.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card Thêm Danh Mục */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">Thêm Danh Mục (Loại hàng)</h3>
          <input type="text" value={catName} onChange={e => setCatName(e.target.value)} placeholder="VD: Nendoroid, Blind Box..." className="w-full rounded-xl border border-gray-300 px-4 py-2.5 mb-3 outline-none focus:border-sakura-400" />
          <button onClick={() => handleAdd('category', catName, setCatName)} className="w-full bg-sakura-500 text-white font-bold py-2.5 rounded-xl hover:bg-sakura-600 transition">Thêm Danh Mục</button>
        </div>

        {/* Card Thêm Series */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">Thêm Series (Anime/Game)</h3>
          <input type="text" value={seriesName} onChange={e => setSeriesName(e.target.value)} placeholder="VD: Genshin Impact, Naruto..." className="w-full rounded-xl border border-gray-300 px-4 py-2.5 mb-3 outline-none focus:border-sakura-400" />
          <button onClick={() => handleAdd('series', seriesName, setSeriesName)} className="w-full bg-blue-500 text-white font-bold py-2.5 rounded-xl hover:bg-blue-600 transition">Thêm Series</button>
        </div>

        {/* Card Thêm Thương hiệu */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">Thêm Thương Hiệu (Hãng)</h3>
          <input type="text" value={brandName} onChange={e => setBrandName(e.target.value)} placeholder="VD: Bandai, Kotobukiya..." className="w-full rounded-xl border border-gray-300 px-4 py-2.5 mb-3 outline-none focus:border-sakura-400" />
          <button onClick={() => handleAdd('manufacturer', brandName, setBrandName)} className="w-full bg-gray-800 text-white font-bold py-2.5 rounded-xl hover:bg-gray-900 transition">Thêm Thương Hiệu</button>
        </div>
      </div>
    </div>
  );
}