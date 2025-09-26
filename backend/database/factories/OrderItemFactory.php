<?php

namespace Database\Factories;

use App\Models\OrderItem;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrderItemFactory extends Factory
{
    protected $model = OrderItem::class;

    public function definition(): array
    {
        return [
            'price' => $this->faker->numberBetween(15000000, 250000000),
            'quantity' => $this->faker->numberBetween(1, 2),
            'subtotal' => 0, // sẽ set sau = price * quantity
        ];
    }
}
