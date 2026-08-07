import { Head } from "@inertiajs/react";


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

        users: number;

        pedidos: number;

        programados: number;

        carregados: number;

        faturados: number;

        cancelados: number;

        toneladas: number;



        pontualidade: {

            no_horario: number;

            atrasados: number;

            media_atraso: number;

            total: number;

            eficiencia: number;

        };



        tempo_operacao: {

    media_segundos: number;

    total_analisados: number;

};


    };


    role: string;


    ultimos?: Pedido[];

}

function formatarTempo(segundos: number) {

    if (segundos < 60) {

        return `${segundos}s`;

    }


    const horas = Math.floor(segundos / 3600);

    const minutos = Math.floor(
        (segundos % 3600) / 60
    );


    if (horas > 0) {

        return `${horas}h ${minutos}min`;

    }


    return `${minutos}min`;

}




export default function Dashboard({

    stats,

    ultimos = [],

}: Props) {


    return (

        <>

            <Head title="Dashboard" />


            <div className="p-6">


                <div className="mb-8">

                    <h1 className="text-3xl font-bold">

                        📊 Dashboard

                    </h1>


                    <p className="text-gray-500">

                        Visão geral da operação.

                    </p>

                </div>





                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">


                    <Card
                        title="📦 Total pedidos"
                        value={stats.pedidos}
                    />


                    <Card
                        title="📅 Agendados"
                        value={stats.programados}
                    />


                    <Card
                        title="🔄 Em carregamento"
                        value={stats.carregados}
                    />


                    <Card
                        title="🧾 Faturados"
                        value={stats.faturados}
                    />


                    <Card
                        title="❌ Cancelados"
                        value={stats.cancelados}
                    />


                    <Card
                        title="⚖️ Toneladas"
                        value={stats.toneladas}
                    />


                </div>                <div className="mt-6 rounded-xl border bg-white p-6 shadow-sm dark:bg-neutral-900">


                    <h2 className="mb-5 text-xl font-bold">

                        🚛 Pontualidade

                    </h2>




                    <div className="grid gap-4 md:grid-cols-4">



                        <div className="rounded-lg border p-4">

                            <p className="text-sm text-gray-500">

                                🟢 No horário

                            </p>


                            <p className="mt-2 text-3xl font-bold text-green-500">

                                {stats.pontualidade.no_horario}

                            </p>

                        </div>





                        <div className="rounded-lg border p-4">

                            <p className="text-sm text-gray-500">

                                🔴 Atrasados

                            </p>


                            <p className="mt-2 text-3xl font-bold text-red-500">

                                {stats.pontualidade.atrasados}

                            </p>

                        </div>





                        <div className="rounded-lg border p-4">


                            <p className="text-sm text-gray-500">

                                📊 Eficiência

                            </p>


                            <p className="mt-2 text-3xl font-bold">

                                {stats.pontualidade.eficiencia}%

                            </p>



                            <div className="mt-3 h-3 w-full rounded-full bg-gray-200 dark:bg-neutral-700">


                                <div

                                    className={`

                                        h-3

                                        rounded-full

                                        ${
                                            stats.pontualidade.eficiencia >= 90

                                                ? "bg-green-500"

                                                : stats.pontualidade.eficiencia >= 70

                                                    ? "bg-yellow-500"

                                                    : "bg-red-500"
                                        }

                                    `}

                                    style={{

                                        width: `${stats.pontualidade.eficiencia}%`

                                    }}

                                />


                            </div>


                        </div>





                        <div className="rounded-lg border p-4">


                            <p className="text-sm text-gray-500">

                                ⏱ Média atraso

                            </p>


                            <p className="mt-2 text-3xl font-bold">

                                +{stats.pontualidade.media_atraso} min

                            </p>


                        </div>



                    </div>


                </div>





                <div className="mt-6 rounded-xl border bg-white p-6 shadow-sm dark:bg-neutral-900">


                    <h2 className="mb-5 text-xl font-bold">

                        ⏱ Performance de carregamento

                    </h2>




                    <div className="grid gap-4 md:grid-cols-3">


                        <div className="rounded-lg border p-4">


                            <p className="text-sm text-gray-500">

                                ⏱ Tempo médio carregamento

                            </p>


                            <p className="mt-2 text-3xl font-bold">

                                {formatarTempo(
    stats.tempo_operacao.media_segundos
)}

                            </p>


                        </div>





                        <div className="rounded-lg border p-4">


                            <p className="text-sm text-gray-500">

                                🚚 Carregamentos analisados

                            </p>


                            <p className="mt-2 text-3xl font-bold">

                                {stats.tempo_operacao.total_analisados}

                            </p>


                        </div>



                    </div>


                </div>                <div className="mt-8 rounded-xl border bg-white p-6 shadow-sm dark:bg-neutral-900">


                    <h2 className="mb-5 text-xl font-bold">

                        📋 Últimos pedidos

                    </h2>



                    {ultimos.length === 0 ? (


                        <p className="text-gray-500">

                            Nenhum pedido encontrado.

                        </p>


                    ) : (


                        <div className="space-y-3">


                            {ultimos.map((pedido) => (


                                <div

                                    key={pedido.id}

                                    className="rounded-lg border p-4"

                                >


                                    <div className="flex flex-col gap-3 md:flex-row md:justify-between">


                                        <div>


                                            <p className="font-bold">

                                                Pedido #

                                                {pedido.numero_pedido ?? pedido.codigo}

                                            </p>



                                            <p className="text-sm text-gray-500">

                                                Cliente: {pedido.cliente}

                                            </p>



                                            <p className="text-sm text-gray-500">

                                                Destino: {pedido.destino}

                                            </p>



                                            <p className="text-sm text-gray-500">

                                                Produto: {pedido.produto?.descricao ?? "-"}

                                            </p>



                                            <p className="text-sm text-gray-500">

                                                Peso: {(Number(pedido.peso) / 1000).toLocaleString("pt-BR", {

                                                    minimumFractionDigits: 3,

                                                    maximumFractionDigits: 3,

                                                })} T

                                            </p>


                                        </div>





                                        <div className="self-start md:self-auto">


                                            <span

                                                className={`

                                                    rounded-full

                                                    px-3

                                                    py-1

                                                    text-sm

                                                    font-semibold


                                                    ${

                                                        pedido.status === "Agendado"

                                                            ? "bg-yellow-100 text-yellow-700"


                                                        : pedido.status === "Em Carregamento"

                                                            ? "bg-blue-100 text-blue-700"


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


                                        </div>


                                    </div>


                                </div>


                            ))}


                        </div>


                    )}


                </div>


            </div>


        </>

    );


}







function Card({

    title,

    value,

}: {

    title: string;

    value: number;

}) {


    return (

        <div className="rounded-xl border bg-white p-5 shadow-sm dark:bg-neutral-900">


            <p className="text-sm text-gray-500">

                {title}

            </p>



            <p className="mt-3 text-3xl font-bold">

                {value}

            </p>


        </div>

    );


}