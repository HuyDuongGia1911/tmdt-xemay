<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('colors', function (Blueprint $table) {
            $table->id();
            $table->string('name');           // Red, Black, Trắng ngọc trai...
            $table->string('code', 9);        // mã hex: #FF0000
            $table->timestamps();
            $table->unique(['name', 'code']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('colors');
    }
};
