<?php

namespace Database\Factories;

use App\Models\Motorcycle;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class MotorcycleFactory extends Factory
{
    protected $model = Motorcycle::class;

    public function definition(): array
    {
        $name = $this->faker->unique()->words(3, true);
        $brands = ['Honda', 'Yamaha', 'Suzuki', 'Kawasaki', 'Ducati', 'Triumph', 'VinFast'];
        $condition = $this->faker->randomElement(['new', 'used']);
        $status = $this->faker->randomElement(['active', 'draft']);

        return [
            'name' => ucfirst($name),
            'slug' => Str::slug($name) . '-' . $this->faker->unique()->numberBetween(1000, 9999),
            'brand' => $this->faker->randomElement($brands),
            'price' => $this->faker->numberBetween(15000000, 250000000),
            'condition' => $condition,
            'status' => $status,
            'thumbnail_url' => null,
        ];
    }
}
