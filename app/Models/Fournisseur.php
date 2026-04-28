<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Fournisseur extends Model
{
    protected $fillable = [
        'nom_societe_ou_contact', 'telephone', 'email', 'adresse', 'date_debut_collaboration', 'status'
    ];

    public function activities(): BelongsToMany
    {
        return $this->belongsToMany(Activity::class, 'activity_supplier');
    }

    public function livraisons(): HasMany
    {
        return $this->hasMany(Livraison::class);
    }
}
