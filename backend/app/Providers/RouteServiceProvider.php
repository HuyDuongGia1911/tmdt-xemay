<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Http\Request;

class RouteServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        // ✅ Khai báo limiter cho từng nhóm
        RateLimiter::for('auth', function (Request $request) {
            return [Limit::perMinute(10)->by($request->ip())];
        });

        RateLimiter::for('catalog', function (Request $request) {
            return Limit::perMinute(120)->by($request->ip());
        });

        RateLimiter::for('payments', function (Request $request) {
            $key = ($request->user()?->id ?? 'guest') . '|' . $request->ip();
            return Limit::perMinute(5)->by($key);
        });

        RateLimiter::for('ipn', function (Request $request) {
            return Limit::perMinute(60)->by($request->ip());
        });
    }
}
