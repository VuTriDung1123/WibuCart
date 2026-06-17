'use client';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ImportProductsPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ show: true, message, type });
    if (type === 'success') {
      setTimeout(() => { router.push('/admin/products'); router.refresh(); }, 1500);
    } else {
      setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      showToast('Vui lòng chọn file CSV trước khi tải lên!', 'error');
      return;
    }

    setLoading(true);
    const token = localStorage.getItem('admin_token');
    
    // Đóng gói file thành Form Data để gửi
    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post('http://localhost:8000/api/admin/products/import', formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      showToast('Tuyệt vời! Đã nhập toàn bộ sản phẩm thành công.', 'success');
    } catch (error: unknown) {
      const msg = (error as { response?: { data?: { error?: string } } }).response?.data?.error || 'Sai định dạng file hoặc có lỗi xảy ra!';
      showToast(msg, 'error');
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
        <h2 className="text-2xl font-bold text-gray-800">📥 Nhập Sản Phẩm Hàng Loạt</h2>
        <Link href="/admin/products" className="text-sakura-500 font-semibold hover:underline">🔙 Hủy & Quay lại</Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* HƯỚNG DẪN BÊN TRÁI */}
        <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm">
          <h3 className="text-lg font-bold text-blue-600 mb-4">📖 Hướng dẫn định dạng File</h3>
          <p className="text-sm text-gray-600 mb-4">Vui lòng sử dụng Excel tạo 8 cột theo đúng thứ tự dưới đây. Sau khi nhập xong, ấn <strong>Save As -&gt; CSV UTF-8 (Comma delimited) (*.csv)</strong> để hệ thống có thể đọc được tiếng Việt.</p>
          
          <ul className="space-y-3 text-sm text-gray-700 bg-blue-50 p-4 rounded-xl border border-blue-100">
            <li><strong>Cột 1:</strong> Tên Sản Phẩm <span className="text-red-500">*</span></li>
            <li><strong>Cột 2:</strong> Mô tả chi tiết</li>
            <li><strong>Cột 3:</strong> Link Hình Ảnh <span className="italic text-gray-500">(Nhiều link thì cách nhau bằng dấu phẩy)</span></li>
            <li><strong>Cột 4:</strong> Giá bán <span className="italic text-gray-500">(Ghi 350000 hoặc 350.000 đều được)</span> <span className="text-red-500">*</span></li>
            <li><strong>Cột 5:</strong> Số lượng kho <span className="text-red-500">*</span></li>
            <li><strong>Cột 6:</strong> Tên Danh Mục <span className="italic text-gray-500">(Tự tạo nếu chưa có)</span></li>
            <li><strong>Cột 7:</strong> Tên Series / Anime <span className="italic text-gray-500">(Tự tạo nếu chưa có)</span></li>
            <li><strong>Cột 8:</strong> Tên Thương Hiệu <span className="italic text-gray-500">(Tự tạo nếu chưa có)</span></li>
          </ul>
        </div>

        {/* FORM UPLOAD BÊN PHẢI */}
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-center items-center">
          <div className="w-full flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-2xl p-10 hover:border-sakura-400 transition bg-gray-50 mb-6">
            <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
            <p className="text-sm font-semibold text-gray-600 mb-2">Kéo thả file CSV vào đây hoặc</p>
            <input type="file" accept=".csv" onChange={handleFileChange} className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sakura-50 file:text-sakura-600 hover:file:bg-sakura-100 transition cursor-pointer" />
          </div>

          <button type="submit" disabled={loading || !file} className="w-full rounded-xl bg-green-500 py-4 text-lg font-bold text-white shadow-lg transition hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? 'Đang phân tích & Lưu...' : 'BẮT ĐẦU NHẬP DỮ LIỆU'}
          </button>
        </form>
      </div>
    </div>
  );
}