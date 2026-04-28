<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Service extends Model
{
    protected $fillable = ['nom', 'description'];

    public function activities(): HasMany
    {
        return $this->hasMany(Activity::class);
    }

    public function responsables(): BelongsToMany
    {
        return $this->belongsToMany(Responsable::class, 'responsable_service');
    }

    // Backward compatibility
    public function responsablesOld(): HasMany
    {
        return $this->hasMany(Responsable::class);
    }

    public function partenaires(): BelongsToMany
    {
        return $this->belongsToMany(Partenaire::class, 'service_partner');
    }
}
