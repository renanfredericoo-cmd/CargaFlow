import { useState } from "react";
import { Head, router } from "@inertiajs/react";

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

    toneladas_ultimos_7_dias: {
        dias: {
            data: string;
            label: string;
            toneladas: number;
        }[];
        total: number;
        media: number;
    };

    pedidos_por_status: {
        status: string;
        total: number;
    }[];

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
    toneladas_ultimos_7_dias,
    pedidos_por_status,
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
            color: "border-blue-500",
        },

        {
            title: "Agendados",
            value: stats.programados,
            color: "border-yellow-500",
        },

        {
            title: "Aguardando Carregamento",
            value: stats.carregados,
            color: "border-cyan-500",
        },

        {
            title: "Faturados",
            value: `${(stats.toneladas_faturadas ?? 0).toLocaleString(
                "pt-BR"
            )} t`,
            color: "border-green-500",
        },

        {
            title: "Cancelados",
            value: stats.cancelados,
            color: "border-red-500",
        },

        {
            title: "Toneladas",
            value: `${stats.toneladas.toLocaleString("pt-BR")} t`,
            color: "border-purple-500",
        },

        {
            title: "Tempo médio de carregamento",
            value: formatarTempo(
                stats.tempo_operacao.media_segundos
            ),
            color: "border-indigo-500",
        },

        {
            title: "Pedidos analisados",
            value: stats.tempo_operacao.total_analisados,
            color: "border-orange-500",
        },
    ];

    const maiorVolume = Math.max(
        ...toneladas_ultimos_7_dias.dias.map(
            (dia) => Number(dia.toneladas)
        ),
        1
    );

    const totalPedidosStatus = pedidos_por_status.reduce(
        (total, item) => total + Number(item.total),
        0
    );

    const statusConfig: Record<
        string,
        {
            label: string;
            bar: string;
            badge: string;
        }
    > = {
        Pedido: {
            label: "Pedido",
            bar: "bg-blue-500",
            badge: "bg-blue-500",
        },

        Agendado: {
            label: "Agendado",
            bar: "bg-yellow-500",
            badge: "bg-yellow-500",
        },

        "Em Carregamento": {
            label: "Aguardando Carregamento",
            bar: "bg-cyan-500",
            badge: "bg-cyan-500",
        },

        Faturado: {
            label: "Faturado",
            bar: "bg-green-500",
            badge: "bg-green-500",
        },

        Cancelado: {
            label: "Cancelado",
            bar: "bg-red-500",
            badge: "bg-red-500",
        },
    };

    return (
        <>
            <Head title="Dashboard" />

            <div className="p-6">

                {/* CABEÇALHO */}

                <div className="mb-8">

                    <h1 className="text-3xl font-bold">
                        📊 Dashboard
                    </h1>

                    <p className="mt-1 text-gray-500">
                        Visão geral da operação do CargaFlow.
                    </p>

                    <div
                        className="
                            mt-5
                            flex
                            flex-col
                            gap-3
                            md:flex-row
                            md:items-center
                        "
                    >

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
                                p-4
                                shadow-md
                                md:p-5
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

                </div>


                {/* PERFORMANCE */}

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
                            value={formatarTempo(
                                stats.tempo_operacao.menor_tempo
                            )}
                        />

                        <PerformanceCard
                            title="Maior tempo de carregamento"
                            value={formatarTempo(
                                stats.tempo_operacao.maior_tempo
                            )}
                        />

                        <PerformanceCard
                            title="Carregamentos analisados"
                            value={
                                stats.tempo_operacao.total_analisados
                            }
                        />

                    </div>

                </div>


                {/* GRÁFICOS */}

                <div className="mt-8 grid gap-6 xl:grid-cols-2">

                    {/* TONELADAS */}

                    <div
                        className="
                            rounded-xl
                            border
                            bg-white
                            p-6
                            shadow-md
                            dark:bg-neutral-900
                        "
                    >

                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                            <div>

                                <h2 className="text-xl font-bold">
                                    📈 Toneladas carregadas
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    Últimos 7 dias
                                </p>

                            </div>

                            <div className="flex gap-6">

                                <div>

                                    <p className="text-xs text-gray-500">
                                        Total
                                    </p>

                                    <p className="text-2xl font-bold">
                                        {toneladas_ultimos_7_dias.total.toLocaleString(
                                            "pt-BR",
                                            {
                                                minimumFractionDigits: 1,
                                                maximumFractionDigits: 1,
                                            }
                                        )}{" "}
                                        t
                                    </p>

                                </div>

                                <div>

                                    <p className="text-xs text-gray-500">
                                        Média/dia
                                    </p>

                                    <p className="text-2xl font-bold">
                                        {toneladas_ultimos_7_dias.media.toLocaleString(
                                            "pt-BR",
                                            {
                                                minimumFractionDigits: 1,
                                                maximumFractionDigits: 1,
                                            }
                                        )}{" "}
                                        t
                                    </p>

                                </div>

                            </div>

                        </div>


                        <div className="mt-8">

                            <div className="flex h-56 items-end justify-between gap-2">

                                {toneladas_ultimos_7_dias.dias.map(
                                    (dia) => {

                                        const toneladas =
                                            Number(dia.toneladas);

                                        const altura =
                                            toneladas > 0
                                                ? Math.max(
                                                    (toneladas /
                                                        maiorVolume) *
                                                        100,
                                                    6
                                                )
                                                : 2;

                                        return (
                                            <div
                                                key={dia.data}
                                                className="
                                                    flex
                                                    h-full
                                                    flex-1
                                                    flex-col
                                                    items-center
                                                    justify-end
                                                "
                                            >

                                                <span className="mb-2 text-xs font-semibold">
                                                    {toneladas.toLocaleString(
                                                        "pt-BR",
                                                        {
                                                            maximumFractionDigits: 1,
                                                        }
                                                    )}{" "}
                                                    t
                                                </span>

                                                <div
                                                    className="
                                                        w-full
                                                        max-w-[55px]
                                                        rounded-t-lg
                                                        bg-blue-600
                                                        transition-all
                                                        hover:bg-blue-500
                                                    "
                                                    style={{
                                                        height: `${altura}%`,
                                                    }}
                                                    title={`${toneladas.toLocaleString(
                                                        "pt-BR"
                                                    )} t`}
                                                />

                                                <span className="mt-3 text-xs text-gray-500">
                                                    {dia.label}
                                                </span>

                                            </div>
                                        );
                                    }
                                )}

                            </div>

                        </div>

                    </div>


                    {/* STATUS */}

                    <div
                        className="
                            rounded-xl
                            border
                            bg-white
                            p-6
                            shadow-md
                            dark:bg-neutral-900
                        "
                    >

                        <div>

                            <h2 className="text-xl font-bold">
                                📊 Pedidos por status
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Distribuição atual dos pedidos
                            </p>

                        </div>


                        <div className="mt-7 space-y-5">

                            {pedidos_por_status.map((item) => {

                                const config =
                                    statusConfig[item.status] ??
                                    {
                                        label: item.status,
                                        bar: "bg-gray-500",
                                        badge: "bg-gray-500",
                                    };

                                const percentual =
                                    totalPedidosStatus > 0
                                        ? (Number(item.total) /
                                            totalPedidosStatus) *
                                        100
                                        : 0;

                                return (
                                    <div key={item.status}>

                                        <div className="mb-2 flex items-center justify-between">

                                            <div className="flex items-center gap-2">

                                                <span
                                                    className={`
                                                        h-2.5
                                                        w-2.5
                                                        rounded-full
                                                        ${config.badge}
                                                    `}
                                                />

                                                <span className="text-sm font-medium">
                                                    {config.label}
                                                </span>

                                            </div>

                                            <div className="flex items-center gap-2">

                                                <span className="text-sm font-bold">
                                                    {item.total}
                                                </span>

                                                <span className="text-xs text-gray-500">
                                                    {percentual.toFixed(0)}%
                                                </span>

                                            </div>

                                        </div>


                                        <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-neutral-800">

                                            <div
                                                className={`
                                                    h-full
                                                    rounded-full
                                                    ${config.bar}
                                                    transition-all
                                                `}
                                                style={{
                                                    width: `${percentual}%`,
                                                }}
                                            />

                                        </div>

                                    </div>
                                );
                            })}

                        </div>


                        <div className="mt-7 border-t pt-5 dark:border-neutral-700">

                            <div className="flex items-center justify-between">

                                <span className="text-sm text-gray-500">
                                    Total de pedidos
                                </span>

                                <span className="text-2xl font-bold">
                                    {totalPedidosStatus}
                                </span>

                            </div>

                        </div>

                    </div>

                </div>


            </div>

        </>
    );
}


function PerformanceCard({
    title,
    value,
}: {
    title: string;
    value: string | number;
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