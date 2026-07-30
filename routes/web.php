<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ReportController;
use Illuminate\Support\Facades\Route;


Route::inertia('/', 'welcome')
    ->name('home');



Route::middleware(['auth', 'verified'])->group(function () {



    // Dashboard

    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');




    // Relatórios

    Route::get('/reports', [ReportController::class, 'index'])
        ->name('reports.index');


    Route::get('/reports/pdf', [ReportController::class, 'pdf'])
        ->name('reports.pdf');






    // ADMIN

    Route::middleware('admin')->group(function () {



        // Usuários

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




        // Monitoramento Kanban

        Route::get('/monitoramento', [TaskController::class, 'monitoramento'])
            ->name('monitoramento.index');



    });






    // Tarefas


    Route::get('/tasks', [TaskController::class, 'index'])
        ->name('tasks.index');



    Route::post('/tasks', [TaskController::class, 'store'])
        ->name('tasks.store');



    Route::put('/tasks/{task}', [TaskController::class, 'update'])
        ->name('tasks.update');



    Route::patch('/tasks/{task}/status', [TaskController::class, 'updateStatus'])
        ->name('tasks.updateStatus');



    Route::delete('/tasks/{task}', [TaskController::class, 'destroy'])
        ->name('tasks.destroy');



});



require __DIR__.'/settings.php';