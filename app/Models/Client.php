<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Client extends Model
{
    protected $fillable = [
        'nom_societe_ou_contact', 'telephone', 'email', 'adresse', 'date_debut_collaboration', 'status'
    ];

    public function activities(): BelongsToMany
    {
        return $this->belongsToMany(Activity::class, 'activity_client');
    }

    public function chantiers(): HasMany
    {
        return $this->hasMany(Chantier::class);
    }

    public function rentalContracts(): HasMany
    {
        return $this->hasMany(RentalContract::class);
    }
}
