<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

use App\Models\User;
use App\Models\Seller;
use App\Models\Category;
use App\Models\Motorcycle;
use App\Models\Spec;
use App\Models\Inventory;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Models\Review;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1) Bảo đảm có 3 user role cơ bản
        $admin = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            ['name' => 'Admin Demo', 'password' => Hash::make('password'), 'role' => 'admin']
        );

        $sellerUser = User::firstOrCreate(
            ['email' => 'seller@example.com'],
            ['name' => 'Seller Demo', 'password' => Hash::make('password'), 'role' => 'seller']
        );

        $buyer = User::firstOrCreate(
            ['email' => 'buyer@example.com'],
            ['name' => 'Buyer Demo', 'password' => Hash::make('password'), 'role' => 'buyer']
        );

        // 2) Tạo seller profile
        $seller = Seller::firstOrCreate(
            ['user_id' => $sellerUser->id],
            ['shop_name' => 'Cửa hàng Moto Demo', 'phone' => '0900000000', 'address' => 'Hà Nội']
        );

        // 3) Seed categories (cứng) + thêm vài cái random
        $fixedCats = collect([
            'Xe số',
            'Xe tay ga',
            'Phân khối lớn',
            'Classic',
            'Adventure',
            'Electric'
        ])->map(function ($name) {
            return Category::firstOrCreate(
                ['slug' => Str::slug($name)],
                ['name' => $name]
            );
        });

        Category::factory()->count(4)->create();

        // 4) Tạo 20 motorcycles cho seller
        $categories = Category::all();
        Motorcycle::factory()
            ->count(20)
            ->make()
            ->each(function ($moto) use ($seller, $categories) {
                $moto->seller_id = $seller->id;
                $moto->category_id = $categories->random()->id;
                $moto->save();

                // Spec 1-1
                $spec = Spec::factory()->make();
                $moto->spec()->save($spec);

                // Inventory 1-1
                $inv = Inventory::factory()->make();
                $moto->inventory()->save($inv);
            });

        // 5) Buyer đặt 5 đơn, mỗi đơn 1-3 sản phẩm
        Order::factory()->count(5)->make()->each(function ($order) use ($buyer) {
            $order->buyer_id = $buyer->id;
            $order->save();

            $items = Motorcycle::inRandomOrder()->take(rand(1, 3))->get()->map(function ($m) {
                $qty = rand(1, 2);
                return new OrderItem([
                    'motorcycle_id' => $m->id,
                    'price' => $m->price,
                    'quantity' => $qty,
                    'subtotal' => $m->price * $qty
                ]);
            });

            $order->items()->saveMany($items);
            $order->update(['total_amount' => $order->items()->sum('subtotal')]);

            // Payment bản ghi nháp
            $payment = Payment::factory()->make([
                'amount' => $order->total_amount
            ]);
            $order->payment()->save($payment);
        });

        // 6) Một vài review random
        Review::factory()->count(10)->make()->each(function ($r) {
            $r->user_id = User::inRandomOrder()->first()->id;
            $r->motorcycle_id = Motorcycle::inRandomOrder()->first()->id;
            $r->save();
        });
    }
}
