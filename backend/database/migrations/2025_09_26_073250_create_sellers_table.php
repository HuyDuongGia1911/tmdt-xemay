<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('sellers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('shop_name');
            $table->string('phone', 20)->nullable();
            $table->string('address')->nullable();
            $table->timestamps();
            $table->unique('user_id');
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('sellers');
    }
};
