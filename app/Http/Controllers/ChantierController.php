<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Chantier;
use App\Models\Client;
use App\Models\Responsable;
use App\Models\Activity;
use Inertia\Inertia;

class ChantierController extends Controller
{
    public function index()
    {
        return Inertia::render('Chantiers/Index', [
            'chantiers' => Chantier::with(['client', 'responsable', 'activity.service'])->latest()->get(),
            'clients' => Client::all(),
            'responsables' => Responsable::all(),
            'activities' => Activity::with('service')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'libelle' => 'required|string|max:255',
            'client_id' => 'required|exists:clients,id',
            'activity_id' => 'required|exists:activities,id',
            'responsable_id' => 'required|exists:responsables,id',
            'lieu' => 'nullable|string|max:255',
            'date_debut' => 'nullable|date',
            'date_fin_prevue' => 'nullable|date|after_or_equal:date_debut',
            'status' => 'required|in:en_cours,termine,suspendu,annule',
            'notes' => 'nullable|string',
        ]);

        Chantier::create($validated);

        return redirect()->back()->with('message', 'Chantier créé avec succès.');
    }

    public function update(Request $request, Chantier $chantier)
    {
        $validated = $request->validate([
            'libelle' => 'required|string|max:255',
            'client_id' => 'required|exists:clients,id',
            'activity_id' => 'required|exists:activities,id',
            'responsable_id' => 'required|exists:responsables,id',
            'lieu' => 'nullable|string|max:255',
            'date_debut' => 'nullable|date',
            'date_fin_prevue' => 'nullable|date|after_or_equal:date_debut',
            'status' => 'required|in:en_cours,termine,suspendu,annule',
            'notes' => 'nullable|string',
        ]);

        $chantier->update($validated);

        return redirect()->back()->with('message', 'Chantier mis à jour.');
    }

    public function destroy(Chantier $chantier)
    {
        $chantier->delete();
        return redirect()->back()->with('message', 'Chantier supprimé.');
    }
}
