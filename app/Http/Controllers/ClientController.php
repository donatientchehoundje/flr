<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Fournisseur;
use App\Models\Partenaire;
use App\Models\Service;
use App\Models\Activity;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClientController extends Controller
{
    public function index()
    {
        return Inertia::render('Intervenants/Index', [
            'clients' => Client::with('activities')->latest()->get(),
            'fournisseurs' => Fournisseur::with('activities')->latest()->get(),
            'partenaires' => Partenaire::with('services')->latest()->get(),
            'services' => Service::with('activities')->get(),
        ]);
    }

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

        $client = Client::create($validated);
        
        if ($request->has('activity_ids')) {
            $client->activities()->sync($request->activity_ids);
        }

        return redirect()->back()->with('message', 'Client ajouté avec succès.');
    }

    public function update(Request $request, Client $client)
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

        $client->update($validated);
        $client->activities()->sync($request->activity_ids ?? []);

        return redirect()->back()->with('message', 'Client mis à jour.');
    }

    public function destroy(Client $client)
    {
        $client->delete();
        return redirect()->back()->with('message', 'Client supprimé.');
    }
}
