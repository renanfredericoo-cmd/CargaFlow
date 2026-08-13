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



        $query = Pedido::query();



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



            'cancelados' => $pedidos
                ->where('status', 'Cancelado')
                ->count(),



            'toneladas' => $pedidos->sum('peso'),




            'tempo_operacao' => [


                'media_segundos' => round($tempoMedioCarregamento ?? 0),



                'total_analisados' => $pedidosComTempo->count(),



                'menor_tempo' => $pedidosComTempo->count()

                    ? $pedidosComTempo->min(function ($pedido) {

                        return Carbon::parse($pedido->inicio_carregamento_at)
                            ->diffInSeconds(
                                Carbon::parse($pedido->fim_carregamento_at)
                            );

                    })

                    : 0,



                'maior_tempo' => $pedidosComTempo->count()

                    ? $pedidosComTempo->max(function ($pedido) {

                        return Carbon::parse($pedido->inicio_carregamento_at)
                            ->diffInSeconds(
                                Carbon::parse($pedido->fim_carregamento_at)
                            );

                    })

                    : 0,

            ],


        ];







        $ultimos = $pedidos
            ->load('produto')
            ->sortByDesc('created_at')
            ->take(10)
            ->values();







        return Inertia::render('dashboard', [

            'stats' => $stats,

            'role' => $user->role,

            'ultimos' => $ultimos,

            'filtro' => [
                'data_inicial' => $dataInicial,
                'data_final' => $dataFinal,
            ],

        ]);
    }
}