<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TaskController extends Controller
{

    public function index()
    {

        $with = [
            'user',
            'histories.user'
        ];


        if (auth()->user()->role === 'admin') {


            $tasks = Task::with($with)
                ->orderBy('created_at', 'desc')
                ->get();


        } else {


            $tasks = Task::with($with)
                ->where('user_id', auth()->id())
                ->orderBy('created_at', 'desc')
                ->get();


        }



        $users = User::select(
            'id',
            'name'
        )
        ->where('active', true)
        ->orderBy('name')
        ->get();



        return Inertia::render('Tasks/Index', [

            'tasks' => $tasks,

            'users' => $users,

        ]);

    }

    public function monitoramento()
{
    if (auth()->user()->role !== 'admin') {
        abort(403);
    }

    $tasks = Task::with([
        'user'
    ])
    ->orderBy('created_at', 'desc')
    ->get();

    return Inertia::render('Monitoramento/Index', [
        'tasks' => $tasks,
    ]);
}






    public function store(Request $request)
    {

        $validated = $request->validate([

    'title' => [
        'required',
        'string',
        'max:255'
    ],

    'description' => [
        'nullable',
        'string'
    ],

    'user_id' => [
        'required',
        'exists:users,id'
    ],

    'priority' => [
        'required'
    ],

    'status' => [
        'required'
    ],

    'due_date' => [
        'nullable',
        'date'
    ],

]);



        $task = Task::create($validated);



        $task->histories()->create([

            'user_id' => auth()->id(),

            'action' => 'criada',

            'description' => 'Tarefa criada',

        ]);




        return redirect()
            ->route('tasks.index')
            ->with('success', 'Tarefa criada com sucesso.');

    }








    public function update(Request $request, Task $task)
{

    if (
        auth()->user()->role !== 'admin'
    ) {
        abort(403);
    }


    $validated = $request->validate([

            'title' => [
                'required',
                'string',
                'max:255'
            ],

            'description' => [
                'nullable',
                'string'
            ],

            'user_id' => [
                'required',
                'exists:users,id'
            ],

            'priority' => [
                'required'
            ],

            'status' => [
                'required'
            ],

            'due_date' => [
                'nullable',
                'date'
            ],

        ]);



        $task->update($validated);



        return redirect()
            ->route('tasks.index')
            ->with('success', 'Tarefa atualizada.');

    }








    public function updateStatus(Request $request, Task $task)
    {

        $validated = $request->validate([

            'status' => [
                'required',
                'in:pendente,andamento,concluida'
            ],

            'completion_note' => [
                'nullable',
                'string'
            ],

        ]);



        if (
            auth()->user()->role !== 'admin'
            &&
            $task->user_id !== auth()->id()
        ) {

            abort(403);

        }






        if ($validated['status'] === 'concluida') {



            if (
                empty($validated['completion_note'])
                &&
                auth()->user()->role !== 'admin'
            ) {

                return back()
                    ->withErrors([
                        'completion_note' =>
                        'Informe o que foi realizado antes de concluir.'
                    ]);

            }




            $task->update([

                'status' => 'concluida',

                'completion_note' =>
                    $validated['completion_note'] ?? null,

                'completed_at' => now(),

                'completed_by' => auth()->id(),

            ]);





            $task->histories()->create([

                'user_id' => auth()->id(),

                'action' => 'concluida',

'description' =>
    '✅ Tarefa concluída - ' .
    ($validated['completion_note'] ?? 'Sem observação'),

            ]);




        } else {



            $task->update([

                'status' => $validated['status']

            ]);





            $task->histories()->create([

                'user_id' => auth()->id(),

                'action' => $validated['status'],

                'description' =>
                    'Status alterado para ' .
                    $validated['status'],

            ]);


        }





        return back()
            ->with('success', 'Status atualizado.');

    }








    public function destroy(Task $task)
    {

        if (auth()->user()->role !== 'admin') {

            abort(403);

        }



        $task->delete();



        return redirect()
            ->route('tasks.index')
            ->with('success', 'Tarefa removida.');

    }


}