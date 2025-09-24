<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

// Health check (bạn đã có, để nguyên nếu khác)
Route::get('/health', fn() => response()->json(['status' => 'ok']));

// Protected routes (cần đăng nhập)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Ví dụ route chỉ cho ADMIN
    Route::get('/admin/ping', function () {
        return response()->json(['ok' => true, 'role' => 'admin-only']);
    })->middleware('role:admin');

    // Ví dụ route cho SELLER hoặc ADMIN
    Route::get('/seller-or-admin/ping', function () {
        return response()->json(['ok' => true, 'role' => 'seller-or-admin']);
    })->middleware('role:seller,admin');

    // Ví dụ route cho BUYER
    Route::get('/buyer/ping', function () {
        return response()->json(['ok' => true, 'role' => 'buyer']);
    })->middleware('role:buyer');
});
