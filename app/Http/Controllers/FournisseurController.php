<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Fournisseur;

class FournisseurController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom_societe_ou_contact' => 'required|string|max:255',
            'telephone' => 'nullable|string',
            'email' => 'nullable|email',
            'adresse' => 'nullable|string',
            'status' => 'required|in:actif,inactif',
            'activity_ids' => 'nullable|array',
            'activity_ids.*' => 'exists:activities,id',
        ]);

        $fournisseur = Fournisseur::create($validated);
        
        if ($request->has('activity_ids')) {
            $fournisseur->activities()->sync($request->activity_ids);
        }

        return redirect()->back()->with('message', 'Fournisseur ajouté.');
    }

    public function update(Request $request, Fournisseur $fournisseur)
    {
        $validated = $request->validate([
            'nom_societe_ou_contact' => 'required|string|max:255',
            'telephone' => 'nullable|string',
            'email' => 'nullable|email',
            'adresse' => 'nullable|string',
            'status' => 'required|in:actif,inactif',
            'activity_ids' => 'nullable|array',
            'activity_ids.*' => 'exists:activities,id',
        ]);

        $fournisseur->update($validated);
        $fournisseur->activities()->sync($request->activity_ids ?? []);

        return redirect()->back()->with('message', 'Fournisseur mis à jour.');
    }

    public function destroy(Fournisseur $fournisseur)
    {
        $fournisseur->delete();
        return redirect()->back()->with('message', 'Fournisseur supprimé.');
    }
}
