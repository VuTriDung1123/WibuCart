<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StoreController extends Controller
{
    // 1. Lấy 6 sản phẩm mới nhất cho Trang Chủ
    public function getHomeProducts()
    {
        $products = DB::table('products')
            ->leftJoin('product_images', function($join) {
                $join->on('products.id', '=', 'product_images.product_id')
                     ->where('product_images.is_cover', '=', 1);
            })
            ->select('products.id', 'products.name', 'products.slug', 'products.base_price', 'product_images.image_url')
            ->orderBy('products.created_at', 'desc')
            ->limit(6)
            ->get();
            
        return response()->json($products);
    }

    // 2. Lấy sản phẩm theo Danh mục (cho trang Bộ lọc)
    public function getCategoryProducts($slug)
    {
        $category = DB::table('categories')->where('slug', $slug)->first();
        
        // Nếu gõ bậy slug hoặc chưa có category, lấy tạm tất cả
        if (!$category) {
            $products = DB::table('products')
                ->leftJoin('product_images', function($join) {
                    $join->on('products.id', '=', 'product_images.product_id')
                         ->where('product_images.is_cover', '=', 1);
                })
                ->select('products.id', 'products.name', 'products.slug', 'products.base_price', 'product_images.image_url')
                ->orderBy('products.created_at', 'desc')
                ->get();
            return response()->json(['category_name' => 'Tất cả sản phẩm', 'products' => $products]);
        }

        $products = DB::table('products')
            ->where('category_id', $category->id)
            ->leftJoin('product_images', function($join) {
                $join->on('products.id', '=', 'product_images.product_id')
                     ->where('product_images.is_cover', '=', 1);
            })
            ->select('products.id', 'products.name', 'products.slug', 'products.base_price', 'product_images.image_url')
            ->orderBy('products.created_at', 'desc')
            ->get();

        return response()->json([
            'category_name' => $category->name,
            'products' => $products
        ]);
    }

    // Lấy chi tiết 1 sản phẩm để hiển thị
    public function getProductDetail($id)
    {
        $product = DB::table('products')
            ->leftJoin('manufacturers', 'products.manufacturer_id', '=', 'manufacturers.id')
            ->leftJoin('series', 'products.series_id', '=', 'series.id')
            ->select('products.*', 'manufacturers.name as brand_name', 'series.name as series_name')
            ->where('products.id', $id)
            ->first();

        if (!$product) return response()->json(['error' => 'Không tìm thấy sản phẩm'], 404);

        $variant = DB::table('product_variants')->where('product_id', $id)->first();
        $images = DB::table('product_images')->where('product_id', $id)->pluck('image_url')->toArray();

        return response()->json([
            'product' => $product,
            'stock_quantity' => $variant ? $variant->stock_quantity : 0,
            // Nếu không có ảnh, trả về 1 mảng rỗng để FE tự thay ảnh mặc định
            'images' => count($images) > 0 ? $images : [] 
        ]);
    }
}