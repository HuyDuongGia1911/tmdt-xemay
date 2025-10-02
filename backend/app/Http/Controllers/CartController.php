<?php

namespace App\Http\Controllers;

use App\Http\Requests\CartAddItemRequest;
use App\Http\Requests\CartUpdateItemRequest;
use App\Services\CartService;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function __construct(private CartService $cartService) {}

    // GET /api/cart
    public function show(Request $request)
    {
        $cart = $this->cartService->getOrCreateCartForUser($request->user()->id)
            ->load(['items.motorcycle']);
        return response()->json([
            'data' => [
                'id' => $cart->id,
                'items' => $cart->items->map(function ($i) {
                    return [
                        'id' => $i->id,
                        'motorcycle' => [
                            'id' => $i->motorcycle->id,
                            'name' => $i->motorcycle->name,
                            'price' => (int)$i->motorcycle->price,
                        ],
                        'qty' => (int)$i->qty,
                        'unit_price' => (int)$i->unit_price,
                        'subtotal' => (int)$i->qty * (int)$i->unit_price,
                    ];
                }),
                'subtotal' => $cart->subtotal,
            ]
        ]);
    }

    // POST /api/cart/items
    public function addItem(CartAddItemRequest $request)
    {
        $cart = $this->cartService->getOrCreateCartForUser($request->user()->id);
        $item = $this->cartService->addItem(
            $cart,
            $request->integer('motorcycle_id'),
            $request->integer('qty'),
            $request->input('variant')
        );
        return response()->json(['message' => 'Đã thêm vào giỏ', 'item_id' => $item->id], 201);
    }

    // PATCH /api/cart/items/{id}
    public function updateItem(CartUpdateItemRequest $request, int $id)
    {
        $cart = $this->cartService->getOrCreateCartForUser($request->user()->id);
        $item = $this->cartService->updateItemQty($cart, $id, $request->integer('qty'));
        return response()->json(['message' => 'Đã cập nhật số lượng', 'item_id' => $item->id]);
    }

    // DELETE /api/cart/items/{id}
    public function removeItem(Request $request, int $id)
    {
        $cart = $this->cartService->getOrCreateCartForUser($request->user()->id);
        $this->cartService->removeItem($cart, $id);
        return response()->json(['message' => 'Đã xoá khỏi giỏ']);
    }
}
