import { useState } from "react";

import { Head, router } from "@inertiajs/react";

import Button from "@/components/Button";

import ProdutoModal from "./Components/ProdutoModal";
import ProdutoTable from "./Components/ProdutoTable";
import EditarProdutoModal from "./Components/EditarProdutoModal";


interface Produto {
    id: number;
    descricao: string;
    ativo: boolean;
}


interface Props {
    produtos: Produto[];
}



export default function Index({ produtos }: Props) {


    const [showModal, setShowModal] = useState(false);

    const [produtoEditando, setProdutoEditando] = useState<Produto | null>(null);



    function abrirModal() {

        setShowModal(true);

    }



    function fecharModal() {

        setShowModal(false);

    }



    function fecharEdicao() {

        setProdutoEditando(null);

    }



    function editarProduto(produto: Produto) {

        setProdutoEditando(produto);

    }



    function toggleProduto(produto: Produto) {

        router.patch(
            `/produtos/${produto.id}/toggle`
        );

    }




    return (

        <>


            <Head title="Produtos" />


            <div className="p-4 md:p-6">


                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">


                    <div>

                        <h1 className="text-3xl font-bold">
                            📦 Produtos
                        </h1>


                        <p className="mt-2 text-gray-500">
                            Cadastro de produtos utilizados nos pedidos.
                        </p>

                    </div>



                    <Button
                        className="w-full md:w-auto"
                        variant="primary"
                        onClick={abrirModal}
                    >

                        + Novo Produto

                    </Button>


                </div>




                <div className="overflow-x-auto rounded-xl border bg-white dark:bg-neutral-900">


                    {produtos.length === 0 ? (


                        <div className="p-8 text-center text-gray-500">

                            Nenhum produto cadastrado.

                        </div>



                    ) : (


                        <ProdutoTable

                            produtos={produtos}

                            onEditar={editarProduto}

                            onToggle={toggleProduto}

                        />


                    )}


                </div>





                <ProdutoModal

                    show={showModal}

                    onClose={fecharModal}

                />





                <EditarProdutoModal

                    show={produtoEditando !== null}

                    produto={produtoEditando}

                    onClose={fecharEdicao}

                />


            </div>


        </>

    );


}