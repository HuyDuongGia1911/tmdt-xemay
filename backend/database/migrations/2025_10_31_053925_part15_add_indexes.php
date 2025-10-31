<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // ===== MOTORCYCLES =====
        DB::statement('CREATE INDEX IF NOT EXISTS idx_moto_status      ON motorcycles (status)');
        DB::statement('CREATE INDEX IF NOT EXISTS idx_moto_brand       ON motorcycles (brand)');
        DB::statement('CREATE INDEX IF NOT EXISTS idx_moto_year        ON motorcycles (year)');
        DB::statement('CREATE INDEX IF NOT EXISTS idx_moto_price       ON motorcycles (price)');
        DB::statement('CREATE INDEX IF NOT EXISTS idx_moto_created_at  ON motorcycles (created_at)');
        // composite & partial
        DB::statement('CREATE INDEX IF NOT EXISTS idx_moto_status_brand ON motorcycles (status, brand)');
        DB::statement('CREATE INDEX IF NOT EXISTS idx_moto_status_price ON motorcycles (status, price)');
        DB::statement('CREATE INDEX IF NOT EXISTS idx_moto_status_year  ON motorcycles (status, year)');
        DB::statement("CREATE INDEX IF NOT EXISTS idx_moto_active_bpy   ON motorcycles (brand, price, year) WHERE status = 'active'");

        // Seller-based dashboard lọc qua motorcycles.seller_id → đảm bảo index này tồn tại
        // (nếu bảng motorcycles CHƯA có index này)
        DB::statement('CREATE INDEX IF NOT EXISTS idx_moto_seller_id ON motorcycles (seller_id)');

        // ===== ORDERS =====
        DB::statement('CREATE INDEX IF NOT EXISTS idx_orders_status      ON orders (status)');
        DB::statement('CREATE INDEX IF NOT EXISTS idx_orders_created_at  ON orders (created_at)');
        // KHÔNG tạo idx_orders_seller vì KHÔNG có cột seller_id trong orders

        // ===== ORDER_ITEMS =====
        DB::statement('CREATE INDEX IF NOT EXISTS idx_oi_order ON order_items (order_id)');
        DB::statement('CREATE INDEX IF NOT EXISTS idx_oi_moto  ON order_items (motorcycle_id)');

        // ===== PAYMENTS =====
        DB::statement('CREATE INDEX IF NOT EXISTS idx_pay_order    ON payments (order_id)');
        DB::statement('CREATE INDEX IF NOT EXISTS idx_pay_status   ON payments (status)');
        DB::statement('CREATE INDEX IF NOT EXISTS idx_pay_provider ON payments (provider)');
        DB::statement('CREATE INDEX IF NOT EXISTS idx_pay_paid_at  ON payments (paid_at)');

        // ===== REVIEWS =====
        DB::statement('CREATE INDEX IF NOT EXISTS idx_reviews_moto   ON reviews (motorcycle_id)');
        DB::statement('CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews (rating)');

        // ===== INVENTORY =====
        DB::statement('CREATE INDEX IF NOT EXISTS idx_inv_moto  ON inventory (motorcycle_id)');
        DB::statement('CREATE INDEX IF NOT EXISTS idx_inv_stock ON inventory (stock)');
    }

    public function down(): void
    {
        // MOTORCYCLES
        DB::statement('DROP INDEX IF EXISTS idx_moto_status');
        DB::statement('DROP INDEX IF EXISTS idx_moto_brand');
        DB::statement('DROP INDEX IF EXISTS idx_moto_year');
        DB::statement('DROP INDEX IF EXISTS idx_moto_price');
        DB::statement('DROP INDEX IF EXISTS idx_moto_created_at');
        DB::statement('DROP INDEX IF EXISTS idx_moto_status_brand');
        DB::statement('DROP INDEX IF EXISTS idx_moto_status_price');
        DB::statement('DROP INDEX IF EXISTS idx_moto_status_year');
        DB::statement('DROP INDEX IF EXISTS idx_moto_active_bpy');
        DB::statement('DROP INDEX IF EXISTS idx_moto_seller_id');

        // ORDERS
        DB::statement('DROP INDEX IF EXISTS idx_orders_status');
        DB::statement('DROP INDEX IF EXISTS idx_orders_created_at');

        // ORDER_ITEMS
        DB::statement('DROP INDEX IF EXISTS idx_oi_order');
        DB::statement('DROP INDEX IF EXISTS idx_oi_moto');

        // PAYMENTS
        DB::statement('DROP INDEX IF EXISTS idx_pay_order');
        DB::statement('DROP INDEX IF EXISTS idx_pay_status');
        DB::statement('DROP INDEX IF EXISTS idx_pay_provider');
        DB::statement('DROP INDEX IF EXISTS idx_pay_paid_at');

        // REVIEWS
        DB::statement('DROP INDEX IF EXISTS idx_reviews_moto');
        DB::statement('DROP INDEX IF EXISTS idx_reviews_rating');

        // INVENTORY
        DB::statement('DROP INDEX IF EXISTS idx_inv_moto');
        DB::statement('DROP INDEX IF EXISTS idx_inv_stock');
    }
};
