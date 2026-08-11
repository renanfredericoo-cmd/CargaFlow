<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;


return new class extends Migration
{

    public function up()
    {

        Schema::table('pedidos', function (Blueprint $table) {


            $table->foreignId('cliente_id')
                ->nullable()
                ->after('id')
                ->constrained('clientes')
                ->nullOnDelete();


        });

    }



    public function down()
    {

        Schema::table('pedidos', function (Blueprint $table) {


            $table->dropForeign([
                'cliente_id'
            ]);


            $table->dropColumn('cliente_id');


        });

    }

};