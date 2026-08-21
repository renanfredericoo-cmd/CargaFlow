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

    const cliente =
        typeof pedido.cliente === "object"
            ? pedido.cliente.nome
            : pedido.cliente;

    const status = pedido.status ?? "Pedido";

    const statusClass =
        status === "Faturado"
            ? "bg-emerald-100 text-emerald-700"
            : status === "Cancelado"
              ? "bg-red-100 text-red-700"
              : status === "Em Carregamento"
                ? "bg-cyan-100 text-cyan-700"
                : status === "Agendado"
                  ? "bg-amber-100 text-amber-700"
                  : "bg-blue-100 text-blue-700";

    const criadoEm = pedido.created_at
        ? new Date(pedido.created_at).toLocaleString("pt-BR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
          })
        : "-";

    const inicioCarregamento = pedido.inicio_carregamento_at
        ? new Date(pedido.inicio_carregamento_at).toLocaleString("pt-BR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
          })
        : "-";

    const horaFaturamento = pedido.hora_faturamento
        ? String(pedido.hora_faturamento).substring(0, 5)
        : "-";

    const etapas = [
        {
            nome: "Pedido",
            ativo: true,
        },
        {
            nome: "Agendado",
            ativo: ["Agendado", "Em Carregamento", "Faturado"].includes(
                status
            ),
        },
        {
            nome: "Carregamento",
            ativo: ["Em Carregamento", "Faturado"].includes(status),
        },
        {
            nome: "Faturado",
            ativo: status === "Faturado",
        },
    ];

    return (
        <>
            <Head title="Detalhes do Pedido" />

            <div className="min-h-screen bg-neutral-950 py-6 print:bg-white print:py-0">
                {/* CABEÇALHO DA TELA */}
                <div className="mx-auto mb-6 flex max-w-5xl items-center justify-between gap-4 px-6 print:hidden">
                    <div>
                        <h1 className="text-xl font-bold text-white">
                            📄 Detalhes do Pedido
                        </h1>

                        <p className="mt-1 text-sm text-neutral-500">
                            Visualização e impressão do pedido.
                        </p>
                    </div>

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

                {/* DOCUMENTO */}
                <div className="mx-auto max-w-5xl px-6 print:max-w-none print:px-0">
                    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white text-neutral-900 shadow-xl print:rounded-none print:border-0 print:shadow-none">
                        {/* HEADER */}
                        <div className="border-b border-neutral-200 px-8 py-7">
                            <div className="flex items-start justify-between gap-6">
                                <div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-neutral-900 text-xl text-white">
                                            📊
                                        </div>

                                        <div>
                                            <div className="text-2xl font-black tracking-tight">
                                                CARGAFLOW
                                            </div>

                                            <div className="text-xs font-medium uppercase tracking-widest text-neutral-500">
                                                Gestão que flui.
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                                            Comprovante de pedido
                                        </p>

                                        <h2 className="mt-1 text-3xl font-black">
                                            #
                                            {pedido.numero_pedido ??
                                                pedido.codigo}
                                        </h2>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <span
                                        className={`inline-flex rounded-full px-4 py-2 text-sm font-bold ${statusClass}`}
                                    >
                                        {status}
                                    </span>

                                    <p className="mt-3 text-xs text-neutral-500">
                                        Criado em
                                    </p>

                                    <p className="text-sm font-semibold">
                                        {criadoEm}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* DADOS PRINCIPAIS */}
                        <div className="px-8 py-7">
                            <div className="mb-5 flex items-center gap-3">
                                <div className="h-8 w-1 rounded-full bg-blue-600" />

                                <div>
                                    <h3 className="text-lg font-bold">
                                        Dados do pedido
                                    </h3>

                                    <p className="text-xs text-neutral-500">
                                        Informações comerciais e operacionais
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 overflow-hidden rounded-xl border border-neutral-200">
                                <Info
                                    label="Cliente"
                                    value={cliente}
                                />

                                <Info
                                    label="Vendedor"
                                    value={pedido.vendedor ?? "-"}
                                />

                                <Info
                                    label="Destino"
                                    value={pedido.destino}
                                />

                                <Info
                                    label="Produto"
                                    value={
                                        pedido.produto?.descricao ?? "-"
                                    }
                                />

                                <Info
                                    label="Toneladas"
                                    value={`${Number(
                                        pedido.peso
                                    ).toLocaleString("pt-BR")} t`}
                                />

                                <Info
                                    label="Frete"
                                    value={pedido.tipo_frete ?? "-"}
                                />

                                <Info
                                    label="Transportadora"
                                    value={pedido.transportadora ?? "-"}
                                />

                                <Info
                                    label="Placa"
                                    value={pedido.placa ?? "-"}
                                />

                                <Info
                                    label="NF-e"
                                    value={pedido.numero_nfe ?? "-"}
                                />

                                <Info
                                    label="Início do carregamento"
                                    value={inicioCarregamento}
                                />

                                <Info
                                    label="Hora do faturamento"
                                    value={horaFaturamento}
                                />

                                <Info
                                    label="Hora do pedido"
                                    value={criadoEm}
                                />
                            </div>

                            {/* ANDAMENTO */}
                            <div className="mt-8">
                                <div className="mb-5 flex items-center gap-3">
                                    <div className="h-8 w-1 rounded-full bg-emerald-500" />

                                    <div>
                                        <h3 className="text-lg font-bold">
                                            Andamento do pedido
                                        </h3>

                                        <p className="text-xs text-neutral-500">
                                            Evolução operacional
                                        </p>
                                    </div>
                                </div>

                                <div className="rounded-xl border border-neutral-200 p-6">
                                    <div className="flex items-center justify-between">
                                        {etapas.map((etapa, index) => (
                                            <div
                                                key={etapa.nome}
                                                className="flex flex-1 items-center"
                                            >
                                                <div className="flex flex-col items-center">
                                                    <div
                                                        className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-bold ${
                                                            etapa.ativo
                                                                ? "border-blue-600 bg-blue-600 text-white"
                                                                : "border-neutral-300 bg-white text-neutral-400"
                                                        }`}
                                                    >
                                                        {etapa.ativo
                                                            ? "✓"
                                                            : index + 1}
                                                    </div>

                                                    <span
                                                        className={`mt-2 text-xs font-semibold ${
                                                            etapa.ativo
                                                                ? "text-neutral-900"
                                                                : "text-neutral-400"
                                                        }`}
                                                    >
                                                        {etapa.nome}
                                                    </span>
                                                </div>

                                                {index <
                                                    etapas.length - 1 && (
                                                    <div
                                                        className={`mx-3 h-0.5 flex-1 ${
                                                            etapas[index + 1]
                                                                .ativo
                                                                ? "bg-blue-600"
                                                                : "bg-neutral-200"
                                                        }`}
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-5 border-t border-neutral-200 pt-4">
                                        <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                                            Status atual
                                        </span>

                                        <p className="mt-1 text-base font-bold">
                                            {status}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* OBSERVAÇÕES */}
                            <div className="mt-8">
                                <div className="mb-5 flex items-center gap-3">
                                    <div className="h-8 w-1 rounded-full bg-amber-500" />

                                    <div>
                                        <h3 className="text-lg font-bold">
                                            Observações
                                        </h3>
                                    </div>
                                </div>

                                <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-5">
                                    <p className="whitespace-pre-wrap text-sm leading-6 text-neutral-700">
                                        {pedido.observacoes || "Nenhuma observação registrada."}
                                    </p>
                                </div>
                            </div>

                            {/* HISTÓRICO */}
                            <div className="mt-8">
                                <div className="mb-5 flex items-center gap-3">
                                    <div className="h-8 w-1 rounded-full bg-violet-600" />

                                    <div>
                                        <h3 className="text-lg font-bold">
                                            Histórico de alterações
                                        </h3>

                                        <p className="text-xs text-neutral-500">
                                            Registro das alterações realizadas
                                            no pedido
                                        </p>
                                    </div>
                                </div>

                                <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-5">
                                    <div className="flex items-start gap-4">
                                        <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-100 text-sm">
                                            ✓
                                        </div>

                                        <div>
                                            <p className="text-sm font-bold text-neutral-900">
                                                Pedido criado
                                            </p>

                                            <p className="mt-1 text-xs text-neutral-500">
                                                {criadoEm}
                                            </p>

                                            {pedido.user && (
                                                <p className="mt-1 text-xs text-neutral-600">
                                                    Responsável:{" "}
                                                    <strong>
                                                        {pedido.user.name}
                                                    </strong>
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-5 border-t border-neutral-200 pt-4 text-xs text-neutral-400">
                                        Histórico detalhado de alterações será
                                        exibido aqui quando o registro de
                                        eventos estiver disponível.
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RODAPÉ */}
                        <div className="border-t border-neutral-200 bg-neutral-50 px-8 py-5">
                            <div className="flex items-center justify-between gap-4 text-xs text-neutral-500">
                                <span>
                                    CargaFlow — Gestão que flui.
                                </span>

                                <span>
                                    Documento gerado pelo sistema
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

function Info({
    label,
    value,
}: {
    label: string;
    value: string | number | null | undefined;
}) {
    return (
        <div className="border-b border-r border-neutral-200 p-4 last:border-b-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                {label}
            </p>

            <p className="mt-1 text-sm font-semibold text-neutral-900">
                {value || "-"}
            </p>
        </div>
    );
}