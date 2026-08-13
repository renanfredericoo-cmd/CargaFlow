import { useState } from "react";

import { Head, router, usePage } from "@inertiajs/react";

import Button from "@/components/Button";

import ClienteModal from "./Components/ClienteModal";
import ClienteTable from "./Components/ClienteTable";
import EditarClienteModal from "./Components/EditarClienteModal";


interface Cliente {

    id: number;

    nome: string;

    cidade: string;

    estado: string;

    ativo: boolean;

}


interface Props {

    clientes: Cliente[];

}


export default function Index({ clientes }: Props) {

    const { auth } = usePage().props as any;


    const [showModal, setShowModal] = useState(false);

    const [clienteEditando, setClienteEditando] =
        useState<Cliente | null>(null);

    const [busca, setBusca] = useState("");


    const clientesFiltrados = clientes.filter((cliente) =>
        cliente.nome.toLowerCase().includes(busca.toLowerCase())
    );


    function editarCliente(cliente: Cliente) {

        setClienteEditando(cliente);

    }


    function toggleCliente(cliente: Cliente) {

        router.patch(
            `/clientes/${cliente.id}/toggle`
        );

    }


    function excluirCliente(cliente: Cliente) {

        if (!confirm(`Deseja excluir o cliente ${cliente.nome}?`)) {

            return;

        }

        router.delete(
            `/clientes/${cliente.id}`
        );

    }


    return (

        <>

            <Head title="Clientes" />


            <div className="p-4 md:p-6">


                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">


                    <div>

                        <h1 className="text-3xl font-bold">

                            Clientes

                        </h1>


                        <p className="mt-2 text-gray-500">

                            Cadastro de clientes utilizados nos pedidos.

                        </p>

                    </div>


                    <Button

                        className="w-full md:w-auto"

                        variant="primary"

                        onClick={() => setShowModal(true)}

                    >

                        + Novo Cliente

                    </Button>


                </div>


                <div className="mb-4">

                    <input

                        type="text"

                        value={busca}

                        onChange={(e) => setBusca(e.target.value)}

                        placeholder="🔎 Buscar cliente por nome..."

                        className="
                            w-full
                            rounded-md
                            border
                            bg-white
                            px-3
                            py-2
                            text-sm
                            dark:bg-neutral-900
                        "

                    />

                </div>


                <div className="overflow-x-auto rounded-xl border bg-white dark:bg-neutral-900">


                    {clientesFiltrados.length === 0 ? (

                        <div className="p-8 text-center text-gray-500">

                            {busca
                                ? "Nenhum cliente encontrado."
                                : "Nenhum cliente cadastrado."}

                        </div>

                    ) : (


                        <ClienteTable

                            clientes={clientesFiltrados}

                            isAdmin={auth.user?.role === "admin"}

                            onEditar={editarCliente}

                            onToggle={toggleCliente}

                            onExcluir={excluirCliente}

                        />


                    )}


                </div>


                <ClienteModal

                    show={showModal}

                    onClose={() => setShowModal(false)}

                />


                <EditarClienteModal

                    show={clienteEditando !== null}

                    cliente={clienteEditando}

                    onClose={() => setClienteEditando(null)}

                />


            </div>


        </>

    );

}