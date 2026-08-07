<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('pedidos', function (Blueprint $table) {

            $table->dateTime('inicio_carregamento_at')
                ->nullable()
                ->after('hora_carregamento');


            $table->dateTime('fim_carregamento_at')
                ->nullable()
                ->after('inicio_carregamento_at');

        });
    }


    public function down()
    {
        Schema::table('pedidos', function (Blueprint $table) {

            $table->dropColumn([
                'inicio_carregamento_at',
                'fim_carregamento_at'
            ]);

        });
    }
};