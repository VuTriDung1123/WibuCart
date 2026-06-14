import Link from 'next/link';

// Định nghĩa thư viện từ khóa để dịch slug sang tên Tiếng Việt
const categoryNames: Record<string, string> = {
  'figures': 'Mô Hình',
  'nendoroid': 'Nendoroid',
  'trading-cards': 'Pack Card',
  'blind-box': 'Blind Box',
  'accessories': 'Phụ Kiện',
};

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const currentSlug = resolvedParams.slug;
  
  // Lấy tên danh mục hiển thị, nếu gõ bậy thì hiển thị "Tất cả sản phẩm"
  const displayName = categoryNames[currentSlug] || 'Tất cả sản phẩm';
  
  const fakeProducts = [1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <div className="container mx-auto px-4 py-4">
      {/* Breadcrumb */}
      <div className="mb-4 rounded-lg bg-white px-4 py-3 shadow-sm border border-sakura-100 text-sm text-gray-500">
        <Link href="/" className="hover:text-sakura-500">Trang chủ</Link>
        <span className="mx-2">/</span>
        <span className="font-semibold text-sakura-500">{displayName}</span>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* SIDEBAR FILTER DÙNG CHUNG */}
        <aside className="w-full lg:w-1/4">
          <div className="rounded-xl border border-sakura-100 bg-white p-5 shadow-sm">
            <h2 className="mb-4 border-b border-sakura-100 pb-2 text-lg font-bold uppercase text-gray-800">
              Bộ lọc: {displayName}
            </h2>
            
            <div className="mb-6">
              <h3 className="mb-3 font-semibold text-sakura-500">Thương hiệu</h3>
              <ul className="space-y-2 text-sm text-gray-700 max-h-48 overflow-y-auto">
                <li><label className="flex cursor-pointer items-center hover:text-sakura-500"><input type="checkbox" className="mr-2 h-4 w-4 accent-sakura-500 rounded" /> Good Smile Company</label></li>
                <li><label className="flex cursor-pointer items-center hover:text-sakura-500"><input type="checkbox" className="mr-2 h-4 w-4 accent-sakura-500 rounded" /> Kotobukiya</label></li>
                <li><label className="flex cursor-pointer items-center hover:text-sakura-500"><input type="checkbox" className="mr-2 h-4 w-4 accent-sakura-500 rounded" /> Bandai Spirits</label></li>
              </ul>
            </div>
          </div>
        </aside>

        {/* LƯỚI SẢN PHẨM */}
        <main className="w-full lg:w-3/4">
          <div className="mb-4 rounded-xl bg-white p-4 shadow-sm border border-sakura-100 flex flex-col sm:flex-row justify-between items-center">
            <h1 className="text-xl font-bold uppercase text-gray-800">{displayName}</h1>
            <select className="rounded-md border border-gray-300 px-3 py-1.5 focus:border-sakura-500 focus:outline-none">
              <option>Mới nhất</option>
              <option>Giá tăng dần</option>
              <option>Giá giảm dần</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
            {fakeProducts.map((item) => (
              <div key={item} className="group relative flex flex-col rounded-xl border border-gray-100 bg-white p-3 transition hover:border-sakura-400 hover:shadow-lg">
                <div className="relative mb-3 aspect-square w-full overflow-hidden rounded-lg bg-gray-50">
                  <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-400">Ảnh SP {item}</div>
                </div>
                <h3 className="line-clamp-2 text-sm font-semibold text-gray-800 transition hover:text-sakura-500">
                  <Link href={`/product/${item}`}>Mô Hình {displayName} #{item}</Link>
                </h3>
                <div className="mt-auto pt-3">
                  <p className="text-lg font-bold text-sakura-500">550.000₫</p>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}