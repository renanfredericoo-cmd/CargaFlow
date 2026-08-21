<?php


namespace App\Models;


use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\PedidoHistorico;


class Pedido extends Model
{

protected static function booted(): void
{
    static::updating(function (Pedido $pedido) {
        if (auth()->check()) {
            $pedido->alterado_por_id = auth()->id();
            $pedido->alterado_em = now();
        }
    });
}

    public function historicos(): HasMany
    {
        return $this->hasMany(PedidoHistorico::class)
            ->orderBy('created_at', 'asc');
    }


    /*
    |--------------------------------------------------------------------------
    | Status
    |--------------------------------------------------------------------------
    */


    public const STATUS_PEDIDO = 'Pedido';

    public const STATUS_AGENDADO = 'Agendado';

    public const STATUS_CARREGAMENTO = 'Em Carregamento';

    public const STATUS_FATURADO = 'Faturado';

    public const STATUS_CANCELADO = 'Cancelado';






    /*
    |--------------------------------------------------------------------------
    | Campos preenchíveis
    |--------------------------------------------------------------------------
    */


    protected $fillable = [


        'numero_pedido',


        'data',


        'data_entrega',


        'cliente_id',


        'cliente',


        'destino',


        'produto_id',


        'peso',


        'tipo_frete',


        'vendedor',


        'observacoes',



        'status',



        'transportadora',


        'motorista',


        'placa',



        'data_agendamento',


        'hora_agendamento',



        'data_carregamento',


        'hora_carregamento',



        'inicio_carregamento_at',


        'fim_carregamento_at',



        'numero_nfe',


        'hora_faturamento',



        'user_id',

        'alterado_por_id',
        'alterado_em',


    ];







    /*
    |--------------------------------------------------------------------------
    | Campos calculados
    |--------------------------------------------------------------------------
    */


    protected $appends = [


        'codigo',


        'atraso_carregamento',


    ];







    /*
    |--------------------------------------------------------------------------
    | Casts
    |--------------------------------------------------------------------------
    */


    protected function casts(): array
{
    return [
        'data' => 'date',
        'data_entrega' => 'date',
        'data_agendamento' => 'date',
        'data_carregamento' => 'date',

        'hora_agendamento' => 'datetime:H:i',
        'hora_carregamento' => 'datetime:H:i',

        'alterado_em' => 'datetime',

        'peso' => 'decimal:2',
    ];
}







    /*
    |--------------------------------------------------------------------------
    | Relacionamentos
    |--------------------------------------------------------------------------
    */


    public function user(): BelongsTo
    {

        return $this->belongsTo(User::class);

    }

    public function alteradoPor(): BelongsTo
{
    return $this->belongsTo(User::class, 'alterado_por_id');
}







    public function produto(): BelongsTo
    {

        return $this->belongsTo(Produto::class, 'produto_id');

    }







    public function cliente(): BelongsTo
    {

        return $this->belongsTo(Cliente::class, 'cliente_id');

    }







    /*
    |--------------------------------------------------------------------------
    | Accessors
    |--------------------------------------------------------------------------
    */


    public function getCodigoAttribute(): string
    {

        return 'PED-' . str_pad($this->id, 6, '0', STR_PAD_LEFT);

    }







    /*
    |--------------------------------------------------------------------------
    | Cálculo atraso carregamento
    |--------------------------------------------------------------------------
    */


    public function getAtrasoCarregamentoAttribute()
    {


        if (
            !$this->data_agendamento ||
            !$this->hora_agendamento ||
            !$this->data_carregamento ||
            !$this->hora_carregamento
        ) {

            return null;

        }






        $agendado = \Carbon\Carbon::parse(
            $this->data_agendamento
        )->setTimeFromTimeString(
            $this->hora_agendamento->format('H:i')
        );






        $realizado = \Carbon\Carbon::parse(
            $this->data_carregamento
        )->setTimeFromTimeString(
            $this->hora_carregamento->format('H:i')
        );






        return $agendado->diffInMinutes(
            $realizado,
            false
        );


    }







    /*
    |--------------------------------------------------------------------------
    | Próxima ação do fluxo
    |--------------------------------------------------------------------------
    */


    public function getProximaAcaoAttribute(): string
    {

        return match ($this->status) {


            self::STATUS_PEDIDO => 'Agendar',


            self::STATUS_AGENDADO => 'Iniciar carregamento',


            self::STATUS_CARREGAMENTO => 'Informar NF-e',


            self::STATUS_FATURADO => 'Concluído',


            self::STATUS_CANCELADO => 'Cancelado',


            default => '',

        };

    }







    /*
    |--------------------------------------------------------------------------
    | Helpers
    |--------------------------------------------------------------------------
    */


    public function estaPedido(): bool
    {

        return $this->status === self::STATUS_PEDIDO;

    }



    public function estaAgendado(): bool
    {

        return $this->status === self::STATUS_AGENDADO;

    }



    public function estaEmCarregamento(): bool
    {

        return $this->status === self::STATUS_CARREGAMENTO;

    }



    public function estaFaturado(): bool
    {

        return $this->status === self::STATUS_FATURADO;

    }



    public function estaCancelado(): bool
    {

        return $this->status === self::STATUS_CANCELADO;

    }


}