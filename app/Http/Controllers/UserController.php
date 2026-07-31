<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserController extends Controller
{

    public function index()
    {
        if (auth()->user()->role !== 'admin') {
            abort(403);
        }


        $users = User::select(
            'id',
            'name',
            'email',
            'role',
            'active',
            'created_at'
        )
        ->orderBy('name')
        ->get();


        return Inertia::render('Users/Index', [
            'users' => $users
        ]);
    }



    public function store(StoreUserRequest $request)
    {
        if (auth()->user()->role !== 'admin') {
            abort(403);
        }


        User::create([

            'name' => $request->name,

            'email' => $request->email,

            'password' => Hash::make($request->password),

            // Admin escolhe se é admin ou funcionário
            'role' => $request->role,

            'active' => true,

        ]);


        return redirect()
            ->route('users.index')
            ->with('success', 'Usuário criado com sucesso.');
    }





    public function update(Request $request, User $user)
    {
        if (auth()->user()->role !== 'admin') {
            abort(403);
        }


        $validated = $request->validate([

            'name' => [
                'required',
                'string',
                'max:255'
            ],

            'email' => [
                'required',
                'email'
            ],

            'role' => [
                'required',
                'in:admin,funcionario'
            ],

            'active' => [
                'required',
                'boolean'
            ],

            'password' => [
                'nullable',
                'string',
                'min:6',
                'confirmed'
            ],

        ]);



        if (!empty($validated['password'])) {

            $validated['password'] = Hash::make(
                $validated['password']
            );

        } else {

            unset($validated['password']);

        }



        $user->update($validated);



        return redirect()
            ->route('users.index')
            ->with('success', 'Usuário atualizado com sucesso.');
    }





    public function destroy(User $user)
    {
        if (auth()->user()->role !== 'admin') {
            abort(403);
        }


        $user->delete();


        return redirect()
            ->route('users.index')
            ->with('success', 'Usuário removido com sucesso.');
    }





    public function toggleStatus(User $user)
    {
        if (auth()->user()->role !== 'admin') {
            abort(403);
        }


        $user->update([

            'active' => !$user->active

        ]);



        return redirect()
            ->route('users.index')
            ->with('success', 'Status atualizado com sucesso.');
    }

}