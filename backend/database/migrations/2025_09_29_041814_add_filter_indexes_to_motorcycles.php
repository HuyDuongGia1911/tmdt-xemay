<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('motorcycles', function (Blueprint $table) {

            if (!Schema::hasColumn('motorcycles', 'brand')) $table->string('brand')->index();
            if (!Schema::hasColumn('motorcycles', 'price')) $table->bigInteger('price')->index();
            if (!Schema::hasColumn('motorcycles', 'year')) $table->integer('year')->default(2000)->index();
            if (!Schema::hasColumn('motorcycles', 'condition')) $table->string('condition')->index();
            if (!Schema::hasColumn('motorcycles', 'color')) $table->string('color')->nullable()->index();
            if (!Schema::hasColumn('motorcycles', 'status')) $table->string('status')->default('draft')->index();
            $table->index('category_id');
            $table->index('seller_id');
            if (Schema::hasColumn('motorcycles', 'type')) $table->index('type');
        });
    }

    public function down(): void
    {
        Schema::table('motorcycles', function (Blueprint $table) {
            $table->dropIndex(['brand']);
            $table->dropIndex(['price']);
            $table->dropIndex(['year']);
            $table->dropIndex(['condition']);
            $table->dropIndex(['color']);
            $table->dropIndex(['status']);
            $table->dropIndex(['category_id']);
            $table->dropIndex(['seller_id']);
            if (Schema::hasColumn('motorcycles', 'type')) $table->dropIndex(['type']);
        });
    }
};
