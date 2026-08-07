import type { Produto } from "@/types/produto";

interface Props {
    produtos: Produto[];
    onEditar: (produto: Produto) => void;
    onToggle: (produto: Produto) => void;
}

export default function ProdutoTable({
    produtos,
    onEditar,
    onToggle,
}: Props) {

    return (
        <div className="overflow-hidden rounded-xl border bg-white shadow-sm dark:bg-neutral-900">

            <div className="overflow-x-auto">

                <table className="min-w-[700px] w-full text-left text-sm">

                    <thead className="border-b bg-gray-50 dark:bg-neutral-800">

                        <tr>

                            <th className="px-6 py-4 font-semibold">
                                ID
                            </th>

                            <th className="px-6 py-4 font-semibold">
                                Descrição
                            </th>

                            <th className="px-6 py-4 font-semibold">
                                Status
                            </th>

                            <th className="px-6 py-4 text-right font-semibold">
                                Ações
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        {produtos.map((produto) => (

                            <tr
                                key={produto.id}
                                className="border-b last:border-none hover:bg-gray-50 dark:hover:bg-neutral-800"
                            >

                                <td className="px-6 py-4 font-bold">
                                    {produto.id}
                                </td>


                                <td className="px-3 py-3 md:px-6 md:py-4">
                                    {produto.descricao}
                                </td>


                                <td className="px-6 py-4">

                                    {produto.ativo ? (

                                        <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
                                            🟢 Ativo
                                        </span>

                                    ) : (

                                        <span className="rounded-full bg-red-100 px-3 py-1 text-sm text-red-700">
                                            🔴 Inativo
                                        </span>

                                    )}

                                </td>


                                <td className="px-6 py-4">

                                    <div className="flex justify-end gap-2">

                                        <button
                                            onClick={() => onEditar(produto)}
                                            className="rounded-lg bg-blue-600 px-3 py-2 text-white hover:bg-blue-700"
                                        >
                                            ✏️
                                        </button>


                                        <button
                                            onClick={() => onToggle(produto)}
                                            className="rounded-lg bg-gray-600 px-3 py-2 text-white hover:bg-gray-700"
                                        >
                                            🔄
                                        </button>

                                    </div>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>
    );
}