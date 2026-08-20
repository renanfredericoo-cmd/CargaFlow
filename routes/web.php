<?php


use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PedidoController;
use App\Http\Controllers\ProdutoController;
use App\Http\Controllers\ClienteController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AnalisePedidosController;

use Illuminate\Support\Facades\Route;




Route::view('/', 'share')->name('home');





Route::middleware(['auth', 'verified'])->group(function () {




    // Dashboard


    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');

  
        // Análise de Pedidos

    Route::get('/analise-pedidos', [AnalisePedidosController::class, 'index'])
    ->middleware('analise.pedidos')
    ->name('analise-pedidos.index');





    // Relatórios


    Route::get('/reports', [ReportController::class, 'index'])
        ->name('reports.index');



    Route::get('/reports/pdf', [ReportController::class, 'pdf'])
        ->name('reports.pdf');









    /*
    |--------------------------------------------------------------------------
    | Pedidos
    |--------------------------------------------------------------------------
    */



    Route::get('/pedidos', [PedidoController::class, 'index'])
        ->name('pedidos.index');



    Route::post('/pedidos', [PedidoController::class, 'store'])
        ->name('pedidos.store');



    Route::put('/pedidos/{pedido}', [PedidoController::class, 'update'])
        ->name('pedidos.update');





    // Agendamento


    // Agendamento

Route::put('/pedidos/{pedido}/agendar', [PedidoController::class, 'agendar'])
    ->name('pedidos.agendar');


// Editar transportadora

Route::patch('/pedidos/{pedido}/transportadora', [PedidoController::class, 'atualizarTransportadora'])
    ->name('pedidos.atualizarTransportadora');





    // Iniciar carregamento


    Route::put('/pedidos/{pedido}/carregar', [PedidoController::class, 'carregar'])
        ->name('pedidos.carregar');





    // Faturamento

Route::put('/pedidos/{pedido}/faturar', [PedidoController::class, 'faturar'])
    ->name('pedidos.faturar');




// Detalhes / Impressão

Route::get('/pedidos/{pedido}/detalhes', [PedidoController::class, 'detalhes'])
    ->name('pedidos.detalhes');




// Cancelamento

Route::patch('/pedidos/{pedido}/cancelar', [PedidoController::class, 'cancelar'])
    ->name('pedidos.cancelar');





    // Exclusão


    Route::delete('/pedidos/{pedido}', [PedidoController::class, 'destroy'])
        ->name('pedidos.destroy');









    /*
    |--------------------------------------------------------------------------
    | Produtos
    |--------------------------------------------------------------------------
    */



    Route::get('/produtos', [ProdutoController::class, 'index'])
        ->name('produtos.index');




    Route::post('/produtos', [ProdutoController::class, 'store'])
        ->name('produtos.store');




    Route::put('/produtos/{produto}', [ProdutoController::class, 'update'])
        ->name('produtos.update');




    Route::patch('/produtos/{produto}/toggle', [ProdutoController::class, 'toggle'])
        ->name('produtos.toggle');




    Route::delete('/produtos/{produto}', [ProdutoController::class, 'destroy'])
        ->name('produtos.destroy');









    /*
    |--------------------------------------------------------------------------
    | Clientes
    |--------------------------------------------------------------------------
    */



    Route::get('/clientes', [ClienteController::class, 'index'])
        ->name('clientes.index');




    Route::post('/clientes', [ClienteController::class, 'store'])
        ->name('clientes.store');




    Route::put('/clientes/{cliente}', [ClienteController::class, 'update'])
        ->name('clientes.update');




    Route::delete('/clientes/{cliente}', [ClienteController::class, 'destroy'])
        ->name('clientes.destroy');




    Route::patch('/clientes/{cliente}/toggle', [ClienteController::class, 'toggle'])
        ->name('clientes.toggle');









    /*
    |--------------------------------------------------------------------------
    | Administração
    |--------------------------------------------------------------------------
    */



    Route::middleware('admin')->group(function () {




        Route::get('/users', [UserController::class, 'index'])
            ->name('users.index');




        Route::post('/users', [UserController::class, 'store'])
            ->name('users.store');




        Route::put('/users/{user}', [UserController::class, 'update'])
            ->name('users.update');




        Route::delete('/users/{user}', [UserController::class, 'destroy'])
            ->name('users.destroy');




        Route::patch('/users/{user}/toggle-status', [UserController::class, 'toggleStatus'])
            ->name('users.toggleStatus');




    });





});




require __DIR__.'/settings.php';