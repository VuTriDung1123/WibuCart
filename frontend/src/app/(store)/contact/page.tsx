'use client';
import { useState, useRef } from 'react';
import Link from 'next/link';
import axios from 'axios';
import ReCAPTCHA from 'react-google-recaptcha';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCaptchaChange = (token: string | null) => {
    setCaptchaToken(token);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');
    setError('');

    // Bắt lỗi chưa check Captcha
    if (!captchaToken) {
      setError('Vui lòng check vào ô xác minh "Tôi không phải là người máy"!');
      return;
    }

    setLoading(true);
    try {
      const payload = { ...formData, recaptcha_token: captchaToken };
      const res = await axios.post('http://localhost:8000/api/store/contact', payload);
      
      setSuccess(res.data.message || 'Gửi liên hệ thành công!');
      setFormData({ name: '', email: '', phone: '', message: '' });
      
      // Reset Captcha sau khi gửi thành công
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }
      setCaptchaToken(null);
      
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || 'Có lỗi xảy ra khi gửi tin nhắn!');
      } else {
        setError('Có lỗi không xác định!');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-6 rounded-lg bg-white px-4 py-3 shadow-sm border border-sakura-100 text-sm text-gray-500">
        <Link href="/" className="hover:text-sakura-500 transition">Trang chủ</Link>
        <span className="mx-2">/</span>
        <span className="font-semibold text-sakura-500">Liên hệ</span>
      </div>

      <div className="rounded-3xl border border-sakura-100 bg-white p-6 shadow-sm md:p-12">
        <h1 className="mb-10 text-3xl font-bold uppercase text-gray-800 text-center tracking-wider">
          Liên Hệ <span className="text-sakura-500">WibuCart</span>
        </h1>
        
        <div className="grid gap-12 lg:grid-cols-2">
          {/* CỘT THÔNG TIN & BẢN ĐỒ */}
          <div className="space-y-8">
            <div>
              <h2 className="mb-5 text-xl font-bold text-gray-800 border-b border-sakura-100 pb-3">Thông tin cửa hàng</h2>
              <div className="space-y-4 text-gray-700 text-[15px]">
                <p className="flex items-start">
                  <span className="mr-3 text-lg">📍</span> 
                  <span><strong>Địa chỉ:</strong> 123 đường abc, phường def, thành phố gik</span>
                </p>
                <p className="flex items-center">
                  <span className="mr-3 text-lg">📞</span> 
                  <span><strong>Hotline:</strong> <a href="tel:0123456789" className="text-sakura-500 hover:underline font-bold">012 345 6789</a></span>
                </p>
                <p className="flex items-center">
                  <span className="mr-3 text-lg">✉️</span> 
                  <span><strong>Email:</strong> <a href="mailto:vutridung.contact@gmail.com" className="hover:text-sakura-500 transition">vutridung.contact@gmail.com</a></span>
                </p>
              </div>
            </div>
            
            <div className="h-72 w-full rounded-2xl overflow-hidden shadow-sm border border-gray-200 relative group">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.513274106207!2d106.6947832153344!3d10.771946092323788!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f3e8f85f1c7%3A0xcda6b83f0605a3!2zQ2jhu6MgQuG6v24gVGjDoG5o!5e0!3m2!1svi!2s!4v1680000000000!5m2!1svi!2s" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={false} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="transition-opacity duration-300 group-hover:opacity-90"
              ></iframe>
            </div>
          </div>

          {/* CỘT FORM LIÊN HỆ */}
          <div className="rounded-3xl bg-sakura-50/50 p-8 border border-sakura-100">
            <h2 className="mb-6 text-2xl font-bold text-gray-800">Gửi lời nhắn cho chúng tôi</h2>
            
            {success && <div className="mb-6 p-4 bg-green-100 text-green-700 font-bold rounded-xl border border-green-200">{success}</div>}
            {error && <div className="mb-6 p-4 bg-red-100 text-red-600 font-bold rounded-xl border border-red-200">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Họ và tên *</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="VD: Vũ Trí Dũng" className="w-full rounded-xl border border-gray-300 px-4 py-3.5 bg-white focus:border-sakura-500 focus:outline-none transition shadow-sm" required />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Email * (Dùng email thật)</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="example@gmail.com" className="w-full rounded-xl border border-gray-300 px-4 py-3.5 bg-white focus:border-sakura-500 focus:outline-none transition shadow-sm" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Số điện thoại *</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="012 345 6789" className="w-full rounded-xl border border-gray-300 px-4 py-3.5 bg-white focus:border-sakura-500 focus:outline-none transition shadow-sm" required />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Nội dung cần hỗ trợ *</label>
                <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Bạn đang gặp vấn đề gì?" rows={4} className="w-full rounded-xl border border-gray-300 px-4 py-3.5 bg-white focus:border-sakura-500 focus:outline-none transition shadow-sm resize-none" required></textarea>
              </div>

              {/* GOOGLE reCAPTCHA */}
              <div className="flex justify-center pt-2">
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'}
                  onChange={handleCaptchaChange}
                />
              </div>

              <button type="submit" disabled={loading} className="w-full rounded-xl bg-sakura-500 px-6 py-4 text-lg font-bold text-white shadow-lg shadow-sakura-200 transition hover:bg-sakura-600 disabled:opacity-70 mt-4 tracking-wide">
                {loading ? 'Đang gửi...' : 'GỬI LIÊN HỆ NGAY'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}