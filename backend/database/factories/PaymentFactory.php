<?php

namespace Database\Factories;

use App\Models\Payment;
use Illuminate\Database\Eloquent\Factories\Factory;

class PaymentFactory extends Factory
{
    protected $model = Payment::class;

    public function definition(): array
    {
        $providers = ['momo', 'vnpay'];
        return [
            'provider' => $this->faker->randomElement($providers),
            'amount' => 0,
            'currency' => 'VND',
            'tx_id' => 'TX-' . $this->faker->unique()->numberBetween(100000, 999999),
            'status' => 'pending',
            'raw_payload' => null,
        ];
    }
}
