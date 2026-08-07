import React, { useEffect } from "react";

import Modal from "@/components/Modal";
import Button from "@/components/Button";
import Input from "@/components/Input";

import usePedidoForm from "../Hooks/usePedidoForm";

import type { Pedido } from "@/types/pedido";


interface Props {
    pedido: Pedido | null;
    onClose: () => void;
}


export default function ProgramarPedidoModal({
    pedido,
    onClose,
}: Props) {


    const {
        data,
        setData,
        programar,
        processing,
        errors,
    } = usePedidoForm();



    useEffect(() => {

        if (pedido) {

            setData({

                transportadora: pedido.transportadora ?? "",

                motorista: pedido.motorista ?? "",

                placa: pedido.placa ?? "",

                data_carregamento:
                    pedido.data_carregamento ?? "",

            });

        }

    }, [pedido]);




    function submit(e: React.FormEvent) {

        e.preventDefault();


        if (!pedido) {
            return;
        }


        programar(pedido.id, () => {

            onClose();

        });

    }



    return (

        <Modal

            show={pedido !== null}

            onClose={onClose}

            title="Programar Carregamento"

        >

            <form onSubmit={submit}>


                <Input

                    label="Transportadora"

                    value={data.transportadora}

                    error={errors.transportadora}

                    onChange={(e) =>
                        setData(
                            "transportadora",
                            e.target.value
                        )
                    }

                />



                <Input

                    label="Motorista"

                    value={data.motorista}

                    error={errors.motorista}

                    onChange={(e) =>
                        setData(
                            "motorista",
                            e.target.value
                        )
                    }

                />



                <Input

                    label="Placa"

                    value={data.placa}

                    error={errors.placa}

                    onChange={(e) =>
                        setData(
                            "placa",
                            e.target.value
                        )
                    }

                />



                <Input

                    label="Data do carregamento"

                    type="date"

                    value={data.data_carregamento}

                    error={errors.data_carregamento}

                    onChange={(e) =>
                        setData(
                            "data_carregamento",
                            e.target.value
                        )
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
                            : "Programar"}

                    </Button>


                </div>


            </form>


        </Modal>

    );

}