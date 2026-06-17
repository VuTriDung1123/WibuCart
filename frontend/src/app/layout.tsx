import type { Metadata } from "next";
import { GoogleOAuthProvider } from '@react-oauth/google';
import "./globals.css";

// Import Trạm gác tàng hình chúng ta vừa tạo
import AxiosInterceptor from '@/components/AxiosInterceptor';

// Đoạn này hoàn toàn hợp lệ vì file này đang là Server Component
export const metadata: Metadata = {
  title: "WibuCart 🌸",
  description: "Thiên đường Anime dành cho bạn",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
          
          {/* Đặt Trạm Gác ở đây. Nó sẽ im lặng chạy ngầm toàn hệ thống */}
          <AxiosInterceptor /> 
          
          {children}

        </GoogleOAuthProvider>
      </body>
    </html>
  );
}