import React, { useEffect } from "react";

import Modal from "@/components/Modal";
import Button from "@/components/Button";
import Input from "@/components/Input";

import { router } from "@inertiajs/react";

import type { Pedido } from "@/types/pedido";

interface Props {
    pedido: Pedido | null;
    onClose: () => void;
}

export default function EditarTransportadoraModal({
    pedido,
    onClose,
}: Props) {

    const [transportadora, setTransportadora] = React.useState("");
    const [processing, setProcessing] = React.useState(false);

    useEffect(() => {
        if (pedido) {
            setTransportadora(pedido.transportadora ?? "");
        }
    }, [pedido]);

    function salvar(e: React.FormEvent) {
        e.preventDefault();

        if (!pedido) {
            return;
        }

        setProcessing(true);

        router.patch(
            `/pedidos/${pedido.id}/transportadora`,
            {
                transportadora,
            },
            {
                preserveScroll: true,

                onSuccess: () => {
                    onClose();
                },

                onFinish: () => {
                    setProcessing(false);
                },
            }
        );
    }

    return (
        <Modal
            show={pedido !== null}
            onClose={onClose}
            title="🚚 Editar Transportadora"
        >
            <form onSubmit={salvar}>

                <div className="mb-4">
                    <p className="text-sm text-gray-500">
                        Pedido
                    </p>

                    <p className="font-bold">
                        {pedido?.numero_pedido ?? pedido?.codigo}
                    </p>
                </div>

                <Input
                    label="Transportadora"
                    value={transportadora}
                    onChange={(e) =>
                        setTransportadora(e.target.value)
                    }
                />

                <div className="mt-6 flex justify-end gap-3">

                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onClose}
                    >
                        Cancelar
                    </Button>

                    <Button
                        type="submit"
                        variant="success"
                        disabled={processing}
                    >
                        {processing
                            ? "Salvando..."
                            : "Salvar"}
                    </Button>

                </div>

            </form>
        </Modal>
    );
}