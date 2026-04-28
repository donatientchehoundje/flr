<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EntrepriseConfig extends Model
{
    protected $fillable = [
        'nom', 'ifu', 'rccm', 'responsable_legal', 'logo', 'contact_infos'
    ];

    protected $casts = [
        'contact_infos' => 'array'
    ];
}
