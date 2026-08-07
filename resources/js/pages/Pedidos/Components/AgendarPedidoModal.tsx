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


export default function AgendarPedidoModal({
    pedido,
    onClose,
}: Props) {


    const {
        data,
        setData,
        agendar,
        processing,
        errors,
    } = usePedidoForm();



    useEffect(() => {

        if (pedido) {

            const agora = new Date();

            setData({

                transportadora: pedido.transportadora ?? "",

                data_agendamento:
                    agora.toISOString().split("T")[0],

                hora_agendamento:
                    agora.toTimeString().slice(0,5),

            });

        }

    }, [pedido]);




    function submit(e: React.FormEvent) {

        e.preventDefault();


        if (!pedido) {

            return;

        }


        agendar(pedido.id, () => {

            onClose();

        });

    }




    return (

        <Modal

            show={pedido !== null}

            onClose={onClose}

            title="Agendar Carregamento"

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

                    label="Data do agendamento"

                    type="date"

                    value={data.data_agendamento}

                    disabled

                />



                <Input

                    label="Hora do agendamento"

                    type="time"

                    value={data.hora_agendamento}

                    disabled

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
                            : "Agendar"}

                    </Button>


                </div>


            </form>


        </Modal>

    );

}