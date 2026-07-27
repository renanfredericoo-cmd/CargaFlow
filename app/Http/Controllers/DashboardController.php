<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\User;
use App\Models\TaskHistory;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();



        if ($user->role === 'admin') {


            $stats = [

                'users' => User::where('active', true)->count(),

                'tasks' => Task::count(),

                'pending' => Task::where('status', 'pendente')->count(),

                'progress' => Task::where('status', 'andamento')->count(),

                'completed' => Task::where('status', 'concluida')->count(),
'overdue' => Task::whereNotNull('due_date')
    ->whereDate('due_date', '<', now())
    ->where('status', '!=', 'concluida')
    ->count(),

];

            



            $latestTasks = Task::with([
                'user',
                'completedBy'
            ])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();
$attentionTasks = Task::with('user')
    ->where('status', '!=', 'concluida')
    ->whereNotNull('due_date')
    ->whereDate('due_date', '<=', now())
    ->orderBy('due_date')
    ->limit(5)
    ->get();


            $activities = TaskHistory::with([
                'user',
                'task'
            ])
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();



            $ranking = User::withCount([
                'completedTasks'
            ])
            ->orderBy(
                'completed_tasks_count',
                'desc'
            )
            ->limit(5)
            ->get();



        } else {


            $stats = [

                'users' => 0,

                'tasks' => Task::where(
                    'user_id',
                    $user->id
                )->count(),

                'pending' => Task::where('user_id', $user->id)
                    ->where('status', 'pendente')
                    ->count(),

                'progress' => Task::where('user_id', $user->id)
                    ->where('status', 'andamento')
                    ->count(),

                'completed' => Task::where('user_id', $user->id)
                    ->where('status', 'concluida')
                    ->count(),

            ];



            $latestTasks = Task::with([
                'user',
                'completedBy'
            ])
            ->where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();



            $activities = TaskHistory::with([
                'user',
                'task'
            ])
            ->where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();



            $ranking = [];

        }




        return Inertia::render('dashboard', [

            'stats' => $stats,

            'role' => $user->role,

            'latestTasks' => $latestTasks,

            'activities' => $activities,

            'ranking' => $ranking,

            'attentionTasks' => $attentionTasks,

        ]);

    }
}