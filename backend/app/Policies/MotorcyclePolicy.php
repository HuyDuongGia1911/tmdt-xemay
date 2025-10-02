<?php

namespace App\Policies;

use App\Models\Motorcycle;
use App\Models\User;

class MotorcyclePolicy
{
    public function view(User $user, Motorcycle $motorcycle): bool
    {
        return true; // ai cũng xem được, đã chặn buyer bằng controller
    }

    public function create(User $user): bool
    {
        return in_array($user->role, ['seller', 'admin']);
    }

    public function update(User $user, Motorcycle $motorcycle): bool
    {
        \Log::info('POLICY UPDATE', [
            'user_id' => $user->id,
            'role' => $user->role,
            'user_seller_id' => optional($user->seller)->id,
            'motorcycle_seller_id' => $motorcycle->seller_id
        ]);

        return $user->role === 'admin'
            || ($user->role === 'seller' && $user->seller && $motorcycle->seller_id === $user->seller->id);
    }

    public function delete(User $user, Motorcycle $motorcycle): bool
    {
        \Log::info('POLICY DELETE', [
            'user_id' => $user->id,
            'role' => $user->role,
            'user_seller_id' => optional($user->seller)->id,
            'motorcycle_seller_id' => $motorcycle->seller_id
        ]);

        return $user->role === 'admin'
            || ($user->role === 'seller' && $user->seller && $motorcycle->seller_id === $user->seller->id);
    }
}
