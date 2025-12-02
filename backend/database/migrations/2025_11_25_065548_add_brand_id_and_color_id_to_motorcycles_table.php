<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('motorcycles', function (Blueprint $table) {
            // brand_id tham chiếu brands
            $table->foreignId('brand_id')
                ->nullable()
                ->after('slug')
                ->constrained('brands')
                ->nullOnDelete();

            // color_id tham chiếu colors
            $table->foreignId('color_id')
                ->nullable()
                ->after('brand_id')
                ->constrained('colors')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('motorcycles', function (Blueprint $table) {
            $table->dropForeign(['brand_id']);
            $table->dropColumn('brand_id');

            $table->dropForeign(['color_id']);
            $table->dropColumn('color_id');
        });
    }
};
