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
        return $user->role === 'admin' || $motorcycle->seller_id === $user->id;
    }

    public function delete(User $user, Motorcycle $motorcycle): bool
    {
        return $user->role === 'admin' || $motorcycle->seller_id === $user->id;
    }
}
