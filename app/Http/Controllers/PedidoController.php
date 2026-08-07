<?php

namespace App\Http\Controllers;

use App\Http\Requests\PedidoRequest;
use App\Models\Pedido;
use App\Models\Produto;
use Inertia\Inertia;
use Illuminate\Http\Request;

class PedidoController extends Controller
{

    public function index()
    {

        $pedidos = Pedido::with(['user', 'produto'])
            ->latest()
            ->get()
            ->append([
                'atraso_carregamento',
            ]);



        $produtos = Produto::where('ativo', true)
            ->orderBy('descricao')
            ->get();



        return Inertia::render('Pedidos/Index', [

            'pedidos' => $pedidos,

            'produtos' => $produtos,

        ]);

    }





    public function store(PedidoRequest $request)
    {

        $dados = $request->validated();



        $dados['status'] = Pedido::STATUS_PEDIDO;

        $dados['user_id'] = auth()->id();



        Pedido::create($dados);



        return redirect()

            ->route('pedidos.index')

            ->with('success', 'Pedido cadastrado com sucesso.');

    }






    public function update(PedidoRequest $request, Pedido $pedido)
    {

        $pedido->update(
            $request->validated()
        );



        return back()->with(

            'success',

            'Pedido atualizado com sucesso.'

        );

    }






    public function agendar(Request $request, Pedido $pedido)
    {

        $dados = $request->validate([


            'transportadora' => [

                'required',

                'string',

            ],


            'data_agendamento' => [

                'required',

                'date',

            ],


            'hora_agendamento' => [

                'required',

            ],


        ]);



        $pedido->update([


            ...$dados,


            'status' => Pedido::STATUS_AGENDADO,


        ]);



        return back()->with(

            'success',

            'Pedido agendado com sucesso.'

        );

    }








    public function carregar(Request $request, Pedido $pedido)
    {

        $dados = $request->validate([


            'placa' => [

                'required',

                'string',

            ],


            'data_carregamento' => [

                'required',

                'date',

            ],


            'hora_carregamento' => [

                'required',

            ],


        ]);



        $pedido->update([


    ...$dados,


    'status' => Pedido::STATUS_CARREGAMENTO,


    'inicio_carregamento_at' => now(),


]);



        return back()->with(

            'success',

            'Carregamento iniciado com sucesso.'

        );

    }








    public function faturar(Request $request, Pedido $pedido)
    {

        if ($pedido->status === Pedido::STATUS_FATURADO) {


            return back()->with(

                'error',

                'Este pedido já foi faturado.'

            );

        }




        $dados = $request->validate([


            'numero_nfe' => [

                'required',

                'string',

            ],


        ]);





        $pedido->update([


    'numero_nfe' => $dados['numero_nfe'],


    'status' => Pedido::STATUS_FATURADO,


    'fim_carregamento_at' => now(),


]);





        return back()->with(

            'success',

            'Pedido faturado com sucesso.'

        );

    }








    public function cancelar(Pedido $pedido)
    {


        if ($pedido->status === Pedido::STATUS_CANCELADO) {


            return back()->with(

                'error',

                'Este pedido já está cancelado.'

            );

        }





        $pedido->update([


            'status' => Pedido::STATUS_CANCELADO,


        ]);





        return back()->with(

            'success',

            'Pedido cancelado com sucesso.'

        );


    }








    public function destroy(Pedido $pedido)
    {


        if (!auth()->user()->isAdmin()) {


            abort(403);


        }





        $pedido->delete();





        return back()->with(

            'success',

            'Pedido excluído com sucesso.'

        );


    }


}