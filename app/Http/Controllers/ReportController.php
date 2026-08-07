<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

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





    public function pdf(Request $request)
    {

        $query = Task::with('user');



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



        $tasks = $query->get();



        $pdf = Pdf::loadView('reports.pdf', [


            'tasks' => $tasks,



'summary' => [

    'total' => $tasks->count(),

    'pending' => $tasks
        ->where('status', 'pendente')
        ->count(),

    'progress' => $tasks
        ->where('status', 'andamento')
        ->count(),

    'completed' => $tasks
        ->where('status', 'concluida')
        ->count(),

    'overdue' => $tasks
        ->filter(function ($task) {

            return $task->due_date < now()
                && $task->status !== 'concluida';

        })
        ->count(),

],



            'period' => [

                'start' => $request->start_date,

                'end' => $request->end_date,

            ],


        ]);



        return $pdf->stream('relatorio-cargaflow.pdf');

    }


}