<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\MotorcycleController;
use App\Http\Controllers\MotorcycleImageController;
// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{id}', [CategoryController::class, 'show']);
Route::get('/motorcycles', [MotorcycleController::class, 'index']);
Route::get('/motorcycles/{motorcycle:slug}', [MotorcycleController::class, 'show']);
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
// Chỉ admin được CRUD
Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::put('/categories/{id}', [CategoryController::class, 'update']);
    Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);
});
// Seller/Admin được CRUD, với policy kiểm soát quyền trên từng bản ghi
Route::middleware(['auth:sanctum', 'role:seller,admin'])->group(function () {
    Route::post('/motorcycles', [MotorcycleController::class, 'store']);
    Route::put('/motorcycles/{motorcycle}', [MotorcycleController::class, 'update']);
    Route::delete('/motorcycles/{motorcycle}', [MotorcycleController::class, 'destroy']);

    // Upload/xóa ảnh
    Route::post('/motorcycles/{id}/images', [MotorcycleImageController::class, 'store']);
    Route::delete('/motorcycles/{id}/images/{imageId}', [MotorcycleImageController::class, 'destroy']);
});
