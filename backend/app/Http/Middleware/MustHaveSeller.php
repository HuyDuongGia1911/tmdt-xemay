<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class MustHaveSeller
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        // Nếu chưa đăng nhập → redirect sang login
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        // Nếu đã có cửa hàng → cho qua
        if ($user->seller) {
            return $next($request);
        }

        // Nếu chưa có cửa hàng → chặn + báo FE redirect setup shop
        return response()->json([
            'needs_seller_setup' => true,
            'message' => 'Bạn chưa có cửa hàng. Vui lòng tạo cửa hàng trước.'
        ], 403);
    }
}
