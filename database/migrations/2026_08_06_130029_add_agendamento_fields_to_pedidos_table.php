<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pedidos', function (Blueprint $table) {

            $table->date('data_agendamento')
                ->nullable()
                ->after('transportadora');

            $table->time('hora_agendamento')
                ->nullable()
                ->after('data_agendamento');


            $table->time('hora_carregamento')
                ->nullable()
                ->after('data_carregamento');


            $table->time('hora_faturamento')
                ->nullable()
                ->after('numero_nfe');

        });
    }


    public function down(): void
    {
        Schema::table('pedidos', function (Blueprint $table) {

            $table->dropColumn([
                'data_agendamento',
                'hora_agendamento',
                'hora_carregamento',
                'hora_faturamento',
            ]);

        });
    }
};