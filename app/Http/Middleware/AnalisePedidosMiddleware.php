<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AnalisePedidosMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!in_array(auth()->user()->role, ['admin', 'pedidos'])) {
            abort(403);
        }

        return $next($request);
    }
}