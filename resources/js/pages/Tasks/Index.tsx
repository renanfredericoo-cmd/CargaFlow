import { Head, useForm, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

import Modal from '@/components/Modal';
import Input from '@/components/Input';
import Select from '@/components/Select';
import Button from '@/components/Button';



interface User {

    id: number;

    name: string;

}





interface History {

    id: number;

    action: string;

    description: string;

    created_at: string;


    user: User;

}





interface Task {

    id: number;

    title: string;

    description: string | null;

    priority: string;

    status: string;

    due_date: string | null;


    user: User;


    histories: History[];

}





interface Props {

    tasks: Task[];

    users: User[];

}







export default function Tasks({

    tasks,

    users


}: Props) {



    const { auth } = usePage().props as any;



const printTask = (task: Task) => {
    const priorityText =
    task.priority === 'high'
        ? 'Alta'
        : task.priority === 'medium'
        ? 'Média'
        : 'Baixa';

const statusText =
    task.status === 'pending'
        ? 'Pendente'
        : task.status === 'in_progress'
        ? 'Em andamento'
        : task.status === 'completed'
        ? 'Concluída'
        : task.status;

const dueDate = task.due_date
    ? new Date(task.due_date).toLocaleDateString('pt-BR')
    : '';
    const content = `
        <html>
        <head>
            <title>TaskFlow - Tarefa</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    padding: 40px;
                    color: #222;
                }

                h1 {
                    color: #2563eb;
                }

                .item {
                    margin-bottom: 12px;
                }
            </style>
        </head>

        <body>

            <h1>TaskFlow</h1>

            <h2>${task.title}</h2>

            <div class="item">
                <strong>Prioridade:</strong>
                ${priorityText}
            </div>

            <div class="item">
                <strong>Status:</strong>
${statusText}
            </div>

            <div className="item">
    <strong>Prazo:</strong>
    ${dueDate}
</div>

            <div class="item">
                <strong>Descrição:</strong>
                <br>
                ${task.description ?? ''}
            </div>

        </body>
        </html>
    `;


    const win = window.open('', '_blank');

    if (win) {
        win.document.write(content);
        win.document.close();
        win.print();
    }
};




    const [showModal, setShowModal] = useState(false);



    const [editingTask, setEditingTask] = useState<Task | null>(null);





    const [search, setSearch] = useState('');

    const [filterStatus, setFilterStatus] = useState('');

    const [filterPriority, setFilterPriority] = useState('');

    const [filterUser, setFilterUser] = useState('');







    const {

        data,

        setData,

        post,

        put,

        processing,

        reset


    } = useForm({


        title: '',

        description: '',

        user_id: '',

        priority: 'media',

        status: 'pendente',

        due_date: '',


    });function openCreate() {


    setEditingTask(null);

    reset();

    setShowModal(true);


}






function openEdit(task: Task) {


    setEditingTask(task);


    setData({

        title: task.title,

        description: task.description ?? '',

        user_id: String(task.user.id),

        priority: task.priority,

        status: task.status,

        due_date: task.due_date ?? '',

    });



    setShowModal(true);


}







function deleteTask(task: Task) {


    if(confirm(`Excluir a tarefa ${task.title}?`)) {


        router.delete(`/tasks/${task.id}`);


    }


}







function submit(e: React.FormEvent) {


    e.preventDefault();



    if(editingTask) {


        put(`/tasks/${editingTask.id}`, {


            onSuccess: () => {


                setShowModal(false);

                setEditingTask(null);

                reset();


            }


        });



    } else {



        post('/tasks', {


            onSuccess: () => {


                setShowModal(false);

                reset();


            }


        });



    }


}







function formatDate(date:string) {


    return new Date(date)
        .toLocaleString('pt-BR');


}
function dueStatus(date: string | null) {

    if (!date) {
        return null;
    }


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

        return {
            text: `🚨 Atrasada há ${diff} ${diff === 1 ? 'dia' : 'dias'}`,
            color: 'bg-red-600 text-white'
        };

    }


    if (diff === 0) {

        return {
            text: '⚠️ Vence hoje',
            color: 'bg-yellow-500 text-white'
        };

    }


    return {
        text: '🟢 Dentro do prazo',
        color: 'bg-green-600 text-white'
    };

}





function historyIcon(action:string) {


    if(action === 'concluida') {

        return '✅';

    }


    if(action === 'andamento') {

        return '🚀';

    }


    return '📋';


}function statusColor(status:string) {


    if(status === 'concluida') {

        return 'bg-green-600 text-white';

    }


    if(status === 'andamento') {

        return 'bg-blue-600 text-white';

    }


    return 'bg-gray-600 text-white';


}







function priorityColor(priority:string) {


    if(priority === 'alta') {

        return 'bg-red-600 text-white';

    }


    if(priority === 'media') {

        return 'bg-yellow-500 text-white';

    }


    return 'bg-green-600 text-white';


}







const filteredTasks = tasks.filter(task => {


    const matchSearch =

        task.title
            .toLowerCase()
            .includes(
                search.toLowerCase()
            );




    const matchStatus =

        !filterStatus ||

        task.status === filterStatus;




    const matchPriority =

        !filterPriority ||

        task.priority === filterPriority;





    const matchUser =

        !filterUser ||

        String(task.user.id) === filterUser;




    return (

        matchSearch &&

        matchStatus &&

        matchPriority &&

        matchUser

    );


});







return (

    <>

        <Head title="Tarefas" />


        <div className="p-6"></div>            <div className="mb-6 flex items-center justify-between">


                <div>

                    <h1 className="text-3xl font-bold">

                        📋 Tarefas

                    </h1>


                    <p className="text-gray-500">

                        Gerenciamento de tarefas

                    </p>


                </div>





                {auth.user.role === 'admin' && (


                    <Button onClick={openCreate}>

                        + Nova Tarefa

                    </Button>


                )}


            </div>






            <div className="mb-6 rounded-xl border bg-white p-5 dark:bg-neutral-900">


                <h2 className="mb-4 text-lg font-bold">

                    🔎 Filtros

                </h2>





                <div className="grid gap-4 md:grid-cols-4">



                    <Input

                        label="Buscar tarefa"

                        value={search}

                        onChange={(e:any) =>
                            setSearch(e.target.value)
                        }

                    />





                    <Select

                        label="Status"

                        value={filterStatus}

                        onChange={(e:any) =>
                            setFilterStatus(e.target.value)
                        }

                    >

                        <option value="">

                            Todos

                        </option>


                        <option value="pendente">

                            Pendente

                        </option>



                        <option value="andamento">

                            Em andamento

                        </option>




                        <option value="concluida">

                            Concluída

                        </option>


                    </Select>






                    <Select

                        label="Prioridade"

                        value={filterPriority}

                        onChange={(e:any) =>
                            setFilterPriority(e.target.value)
                        }

                    >


                        <option value="">

                            Todas

                        </option>


                        <option value="alta">

                            Alta

                        </option>



                        <option value="media">

                            Média

                        </option>



                        <option value="baixa">

                            Baixa

                        </option>



                    </Select>







                    <Select

                        label="Responsável"

                        value={filterUser}

                        onChange={(e:any) =>
                            setFilterUser(e.target.value)
                        }

                    >


                        <option value="">

                            Todos

                        </option>





                        {users.map(user => (


                            <option

                                key={user.id}

                                value={user.id}

                            >

                                {user.name}

                            </option>


                        ))}


                    </Select>


                </div>






                <p className="mt-4 text-sm text-gray-500">

                    Mostrando {filteredTasks.length} tarefa(s)

                </p>


            </div>





            <div className="space-y-6">                {filteredTasks.map(task => (


                    <div

                        key={task.id}

                        className="rounded-xl border bg-white p-6 shadow-sm dark:bg-neutral-900"

                    >



                        <div className="flex justify-between gap-4">


                            <div>


                                <h2 className="text-xl font-bold">

                                    📋 {task.title}

                                </h2>



                                <p className="mt-1 text-gray-500">

                                    👤 {task.user.name}

                                </p>


{task.due_date && (() => {

    const due = dueStatus(task.due_date);

    return due && (

        <span
            className={`mt-2 inline-block rounded-lg px-3 py-1 text-sm font-semibold ${due.color}`}
        >

            📅 {due.text}

        </span>

    );

})()}
                            </div>





                            <div className="flex flex-col gap-2">


                                <span

                                    className={`rounded-lg px-3 py-1 text-center text-sm font-semibold ${priorityColor(task.priority)}`}

                                >

                                    {task.priority}

                                </span>




                                <span

                                    className={`rounded-lg px-3 py-1 text-center text-sm font-semibold ${statusColor(task.status)}`}

                                >

                                    {task.status}

                                </span>



                            </div>



                        </div>







                        {task.description && (

                            <p className="mt-4 text-gray-700 dark:text-gray-300">

                                {task.description}

                            </p>

                        )}







                        <div className="mt-5 flex justify-end gap-2">


                            <Button
    variant="secondary"
    onClick={() => openEdit(task)}
>
    Editar
</Button>

<Button
    variant="secondary"
    onClick={() => printTask(task)}
>
    🖨 Imprimir
</Button>





                            {auth.user.role === 'admin' && (


                                <Button

                                    variant="danger"

                                    onClick={() => deleteTask(task)}

                                >

                                    Excluir

                                </Button>


                            )}


                        </div>






                        <div className="mt-6 border-t pt-5">


                            <h3 className="mb-4 text-lg font-bold">

                                📜 Histórico

                            </h3>





                            {task.histories?.map(history => (


                                <div

                                    key={history.id}

                                    className="mb-4 rounded-xl border border-gray-700 bg-[#111827] p-4"

                                >


                                    <div className="font-bold text-white">

                                        👤 {history.user.name}

                                    </div>



                                    <div className="mt-2 font-semibold text-white">

                                        {historyIcon(history.action)}

                                        {' '}

                                        {history.description}

                                    </div>




                                    <div className="mt-2 text-xs text-gray-400">

                                        {formatDate(history.created_at)}

                                    </div>


                                </div>


                            ))}


                        </div>




                    </div>


                ))}



            </div>






            <Modal

                show={showModal}

                title={
                    editingTask
                        ? 'Editar Tarefa'
                        : 'Nova Tarefa'
                }

                onClose={() => setShowModal(false)}

            >



                <form

                    onSubmit={submit}

                    className="space-y-4"

                >



                    <Input

                        label="Título"

                        value={data.title}

                        onChange={(e:any) =>
                            setData(
                                'title',
                                e.target.value
                            )
                        }

                    />





                    <Input

                        label="Descrição"

                        value={data.description}

                        onChange={(e:any) =>
                            setData(
                                'description',
                                e.target.value
                            )
                        }

                    />





                    <Select

                        label="Responsável"

                        value={data.user_id}

                        onChange={(e:any) =>
                            setData(
                                'user_id',
                                e.target.value
                            )
                        }

                    >


                        <option value="">

                            Selecione

                        </option>




                        {users.map(user => (

                            <option

                                key={user.id}

                                value={user.id}

                            >

                                {user.name}

                            </option>


                        ))}


                    </Select>






                    <Select

                        label="Prioridade"

                        value={data.priority}

                        onChange={(e:any) =>
                            setData(
                                'priority',
                                e.target.value
                            )
                        }

                    >

                        <option value="baixa">

                            Baixa

                        </option>


                        <option value="media">

                            Média

                        </option>


                        <option value="alta">

                            Alta

                        </option>


                    </Select>






                    <Select

                        label="Status"

                        value={data.status}

                        onChange={(e:any) =>
                            setData(
                                'status',
                                e.target.value
                            )
                        }

                    >


                        <option value="pendente">

                            Pendente

                        </option>



                        <option value="andamento">

                            Em andamento

                        </option>



                        <option value="concluida">

                            Concluída

                        </option>


                    </Select>






                    <Input

                        label="Prazo"

                        type="date"

                        value={data.due_date}

                        onChange={(e:any) =>
                            setData(
                                'due_date',
                                e.target.value
                            )
                        }

                    />






                    <div className="flex justify-end">


                        <Button disabled={processing}>

                            Salvar

                        </Button>


                    </div>


                </form>


                        </Modal>

    

    </>

);


}