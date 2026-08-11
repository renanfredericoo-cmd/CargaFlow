import StatusBadge from "./StatusBadge";
import Button from "@/components/Button";

import {
    Pencil,
    Calendar,
    Truck,
    X,
    Trash2,
    FileText,
    Printer,
    Copy,
} from "lucide-react";

import type { Pedido } from "@/types/pedido";

interface Props {
    pedidos: Pedido[];

    isAdmin: boolean;

    userRole?: string;

    onEditar: (pedido: Pedido) => void;

    onEditarTransportadora: (pedido: Pedido) => void;

    onAgendar: (pedido: Pedido) => void;

    onCarregar: (pedido: Pedido) => void;

    onFaturar: (pedido: Pedido) => void;

    onDetalhes: (pedido: Pedido) => void;

    onCancelar: (pedido: Pedido) => void;

    onExcluir: (pedido: Pedido) => void;

    onReplicar: (pedido: Pedido) => void;
}

export default function PedidoTable({
    pedidos,

    isAdmin,

    userRole,

    onEditar,

    onEditarTransportadora,

    onAgendar,

    onCarregar,

    onFaturar,

    onDetalhes,

    onCancelar,

    onExcluir,

    onReplicar,

}: Props) {


    function formatarData(data?: string) {

        if (!data) {
            return "-";
        }

        return new Date(data).toLocaleDateString("pt-BR");
    }

    return (

        <div className="overflow-hidden rounded-xl border bg-white shadow-sm dark:bg-neutral-900">

            <div className="overflow-x-auto">

                <table className="w-full text-left text-sm md:min-w-[900px]">

                    <thead className="border-b bg-gray-50 dark:bg-neutral-800">

                        <tr>

                            <th className="px-3 py-1 font-semibold">
                                Pedido
                            </th>

                            

                            <th className="px-3 py-1 font-semibold">
                                Cliente
                            </th>

                            <th className="px-3 py-1 font-semibold">
                                Destino
                            </th>

                            <th className="px-3 py-1 font-semibold">
    Produto
</th>

<th className="px-3 py-1 font-semibold">
    Toneladas
</th>

<th className="px-3 py-1 font-semibold">
    Transportadora
</th>

                            <th className="px-3 py-1 font-semibold">
                                Data de Entrega
                            </th>

                            <th className="px-3 py-1 font-semibold">
                                Status
                            </th>

                            <th className="px-3 py-1 font-semibold">
                                NF-e
                            </th>

                            <th className="px-3 py-1 text-right font-semibold">
                                Ações
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {pedidos.map((pedido) => (

                            

                           <tr
    key={pedido.id}
    className={`border-b last:border-none ${
        pedido.status === "Faturado"
            ? "bg-green-100 hover:bg-green-200 dark:bg-green-900/40 dark:hover:bg-green-900/60"
            : pedido.status === "Cancelado"
                ? "bg-red-300 hover:bg-red-400 dark:bg-red-900/70 dark:hover:bg-red-900/80"
                : "hover:bg-gray-50 dark:hover:bg-neutral-800"
    }`}
>

                                <td className="px-3 py-1 font-bold">

                                    {pedido.numero_pedido ?? pedido.codigo}

                                </td>

                                

                                <td className="px-3 py-1">

                                    {pedido.cliente &&
                                    typeof pedido.cliente === "object"
                                        ? pedido.cliente.nome
                                        : pedido.cliente ?? "-"}

                                </td>

                                <td className="px-3 py-1">

                                    {pedido.destino}

                                </td>

                                <td className="px-3 py-1">
    {pedido.produto?.descricao ?? "-"}
</td>

<td className="px-3 py-1">
    {pedido.peso != null
        ? `${Number(pedido.peso).toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })} t`
        : "-"
    }
</td>

<td className="px-3 py-1">
    {pedido.transportadora ?? "-"}
</td>

                                <td className="px-3 py-1">

                                    {formatarData(pedido.data_entrega)}

                                </td>

                                <td className="px-3 py-1">

                                    <StatusBadge
                                        status={pedido.status}
                                    />

                                </td>

                                <td className="px-3 py-1">

                                    {pedido.numero_nfe ?? "-"}

                                </td>

                                <td className="px-3 py-1 text-right">

                                    <div className="flex justify-end gap-1">

        {pedido.status === "Agendado" && (
    <>
        {(userRole === "admin" ||
            userRole === "pedidos" ||
            userRole === "agendamento" ||
            userRole === "carregamento") && (
            <Button
                variant="primary"
                title="Editar transportadora"
                onClick={() => onEditarTransportadora(pedido)}
            >
                <Pencil size={20} />
            </Button>
        )}

        {(userRole === "admin" ||
            userRole === "pedidos" ||
            userRole === "carregamento") && (
            <Button
                variant="success"
                title="Iniciar carregamento"
                onClick={() => onCarregar(pedido)}
            >
                <Truck size={20} />
            </Button>
        )}
    </>
)}






{pedido.status === "Pedido" && (
    <>
        {(userRole === "admin" || userRole === "pedidos") && (
            <>
                <Button
                    variant="primary"
                    title="Editar pedido"
                    onClick={() => onEditar(pedido)}
                >
                    <Pencil size={20} />
                </Button>

                <Button
                    variant="warning"
                    title="Agendar carregamento"
                    onClick={() => onAgendar(pedido)}
                >
                    <Calendar size={20} />
                </Button>

                <Button
                    variant="danger"
                    title="Cancelar pedido"
                    onClick={() => onCancelar(pedido)}
                >
                    <X size={20} />
                </Button>
            </>
        )}

        {userRole === "agendamento" && (
            <Button
                variant="warning"
                title="Agendar carregamento"
                onClick={() => onAgendar(pedido)}
            >
                <Calendar size={20} />
            </Button>
        )}
    </>
)}

                                        {pedido.status === "Em Carregamento" &&
    (userRole === "admin" || userRole === "carregamento") && (

                                            <Button
    variant="success"
    title="Faturar pedido"
    onClick={() => onFaturar(pedido)}
>
                                                <FileText size={20} />
                                            </Button>

                                        )}

                                        {pedido.status === "Faturado" && (

                                            <Button
    variant="primary"
    title="Ver detalhes do pedido"
    onClick={() => onDetalhes(pedido)}
>
                                                <Printer size={16} />
                                            </Button>

                                        )}

                                        {(userRole === "admin" || userRole === "pedidos") && (
    <Button
        variant="secondary"
        title="Replicar pedido"
        onClick={() => onReplicar(pedido)}
    >
        <Copy size={18} />
    </Button>
)}



                                        {isAdmin && (

                                            <Button
    variant="danger"
    title="Excluir pedido"
    onClick={() => onExcluir(pedido)}
>
                                                <Trash2 size={16} />
                                            </Button>

                                        )}

                                    </div>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>

    );
}