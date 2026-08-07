<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("
            ALTER TABLE pedidos
            DROP CONSTRAINT pedidos_status_check
        ");


        DB::statement("
            ALTER TABLE pedidos
            ADD CONSTRAINT pedidos_status_check
            CHECK (
                status IN (
                    'Programado',
                    'Em Carregamento',
                    'Faturado',
                    'Cancelado'
                )
            )
        ");
    }


    public function down(): void
    {
        DB::statement("
            ALTER TABLE pedidos
            DROP CONSTRAINT pedidos_status_check
        ");


        DB::statement("
            ALTER TABLE pedidos
            ADD CONSTRAINT pedidos_status_check
            CHECK (
                status IN (
                    'Programado',
                    'Carregado',
                    'Faturado',
                    'Cancelado'
                )
            )
        ");
    }
};