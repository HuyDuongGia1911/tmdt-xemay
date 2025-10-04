<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->string('gateway_txn_id')->nullable()->after('tx_id');
            $table->text('pay_url')->nullable()->after('gateway_txn_id');
            $table->jsonb('extra')->nullable()->after('raw_payload');

            $table->index(['order_id', 'status']);
            $table->index(['provider', 'gateway_txn_id']);
        });
    }

    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->dropIndex(['order_id', 'status']);
            $table->dropIndex(['provider', 'gateway_txn_id']);
            $table->dropColumn(['gateway_txn_id', 'pay_url', 'extra']);
        });
    }
};
