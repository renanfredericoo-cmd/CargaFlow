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




interface Activity {

    id: number;

    action: string;

    description: string;

    created_at: string;


    user: {

        name: string;

    };


    task: {

        title: string;

    };

}





interface Ranking {


    id: number;

    name: string;

    completed_tasks_count: number;


}






interface Props {


    stats: {


        users: number;

        tasks: number;

        pending: number;

        progress: number;

        completed: number;

        overdue: number;

    };



    role: string;



    latestTasks?: Task[];



    activities?: Activity[];



    ranking?: Ranking[];

   
    attentionTasks?: Task[];


}export default function Dashboard({

    stats,

    role,

    latestTasks = [],

    activities = [],

    ranking = [],

    attentionTasks = [],


}: Props) {

    function formatAttentionDate(date: string) {

    const today = new Date();

    const todayDate = today.toISOString().split('T')[0];

    const dueDate = date.split('T')[0];


    const todayTime = new Date(todayDate).getTime();

    const dueTime = new Date(dueDate).getTime();


    const diff = Math.floor(
        (todayTime - dueTime) /
        (1000 * 60 * 60 * 24)
    );


    if (diff > 0) {

        return `🚨 Atrasada há ${diff} ${diff === 1 ? 'dia' : 'dias'}`;

    }


    if (diff === 0) {

        return '⚠️ Vence hoje';

    }


    return '🟢 Dentro do prazo';

}



    const isAdmin = role === 'admin';



    const [selectedTask, setSelectedTask] = useState<number | null>(null);



    const [completionNote, setCompletionNote] = useState('');





    function changeStatus(
        taskId: number,
        status: string
    ) {


        router.patch(
            `/tasks/${taskId}/status`,
            {
                status
            }
        );


    }






    function openCompleteModal(taskId: number) {


        setSelectedTask(taskId);

        setCompletionNote('');


    }






    function completeTask() {


        if (!selectedTask) {

            return;

        }



        router.patch(
            `/tasks/${selectedTask}/status`,
            {

                status: 'concluida',

                completion_note: completionNote,

            },
            {

                onSuccess: () => {

                    setSelectedTask(null);

                    setCompletionNote('');

                }

            }

        );


    }





    function statusColor(status:string) {


        if(status === 'concluida') {

            return 'bg-green-600';

        }


        if(status === 'andamento') {

            return 'bg-blue-600';

        }


        return 'bg-gray-600';


    }





    function priorityColor(priority:string) {


        if(priority === 'alta') {

            return 'bg-red-600';

        }


        if(priority === 'media') {

            return 'bg-yellow-500';

        }


        return 'bg-green-600';


    }





    function formatDate(date:string) {


        return new Date(date)
            .toLocaleString('pt-BR');


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






                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">



                    {isAdmin && (

                        <Card

                            title="👥 Usuários ativos"

                            value={stats.users}

                        />

                    )}





                    <Card

                        title="📋 Total tarefas"

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


<Card

    title="🚨 Atrasadas"

    value={stats.overdue}

    alert={stats.overdue > 0}

/>

                </div>

<div className="mt-8">

    <a
        href="/reports"
        className="block rounded-xl border bg-white p-6 shadow-sm transition hover:shadow-lg hover:bg-gray-50 dark:bg-neutral-900"
    >

        <div className="flex items-center justify-between">

            <div>

                <h2 className="text-xl font-bold">
                    📊 Relatórios
                </h2>

                <p className="mt-2 text-gray-500">
                    Visualize indicadores, desempenho e acompanhamento das tarefas.
                </p>

            </div>


            <div className="text-2xl">
                →
            </div>

        </div>

    </a>

</div>               





<div className="mt-8 rounded-xl border bg-white p-6 dark:bg-neutral-900">

    <h2 className="mb-4 text-xl font-bold">
        🚨 Tarefas que precisam de atenção
    </h2>


    <div className="space-y-3">

        {attentionTasks.length === 0 && (

            <p className="text-gray-500">
                Nenhuma tarefa atrasada.
            </p>

        )}



        {attentionTasks.map(task => (

            <div
                key={task.id}
                className="rounded-lg border p-4"
            >

                <p className="font-semibold">
    OS #{String(task.id).padStart(6, '0')}
</p>

<p className="text-gray-500">
    {task.title}
</p>


                <p className="text-sm text-gray-500">
                    👤 {task.user.name}
                </p>

                <p className="text-sm font-semibold">
    🔥 Prioridade: {task.priority}
</p>


                <p className="text-sm text-red-500">

    {formatAttentionDate(task.due_date!)}

                </p>

            </div>

        ))}

    </div>

</div>

                <div className="mt-8 rounded-xl border bg-white p-6 dark:bg-neutral-900">


                    <h2 className="mb-5 text-xl font-bold">

                        📝 Tarefas recentes

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
    OS #{String(task.id).padStart(6, '0')}
</h3>

<p className="text-gray-500">
    {task.title}
</p>




                                        <p className="text-sm text-gray-500">

                                            👤 {task.user.name}

                                        </p>


                                    </div>





                                    <div className="flex flex-col gap-2">



                                        <span

                                            className={`rounded-lg px-3 py-1 text-center text-sm font-semibold text-white ${priorityColor(task.priority)}`}

                                        >

                                            {task.priority}

                                        </span>





                                        <span

                                            className={`rounded-lg px-3 py-1 text-center text-sm font-semibold text-white ${statusColor(task.status)}`}

                                        >

                                            {task.status}

                                        </span>



                                    </div>



                                </div>                                {task.due_date && (

                                    <p className="mt-3 text-sm text-gray-500">

                                        📅 Prazo:

                                        {' '}

                                        {new Date(task.due_date)
                                            .toLocaleDateString('pt-BR')}

                                    </p>

                                )}






                                {task.status === 'concluida' && task.completion_note && (


                                    <div className="mt-4 rounded-lg border border-gray-700 bg-neutral-800 p-4 text-sm">


                                        <p className="font-semibold">

                                            📝 Resultado da execução:

                                        </p>




                                        <p className="mt-2 text-gray-600 dark:text-gray-300">

                                            {task.completion_note}

                                        </p>





                                        {task.completedBy && (

                                            <p className="mt-3 text-gray-500">

                                                ✅ Finalizado por:

                                                {' '}

                                                {task.completedBy.name}

                                            </p>

                                        )}





                                        {task.completed_at && (

                                            <p className="mt-2 text-gray-500">

                                                📅 Data:

                                                {' '}

                                                {formatDate(task.completed_at)}

                                            </p>

                                        )}


                                    </div>

                                )}







                                <div className="mt-5">


                                    {task.status === 'pendente' && (


                                        <button

                                            onClick={() =>
                                                changeStatus(
                                                    task.id,
                                                    'andamento'
                                                )
                                            }

                                            className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white"

                                        >

                                            🚀 Iniciar tarefa

                                        </button>


                                    )}






                                    {task.status === 'andamento' && (


                                        <button

                                            onClick={() =>
                                                openCompleteModal(task.id)
                                            }

                                            className="rounded-lg bg-green-600 px-4 py-2 font-semibold text-white"

                                        >

                                            ✅ Concluir tarefa

                                        </button>


                                    )}


                                </div>



                            </div>


                        ))}



                    </div>


                </div>                <div className="mt-8 grid gap-6 md:grid-cols-2">


                    <div className="rounded-xl border bg-white p-6 dark:bg-neutral-900">


                        <h2 className="mb-4 text-xl font-bold">

                            📜 Últimas atividades

                        </h2>




                        <div className="space-y-3">


                            {activities.map(activity => (


                                <div
                                    key={activity.id}
                                    className="rounded-lg border p-3"
                                >


                                    <p className="font-semibold">

                                        👤 {activity.user.name}

                                    </p>


                                    <p className="text-sm">

                                        {activity.description}

                                    </p>


                                    <p className="text-xs text-gray-500">

                                        {activity.task.title}

                                        {' - '}

                                        {formatDate(activity.created_at)}

                                    </p>


                                </div>


                            ))}


                        </div>


                    </div>







                    {isAdmin && (


                        <div className="rounded-xl border bg-white p-6 dark:bg-neutral-900">


                            <h2 className="mb-4 text-xl font-bold">

                                🏆 Ranking da equipe

                            </h2>





                            <div className="space-y-3">


                                {ranking.map((user, index) => (


                                    <div
                                        key={user.id}
                                        className="flex justify-between rounded-lg border p-3"
                                    >


                                        <span>

                                            {index + 1}º 👤 {user.name}

                                        </span>



                                        <strong>

                                            {user.completed_tasks_count}

                                        </strong>


                                    </div>


                                ))}


                            </div>


                        </div>


                    )}


                </div>







                {selectedTask && (


                    <div className="fixed inset-0 flex items-center justify-center bg-black/50">


                        <div className="w-full max-w-lg rounded-xl bg-white p-6">


                            <h2 className="mb-4 text-xl font-bold">

                                ✅ Finalizar tarefa

                            </h2>




                            <textarea

                                value={completionNote}

                                onChange={(e) =>
                                    setCompletionNote(e.target.value)
                                }

                                className="w-full rounded-lg border p-3 text-black"

                                rows={5}

                                placeholder="Descreva o que foi realizado."

                            />





                            <div className="mt-5 flex justify-end gap-3">


                                <button

                                    onClick={() =>
                                        setSelectedTask(null)
                                    }

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

    alert = false,


}: {

    title:string;

    value:number;

    alert?: boolean;


}) {


    return (

        <div
    className={`rounded-xl border p-4 sm:p-6 shadow-sm dark:bg-neutral-900 ${
        title.includes('Pendentes')
            ? 'border-yellow-500 bg-yellow-950/20'
            : title.includes('Em andamento')
            ? 'border-blue-500 bg-blue-950/20'
            : title.includes('Concluídas')
            ? 'border-green-500 bg-green-950/20'
            : title.includes('Atrasadas')
            ? 'border-red-500 bg-red-950/20'
            : title.includes('Usuários')
            ? 'border-purple-500 bg-purple-950/20'
            : 'bg-white'
    }`}
>


            <h2 className="text-sm text-gray-500">

                {title}

            </h2>




            <p className="mt-3 text-2xl sm:text-3xl font-bold">

                {value}

            </p>


        </div>

    );


}