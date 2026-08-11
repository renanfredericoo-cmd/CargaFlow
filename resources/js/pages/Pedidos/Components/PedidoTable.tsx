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
} from "lucide-react";

import type { Pedido } from "@/types/pedido";

interface Props {
    pedidos: Pedido[];

    isAdmin: boolean;

    onEditar: (pedido: Pedido) => void;

    onAgendar: (pedido: Pedido) => void;

    onCarregar: (pedido: Pedido) => void;

    onFaturar: (pedido: Pedido) => void;

    onDetalhes: (pedido: Pedido) => void;

    onCancelar: (pedido: Pedido) => void;

    onExcluir: (pedido: Pedido) => void;
}

export default function PedidoTable({
    pedidos,

    isAdmin,

    onEditar,

    onAgendar,

    onCarregar,

    onFaturar,

    onDetalhes,

    onCancelar,

    onExcluir,
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

                            <th className="px-3 py-2 font-semibold">
                                Pedido
                            </th>

                            

                            <th className="px-3 py-2 font-semibold">
                                Cliente
                            </th>

                            <th className="px-3 py-2 font-semibold">
                                Destino
                            </th>

                            <th className="px-3 py-2 font-semibold">
                                Produto
                            </th>

                            <th className="px-3 py-2 font-semibold">
                                Transportadora
                            </th>

                            <th className="px-3 py-2 font-semibold">
                                Data de Entrega
                            </th>

                            <th className="px-3 py-2 font-semibold">
                                Status
                            </th>

                            <th className="px-3 py-2 font-semibold">
                                NF-e
                            </th>

                            <th className="px-3 py-2 text-right font-semibold">
                                Ações
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {pedidos.map((pedido) => (

                            

                            <tr
                                key={pedido.id}
                                className="border-b last:border-none hover:bg-gray-50 dark:hover:bg-neutral-800"
                            >

                                <td className="px-3 py-2 font-bold">

                                    {pedido.numero_pedido ?? pedido.codigo}

                                </td>

                                

                                <td className="px-3 py-2">

                                    {pedido.cliente &&
                                    typeof pedido.cliente === "object"
                                        ? pedido.cliente.nome
                                        : pedido.cliente ?? "-"}

                                </td>

                                <td className="px-3 py-2">

                                    {pedido.destino}

                                </td>

                                <td className="px-3 py-2">

                                    {pedido.produto?.descricao ?? "-"}

                                </td>

                                <td className="px-3 py-2">

                                    {pedido.transportadora ?? "-"}

                                </td>

                                <td className="px-3 py-2">

                                    {formatarData(pedido.data_entrega)}

                                </td>

                                <td className="px-3 py-2">

                                    <StatusBadge
                                        status={pedido.status}
                                    />

                                </td>

                                <td className="px-3 py-2">

                                    {pedido.numero_nfe ?? "-"}

                                </td>

                                <td className="px-3 py-2 text-right">

                                    <div className="flex justify-end gap-1">

                                        {pedido.status === "Pedido" && (

                                            <>

                                                <Button
                                                    variant="primary"
                                                    onClick={() => onEditar(pedido)}
                                                >
                                                    <Pencil size={20} />
                                                </Button>

                                                <Button
                                                    variant="warning"
                                                    onClick={() => onAgendar(pedido)}
                                                >
                                                    <Calendar size={20} />
                                                </Button>

                                                <Button
                                                    variant="danger"
                                                    onClick={() => onCancelar(pedido)}
                                                >
                                                    <X size={20} />
                                                </Button>

                                            </>

                                        )}

                                        {pedido.status === "Agendado" && (

                                            <Button
                                                variant="success"
                                                onClick={() => onCarregar(pedido)}
                                            >
                                                <Truck size={20} />
                                            </Button>

                                        )}

                                        {pedido.status === "Em Carregamento" && (

                                            <Button
                                                variant="success"
                                                onClick={() => onFaturar(pedido)}
                                            >
                                                <FileText size={20} />
                                            </Button>

                                        )}

                                        {pedido.status === "Faturado" && (

                                            <Button
                                                variant="primary"
                                                onClick={() => onDetalhes(pedido)}
                                            >
                                                <Printer size={16} />
                                            </Button>

                                        )}

                                        {isAdmin && (

                                            <Button
                                                variant="danger"
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