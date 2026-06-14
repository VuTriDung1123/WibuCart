<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminController;

Route::middleware('auth:api')->prefix('admin')->group(function () {
    Route::get('/dashboard', [AdminController::class, 'dashboard']);
    Route::get('/products', [AdminController::class, 'products']);
    Route::get('/orders', [AdminController::class, 'orders']);
    Route::get('/users', [AdminController::class, 'users']);
});