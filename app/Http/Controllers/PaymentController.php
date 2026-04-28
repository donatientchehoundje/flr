<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Payment;
use App\Models\Livraison;
use App\Models\RentalContract;

class PaymentController extends Controller
{
    public function store(Request $request, $type, $id)
    {
        $validated = $request->validate([
            'montant' => 'required|numeric|min:0.01',
            'date_paiement' => 'required|date',
            'mode_paiement' => 'required|in:Virement,Espèces,Chèque,Mobile Money',
            'reference' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        $model = match($type) {
            'livraison' => Livraison::findOrFail($id),
            'location' => RentalContract::findOrFail($id),
            default => abort(404),
        };

        $model->payments()->create($validated);

        return redirect()->back()->with('message', 'Paiement enregistré avec succès.');
    }
}
