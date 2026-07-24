<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Task extends Model
{
    protected $fillable = [

        'title',
        'description',
        'user_id',
        'priority',
        'status',
        'due_date',
        'completion_note',
        'completed_at',
        'completed_by',

    ];



    protected function casts(): array
    {
        return [

            'due_date' => 'date',

            'completed_at' => 'datetime',

        ];
    }





    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }





    public function completedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'completed_by');
    }





    public function histories(): HasMany
    {
        return $this->hasMany(TaskHistory::class);
    }
}