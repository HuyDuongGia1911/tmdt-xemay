<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('inventory', function (Blueprint $table) {
            $table->id();
            $table->foreignId('motorcycle_id')->constrained()->cascadeOnDelete();
            $table->unsignedInteger('stock')->default(0);
            $table->string('sku')->unique();
            $table->timestamps();
            $table->index(['motorcycle_id', 'stock']);
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('inventory');
    }
};
