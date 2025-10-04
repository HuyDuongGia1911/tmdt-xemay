<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Services\Payments\PaymentFactory;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    // Buyer khởi tạo thanh toán
    public function init(Request $request, Order $order)
    {
        $request->validate([
            'provider' => 'required|in:momo,vnpay',
        ]);

        // (tuỳ) kiểm tra quyền: chỉ owner của order được thanh toán
        if ($request->user()->id !== $order->buyer_id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        if ($order->payment_status === 'paid') {
            return response()->json(['message' => 'Order already paid'], 422);
        }

        $svc = PaymentFactory::make($request->input('provider'));
        $res = $svc->init($order);

        return response()->json([
            'pay_url' => $res['pay_url'],
            'payment_id' => $res['payment']->id,
            'tx_id' => $res['payment']->tx_id,
        ]);
    }

    // Momo IPN (JSON)
    public function momoIpn(Request $request)
    {
        $svc = PaymentFactory::make('momo');
        $res = $svc->handleIpn($request);

        return response()->json([
            'result' => $res['ok'] ? 0 : 1,
            'message' => $res['message'],
        ]);
    }

    // VNPAY IPN (query)
    public function vnpayIpn(Request $request)
    {
        $svc = PaymentFactory::make('vnpay');
        $res = $svc->handleIpn($request);

        // VNPAY yêu cầu text "OK" hoặc "Invalid"
        return response($res['ok'] ? 'OK' : 'Invalid', $res['ok'] ? 200 : 400);
    }

    // Return pages (chỉ để hiển thị trạng thái tạm, frontend đọc order từ API)
    public function momoReturn(Request $request)
    {
        $svc = PaymentFactory::make('momo');
        return response()->json($svc->parseReturn($request));
    }

    public function vnpayReturn(Request $request)
    {
        $svc = PaymentFactory::make('vnpay');
        return response()->json($svc->parseReturn($request));
    }
}
