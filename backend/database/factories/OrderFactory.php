<?php

namespace Database\Factories;

use App\Models\Order;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrderFactory extends Factory
{
    protected $model = Order::class;

    public function definition(): array
    {
        $code = 'ORD-' . now()->format('Ymd') . '-' . $this->faker->unique()->numberBetween(10000, 99999);
        return [
            'code' => $code,
            'status' => 'pending',
            'total_amount' => 0,
            'payment_method' => null,
            'payment_status' => 'pending',
            'paid_at' => null,
        ];
    }
}
