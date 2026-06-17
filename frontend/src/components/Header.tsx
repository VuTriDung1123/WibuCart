'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

interface HeaderCartItem {
  quantity: number;
}

export default function Header() {
  const [userName, setUserName] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(0); 
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const userDataStr = localStorage.getItem('user_data');
    if (userDataStr) {
      try {
        const user = JSON.parse(userDataStr);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUserName(user.name);
      } catch { 
        setUserName(null); 
      }
    } else {
      setUserName(null);
    }
  }, [pathname]);

  useEffect(() => {
    const calculateCart = () => {
      const cart = JSON.parse(localStorage.getItem('wibu_cart') || '[]');
      const total = cart.reduce((sum: number, item: HeaderCartItem) => sum + item.quantity, 0);
      setCartCount(total);
    };

    calculateCart(); 
    window.addEventListener('cartUpdated', calculateCart); 
    return () => window.removeEventListener('cartUpdated', calculateCart);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUserName(null);
    router.push('/');
  };

  const menuItems = [
    { name: 'Trang chủ', path: '/' },
    { name: 'Mô Hình', path: '/category/mo-hinh' },
    { name: 'Nendoroid', path: '/category/nendoroid' },
    { name: 'Pack Card', path: '/category/pack-card' }, // Đã sửa
    { name: 'Blind Box', path: '/category/blind-box' },
    { name: 'Phụ Kiện', path: '/category/phu-kien' }, // Đã sửa
    { name: 'Liên Hệ', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="text-3xl font-bold text-sakura-500">WibuCart 🌸</Link>
          
          <div className="hidden flex-1 px-8 lg:block">
            <input type="text" placeholder="Tìm kiếm waifu/husbando..." className="w-full rounded-full border border-sakura-200 bg-sakura-50 px-4 py-2 focus:border-sakura-500 focus:outline-none" />
          </div>

          <div className="flex items-center space-x-6 font-medium text-gray-700">
            {userName ? (
              <div className="flex items-center gap-3">
                <Link href="/profile" className="flex items-center text-gray-800 hover:text-sakura-500 transition font-bold">
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                  Tài khoản ({userName})
                </Link>
                <button onClick={handleLogout} className="text-xs font-semibold text-red-500 hover:underline">Đăng xuất</button>
              </div>
            ) : (
              <Link href="/login" className="hover:text-sakura-500 transition">Đăng nhập</Link>
            )}

            <Link href="/cart" className="flex items-center hover:text-sakura-500 transition">
              <span className="mr-1">🛒 Giỏ hàng</span>
              <span className="rounded-full bg-sakura-500 px-2.5 py-0.5 text-xs font-bold text-white">{cartCount}</span>
            </Link>
          </div>
        </div>
        <nav className="hidden border-t border-sakura-100 lg:block">
          <ul className="flex justify-center space-x-8 py-3">
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link href={item.path} className="text-sm font-semibold uppercase text-gray-800 transition-colors hover:text-sakura-500">{item.name}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}