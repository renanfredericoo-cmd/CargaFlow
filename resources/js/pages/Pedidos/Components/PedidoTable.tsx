import StatusBadge from "./StatusBadge";
import Button from "@/components/Button";

import {
    Pencil,
    Calendar,
    Truck,
    Undo2,
    X,
    Trash2,
    FileText,
    Copy,
    MessageCircle,
} from "lucide-react";

import type { Pedido } from "@/types/pedido";

interface Props {
    pedidos: Pedido[];

    isAdmin: boolean;

    userRole?: string;

    onEditar: (pedido: Pedido) => void;

    onEditarTransportadora: (pedido: Pedido) => void;

    onAgendar: (pedido: Pedido) => void;

    onVoltarParaPedido: (pedido: Pedido) => void;

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
    onVoltarParaPedido,
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

                            {/* DATA */}
<th className="px-3 py-1 font-semibold">
    Data de Entrega
</th>

                            {/* CLIENTE */}
                            <th className="px-3 py-1 font-semibold">
                                Cliente
                            </th>

                            {/* DESTINO */}
                            <th className="px-3 py-1 font-semibold">
                                Destino
                            </th>

                            {/* PRODUTO */}
                            <th className="px-3 py-1 font-semibold">
                                Produto
                            </th>

                            {/* TONELADA */}
                            <th className="px-3 py-1 font-semibold">
                                Tonelada
                            </th>

                            {/* FRETE */}
                            <th className="px-3 py-1 font-semibold">
                                Frete
                            </th>

                            {/* PEDIDO */}
                            <th className="px-3 py-1 font-semibold">
                                Pedido
                            </th>

                            {/* TRANSPORTADORA */}
                            <th className="px-3 py-1 font-semibold">
                                Transportadora
                            </th>

                            {/* NF-e */}
                            <th className="px-3 py-1 font-semibold">
                                NF-e
                            </th>

                            {/* STATUS */}
                            <th className="px-3 py-1 font-semibold">
                                Status
                            </th>

