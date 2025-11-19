<?php

// use Illuminate\Support\Facades\Route;
// use App\Http\Controllers\AuthController;
// use App\Http\Controllers\CategoryController;
// use App\Http\Controllers\MotorcycleController;
// use App\Http\Controllers\MotorcycleImageController;
// use App\Http\Controllers\Api\MotorcycleCatalogController;
// use App\Http\Controllers\CartController;
// use App\Http\Controllers\OrderController;
// use App\Http\Controllers\PaymentController;
// use App\Http\Controllers\DashboardSellerController;
// use App\Http\Controllers\DashboardAdminController;
// // Public routes
// Route::post('/register', [AuthController::class, 'register']);
// Route::post('/login',    [AuthController::class, 'login']);
// Route::get('/categories', [CategoryController::class, 'index']);
// Route::get('/categories/{id}', [CategoryController::class, 'show']);
// // Catalog cho buyer
// Route::get('/motorcycles', [MotorcycleCatalogController::class, 'index']);
// Route::get('/motorcycles/featured', [MotorcycleCatalogController::class, 'featured']);
// Route::get('/motorcycles/{motorcycle:slug}', [MotorcycleController::class, 'show']); // chi tiết 1 xe
// //xem đơn hàng
// Route::middleware(['auth:sanctum', 'role:buyer'])->group(function () {
//     Route::get('/orders/{order}', [OrderController::class, 'show']);
// });

// // Health check (bạn đã có, để nguyên nếu khác)
// Route::get('/health', fn() => response()->json(['status' => 'ok']));

// // Protected routes (cần đăng nhập)
// Route::middleware('auth:sanctum')->group(function () {
//     Route::get('/me', [AuthController::class, 'me']);
//     Route::post('/logout', [AuthController::class, 'logout']);

//     // Ví dụ route chỉ cho ADMIN
//     Route::get('/admin/ping', function () {
//         return response()->json(['ok' => true, 'role' => 'admin-only']);
//     })->middleware('role:admin');

//     // Ví dụ route cho SELLER hoặc ADMIN
//     Route::get('/seller-or-admin/ping', function () {
//         return response()->json(['ok' => true, 'role' => 'seller-or-admin']);
//     })->middleware('role:seller,admin');

//     // Ví dụ route cho BUYER
//     Route::get('/buyer/ping', function () {
//         return response()->json(['ok' => true, 'role' => 'buyer']);
//     })->middleware('role:buyer');
// });
// // Chỉ admin được CRUD
// Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
//     Route::post('/categories', [CategoryController::class, 'store']);
//     Route::put('/categories/{id}', [CategoryController::class, 'update']);
//     Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);
// });
// // Seller/Admin được CRUD, với policy kiểm soát quyền trên từng bản ghi
// Route::middleware(['auth:sanctum', 'role:seller,admin'])->group(function () {
//     Route::post('/motorcycles', [MotorcycleController::class, 'store']);
//     Route::put('/motorcycles/{motorcycle}', [MotorcycleController::class, 'update']);
//     Route::delete('/motorcycles/{motorcycle}', [MotorcycleController::class, 'destroy']);

//     // Upload/xóa ảnh
//     Route::post('/motorcycles/{id}/images', [MotorcycleImageController::class, 'store']);
//     Route::delete('/motorcycles/{id}/images/{imageId}', [MotorcycleImageController::class, 'destroy']);
// });
// //cart va checkout cho buyer
// Route::middleware(['auth:sanctum', 'role:buyer'])->group(function () {
//     Route::get('/cart', [CartController::class, 'show']);
//     Route::post('/cart/items', [CartController::class, 'addItem']);
//     Route::patch('/cart/items/{id}', [CartController::class, 'updateItem']);
//     Route::delete('/cart/items/{id}', [CartController::class, 'removeItem']);
//     Route::post('/orders/checkout', [OrderController::class, 'checkout']);
//     // Buyer chọn cổng và khởi tạo thanh toán
//     Route::post('/payments/{order}/init', [PaymentController::class, 'init']);
// });
// // IPN/Webhook: không yêu cầu auth, nhưng nên throttle
// Route::middleware('throttle:60,1')->group(function () {
//     Route::post('/payments/momo/ipn', [PaymentController::class, 'momoIpn']);
//     Route::match(['get', 'post'], '/payments/vnpay/ipn', [PaymentController::class, 'vnpayIpn']);
// });
// //dashboard cho admin và seller

// Route::middleware(['auth:sanctum'])->group(function () {
//     // SELLER
//     Route::prefix('dashboard/seller')->middleware('role:seller,admin')->group(function () {
//         Route::get('/overview', [DashboardSellerController::class, 'overview']);
//         Route::get('/orders',   [DashboardSellerController::class, 'orders']);
//         Route::get('/motorcycles', [DashboardSellerController::class, 'motorcycles']);
//         Route::patch('/motorcycles/{id}', [DashboardSellerController::class, 'updateMotorcycle']);
//     });

