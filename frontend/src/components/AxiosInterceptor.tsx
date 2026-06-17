'use client'; // File này sẽ chạy ở phía Client (Trình duyệt)

import { useEffect } from 'react';
import axios from 'axios';
// Dùng useRouter của Next.js thay vì window.location để chuyển trang mượt mà không bị giật
import { useRouter } from 'next/navigation'; 

export default function AxiosInterceptor() {
  const router = useRouter();

  useEffect(() => {
    // Đặt trạm gác theo dõi MỌI phản hồi từ Backend trả về
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        // Nếu Server báo 401 (Hết hạn Token, sai Token, chưa đăng nhập)
        if (error.response?.status === 401) {
          
          // Xóa hết sạch các thẻ ra vào cũ
          localStorage.removeItem('user_token');
          localStorage.removeItem('user_data');
          localStorage.removeItem('login_method');
          localStorage.removeItem('admin_token');
          
          // Chuyển hướng người dùng về trang đăng nhập
          router.push('/login'); 
        }
        return Promise.reject(error);
      }
    );

    // Khi người dùng tắt web hoặc Component bị hủy, dỡ bỏ trạm gác
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [router]);

  // Component này tàng hình, không hiển thị giao diện gì cả
  return null; 
}