<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PartialDelivery extends Model
{
    protected $fillable = ['livraison_id', 'quantite', 'bl_numero', 'date_reception', 'status', 'notes'];

    public function livraison(): BelongsTo
    {
        return $this->belongsTo(Livraison::class);
    }
}
