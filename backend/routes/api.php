<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\StoreController;
// ==========================================
// NHÓM 1: KHÔNG CẦN ĐĂNG NHẬP (PUBLIC)
// ==========================================
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/google-login', [AuthController::class, 'googleLogin']);
Route::get('/store/home-products', [StoreController::class, 'getHomeProducts']);
Route::get('/store/category/{slug}', [StoreController::class, 'getCategoryProducts']);
Route::get('/store/product/{id}', [StoreController::class, 'getProductDetail']);
Route::post('/store/contact', [StoreController::class, 'sendContact']);

// ==========================================
// NHÓM 2: DÀNH CHO ADMIN (PHẢI CÓ TOKEN JWT)
// ==========================================
Route::middleware('auth:api')->prefix('admin')->group(function () {
    Route::get('/dashboard', [AdminController::class, 'dashboard']);
    Route::get('/products', [AdminController::class, 'products']);
    Route::get('/orders', [AdminController::class, 'orders']);
    Route::get('/users', [AdminController::class, 'users']);
    Route::get('/create-metadata', [AdminController::class, 'getCreateMetadata']);
    Route::post('/products', [AdminController::class, 'storeProduct']);
    Route::post('/category', [AdminController::class, 'storeCategory']);
    Route::post('/series', [AdminController::class, 'storeSeries']);
    Route::post('/manufacturer', [AdminController::class, 'storeManufacturer']);
    Route::delete('/products/{id}', [AdminController::class, 'deleteProduct']); 
    Route::get('/products/{id}', [AdminController::class, 'getProductForEdit']);
    Route::put('/products/{id}', [AdminController::class, 'updateProduct']);
    Route::post('/products/import', [AdminController::class, 'importProducts']);
    Route::put('/orders/{id}/status', [AdminController::class, 'updateOrderStatus']);
    Route::get('/orders/{id}', [AdminController::class, 'getOrderDetail']);
    Route::post('/taxonomy/import/{type}', [AdminController::class, 'importTaxonomy']);
});

// ==========================================
// NHÓM 3: DÀNH CHO USER (PHẢI ĐĂNG NHẬP)
// ==========================================
Route::middleware('auth:api')->group(function () {
    Route::post('/profile/update', [AuthController::class, 'updateProfile']);
    Route::post('/profile/change-password', [AuthController::class, 'changePassword']);
    Route::get('/orders', [StoreController::class, 'getUserOrders']);
    Route::get('/profile/orders', [StoreController::class, 'getUserOrders']);
    Route::post('/store/checkout', [StoreController::class, 'placeOrder']);
    Route::put('/profile/orders/{id}/cancel', [StoreController::class, 'cancelOrder']);
});