<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Livraison;
use App\Models\Chantier;
use App\Models\Fournisseur;
use App\Models\Responsable;
use Inertia\Inertia;

class LivraisonController extends Controller
{
    public function index()
    {
        return Inertia::render('Livraisons/Index', [
            'livraisons' => Livraison::with(['chantier', 'fournisseur', 'responsable', 'payments'])->latest()->get(),
            'chantiers' => Chantier::all(),
            'fournisseurs' => Fournisseur::all(),
            'responsables' => Responsable::all(),
        ]);
    }

    public function show(Livraison $livraison)
    {
        return Inertia::render('Livraisons/Show', [
            'livraison' => $livraison->load(['chantier', 'fournisseur', 'responsable', 'partialDeliveries', 'payments']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'chantier_id' => 'required|exists:chantiers,id',
            'fournisseur_id' => 'required|exists:fournisseurs,id',
            'responsable_id' => 'required|exists:responsables,id',
            'reference_bl' => 'nullable|string',
            'date_livraison_prevue' => 'nullable|date',
            'quantite_commandee' => 'required|numeric|min:0',
            'unite' => 'required|string|max:20',
            'montant_total_fournisseur' => 'nullable|numeric',
            'montant_total_retenu_client' => 'nullable|numeric',
            'status' => 'required|in:en_attente,en_cours,termine,annule',
            'notes' => 'nullable|string',
        ]);

        Livraison::create($validated);

        return redirect()->back()->with('message', 'Commande de livraison créée.');
    }

    public function update(Request $request, Livraison $livraison)
    {
        $validated = $request->validate([
            'chantier_id' => 'required|exists:chantiers,id',
            'fournisseur_id' => 'required|exists:fournisseurs,id',
            'responsable_id' => 'required|exists:responsables,id',
            'reference_bl' => 'nullable|string',
            'date_livraison_prevue' => 'nullable|date',
            'quantite_commandee' => 'required|numeric|min:0',
            'unite' => 'required|string|max:20',
            'montant_total_fournisseur' => 'nullable|numeric',
            'montant_total_retenu_client' => 'nullable|numeric',
            'status' => 'required|in:en_attente,en_cours,termine,annule',
            'notes' => 'nullable|string',
        ]);

        $livraison->update($validated);

        return redirect()->back()->with('message', 'Livraison mise à jour.');
    }

    public function destroy(Livraison $livraison)
    {
        $livraison->delete();
        return redirect()->back()->with('message', 'Livraison supprimée.');
    }
}