                            {/* AÇÕES */}
                            <th className="px-3 py-1 text-right font-semibold">
                                Ações
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {pedidos.map((pedido) => (

                            <tr
                                key={pedido.id}
                                className={`border-b last:border-none leading-tight ${
                                    pedido.status === "Faturado"
                                        ? "bg-green-100 hover:bg-green-200 dark:bg-green-900/40 dark:hover:bg-green-900/60"
                                        : pedido.status === "Cancelado"
                                            ? "bg-red-300 hover:bg-red-400 dark:bg-red-900/70 dark:hover:bg-red-900/80"
                                            : "hover:bg-gray-50 dark:hover:bg-neutral-800"
                                }`}
                            >

                                {/* DATA */}
{/* DATA */}
<td className="px-3 py-1">
    {(() => {
        const atrasado =
    pedido.status !== "Faturado" &&
    pedido.status !== "Cancelado" &&
    pedido.data_entrega &&
    new Date(pedido.data_entrega) <
        new Date(new Date().setHours(0, 0, 0, 0));

        return (
            <div className="flex items-center gap-1.5">
                {atrasado && (
                    <span
                        className="h-2 w-2 rounded-full bg-red-500"
                        title="Pedido atrasado"
                    />
                )}

                <span
                    className={
                        atrasado
                            ? "text-red-400"
                            : ""
                    }
                >
                    {formatarData(pedido.data_entrega)}
                </span>
            </div>
        );
    })()}
</td>

                                {/* CLIENTE */}
                                <td className="px-3 py-1">

                                    {pedido.cliente &&
                                    typeof pedido.cliente === "object"
                                        ? pedido.cliente.nome
                                        : pedido.cliente ?? "-"}

                                </td>

                                {/* DESTINO */}
                                <td className="px-3 py-1">
                                    {pedido.destino}
                                </td>

                                {/* PRODUTO */}
                                <td className="px-3 py-1">
                                    {pedido.produto?.descricao ?? "-"}
                                </td>

                                {/* TONELADA */}
                                <td className="px-3 py-1">

                                    {pedido.peso != null
                                        ? `${Number(pedido.peso).toLocaleString(
                                              "pt-BR",
                                              {
                                                  minimumFractionDigits: 2,
                                                  maximumFractionDigits: 2,
                                              }
                                          )} t`
                                        : "-"
                                    }

                                </td>

                                {/* FRETE */}
                                <td className="px-3 py-1">

                                    <span
                                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                                            pedido.tipo_frete === "CIF"
                                                ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                                                : "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300"
                                        }`}
                                    >
                                        {pedido.tipo_frete}
                                    </span>

                                </td>

                                {/* PEDIDO */}
                                <td className="px-3 py-1 text-center font-bold align-middle">

    <button
    type="button"
    onClick={() => onDetalhes(pedido)}
    className={`inline-flex items-center ${
        pedido.observacoes?.trim()
            ? "text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
            : "text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
    }`}
    title="Visualizar pedido"

    >
        {(() => {
            const valor = String(
                pedido.numero_pedido ?? pedido.codigo ?? ""
            );

            const partes = valor.split(" - ");

            if (partes.length > 1) {
                return (
                    <>
                        <span
    className={`font-bold ${
        pedido.observacoes?.trim()
            ? "text-red-600"
            : "text-blue-600"
    }`}
>
    {partes[0]}
</span>

{pedido.observacoes?.trim() && (
    <MessageCircle
        size={16}
        className="ml-1 inline-block text-red-600"
    />
)}

                        <span className="whitespace-nowrap text-xs font-medium">
                            {partes.slice(1).join(" - ")}
                        </span>
                    </>
                );
            }

            return valor;
        })()}
    </button>

</td>

                                {/* TRANSPORTADORA */}
                                <td className="px-3 py-1">
                                    {pedido.transportadora ?? "-"}
                                </td>

                                {/* NF-e */}
                                <td className="px-3 py-1">
                                    {pedido.numero_nfe ?? "-"}
                                </td>

                                {/* STATUS */}
                                <td className="px-3 py-1">

                                    <StatusBadge
                                        status={pedido.status}
                                    />

                                </td>

                                {/* AÇÕES */}
                                <td className="px-3 py-1 text-right">

                                    <div className="flex justify-end gap-1 [&>button]:!py-1">

                                        {/* AGENDADO */}
{pedido.status === "Agendado" && (
    <>
        {(userRole === "admin" ||
            userRole === "pedidos" ||
            userRole === "agendamento" ||
            userRole === "carregamento") && (

            <Button
    variant="primary"
    title={
        userRole === "pedidos"
            ? "Editar pedido"
            : "Editar transportadora"
    }
    onClick={() => {
        if (userRole === "pedidos") {
            onEditar(pedido);
        } else {
            onEditarTransportadora(pedido);
        }
    }}
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
                onClick={() =>
                    onCarregar(pedido)
                }
            >
                <Truck size={20} />
            </Button>

        )}

        {(userRole === "admin" ||
            userRole === "pedidos") && (

            <Button
                variant="danger"
                title="Cancelar pedido"
                onClick={() =>
                    onCancelar(pedido)
                }
            >
                <X size={20} />
            </Button>

        )}
    </>
)}

                                        {/* PEDIDO */}
                                        {pedido.status === "Pedido" && (
                                            <>
                                                {(userRole === "admin" ||
                                                    userRole === "pedidos") && (
                                                    <>
                                                        <Button
                                                            variant="primary"
                                                            title="Editar pedido"
                                                            onClick={() =>
                                                                onEditar(pedido)
                                                            }
                                                        >
                                                            <Pencil size={20} />
                                                        </Button>

                                                        <Button
                                                            variant="warning"
                                                            title="Agendar carregamento"
                                                            onClick={() =>
                                                                onAgendar(pedido)
                                                            }
                                                        >
                                                            <Calendar size={20} />
                                                        </Button>

                                                        <Button
                                                            variant="danger"
                                                            title="Cancelar pedido"
                                                            onClick={() =>
                                                                onCancelar(pedido)
                                                            }
                                                        >
                                                            <X size={20} />
                                                        </Button>
                                                    </>
                                                )}

                                                {userRole === "agendamento" && (
                                                    <Button
                                                        variant="warning"
                                                        title="Agendar carregamento"
                                                        onClick={() =>
                                                            onAgendar(pedido)
                                                        }
                                                    >
                                                        <Calendar size={20} />
                                                    </Button>
                                                )}
                                            </>
                                        )}

                                        {/* AGENDADO */}
{pedido.status === "Agendado" &&
    (userRole === "admin" ||
        userRole === "pedidos") && (
        <Button
            variant="secondary"
            title="Voltar para Pedido"
            onClick={() =>
                onVoltarParaPedido(pedido)
            }
        >
            <Undo2 size={20} />
        </Button>
    )}

                                        {/* EM CARREGAMENTO */}
                                        {pedido.status === "Em Carregamento" &&
    (userRole === "admin" ||
        userRole === "pedidos" ||
        userRole === "carregamento") && (

                                                <Button
                                                    variant="success"
                                                    title="Faturar pedido"
                                                    onClick={() =>
                                                        onFaturar(pedido)
                                                    }
                                                >
                                                    <FileText size={20} />
                                                </Button>

                                            )}

                                        {/* REPLICAR */}
                                        {(userRole === "admin" ||
                                            userRole === "pedidos") && (

                                            <Button
                                                variant="secondary"
                                                title="Replicar pedido"
                                                onClick={() =>
                                                    onReplicar(pedido)
                                                }
                                            >
                                                <Copy size={18} />
                                            </Button>

                                        )}

                                        {/* EXCLUIR */}
                                        {isAdmin && (

                                            <Button
                                                variant="danger"
                                                title="Excluir pedido"
                                                onClick={() =>
                                                    onExcluir(pedido)
                                                }
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