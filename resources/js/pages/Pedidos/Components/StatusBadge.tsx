interface Props {
    status: string;
}

export default function StatusBadge({ status }: Props) {
    const styles: Record<string, string> = {
        Pedido:
            "bg-gray-100 text-gray-800",

        Agendado:
            "bg-yellow-200 text-yellow-900",

        "Em Carregamento":
            "bg-blue-100 text-blue-800",

        Faturado:
            "bg-green-100 text-green-800",

        Cancelado:
            "bg-red-100 text-red-800",
    };

    return (
        <span
            className={`
                inline-flex
                whitespace-nowrap
                rounded-full
                px-3
                py-1
                text-sm
                font-semibold
                ${
                    styles[status] ??
                    "bg-gray-100 text-gray-700"
                }
            `}
        >
            {status === "Em Carregamento"
                ? "Aguardando Carregamento"
                : status}
        </span>
    );
}