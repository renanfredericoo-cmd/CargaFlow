import { useState } from "react";
import { Head, router } from "@inertiajs/react";


interface Pedido {

    id: number;

    numero_pedido: string | null;

    codigo: string | null;

    cliente: string;

    destino: string;

    peso: number | string;

    status: string;

    numero_nfe: string | null;


    produto?: {

        descricao: string;

    } | null;

}



interface Props {


    stats: {

        pedidos: number;

        programados: number;

        carregados: number;

        faturados: number;

        toneladas_faturadas: number;

        cancelados: number;

        toneladas: number;


        tempo_operacao: {

            media_segundos: number;

            total_analisados: number;

            menor_tempo: number;

            maior_tempo: number;

        };

    };


    role: string;


    ultimos?: Pedido[];


    filtro?: {

        data_inicial?: string;

        data_final?: string;

    };

}





function formatarTempo(segundos: number) {


    if (!segundos) {

        return "0 min";

    }



    if (segundos < 60) {

        return `${segundos}s`;

    }



    const horas = Math.floor(segundos / 3600);


    const minutos = Math.floor(
        (segundos % 3600) / 60
    );



    if (horas > 0) {

        return `${horas} h ${minutos} min`;

    }



    return `${minutos} min`;

}





export default function Dashboard({

    stats,

    ultimos = [],

    filtro,

}: Props) {



    const [dataInicial, setDataInicial] = useState(
        filtro?.data_inicial ?? ""
    );


    const [dataFinal, setDataFinal] = useState(
        filtro?.data_final ?? ""
    );




    function filtrarPeriodo() {


        router.get(

            "/dashboard",

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

            "/dashboard",

            {},

            {

                preserveState: true,

                replace: true,

            }

        );


    }





    const cards = [

        {

            title: "Total pedidos",

            value: stats.pedidos,

            color: "border-blue-500"

        },


        {

            title: "Agendados",

            value: stats.programados,

            color: "border-yellow-500"

        },


        {

            title: "Em carregamento",

            value: stats.carregados,

            color: "border-cyan-500"

        },


        {

            title: "Faturados",
    value: `${(stats.toneladas_faturadas ?? 0).toLocaleString("pt-BR")} t`,
    color: "border-green-500"

        },


        {

            title: "Cancelados",

            value: stats.cancelados,

            color: "border-red-500"

        },


        {

            title: "Toneladas",

            value: `${stats.toneladas.toLocaleString("pt-BR")} t`,

            color: "border-purple-500"

        },


        {

            title: "Tempo médio de carregamento",

            value: formatarTempo(
                stats.tempo_operacao.media_segundos
            ),

            color: "border-indigo-500"

        },


        {

            title: "Pedidos analisados",

            value: stats.tempo_operacao.total_analisados,

            color: "border-orange-500"

        },

    ];    return (

        <>

            <Head title="Dashboard" />



            <div className="p-6">



                <div className="mb-8">


                    <h1 className="text-3xl font-bold">

                        📊 Dashboard

                    </h1>



                    <p className="mt-1 text-gray-500">

                        Visão geral da operação do CargaFlow.

                    </p>




                    <div className="
    mt-5
    flex
    flex-col
    gap-3
    md:flex-row
    md:items-center
">


                        <div className="flex items-center gap-2">

                            <label className="text-sm text-gray-500 whitespace-nowrap">

                                Data inicial

                            </label>


                            <input

                                type="date"

                                value={dataInicial}

                                onChange={(e) =>
                                    setDataInicial(e.target.value)
                                }

                                className="
    bg-red-500 w-[220px]
    rounded-md
    border
    px-3
    py-2
    text-sm
    dark:bg-neutral-900
"

                            />

                        </div>





                        <div className="flex items-center gap-2">

                            <label className="text-sm text-gray-500 whitespace-nowrap">

                                Data final

                            </label>


                            <input

                                type="date"

                                value={dataFinal}

                                onChange={(e) =>
                                    setDataFinal(e.target.value)
                                }

                                className="
            w-[220px]
            rounded-md
            border
            px-3
            py-2
            text-sm
            dark:bg-neutral-900
        "

                            />

                        </div>





                        <div className="flex gap-2 md:w-auto">


                            <button

                                onClick={filtrarPeriodo}

                                className="
                                    rounded-md
                                    bg-blue-600
                                    px-4
                                    py-2
                                    text-sm
                                    text-white
                                    hover:bg-blue-700
                                "

                            >

                                Filtrar

                            </button>




                            <button

                                onClick={limparPeriodo}

                                className="
                                    rounded-md
                                    bg-gray-500
                                    px-4
                                    py-2
                                    text-sm
                                    text-white
                                    hover:bg-gray-600
                                "

                            >

                                Limpar

                            </button>


                        </div>


                    </div>


                </div>







                {/* CARDS PRINCIPAIS */}



                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">


                    {cards.map((card) => (



                        <div

                            key={card.title}

                            className={`

                                rounded-xl

                                border-l-4

                                ${card.color}

                                bg-white

                                p-4 md:p-5

                                shadow-md

                                dark:bg-neutral-900

                            `}

                        >



                            <p className="text-sm text-gray-400">

                                {card.title}

                            </p>





                            <p className="mt-3 text-4xl font-bold">

                                {card.value}

                            </p>



                        </div>



                    ))}



                </div>                {/* PERFORMANCE */}


                <div

                    className="
                        mt-8
                        rounded-xl
                        border
                        bg-white
                        p-6
                        shadow-md
                        dark:bg-neutral-900
                    "

                >



                    <h2 className="mb-5 text-xl font-bold">

                        ⏱ Performance de carregamento

                    </h2>





                    <div className="grid gap-4 md:grid-cols-3">



                        <PerformanceCard

                            title="Menor tempo de carregamento"

                            value={

                                formatarTempo(
                                    stats.tempo_operacao.menor_tempo
                                )

                            }

                        />




                        <PerformanceCard

                            title="Maior tempo de carregamento"

                            value={

                                formatarTempo(
                                    stats.tempo_operacao.maior_tempo
                                )

                            }

                        />





                        <PerformanceCard

                            title="Carregamentos analisados"

                            value={
                                stats.tempo_operacao.total_analisados
                            }

                        />



                    </div>


                </div>







                {/* ÚLTIMOS PEDIDOS */}



                <div

                    className="
                        mt-8
                        rounded-xl
                        border
                        bg-white
                        p-6
                        shadow-md
                        dark:bg-neutral-900
                    "

                >



                    <h2 className="mb-5 text-xl font-bold">

                        📋 Últimos pedidos

                    </h2>





                    {ultimos.length === 0 ? (


                        <p className="text-gray-500">

                            Nenhum pedido encontrado.

                        </p>


                    ) : (


                        <div className="overflow-x-auto">

    <table className="min-w-[700px] w-full text-sm">


                                <thead>


                                    <tr className="border-b text-left">


                                        <th className="p-3">
                                            Pedido
                                        </th>


                                        <th className="p-3">
                                            Cliente
                                        </th>


                                        <th className="p-3">
                                            Produto
                                        </th>


                                        <th className="p-3">
                                            Peso
                                        </th>


                                        <th className="p-3">
                                            Status
                                        </th>


                                    </tr>


                                </thead>





                                <tbody>


                                    {ultimos.slice(0,5).map((pedido)=>(


                                        <tr

                                            key={pedido.id}

                                            className="border-b"

                                        >



                                            <td className="p-3 font-semibold">

                                                #{pedido.numero_pedido ?? pedido.codigo}

                                            </td>



                                            <td className="p-3">

                                                {pedido.cliente}

                                            </td>



                                            <td className="p-3">

                                                {pedido.produto?.descricao ?? "-"}

                                            </td>



                                            <td className="p-3">

                                                {(Number(pedido.peso) / 1000)
                                                    .toLocaleString(
                                                        "pt-BR",
                                                        {
                                                            minimumFractionDigits:3,
                                                            maximumFractionDigits:3
                                                        }
                                                    )
                                                } t

                                            </td>




                                            <td className="p-3">


                                                <span
    className={`
        rounded-full
        px-3
        py-1
        text-xs
        font-semibold
        ${
            pedido.status === "Pedido"
                ? "bg-blue-100 text-blue-700"
                : pedido.status === "Agendado"
                  ? "bg-yellow-200 text-yellow-900"
                    : pedido.status === "Em Carregamento"
                        ? "bg-cyan-100 text-cyan-700"
                        : pedido.status === "Faturado"
                            ? "bg-green-100 text-green-700"
                            : pedido.status === "Cancelado"
                                ? "bg-red-100 text-red-700"
                                : "bg-gray-100 text-gray-700"
        }
    `}
>
    {pedido.status}
</span>


                                            </td>


                                        </tr>


                                    ))}


                                </tbody>


                            </table>


                        </div>


                    )}



                </div>





            </div>


        </>

    );


}





function PerformanceCard({

    title,

    value,

}: {

    title:string;

    value:string | number;

}) {


    return (

        <div

            className="
                rounded-xl
                border
                bg-neutral-50
                p-5
                shadow-sm
                dark:bg-neutral-800
            "

        >


            <p className="text-sm text-gray-500">

                {title}

            </p>





            <p className="mt-3 text-4xl font-bold">

                {value}

            </p>


        </div>

    );


}