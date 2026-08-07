<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Produto extends Model
{
    protected $fillable = [
        'descricao',
        'ativo',
    ];


    protected function casts(): array
    {
        return [
            'ativo' => 'boolean',
        ];
    }


    public function pedidos(): HasMany
    {
        return $this->hasMany(Pedido::class);
    }
}