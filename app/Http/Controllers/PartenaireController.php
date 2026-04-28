<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Partenaire;

class PartenaireController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'societe' => 'nullable|string|max:255',
            'fonction' => 'nullable|string|max:255',
            'contact' => 'nullable|string|max:255',
            'email' => 'nullable|email',
            'adresse' => 'nullable|string',
            'service_ids' => 'nullable|array',
            'service_ids.*' => 'exists:services,id',
        ]);

        $partenaire = Partenaire::create($validated);
        
        if ($request->has('service_ids')) {
            $partenaire->services()->sync($request->service_ids);
        }

        return redirect()->back()->with('message', 'Partenaire ajouté.');
    }

    public function update(Request $request, Partenaire $partenaire)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'societe' => 'nullable|string|max:255',
            'fonction' => 'nullable|string|max:255',
            'contact' => 'nullable|string|max:255',
            'email' => 'nullable|email',
            'adresse' => 'nullable|string',
            'service_ids' => 'nullable|array',
            'service_ids.*' => 'exists:services,id',
        ]);

        $partenaire->update($validated);
        $partenaire->services()->sync($request->service_ids ?? []);

        return redirect()->back()->with('message', 'Partenaire mis à jour.');
    }

    public function destroy(Partenaire $partenaire)
    {
        $partenaire->delete();
        return redirect()->back()->with('message', 'Partenaire supprimé.');
    }
}
