<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        // ===== PAYMENTS: thêm cột paid_at nếu chưa có =====
        if (!Schema::hasColumn('payments', 'paid_at')) {
            Schema::table('payments', function (Blueprint $table) {
                $table->timestamp('paid_at')->nullable()->after('status');
            });
        }

        // Tạo index cho payments.paid_at nếu cột đã tồn tại
        DB::statement('CREATE INDEX IF NOT EXISTS idx_pay_paid_at ON payments (paid_at)');

        // ===== (TÙY CHỌN) ORDERS: thêm paid_at để đồng nhất & tiện báo cáo =====
        if (Schema::hasTable('orders') && !Schema::hasColumn('orders', 'paid_at')) {
            Schema::table('orders', function (Blueprint $table) {
                $table->timestamp('paid_at')->nullable()->after('payment_status');
            });
        }

        // Index cho orders.paid_at (nếu có)
        if (Schema::hasColumn('orders', 'paid_at')) {
            DB::statement('CREATE INDEX IF NOT EXISTS idx_orders_paid_at ON orders (paid_at)');
        }
    }

    public function down(): void
    {
        // Xóa index trước
        DB::statement('DROP INDEX IF EXISTS idx_pay_paid_at');
        DB::statement('DROP INDEX IF EXISTS idx_orders_paid_at');

        // (Cân nhắc) Có xóa cột không? Thường giữ lại để không mất dữ liệu lịch sử.
        // Nếu bạn muốn rollback thật sạch, bỏ comment phần dưới:

        // if (Schema::hasColumn('payments', 'paid_at')) {
        //     Schema::table('payments', function (Blueprint $table) {
        //         $table->dropColumn('paid_at');
        //     });
        // }

        // if (Schema::hasColumn('orders', 'paid_at')) {
        //     Schema::table('orders', function (Blueprint $table) {
        //         $table->dropColumn('paid_at');
        //     });
        // }
    }
};
