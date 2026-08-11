import { useState } from "react";

import { Head, router, usePage } from "@inertiajs/react";

import Button from "@/components/Button";

import EmptyState from "./Components/EmptyState";
import PedidoTable from "./Components/PedidoTable";
import PedidoModal from "./Components/PedidoModal";
import EditarPedidoModal from "./Components/EditarPedidoModal";
import EditarTransportadoraModal from "./Components/EditarTransportadoraModal";
import AgendarPedidoModal from "./Components/AgendarPedidoModal";
import CarregarPedidoModal from "./Components/CarregarPedidoModal";
import FaturarPedidoModal from "./Components/FaturarPedidoModal";

import type { Pedido } from "@/types/pedido";



interface Produto {

    id: number;

    descricao: string;

    ativo: boolean;

}





interface Cliente {

    id: number;

    nome: string;

    cidade: string;

    estado: string;

    ativo: boolean;

}





interface Props {

    pedidos: Pedido[];

    produtos: Produto[];

    clientes: Cliente[];

}








export default function Index({

    pedidos,

    produtos,

    clientes,

}: Props) {



    const { auth } = usePage().props as any;





    const [showModal, setShowModal] = useState(false);



    const [pedidoEditando, setPedidoEditando] =
        useState<Pedido | null>(null);


        const [pedidoEditandoTransportadora, setPedidoEditandoTransportadora] =
    useState<Pedido | null>(null);



    const [pedidoAgendando, setPedidoAgendando] =
        useState<Pedido | null>(null);



    const [pedidoCarregando, setPedidoCarregando] =
        useState<Pedido | null>(null);



    const [pedidoFaturando, setPedidoFaturando] =
        useState<Pedido | null>(null);


        const [pedidoReplicando, setPedidoReplicando] =
    useState<Pedido | null>(null);





    const [filtroStatus, setFiltroStatus] = useState("Todos");



    const [busca, setBusca] = useState("");

    const [dataInicial, setDataInicial] = useState("");

    const [dataFinal, setDataFinal] = useState("");









    const pedidosFiltrados = pedidos.filter((pedido) => {



        const statusOk =

            filtroStatus === "Todos" ||

            pedido.status === filtroStatus;







        const nomeCliente =

            typeof pedido.cliente === "object"

                ? pedido.cliente?.nome ?? ""

                : pedido.cliente ?? "";







        const buscaOk =


            pedido.numero_pedido
                ?.toString()
                .includes(busca)

            ||

            pedido.codigo
                ?.toString()
                .includes(busca)

            ||

            nomeCliente
                .toLowerCase()
                .includes(busca.toLowerCase())

            ||

            pedido.destino
                ?.toLowerCase()
                .includes(busca.toLowerCase());







        return statusOk && buscaOk;



    });


function filtrarPeriodo() {

    router.get(
        "/pedidos",
        {
            data_inicial: dataInicial,
            data_final: dataFinal,
        },
        {
            preserveState: true,
            replace: true,
        }
    );

}




function limparPeriodo() {

    setDataInicial("");

    setDataFinal("");

    router.get(
        "/pedidos",
        {},
        {
            preserveState: true,
            replace: true,
        }
    );

}






    function abrirModal() {

        setShowModal(true);

    }







    function editarPedido(pedido: Pedido) {

        setPedidoEditando(pedido);

    }

    


    function editarTransportadora(pedido: Pedido) {
    setPedidoEditandoTransportadora(pedido);
}







    function agendarPedido(pedido: Pedido) {

        setPedidoAgendando(pedido);

    }







    function carregarPedido(pedido: Pedido) {

        setPedidoCarregando(pedido);

    }







    function faturarPedido(pedido: Pedido) {

        setPedidoFaturando(pedido);

    }


    function replicarPedido(pedido: Pedido) {

    setPedidoReplicando(pedido);

}







    function detalhesPedido(pedido: Pedido) {


        router.get(

            `/pedidos/${pedido.id}/detalhes`

        );


    }







    function cancelarPedido(pedido: Pedido) {


        if (!confirm("Deseja cancelar este pedido?")) {

            return;

        }


        router.patch(

            `/pedidos/${pedido.id}/cancelar`

        );


    }







    function excluirPedido(pedido: Pedido) {


        if (!confirm("Deseja realmente excluir este pedido?")) {

            return;

        }


        router.delete(

            `/pedidos/${pedido.id}`

        );


    }









    return (

        <>

            <Head title="Pedidos" />



            <div className="p-2">





                <div className="
                    mb-2
                    flex
                    flex-col
                    gap-3
                    md:flex-row
                    md:items-center
                    md:justify-between
                ">



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

                        onClick={() => setShowModal(true)}

                    >

                        + Novo Pedido

                    </Button>



                </div>

<div className="mb-3 flex flex-col gap-3 md:flex-row md:flex-wrap">

    <select
        value={filtroStatus}
        onChange={(e) => setFiltroStatus(e.target.value)}
        className="rounded-md border px-3 py-2 dark:bg-neutral-900"
    >
        <option value="Todos">
            Todos
        </option>

        <option value="Pedido">
            Pedido
        </option>

        <option value="Agendado">
            Agendado
        </option>

        <option value="Em Carregamento">
            Em Carregamento
        </option>

        <option value="Faturado">
            Faturado
        </option>

        <option value="Cancelado">
            Cancelado
        </option>

    </select>


    <input
    type="date"
    value={dataInicial}
    onChange={(e) => setDataInicial(e.target.value)}
    className="rounded-md border px-3 py-2 bg-white dark:bg-neutral-900"
/>


    <input
    type="date"
    value={dataFinal}
    onChange={(e) => setDataFinal(e.target.value)}
    className="rounded-md border px-3 py-2 bg-white dark:bg-neutral-900"
/>


    <Button
        variant="primary"
        onClick={filtrarPeriodo}
    >
        Filtrar
    </Button>


    <Button
        variant="secondary"
        onClick={limparPeriodo}
    >
        Limpar
    </Button>

</div>





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








                {pedidosFiltrados.length === 0 ? (


                    <EmptyState />



                ) : (



                    <PedidoTable


                        pedidos={pedidosFiltrados}


                        isAdmin={auth.user?.role === "admin"}


                        userRole={auth.user?.role}


                        onEditar={editarPedido}


                        onEditarTransportadora={editarTransportadora}


                        onAgendar={agendarPedido}


                        onCarregar={carregarPedido}


                        onFaturar={faturarPedido}


                        onDetalhes={detalhesPedido}


                        onCancelar={cancelarPedido}


                        onExcluir={excluirPedido}


                        onReplicar={replicarPedido}



                    />



                )}









                <PedidoModal

    show={showModal || pedidoReplicando !== null}

    onClose={() => {
        setShowModal(false);
        setPedidoReplicando(null);
    }}

    produtos={produtos}

    clientes={clientes}

    pedidoReplicar={pedidoReplicando}

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

                <EditarTransportadoraModal
    pedido={pedidoEditandoTransportadora}
    onClose={() => setPedidoEditandoTransportadora(null)}
/>



            </div>


        </>

    );

}