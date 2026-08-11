import { useForm } from "@inertiajs/react";


export default function usePedidoForm() {


    const form = useForm({



        numero_pedido: "",



        data: new Date().toISOString().split("T")[0],


        data_entrega: "",



        cliente_id: "",



        cliente: "",



        destino: "",



        produto_id: "",



        peso: "",



        tipo_frete: "CIF",



        vendedor: "",



        observacoes: "",






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