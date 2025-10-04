<?php

namespace App\Services\Payments;

use InvalidArgumentException;

class PaymentFactory
{
    public static function make(string $provider): PaymentService
    {
        return match ($provider) {
            'momo'  => new MomoService(),
            'vnpay' => new VnpayService(),
            default => throw new InvalidArgumentException("Unsupported provider: $provider")
        };
    }
}
