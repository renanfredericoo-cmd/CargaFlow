import { useForm } from "@inertiajs/react";
import type { Pedido } from "@/types/pedido";

export default function usePedidoForm(pedidoReplicar?: Pedido | null) {

    const form = useForm({

        numero_pedido: pedidoReplicar?.numero_pedido ?? "",

        data:
            pedidoReplicar?.data ??
            new Date().toISOString().split("T")[0],

        data_entrega: pedidoReplicar?.data_entrega ?? "",

        cliente_id:
            pedidoReplicar?.cliente_id?.toString() ?? "",

        cliente:
            typeof pedidoReplicar?.cliente === "object"
                ? pedidoReplicar.cliente.nome
                : pedidoReplicar?.cliente ?? "",

        destino: pedidoReplicar?.destino ?? "",

        produto_id:
            pedidoReplicar?.produto_id?.toString() ?? "",

        peso:
            pedidoReplicar?.peso?.toString() ?? "",

        tipo_frete:
            pedidoReplicar?.tipo_frete ?? "CIF",

        vendedor:
            pedidoReplicar?.vendedor ?? "",

        observacoes:
            pedidoReplicar?.observacoes ?? "",

        transportadora: "",
        motorista: "",
        placa: "",

        data_agendamento: "",
        hora_agendamento: "",

        data_carregamento: "",
        hora_carregamento: "",

        numero_nfe: "",

    });

    function salvar(onSuccess?: () => void) {

        form.post("/pedidos", {

            preserveScroll: true,

            onSuccess: () => {

                form.reset();

                onSuccess?.();

            },

        });

    }

    function editar(id: number, onSuccess?: () => void) {

        form.put(`/pedidos/${id}`, {

            preserveScroll: true,

            onSuccess: () => {

                onSuccess?.();

            },

        });

    }

    function agendar(id: number, onSuccess?: () => void) {

        form.put(`/pedidos/${id}/agendar`, {

            preserveScroll: true,

            onSuccess: () => {

                onSuccess?.();

            },

        });

    }

    function programar(id: number, onSuccess?: () => void) {

        form.put(`/pedidos/${id}/programar`, {

            preserveScroll: true,

            onSuccess: () => {

                onSuccess?.();

            },

        });

    }

    return {

        ...form,

        salvar,
        editar,
        agendar,
        programar,

    };
}