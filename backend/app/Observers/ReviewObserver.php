<?php

namespace App\Observers;

use App\Models\Review;
use App\Models\Motorcycle;

class ReviewObserver
{
    public function saved(Review $review)
    {
        $this->updateRating($review);
    }

    public function deleted(Review $review)
    {
        $this->updateRating($review);
    }

    protected function updateRating(Review $review)
    {
        $motorcycleId = $review->motorcycle_id;

        $avg = Review::where('motorcycle_id', $motorcycleId)
            ->where('is_approved', true)
            ->avg('rating');

        Motorcycle::where('id', $motorcycleId)
            ->update(['average_rating' => $avg ?? 0]);
    }
}
