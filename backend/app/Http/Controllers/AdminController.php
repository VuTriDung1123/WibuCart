<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class AdminController extends Controller
{
    // 1. Dữ liệu Tổng quan Dashboard
    public function dashboard()
    {
        $totalRevenue = DB::table('orders')->where('status', 'completed')->sum('final_amount');
        $newOrders = DB::table('orders')->where('status', 'pending')->count();
        $totalUsers = DB::table('users')->count();
        
        return response()->json([
            'total_revenue' => $totalRevenue,
            'new_orders' => $newOrders,
            'total_users' => $totalUsers,
            'low_stock' => 0 // Tạm để 0
        ]);
    }

    // 2. Danh sách Sản phẩm
    public function products()
    {
        $products = DB::table('products')->orderBy('id', 'desc')->get();
        return response()->json($products);
    }

    // 3. Danh sách Đơn hàng
    public function orders()
    {
        $orders = DB::table('orders')->orderBy('id', 'desc')->get();
        return response()->json($orders);
    }

    // 4. Danh sách Khách hàng
    public function users()
    {
        $users = DB::table('users')->orderBy('id', 'desc')->get();
        return response()->json($users);
    }

    // 5. Lấy Dữ liệu Danh mục, Hãng, Series để hiển thị ra thẻ <select>
    public function getCreateMetadata()
    {
        $categories = DB::table('categories')->get();
        $series = DB::table('series')->get();
        $manufacturers = DB::table('manufacturers')->get();
        
        return response()->json(compact('categories', 'series', 'manufacturers'));
    }

    // 6. Lưu Sản Phẩm Mới (Bọc Transaction chống lỗi nửa vời)
    public function storeProduct(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'base_price' => 'required|numeric',
            'category_id' => 'required|integer',
            'series_id' => 'required|integer',
            'manufacturer_id' => 'required|integer',
            'stock_quantity' => 'required|integer',
            'image_urls' => 'nullable|array',
        ]);

        DB::beginTransaction(); // Bắt đầu giao dịch an toàn

        try {
            $product_id = DB::table('products')->insertGetId([
                'name' => $request->name,
                'slug' => Str::slug($request->name) . '-' . time(),
                'description' => $request->description,
                'category_id' => $request->category_id,
                'series_id' => $request->series_id,
                'manufacturer_id' => $request->manufacturer_id,
                'is_preorder' => $request->is_preorder ? 1 : 0,
                'base_price' => $request->base_price,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            DB::table('product_variants')->insert([
                'product_id' => $product_id,
                'sku_code' => 'SKU-' . $product_id . '-' . time(),
                'price' => $request->base_price,
                'stock_quantity' => $request->stock_quantity,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            if ($request->has('image_urls') && is_array($request->image_urls)) {
                foreach ($request->image_urls as $index => $url) {
                    if (!empty($url)) {
                        DB::table('product_images')->insert([
                            'product_id' => $product_id,
                            'image_url' => $url,
                            'is_cover' => $index === 0 ? 1 : 0,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]);
                    }
                }
            }

            DB::commit(); // Xác nhận lưu vĩnh viễn
            return response()->json(['message' => 'Đã thêm sản phẩm thành công!']);

        } catch (\Exception $e) {
            DB::rollBack(); // Lỗi thì hủy toàn bộ, không lưu rác
            return response()->json(['error' => 'Lỗi hệ thống: ' . $e->getMessage()], 500);
        }
    }

    // 7. Xóa Sản phẩm
    public function deleteProduct($id)
    {
        // Vì trong Migration đã setup onDelete('cascade'), xóa Product sẽ tự động xóa luôn Ảnh và Variant
        $deleted = DB::table('products')->where('id', $id)->delete();
        
        if ($deleted) {
            return response()->json(['message' => 'Đã xóa sản phẩm thành công!']);
        }
        return response()->json(['error' => 'Không tìm thấy sản phẩm!'], 404);
    }

    // THÊM MỚI: API tạo Thuộc tính
    public function storeCategory(Request $request) {
        $request->validate(['name' => 'required|string']);
        DB::table('categories')->insert(['name' => $request->name, 'slug' => Str::slug($request->name), 'created_at' => now(), 'updated_at' => now()]);
        return response()->json(['message' => 'Thêm danh mục thành công']);
    }

    public function storeSeries(Request $request) {
        $request->validate(['name' => 'required|string']);
        DB::table('series')->insert(['name' => $request->name, 'slug' => Str::slug($request->name), 'created_at' => now(), 'updated_at' => now()]);
        return response()->json(['message' => 'Thêm series thành công']);
    }

    public function storeManufacturer(Request $request) {
        $request->validate(['name' => 'required|string']);
        DB::table('manufacturers')->insert(['name' => $request->name, 'created_at' => now(), 'updated_at' => now()]);
        return response()->json(['message' => 'Thêm thương hiệu thành công']);
    }

    // Lấy data sản phẩm cũ đổ vào Form Edit
    public function getProductForEdit($id)
    {
        $product = DB::table('products')->where('id', $id)->first();
        if (!$product) return response()->json(['error' => 'Not found'], 404);

        $variant = DB::table('product_variants')->where('product_id', $id)->first();
        $images = DB::table('product_images')->where('product_id', $id)->pluck('image_url')->toArray();

        return response()->json([
            'product' => $product,
            'stock_quantity' => $variant ? $variant->stock_quantity : 0,
            'image_urls' => count($images) > 0 ? $images : ['']
        ]);
    }

    // Lưu cập nhật Sản phẩm
    public function updateProduct(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'base_price' => 'required|numeric',
        ]);

        DB::beginTransaction();
        try {
            DB::table('products')->where('id', $id)->update([
                'name' => $request->name,
                'description' => $request->description,
                'category_id' => $request->category_id,
                'series_id' => $request->series_id,
                'manufacturer_id' => $request->manufacturer_id,
                'is_preorder' => $request->is_preorder ? 1 : 0,
                'base_price' => $request->base_price,
                'updated_at' => now(),
            ]);

            DB::table('product_variants')->where('product_id', $id)->update([
                'price' => $request->base_price,
                'stock_quantity' => $request->stock_quantity,
                'updated_at' => now(),
            ]);

            // Cập nhật ảnh: Xóa ảnh cũ, insert ảnh mới cho gọn
            DB::table('product_images')->where('product_id', $id)->delete();
            if ($request->has('image_urls') && is_array($request->image_urls)) {
                foreach ($request->image_urls as $index => $url) {
                    if (!empty($url)) {
                        DB::table('product_images')->insert([
                            'product_id' => $id,
                            'image_url' => $url,
                            'is_cover' => $index === 0 ? 1 : 0,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]);
                    }
                }
            }
            DB::commit();
            return response()->json(['message' => 'Cập nhật thành công!']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Lỗi cập nhật'], 500);
        }
    }
}