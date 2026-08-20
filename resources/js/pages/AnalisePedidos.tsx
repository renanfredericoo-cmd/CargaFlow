import { Head } from '@inertiajs/react';
import {
    BarChart3,
    CalendarDays,
    Package,
    Users,
    Inbox,
} from 'lucide-react';

import AppLayout from '@/layouts/app-layout';

type Registro = {
    cliente: string;
    destino: string;
    toneladas: number;
};

type Mes = {
    mes: string;
    titulo: string;
    total_toneladas: number;
    dados: Registro[];
};

type Props = {
    meses: Mes[];
};

const mesesPt: Record<string, string> = {
    January: 'Janeiro',
    February: 'Fevereiro',
    March: 'Março',
    April: 'Abril',
    May: 'Maio',
    June: 'Junho',
    July: 'Julho',
    August: 'Agosto',
    September: 'Setembro',
    October: 'Outubro',
    November: 'Novembro',
    December: 'Dezembro',
};

function formatMes(titulo: string) {
    const partes = titulo.split('/');

    if (partes.length !== 2) {
        return titulo;
    }

    const nome = mesesPt[partes[0]] ?? partes[0];

    return `${nome}/${partes[1]}`;
}

function formatToneladas(valor: number) {
    return valor.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

export default function AnalisePedidos({ meses }: Props) {
    const totalToneladas = meses.reduce(
        (total, mes) => total + Number(mes.total_toneladas),
        0,
    );

    const clientes = new Set(
        meses.flatMap((mes) => mes.dados.map((registro) => registro.cliente)),
    );

    const mesMaiorVolume = meses.reduce(
        (maior, mes) =>
            Number(mes.total_toneladas) > Number(maior.total_toneladas)
                ? mes
                : maior,
        meses[0],
    );

    return (
        <>
            <Head title="Análise de Pedidos" />

            <div className="w-full px-6 py-6">
                {/* Cabeçalho */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold tracking-tight">
                        Análise de Pedidos
                    </h1>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Volume de pedidos dos últimos 3 meses
                    </p>
                </div>

                {/* Indicadores */}
                <div className="mb-6 grid w-full gap-4 md:grid-cols-3">
                    {/* Total toneladas */}
                    <div className="rounded-xl border bg-card p-5">
                        <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                                <Package className="h-6 w-6" />
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Total de toneladas
                                </p>

                                <p className="mt-1 text-2xl font-bold">
                                    {formatToneladas(totalToneladas)} t
                                </p>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    nos últimos 3 meses
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Total clientes */}
                    <div className="rounded-xl border bg-card p-5">
                        <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                                <Users className="h-6 w-6" />
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Total de clientes
                                </p>

                                <p className="mt-1 text-2xl font-bold">
                                    {clientes.size}
                                </p>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    com pedidos
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Maior volume */}
                    <div className="rounded-xl border bg-card p-5">
                        <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500">
                                <BarChart3 className="h-6 w-6" />
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Mês com maior volume
                                </p>

                                <p className="mt-1 text-2xl font-bold">
                                    {mesMaiorVolume
                                        ? formatMes(mesMaiorVolume.titulo)
                                        : '-'}
                                </p>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    {mesMaiorVolume
                                        ? `${formatToneladas(
                                              Number(
                                                  mesMaiorVolume.total_toneladas,
                                              ),
                                          )} t`
                                        : '0,00 t'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Meses */}
                <div className="grid w-full gap-4 lg:grid-cols-3">
                    {meses.map((mes, index) => {
                        const atual = index === meses.length - 1;
                        const total = Number(mes.total_toneladas);

                        return (
                            <div
                                key={mes.mes}
                                className={`flex min-w-0 flex-col overflow-hidden rounded-xl border bg-card ${
                                    atual
                                        ? 'border-amber-500/70'
                                        : ''
                                }`}
                            >
                                {/* Cabeçalho do mês */}
                                <div className="border-b px-5 py-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <CalendarDays className="h-5 w-5 text-blue-500" />

                                            <h2 className="text-xl font-bold">
                                                {formatMes(mes.titulo)}
                                            </h2>
                                        </div>

                                        <span
                                            className={`rounded-md px-3 py-1 text-xs font-medium ${
                                                atual
                                                    ? 'bg-emerald-500/15 text-emerald-400'
                                                    : 'bg-muted text-muted-foreground'
                                            }`}
                                        >
                                            {atual ? 'Atual' : 'Anterior'}
                                        </span>
                                    </div>

                                    <div className="mt-4">
                                        <p className="text-sm text-muted-foreground">
                                            Total do mês
                                        </p>

                                        <p
                                            className={`mt-1 text-2xl font-bold ${
                                                atual
                                                    ? 'text-emerald-400'
                                                    : 'text-blue-500'
                                            }`}
                                        >
                                            {formatToneladas(total)} t
                                        </p>

                                        {mes.dados.length > 0 && (
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                {mes.dados.length}{' '}
                                                {mes.dados.length === 1
                                                    ? 'cliente'
                                                    : 'clientes'}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Conteúdo */}
                                {mes.dados.length > 0 ? (
                                    <div className="min-w-0 overflow-x-auto">
                                        <table className="w-full min-w-[520px] text-sm">
                                            <thead>
                                                <tr className="border-b text-left text-xs text-muted-foreground">
                                                    <th className="w-10 px-4 py-3 font-medium">
                                                        #
                                                    </th>

                                                    <th className="px-4 py-3 font-medium">
                                                        Cliente
                                                    </th>

                                                    <th className="px-4 py-3 font-medium">
                                                        Destino
                                                    </th>

                                                    <th className="px-4 py-3 text-right font-medium">
                                                        Toneladas
                                                    </th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {mes.dados.map(
                                                    (registro, registroIndex) => (
                                                        <tr
                                                            key={`${registro.cliente}-${registro.destino}-${registroIndex}`}
                                                            className="border-b last:border-0"
                                                        >
                                                            <td className="px-4 py-3 text-muted-foreground">
                                                                {registroIndex +
                                                                    1}
                                                            </td>

                                                            <td className="px-4 py-3 font-semibold">
                                                                {registro.cliente}
                                                            </td>

                                                            <td className="px-4 py-3 text-muted-foreground">
                                                                {registro.destino}
                                                            </td>

                                                            <td className="px-4 py-3 text-right font-semibold whitespace-nowrap">
                                                                {formatToneladas(
                                                                    Number(
                                                                        registro.toneladas,
                                                                    ),
                                                                )}{' '}
                                                                t
                                                            </td>
                                                        </tr>
                                                    ),
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="flex min-h-[360px] flex-1 flex-col items-center justify-center px-6 text-center">
                                        <Inbox className="mb-5 h-16 w-16 text-muted-foreground/50" />

                                        <p className="text-sm text-muted-foreground">
                                            Nenhum pedido no período.
                                        </p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Rodapé */}
                <div className="mt-4 text-xs text-muted-foreground">
                    Considerados apenas pedidos com status diferente de
                    “Cancelado”.
                </div>
            </div>
        </>
    );
}