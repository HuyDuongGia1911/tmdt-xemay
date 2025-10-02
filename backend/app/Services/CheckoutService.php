<?php

namespace App\Services;

use App\Models\Cart;
use App\Models\Inventory;
use App\Models\Motorcycle;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CheckoutService
{
    /**
     * Tạo đơn từ giỏ (có idempotency và giữ chỗ tồn kho).
     * - address: mảng địa chỉ
     * - paymentMethod: momo/vnpay/cod (tạm thời cho phần 8)
     * - idempotencyKey: lấy từ header 'Idempotency-Key'
     */
    public function checkout(Cart $cart, array $address, ?string $paymentMethod, ?string $idempotencyKey): Order
    {
        // Nếu có idempotency_key và đã có đơn pending cho user này với key đó → trả về luôn
        if ($idempotencyKey) {
            $existed = Order::where('buyer_id', $cart->user_id)
                ->where('idempotency_key', $idempotencyKey)
                ->first();
            if ($existed) {
                return $existed->load('items');
            }
        }

        $items = $cart->items()->with(['motorcycle.inventory'])->get();
        if ($items->isEmpty()) {
            abort(422, 'Giỏ hàng trống.');
        }

        return DB::transaction(function () use ($cart, $items, $address, $paymentMethod, $idempotencyKey) {

            // 1) LOCK inventory theo từng sản phẩm (FOR UPDATE)
            $motorcycleIds = $items->pluck('motorcycle_id')->all();

            $invRows = Inventory::whereIn('motorcycle_id', $motorcycleIds)
                ->lockForUpdate()
                ->get()
                ->keyBy('motorcycle_id');

            // 2) Kiểm tra lại tồn kho & tính tiền theo GIÁ HIỆN TẠI
            $total = 0;
            $orderItems = [];

            foreach ($items as $ci) {
                $mc = Motorcycle::with('inventory')->findOrFail($ci->motorcycle_id);

                if (isset($mc->status) && $mc->status !== 'active') {
                    abort(422, "Sản phẩm {$mc->name} hiện chưa mở bán.");
                }

                $inv = $invRows[$mc->id] ?? null;
                $stock = (int)($inv->stock ?? 0);
                $reserved = (int)($inv->reserved ?? 0);
                $available = max(0, $stock - $reserved);

                if ($ci->qty > $available) {
                    abort(422, "Sản phẩm {$mc->name} chỉ còn {$available} chiếc khả dụng.");
                }

                $price = (int)$mc->price;
                $subtotal = $price * (int)$ci->qty;
                $total += $subtotal;

                $orderItems[] = [
                    'motorcycle_id' => $mc->id,
                    'price' => $price,
                    'quantity' => (int)$ci->qty,
                    'subtotal' => $subtotal,
                ];
            }

            // 3) Tạo order
            $order = new Order();
            $order->buyer_id = $cart->user_id;
            $order->code = $this->generateOrderCode();
            $order->status = 'pending';
            $order->payment_status = 'pending'; // bạn đã set default như vậy
            $order->payment_method = $paymentMethod;
            $order->total_amount = $total;      // dùng cột hiện có
            $order->address_json = $address;    // cột vừa thêm
            $order->idempotency_key = $idempotencyKey;
            $order->save();

            // 4) Tạo order_items (snapshot giá lúc đặt)
            foreach ($orderItems as $oi) {
                OrderItem::create(array_merge($oi, ['order_id' => $order->id]));
            }

            // 5) Giữ chỗ tồn kho: tăng reserved
            foreach ($items as $ci) {
                $inv = $invRows[$ci->motorcycle_id];
                $inv->reserved = (int)$inv->reserved + (int)$ci->qty;
                $inv->save();
            }

            // 6) Xoá giỏ để tránh đặt lặp
            $cart->items()->delete();

            return $order->load('items');
        });
    }

    private function generateOrderCode(): string
    {
        // VD: ORD-20251001-8KX3ZC
        return 'ORD-' . now()->format('Ymd') . '-' . Str::upper(Str::random(6));
    }
}
