<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Motorcycle;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class DashboardSellerController extends Controller
{
    /**
     * GET /api/dashboard/seller/overview?range=7d|30d|90d
     * - Tổng quan nhanh: tổng doanh thu (paid), số đơn theo trạng thái, top sản phẩm bán chạy
     */
    public function overview(Request $request)
    {
        $userId = Auth::id();
        $range = $request->query('range', '30d');
        $from  = match ($range) {
            '7d' => now()->subDays(7),
            '90d' => now()->subDays(90),
            default => now()->subDays(30)
        };
        $to = now();

        // Doanh thu đã thanh toán của seller hiện tại
        $totalRevenue = Payment::where('status', 'paid')
            ->whereBetween('created_at', [$from, $to])
            ->whereHas('order.items.motorcycle.seller', fn($q) => $q->where('user_id', $userId))
            ->sum('amount');

        // Đếm đơn theo trạng thái
        $orderCounts = Order::whereBetween('created_at', [$from, $to])
            ->whereHas('items.motorcycle.seller', fn($q) => $q->where('user_id', $userId))
            ->selectRaw('status, COUNT(*) as count')->groupBy('status')->get();

        // Top sản phẩm (JOIN thẳng)
        $topProducts = DB::table('order_items')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->join('motorcycles', 'order_items.motorcycle_id', '=', 'motorcycles.id')
            ->join('sellers', 'motorcycles.seller_id', '=', 'sellers.id')
            ->where('sellers.user_id', $userId)
            ->whereBetween('orders.created_at', [$from, $to])
            ->selectRaw('motorcycles.id, motorcycles.name, SUM(order_items.quantity) as qty')
            ->groupBy('motorcycles.id', 'motorcycles.name')
            ->orderByDesc('qty')->limit(5)->get();

        return response()->json([
            'range' => $range,
            'from' => $from->toDateTimeString(),
            'to' => $to->toDateTimeString(),
            'metrics' => ['total_revenue' => (int)$totalRevenue, 'order_counts' => $orderCounts],
            'top_products' => $topProducts,
        ]);
    }

    /**
     * GET /api/dashboard/seller/orders?status=&q=&page=
     * - Danh sách đơn hàng của seller, có filter & pagination
     */
    public function orders(Request $request)
    {
        $userId = Auth::id();
        $status = $request->query('status');
        $q      = $request->query('q');

        $orders = Order::with(['payment', 'user'])
            ->whereHas('items.motorcycle.seller', fn($qb) => $qb->where('user_id', $userId))
            ->when($status, fn($qb) => $qb->where('status', $status))
            ->when($q, function ($qb) use ($q) {
                $qb->where(function ($sub) use ($q) {
                    $sub->where('code', 'ILIKE', "%$q%")
                        ->orWhere('shipping_address', 'ILIKE', "%$q%");
                });
            })
            ->orderByDesc('created_at')
            ->paginate($request->query('per_page', 10));

        return response()->json($orders);
    }


    /**
     * GET /api/dashboard/seller/motorcycles?q=&status=&page=
     * - Danh sách sản phẩm thuộc seller (quản lý nhanh)
     */
    public function motorcycles(Request $request)
    {
        $userId = Auth::id();
        $q      = $request->query('q');
        $status = $request->query('status');

        $items = Motorcycle::with('inventory')
            ->whereHas('seller', fn($qb) => $qb->where('user_id', $userId))
            ->when($status, fn($qb) => $qb->where('status', $status))
            ->when($q, function ($qb) use ($q) {
                $qb->where(function ($sub) use ($q) {
                    $sub->where('name', 'ILIKE', "%$q%")->orWhere('slug', 'ILIKE', "%$q%");
                });
            })
            ->orderByDesc('created_at')
            ->paginate($request->query('per_page', 10));

        return response()->json($items);
    }


    /**
     * PATCH /api/dashboard/seller/motorcycles/{id}
     * - Cập nhật nhanh: giá, tồn kho, status
     * BODY ví dụ: { "price": 25000000, "status": "active", "stock": 5 }
     */
    public function updateMotorcycle(Request $request, $id)
    {
        $user = Auth::user();
        if (!in_array($user->role, ['seller', 'admin'])) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $mc = Motorcycle::where('id', $id)
            ->whereHas('seller', fn($q) => $q->where('user_id', Auth::id()))
            ->firstOrFail();


        $validated = $request->validate([
            'price'  => 'nullable|integer|min:0',
            'status' => 'nullable|in:active,inactive',
            'stock'  => 'nullable|integer|min:0'
        ]);

        DB::transaction(function () use ($mc, $validated) {
            if (array_key_exists('price', $validated))  $mc->price  = $validated['price'];
            if (array_key_exists('status', $validated)) $mc->status = $validated['status'];
            $mc->save();

            if (array_key_exists('stock', $validated)) {
                // giả sử quan hệ 1-1 inventory
                $inv = $mc->inventory()->first();
                if ($inv) {
                    $inv->stock = $validated['stock'];
                    $inv->save();
                }
            }
        });

        return response()->json(['message' => 'updated']);
    }
}
