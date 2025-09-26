<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('specs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('motorcycle_id')->constrained()->cascadeOnDelete();
            $table->unsignedSmallInteger('engine_cc')->nullable()->index();
            $table->unsignedSmallInteger('power_hp')->nullable();
            $table->unsignedSmallInteger('torque_nm')->nullable();
            $table->unsignedSmallInteger('weight_kg')->nullable();
            $table->unsignedSmallInteger('year')->nullable()->index();
            $table->string('color', 50)->nullable()->index();
            $table->timestamps();
            $table->unique('motorcycle_id'); // 1-1
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('specs');
    }
};
