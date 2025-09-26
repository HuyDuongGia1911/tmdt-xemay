<?php

namespace Database\Factories;

use App\Models\Inventory;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class InventoryFactory extends Factory
{
    protected $model = Inventory::class;

    public function definition(): array
    {
        return [
            'stock' => $this->faker->numberBetween(0, 30),
            'sku' => 'SKU-' . Str::upper(Str::random(6)),
        ];
    }
}
