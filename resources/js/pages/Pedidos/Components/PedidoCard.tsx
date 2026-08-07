import Button from "@/components/Button";
import StatusBadge from "./StatusBadge";
import type { Pedido } from "@/types/pedido";

interface Props {
    pedido: Pedido;
    onEditar: (pedido: Pedido) => void;
    onProgramar: (pedido: Pedido) => void;
    onCancelar: (pedido: Pedido) => void;
}

export default function PedidoCard({
    pedido,
    onEditar,
    onProgramar,
    onCancelar,
}: Props) {

    return (

        <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-neutral-900">

            <div className="flex items-center justify-between">

                <div>

                    <h2 className="text-lg font-bold">
                        {pedido.codigo}
                    </h2>

                </div>

                <StatusBadge status={pedido.status} />

            </div>

            <div className="mt-6 space-y-2 text-sm">

                <p>
                    <strong>📅 Data:</strong> {pedido.data}
                </p>

                <p>
                    <strong>🏢 Cliente:</strong> {pedido.cliente}
                </p>

                <p>
                    <strong>📍 Destino:</strong> {pedido.destino}
                </p>

                <p>
                    <strong>📦 Produto:</strong> {pedido.produto}
                </p>

                <p>
                    <strong>⚖ Peso:</strong> {pedido.peso} kg
                </p>

                <p>
                    <strong>🚚 Frete:</strong> {pedido.tipo_frete}
                </p>

            </div>

            <div className="mt-8 flex flex-wrap gap-2">

                <Button
                    variant="primary"
                    onClick={() => onEditar(pedido)}
                >
                    ✏️ Editar
                </Button>

                {pedido.status === "Programado" && (

                    <Button
                        variant="warning"
                        onClick={() => onProgramar(pedido)}
                    >
                        🚛 Programar
                    </Button>

                )}

                <Button
                    variant="danger"
                    onClick={() => onCancelar(pedido)}
                >
                    ❌ Cancelar
                </Button>

            </div>

        </div>

    );
}