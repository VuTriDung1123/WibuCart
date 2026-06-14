import Link from 'next/link';

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full bg-gray-50 text-gray-800">
      {/* CỘT TRÁI: SIDEBAR */}
      <aside className="w-64 flex-shrink-0 border-r border-gray-200 bg-white flex flex-col">
        <div className="flex h-16 items-center justify-center border-b border-gray-100 bg-sakura-50">
          <h1 className="text-xl font-bold text-sakura-500">WibuCart Admin</h1>
        </div>
        
        <nav className="flex-1 space-y-2 overflow-y-auto p-4 custom-scrollbar">
          <Link href="/admin/dashboard" className="flex items-center rounded-lg bg-sakura-50 px-4 py-3 font-semibold text-sakura-600">
            📊 Tổng Quan
          </Link>
          <Link href="/admin/products" className="flex items-center rounded-lg px-4 py-3 font-medium text-gray-600 hover:bg-gray-50 hover:text-sakura-500">
            📦 Quản lý Sản Phẩm
          </Link>
          <Link href="/admin/orders" className="flex items-center rounded-lg px-4 py-3 font-medium text-gray-600 hover:bg-gray-50 hover:text-sakura-500">
            🛒 Đơn Hàng
          </Link>
          <Link href="/admin/users" className="flex items-center rounded-lg px-4 py-3 font-medium text-gray-600 hover:bg-gray-50 hover:text-sakura-500">
            👥 Khách Hàng
          </Link>
          <div className="my-4 border-t border-gray-100"></div>
          <Link href="/admin/settings" className="flex items-center rounded-lg px-4 py-3 font-medium text-gray-600 hover:bg-gray-50 hover:text-sakura-500">
            ⚙️ Cài Đặt Hệ Thống
          </Link>
        </nav>

        <div className="border-t border-gray-200 p-4">
          <button className="w-full rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-600 transition hover:bg-red-50 hover:text-red-600">
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* CỘT PHẢI: NỘI DUNG CHÍNH */}
      <main className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
          <h2 className="text-lg font-semibold text-gray-800">Bảng điều khiển</h2>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-500">Xin chào, <strong className="text-sakura-500">Admin</strong></span>
            <div className="h-9 w-9 rounded-full bg-sakura-200 border-2 border-sakura-400"></div>
          </div>
        </header>

        {/* Nội dung thay đổi theo từng trang */}
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
}