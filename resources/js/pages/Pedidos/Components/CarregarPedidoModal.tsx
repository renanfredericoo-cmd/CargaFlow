import { useState } from "react";

import Modal from "@/components/Modal";
import Button from "@/components/Button";

import { router } from "@inertiajs/react";

import type { Pedido } from "@/types/pedido";


interface Props {
    pedido: Pedido | null;

    onClose: () => void;
}


export default function CarregarPedidoModal({

    pedido,

    onClose,

}: Props) {


    const [placa, setPlaca] = useState("");

    const [processing, setProcessing] = useState(false);


    function carregar() {

        if (!pedido) {
            return;
        }


        if (!placa) {

            alert("Informe a placa do veículo.");

            return;

        }


        const agora = new Date();


        setProcessing(true);


        router.put(
            `/pedidos/${pedido.id}/carregar`,
            {
                placa,

                data_carregamento:
                    agora.toISOString().split("T")[0],

                hora_carregamento:
                    agora.toTimeString().slice(0, 5),
            },
            {
                preserveScroll: true,

                onSuccess: () => {

                    setPlaca("");

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

            show={!!pedido}

            onClose={onClose}

            title="🚛 Iniciar Carregamento"

        >

            <div className="space-y-4">


                <div>

                    <p className="text-sm text-gray-500">
                        Pedido
                    </p>

                    <p className="font-bold">
                        {pedido?.numero_pedido ?? pedido?.codigo}
                    </p>

                </div>


                <div>

                    <p className="text-sm text-gray-500">
                        Transportadora
                    </p>

                    <p className="font-bold">
                        {pedido?.transportadora ?? "-"}
                    </p>

                </div>


                <div>

                    <p className="text-sm text-gray-500">
                        Produto
                    </p>

                    <p className="font-bold">
                        {pedido?.produto?.descricao ?? "-"}
                    </p>

                </div>


                <div>

                    <p className="text-sm text-gray-500">
                        Toneladas
                    </p>

                    <p className="font-bold">
                        {pedido?.peso != null
                            ? `${Number(pedido.peso).toLocaleString(
                                "pt-BR",
                                {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                }
                            )} t`
                            : "-"
                        }
                    </p>

                </div>


                <div>

                    <label className="mb-2 block text-sm font-medium">
                        Placa
                    </label>


                    <input

                        type="text"

                        value={placa}

                        onChange={(e) =>
                            setPlaca(e.target.value)
                        }

                        className="
                            w-full
                            rounded-lg
                            border
                            px-4
                            py-3
                        "

                        placeholder="Digite a placa"

                    />

                </div>


                <div>

                    <p className="text-sm text-gray-500">
                        Observação do pedido
                    </p>


                    <p
                        className="
                            rounded-md
                            border
                            bg-gray-50
                            p-3
                            text-sm
                            dark:bg-neutral-800
                        "
                    >

                        {pedido?.observacoes ?? "-"}

                    </p>

                </div>


                <div className="mt-6 flex justify-end gap-3">


                    <Button

                        type="button"

                        variant="secondary"

                        onClick={onClose}

                    >

                        Cancelar

                    </Button>


                    <Button

                        type="button"

                        variant="success"

                        disabled={processing}

                        onClick={carregar}

                    >

                        {processing
                            ? "Iniciando..."
                            : "Iniciar Carregamento"
                        }

                    </Button>


                </div>


            </div>

        </Modal>

    );

}