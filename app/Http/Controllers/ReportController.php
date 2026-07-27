<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index()
    {

        $reports = [

            'total' => Task::count(),

            'pending' => Task::where('status', 'pendente')->count(),

            'progress' => Task::where('status', 'andamento')->count(),

            'completed' => Task::where('status', 'concluida')->count(),

        ];


        return Inertia::render('Reports/Index', [
            'reports' => $reports
        ]);

    }
}