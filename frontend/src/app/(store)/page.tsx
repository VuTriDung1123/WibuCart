import Link from 'next/link';

export default function HomePage() {
  // Tạm thời tạo mảng dữ liệu ảo để test giao diện lưới (Grid)
  const fakeProducts = [1, 2, 3, 4, 5, 6];

  return (
    <div className="container mx-auto px-4">
      {/* Khung chứa Banner chính */}
      <section className="mb-8 overflow-hidden rounded-2xl bg-white shadow-sm h-[300px] flex items-center justify-center border-2 border-sakura-200">
         <span className="text-sakura-400 font-bold text-xl">Banner Sự kiện (Ảnh GIF/Slider sẽ nằm ở đây)</span>
      </section>

      {/* Khu vực Sản phẩm nổi bật */}
      <section className="rounded-xl bg-white p-6 shadow-sm">
        <div className="mb-6 border-b border-sakura-100 pb-2">
          <h2 className="text-2xl font-bold uppercase text-gray-800">
            <span className="border-b-4 border-sakura-500 pb-2">Anime Hot Bán Chạy</span>
          </h2>
        </div>

        {/* Lưới sản phẩm (Grid) */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {fakeProducts.map((item) => (
            <div key={item} className="group flex flex-col rounded-lg border border-gray-100 p-3 transition-shadow hover:shadow-md">
              <div className="relative mb-3 aspect-square w-full overflow-hidden rounded-md bg-gray-100">
                {/* Khu vực chứa ảnh figure */}
                <div className="absolute inset-0 flex items-center justify-center text-gray-400 transition-transform duration-300 group-hover:scale-110">
                  Ảnh Figure {item}
                </div>
              </div>
              <h3 className="line-clamp-2 text-sm font-semibold text-gray-800 hover:text-sakura-500">
                <Link href={`/product/${item}`}>
                  Mô Hình Hatsune Miku - Sakura Dress Ver. (Taito)
                </Link>
              </h3>
              <p className="mt-auto pt-2 text-base font-bold text-sakura-500">550.000₫</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}