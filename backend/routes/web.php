<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PaymentController;

Route::get('/', function () {
    return view('welcome');
});
Route::get('/payments/momo/return', [PaymentController::class, 'momoReturn']);
Route::get('/payments/vnpay/return', [PaymentController::class, 'vnpayReturn']);
