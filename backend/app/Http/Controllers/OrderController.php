<?php

namespace App\Http\Controllers;

use App\Http\Requests\CheckoutRequest;
use App\Services\CartService;
use App\Services\CheckoutService;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function __construct(
        private CartService $cartService,
        private CheckoutService $checkoutService
    ) {}

    // POST /api/orders/checkout
    public function checkout(CheckoutRequest $request)
    {
        $idempotencyKey = $request->header('Idempotency-Key'); // có thể null
        $cart = $this->cartService->getOrCreateCartForUser($request->user()->id);

        $order = $this->checkoutService->checkout(
            $cart,
            $request->input('address'),
            $request->input('payment_method'),
            $idempotencyKey
        );

        return response()->json([
            'message' => 'Đã tạo đơn hàng (pending) và giữ chỗ tồn kho.',
            'order' => [
                'id' => $order->id,
                'code' => $order->code,
                'status' => $order->status,
                'payment_status' => $order->payment_status,
                'total_amount' => (int)$order->total_amount,
                'items' => $order->items->map(fn($i) => [
                    'motorcycle_id' => $i->motorcycle_id,
                    'price' => (int)$i->price,
                    'quantity' => (int)$i->quantity,
                    'subtotal' => (int)$i->subtotal,
                ]),
            ],
        ], 201);
    }
}
