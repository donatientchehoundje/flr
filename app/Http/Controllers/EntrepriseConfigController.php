<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\EntrepriseConfig;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class EntrepriseConfigController extends Controller
{
    public function edit()
    {
        $config = EntrepriseConfig::firstOrCreate(
            ['id' => 1],
            [
                'nom' => 'Nouvelle Entreprise',
                'contact_infos' => ['telephone' => '', 'email' => '', 'adresse' => '']
            ]
        );

        return Inertia::render('Settings/Edit', [
            'config' => $config,
        ]);
    }

    public function update(Request $request)
    {
        $config = EntrepriseConfig::first();

        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'ifu' => 'nullable|string|max:255',
            'rccm' => 'nullable|string|max:255',
            'responsable_legal' => 'nullable|string|max:255',
            'contact_infos.telephone' => 'nullable|string',
            'contact_infos.email' => 'nullable|email',
            'contact_infos.adresse' => 'nullable|string',
        ]);

        $config->update($validated);

        return redirect()->back()->with('message', 'Configuration mise à jour avec succès.');
    }
}
