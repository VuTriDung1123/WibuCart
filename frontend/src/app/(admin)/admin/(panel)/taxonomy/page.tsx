'use client';
import { useState } from 'react';
import axios from 'axios';

export default function TaxonomyPage() {
  const [catName, setCatName] = useState('');
  const [seriesName, setSeriesName] = useState('');
  const [brandName, setBrandName] = useState('');

  const [fileCat, setFileCat] = useState<File | null>(null);
  const [fileSer, setFileSer] = useState<File | null>(null);
  const [fileMan, setFileMan] = useState<File | null>(null);

  const handleAdd = async (type: 'category' | 'series' | 'manufacturer', name: string, setName: (val: string) => void) => {
    if (!name) return alert('Vui lòng nhập tên!');
    try {
      const token = localStorage.getItem('admin_token');
      await axios.post(`http://localhost:8000/api/admin/${type}`, { name }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Thêm thành công!');
      setName('');
    } catch {
      alert('Có lỗi xảy ra!');
    }
  };

  const handleImport = async (type: 'category' | 'series' | 'manufacturer', file: File | null, setFile: (val: File|null) => void) => {
    if (!file) return alert('Vui lòng chọn file CSV trước!');
    const token = localStorage.getItem('admin_token');
    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post(`http://localhost:8000/api/admin/taxonomy/import/${type}`, formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      alert('Nhập dữ liệu hàng loạt từ Excel thành công! 🎉');
      setFile(null); // Reset lại trạng thái file
    } catch {
      alert('Lỗi định dạng file hoặc lỗi Server!');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">🏷️ Quản lý Thuộc tính Sản phẩm</h2>
        <p className="mt-1 text-sm text-gray-500">Thêm thủ công hoặc nhập hàng loạt từ file Excel (Chỉ cần 1 Cột ghi Tên).</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card Danh Mục */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col h-full">
          <h3 className="font-bold text-gray-800 mb-4">Thêm Danh Mục (Loại hàng)</h3>
          <div className="mb-6">
            <input type="text" value={catName} onChange={e => setCatName(e.target.value)} placeholder="VD: Nendoroid, Blind Box..." className="w-full rounded-xl border border-gray-300 px-4 py-2.5 mb-3 outline-none focus:border-sakura-400" />
            <button onClick={() => handleAdd('category', catName, setCatName)} className="w-full bg-sakura-500 text-white font-bold py-2.5 rounded-xl hover:bg-sakura-600 transition">THÊM THỦ CÔNG</button>
          </div>
          <div className="mt-auto pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-500 font-semibold mb-2 uppercase">Nhập hàng loạt (CSV)</p>
            <input type="file" accept=".csv" onChange={e => setFileCat(e?.target?.files?.[0] || null)} className="mb-3 text-xs w-full cursor-pointer file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200" />
            <button onClick={() => handleImport('category', fileCat, setFileCat)} className="w-full bg-green-500 text-white font-bold py-2 rounded-xl text-sm hover:bg-green-600 transition">NHẬP FILE EXCEL</button>
          </div>
        </div>

        {/* Card Series */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col h-full">
          <h3 className="font-bold text-gray-800 mb-4">Thêm Series (Anime/Game)</h3>
          <div className="mb-6">
            <input type="text" value={seriesName} onChange={e => setSeriesName(e.target.value)} placeholder="VD: Genshin Impact, Naruto..." className="w-full rounded-xl border border-gray-300 px-4 py-2.5 mb-3 outline-none focus:border-sakura-400" />
            <button onClick={() => handleAdd('series', seriesName, setSeriesName)} className="w-full bg-blue-500 text-white font-bold py-2.5 rounded-xl hover:bg-blue-600 transition">THÊM THỦ CÔNG</button>
          </div>
          <div className="mt-auto pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-500 font-semibold mb-2 uppercase">Nhập hàng loạt (CSV)</p>
            <input type="file" accept=".csv" onChange={e => setFileSer(e?.target?.files?.[0] || null)} className="mb-3 text-xs w-full cursor-pointer file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200" />
            <button onClick={() => handleImport('series', fileSer, setFileSer)} className="w-full bg-green-500 text-white font-bold py-2 rounded-xl text-sm hover:bg-green-600 transition">NHẬP FILE EXCEL</button>
          </div>
        </div>

        {/* Card Thương hiệu */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col h-full">
          <h3 className="font-bold text-gray-800 mb-4">Thêm Thương Hiệu (Hãng)</h3>
          <div className="mb-6">
            <input type="text" value={brandName} onChange={e => setBrandName(e.target.value)} placeholder="VD: Bandai, Kotobukiya..." className="w-full rounded-xl border border-gray-300 px-4 py-2.5 mb-3 outline-none focus:border-sakura-400" />
            <button onClick={() => handleAdd('manufacturer', brandName, setBrandName)} className="w-full bg-gray-800 text-white font-bold py-2.5 rounded-xl hover:bg-gray-900 transition">THÊM THỦ CÔNG</button>
          </div>
          <div className="mt-auto pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-500 font-semibold mb-2 uppercase">Nhập hàng loạt (CSV)</p>
            <input type="file" accept=".csv" onChange={e => setFileMan(e?.target?.files?.[0] || null)} className="mb-3 text-xs w-full cursor-pointer file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200" />
            <button onClick={() => handleImport('manufacturer', fileMan, setFileMan)} className="w-full bg-green-500 text-white font-bold py-2 rounded-xl text-sm hover:bg-green-600 transition">NHẬP FILE EXCEL</button>
          </div>
        </div>
      </div>
    </div>
  );
}