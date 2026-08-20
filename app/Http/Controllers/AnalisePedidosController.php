<?php

namespace App\Http\Controllers;

use App\Models\Pedido;
use Carbon\Carbon;
use Inertia\Inertia;

class AnalisePedidosController extends Controller
{
    public function index()
    {
        $meses = [];

        $inicioPeriodo = Carbon::now()
            ->startOfMonth()
            ->subMonths(2);

        $fimPeriodo = Carbon::now()
            ->endOfMonth();

        $pedidos = Pedido::query()
            ->where('status', '!=', Pedido::STATUS_CANCELADO)
            ->whereBetween('data_entrega', [
                $inicioPeriodo->toDateString(),
                $fimPeriodo->toDateString(),
            ])
            ->select([
                'cliente',
                'destino',
                'peso',
                'data_entrega',
            ])
            ->get();

        for ($i = 0; $i < 3; $i++) {
            $mes = $inicioPeriodo->copy()->addMonths($i);

            $dadosMes = $pedidos
                ->filter(function ($pedido) use ($mes) {
                    return $pedido->data_entrega
                        && Carbon::parse($pedido->data_entrega)->isSameMonth($mes);
                })
                ->groupBy(function ($pedido) {
                    return ($pedido->cliente ?? '-') . '|' . ($pedido->destino ?? '-');
                })
                ->map(function ($grupo) {
                    return [
                        'cliente' => $grupo->first()->cliente ?? '-',
                        'destino' => $grupo->first()->destino ?? '-',
                        'toneladas' => round(
                            $grupo->sum(fn ($pedido) => (float) $pedido->peso),
                            2
                        ),
                    ];
                })
                ->sortByDesc('toneladas')
                ->values();

            $meses[] = [
                'mes' => $mes->format('Y-m'),
                'titulo' => ucfirst($mes->translatedFormat('F/Y')),
                'total_toneladas' => round(
                    $dadosMes->sum('toneladas'),
                    2
                ),
                'dados' => $dadosMes,
            ];
        }

        return Inertia::render('AnalisePedidos', [
            'meses' => $meses,
        ]);
    }
}