<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Sử dụng: ->middleware('role:admin') hoặc ('role:seller') hoặc ('role:admin,seller')
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (!$user) {
            // Chưa đăng nhập
            return response()->json(['message' => 'Unauthenticated'], 401);
        }
        \Log::info('DEBUG ROLE', ['role' => $user->role, 'allowed' => $roles]);

        if (empty($roles)) {
            // Nếu không truyền tham số, cho qua (không khuyến nghị)
            return $next($request);
        }

        // Nếu vai trò user nằm trong danh sách cho phép
        if (in_array($user->role, $roles, true)) {
            \Log::info('PASS ROLE', ['role' => $user->role]);
            return $next($request);
        }

        // Không đủ quyền
        return response()->json(['message' => 'Forbidden'], 403);
    }
}
