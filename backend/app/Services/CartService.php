<?php

namespace App\Services;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Motorcycle;

class CartService
{
    public function getOrCreateCartForUser(int $userId): Cart
    {
        return Cart::firstOrCreate(['user_id' => $userId]);
    }

    public function addItem(Cart $cart, int $motorcycleId, int $qty, ?array $variant = null): CartItem
    {
        $mc = Motorcycle::with('inventory')->findOrFail($motorcycleId);

        // Chỉ cho mua xe đang active (tuỳ hệ thống của bạn: 'active'/'published')
        if (isset($mc->status) && $mc->status !== 'active') {
            abort(422, 'Sản phẩm hiện chưa mở bán.');
        }

        $stock = (int)($mc->inventory->stock ?? 0);
        $reserved = (int)($mc->inventory->reserved ?? 0);
        $available = max(0, $stock - $reserved);

        if ($qty < 1 || $qty > $available) {
            abort(422, "Số lượng vượt quá tồn kho khả dụng ($available).");
        }

        $item = CartItem::firstOrNew([
            'cart_id' => $cart->id,
            'motorcycle_id' => $motorcycleId,
        ]);

        $item->qty = ($item->exists ? $item->qty : 0) + $qty;
        if ($item->qty > $available) {
            abort(422, "Số lượng vượt quá tồn kho khả dụng ($available).");
        }

        $item->unit_price = (int)$mc->price;   // snapshot để hiển thị giỏ
        $item->variant_json = $variant;
        $item->save();

        return $item;
    }

    public function updateItemQty(Cart $cart, int $itemId, int $qty): CartItem
    {
        $item = $cart->items()->where('id', $itemId)->firstOrFail();
        $mc = Motorcycle::with('inventory')->findOrFail($item->motorcycle_id);

        $stock = (int)($mc->inventory->stock ?? 0);
        $reserved = (int)($mc->inventory->reserved ?? 0);
        $available = max(0, $stock - $reserved);

        if ($qty < 1 || $qty > $available) {
            abort(422, "Số lượng vượt quá tồn kho khả dụng ($available).");
        }

        $item->qty = $qty;
        $item->unit_price = (int)$mc->price; // refresh snapshot
        $item->save();

        return $item;
    }

    public function removeItem(Cart $cart, int $itemId): void
    {
        $cart->items()->where('id', $itemId)->firstOrFail()->delete();
    }
}
