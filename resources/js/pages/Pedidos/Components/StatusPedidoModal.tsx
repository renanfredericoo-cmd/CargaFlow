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

    function imprimir() {

        const janela = window.open("", "_blank");

        if (!janela) {
            return;
        }

        janela.document.write(`
            <html>
                <head>
                    <title>Pedido ${pedido.numero_pedido}</title>

                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            padding: 30px;
                            color: #111;
                        }

                        h1 {
                            margin-bottom: 20px;
                        }

                        .dados {
                            display: grid;
                            grid-template-columns: 1fr 1fr;
                            gap: 12px;
                            margin-bottom: 30px;
                        }

                        .campo {
                            border-bottom: 1px solid #ddd;
                            padding-bottom: 6px;
                        }

                        .label {
                            font-size: 12px;
                            color: #666;
                        }

                        .valor {
                            font-size: 16px;
                            font-weight: bold;
                        }

                        .status {
                            margin-top: 30px;
                            padding: 15px;
                            border: 1px solid #ddd;
                            border-radius: 8px;
                        }
                    </style>
                </head>

                <body>

                    <h1>Pedido ${pedido.numero_pedido ?? pedido.codigo}</h1>

                    <div class="dados">

                        <div class="campo">
                            <div class="label">Cliente</div>
                            <div class="valor">
                                ${
                                    typeof pedido.cliente === "object"
                                        ? pedido.cliente.nome
                                        : pedido.cliente ?? "-"
                                }
                            </div>
                        </div>

                        <div class="campo">
                            <div class="label">Vendedor</div>
                            <div class="valor">
                                ${pedido.vendedor ?? "-"}
                            </div>
                        </div>

                        <div class="campo">
                            <div class="label">Destino</div>
                            <div class="valor">
                                ${pedido.destino ?? "-"}
                            </div>
                        </div>

                        <div class="campo">
                            <div class="label">Produto</div>
                            <div class="valor">
                                ${pedido.produto?.descricao ?? "-"}
                            </div>
                        </div>

                        <div class="campo">
                            <div class="label">Toneladas</div>
                            <div class="valor">
                                ${
                                    pedido.peso != null
                                        ? `${Number(pedido.peso).toLocaleString(
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
                            <div class="label">Frete</div>
                            <div class="valor">
                                ${pedido.tipo_frete}
                            </div>
                        </div>

                        <div class="campo">
                            <div class="label">Transportadora</div>
                            <div class="valor">
                                ${pedido.transportadora ?? "-"}
                            </div>
                        </div>

                        <div class="campo">
                            <div class="label">NF-e</div>
                            <div class="valor">
                                ${pedido.numero_nfe ?? "-"}
                            </div>
                        </div>

                    </div>

                    <div class="status">

                        <strong>Andamento do pedido</strong>

                        <p>
                            ${etapas
                                .map((etapa, index) => {

                                    const concluida =
                                        index <= statusIndex &&
                                        pedido.status !== "Cancelado";

                                    return `
                                        <div style="margin: 12px 0;">
                                            ${
                                                concluida
                                                    ? "✓"
                                                    : "○"
                                            }
                                            ${etapa}
                                        </div>
                                    `;
                                })
                                .join("")}
                        </p>

                        <strong>
                            Status atual: ${pedido.status}
                        </strong>

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
                            {pedido.destino}
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
                                ? `${Number(pedido.peso).toLocaleString(
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
                            {pedido.tipo_frete}
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
                                        {concluida ? "✓" : index + 1}
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