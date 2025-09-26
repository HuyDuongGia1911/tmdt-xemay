<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('motorcycles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('seller_id')->constrained()->cascadeOnDelete();
            $table->foreignId('category_id')->constrained()->restrictOnDelete();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('brand')->index();
            $table->unsignedBigInteger('price')->index();
            $table->enum('condition', ['new', 'used'])->default('new')->index();
            $table->enum('status', ['active', 'draft'])->default('draft')->index();
            $table->string('thumbnail_url')->nullable();
            $table->softDeletes();
            $table->timestamps();
            $table->index(['category_id', 'status', 'price']);
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('motorcycles');
    }
};
