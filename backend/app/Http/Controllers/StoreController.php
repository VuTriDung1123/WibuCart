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
        $category = DB::table('categories')->where('slug', 'LIKE', $slug . '%')->first();
        
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

    // 3. Lấy chi tiết 1 sản phẩm để hiển thị
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
            'images' => count($images) > 0 ? $images : [] 
        ]);
    }

    // 4. LƯU ĐƠN HÀNG (ĐÃ ÉP KIỂU BẮT BUỘC CÓ USER_ID)
    public function placeOrder(Request $request)
    {
        $request->validate([
            'cart_items' => 'required|array',
            'customer_name' => 'required|string',
            'phone' => 'required|string',
            'address' => 'required|string',
            'payment_method' => 'required|string'
        ]);

        // ÉP BUỘC LẤY ID TỪ TOKEN (Nếu không có Token sẽ văng lỗi ngay lập tức)
        $userId = auth('api')->id();
        if (!$userId) {
            return response()->json(['error' => 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!'], 401);
        }

        DB::beginTransaction();
        try {
            $totalAmount = 0;
            foreach ($request->cart_items as $item) {
                $totalAmount += ($item['price'] * $item['quantity']);
            }
            
            $shippingFee = $totalAmount > 0 ? 30000 : 0;
            $finalAmount = $totalAmount + $shippingFee;

            // 1. Tạo Đơn hàng chính (Lưu cứng ID của khách)
            $orderId = DB::table('orders')->insertGetId([
                'order_code' => 'WIBU' . time() . rand(10, 99),
                'user_id' => $userId, // <-- ĐÃ KHÓA CHẶT TẠI ĐÂY
                'total_amount' => $totalAmount,
                'shipping_fee' => $shippingFee,
                'final_amount' => $finalAmount,
                'status' => 'pending', 
                'note' => $request->note . " | Giao tới: {$request->customer_name} - {$request->phone} - {$request->address}",
                'created_at' => now(),
                'updated_at' => now()
            ]);

            // 2. Tạo các món hàng trong Đơn
            foreach ($request->cart_items as $item) {
                $variant = DB::table('product_variants')->where('product_id', $item['id'])->first();
                if ($variant) {
                    DB::table('order_items')->insert([
                        'order_id' => $orderId,
                        'variant_id' => $variant->id,
                        'quantity' => $item['quantity'],
                        'price_at_purchase' => $item['price'],
                        'subtotal' => $item['price'] * $item['quantity'],
                        'created_at' => now(),
                        'updated_at' => now()
                    ]);

                    // Trừ kho
                    DB::table('product_variants')
                        ->where('id', $variant->id)
                        ->decrement('stock_quantity', $item['quantity']);
                }
            }

            // 3. Ghi nhận thanh toán
            DB::table('payments')->insert([
                'order_id' => $orderId,
                'payment_method' => $request->payment_method,
                'amount' => $finalAmount,
                'payment_type' => 'full',
                'status' => 'pending',
                'created_at' => now(),
                'updated_at' => now()
            ]);

            DB::commit();
            return response()->json([
                'message' => 'Đặt hàng thành công!', 
                'order_code' => 'WIBU' . time() . rand(10, 99)
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Lỗi xử lý đơn hàng: ' . $e->getMessage()], 500);
        }
    }

    // 5. LẤY LỊCH SỬ ĐƠN HÀNG CỦA USER ĐANG ĐĂNG NHẬP
    public function getUserOrders()
    {
        // Lấy đúng ID của người đang xem trang
        $userId = auth('api')->id();
        if (!$userId) return response()->json(['error' => 'Unauthorized'], 401);

        // Chỉ lôi ra những đơn có user_id trùng khớp
        $orders = DB::table('orders')
            ->where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->get();
            
        return response()->json($orders);
    }

    // 6. KHÁCH TỰ HỦY ĐƠN HÀNG
    public function cancelOrder($id)
    {
        $userId = auth('api')->id();
        $order = DB::table('orders')->where('id', $id)->where('user_id', $userId)->first();
        
        if (!$order) return response()->json(['error' => 'Không tìm thấy đơn hàng!'], 404);
        if ($order->status !== 'pending') return response()->json(['error' => 'Chỉ có thể hủy đơn đang chờ xác nhận!'], 400);

        DB::table('orders')->where('id', $id)->update([
            'status' => 'cancelled',
            'updated_at' => now()
        ]);
        return response()->json(['message' => 'Đã hủy đơn hàng thành công!']);
    }
}