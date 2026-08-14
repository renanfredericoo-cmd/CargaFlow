import Button from "@/components/Button";


interface Cliente {

    id: number;

    nome: string;

    cidade: string;

    estado: string;

    ativo: boolean;

}




interface Props {

    clientes: Cliente[];

    isAdmin: boolean;

    onEditar: (cliente: Cliente) => void;

    onToggle: (cliente: Cliente) => void;

    onExcluir: (cliente: Cliente) => void;

}







export default function ClienteTable({

    clientes,

    isAdmin,

    onEditar,

    onToggle,

    onExcluir,

}: Props) {



    return (


        <table className="w-full text-sm">


            <thead className="border-b bg-neutral-100 dark:bg-neutral-800">


                <tr>


                    <th className="px-3 py-1 text-left">

                        Cliente

                    </th>




                    <th className="p-3 text-left">

                        Cidade

                    </th>




                    <th className="p-3 text-left">

                        Estado

                    </th>




                    <th className="p-3 text-left">

                        Status

                    </th>




                    <th className="p-3 text-right">

                        Ações

                    </th>



                </tr>


            </thead>







            <tbody>



                {clientes.map((cliente) => (



                    <tr

                        key={cliente.id}

                        className="border-b dark:border-neutral-800"

                    >





                        <td className="px-3 py-1">


                            <div className="font-medium">

                                {cliente.nome}

                            </div>


                        </td>








                        <td className="p-3">


                            {cliente.cidade}


                        </td>








                        <td className="p-3">


                            {cliente.estado}


                        </td>








                        <td className="p-3">


                            {cliente.ativo ? (


                                <span className="text-green-600">

                                    Ativo

                                </span>



                            ) : (


                                <span className="text-red-600">

                                    Inativo

                                </span>



                            )}



                        </td>









                        <td className="p-3">


                            <div className="flex justify-end gap-2 [&>button]:!py-1">





                                <Button

                                    variant="secondary"

                                    onClick={() =>

                                        onEditar(cliente)

                                    }

                                >

                                    Editar

                                </Button>









                                {isAdmin && (


                                    <Button

                                        variant="secondary"

                                        onClick={() =>

                                            onToggle(cliente)

                                        }

                                    >


                                        {cliente.ativo

                                            ? "Desativar"

                                            : "Ativar"

                                        }


                                    </Button>



                                )}









                                {isAdmin && (


                                    <Button

                                        variant="danger"

                                        onClick={() =>

                                            onExcluir(cliente)

                                        }

                                    >

                                        Excluir

                                    </Button>



                                )}







                            </div>


                        </td>





                    </tr>



                ))}



            </tbody>




        </table>


    );

}