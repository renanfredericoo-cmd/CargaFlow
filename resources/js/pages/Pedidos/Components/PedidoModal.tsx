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


interface Cliente {
    id: number;
    nome: string;
    cidade: string;
    estado: string;
    ativo: boolean;
}

interface Vendedor {
    id: number;
    name: string;
}

interface Props {
    show: boolean;
    onClose: () => void;
    produtos?: Produto[];
    clientes?: Cliente[];
    vendedores?: Vendedor[];
    pedidoReplicar?: Pedido | null;
}



interface Props {
    show: boolean;
    onClose: () => void;
    produtos?: Produto[];
    clientes?: Cliente[];
    vendedores?: Vendedor[];
    pedidoReplicar?: Pedido | null;
}


export default function PedidoModal({
    show,
    onClose,
    produtos = [],
    clientes = [],
    vendedores = [],
    pedidoReplicar = null,
    filtroStatus = "Todos",
}: Props) {


    const {
        data,
        setData,
        salvar,
        processing,
        errors,
    } = usePedidoForm(pedidoReplicar);


    useEffect(() => {
    if (!pedidoReplicar) {
        setData("tipo_frete", "");
        return;
    }


        setData(
            "numero_pedido",
            pedidoReplicar.numero_pedido ?? ""
        );


        setData(
            "data",
            pedidoReplicar.data ?? ""
        );


        setData(
    "data_entrega",
    pedidoReplicar.data_entrega
        ? pedidoReplicar.data_entrega.substring(0, 10)
        : ""
);


        setData(
            "cliente_id",
            pedidoReplicar.cliente_id?.toString() ?? ""
        );


        setData(
            "cliente",
            typeof pedidoReplicar.cliente === "object"
                ? pedidoReplicar.cliente.nome
                : pedidoReplicar.cliente ?? ""
        );


        setData(
            "destino",
            pedidoReplicar.destino ?? ""
        );


        setData(
            "produto_id",
            pedidoReplicar.produto_id?.toString() ?? ""
        );


        setData(
            "peso",
            pedidoReplicar.peso?.toString() ?? ""
        );


        setData(
            "tipo_frete",
            pedidoReplicar?.tipo_frete ?? ""
        );


        setData(
            "vendedor",
            pedidoReplicar.vendedor ?? ""
        );


        setData(
            "observacoes",
            pedidoReplicar.observacoes ?? ""
        );


    }, [pedidoReplicar]);


    function submit(e: React.FormEvent) {

        e.preventDefault();


        salvar(() => {

            onClose();

        });

    }


    function selecionarCliente(id: string) {

        const cliente = clientes.find(
            (item) => item.id === Number(id)
        );


        setData(
            "cliente_id",
            id
        );


        if (cliente) {

            setData(
                "cliente",
                cliente.nome
            );


            setData(
                "destino",
                `${cliente.cidade}/${cliente.estado}`
            );

        }

    }


    return (

        <Modal

            show={show}

            onClose={onClose}

            title={
                pedidoReplicar
                    ? "Replicar Pedido"
                    : "Novo Pedido"
            }

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


                    <Select

                        label="Cliente"

                        value={data.cliente_id ?? ""}

                        error={errors.cliente_id}

                        onChange={(e) =>
                            selecionarCliente(
                                e.target.value
                            )
                        }

                    >

                        <option value="">
                            Selecione o cliente
                        </option>


                        {clientes

                            .filter(
                                (cliente) => cliente.ativo
                            )

                            .map((cliente) => (

                                <option
                                    key={cliente.id}
                                    value={cliente.id}
                                >
                                    {cliente.nome}
                                </option>

                            ))}

                    </Select>


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


                        {produtos

                            .filter(
                                (produto) => produto.ativo
                            )

                            .map((produto) => (

                                <option
                                    key={produto.id}
                                    value={produto.id}
                                >
                                    {produto.descricao}
                                </option>

                            ))}

                    </Select>


                    <Input

                        label="Peso (toneladas)"

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
            e.target.value as "CIF" | "FOB" | ""
        )
    }
>
    <option value="">
        Selecione o tipo de frete
    </option>

    <option value="CIF">
        CIF
    </option>

    <option value="FOB">
        FOB
    </option>
</Select>


                </div>


                <Select
    label="Vendedor"
    value={data.vendedor}
    error={errors.vendedor}
    onChange={(e) =>
        setData("vendedor", e.target.value)
    }
>
    <option value="">
        Selecione o vendedor
    </option>

    <option value="NB MINERAIS">
        NB MINERAIS
    </option>

    {vendedores
        .filter((vendedor) => vendedor.name !== "NB MINERAIS")
        .map((vendedor) => (
            <option
                key={vendedor.id}
                value={vendedor.name}
            >
                {vendedor.name}
            </option>
        ))}
</Select>


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

                        className="
                            w-full
                            rounded-lg
                            border
                            bg-white
                            px-4
                            py-3
                            text-sm
                            text-gray-900
                            outline-none
                            transition
                            focus:border-blue-500
                            dark:bg-neutral-900
                            dark:border-neutral-700
                            dark:text-white
                        "

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
                            : "Salvar Pedido"
                        }

                    </Button>


                </div>


            </form>

        </Modal>

    );

}