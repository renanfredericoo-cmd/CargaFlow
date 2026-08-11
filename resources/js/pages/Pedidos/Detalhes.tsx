import { Head } from "@inertiajs/react";

import Button from "@/components/Button";

import type { Pedido } from "@/types/pedido";


interface Props {

    pedido: Pedido;

}



export default function Detalhes({ pedido }: Props) {



    function imprimir() {

        window.print();

    }





    return (

        <>

            <Head title="Detalhes do Pedido" />



            <div className="mx-auto max-w-4xl p-6">



                <div className="mb-6 flex items-center justify-between gap-4 print:hidden">


    <h1 className="text-xl font-bold text-white">

        📄 Detalhes do Pedido

    </h1>



    <div className="flex gap-3">


        <Button

            variant="secondary"

            onClick={() => window.history.back()}

        >

            ✖ Fechar

        </Button>




        <Button

            variant="primary"

            onClick={imprimir}

        >

            🖨️ Imprimir

        </Button>


    </div>


</div>





                <div className="rounded-xl border bg-white p-8 text-gray-900 shadow">



                    <h2 className="mb-6 text-center text-3xl font-bold text-gray-900">

                        CARGAFLOW

                    </h2>





                    <div className="grid grid-cols-2 gap-4">



                        <div>

                            <strong>Pedido:</strong>
                        

                            <br />

                            {pedido.numero_pedido ?? pedido.codigo}

                        </div>



                        <div>

                            <strong>Cliente:</strong>

                            <br />

                            {typeof pedido.cliente === "object"

                                ? pedido.cliente.nome

                                : pedido.cliente}

                        </div>




                        <div>

                            <strong>Destino:</strong>

                            <br />

                            {pedido.destino}

                        </div>



                        <div>

                            <strong>Produto:</strong>

                            <br />

                            {pedido.produto?.descricao ?? "-"}

                        </div>



                        <div>

                            <strong>Peso:</strong>

                            <br />

                            {Number(pedido.peso).toLocaleString("pt-BR")} t

                        </div>



                        <div>

                            <strong>NF-e:</strong>

                            <br />

                            {pedido.numero_nfe ?? "-"}

                        </div>


                        <div>
    <strong>Início do carregamento:</strong>

    <br />

    {pedido.inicio_carregamento_at
        ? new Date(pedido.inicio_carregamento_at).toLocaleTimeString(
            "pt-BR",
            {
                hour: "2-digit",
                minute: "2-digit",
            }
        )
        : "-"}
</div>

<div>
    <strong>Hora do faturamento:</strong>

    <br />

    {pedido.hora_faturamento
    ? String(pedido.hora_faturamento).substring(0, 5)
    : "-"}
</div>



                    </div>





                    <hr className="my-6" />





                    <div className="space-y-3">


                        <div>

                            <strong>Transportadora:</strong>

                            <br />

                            {pedido.transportadora ?? "-"}

                        </div>



                        <div>

                            <strong>Motorista:</strong>

                            <br />

                            {pedido.motorista ?? "-"}

                        </div>



                        <div>

                            <strong>Placa:</strong>

                            <br />

                            {pedido.placa ?? "-"}

                        </div>



                        <div>

                            <strong>Observações:</strong>

                            <br />

                            {pedido.observacoes ?? "-"}

                        </div>


                    </div>



                </div>



            </div>


        </>

    );

}