<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up(): void
    {
        Schema::table('clientes', function (Blueprint $table) {

            $table->string('nome')
                ->after('id');

            $table->string('cidade')
                ->after('nome');

            $table->string('estado', 2)
                ->after('cidade');

            $table->boolean('ativo')
                ->default(true)
                ->after('estado');

        });
    }



    public function down(): void
    {
        Schema::table('clientes', function (Blueprint $table) {

            $table->dropColumn([
                'nome',
                'cidade',
                'estado',
                'ativo'
            ]);

        });
    }

};