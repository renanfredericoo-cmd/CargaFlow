import { useEffect, useState } from "react";

import { Head, router, usePage } from "@inertiajs/react";

import Button from "@/components/Button";
import Modal from "@/components/Modal";

import EmptyState from "./Components/EmptyState";
import PedidoTable from "./Components/PedidoTable";
import PedidoModal from "./Components/PedidoModal";
import EditarPedidoModal from "./Components/EditarPedidoModal";
import EditarTransportadoraModal from "./Components/EditarTransportadoraModal";
import AgendarPedidoModal from "./Components/AgendarPedidoModal";
import CarregarPedidoModal from "./Components/CarregarPedidoModal";
import FaturarPedidoModal from "./Components/FaturarPedidoModal";
import StatusPedidoModal from "./Components/StatusPedidoModal";

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


interface Vendedor {
    id: number;
    name: string;
}


interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}


interface PaginatedPedidos {
    data: Pedido[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    links: PaginationLink[];
}


interface Props {
    pedidos: PaginatedPedidos;
    produtos: Produto[];
    clientes: Cliente[];
    vendedores: Vendedor[];
}


export default function Index({
    pedidos,
    produtos,
    clientes,
    vendedores,
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


    const [pedidoVisualizando, setPedidoVisualizando] =
        useState<Pedido | null>(null);


    const [pedidoReplicando, setPedidoReplicando] =
        useState<Pedido | null>(null);

    const [pedidoCancelando, setPedidoCancelando] =
        useState<Pedido | null>(null);

    const [motivoCancelamento, setMotivoCancelamento] =
        useState("");


    const [filtroStatus, setFiltroStatus] =
        useState("Todos");


    const [busca, setBusca] =
        useState("");


    const [dataInicial, setDataInicial] =
        useState("");


    const [dataFinal, setDataFinal] =
        useState("");

        useEffect(() => {
    const timer = setTimeout(() => {
        carregarPedidos(
            filtroStatus,
            busca,
            dataInicial,
            dataFinal,
            1
        );
    }, 500);

    return () => clearTimeout(timer);
}, [busca]);

useEffect(() => {

    const algumModalAberto =
        showModal ||
        pedidoEditando !== null ||
        pedidoEditandoTransportadora !== null ||
        pedidoAgendando !== null ||
        pedidoCarregando !== null ||
        pedidoFaturando !== null ||
        pedidoVisualizando !== null ||
        pedidoReplicando !== null ||
        pedidoCancelando !== null;

    if (algumModalAberto) {
        return;
    }

    const intervalo = setInterval(() => {

        carregarPedidos(
            filtroStatus,
            busca,
            dataInicial,
            dataFinal,
            pedidos.current_page
        );

    }, 5000);

    return () => clearInterval(intervalo);

}, [
    filtroStatus,
    busca,
    dataInicial,
    dataFinal,
    pedidos.current_page,
    showModal,
    pedidoEditando,
    pedidoEditandoTransportadora,
    pedidoAgendando,
    pedidoCarregando,
    pedidoFaturando,
    pedidoVisualizando,
    pedidoReplicando,
    pedidoCancelando,
]);


    /*
    |--------------------------------------------------------------------------
    | Carregar pedidos com filtros
    |--------------------------------------------------------------------------
    */

    function carregarPedidos(
        status = filtroStatus,
        termo = busca,
        inicial = dataInicial,
        final = dataFinal,
        page = 1
    ) {

        router.get(
            "/pedidos",
            {
                status,
                busca: termo,
                data_inicial: inicial,
                data_final: final,
                page,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            }
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Busca
    |--------------------------------------------------------------------------
    */

    


    /*
    |--------------------------------------------------------------------------
    | Filtro de status
    |--------------------------------------------------------------------------
    */

    function alterarStatus(status: string) {

        setFiltroStatus(status);

        carregarPedidos(
            status,
            busca,
            dataInicial,
            dataFinal,
            1
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Filtro de período
    |--------------------------------------------------------------------------
    */

    function filtrarPeriodo() {

        carregarPedidos(
            filtroStatus,
            busca,
            dataInicial,
            dataFinal,
            1
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Limpar filtros
    |--------------------------------------------------------------------------
    */

    function limparPeriodo() {

        setDataInicial("");
        setDataFinal("");

        carregarPedidos(
            filtroStatus,
            busca,
            "",
            "",
            1
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Ações
    |--------------------------------------------------------------------------
    */

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

    function voltarParaPedido(pedido: Pedido) {
    if (
        !window.confirm(
            "Deseja realmente voltar este pedido para o status Pedido?"
        )
    ) {
        return;
    }

    router.patch(
        `/pedidos/${pedido.id}/voltar-para-pedido`,
        {},
        {
            preserveScroll: true,
        }
    );
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


    function visualizarPedido(pedido: Pedido) {
        setPedidoVisualizando(pedido);
    }


    function cancelarPedido(pedido: Pedido) {
        setPedidoCancelando(pedido);
        setMotivoCancelamento("");
    }


    function confirmarCancelamento() {
        if (!pedidoCancelando) {
            return;
        }

        const motivo = motivoCancelamento.trim();

        if (!motivo) {
            return;
        }

        router.patch(
            `/pedidos/${pedidoCancelando.id}/cancelar`,
            {
                motivo_cancelamento: motivo,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setPedidoCancelando(null);
                    setMotivoCancelamento("");

                    router.reload({
                        only: ["pedidos"],
                    });
                },
            }
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


    /*
    |--------------------------------------------------------------------------
    | Paginação
    |--------------------------------------------------------------------------
    */

    function irParaPagina(url: string | null) {

        if (!url) {
            return;
        }

        router.get(
            url,
            {},
            {
                preserveState: true,
                preserveScroll: false,
                replace: true,
            }
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
                        onChange={(e) =>
                            alterarStatus(e.target.value)
                        }
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
                            Aguardando Carregamento
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
                        onChange={(e) =>
                            setDataInicial(e.target.value)
                        }
                        className="rounded-md border px-3 py-2 bg-white dark:bg-neutral-900"
                    />


                    <input
                        type="date"
                        value={dataFinal}
                        onChange={(e) =>
                            setDataFinal(e.target.value)
                        }
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


                <div className="mb-3">

                    <input
                        type="text"
                        value={busca}
                        onChange={(e) =>
                            setBusca(e.target.value)
                        }
                        placeholder="🔎 Buscar pedido, cliente, vendedor ou destino..."
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


                {pedidos.data.length === 0 ? (

                    <EmptyState />

                ) : (

                    <PedidoTable
                        pedidos={pedidos.data}

                        isAdmin={
                            auth.user?.role === "admin"
                        }

                        userRole={
                            auth.user?.role
                        }

                        onEditar={editarPedido}

                        onEditarTransportadora={
                            editarTransportadora
                        }

                        onAgendar={
                            agendarPedido
                        }

                        onVoltarParaPedido={
                            voltarParaPedido
                        }

                        onCarregar={
                            carregarPedido
                        }

                        onFaturar={
                            faturarPedido
                        }

                        onDetalhes={
                            visualizarPedido
                        }

                        onCancelar={
                            cancelarPedido
                        }

                        onExcluir={
                            excluirPedido
                        }

                        onReplicar={
                            replicarPedido
                        }
                    />

                )}


                {pedidos.last_page > 1 && (

                    <div className="
                        mt-4
                        flex
                        flex-col
                        gap-3
                        border-t
                        pt-4
                        md:flex-row
                        md:items-center
                        md:justify-between
                    ">


                        <div className="text-sm text-gray-500">

                            Mostrando{" "}
                            <strong>
                                {pedidos.from ?? 0}
                            </strong>
                            {" "}até{" "}
                            <strong>
                                {pedidos.to ?? 0}
                            </strong>
                            {" "}de{" "}
                            <strong>
                                {pedidos.total}
                            </strong>
                            {" "}pedidos

                        </div>


                        <div className="flex items-center gap-2">


                            <Button
                                variant="secondary"
                                disabled={
                                    !pedidos.links[0]?.url
                                }
                                onClick={() =>
                                    irParaPagina(
                                        pedidos.links[0]?.url ?? null
                                    )
                                }
                            >
                                ← Anterior
                            </Button>


                            <span className="
                                rounded-md
                                border
                                px-3
                                py-2
                                text-sm
                            ">

                                Página{" "}
                                <strong>
                                    {pedidos.current_page}
                                </strong>
                                {" "}de{" "}
                                <strong>
                                    {pedidos.last_page}
                                </strong>

                            </span>


                            <Button
                                variant="secondary"
                                disabled={
                                    !pedidos.links[
                                        pedidos.links.length - 1
                                    ]?.url
                                }
                                onClick={() =>
                                    irParaPagina(
                                        pedidos.links[
                                            pedidos.links.length - 1
                                        ]?.url ?? null
                                    )
                                }
                            >
                                Próxima →
                            </Button>


                        </div>

                    </div>

                )}


                <PedidoModal
                    show={
                        showModal ||
                        pedidoReplicando !== null
                    }

                    onClose={() => {
                        setShowModal(false);
                        setPedidoReplicando(null);
                    }}

                    produtos={produtos}

                    clientes={clientes}

                    vendedores={vendedores}

                    pedidoReplicar={
                        pedidoReplicando
                    }

                />


                <EditarPedidoModal
                    show={
                        pedidoEditando !== null
                    }

                    pedido={
                        pedidoEditando
                    }

                    produtos={
                        produtos
                    }

                    vendedores={
                        vendedores

                    }


                    onClose={() =>
                        setPedidoEditando(null)
                    }
                />


                <AgendarPedidoModal
                    show={
                        pedidoAgendando !== null
                    }

                    pedido={
                        pedidoAgendando
                    }

                    onClose={() =>
                        setPedidoAgendando(null)
                    }
                />


                <CarregarPedidoModal
                    show={
                        pedidoCarregando !== null
                    }

                    pedido={
                        pedidoCarregando
                    }

                    onClose={() =>
                        setPedidoCarregando(null)
                    }
                />


                <FaturarPedidoModal
                    show={
                        pedidoFaturando !== null
                    }

                    pedido={
                        pedidoFaturando
                    }

                    onClose={() =>
                        setPedidoFaturando(null)
                    }
                />


                <EditarTransportadoraModal
                    pedido={
                        pedidoEditandoTransportadora
                    }

                    onClose={() =>
                        setPedidoEditandoTransportadora(null)
                    }
                />


                <StatusPedidoModal
                    pedido={
                        pedidoVisualizando
                    }

                    onClose={() =>
                        setPedidoVisualizando(null)
                    }
                />

                <Modal
                    show={pedidoCancelando !== null}
                    onClose={() => {
                        setPedidoCancelando(null);
                        setMotivoCancelamento("");
                    }}
                    title="Cancelar pedido"
                >
                    <div className="space-y-4">

                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                Você está cancelando o pedido{" "}
                                <strong>
                                    #{pedidoCancelando?.numero_pedido}
                                </strong>.
                            </p>

                            <p className="mt-1 text-sm text-gray-500">
                                Informe o motivo do cancelamento.
                            </p>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium">
                                Motivo / observação
                            </label>

                            <textarea
                                value={motivoCancelamento}
                                onChange={(e) =>
                                    setMotivoCancelamento(e.target.value)
                                }
                                rows={4}
                                placeholder="Ex.: Cliente solicitou o cancelamento..."
                                className="w-full rounded-md border px-3 py-2 dark:bg-neutral-900"
                                autoFocus
                            />
                        </div>

                        <div className="flex justify-end gap-2">

                            <Button
                                variant="secondary"
                                onClick={() => {
                                    setPedidoCancelando(null);
                                    setMotivoCancelamento("");
                                }}
                            >
                                Voltar
                            </Button>

                            <Button
                                variant="primary"
                                disabled={!motivoCancelamento.trim()}
                                onClick={confirmarCancelamento}
                            >
                                Confirmar cancelamento
                            </Button>

                        </div>

                    </div>
                </Modal>

            </div>
        </>
    );
}