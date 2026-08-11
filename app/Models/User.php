<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'name',
    'email',
    'password',
    'role',
    'active',
])]
#[Hidden([
    'password',
    'two_factor_secret',
    'two_factor_recovery_codes',
    'remember_token',
])]
class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'active' => 'boolean',
        ];
    }

    /*
    |--------------------------------------------------------------------------
    | Permissões
    |--------------------------------------------------------------------------
    */

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function podePedidos(): bool
    {
        return in_array($this->role, [
            'admin',
            'pedidos',
        ]);
    }

    public function podeAgendamento(): bool
    {
        return in_array($this->role, [
            'admin',
            'agendamento',
        ]);
    }

    public function podeCarregamento(): bool
    {
        return in_array($this->role, [
            'admin',
            'carregamento',
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | Relacionamentos
    |--------------------------------------------------------------------------
    */

    public function completedTasks(): HasMany
    {
        return $this->hasMany(
            Task::class,
            'completed_by'
        );
    }
}