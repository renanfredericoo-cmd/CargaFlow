<?php

namespace App\Http\Controllers;

use App\Models\Produto;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProdutoController extends Controller
{
    private function permitir(array $roles): void
    {
        if (!in_array(auth()->user()->role, $roles, true)) {
            abort(403);
        }
    }


    public function index()
    {
        $this->permitir([
            'admin',
            'pedidos',
        ]);

        $produtos = Produto::latest()->get();

        return Inertia::render('Produtos/Index', [
            'produtos' => $produtos,
        ]);
    }


    public function store(Request $request)
    {
        $this->permitir([
            'admin',
            'pedidos',
        ]);

        $dados = $request->validate([
            'descricao' => [
                'required',
                'string',
                'max:255',
            ],
        ]);

        Produto::create([
            'descricao' => $dados['descricao'],
            'ativo' => true,
        ]);

        return back()->with(
            'success',
            'Produto cadastrado com sucesso.'
        );
    }


    public function update(Request $request, Produto $produto)
    {
        $this->permitir([
            'admin',
            'pedidos',
        ]);

        $dados = $request->validate([
            'descricao' => [
                'required',
                'string',
                'max:255',
            ],
        ]);

        $produto->update($dados);

        return back()->with(
            'success',
            'Produto atualizado com sucesso.'
        );
    }


    public function toggle(Produto $produto)
    {
        $this->permitir([
            'admin',
            'pedidos',
        ]);

        $produto->update([
            'ativo' => !$produto->ativo,
        ]);

        return back()->with(
            'success',
            'Status do produto alterado.'
        );
    }


    public function destroy(Produto $produto)
    {
        $this->permitir([
            'admin',
        ]);

        $produto->delete();

        return back()->with(
            'success',
            'Produto excluído com sucesso.'
        );
    }
}