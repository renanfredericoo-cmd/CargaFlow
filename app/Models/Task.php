<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Carregamento extends Model
{
    protected $fillable = [
        'cliente',
        'motorista',
        'placa',
        'origem',
        'destino',
        'data_carregamento',
        'status',
        'observacoes',
        'user_id',
    ];

    protected function casts(): array
    {
        return [
            'data_carregamento' => 'date',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}