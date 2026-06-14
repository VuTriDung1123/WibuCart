import Link from 'next/link';

export default function Header() {
  const menuItems = [
    { name: 'Trang chủ', path: '/' },
    { name: 'Mô Hình', path: '/category/figures' },
    { name: 'Nendoroid', path: '/category/nendoroid' },
    { name: 'Pack Card', path: '/category/trading-cards' },
    { name: 'Blind Box', path: '/category/blind-box' },
    { name: 'Phụ Kiện', path: '/category/accessories' },
    { name: 'Liên Hệ', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      <div className="container mx-auto px-4">
        {/* Phần Logo và Thanh tìm kiếm */}
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="text-3xl font-bold text-sakura-500">
            WibuCart 🌸
          </Link>
          
          <div className="hidden flex-1 px-8 lg:block">
            <input 
              type="text" 
              placeholder="Tìm kiếm waifu/husbando của bạn..." 
              className="w-full rounded-full border border-sakura-200 bg-sakura-50 px-4 py-2 focus:border-sakura-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center space-x-4 font-medium text-gray-700">
            <Link href="/login" className="hover:text-sakura-500">Đăng nhập</Link>
            <Link href="/cart" className="flex items-center hover:text-sakura-500">
              <span>🛒 Giỏ hàng</span>
              <span className="ml-1 rounded-full bg-sakura-500 px-2 text-xs text-white">0</span>
            </Link>
          </div>
        </div>

        {/* Phần Tab Menu từ ảnh của bạn */}
        <nav className="hidden border-t border-sakura-100 lg:block">
          <ul className="flex justify-center space-x-8 py-3">
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link 
                  href={item.path} 
                  className="text-sm font-semibold uppercase text-gray-800 transition-colors hover:text-sakura-500"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}