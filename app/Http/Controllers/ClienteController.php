<?php


namespace App\Http\Controllers;


use App\Models\Cliente;
use Illuminate\Http\Request;
use Inertia\Inertia;



class ClienteController extends Controller
{



    public function index()
    {


        $clientes = Cliente::latest()
            ->get();



        return Inertia::render('Clientes/Index', [


            'clientes' => $clientes,


        ]);


    }







    public function store(Request $request)
    {


        $validated = $request->validate([



            'nome' => [

                'required',

                'string',

                'max:255',

            ],





            'cidade' => [

                'required',

                'string',

                'max:255',

            ],





            'estado' => [

                'required',

                'string',

                'size:2',

            ],





            'ativo' => [

                'nullable',

                'boolean',

            ],



        ]);





        Cliente::create($validated);





        return redirect()

            ->back();


    }







    public function update(Request $request, Cliente $cliente)
    {



        $validated = $request->validate([



            'nome' => [

                'required',

                'string',

                'max:255',

            ],





            'cidade' => [

                'required',

                'string',

                'max:255',

            ],





            'estado' => [

                'required',

                'string',

                'size:2',

            ],





            'ativo' => [

                'nullable',

                'boolean',

            ],



        ]);






        $cliente->update($validated);





        return redirect()

            ->back();


    }







    public function destroy(Cliente $cliente)
    {


        $cliente->delete();



        return redirect()

            ->back();


    }







    public function toggle(Cliente $cliente)
    {


        $cliente->update([


            'ativo' => !$cliente->ativo,


        ]);





        return redirect()

            ->back();


    }



}