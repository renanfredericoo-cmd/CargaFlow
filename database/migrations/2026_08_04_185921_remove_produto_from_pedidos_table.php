<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasColumn('pedidos', 'produto')) {
            Schema::table('pedidos', function (Blueprint $table) {
                $table->dropColumn('produto');
            });
        }
    }

    public function down(): void
    {
        if (!Schema::hasColumn('pedidos', 'produto')) {
            Schema::table('pedidos', function (Blueprint $table) {
                $table->string('produto');
            });
        }
    }
};