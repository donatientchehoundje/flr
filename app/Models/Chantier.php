<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Chantier extends Model
{
    protected $fillable = [
        'libelle', 'client_id', 'activity_id', 'responsable_id', 'lieu', 'date_debut', 'date_fin_prevue', 'status', 'notes'
    ];

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function activity(): BelongsTo
    {
        return $this->belongsTo(Activity::class);
    }

    public function responsable(): BelongsTo
    {
        return $this->belongsTo(Responsable::class);
    }

    public function livraisons(): HasMany
    {
        return $this->hasMany(Livraison::class);
    }
}
