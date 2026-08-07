import StatusBadge from "./StatusBadge";
import Button from "@/components/Button";

import {
    Pencil,
    Calendar,
    Truck,
    X,
    Trash2,
    FileText,
} from "lucide-react";

import type { Pedido } from "@/types/pedido";


interface Props {

    pedidos: Pedido[];

    isAdmin: boolean;

    onEditar: (pedido: Pedido) => void;

    onAgendar: (pedido: Pedido) => void;

    onCarregar: (pedido: Pedido) => void;

    onFaturar: (pedido: Pedido) => void;

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

    onCancelar,

    onExcluir,

}: Props) {



    function formatarData(data: string) {

        return new Date(data).toLocaleDateString("pt-BR");

    }



    function formatarHora(hora?: string) {

        if (!hora) {
            return "-";
        }

        return hora.substring(0,5);

    }




    return (

        <div className="overflow-hidden rounded-xl border bg-white shadow-sm dark:bg-neutral-900">


            <div className="overflow-x-auto">


                <table className="w-full text-left text-sm">


                    <thead className="border-b bg-gray-50 dark:bg-neutral-800">

                        <tr>


                            <th className="px-3 py-2 font-semibold">
                                Pedido
                            </th>


                            <th className="px-3 py-2 font-semibold">
                                Data
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
                                Agendado
                            </th>


                            <th className="px-3 py-2 font-semibold">
                                Carregado
                            </th>


                            <th className="px-3 py-2 font-semibold">
                                Atraso
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

                                    {formatarData(pedido.data)}

                                </td>



                                <td className="px-3 py-2">

                                    {pedido.cliente}

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

                                    {formatarHora(pedido.hora_agendamento)}

                                </td>



                                <td className="px-3 py-2">

                                    {formatarHora(pedido.hora_carregamento)}

                                </td>



                                <td className="px-3 py-2 font-semibold">

                                    {pedido.atraso_carregamento !== null &&
                                    pedido.atraso_carregamento !== undefined ? (

                                        pedido.atraso_carregamento > 0 ? (

                                            <span className="text-red-600">

                                                +{pedido.atraso_carregamento} min

                                            </span>

                                        ) : pedido.atraso_carregamento < 0 ? (

                                            <span className="text-green-600">

                                                {pedido.atraso_carregamento} min

                                            </span>

                                        ) : (

                                            <span className="text-blue-600">

                                                No horário

                                            </span>

                                        )

                                    ) : (

                                        "-"

                                    )}

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

                                                    <Pencil
                                                        size={16}
                                                        strokeWidth={2.5}
                                                    />

                                                </Button>



                                                <Button
                                                    variant="warning"
                                                    onClick={() => onAgendar(pedido)}
                                                >

                                                    <Calendar
                                                        size={16}
                                                        strokeWidth={2.5}
                                                    />

                                                </Button>



                                                <Button
                                                    variant="danger"
                                                    onClick={() => onCancelar(pedido)}
                                                >

                                                    <X
                                                        size={18}
                                                        strokeWidth={3}
                                                    />

                                                </Button>


                                            </>

                                        )}





                                        {pedido.status === "Agendado" && (

                                            <Button
                                                variant="success"
                                                onClick={() => onCarregar(pedido)}
                                            >

                                                <Truck
                                                    size={16}
                                                    strokeWidth={2.5}
                                                />

                                            </Button>

                                        )}





                                        {pedido.status === "Em Carregamento" && (

                                            <Button
                                                variant="success"
                                                onClick={() => onFaturar(pedido)}
                                            >

                                                <FileText
                                                    size={16}
                                                    strokeWidth={2.5}
                                                />

                                            </Button>

                                        )}





                                        {isAdmin && (

                                            <Button
                                                variant="danger"
                                                onClick={() => onExcluir(pedido)}
                                            >

                                                <Trash2
                                                    size={18}
                                                    strokeWidth={3}
                                                />

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