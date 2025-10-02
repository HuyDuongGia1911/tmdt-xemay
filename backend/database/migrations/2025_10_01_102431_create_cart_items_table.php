<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('cart_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cart_id')->constrained('carts')->cascadeOnDelete();
            $table->foreignId('motorcycle_id')->constrained('motorcycles')->restrictOnDelete();
            $table->unsignedInteger('qty');
            $table->bigInteger('unit_price')->nullable(); // snapshot giá để hiển thị giỏ (giá tính tiền sẽ lấy lại khi checkout)
            $table->jsonb('variant_json')->nullable();    // mở rộng (màu/option)
            $table->timestamps();

            $table->unique(['cart_id', 'motorcycle_id']); // 1 sản phẩm chỉ 1 dòng trong giỏ
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cart_items');
    }
};
