<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Order;
use App\Models\Payment;
use App\Models\Motorcycle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class DashboardAdminController extends Controller
{
    /**
     * GET /api/dashboard/admin/overview?range=7d|30d|90d
     */
    public function overview(Request $request)
    {
        $user = Auth::user();
        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $range = $request->query('range', '30d');
        $from  = match ($range) {
            '7d'  => now()->subDays(7),
            '90d' => now()->subDays(90),
            default => now()->subDays(30),
        };
        $to = now();

        $totalUsers   = User::count();
        $totalSellers = User::where('role', 'seller')->count();

        $orderCounts = Order::whereBetween('created_at', [$from, $to])
            ->selectRaw("status, COUNT(*) as count")
            ->groupBy('status')->get();

        $paidAmount = Payment::where('status', 'paid')
            ->whereBetween('created_at', [$from, $to])
            ->sum('amount');

        $topSellers = DB::table('order_items')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->join('motorcycles', 'order_items.motorcycle_id', '=', 'motorcycles.id')
            ->join('payments', 'payments.order_id', '=', 'orders.id')
            ->whereBetween('orders.created_at', [$from, $to])
            ->where('payments.status', 'paid')
            ->selectRaw('motorcycles.seller_id, COUNT(DISTINCT orders.id) as orders, SUM(orders.total_amount) as total')
            ->groupBy('motorcycles.seller_id')
            ->orderByDesc('total')
            ->limit(5)
            ->get();


        return response()->json([
            'range' => $range,
            'metrics' => [
                'total_users'   => $totalUsers,
                'total_sellers' => $totalSellers,
                'paid_amount'   => (int) $paidAmount,
                'order_counts'  => $orderCounts,
            ],
            'top_sellers' => $topSellers,
        ]);
    }

    /**
     * GET /api/dashboard/admin/orders?status=&seller_id=&q=&page=
     */
    public function orders(Request $request)
    {
        $user = Auth::user();
        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $status   = $request->query('status');
        $sellerId = $request->query('seller_id');
        $q        = $request->query('q');

        $orders = Order::with(['payment', 'user'])
            ->when($status, fn($qb) => $qb->where('status', $status))
            ->when(
                $sellerId,
                fn($qb) =>
                $qb->whereHas('items.motorcycle.seller', fn($q) => $q->where('id', $sellerId))
            )
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
     * GET /api/dashboard/admin/users?q=&role=&page=
     */
    public function users(Request $request)
    {
        $user = Auth::user();
        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $q    = $request->query('q');
        $role = $request->query('role');

        $users = User::query()
            ->when($role, fn($qb) => $qb->where('role', $role))
            ->when($q, function ($qb) use ($q) {
                $qb->where(function ($sub) use ($q) {
                    $sub->where('name', 'ILIKE', "%$q%")
                        ->orWhere('email', 'ILIKE', "%$q%");
                });
            })
            ->orderByDesc('created_at')
            ->paginate($request->query('per_page', 10));

        return response()->json($users);
    }

    /**
     * GET /api/dashboard/admin/payments?status=&method=&page=
     */
    public function payments(Request $request)
    {
        $user = Auth::user();
        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $status = $request->query('status'); // pending/paid/failed/refunded
        $method = $request->query('method'); // momo/vnpay/...

        $payments = Payment::with(['order'])
            ->when($status, fn($qb) => $qb->where('status', $status))
            ->when($method, fn($qb) => $qb->where('provider', $method))
            ->orderByDesc('created_at')
            ->paginate($request->query('per_page', 10));

        return response()->json($payments);
    }
}
