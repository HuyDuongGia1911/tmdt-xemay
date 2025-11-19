<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreReviewRequest;
use App\Models\Motorcycle;
use App\Models\Review;

class ReviewController extends Controller
{
    public function store(StoreReviewRequest $request, Motorcycle $motorcycle)
    {
        $user = auth()->user();
        // ❗ Check user đã đánh giá xe này chưa
        $exists = Review::where('motorcycle_id', $motorcycle->id)
            ->where('user_id', $user->id)
            ->exists();

        if ($exists) {
            return response()->json([
                'message' => 'Bạn đã đánh giá xe này rồi.',
            ], 422);
        }

        $review = Review::create([
            'motorcycle_id' => $motorcycle->id,
            'user_id' => $user->id,
            'rating' => $request->rating,
            'content' => $request->content,
            'is_approved' => true, // tạm cho auto duyệt
        ]);

        // Cập nhật điểm trung bình
        $motorcycle->average_rating = Review::where('motorcycle_id', $motorcycle->id)
            ->avg('rating') ?? 0;
        $motorcycle->save();

        return response()->json([
            'message' => 'Đánh giá đã được gửi!',
            'review' => $review
        ]);
    }
}
