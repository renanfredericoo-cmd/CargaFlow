<?php

use App\Models\Pedido;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('pedidos', function (Blueprint $table) {

            $table->id();

            /*
            |--------------------------------------------------------------------------
            | Dados do Pedido
            |--------------------------------------------------------------------------
            */

            $table->date('data');

            $table->string('cliente');

            $table->string('destino');

            $table->string('produto');

            $table->decimal('peso', 10, 2);

            $table->enum('tipo_frete', [
                'CIF',
                'FOB',
            ]);

            $table->string('vendedor');

            $table->text('observacoes')->nullable();

            /*
            |--------------------------------------------------------------------------
            | Status
            |--------------------------------------------------------------------------
            */

            $table->enum('status', [

                Pedido::STATUS_PROGRAMADO,

                Pedido::STATUS_CARREGAMENTO,

                Pedido::STATUS_FATURADO,

                Pedido::STATUS_CANCELADO,

            ])->default(Pedido::STATUS_PROGRAMADO);

            /*
            |--------------------------------------------------------------------------
            | Programação do Carregamento
            |--------------------------------------------------------------------------
            */

            $table->string('transportadora')->nullable();

            $table->string('motorista')->nullable();

            $table->string('placa')->nullable();

            $table->date('data_carregamento')->nullable();

            /*
            |--------------------------------------------------------------------------
            | Faturamento
            |--------------------------------------------------------------------------
            */

            $table->string('numero_nfe')->nullable();

            /*
            |--------------------------------------------------------------------------
            | Usuário
            |--------------------------------------------------------------------------
            */

            $table->foreignId('user_id')
                ->constrained()
                ->cascadeOnDelete();

            /*
            |--------------------------------------------------------------------------
            | Índices
            |--------------------------------------------------------------------------
            */

            $table->index('status');

            $table->index('cliente');

            $table->index('data');

            /*
            |--------------------------------------------------------------------------
            | Timestamps
            |--------------------------------------------------------------------------
            */

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pedidos');
    }
};