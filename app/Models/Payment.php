<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Relations\MorphTo;

class Payment extends Model
{
    protected $fillable = ['payable_id', 'payable_type', 'date_paiement', 'montant', 'mode_paiement', 'reference', 'notes'];

    public function payable(): MorphTo
    {
        return $this->morphTo();
    }
}
