<?php

namespace Database\Factories;

use App\Models\Review;
use Illuminate\Database\Eloquent\Factories\Factory;

class ReviewFactory extends Factory
{
    protected $model = Review::class;

    public function definition(): array
    {
        return [
            'rating' => $this->faker->numberBetween(3, 5),
            'content' => $this->faker->optional()->sentence(12),
            'is_approved' => $this->faker->boolean(80),
        ];
    }
}
