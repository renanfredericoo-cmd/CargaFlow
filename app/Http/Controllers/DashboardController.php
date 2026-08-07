<?php

namespace App\Http\Controllers;

use App\Models\Pedido;
use App\Models\User;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();



        $pedidosComCarregamento = Pedido::whereNotNull(
            'hora_carregamento'
        )
        ->get();




        $pedidosComTempo = Pedido::whereNotNull(
            'inicio_carregamento_at'
        )
        ->whereNotNull(
            'fim_carregamento_at'
        )
        ->get();




        $tempoMedioCarregamento = $pedidosComTempo->avg(function ($pedido) {

    return \Carbon\Carbon::parse(
        $pedido->inicio_carregamento_at
    )
    ->diffInSeconds(
        \Carbon\Carbon::parse(
            $pedido->fim_carregamento_at
        )
    );

});






        $stats = [


            'users' => User::where('active', true)->count(),



            'pedidos' => Pedido::count(),



            'programados' => Pedido::where(
                'status',
                'Agendado'
            )->count(),



            'carregados' => Pedido::where(
                'status',
                'Em Carregamento'
            )->count(),



            'faturados' => Pedido::where(
                'status',
                'Faturado'
            )->count(),



            'cancelados' => Pedido::where(
                'status',
                'Cancelado'
            )->count(),



            'toneladas' => Pedido::sum('peso') / 1000,




            'tempo_operacao' => [

                'media_segundos' => round(
    $tempoMedioCarregamento ?? 0
),


                'total_analisados' => $pedidosComTempo->count(),

            ],






            'pontualidade' => [


                'no_horario' => $pedidosComCarregamento
                    ->filter(function ($pedido) {

                        return $pedido->atraso_carregamento <= 0;

                    })
                    ->count(),




                'atrasados' => $pedidosComCarregamento
                    ->filter(function ($pedido) {

                        return $pedido->atraso_carregamento > 0;

                    })
                    ->count(),




                'media_atraso' => round(

                    $pedidosComCarregamento
                        ->filter(function ($pedido) {

                            return $pedido->atraso_carregamento > 0;

                        })
                        ->avg('atraso_carregamento') ?? 0

                ),




                'total' => $pedidosComCarregamento->count(),




                'eficiencia' => $pedidosComCarregamento->count() > 0

                    ? round(

                        (
                            $pedidosComCarregamento
                                ->filter(function ($pedido) {

                                    return $pedido->atraso_carregamento <= 0;

                                })
                                ->count()
                            /
                            $pedidosComCarregamento->count()

                        ) * 100

                    )

                    : 0,


            ],


        ];








        $ultimos = Pedido::with('produto')
            ->latest()
            ->limit(10)
            ->get();








        return Inertia::render('dashboard', [

            'stats' => $stats,

            'role' => $user->role,

            'ultimos' => $ultimos,

        ]);

    }
}