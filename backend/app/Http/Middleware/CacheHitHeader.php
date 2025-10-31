<?php

namespace App\Http\Middleware;

use Closure;

class CacheHitHeader
{
    public function handle($request, Closure $next)
    {
        // Mặc định giả định MISS trước khi controller chạy
        if (!app()->bound('cache.hit')) {
            app()->instance('cache.hit', false);
        }

        $response = $next($request);

        // Sau khi controller xử lý xong → thêm header
        $hit = app()->bound('cache.hit') && app('cache.hit') === true;
        if (method_exists($response, 'headers')) {
            $response->headers->set('X-Cache', $hit ? 'HIT' : 'MISS');
        }

        return $response;
    }
}
