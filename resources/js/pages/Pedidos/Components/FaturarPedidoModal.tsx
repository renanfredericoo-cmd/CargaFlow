import { useState } from "react";

import Modal from "@/components/Modal";
import Button from "@/components/Button";

import { router } from "@inertiajs/react";

import type { Pedido } from "@/types/pedido";


interface Props {

    pedido: Pedido | null;

    onClose: () => void;

}



export default function FaturarPedidoModal({

    pedido,

    onClose,

}: Props) {


    const [numeroNfe, setNumeroNfe] = useState("");

    const [processing, setProcessing] = useState(false);




    function faturar() {


        if (!pedido) {

            return;

        }



        if (!numeroNfe) {

            alert("Informe o número da NF-e.");

            return;

        }



        setProcessing(true);



        router.put(`/pedidos/${pedido.id}/faturar`, {

            numero_nfe: numeroNfe,

        }, {


            preserveScroll: true,


            onSuccess: () => {

                setNumeroNfe("");

                onClose();

            },


            onFinish: () => {

                setProcessing(false);

            },


        });


    }




    return (

        <Modal

            show={!!pedido}

            onClose={onClose}

            title="🧾 Faturar Pedido"

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
                        Cliente
                    </p>


                    <p className="font-bold">

                        {pedido?.cliente ?? "-"}

                    </p>

                </div>




                <div>

                    <label className="mb-2 block text-sm font-medium">

                        Número da NF-e

                    </label>


                    <input

                        type="text"

                        value={numeroNfe}

                        onChange={(e) =>
                            setNumeroNfe(e.target.value)
                        }

                        className="w-full rounded-lg border px-4 py-3"

                        placeholder="Digite a NF-e"

                    />

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

                        onClick={faturar}

                    >

                        {processing

                            ? "Faturando..."

                            : "Faturar"

                        }

                    </Button>


                </div>



            </div>


        </Modal>

    );

}