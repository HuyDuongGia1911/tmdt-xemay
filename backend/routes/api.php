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
use App\Http\Controllers\SellerSetupController;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\ColorController;

// ================= PUBLIC =================

// auth (login/register) - throttle group
Route::middleware('throttle:auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login',    [AuthController::class, 'login']);
});

// categories
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{id}', [CategoryController::class, 'show']);

// catalog
Route::middleware('throttle:catalog')->group(function () {
    Route::get('/motorcycles', [MotorcycleCatalogController::class, 'index']);
    Route::get('/motorcycles/featured', [MotorcycleCatalogController::class, 'featured']);
});

// motorcycle detail
Route::get('/motorcycles/{motorcycle:slug}', [MotorcycleController::class, 'show']);

// health
Route::get('/health', fn() => ['status' => 'ok']);


// ================= AUTHENTICATED =================

Route::middleware('auth:sanctum')->group(function () {

    // me, logout
    Route::get('/me',    [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // ========= SELLER SETUP (rất quan trọng) =========
    // ❗ User đăng nhập nhưng chưa có seller vẫn được quyền truy cập route này
    Route::post('/seller/setup', [SellerSetupController::class, 'store']);
    // SELLER: xem / sửa thông tin cửa hàng (yêu cầu đã có seller)
    Route::middleware('mustHaveSeller')->group(function () {
        Route::get('/seller/profile', [SellerSetupController::class, 'show']);
        Route::put('/seller/profile', [SellerSetupController::class, 'update']);
        Route::post('/seller/profile/logo-upload', [SellerSetupController::class, 'uploadLogo']);
        Route::post('/seller/profile/logo-url', [SellerSetupController::class, 'setLogoUrl']);
        Route::delete('/seller/profile/logo', [SellerSetupController::class, 'deleteLogo']);
    });
    // ========= BUYER =========
    Route::middleware('role:buyer')->group(function () {
        Route::get('/orders/{order}', [OrderController::class, 'show']);

        // cart + checkout
        Route::get('/cart', [CartController::class, 'show']);
        Route::post('/cart/items', [CartController::class, 'addItem']);
        Route::patch('/cart/items/{id}', [CartController::class, 'updateItem']);
        Route::delete('/cart/items/{id}', [CartController::class, 'removeItem']);
        Route::post('/orders/checkout', [OrderController::class, 'checkout']);

        // reviews
        Route::post('/motorcycles/{motorcycle}/reviews', [ReviewController::class, 'store']);

        // payments.init (throttle payments)
        Route::middleware('throttle:payments')->post('/payments/{order}/init', [PaymentController::class, 'init']);
    });


    Route::middleware('role:admin')->group(function () {
        // ========= CATEGORY CRUD (ADMIN) =========
        Route::post('/categories', [CategoryController::class, 'store']);
        Route::put('/categories/{id}', [CategoryController::class, 'update']);
        Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);
        // ===== Brand CRUD =====
        Route::get('/admin/brands/{id}', [BrandController::class, 'show']);
        Route::post('/admin/brands', [BrandController::class, 'store']);
        Route::put('/admin/brands/{id}', [BrandController::class, 'update']);
        Route::delete('/admin/brands/{id}', [BrandController::class, 'destroy']);

        Route::post('/admin/brands/{id}/logo-upload', [BrandController::class, 'uploadLogo']);
        Route::post('/admin/brands/{id}/logo-url', [BrandController::class, 'setLogoUrl']);

        // ===== Category upload icon =====
        Route::post('/admin/categories/{id}/icon-upload', [CategoryController::class, 'uploadIcon']);
        Route::post('/admin/categories/{id}/icon-url', [CategoryController::class, 'setIconUrl']);
    });

    // ========= MOTORCYCLE CRUD (seller/admin) =========
    Route::middleware(['role:seller,admin'])->group(function () {

        Route::post('/motorcycles', [MotorcycleController::class, 'store']);
        Route::put('/motorcycles/{motorcycle}', [MotorcycleController::class, 'update']);
        Route::delete('/motorcycles/{motorcycle}', [MotorcycleController::class, 'destroy']);

        // images
        Route::get('/motorcycles/{id}/images', [MotorcycleImageController::class, 'index']);
        Route::post('/motorcycles/{id}/images', [MotorcycleImageController::class, 'store']);
        Route::post('/motorcycles/{id}/images/link', [MotorcycleImageController::class, 'storeFromLink']);
        Route::patch('/motorcycles/{id}/images/{imageId}/thumbnail', [MotorcycleImageController::class, 'setThumbnail']);
        Route::delete('/motorcycles/{id}/images/{imageId}', [MotorcycleImageController::class, 'destroy']);
        // tạo màu mới
        Route::post('/colors', [ColorController::class, 'store']);
    });

    // ========= DASHBOARD SELLER (must have seller) =========
    Route::middleware(['mustHaveSeller'])->prefix('dashboard/seller')->group(function () {
        Route::get('/overview', [DashboardSellerController::class, 'overview']);
        Route::get('/orders',   [DashboardSellerController::class, 'orders']);

        Route::get('/motorcycles', [DashboardSellerController::class, 'motorcycles']);
        Route::get('/motorcycles/{id}', [DashboardSellerController::class, 'showMotorcycle']);
        Route::patch('/motorcycles/{id}', [DashboardSellerController::class, 'updateMotorcycle']);
        Route::delete('/motorcycles/{id}', [DashboardSellerController::class, 'destroyMotorcycle']);
    });

    // ========= DASHBOARD ADMIN =========
    Route::prefix('dashboard/admin')->middleware('role:admin')->group(function () {
        Route::get('/overview', [DashboardAdminController::class, 'overview']);
        Route::get('/orders',   [DashboardAdminController::class, 'orders']);
        Route::get('/users',    [DashboardAdminController::class, 'users']);
        Route::get('/payments', [DashboardAdminController::class, 'payments']);
    });
});

Route::get('/brands', [BrandController::class, 'index']);
Route::get('/colors', [ColorController::class, 'index']);
// ================= IPN =================

Route::middleware('throttle:ipn')->group(function () {
    Route::post('/payments/momo/ipn', [PaymentController::class, 'momoIpn']);
    Route::match(['get', 'post'], '/payments/vnpay/ipn', [PaymentController::class, 'vnpayIpn']);
});
