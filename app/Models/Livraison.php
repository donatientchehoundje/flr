<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Livraison extends Model
{
    protected $fillable = [
        'chantier_id', 'fournisseur_id', 'responsable_id', 'reference_bl', 'date_livraison_prevue', 
        'quantite_commandee', 'unite', 'montant_total_fournisseur', 'montant_total_retenu_client', 'status', 'notes'
    ];

    protected $appends = ['total_recu'];

    public function getTotalRecuAttribute(): float
    {
        return $this->partialDeliveries()->sum('quantite');
    }

    public function chantier(): BelongsTo
    {
        return $this->belongsTo(Chantier::class);
    }

    public function fournisseur(): BelongsTo
    {
        return $this->belongsTo(Fournisseur::class);
    }

    public function responsable(): BelongsTo
    {
        return $this->belongsTo(Responsable::class);
    }

    public function partialDeliveries(): HasMany
    {
        return $this->hasMany(PartialDelivery::class);
    }

    public function payments(): MorphMany
    {
        return $this->morphMany(Payment::class, 'payable');
    }
}
