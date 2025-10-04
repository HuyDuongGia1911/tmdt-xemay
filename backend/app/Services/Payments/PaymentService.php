<?php

namespace App\Services\Payments;

use App\Models\Order;
use Illuminate\Http\Request;

interface PaymentService
{
    /** Tạo giao dịch và trả về mảng gồm pay_url và payment (Eloquent) */
    public function init(Order $order): array;

    /** Xử lý IPN/Webhook, trả về ['ok' => bool, 'message' => string] */
    public function handleIpn(Request $request): array;

    /** (tuỳ chọn) xử lý trang return, thường chỉ để show UI */
    public function parseReturn(Request $request): array;
}
