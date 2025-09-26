<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->enum('provider', ['momo', 'vnpay'])->index();
            $table->unsignedBigInteger('amount');
            $table->string('currency', 10)->default('VND');
            $table->string('tx_id')->unique();
            $table->enum('status', ['pending', 'success', 'failed'])->default('pending')->index();
            $table->jsonb('raw_payload')->nullable();
            $table->timestamps();
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
