import React from "react";

import Modal from "@/components/Modal";
import Button from "@/components/Button";
import Input from "@/components/Input";

import { useForm } from "@inertiajs/react";


interface Props {

    show: boolean;

    onClose: () => void;

}




export default function ClienteModal({

    show,

    onClose,

}: Props) {



    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,

    } = useForm({


        nome: "",

        cidade: "",

        estado: "",


    });







    function submit(e: React.FormEvent) {


        e.preventDefault();



        post("/clientes", {


            preserveScroll: true,

            onSuccess: () => {


                reset();

                onClose();


            },


        });


    }







    return (


        <Modal

            show={show}

            onClose={onClose}

            title="Novo Cliente"

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

                            : "Salvar Cliente"

                        }



                    </Button>





                </div>





            </form>




        </Modal>


    );

}