<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Partenaire extends Model
{
    protected $fillable = [
        'nom', 'societe', 'fonction', 'contact', 'email', 'adresse', 'date_debut_collaboration'
    ];

    public function services(): BelongsToMany
    {
        return $this->belongsToMany(Service::class, 'service_partner');
    }
}
