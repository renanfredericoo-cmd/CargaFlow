import React from "react";

import Modal from "@/components/Modal";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Select from "@/components/Select";

import usePedidoForm from "../Hooks/usePedidoForm";


interface Produto {
    id: number;
    descricao: string;
    ativo: boolean;
}


interface Props {
    show: boolean;
    onClose: () => void;
    produtos?: Produto[];
}


export default function PedidoModal({
    show,
    onClose,
    produtos = [],
}: Props) {


    const {
        data,
        setData,
        salvar,
        processing,
        errors,
    } = usePedidoForm();



    function submit(e: React.FormEvent) {

        e.preventDefault();

        salvar(() => {

            onClose();

        });

    }



    return (

        <Modal
            show={show}
            onClose={onClose}
            title="Novo Pedido"
        >

            <form onSubmit={submit}>


                <div className="grid grid-cols-2 gap-4">


                    <Input
                        label="Número do Pedido"
                        value={data.numero_pedido}
                        error={errors.numero_pedido}
                        onChange={(e) =>
                            setData("numero_pedido", e.target.value)
                        }
                    />



                    <Input
                        label="Data de Entrega"
                        type="date"
                        value={data.data}
                        error={errors.data}
                        onChange={(e) =>
                            setData("data", e.target.value)
                        }
                    />



                    <Input
                        label="Cliente"
                        value={data.cliente}
                        error={errors.cliente}
                        onChange={(e) =>
                            setData("cliente", e.target.value)
                        }
                    />



                    <Input
                        label="Destino"
                        value={data.destino}
                        error={errors.destino}
                        onChange={(e) =>
                            setData("destino", e.target.value)
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
                        label="Peso (kg)"
                        type="number"
                        step="1"
                        value={data.peso}
                        error={errors.peso}
                        onChange={(e) =>
                            setData("peso", e.target.value)
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
                        setData("vendedor", e.target.value)
                    }
                />





                <div className="mb-4">

                    <label className="mb-2 block text-sm text-gray-300 font-medium">
                        Observações
                    </label>


                    <textarea
                        rows={4}
                        value={data.observacoes}
                        onChange={(e) =>
                            setData(
                                "observacoes",
                                e.target.value
                            )
                        }
                        className="w-full rounded-lg border bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-white"
                    />


                    {errors.observacoes && (

                        <p className="mt-1 text-sm text-red-500">
                            {errors.observacoes}
                        </p>

                    )}

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
                            : "Salvar Pedido"}

                    </Button>


                </div>


            </form>


        </Modal>

    );

}