import { useEffect, useState } from "react";
import { router } from "@inertiajs/react";

import Modal from "@/components/Modal";
import Button from "@/components/Button";
import Input from "@/components/Input";

import type { Produto } from "@/types/produto";


interface Props {
    show: boolean;
    produto: Produto | null;
    onClose: () => void;
}


export default function EditarProdutoModal({
    show,
    produto,
    onClose,
}: Props) {


    const [descricao, setDescricao] = useState("");



    useEffect(() => {

        if (produto) {
            setDescricao(produto.descricao);
        }

    }, [produto]);



    function salvar(e: React.FormEvent) {

        e.preventDefault();


        if (!produto) return;


        router.put(
            `/produtos/${produto.id}`,
            {
                descricao,
            },
            {
                onSuccess: () => {
                    onClose();
                },
            }
        );

    }



    return (

        <Modal
            show={show}
            onClose={onClose}
            title="Editar Produto"
        >

            <form onSubmit={salvar}>


                <Input
                    label="Descrição"
                    value={descricao}
                    onChange={(e) =>
                        setDescricao(e.target.value)
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
                        variant="primary"
                    >
                        Salvar
                    </Button>


                </div>


            </form>


        </Modal>

    );
}