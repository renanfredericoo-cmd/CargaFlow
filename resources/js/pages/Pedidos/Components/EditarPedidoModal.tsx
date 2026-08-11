import React, { useEffect } from "react";

import Modal from "@/components/Modal";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Select from "@/components/Select";

import usePedidoForm from "../Hooks/usePedidoForm";

import type { Pedido } from "@/types/pedido";


interface Produto {
    id: number;
    descricao: string;
    ativo: boolean;
}


interface Props {
    pedido: Pedido | null;
    produtos?: Produto[];
    onClose: () => void;
}



export default function EditarPedidoModal({
    pedido,
    produtos = [],
    onClose,
}: Props) {


    const {
        data,
        setData,
        editar,
        processing,
        errors,
    } = usePedidoForm();




    useEffect(() => {
    if (!pedido) {
        return;
    }

    setData("numero_pedido", pedido.numero_pedido ?? "");


    setData("data", pedido.data ?? "");

setData(
    "data_entrega",
    pedido.data_entrega
        ? pedido.data_entrega.substring(0, 10)
        : ""
);

    

    setData(
        "cliente_id",
        String(pedido.cliente_id ?? "")
    );

    setData(
        "cliente",
        typeof pedido.cliente === "string"
            ? pedido.cliente
            : pedido.cliente?.nome ?? ""
    );

    setData("destino", pedido.destino ?? "");

    setData(
        "produto_id",
        String(pedido.produto_id ?? "")
    );

    setData(
        "peso",
        String(pedido.peso ?? "")
    );

    setData(
        "tipo_frete",
        pedido.tipo_frete ?? "CIF"
    );

    setData("vendedor", pedido.vendedor ?? "");

    setData(
        "observacoes",
        pedido.observacoes ?? ""
    );
}, [pedido]);





    function submit(e: React.FormEvent) {

        e.preventDefault();


        if (!pedido) {
            return;
        }


        editar(pedido.id, () => {

            onClose();

        });

    }





    return (

        <Modal

            show={pedido !== null}

            onClose={onClose}

            title="Editar Pedido"

        >

            <form onSubmit={submit}>


                <div className="grid grid-cols-2 gap-4">



                    <Input

                        label="Número do Pedido"

                        value={data.numero_pedido}

                        error={errors.numero_pedido}

                        onChange={(e) =>
                            setData(
                                "numero_pedido",
                                e.target.value
                            )
                        }

                    />




                    <Input
    label="Data de Entrega"

    type="date"

    value={data.data_entrega}

    error={errors.data_entrega}

    onChange={(e) =>
        setData(
            "data_entrega",
            e.target.value
        )
    }
/>


                   

                    <Input

                        label="Cliente"

                        value={data.cliente}

                        error={errors.cliente}

                        onChange={(e) =>
                            setData(
                                "cliente",
                                e.target.value
                            )
                        }

                    />




                    <Input

                        label="Destino"

                        value={data.destino}

                        error={errors.destino}

                        onChange={(e) =>
                            setData(
                                "destino",
                                e.target.value
                            )
                        }

                    />




                    <Select

                        label="Produto"

                        value={data.produto_id}

                        error={errors.produto_id}

                        onChange={(e) =>
                            setData(
                                "produto_id",
                                e.target.value
                            )
                        }

                    >

                        <option value="">
                            Selecione o produto
                        </option>


                        {produtos.map((produto) => (

                            <option

                                key={produto.id}

                                value={produto.id}

                            >

                                {produto.descricao}

                            </option>

                        ))}


                    </Select>




                    <Input

                        label="Peso"

                        type="number"

                        step="0.01"

                        value={data.peso}

                        error={errors.peso}

                        onChange={(e) =>
                            setData(
                                "peso",
                                e.target.value
                            )
                        }

                    />




                    <Select

                        label="Tipo de Frete"

                        value={data.tipo_frete}

                        error={errors.tipo_frete}

                        onChange={(e) =>
                            setData(
                                "tipo_frete",
                                e.target.value
                            )
                        }

                    >

                        <option value="CIF">
                            CIF
                        </option>


                        <option value="FOB">
                            FOB
                        </option>


                    </Select>


                </div>





                <Input

                    label="Vendedor"

                    value={data.vendedor}

                    error={errors.vendedor}

                    onChange={(e) =>
                        setData(
                            "vendedor",
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
                            : "Salvar Alterações"}

                    </Button>



                </div>


            </form>


        </Modal>

    );

}