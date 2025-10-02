<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::table('inventory', function (Blueprint $table) {
            $table->unsignedInteger('reserved')->default(0)->after('stock');
        });
    }

    public function down(): void {
        Schema::table('inventory', function (Blueprint $table) {
            $table->dropColumn('reserved');
        });
    }
};
