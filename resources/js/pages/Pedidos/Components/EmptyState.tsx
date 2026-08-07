interface Props {}

export default function EmptyState({}: Props) {
    return (
        <div className="rounded-xl border bg-white p-3 text-center shadow-sm dark:bg-neutral-900">

            <div className="mb-1 text-3xl">
                📦
            </div>

            <h2 className="text-lg font-bold">
                Nenhum pedido encontrado
            </h2>

            <p className="mt-1 text-xs text-gray-500">
                Clique em <strong>Novo Pedido</strong> acima para cadastrar seu primeiro pedido.
            </p>

        </div>
    );
}