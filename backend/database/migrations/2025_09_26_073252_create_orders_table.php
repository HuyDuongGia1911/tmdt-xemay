<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('buyer_id')->constrained('users')->restrictOnDelete();
            $table->string('code')->unique(); // ORD-YYYYMMDD-xxxxx
            $table->enum('status', ['pending', 'paid', 'failed', 'cancelled', 'shipped', 'completed'])->default('pending')->index();
            $table->unsignedBigInteger('total_amount');
            $table->enum('payment_method', ['momo', 'vnpay'])->nullable()->index();
            $table->enum('payment_status', ['pending', 'paid', 'failed'])->default('pending')->index();
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();
            $table->index(['buyer_id', 'status', 'created_at']);
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
