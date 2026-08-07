<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{

    public function up(): void
    {

        // remove a regra antiga
        DB::statement("
            ALTER TABLE pedidos
            DROP CONSTRAINT IF EXISTS pedidos_status_check
        ");



        // cria a nova regra
        DB::statement("
            ALTER TABLE pedidos
            ADD CONSTRAINT pedidos_status_check
            CHECK (
                status IN (
                    'Pedido',
                    'Agendado',
                    'Em Carregamento',
                    'Faturado',
                    'Cancelado'
                )
            )
        ");



        // muda o default
        DB::statement("
            ALTER TABLE pedidos
            ALTER COLUMN status
            SET DEFAULT 'Pedido'
        ");

    }



    public function down(): void
    {

        DB::statement("
            ALTER TABLE pedidos
            DROP CONSTRAINT IF EXISTS pedidos_status_check
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



        DB::statement("
            ALTER TABLE pedidos
            ALTER COLUMN status
            SET DEFAULT 'Programado'
        ");

    }

};