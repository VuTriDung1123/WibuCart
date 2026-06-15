<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;

// ==========================================
// NHÓM 1: KHÔNG CẦN ĐĂNG NHẬP (PUBLIC)
// ==========================================
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/google-login', [AuthController::class, 'googleLogin']);

// ==========================================
// NHÓM 2: DÀNH CHO ADMIN (PHẢI CÓ TOKEN JWT)
// ==========================================
Route::middleware('auth:api')->prefix('admin')->group(function () {
    Route::get('/dashboard', [AdminController::class, 'dashboard']);
    Route::get('/products', [AdminController::class, 'products']);
    Route::get('/orders', [AdminController::class, 'orders']);
    Route::get('/users', [AdminController::class, 'users']);
});