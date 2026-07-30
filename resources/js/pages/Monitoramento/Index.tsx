import { Head } from '@inertiajs/react';


interface Task {

    id: number;
    title: string;
    description?: string;
    status: string;
    priority: string;
    due_date?: string | null;

    user?: {
        name: string;
    };

}


interface Props {

    tasks: Task[];

}



export default function Monitoramento({ tasks }: Props) {


    const vencidas = tasks
    .filter(
        task =>
            task.status !== 'concluida' &&
            task.due_date &&
            new Date(task.due_date) < new Date()
    )
    .sort(
        (a, b) =>
            new Date(a.due_date!).getTime() -
            new Date(b.due_date!).getTime()
    );


    const andamento = tasks.filter(
        task => task.status === 'andamento'
    );


    const concluidas = tasks.filter(
        task => task.status === 'concluida'
    );



    function Card({ task }: { task: Task }) {

        return (

            <div className="mb-4 rounded-xl border border-neutral-700 bg-neutral-900 p-4 shadow">


                <h3 className="mb-3 font-bold text-white">
                    {task.title}
                </h3>



                {task.user && (

                    <p className="text-sm text-gray-400">
                        👤 {task.user.name}
                    </p>

                )}



                <p className="mt-1 text-sm text-gray-400">
                    Prioridade: {task.priority}
                </p>



                {task.due_date && (

    <>
        <p className="mt-1 text-sm text-gray-400">
            📅 {new Date(task.due_date).toLocaleDateString('pt-BR')}
        </p>


        {task.status !== 'concluida' &&
            new Date(task.due_date) < new Date() && (

            <p className="mt-1 text-sm text-red-400">
                🔴 Atrasada há {
                    Math.floor(
                        (
                            new Date().getTime() -
                            new Date(task.due_date).getTime()
                        ) /
                        (1000 * 60 * 60 * 24)
                    )
                } dias
            </p>

        )}

    </>

)}


            </div>

        );

    }



    return (

        <>

            <Head title="Monitoramento" />


            <div className="p-6">


                <h1 className="mb-8 text-3xl font-bold text-white">
                    📊 Monitoramento de Tarefas
                </h1>



                <div className="grid gap-6 md:grid-cols-3">



                    {/* VENCIDAS */}

<div className="rounded-xl bg-neutral-800 p-5 border-2 border-red-500">


                        <h2 className="mb-5 text-xl font-bold text-red-400">

                            <span className="mr-2 text-red-500">
                                ●
                            </span>

                            Vencidas ({vencidas.length})

                        </h2>



                        {vencidas.map(task => (

                            <Card
                                key={task.id}
                                task={task}
                            />

                        ))}


                    </div>





                    {/* ANDAMENTO */}

<div className="rounded-xl bg-neutral-800 p-5">


    <h2 className="mb-5 text-xl font-bold text-white">


        <span className="mr-2 text-yellow-500">
            ●
        </span>


        Em andamento ({andamento.length})


    </h2>



    {andamento.length === 0 && (

    <p className="mt-4 text-sm text-gray-300">
        Nenhuma tarefa em andamento
    </p>

)}




    {andamento.map(task => (

        <Card
            key={task.id}
            task={task}
        />

    ))}


</div>





                    {/* CONCLUÍDAS */}

                    <div className="rounded-xl bg-neutral-800 p-5 min-h-[220px]">


                        <h2 className="mb-5 text-xl font-bold text-white">


                            <span className="mr-2 text-green-500">
                                ●
                            </span>


                            Concluídas ({concluidas.length})

</h2>


{concluidas.length === 0 && (

    <p className="text-sm text-gray-500">
        Nenhuma tarefa concluída
    </p>

)}


{concluidas.map(task => (

    <Card
        key={task.id}
        task={task}
    />

))}


                    </div>



                </div>


            </div>


        </>

    );

}