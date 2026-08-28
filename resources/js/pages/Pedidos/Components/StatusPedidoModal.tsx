import Modal from "@/components/Modal";
import Button from "@/components/Button";

import type { Pedido } from "@/types/pedido";

interface Props {
    pedido: Pedido | null;
    onClose: () => void;
}

export default function StatusPedidoModal({
    pedido,
    onClose,
}: Props) {
    if (!pedido) {
        return null;
    }

    const etapas = [
        "Pedido",
        "Agendado",
        "Em Carregamento",
        "Faturado",
    ];

    const statusIndex = etapas.indexOf(pedido.status);

    const historicos =
    (pedido as Pedido & {
        historicos?: Array<{
            id: number;
            acao: string;
            detalhes?: string | null;
            created_at: string;
            usuario?: {
                id: number;
                name: string;
            } | null;
        }>;
    }).historicos ?? [];

const historicoCriacao = historicos.find(
    (item) => item.acao === "Pedido criado"
);

const usuarioCriacao =
    historicoCriacao?.usuario?.name ??
    pedido.user?.name ??
    null;

    function imprimir() {
        const janela = window.open("", "_blank");

        if (!janela) {
            return;
        }

        const cliente =
            typeof pedido.cliente === "object"
                ? pedido.cliente.nome
                : pedido.cliente ?? "-";

        const numeroPedido =
            pedido.numero_pedido ?? pedido.codigo;

        const formatarDataHora = (
            valor: string | null | undefined
        ) => {
            if (!valor) {
                return "-";
            }

            return new Date(valor).toLocaleString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });
        };

        const formatarAgendamento = () => {
            if (
                !pedido.data_agendamento ||
                !pedido.hora_agendamento
            ) {
                return null;
            }

            return `${String(pedido.data_agendamento)
                .substring(0, 10)
                .split("-")
                .reverse()
                .join("/")}, ${String(
                pedido.hora_agendamento
            ).substring(0, 5)}`;
        };

        const dataCriacao = formatarDataHora(
            pedido.created_at
        );

        const dataCarregamento = formatarDataHora(
            pedido.inicio_carregamento_at
        );

        const agendamento = formatarAgendamento();

const historicoAgendamento = historicos.find(
    (item) => item.acao === "Pedido agendado"
);

const historicoCarregamento = historicos.find(
    (item) => item.acao === "Carregamento iniciado"
);

const historicoFaturamento = historicos.find(
    (item) => item.acao === "Pedido faturado"
);

const dataAgendamentoHistorico = historicoAgendamento?.created_at
    ? formatarDataHora(historicoAgendamento.created_at)
    : agendamento;

const dataCarregamentoHistorico = historicoCarregamento?.created_at
    ? formatarDataHora(historicoCarregamento.created_at)
    : dataCarregamento;

const dataFaturamento = historicoFaturamento?.created_at
    ? formatarDataHora(historicoFaturamento.created_at)
    : pedido.data && pedido.hora_faturamento
        ? `${String(pedido.data).substring(0, 10).split("-").reverse().join("/")}, ${String(pedido.hora_faturamento).substring(0, 5)}`
        : null;

const usuarioAgendamento =
    historicoAgendamento?.usuario?.name ?? null;

const usuarioCarregamento =
    historicoCarregamento?.usuario?.name ?? null;

