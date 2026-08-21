<?php

namespace App\Http\Controllers;

use App\Http\Requests\PedidoRequest;
use App\Models\Pedido;
use App\Models\Produto;
use App\Models\Cliente;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Models\PedidoHistorico;

class PedidoController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Permissões
    |--------------------------------------------------------------------------
    */

    private function permitir(array $roles): void
    {
        if (!in_array(auth()->user()->role, $roles, true)) {
            abort(403);
        }
    }


    /*
    |--------------------------------------------------------------------------
    | Pedidos
    |--------------------------------------------------------------------------
    */

    public function index(Request $request)
{
    $query = Pedido::with([
    'user',
    'produto',
    'cliente',
    'alteradoPor',
    'historicos.usuario',
]);

        /*
        |--------------------------------------------------------------------------
        | Vendedor
        |--------------------------------------------------------------------------
        |
        | Vendedor continua vendo somente os próprios pedidos.
        |
        */

        if (auth()->user()->role === 'vendedor') {
            $query->whereRaw(
                'LOWER(vendedor) = LOWER(?)',
                [auth()->user()->name]
            );
        }


        /*
        |--------------------------------------------------------------------------
        | Filtro de período
        |--------------------------------------------------------------------------
        */

        if (
    $request->filled('data_inicial') &&
    $request->filled('data_final')
) {
    $query->whereBetween('data_entrega', [
        $request->data_inicial,
        $request->data_final,
    ]);

} elseif ($request->filled('data_inicial')) {

    $query->where(
        'data_entrega',
        '>=',
        $request->data_inicial
    );

} elseif ($request->filled('data_final')) {

    $query->where(
        'data_entrega',
        '<=',
        $request->data_final
    );
}


        /*
        |--------------------------------------------------------------------------
        | Filtro de status
        |--------------------------------------------------------------------------
        |
        | "Todos" mostra somente pedidos em andamento.
        | Faturado e Cancelado aparecem somente nos seus próprios filtros.
        |
        */

        $status = $request->input('status', 'Todos');

if ($status === 'Todos') {

    $query->whereIn('status', [
        Pedido::STATUS_PEDIDO,
        Pedido::STATUS_AGENDADO,
        Pedido::STATUS_CARREGAMENTO,
    ]);

} elseif (in_array($status, [
    Pedido::STATUS_PEDIDO,
    Pedido::STATUS_AGENDADO,
    Pedido::STATUS_CARREGAMENTO,
    Pedido::STATUS_FATURADO,
    Pedido::STATUS_CANCELADO,
], true)) {

    $query->where(
        'status',
        $status
    );
}


        /*
        |--------------------------------------------------------------------------
        | Busca
        |--------------------------------------------------------------------------
        */

        if ($request->filled('busca')) {

    $busca = trim(
        $request->input('busca')
    );

    if ($busca !== '') {

        $termo = '%' . $busca . '%';

        $query->where(function ($q) use ($termo) {

            $q->where(
                'numero_pedido',
                'ILIKE',
                $termo
            )

            ->orWhere(
                'cliente',
                'ILIKE',
                $termo
            )

            ->orWhere(
                'vendedor',
                'ILIKE',
                $termo
            )

            ->orWhere(
                'destino',
                'ILIKE',
                $termo
            );

        });
    }
}


        /*
        |--------------------------------------------------------------------------
        | Paginação
        |--------------------------------------------------------------------------
        |
        | 600 pedidos por página.
        |
        */

        $pedidos = $query
    ->reorder()
    ->orderBy('data_entrega', 'asc')
    ->orderBy('id', 'asc')
    ->paginate(600)
    ->withQueryString();

$pedidos->getCollection()->each(
    function ($pedido) {
        $pedido->append([
            'atraso_carregamento',
        ]);
    }
);


        /*
        |--------------------------------------------------------------------------
        | Produtos
        |--------------------------------------------------------------------------
        */

        $produtos = Produto::where('ativo', true)
            ->orderBy('descricao')
            ->get();


        /*
        |--------------------------------------------------------------------------
        | Clientes
        |--------------------------------------------------------------------------
        */

        $clientes = Cliente::where('ativo', true)
            ->orderBy('nome')
            ->get();


        /*
        |--------------------------------------------------------------------------
        | Vendedores
        |--------------------------------------------------------------------------
        */

        $vendedores = User::where('role', 'vendedor')
            ->where('active', true)
            ->orderBy('name')
            ->get([
                'id',
                'name',
            ]);


        /*
        |--------------------------------------------------------------------------
        | Retorno
        |--------------------------------------------------------------------------
        */

        return Inertia::render('Pedidos/Index', [
            'pedidos' => $pedidos,
            'produtos' => $produtos,
            'clientes' => $clientes,
            'vendedores' => $vendedores,
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | Criar pedido
    |--------------------------------------------------------------------------
    */

    public function store(PedidoRequest $request)
    {
        $this->permitir([
            'admin',
            'pedidos',
        ]);

        $dados = $request->validated();

        $cliente = Cliente::find($dados['cliente_id']);

        $dados['cliente'] = $cliente->nome;

        $dados['status'] = $dados['tipo_frete'] === 'FOB'
            ? Pedido::STATUS_AGENDADO
            : Pedido::STATUS_PEDIDO;

        $dados['user_id'] = auth()->id();

$pedido = Pedido::create($dados);


PedidoHistorico::create([
    'pedido_id' => $pedido->id,
    'user_id' => auth()->id(),
    'acao' => 'Pedido criado',
    'detalhes' => 'Pedido cadastrado no sistema.',
]);

return back()->with(
    'success',
    'Pedido cadastrado com sucesso.'
);
    }


    /*
    |--------------------------------------------------------------------------
    | Editar pedido completo
    |--------------------------------------------------------------------------
    */

    public function update(PedidoRequest $request, Pedido $pedido)
    {
        $this->permitir([
            'admin',
            'pedidos',
        ]);

        $dados = $request->validated();

        if (isset($dados['cliente_id'])) {
            $cliente = Cliente::find($dados['cliente_id']);

            if ($cliente) {
                $dados['cliente'] = $cliente->nome;
            }
        }

        if ($pedido->status === Pedido::STATUS_PEDIDO) {

            if (($dados['tipo_frete'] ?? null) === 'FOB') {
                $dados['status'] = Pedido::STATUS_AGENDADO;
            }

            if (($dados['tipo_frete'] ?? null) === 'CIF') {
                $dados['status'] = Pedido::STATUS_PEDIDO;
            }
        }

        $pedido->update($dados);

        return back()->with(
            'success',
            'Pedido atualizado com sucesso.'
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Agendar pedido
    |--------------------------------------------------------------------------
    */

    public function agendar(Request $request, Pedido $pedido)
{
    $this->permitir([
        'admin',
        'pedidos',
        'agendamento',
    ]);

    $dados = $request->validate([
        'transportadora' => [
            'required',
            'string',
            'max:255',
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

$historico = PedidoHistorico::create([
    'pedido_id' => $pedido->id,
    'user_id' => auth()->user()->id,
    'acao' => 'Pedido agendado',
    'detalhes' => 'Pedido agendado para ' .
        $dados['data_agendamento'] . ' as ' .
        substr($dados['hora_agendamento'], 0, 5) . '.',
]);

\Log::info('HISTORICO AGENDAMENTO CRIADO', [
    'historico_id' => $historico->id,
    'pedido_id' => $pedido->id,
    'user_id' => auth()->user()->id,
]);

    return back()->with(
        'success',
        'Pedido agendado com sucesso.'
    );
}

    /*
    |--------------------------------------------------------------------------
    | Editar transportadora
    |--------------------------------------------------------------------------
    */

    public function atualizarTransportadora(
        Request $request,
        Pedido $pedido
    ) {
        $this->permitir([
            'admin',
            'pedidos',
            'agendamento',
            'carregamento',
        ]);

        $dados = $request->validate([
            'transportadora' => [
                'required',
                'string',
                'max:255',
            ],
        ]);

        $pedido->update([
            'transportadora' => $dados['transportadora'],
        ]);

        return back()->with(
            'success',
            'Transportadora atualizada com sucesso.'
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Iniciar carregamento
    |--------------------------------------------------------------------------
    */

    public function carregar(Request $request, Pedido $pedido)
{
    $this->permitir([
        'admin',
        'pedidos',
        'carregamento',
    ]);

    $dados = $request->validate([
        'placa' => [
            'required',
            'string',
            'max:255',
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

    $historico = PedidoHistorico::create([
        'pedido_id' => $pedido->id,
        'user_id' => auth()->user()->id,
        'acao' => 'Carregamento iniciado',
        'detalhes' => 'Carregamento iniciado para o veiculo de placa ' .
            $dados['placa'] . '.',
    ]);

    

    return back()->with(
        'success',
        'Carregamento iniciado com sucesso.'
    );
}

    /*
    |--------------------------------------------------------------------------
    | Faturar
    |--------------------------------------------------------------------------
    */

    public function faturar(Request $request, Pedido $pedido)
    {
        $this->permitir([
            'admin',
            'pedidos',
            'carregamento',
        ]);

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
                'max:255',
            ],
        ]);

        $pedido->update([
    'numero_nfe' => $dados['numero_nfe'],
    'status' => Pedido::STATUS_FATURADO,
    'fim_carregamento_at' => now(),
    'hora_faturamento' => now(),
]);

PedidoHistorico::create([
    'pedido_id' => $pedido->id,
    'user_id' => auth()->user()->id,
    'acao' => 'Pedido faturado',
    'detalhes' => 'Pedido faturado com NF-e ' .
        $dados['numero_nfe'] . '.',
]);

return back()->with(
    'success',
    'Pedido faturado com sucesso.'
);

    }


    /*
    |--------------------------------------------------------------------------
    | Detalhes
    |--------------------------------------------------------------------------
    */

    public function detalhes(Pedido $pedido)
    {
        $pedido->load([
    'cliente',
    'produto',
    'alteradoPor',
]);

        return Inertia::render('Pedidos/Detalhes', [
            'pedido' => $pedido,
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | Cancelar
    |--------------------------------------------------------------------------
    */

    public function cancelar(Pedido $pedido)
    {
        $this->permitir([
            'admin',
            'pedidos',
        ]);

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


    /*
    |--------------------------------------------------------------------------
    | Excluir
    |--------------------------------------------------------------------------
    */

    public function destroy(Pedido $pedido)
    {
        $this->permitir([
            'admin',
        ]);

        $pedido->delete();

        return back()->with(
            'success',
            'Pedido excluído com sucesso.'
        );
    }
}