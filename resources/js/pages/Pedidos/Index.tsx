import { useState } from "react";
import { Head, router, usePage } from "@inertiajs/react";

import Button from "@/components/Button";

import EmptyState from "./Components/EmptyState";
import PedidoTable from "./Components/PedidoTable";
import PedidoModal from "./Components/PedidoModal";
import EditarPedidoModal from "./Components/EditarPedidoModal";
import AgendarPedidoModal from "./Components/AgendarPedidoModal";
import CarregarPedidoModal from "./Components/CarregarPedidoModal";
import FaturarPedidoModal from "./Components/FaturarPedidoModal";

import type { Pedido } from "@/types/pedido";


interface Produto {
    id: number;
    descricao: string;
    ativo: boolean;
}


interface Props {
    pedidos: Pedido[];
    produtos: Produto[];
}



export default function Index({ pedidos, produtos }: Props) {


    console.log("PEDIDOS RECEBIDOS:", pedidos);


    const { auth } = usePage().props as any;



    const [showModal, setShowModal] = useState(false);

    const [pedidoEditando, setPedidoEditando] = useState<Pedido | null>(null);

    const [pedidoAgendando, setPedidoAgendando] = useState<Pedido | null>(null);

    const [pedidoCarregando, setPedidoCarregando] = useState<Pedido | null>(null);

    const [pedidoFaturando, setPedidoFaturando] = useState<Pedido | null>(null);


    const [filtroStatus, setFiltroStatus] = useState("Todos");

    const [busca, setBusca] = useState("");




    const pedidosFiltrados = pedidos.filter((pedido) => {


        const statusOk =
            filtroStatus === "Todos" ||
            pedido.status === filtroStatus;



        const buscaOk =
            pedido.numero_pedido?.toString().includes(busca) ||
            pedido.codigo?.toString().includes(busca) ||
            pedido.cliente?.toLowerCase().includes(busca.toLowerCase()) ||
            pedido.destino?.toLowerCase().includes(busca.toLowerCase());



        return statusOk && buscaOk;


    });





    const contarStatus = (status: string) => {


        if (status === "Todos") {

            return pedidos.length;

        }


        return pedidos.filter(
            (pedido) => pedido.status === status
        ).length;


    };





    function abrirModal() {

        setShowModal(true);

    }



    function fecharModal() {

        setShowModal(false);

    }




    function editarPedido(pedido: Pedido) {

        setPedidoEditando(pedido);

    }



    function agendarPedido(pedido: Pedido) {

        setPedidoAgendando(pedido);

    }



    function carregarPedido(pedido: Pedido) {

        console.log("CLIQUE CARREGAR", pedido);

        setPedidoCarregando(pedido);

    }



    function faturarPedido(pedido: Pedido) {

        console.log("CLIQUE FATURAR", pedido);

        setPedidoFaturando(pedido);

    }




    function cancelarPedido(pedido: Pedido) {


        if (!confirm("Deseja cancelar este pedido?")) {

            return;

        }


        router.patch(`/pedidos/${pedido.id}/cancelar`);


    }





    function excluirPedido(pedido: Pedido) {


        if (!confirm("Deseja realmente excluir este pedido?")) {

            return;

        }


        router.delete(`/pedidos/${pedido.id}`);


    }





    return (

        <>

            <Head title="Pedidos" />


            <div className="p-2">


                <div className="mb-1 flex items-center justify-between">


                    <div>

                        <h1 className="text-xl font-bold">
                            📦 Pedidos
                        </h1>


                        <p className="text-xs text-gray-500">
                            Gerencie todos os pedidos de carregamento.
                        </p>

                    </div>



                    <Button
                        variant="primary"
                        onClick={abrirModal}
                    >

                        + Novo Pedido

                    </Button>


                </div>



                <div className="mb-2">

                    <input

                        type="text"

                        value={busca}

                        onChange={(e) => setBusca(e.target.value)}

                        placeholder="🔎 Buscar pedido, cliente ou destino..."

                        className="
                            w-full
                            rounded-md
                            border
                            px-3
                            py-2
                            text-sm
                            dark:bg-neutral-900
                        "

                    />

                </div>



                <div className="mb-1 flex gap-1 flex-wrap">


                    {[
                        "Todos",
                        "Pedido",
                        "Agendado",
                        "Em Carregamento",
                        "Faturado",
                        "Cancelado",
                    ].map((status) => (


                        <button

                            key={status}

                            onClick={() => setFiltroStatus(status)}

                            className={`
                                rounded-md
                                px-3
                                py-1
                                text-xs
                                font-semibold
                                ${
                                    filtroStatus === status
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-200 text-gray-800"
                                }
                            `}

                        >

                            {status} ({contarStatus(status)})

                        </button>


                    ))}


                </div>





                {pedidosFiltrados.length === 0 ? (

                    <EmptyState />

                ) : (

                    <PedidoTable

                        pedidos={pedidosFiltrados}

                        isAdmin={auth.user?.role === "admin"}

                        onEditar={editarPedido}

                        onAgendar={agendarPedido}

                        onCarregar={carregarPedido}

                        onFaturar={faturarPedido}

                        onCancelar={cancelarPedido}

                        onExcluir={excluirPedido}

                    />

                )}




                <PedidoModal

                    show={showModal}

                    onClose={fecharModal}

                    produtos={produtos}

                />




                <EditarPedidoModal

                    pedido={pedidoEditando}

                    produtos={produtos}

                    onClose={() => setPedidoEditando(null)}

                />




                <AgendarPedidoModal

                    pedido={pedidoAgendando}

                    onClose={() => setPedidoAgendando(null)}

                />




                <CarregarPedidoModal

                    pedido={pedidoCarregando}

                    onClose={() => setPedidoCarregando(null)}

                />




                <FaturarPedidoModal

                    pedido={pedidoFaturando}

                    onClose={() => setPedidoFaturando(null)}

                />


            </div>


        </>

    );

}