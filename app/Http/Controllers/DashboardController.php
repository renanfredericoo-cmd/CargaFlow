<?php

namespace App\Http\Controllers;

use App\Models\Pedido;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();

        $dataInicial = $request->data_inicial;
        $dataFinal = $request->data_final;

if (!$dataInicial && !$dataFinal) {
    $dataInicial = Carbon::now()->startOfMonth()->toDateString();
    $dataFinal = Carbon::now()->endOfMonth()->toDateString();
}

        $query = Pedido::query();

        if ($user->role === 'vendedor') {
            $query->whereRaw(
                'LOWER(vendedor) = LOWER(?)',
                [$user->name]
            );
        }

        if ($dataInicial && $dataFinal) {
            $query->whereBetween('data_entrega', [
                $dataInicial,
                $dataFinal,
            ]);
        } elseif ($dataInicial) {
            $query->whereDate('data_entrega', $dataInicial);
        } elseif ($dataFinal) {
            $query->whereDate('data_entrega', $dataFinal);
        }

        $pedidos = $query->get();

        $produtosNutricao = [
    5, 6, 7, 10, 11, 12, 13,
    14, 15, 16, 17, 18, 21, 23,
];

        $pedidosComTempo = $pedidos
            ->whereNotNull('inicio_carregamento_at')
            ->whereNotNull('fim_carregamento_at');

        $tempoMedioCarregamento = $pedidosComTempo->avg(function ($pedido) {
            return Carbon::parse($pedido->inicio_carregamento_at)
                ->diffInSeconds(
                    Carbon::parse($pedido->fim_carregamento_at)
                );
        });

        $stats = [
            'users' => User::where('active', true)->count(),

            'pedidos' => $pedidos->count(),

            'programados' => $pedidos
                ->where('status', 'Agendado')
                ->count(),

            'carregados' => $pedidos
                ->where('status', 'Em Carregamento')
                ->count(),

            'faturados' => $pedidos
                ->where('status', 'Faturado')
                ->count(),

            'toneladas_faturadas' => $pedidos
                ->where('status', 'Faturado')
                ->sum('peso'),

            'cancelados' => $pedidos
                ->where('status', 'Cancelado')
                ->count(),

            'toneladas' => $pedidos
    ->whereNotIn('produto_id', $produtosNutricao)
    ->sum('peso'),

'toneladas_nutricao' => $pedidos
    ->whereIn('produto_id', $produtosNutricao)
    ->sum('peso'),

            'tempo_operacao' => [
                'media_segundos' => round(
                    $tempoMedioCarregamento ?? 0
                ),

                'total_analisados' => $pedidosComTempo->count(),

                'menor_tempo' => $pedidosComTempo->count()
                    ? $pedidosComTempo->min(function ($pedido) {
                        return Carbon::parse(
                            $pedido->inicio_carregamento_at
                        )->diffInSeconds(
                            Carbon::parse(
                                $pedido->fim_carregamento_at
                            )
                        );
                    })
                    : 0,

                'maior_tempo' => $pedidosComTempo->count()
                    ? $pedidosComTempo->max(function ($pedido) {
                        return Carbon::parse(
                            $pedido->inicio_carregamento_at
                        )->diffInSeconds(
                            Carbon::parse(
                                $pedido->fim_carregamento_at
                            )
                        );
                    })
                    : 0,
            ],
        ];

        /*
        |--------------------------------------------------------------------------
        | Toneladas carregadas - últimos 7 dias
        |--------------------------------------------------------------------------
        */

        $toneladasUltimos7Dias = collect();

        for ($i = 6; $i >= 0; $i--) {
            $data = Carbon::today()->subDays($i);

            $toneladas = $pedidos
                ->filter(function ($pedido) use ($data) {
                    if (!$pedido->fim_carregamento_at) {
                        return false;
                    }

                    return Carbon::parse(
                        $pedido->fim_carregamento_at
                    )->isSameDay($data);
                })
                ->sum('peso');

            $toneladasUltimos7Dias->push([
                'data' => $data->format('Y-m-d'),
                'label' => $data->format('d/m'),
                'toneladas' => round((float) $toneladas, 3),
            ]);
        }

        $totalToneladas7Dias = $toneladasUltimos7Dias->sum(
            'toneladas'
        );

        $mediaToneladas7Dias = $totalToneladas7Dias / 7;

        /*
        |--------------------------------------------------------------------------
        | Pedidos por status
        |--------------------------------------------------------------------------
        */

        $statusDisponiveis = [
            'Pedido',
            'Agendado',
            'Em Carregamento',
            'Faturado',
            'Cancelado',
        ];

        $pedidosPorStatus = collect();

        foreach ($statusDisponiveis as $status) {
            $pedidosPorStatus->push([
                'status' => $status,
                'total' => $pedidos
                    ->where('status', $status)
                    ->count(),
            ]);
        }

        return Inertia::render('dashboard', [
            'stats' => $stats,

            'role' => $user->role,

            'toneladas_ultimos_7_dias' => [
                'dias' => $toneladasUltimos7Dias->values(),
                'total' => round($totalToneladas7Dias, 3),
                'media' => round($mediaToneladas7Dias, 3),
            ],

            'pedidos_por_status' => $pedidosPorStatus->values(),

            'filtro' => [
                'data_inicial' => $dataInicial,
                'data_final' => $dataFinal,
            ],
        ]);
    }
}