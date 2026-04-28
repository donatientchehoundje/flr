<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Planification extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'titre',
        'description',
        'type',
        'responsable_id',
        'created_by',
        'date_debut',
        'date_fin',
        'priorite',
        'status',
        'notes',
        'plannable_type',
        'plannable_id',
    ];

    public function responsable(): BelongsTo
    {
        return $this->belongsTo(Responsable::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class)->orderBy('ordre');
    }

    public function plannable(): MorphTo
    {
        return $this->morphTo();
    }
}
