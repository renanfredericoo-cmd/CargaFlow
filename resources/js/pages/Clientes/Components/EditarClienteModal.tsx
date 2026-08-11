import React, { useEffect } from "react";

import Modal from "@/components/Modal";
import Button from "@/components/Button";
import Input from "@/components/Input";

import { useForm } from "@inertiajs/react";



interface Cliente {

    id: number;

    nome: string;

    cidade: string;

    estado: string;

}





interface Props {

    show: boolean;

    cliente: Cliente | null;

    onClose: () => void;

}






export default function EditarClienteModal({

    show,

    cliente,

    onClose,

}: Props) {



    const {

        data,

        setData,

        put,

        processing,

        errors,

    } = useForm({


        nome: "",

        cidade: "",

        estado: "",


    });







    useEffect(() => {


        if (cliente) {


            setData({


                nome: cliente.nome ?? "",

                cidade: cliente.cidade ?? "",

                estado: cliente.estado ?? "",


            });


        }


    }, [cliente]);










    function submit(e: React.FormEvent) {


        e.preventDefault();



        if (!cliente) {

            return;

        }



        put(`/clientes/${cliente.id}`, {


            preserveScroll: true,


            onSuccess: () => {


                onClose();


            },


        });


    }









    return (


        <Modal

            show={show}

            onClose={onClose}

            title="Editar Cliente"

        >



            <form onSubmit={submit}>


                <div className="grid grid-cols-2 gap-4">






                    <Input

                        label="Nome"

                        value={data.nome}

                        error={errors.nome}

                        onChange={(e) =>

                            setData(

                                "nome",

                                e.target.value

                            )

                        }

                    />









                    <Input

                        label="Cidade"

                        value={data.cidade}

                        error={errors.cidade}

                        onChange={(e) =>

                            setData(

                                "cidade",

                                e.target.value

                            )

                        }

                    />









                    <Input

                        label="Estado"

                        value={data.estado}

                        error={errors.estado}

                        maxLength={2}

                        onChange={(e) =>

                            setData(

                                "estado",

                                e.target.value.toUpperCase()

                            )

                        }

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

                        type="submit"

                        variant="success"

                        disabled={processing}

                    >

                        {processing

                            ? "Salvando..."

                            : "Salvar Alterações"

                        }



                    </Button>





                </div>





            </form>




        </Modal>


    );

}