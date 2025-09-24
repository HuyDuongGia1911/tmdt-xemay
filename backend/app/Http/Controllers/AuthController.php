<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class AuthController extends Controller
{
    /**
     * Đăng ký tài khoản.
     * Body JSON bắt buộc: name, email, password, password_confirmation
     * Tuỳ chọn: role (buyer/seller/admin) — KHÔNG khuyến nghị cho public. Dưới đây mình sẽ chặn set admin ở đây.
     */
    public function register(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'confirmed', Password::min(6)],
            'role' => ['nullable', 'in:buyer,seller,admin'],
        ]);

        // Không cho tự đăng ký admin từ public API
        $role = $data['role'] ?? 'buyer';
        if ($role === 'admin') {
            $role = 'buyer';
        }

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'role' => $role,
        ]);

        return response()->json([
            'message' => 'Registered successfully',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
            ],
        ], 201);
    }

    /**
     * Đăng nhập nhận token (Sanctum Personal Access Token).
     * Body JSON: email, password
     * Trả về: token chuỗi Bearer
     */
    public function login(Request $request)
    {
        $data = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('email', $data['email'])->first();

        if (!$user || !Hash::check($data['password'], $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 422);
        }

        // Bạn có thể gắn abilities theo role nếu muốn granular (vd: ['orders:read'])
        $token = $user->createToken('spa-token')->plainTextToken;

        return response()->json([
            'message' => 'Logged in',
            'token' => $token,
            'token_type' => 'Bearer',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
            ],
        ]);
    }

    /**
     * Thông tin user hiện tại (cần Authorization Bearer token).
     */
    public function me(Request $request)
    {
        return response()->json([
            'user' => $request->user(),
        ]);
    }

    /**
     * Đăng xuất: thu hồi token hiện tại.
     */
    public function logout(Request $request)
    {
        $user = $request->user();
        // Xoá token hiện tại (token trong request)
        $user->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out']);
    }
}
