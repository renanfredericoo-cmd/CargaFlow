<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index(Request $request)
    {

        $query = Task::query();


        if ($request->start_date) {

            $query->whereDate(
                'created_at',
                '>=',
                $request->start_date
            );

        }


        if ($request->end_date) {

            $query->whereDate(
                'created_at',
                '<=',
                $request->end_date
            );

        }


        $reports = [

            'total' => (clone $query)->count(),

            'pending' => (clone $query)
                ->where('status', 'pendente')
                ->count(),

            'progress' => (clone $query)
                ->where('status', 'andamento')
                ->count(),

            'completed' => (clone $query)
                ->where('status', 'concluida')
                ->count(),

            'overdue' => (clone $query)
                ->whereDate('due_date', '<', now())
                ->where('status', '!=', 'concluida')
                ->count(),

        ];


        return Inertia::render('Reports/Index', [
            'reports' => $reports
        ]);

    }
}