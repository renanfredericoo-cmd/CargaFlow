<?php

namespace App\Http\Controllers;

use App\Http\Requests\PedidoRequest;
use App\Models\Pedido;
use App\Models\Produto;
use App\Models\Cliente;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PedidoController extends Controller
{
    public function index(Request $request)
    {
        $query = Pedido::with([
            'user',
            'produto',
            'cliente',
        ]);

        if (
            $request->filled('data_inicial') &&
            $request->filled('data_final')
        ) {
            $query->whereBetween('created_at', [
                $request->data_inicial . ' 00:00:00',
                $request->data_final . ' 23:59:59',
            ]);
        }

        $pedidos = $query
            ->reorder()
            ->orderBy('created_at', 'desc')
            ->orderBy('id', 'desc')
            ->get()
            ->append([
                'atraso_carregamento',
            ]);

        $produtos = Produto::where('ativo', true)
            ->orderBy('descricao')
            ->get();

        $clientes = Cliente::where('ativo', true)
            ->orderBy('nome')
            ->get();

        return Inertia::render('Pedidos/Index', [
            'pedidos' => $pedidos,
            'produtos' => $produtos,
            'clientes' => $clientes,
        ]);
    }

    public function store(PedidoRequest $request)
    {
        $dados = $request->validated();

        $cliente = Cliente::find($dados['cliente_id']);

        $dados['cliente'] = $cliente->nome;

        $dados['status'] = Pedido::STATUS_PEDIDO;

        $dados['user_id'] = auth()->id();

        Pedido::create($dados);

        return redirect()
            ->route('pedidos.index')
            ->with(
                'success',
                'Pedido cadastrado com sucesso.'
            );
    }

    public function update(PedidoRequest $request, Pedido $pedido)
    {
        $dados = $request->validated();

        if (isset($dados['cliente_id'])) {
            $cliente = Cliente::find($dados['cliente_id']);

            if ($cliente) {
                $dados['cliente'] = $cliente->nome;
            }
        }

        $pedido->update($dados);

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

    public function detalhes(Pedido $pedido)
    {
        $pedido->load([
            'cliente',
            'produto',
        ]);

        return Inertia::render('Pedidos/Detalhes', [
            'pedido' => $pedido,
        ]);
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