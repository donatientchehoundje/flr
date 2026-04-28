<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\RentalContract;
use App\Models\Client;
use App\Models\Activity;
use App\Models\Responsable;
use Inertia\Inertia;
use Illuminate\Support\Carbon;

class RentalContractController extends Controller
{
    public function index()
    {
        return Inertia::render('Locations/Index', [
            'locations' => RentalContract::with(['client', 'activity.service', 'responsable', 'payments'])->latest()->get(),
            'clients' => Client::all(),
            'activities' => Activity::with('service')->get(),
            'responsables' => Responsable::all(),
        ]);
    }

    public function show(RentalContract $location)
    {
        return Inertia::render('Locations/Show', [
            'location' => $location->load(['client', 'activity.service', 'responsable', 'payments']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'client_id' => 'required|exists:clients,id',
            'activity_id' => 'required|exists:activities,id',
            'responsable_id' => 'required|exists:responsables,id',
            'materiel_loue' => 'required|string|max:255',
            'date_debut' => 'required|date',
            'date_fin' => 'nullable|date|after_or_equal:date_debut',
            'tarif_unitaire' => 'required|numeric|min:0',
            'unite_temps' => 'required|in:jour,semaine,mois',
            'montant_total_prevu' => 'required_without:date_fin|nullable|numeric|min:0',
            'status' => 'required|in:en_attente,en_cours,termine,annule',
            'notes' => 'nullable|string',
        ]);

        if (empty($validated['montant_total_prevu']) && !empty($validated['date_fin'])) {
            $validated['montant_total_prevu'] = $this->calculateTotal(
                $validated['date_debut'], 
                $validated['date_fin'], 
                $validated['tarif_unitaire'], 
                $validated['unite_temps']
            );
        }

        $validated['montant_total_prevu'] = $validated['montant_total_prevu'] ?? 0;
        RentalContract::create($validated);

        return redirect()->back()->with('message', 'Contrat de location enregistré.');
    }

    public function update(Request $request, RentalContract $location)
    {
        $validated = $request->validate([
            'client_id' => 'required|exists:clients,id',
            'activity_id' => 'required|exists:activities,id',
            'responsable_id' => 'required|exists:responsables,id',
            'materiel_loue' => 'required|string|max:255',
            'date_debut' => 'required|date',
            'date_fin' => 'nullable|date|after_or_equal:date_debut',
            'tarif_unitaire' => 'required|numeric|min:0',
            'unite_temps' => 'required|in:jour,semaine,mois',
            'montant_total_prevu' => 'required_without:date_fin|nullable|numeric|min:0',
            'status' => 'required|in:en_attente,en_cours,termine,annule',
            'notes' => 'nullable|string',
        ]);

        if (empty($validated['montant_total_prevu']) && !empty($validated['date_fin'])) {
            $validated['montant_total_prevu'] = $this->calculateTotal(
                $validated['date_debut'], 
                $validated['date_fin'], 
                $validated['tarif_unitaire'], 
                $validated['unite_temps']
            );
        }

        $validated['montant_total_prevu'] = $validated['montant_total_prevu'] ?? 0;
        $location->update($validated);

        return redirect()->back()->with('message', 'Contrat de location mis à jour.');
    }

    private function calculateTotal($start, $end, $rate, $unit)
    {
        $startDate = Carbon::parse($start);
        $endDate = Carbon::parse($end);
        $diffDays = max(1, $startDate->diffInDays($endDate) + 1); // Minimum 1 day

        switch ($unit) {
            case 'jour':
                return $diffDays * $rate;
            case 'semaine':
                return ceil($diffDays / 7) * $rate;
            case 'mois':
                return ceil($diffDays / 30) * $rate;
            default:
                return 0;
        }
    }

    public function destroy(RentalContract $location)
    {
        $location->delete();
        return redirect()->back()->with('message', 'Contrat supprimé.');
    }
}
