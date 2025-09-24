<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class DemoUsersSeeder extends Seeder
{
    public function run(): void
    {
        // Admin
        User::updateOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin Demo',
                'password' => Hash::make('password123'),
                'role' => 'admin',
            ]
        );

        // Seller
        User::updateOrCreate(
            ['email' => 'seller@example.com'],
            [
                'name' => 'Seller Demo',
                'password' => Hash::make('password123'),
                'role' => 'seller',
            ]
        );

        // Buyer
        User::updateOrCreate(
            ['email' => 'buyer@example.com'],
            [
                'name' => 'Buyer Demo',
                'password' => Hash::make('password123'),
                'role' => 'buyer',
            ]
        );
    }
}
