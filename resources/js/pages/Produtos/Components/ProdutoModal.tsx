import { useState } from "react";

import Modal from "@/components/Modal";
import Button from "@/components/Button";
import Input from "@/components/Input";

import { router } from "@inertiajs/react";

interface Props {
    show: boolean;
    onClose: () => void;
}

export default function ProdutoModal({
    show,
    onClose,
}: Props) {

    const [descricao, setDescricao] = useState("");
    const [processing, setProcessing] = useState(false);

    function salvar(e: React.FormEvent) {
        e.preventDefault();

        setProcessing(true);

        router.post(
            "/produtos",
            {
                descricao,
            },
            {
                onSuccess: () => {
                    setDescricao("");
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
            show={show}
            onClose={onClose}
            title="Novo Produto"
        >

            <form onSubmit={salvar}>

                <Input
                    label="Descrição"
                    value={descricao}
                    onChange={(e) =>
                        setDescricao(e.target.value)
                    }
                    placeholder="Ex: Calcário calcítico"
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
                        disabled={processing}
                    >
                        {processing
                            ? "Salvando..."
                            : "Salvar Produto"}
                    </Button>

                </div>

            </form>

        </Modal>
    );
}