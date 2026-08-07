<?php

namespace App\Http\Controllers;

use App\Models\Produto;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProdutoController extends Controller
{
    public function index()
    {
        $produtos = Produto::latest()->get();

        return Inertia::render('Produtos/Index', [
            'produtos' => $produtos,
        ]);
    }


    public function store(Request $request)
    {
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
        $produto->update([
            'ativo' => !$produto->ativo,
        ]);

        return back()->with(
            'success',
            'Status do produto alterado.'
        );
    }
}