<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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
}