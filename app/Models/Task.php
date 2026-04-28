<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Task extends Model
{
    protected $fillable = [
        'planification_id',
        'responsable_id',
        'libelle',
        'description',
        'date_debut',
        'date_fin',
        'priorite',
        'status',
        'ordre',
        'notes',
    ];

    public function planification(): BelongsTo
    {
        return $this->belongsTo(Planification::class);
    }

    public function responsable(): BelongsTo
    {
        return $this->belongsTo(Responsable::class);
    }
}