//     // ADMIN
//     Route::prefix('dashboard/admin')->middleware('role:admin')->group(function () {
//         Route::get('/overview', [DashboardAdminController::class, 'overview']);
//         Route::get('/orders',   [DashboardAdminController::class, 'orders']);
//         Route::get('/users',    [DashboardAdminController::class, 'users']);
//         Route::get('/payments', [DashboardAdminController::class, 'payments']);
//     });
// });



use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\MotorcycleController;
use App\Http\Controllers\MotorcycleImageController;
use App\Http\Controllers\Api\MotorcycleCatalogController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\DashboardSellerController;
use App\Http\Controllers\DashboardAdminController;
use App\Http\Controllers\ReviewController;
// ============ Public routes ============

// ✅ Throttle nhóm auth: login/register
Route::middleware('throttle:auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login',    [AuthController::class, 'login']);
});

// ✅ Categories vẫn public, không throttle riêng
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{id}', [CategoryController::class, 'show']);

// ✅ Throttle nhóm catalog: danh sách & featured motorcycles
Route::middleware('throttle:catalog')->group(function () {
    Route::get('/motorcycles', [MotorcycleCatalogController::class, 'index']);
    Route::get('/motorcycles/featured', [MotorcycleCatalogController::class, 'featured']);
});

// ✅ Chi tiết 1 xe (giữ public, vì ít tốn tài nguyên)
Route::get('/motorcycles/{motorcycle:slug}', [MotorcycleController::class, 'show']);

// ============ Buyer: xem đơn hàng ============

Route::middleware(['auth:sanctum', 'role:buyer'])->group(function () {
    Route::get('/orders/{order}', [OrderController::class, 'show']);
});

// Health check
Route::get('/health', fn() => response()->json(['status' => 'ok']));

// ============ Protected routes (đăng nhập) ============

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Ví dụ test phân quyền
    Route::get('/admin/ping', fn() => response()->json(['ok' => true, 'role' => 'admin-only']))->middleware('role:admin');
    Route::get('/seller-or-admin/ping', fn() => response()->json(['ok' => true, 'role' => 'seller-or-admin']))->middleware('role:seller,admin');
    Route::get('/buyer/ping', fn() => response()->json(['ok' => true, 'role' => 'buyer']))->middleware('role:buyer');
});

// ============ Category CRUD (admin) ============
Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::put('/categories/{id}', [CategoryController::class, 'update']);
    Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);
});

// ============ Motorcycle CRUD (seller/admin) ============
Route::middleware(['auth:sanctum', 'role:seller,admin'])->group(function () {
    Route::post('/motorcycles', [MotorcycleController::class, 'store']);
    Route::put('/motorcycles/{motorcycle}', [MotorcycleController::class, 'update']);
    Route::delete('/motorcycles/{motorcycle}', [MotorcycleController::class, 'destroy']);

    // Upload/xóa ảnh
    Route::post('/motorcycles/{id}/images', [MotorcycleImageController::class, 'store']);
    Route::delete('/motorcycles/{id}/images/{imageId}', [MotorcycleImageController::class, 'destroy']);
});

// ============ Cart + Checkout (buyer) ============
Route::middleware(['auth:sanctum', 'role:buyer'])->group(function () {
    Route::get('/cart', [CartController::class, 'show']);
    Route::post('/cart/items', [CartController::class, 'addItem']);
    Route::patch('/cart/items/{id}', [CartController::class, 'updateItem']);
    Route::delete('/cart/items/{id}', [CartController::class, 'removeItem']);
    Route::post('/orders/checkout', [OrderController::class, 'checkout']);
    // 🔥 Buyer gửi đánh giá
    Route::post('/motorcycles/{motorcycle}/reviews', [ReviewController::class, 'store']);
    // ✅ throttle riêng cho payments.init
    Route::middleware('throttle:payments')->group(function () {
        Route::post('/payments/{order}/init', [PaymentController::class, 'init']);
    });
});

// ============ IPN / Webhook ============
// (MoMo IPN có throttle riêng; VNPAY dùng chung tạm)
Route::middleware('throttle:ipn')->group(function () {
    Route::post('/payments/momo/ipn', [PaymentController::class, 'momoIpn']);
    Route::match(['get', 'post'], '/payments/vnpay/ipn', [PaymentController::class, 'vnpayIpn']);
});

// ============ Dashboards ============
Route::middleware(['auth:sanctum'])->group(function () {
    // SELLER
    Route::prefix('dashboard/seller')->middleware('role:seller,admin')->group(function () {
        Route::get('/overview', [DashboardSellerController::class, 'overview']);
        Route::get('/orders',   [DashboardSellerController::class, 'orders']);
        Route::get('/motorcycles', [DashboardSellerController::class, 'motorcycles']);
        Route::patch('/motorcycles/{id}', [DashboardSellerController::class, 'updateMotorcycle']);
    });

    // ADMIN
    Route::prefix('dashboard/admin')->middleware('role:admin')->group(function () {
        Route::get('/overview', [DashboardAdminController::class, 'overview']);
        Route::get('/orders',   [DashboardAdminController::class, 'orders']);
        Route::get('/users',    [DashboardAdminController::class, 'users']);
        Route::get('/payments', [DashboardAdminController::class, 'payments']);
    });
});
