<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Tạo tài khoản Admin WibuCart
        User::create([
            'name' => 'Admin Vũ Trí Dũng',
            'email' => 'admin@wibucart.com',
            'password' => Hash::make('123456'), // Hash password để bảo mật
            // Nếu trong CSDL bạn đã thêm cột 'role' hay 'rank_id', bạn thêm vào đây:
            // 'role' => 'admin',
        ]);
    }
}