const usuarioFaturamento =
    historicoFaturamento?.usuario?.name ??
    pedido.alterado_por?.name ??
    null;

        /*
        |--------------------------------------------------------------------------
        | Histórico operacional
        |--------------------------------------------------------------------------
        */

        const historico: string[] = [];

        historico.push(`
            <div class="historico-item">
                <div class="historico-ponto ativo">✓</div>

                <div class="historico-conteudo">
    <div class="historico-titulo">
        Pedido criado
    </div>

    <div class="historico-data">
        ${dataCriacao}
    </div>

    ${
        usuarioCriacao
            ? `
                <div class="historico-detalhe">
                    Usuário: ${usuarioCriacao}
                </div>
            `
            : ""
    }
</div>
            </div>
        `);

        if (agendamento) {
    historico.push(`
        <div class="historico-item">
            <div class="historico-ponto ativo">✓</div>

            <div class="historico-conteudo">
                <div class="historico-titulo">
                    Pedido agendado
                </div>

                <div class="historico-data">
                    ${dataAgendamentoHistorico ?? agendamento}
                </div>

                ${
                    usuarioAgendamento
                        ? `
                            <div class="historico-detalhe">
                                Usuário: ${usuarioAgendamento}
                            </div>
                        `
                        : ""
                }
            </div>
        </div>
    `);
}

        if (pedido.inicio_carregamento_at) {
    historico.push(`
        <div class="historico-item">
            <div class="historico-ponto ativo">✓</div>

            <div class="historico-conteudo">
                <div class="historico-titulo">
                    Carregamento iniciado
                </div>

                <div class="historico-data">
                    ${dataCarregamentoHistorico}
                </div>

                ${
                    usuarioCarregamento
                        ? `<div class="historico-detalhe">
                            Usuário: ${usuarioCarregamento}
                           </div>`
                        : ''
                }
            </div>
        </div>
    `);
}

        if (pedido.status === "Faturado") {
    

    

    historico.push(`
        <div class="historico-item">
            <div class="historico-ponto ativo">✓</div>

            <div class="historico-conteudo">
                <div class="historico-titulo">
                    Pedido faturado
                </div>

                <div class="historico-data">
                    ${
                        dataFaturamento
                            ? `Horário: ${dataFaturamento}`
                            : "-"
                    }
                </div>

                ${
                    usuarioFaturamento
                        ? `
                            <div class="historico-detalhe">
                                Usuário: ${usuarioFaturamento}
                            </div>
                        `
                        : ""
                }

                ${
                    pedido.numero_nfe
                        ? `
                            <div class="historico-detalhe">
                                NF-e: ${pedido.numero_nfe}
                            </div>
                        `
                        : ""
                }
            </div>
        </div>
    `);
}
        /*
        |--------------------------------------------------------------------------
        | Andamento visual
        |--------------------------------------------------------------------------
        */

        const andamento = etapas
            .map((etapa, index) => {
                const concluida =
                    index <= statusIndex &&
                    pedido.status !== "Cancelado";

                const atual =
                    index === statusIndex;

                return `
                    <div class="etapa">
                        <div class="etapa-circulo ${
                            concluida
                                ? "concluida"
                                : "pendente"
                        }">
                            ${concluida ? "✓" : index + 1}
                        </div>

                        <div class="etapa-nome ${
                            atual ? "atual" : ""
                        }">
                            ${etapa}
                        </div>
                    </div>
                `;
            })
            .join("");

        janela.document.write(`
            <html>
                <head>
                    <title>
                        CargaFlow - Pedido ${numeroPedido}
                    </title>

                    <style>
                        * {
                            box-sizing: border-box;
                        }

                        body {
                            margin: 0;
                            padding: 28px;
                            background: #ffffff;
                            color: #171717;
                            font-family:
                                Arial,
                                Helvetica,
                                sans-serif;
                            font-size: 12px;
                        }

                        .documento {
                            max-width: 900px;
                            margin: 0 auto;
                        }

                        .cabecalho {
                            display: flex;
                            justify-content: space-between;
                            align-items: flex-start;
                            padding-bottom: 22px;
                            border-bottom: 2px solid #171717;
                        }

                        .marca {
                            display: flex;
                            align-items: center;
                            gap: 12px;
                        }

                        .marca-icone {
                            width: 42px;
                            height: 42px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            border-radius: 10px;
                            background: #171717;
                            color: #ffffff;
                            font-size: 20px;
                        }

                        .marca-nome {
                            font-size: 23px;
                            font-weight: 800;
                            letter-spacing: -0.5px;
                        }

                        .marca-subtitulo {
                            margin-top: 3px;
                            font-size: 9px;
                            color: #737373;
                            text-transform: uppercase;
                            letter-spacing: 1.5px;
                        }

                        .cabecalho-direita {
                            text-align: right;
                        }

                        .pedido-label {
                            font-size: 9px;
                            color: #737373;
                            text-transform: uppercase;
                            letter-spacing: 1px;
                        }

                        .pedido-numero {
                            margin-top: 3px;
                            font-size: 24px;
                            font-weight: 800;
                        }

                        .status-badge {
                            display: inline-block;
                            margin-top: 7px;
                            padding: 6px 12px;
                            border-radius: 999px;
                            background: #e0f2fe;
                            color: #0369a1;
                            font-size: 10px;
                            font-weight: 700;
                        }

                        .titulo-secao {
                            display: flex;
                            align-items: center;
                            gap: 8px;
                            margin: 24px 0 12px;
                        }

                        .titulo-barra {
                            width: 4px;
                            height: 24px;
                            border-radius: 5px;
                            background: #2563eb;
                        }

                        .titulo-secao h2 {
                            margin: 0;
                            font-size: 15px;
                        }

                        .titulo-secao p {
                            margin: 2px 0 0;
                            font-size: 9px;
                            color: #737373;
                        }

                        .dados {
                            display: grid;
                            grid-template-columns: 1fr 1fr;
                            border: 1px solid #e5e5e5;
                            border-radius: 10px;
                            overflow: hidden;
                        }

                        .campo {
                            padding: 11px 13px;
                            border-right: 1px solid #e5e5e5;
                            border-bottom: 1px solid #e5e5e5;
                        }

                        .campo:nth-child(even) {
                            border-right: none;
                        }

                        .campo-label {
                            font-size: 8px;
                            font-weight: 700;
                            color: #737373;
                            text-transform: uppercase;
                            letter-spacing: 0.8px;
                        }

                        .campo-valor {
                            margin-top: 4px;
                            font-size: 12px;
                            font-weight: 700;
                        }

                        .andamento {
                            padding: 18px;
                            border: 1px solid #e5e5e5;
                            border-radius: 10px;
                        }

                        .etapas {
                            display: flex;
                            align-items: flex-start;
                        }

                        .etapa {
                            position: relative;
                            flex: 1;
                            text-align: center;
                        }

                        .etapa:not(:last-child)::after {
                            content: "";
                            position: absolute;
                            top: 14px;
                            left: 58%;
                            width: 84%;
                            height: 2px;
                            background: #e5e5e5;
                        }

                        .etapa-circulo {
                            position: relative;
                            z-index: 2;
                            width: 29px;
                            height: 29px;
                            margin: 0 auto;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            border-radius: 50%;
                            font-size: 10px;
                            font-weight: 700;
                            border: 2px solid #d4d4d4;
                            background: #ffffff;
                            color: #a3a3a3;
                        }

                        .etapa-circulo.concluida {
                            border-color: #2563eb;
                            background: #2563eb;
                            color: #ffffff;
                        }

                        .etapa-nome {
                            margin-top: 7px;
                            font-size: 9px;
                            color: #737373;
                        }

                        .etapa-nome.atual {
                            color: #171717;
                            font-weight: 700;
                        }

                        .status-atual {
                            margin-top: 15px;
                            padding-top: 12px;
                            border-top: 1px solid #e5e5e5;
                        }

                        .status-atual-label {
                            font-size: 8px;
                            color: #737373;
                            text-transform: uppercase;
                            letter-spacing: 0.8px;
                        }

                        .status-atual-valor {
                            margin-top: 3px;
                            font-size: 12px;
                            font-weight: 700;
                        }

                        .observacoes {
                            padding: 14px;
                            border: 1px solid #e5e5e5;
                            border-radius: 10px;
                            background: #fafafa;
                        }

                        .observacoes-titulo {
                            font-size: 10px;
                            font-weight: 700;
                        }

                        .observacoes-texto {
                            margin-top: 7px;
                            white-space: pre-wrap;
                            font-size: 11px;
                            line-height: 1.5;
                            color: #404040;
                        }

                        .historico {
                            padding: 16px;
                            border: 1px solid #e5e5e5;
                            border-radius: 10px;
                        }

                        .historico-item {
                            position: relative;
                            display: flex;
                            gap: 12px;
                            padding-bottom: 17px;
                        }

                        .historico-item:last-child {
                            padding-bottom: 0;
                        }

                        .historico-item:not(:last-child)::after {
                            content: "";
                            position: absolute;
                            left: 13px;
                            top: 29px;
                            bottom: 0;
                            width: 1px;
                            background: #d4d4d4;
                        }

                        .historico-ponto {
                            position: relative;
                            z-index: 2;
                            width: 27px;
                            height: 27px;
                            flex-shrink: 0;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            border-radius: 50%;
                            background: #2563eb;
                            color: #ffffff;
                            font-size: 11px;
                            font-weight: 700;
                        }

                        .historico-ponto.cancelado {
                            background: #dc2626;
                        }

                        .historico-titulo {
                            font-size: 11px;
                            font-weight: 700;
                        }

                        .historico-data {
                            margin-top: 3px;
                            font-size: 9px;
                            color: #737373;
                        }

                        .historico-detalhe {
                            margin-top: 3px;
                            font-size: 9px;
                            color: #404040;
                        }

                        .cancelado-texto {
                            color: #dc2626;
                        }

                        .rodape {
                            display: flex;
                            justify-content: space-between;
                            margin-top: 25px;
                            padding-top: 12px;
                            border-top: 1px solid #e5e5e5;
                            font-size: 8px;
                            color: #737373;
                        }

                        @media print {
                            @page {
                                size: A4 portrait;
                                margin: 10mm;
                            }

                            body {
                                padding: 0;
                                font-size: 11px;
                            }

                            .documento {
                                max-width: none;
                            }

                            .titulo-secao {
                                margin-top: 18px;
                            }

                            .campo {
                                padding: 9px 11px;
                            }

                            .andamento,
                            .historico,
                            .observacoes {
                                break-inside: avoid;
                            }
                        }
                    </style>
                </head>

                <body>
                    <div class="documento">

                        <!-- CABEÇALHO -->
                        <div class="cabecalho">
                            <div class="marca">
                                <div class="marca-icone">
                                    📊
                                </div>

                                <div>
                                    <div class="marca-nome">
                                        CARGAFLOW
                                    </div>

                                    <div class="marca-subtitulo">
                                        Gestão que flui.
                                    </div>
                                </div>
                            </div>

                            <div class="cabecalho-direita">
                                <div class="pedido-label">
                                    Comprovante de pedido
                                </div>

                                <div class="pedido-numero">
                                    #${numeroPedido}
                                </div>

                                <div class="status-badge">
                                    ${pedido.status}
                                </div>
                            </div>
                        </div>

                        <!-- DADOS -->
                        <div class="titulo-secao">
                            <div class="titulo-barra"></div>

                            <div>
                                <h2>Dados do pedido</h2>

                                <p>
                                    Informações comerciais e operacionais
                                </p>
                            </div>
                        </div>

                        <div class="dados">

                            <div class="campo">
                                <div class="campo-label">
                                    Cliente
                                </div>

                                <div class="campo-valor">
                                    ${cliente}
                                </div>
                            </div>

                            <div class="campo">
                                <div class="campo-label">
                                    Vendedor
                                </div>

                                <div class="campo-valor">
                                    ${pedido.vendedor ?? "-"}
                                </div>
                            </div>

                            <div class="campo">
                                <div class="campo-label">
                                    Destino
                                </div>

                                <div class="campo-valor">
                                    ${pedido.destino ?? "-"}
                                </div>
                            </div>

                            <div class="campo">
                                <div class="campo-label">
                                    Produto
                                </div>

                                <div class="campo-valor">
                                    ${pedido.produto?.descricao ?? "-"}
                                </div>
                            </div>

                            <div class="campo">
                                <div class="campo-label">
                                    Toneladas
                                </div>

                                <div class="campo-valor">
                                    ${
                                        pedido.peso != null
                                            ? `${Number(
                                                  pedido.peso
                                              ).toLocaleString(
                                                  "pt-BR",
                                                  {
                                                      minimumFractionDigits: 2,
                                                      maximumFractionDigits: 2,
                                                  }
                                              )} t`
                                            : "-"
                                    }
                                </div>
                            </div>

                            <div class="campo">
                                <div class="campo-label">
                                    Frete
                                </div>

                                <div class="campo-valor">
                                    ${pedido.tipo_frete ?? "-"}
                                </div>
                            </div>

                            <div class="campo">
                                <div class="campo-label">
                                    Transportadora
                                </div>

                                <div class="campo-valor">
                                    ${pedido.transportadora ?? "-"}
                                </div>
                            </div>

                            <div class="campo">
                                <div class="campo-label">
                                    Placa
                                </div>

                                <div class="campo-valor">
                                    ${pedido.placa ?? "-"}
                                </div>
                            </div>

                            

                        </div>

                        <!-- ANDAMENTO -->
                        <div class="titulo-secao">
                            <div
                                class="titulo-barra"
                                style="background:#10b981;"
                            ></div>

                            <div>
                                <h2>Andamento do pedido</h2>

                                <p>
                                    Evolução operacional
                                </p>
                            </div>
                        </div>

                        <div class="andamento">
                            <div class="etapas">
                                ${andamento}
                            </div>

                            <div class="status-atual">
                                <div class="status-atual-label">
                                    Status atual
                                </div>

                                <div class="status-atual-valor">
                                    ${pedido.status}
                                </div>
                            </div>
                        </div>

                        <!-- OBSERVAÇÕES -->
                        <div class="titulo-secao">
                            <div
                                class="titulo-barra"
                                style="background:#f59e0b;"
                            ></div>

                            <div>
                                <h2>Observações</h2>
                            </div>
                        </div>

                        <div class="observacoes">
    <div class="observacoes-texto">${pedido.observacoes ?? "Nenhuma observação registrada."}</div>
</div>

                        <!-- HISTÓRICO -->
                        <div class="titulo-secao">
                            <div
                                class="titulo-barra"
                                style="background:#7c3aed;"
                            ></div>

                            <div>
                                <h2>Histórico do pedido</h2>

                                <p>
                                    Evolução registrada no processo
                                </p>
                            </div>
                        </div>

                        <div class="historico">
                            ${historico.join("")}
                        </div>

                        <!-- RODAPÉ -->
                        <div class="rodape">
                            <span>
                                CargaFlow — Gestão que flui.
                            </span>

                            <span>
                                Documento gerado pelo sistema
                            </span>
                        </div>

                    </div>
                </body>
            </html>
        `);

        janela.document.close();

        janela.focus();

        janela.print();

        janela.close();
    }

    return (
        <Modal
            show={pedido !== null}
            onClose={onClose}
            title={`Pedido ${pedido.numero_pedido ?? pedido.codigo}`}
        >
            <div className="space-y-5">

                <div className="grid grid-cols-2 gap-4">

                    <div>
                        <p className="text-xs text-gray-500">
                            Cliente
                        </p>

                        <p className="font-semibold">
                            {typeof pedido.cliente === "object"
                                ? pedido.cliente.nome
                                : pedido.cliente ?? "-"}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs text-gray-500">
                            Vendedor
                        </p>

                        <p className="font-semibold">
                            {pedido.vendedor ?? "-"}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs text-gray-500">
                            Destino
                        </p>

                        <p className="font-semibold">
                            {pedido.destino ?? "-"}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs text-gray-500">
                            Produto
                        </p>

                        <p className="font-semibold">
                            {pedido.produto?.descricao ?? "-"}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs text-gray-500">
                            Toneladas
                        </p>

                        <p className="font-semibold">
                            {pedido.peso != null
                                ? `${Number(
                                      pedido.peso
                                  ).toLocaleString(
                                      "pt-BR",
                                      {
                                          minimumFractionDigits: 2,
                                          maximumFractionDigits: 2,
                                      }
                                  )} t`
                                : "-"}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs text-gray-500">
                            Frete
                        </p>

                        <span
                            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                                pedido.tipo_frete === "CIF"
                                    ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                                    : "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300"
                            }`}
                        >
                            {pedido.tipo_frete ?? "-"}
                        </span>
                    </div>

                    <div>
                        <p className="text-xs text-gray-500">
                            Transportadora
                        </p>

                        <p className="font-semibold">
                            {pedido.transportadora ?? "-"}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs text-gray-500">
                            NF-e
                        </p>

                        <p className="font-semibold">
                            {pedido.numero_nfe ?? "-"}
                        </p>
                    </div>

                </div>

                {/* OBSERVAÇÕES */}

                <div className="rounded-xl border p-4 dark:border-neutral-700">

                    <p className="mb-2 font-semibold">
                        Observações
                    </p>

                    <p className="whitespace-pre-wrap text-sm text-gray-600 dark:text-gray-300">
                        {pedido.observacoes || "-"}
                    </p>

                </div>

                {/* ANDAMENTO */}

                <div className="rounded-xl border p-4 dark:border-neutral-700">

                    <p className="mb-4 font-semibold">
                        Andamento do pedido
                    </p>

                    <div className="flex items-center justify-between gap-2">

                        {etapas.map((etapa, index) => {

                            const concluida =
                                index <= statusIndex &&
                                pedido.status !== "Cancelado";

                            const atual =
                                index === statusIndex;

                            return (
                                <div
                                    key={etapa}
                                    className="flex flex-1 flex-col items-center text-center"
                                >

                                    <div
                                        className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${
                                            concluida
                                                ? "bg-green-500 text-white"
                                                : "bg-gray-200 text-gray-500 dark:bg-neutral-700"
                                        }`}
                                    >
                                        {concluida
                                            ? "✓"
                                            : index + 1}
                                    </div>

                                    <span
                                        className={`mt-2 text-xs ${
                                            atual
                                                ? "font-bold"
                                                : "text-gray-500"
                                        }`}
                                    >
                                        {etapa}
                                    </span>

                                </div>
                            );
                        })}

                    </div>

                    <div className="mt-4 text-center">

                        <span className="text-sm text-gray-500">
                            Status atual
                        </span>

                        <p className="font-bold">
                            {pedido.status}
                        </p>

                    </div>

                </div>

                <div className="flex justify-end gap-3">

                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onClose}
                    >
                        Fechar
                    </Button>

                    <Button
                        type="button"
                        variant="primary"
                        onClick={imprimir}
                    >
                        🖨️ Imprimir
                    </Button>

                </div>

            </div>
        </Modal>
    );
}