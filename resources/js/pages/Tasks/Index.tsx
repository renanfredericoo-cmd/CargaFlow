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





export default function Tasks({ tasks, users }: Props) {


    const { auth } = usePage().props as any;



    const [showModal, setShowModal] = useState(false);


    const [editingTask, setEditingTask] = useState<Task | null>(null);





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

    });





    function openCreate() {


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


    }    function deleteTask(task: Task) {


        if (confirm(`Excluir a tarefa ${task.title}?`)) {


            router.delete(`/tasks/${task.id}`);


        }


    }





    function submit(e: React.FormEvent) {


        e.preventDefault();



        if (editingTask) {


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





    function formatDate(date: string) {


        return new Date(date)
            .toLocaleString('pt-BR');


    }





    function historyIcon(action: string) {


        if (action === 'concluida') {

            return '✅';

        }


        if (action === 'andamento') {

            return '🚀';

        }


        return '📋';

    }    return (

        <>

            <Head title="Tarefas" />


            <div className="p-6">


                <div className="mb-6 flex items-center justify-between">


                    <div>

                        <h1 className="text-2xl font-bold">
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





                <div className="space-y-6">


                    {tasks.map(task => (


                        <div
                            key={task.id}
                            className="rounded-xl border p-5"
                        >



                            <div className="flex justify-between">


                                <div>


                                    <h2 className="text-xl font-bold">

                                        {task.title}

                                    </h2>


                                    <p className="text-gray-500">

                                        👤 {task.user.name}

                                    </p>


                                </div>




                                <span className="rounded bg-gray-100 px-3 py-1">

                                    {task.status}

                                </span>


                            </div>





                            {task.description && (

                                <p className="mt-3">

                                    {task.description}

                                </p>

                            )}





                            <div className="mt-4 grid grid-cols-3 gap-4 text-sm">


                                <div>

                                    <strong>
                                        Prioridade:
                                    </strong>

                                    <br />

                                    {task.priority}

                                </div>



                                <div>

                                    <strong>
                                        Prazo:
                                    </strong>

                                    <br />


                                    {task.due_date

                                        ? new Date(task.due_date)
                                            .toLocaleDateString('pt-BR')

                                        : '-'

                                    }


                                </div>



                                <div className="flex justify-end gap-2">


                                    <Button
                                        variant="secondary"
                                        onClick={() => openEdit(task)}
                                    >

                                        Editar

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


                            </div>                            <div className="mt-6 border-t pt-5">


                                <h3 className="mb-4 text-lg font-bold">

                                    📜 Histórico

                                </h3>




                                <div className="space-y-4">


                                    {task.histories?.map(history => (


                                        <div
                                            key={history.id}
                                            className="relative border-l-2 border-gray-300 pl-5"
                                        >



                                            <div
                                                className={`
                                                    absolute -left-3 
                                                    flex h-6 w-6 
                                                    items-center justify-center 
                                                    rounded-full 
                                                    text-sm
                                                    ${
                                                        history.action === 'concluida'
                                                            ? 'bg-green-500'
                                                            : history.action === 'andamento'
                                                            ? 'bg-yellow-500'
                                                            : 'bg-blue-500'
                                                    }
                                                `}
                                            >

                                                {historyIcon(history.action)}

                                            </div>





                                            <div className="rounded-xl border border-gray-700 bg-[#111827] p-4 shadow-sm">



                                                <div className="font-bold text-white">

                                                    👤 {history.user.name}

                                                </div>




                                                <div className="mt-2 font-medium text-white">


                                                    {history.action === 'criada' && (
                                                        <>
                                                            📋 Criou a tarefa
                                                        </>
                                                    )}



                                                    {history.action === 'andamento' && (
                                                        <>
                                                            🚀 Iniciou a tarefa
                                                        </>
                                                    )}



                                                    {history.action === 'concluida' && (
                                                        <>
                                                            ✅ Concluiu a tarefa
                                                        </>
                                                    )}


                                                </div>





                                                <div className="mt-2 text-sm text-gray-300">


                                                    {history.description}


                                                </div>





                                                <div className="mt-2 text-xs text-gray-400">


                                                    {formatDate(history.created_at)}


                                                </div>


                                            </div>



                                        </div>


                                    ))}


                                </div>


                            </div>                        </div>


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




            </div>


        </>

    );

}