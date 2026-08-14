<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasColumn('pedidos', 'produto_id')) {
            Schema::table('pedidos', function (Blueprint $table) {
                $table->foreignId('produto_id')
                    ->nullable()
                    ->after('destino');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('pedidos', 'produto_id')) {
            Schema::table('pedidos', function (Blueprint $table) {
                $table->dropColumn('produto_id');
            });
        }
    }
};