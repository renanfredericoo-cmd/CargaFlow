<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Inertia\Inertia;

class MonitoramentoController extends Controller
{

    public function index()
    {

        $tasks = Task::with('user')
            ->orderBy('created_at', 'desc')
            ->get();


        return Inertia::render('Monitoramento/Index', [
            'tasks' => $tasks
        ]);

    }

}