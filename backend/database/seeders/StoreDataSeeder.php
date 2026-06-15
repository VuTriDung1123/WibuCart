<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class StoreDataSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Tạo Danh Mục
        $categoryId = DB::table('categories')->insertGetId([
            'name' => 'Mô Hình Scale',
            'slug' => 'mo-hinh-scale',
        ]);

        // 2. Tạo Hãng & Series
        $brandId = DB::table('manufacturers')->insertGetId(['name' => 'Good Smile Company', 'country' => 'Japan']);
        $seriesId = DB::table('series')->insertGetId(['name' => 'Hatsune Miku', 'slug' => 'hatsune-miku']);

        // 3. Tạo Sản phẩm
        $productId = DB::table('products')->insertGetId([
            'name' => 'Mô Hình Hatsune Miku: Sakura Dress Ver.',
            'slug' => 'hatsune-miku-sakura-dress',
            'description' => 'Mô hình tỷ lệ 1/7 tuyệt đẹp của Hatsune Miku trong bộ váy hoa anh đào lộng lẫy. Thiết kế tinh xảo, màu sắc tươi sáng chuẩn phong cách Kawaii.',
            'category_id' => $categoryId,
            'series_id' => $seriesId,
            'manufacturer_id' => $brandId,
            'is_preorder' => false,
            'base_price' => 3500000,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // 4. THÊM ẢNH CHO SẢN PHẨM (Dùng link ảnh placeholder có màu Sakura để test)
        DB::table('product_images')->insert([
            ['product_id' => $productId, 'image_url' => 'https://placehold.co/600x600/fbcfe8/ec4899?text=Miku+Main', 'is_cover' => true],
            ['product_id' => $productId, 'image_url' => 'https://placehold.co/600x600/fbcfe8/ec4899?text=Miku+Angle+1', 'is_cover' => false],
            ['product_id' => $productId, 'image_url' => 'https://placehold.co/600x600/fbcfe8/ec4899?text=Miku+Angle+2', 'is_cover' => false],
        ]);

        // 5. THÊM BANNERS DYNAMIC
        DB::table('banners')->insert([
            'title' => 'Sự kiện Lễ hội Hoa Anh Đào',
            'image_url' => 'https://placehold.co/1200x400/f472b6/ffffff?text=Lễ+Hội+Hoa+Anh+Đào+-+Giảm+Giá+20%25',
            'target_url' => '/category/figures',
            'is_active' => true,
        ]);
    }
}