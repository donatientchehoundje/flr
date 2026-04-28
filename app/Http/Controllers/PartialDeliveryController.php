<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PartialDelivery;
use App\Models\Livraison;

class PartialDeliveryController extends Controller
{
    public function store(Request $request, Livraison $livraison)
    {
        $validated = $request->validate([
            'quantite' => 'required|numeric|min:0.01',
            'bl_numero' => 'required|string|max:255',
            'date_reception' => 'required|date',
            'notes' => 'nullable|string',
            // 'image_bl' => 'nullable|image|max:2048', // Gestion upload à venir si besoin
        ]);

        $livraison->partialDeliveries()->create($validated);

        // Check if finished
        if ($livraison->total_recu >= $livraison->quantite_commandee) {
            $livraison->update(['status' => 'termine']);
        } else {
            $livraison->update(['status' => 'en_cours']);
        }

        return redirect()->back()->with('message', 'Réception enregistrée avec succès.');
    }
}
