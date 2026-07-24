import { Head, router } from '@inertiajs/react';
import { useState } from 'react';


interface Task {

    id: number;
    title: string;
    priority: string;
    status: string;
    due_date: string | null;

    completion_note: string | null;
    completed_at: string | null;

    completedBy?: {
        name: string;
    } | null;


    user: {
        name: string;
    };

}



interface Props {

    stats: {

        users: number;
        tasks: number;
        pending: number;
        progress: number;
        completed: number;

    };

    role: string;

    latestTasks?: Task[];

}





export default function Dashboard({

    stats,
    role,
    latestTasks = [],

}: Props) {


    const isAdmin = role === 'admin';



    const [selectedTask, setSelectedTask] = useState<number | null>(null);

    const [completionNote, setCompletionNote] = useState('');





    function changeStatus(taskId: number, status: string) {


        router.patch(`/tasks/${taskId}/status`, {

            status,

        });


    }





    function openCompleteModal(taskId: number) {

        setSelectedTask(taskId);

        setCompletionNote('');

    }





    function completeTask() {


        if (!selectedTask) {
            return;
        }



        router.patch(`/tasks/${selectedTask}/status`, {

            status: 'concluida',

            completion_note: completionNote,

        }, {

            onSuccess: () => {

                setSelectedTask(null);

                setCompletionNote('');

            }

        });


    }    return (

        <>

            <Head title="Dashboard" />


            <div className="p-6">


                <div className="mb-8">

                    <h1 className="text-3xl font-bold">
                        📊 Dashboard
                    </h1>


                    <p className="text-gray-500">

                        {isAdmin
                            ? 'Visão geral do sistema.'
                            : 'Visão das suas tarefas.'
                        }

                    </p>

                </div>





                <div className="grid gap-4 md:grid-cols-5">


                    {isAdmin && (

                        <Card
                            title="👥 Usuários ativos"
                            value={stats.users}
                        />

                    )}



                    <Card
                        title={isAdmin ? '📋 Total tarefas' : '📋 Minhas tarefas'}
                        value={stats.tasks}
                    />


                    <Card
                        title="⏳ Pendentes"
                        value={stats.pending}
                    />


                    <Card
                        title="🚀 Em andamento"
                        value={stats.progress}
                    />


                    <Card
                        title="✅ Concluídas"
                        value={stats.completed}
                    />


                </div>






                <div className="mt-8 rounded-xl border bg-white p-6 dark:bg-neutral-900">


                    <h2 className="mb-5 text-xl font-bold">
                        📝 Tarefas
                    </h2>




                    <div className="space-y-4">


                        {latestTasks.map(task => (


                            <div
                                key={task.id}
                                className="rounded-xl border p-5"
                            >



                                <div className="flex justify-between">


                                    <div>


                                        <h3 className="text-lg font-bold">
                                            📋 {task.title}
                                        </h3>


                                        <p className="text-sm text-gray-500">
                                            👤 {task.user.name}
                                        </p>



                                        {task.due_date && (

    <p className="text-sm text-gray-500">

        📅 Prazo:
        {' '}
        {new Date(task.due_date)
            .toLocaleDateString('pt-BR')}

    </p>

)}



{task.status === 'concluida' && task.completion_note && (

    <div className="mt-4 rounded-lg bg-gray-100 p-4 text-sm dark:bg-neutral-800">

        <p className="font-semibold">
            📝 O que foi realizado:
        </p>


        <p className="mt-2 text-gray-600 dark:text-gray-300">
            {task.completion_note}
        </p>



        {task.completedBy && (

            <p className="mt-3 text-gray-500">
                ✅ Finalizado por: {task.completedBy.name}
            </p>

        )}



        {task.completed_at && (

            <p className="text-gray-500">

                📅 Data:
                {' '}
                {new Date(task.completed_at)
                    .toLocaleString('pt-BR')}

            </p>

        )}

    </div>

)}


                                    </div>





                                    <div className="flex flex-col gap-2">


                                        <span
                                            className={`
                                                rounded-lg px-3 py-1 text-center text-sm font-semibold
                                                ${
                                                    task.priority === 'alta'
                                                    ? 'bg-red-600 text-white'
                                                    : task.priority === 'media'
                                                    ? 'bg-yellow-500 text-white'
                                                    : 'bg-green-600 text-white'
                                                }
                                            `}
                                        >
                                            {task.priority}
                                        </span>



                                        <span
                                            className={`
                                                rounded-lg px-3 py-1 text-center text-sm font-semibold
                                                ${
                                                    task.status === 'pendente'
                                                    ? 'bg-gray-600 text-white'
                                                    : task.status === 'andamento'
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-green-600 text-white'
                                                }
                                            `}
                                        >
                                            {task.status}
                                        </span>


                                    </div>



                                </div>





                                <div className="mt-4">


                                    {task.status === 'pendente' && (

                                        <button
                                            onClick={() =>
                                                changeStatus(task.id, 'andamento')
                                            }
                                            className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
                                        >
                                            🚀 Iniciar tarefa
                                        </button>

                                    )}






                                    {task.status === 'andamento' && (

                                        <button
                                            onClick={() =>
                                                openCompleteModal(task.id)
                                            }
                                            className="rounded-lg bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700"
                                        >
                                            ✅ Concluir tarefa
                                        </button>

                                    )}



                                </div>



                            </div>


                        ))}



                    </div>



                </div>





                {selectedTask && (

                    <div className="fixed inset-0 flex items-center justify-center bg-black/50">


                        <div className="w-full max-w-lg rounded-xl bg-white p-6">


                            <h2 className="mb-4 text-xl font-bold">

                                ✅ Finalizar tarefa

                            </h2>



                            <p className="mb-3 text-gray-600">

                                Descreva o que foi realizado:

                            </p>



                            <textarea
    value={completionNote}
    onChange={(e) =>
        setCompletionNote(e.target.value)
    }
    className="w-full rounded-lg border border-gray-300 bg-white p-3 text-black placeholder:text-gray-400"
    rows={5}
    placeholder="Ex: Equipamento instalado, testado e funcionando."
/>




                            <div className="mt-5 flex justify-end gap-3">


                                <button
                                    onClick={() => setSelectedTask(null)}
                                    className="rounded-lg bg-gray-300 px-4 py-2"
                                >
                                    Cancelar
                                </button>



                                <button
                                    onClick={completeTask}
                                    className="rounded-lg bg-green-600 px-4 py-2 text-white"
                                >
                                    Finalizar
                                </button>


                            </div>


                        </div>


                    </div>

                )}



            </div>


        </>

    );

}





function Card({

    title,
    value,

}: {

    title: string;
    value: number;

}) {


    return (

        <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-neutral-900">

            <h2 className="text-sm text-gray-500">
                {title}
            </h2>


            <p className="mt-3 text-3xl font-bold">
                {value}
            </p>


        </div>

    );

}