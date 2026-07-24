import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/components/Modal';
import Input from '@/components/Input';
import Select from '@/components/Select';
import Button from '@/components/Button';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    active: boolean;
}

interface Props {
    users: User[];
}

export default function Users({ users }: Props) {

    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        role: 'funcionario',
        active: true,
    });


    function openCreate() {
        setEditingUser(null);
        reset();
        setShowModal(true);
    }


    function openEdit(user: User) {
        setEditingUser(user);

        setData({
            name: user.name,
            email: user.email,
            password: '',
            role: user.role,
            active: user.active,
        });

        setShowModal(true);
    }


    function deleteUser(user: User) {

        if (confirm(`Deseja excluir ${user.name}?`)) {
            router.delete(`/users/${user.id}`);
        }

    }


    function toggleStatus(user: User) {

        router.patch(`/users/${user.id}/toggle-status`);

    }


    function submit(e: React.FormEvent) {

        e.preventDefault();

        if (editingUser) {

            put(`/users/${editingUser.id}`, {
                onSuccess: () => {
                    setShowModal(false);
                    reset();
                },
            });

        } else {

            post('/users', {
                onSuccess: () => {
                    setShowModal(false);
                    reset();
                },
            });

        }

    }


    return (
        <>
            <Head title="Usuários" />

            <div className="p-6">

                <div className="mb-8 flex justify-between">

                    <div>
                        <h1 className="text-3xl font-bold">
                            👥 Usuários
                        </h1>

                        <p className="text-gray-500">
                            Gerencie os usuários do TaskFlow.
                        </p>
                    </div>


                    <Button onClick={openCreate}>
                        + Novo Usuário
                    </Button>

                </div>



                <div className="overflow-hidden rounded-xl border bg-white dark:bg-neutral-900">

                    <table className="w-full">

                        <thead className="border-b bg-gray-50 dark:bg-neutral-800">

                            <tr>
                                <th className="p-4 text-left">Nome</th>
                                <th className="p-4 text-left">Email</th>
                                <th className="p-4 text-left">Perfil</th>
                                <th className="p-4 text-left">Status</th>
                                <th className="p-4 text-right">Ações</th>
                            </tr>

                        </thead>


                        <tbody>

                        {users.map(user => (

                            <tr key={user.id} className="border-b">

                                <td className="p-4">
                                    {user.name}
                                </td>

                                <td className="p-4">
                                    {user.email}
                                </td>

                                <td className="p-4">
                                    {user.role === 'admin'
                                        ? 'Administrador'
                                        : 'Funcionário'}
                                </td>

                                <td className="p-4">

                                    {user.active
                                        ? '🟢 Ativo'
                                        : '🔴 Inativo'}

                                </td>


                                <td className="p-4">

                                    <div className="flex justify-end gap-2">


                                        <Button
                                            variant="secondary"
                                            onClick={() => openEdit(user)}
                                        >
                                            Editar
                                        </Button>


                                        <Button
                                            variant="secondary"
                                            onClick={() => toggleStatus(user)}
                                        >
                                            {user.active
                                                ? 'Desativar'
                                                : 'Ativar'}
                                        </Button>


                                        <Button
                                            variant="danger"
                                            onClick={() => deleteUser(user)}
                                        >
                                            Excluir
                                        </Button>


                                    </div>

                                </td>


                            </tr>

                        ))}

                        </tbody>

                    </table>

                </div>



                <Modal
                    show={showModal}
                    title={editingUser ? 'Editar Usuário' : 'Novo Usuário'}
                    onClose={() => setShowModal(false)}
                >

                    <form onSubmit={submit}>


                        <Input
                            label="Nome"
                            value={data.name}
                            onChange={e =>
                                setData('name', e.target.value)
                            }
                            error={errors.name}
                        />


                        <Input
                            label="E-mail"
                            value={data.email}
                            onChange={e =>
                                setData('email', e.target.value)
                            }
                            error={errors.email}
                        />



                        {!editingUser && (

                            <Input
                                label="Senha"
                                type="password"
                                value={data.password}
                                onChange={e =>
                                    setData('password', e.target.value)
                                }
                            />

                        )}



                        <Select
                            label="Perfil"
                            value={data.role}
                            onChange={e =>
                                setData('role', e.target.value)
                            }
                        >

                            <option value="admin">
                                Administrador
                            </option>

                            <option value="funcionario">
                                Funcionário
                            </option>

                        </Select>



                        <div className="mt-6 flex justify-end gap-3">

                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => setShowModal(false)}
                            >
                                Cancelar
                            </Button>


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