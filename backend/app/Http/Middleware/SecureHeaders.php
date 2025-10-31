<?php

namespace App\Http\Middleware;

use Closure;

class SecureHeaders
{
    public function handle($r, Closure $n)
    {
        $res = $n($r);
        $res->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
        $res->headers->set('X-Frame-Options', 'DENY');
        $res->headers->set('X-Content-Type-Options', 'nosniff');
        $res->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
        $res->headers->set('Permissions-Policy', 'geolocation=(),camera=(),microphone=()');
        $res->headers->set('Content-Security-Policy-Report-Only', "default-src 'self'; img-src 'self' data:; script-src 'self'; style-src 'self' 'unsafe-inline'");
        return $res;
    }
}
