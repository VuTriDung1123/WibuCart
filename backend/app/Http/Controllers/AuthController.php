<?php

namespace App\Http\Controllers;

use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;

class AuthController extends Controller
{
    // 1. ĐĂNG KÝ
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'rank_id' => 'Dong',
            'total_points' => 0
        ]);

        // Sửa lỗi P1125: Dùng fromUser() thay vì login() sẽ trả về đúng string token
        $token = JWTAuth::fromUser($user);

        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'user' => $user
        ], 201);
    }

    // 2. ĐĂNG NHẬP
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (!$token = Auth::guard('api')->attempt($credentials)) {
            return response()->json(['error' => 'Tài khoản hoặc mật khẩu không chính xác!'], 401);
        }

        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            // Sửa lỗi P1013: Đọc thẳng từ file config thay vì dùng getPayload()
            'expires_in' => config('jwt.ttl') * 60,
            'user' => auth('api')->user()
        ]);
    }

    // 3. ĐĂNG NHẬP GOOGLE
    public function googleLogin(Request $request)
    {
        $idToken = $request->input('id_token');

        $response = Http::withoutVerifying()->get("https://oauth2.googleapis.com/tokeninfo?id_token={$idToken}");

        if ($response->failed()) {
            return response()->json(['error' => 'Xác thực Google Token thất bại!'], 401);
        }

        $googleUser = $response->json();
        $email = $googleUser['email'];
        $name = $googleUser['name'];

        $user = User::where('email', $email)->first();

        if (!$user) {
            $user = User::create([
                'name' => $name,
                'email' => $email,
                'password' => Hash::make(rand(100000, 999999)), 
                'rank_id' => 'Dong',
                'total_points' => 0
            ]);
        }

        // Sửa lỗi P1125: Dùng fromUser() thay vì login()
        $token = JWTAuth::fromUser($user);

        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'user' => $user
        ]);
    }
}