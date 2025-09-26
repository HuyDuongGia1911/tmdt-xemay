<?php

namespace Database\Factories;

use App\Models\Spec;
use Illuminate\Database\Eloquent\Factories\Factory;

class SpecFactory extends Factory
{
    protected $model = Spec::class;

    public function definition(): array
    {
        return [
            'engine_cc' => $this->faker->numberBetween(100, 1200),
            'power_hp' => $this->faker->numberBetween(8, 160),
            'torque_nm' => $this->faker->numberBetween(8, 150),
            'weight_kg' => $this->faker->numberBetween(90, 250),
            'year' => $this->faker->numberBetween(2010, 2025),
            'color' => $this->faker->randomElement(['red', 'black', 'white', 'blue', 'silver', 'green']),
        ];
    }
}
