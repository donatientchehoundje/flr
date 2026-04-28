<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Livraison;
use App\Models\RentalContract;
use App\Models\Payment;
use Carbon\Carbon;

class StatisticsController extends Controller
{
    /**
     * Display the statistics dashboard.
     */
    public function index(Request $request)
    {
        $startDate = $request->input('start_date', Carbon::now()->startOfMonth()->format('Y-m-d'));
        $endDate = $request->input('end_date', Carbon::now()->endOfMonth()->format('Y-m-d'));
        $intervenantType = $request->input('intervenant_type'); 
        $intervenantId = $request->input('intervenant_id');
        $chantierId = $request->input('chantier_id');
        $serviceId = $request->input('service_id');
        $activityId = $request->input('activity_id');

        // Base Queries
        $livraisonsQuery = Livraison::with(['chantier.client', 'fournisseur', 'payments'])
            ->whereBetween('date_livraison_prevue', [$startDate, $endDate]);

        $locationsQuery = RentalContract::with(['client', 'payments'])
            ->whereBetween('date_debut', [$startDate, $endDate]);

        // Apply Filters
        if ($chantierId) {
            $livraisonsQuery->where('chantier_id', $chantierId);
            // Locations don't have chantiers
            $locationsQuery->where('id', 0); 
        }

        if ($activityId) {
            $livraisonsQuery->whereHas('chantier', function ($q) use ($activityId) {
                $q->where('activity_id', $activityId);
            });
            $locationsQuery->where('activity_id', $activityId);
        } elseif ($serviceId) {
            $livraisonsQuery->whereHas('chantier.activity', function ($q) use ($serviceId) {
                $q->where('service_id', $serviceId);
            });
            $locationsQuery->whereHas('activity', function ($q) use ($serviceId) {
                $q->where('service_id', $serviceId);
            });
        }

        if ($intervenantType === 'client' && $intervenantId) {
            $livraisonsQuery->whereHas('chantier', function ($query) use ($intervenantId) {
                $query->where('client_id', $intervenantId);
            });
            $locationsQuery->where('client_id', $intervenantId);
        } elseif ($intervenantType === 'fournisseur' && $intervenantId) {
            $livraisonsQuery->where('fournisseur_id', $intervenantId);
            // Fournisseurs n'ont pas de locations
            $locationsQuery->where('id', 0);
        }

        $livraisons = $livraisonsQuery->get();
        $locations = $locationsQuery->get();

        // Calculate KPIs
        $totalLivraisons = $livraisons->count();
        $totalLocations = $locations->count();

        $montantTotalLivraisons = $livraisons->sum('montant_total_retenu_client');
        $montantPayeLivraisons = $livraisons->reduce(function ($carry, $livraison) {
            return $carry + $livraison->payments->sum('amount');
        }, 0);
        $resteAPayerLivraisons = $montantTotalLivraisons - $montantPayeLivraisons;

        $montantTotalLocations = $locations->sum('montant_total_prevu');
        $montantPayeLocations = $locations->reduce(function ($carry, $location) {
            return $carry + $location->payments->sum('amount');
        }, 0);
        $resteAPayerLocations = $montantTotalLocations - $montantPayeLocations;

        // Formater les données pour les graphiques (Exemple : par statut de livraison)
        $livraisonsParStatut = $livraisons->groupBy('status')->map->count();

        // Formater le CA par jour (Simple Array pour la chart)
        $caParJour = $livraisons->groupBy(function($date) {
            return Carbon::parse($date->date_livraison_prevue)->format('d/m');
        })->map(function ($row) {
            return $row->sum('montant_total_retenu_client');
        });

        // Les données à envoyer à Inertia
        $stats = [
            'period' => ['start' => $startDate, 'end' => $endDate],
            'kpis' => [
                'livraisons' => [
                    'count' => $totalLivraisons,
                    'total_facture' => $montantTotalLivraisons,
                    'total_paye' => $montantPayeLivraisons,
                    'reste_a_payer' => $resteAPayerLivraisons,
                ],
                'locations' => [
                    'count' => $totalLocations,
                    'total_prevu' => $montantTotalLocations,
                    'total_paye' => $montantPayeLocations,
                    'reste_a_payer' => $resteAPayerLocations,
                ],
                'global' => [
                    'total_volume' => $montantTotalLivraisons + $montantTotalLocations,
                    'total_encaisse' => $montantPayeLivraisons + $montantPayeLocations,
                    'total_restant' => $resteAPayerLivraisons + $resteAPayerLocations,
                ]
            ],
            'charts' => [
                'livraisons_statut' => $livraisonsParStatut,
                'ca_evolution' => $caParJour,
            ]
        ];

        // Charger les données de référence pour les filtres
        $chantiers = \App\Models\Chantier::select('id', 'libelle')->get();
        // adapter la selection des noms des chantiers avec alias pour le frontend
        $chantiers->transform(function($item) {
            $item->nom_chantier = $item->libelle;
            return $item;
        });
        
        $clients = \App\Models\Client::select('id', 'nom_societe_ou_contact', 'telephone')->get();
        $fournisseurs = \App\Models\Fournisseur::select('id', 'nom_societe_ou_contact', 'telephone')->get();
        $services = \App\Models\Service::with('activities')->get();

        return Inertia::render('Statistics/Index', [
            'stats' => $stats,
            'filters' => $request->all('start_date', 'end_date', 'intervenant_type', 'intervenant_id', 'chantier_id', 'service_id', 'activity_id'),
            'referenceData' => [
                'chantiers' => $chantiers,
                'clients' => $clients,
                'fournisseurs' => $fournisseurs,
                'services' => $services,
            ]
        ]);
    }

    /**
     * Print View for the statistics.
     */
    public function print(Request $request)
    {
        // Same logic as index, but returns a Blade view for printing
        $startDate = $request->input('start_date', Carbon::now()->startOfMonth()->format('Y-m-d'));
        $endDate = $request->input('end_date', Carbon::now()->endOfMonth()->format('Y-m-d'));
        $intervenantType = $request->input('intervenant_type'); 
        $intervenantId = $request->input('intervenant_id');
        $chantierId = $request->input('chantier_id');
        $serviceId = $request->input('service_id');
        $activityId = $request->input('activity_id');

        $livraisonsQuery = Livraison::with(['chantier.client', 'fournisseur', 'payments'])
            ->whereBetween('date_livraison_prevue', [$startDate, $endDate]);

        $locationsQuery = RentalContract::with(['client', 'payments'])
            ->whereBetween('date_debut', [$startDate, $endDate]);

        if ($chantierId) {
            $livraisonsQuery->where('chantier_id', $chantierId);
            $locationsQuery->where('id', 0);
        }

        if ($activityId) {
            $livraisonsQuery->whereHas('chantier', function ($q) use ($activityId) {
                $q->where('activity_id', $activityId);
            });
            $locationsQuery->where('activity_id', $activityId);
        } elseif ($serviceId) {
            $livraisonsQuery->whereHas('chantier.activity', function ($q) use ($serviceId) {
                $q->where('service_id', $serviceId);
            });
            $locationsQuery->whereHas('activity', function ($q) use ($serviceId) {
                $q->where('service_id', $serviceId);
            });
        }

        if ($intervenantType === 'client' && $intervenantId) {
            $livraisonsQuery->whereHas('chantier', function ($q) use ($intervenantId) {
                $q->where('client_id', $intervenantId);
            });
            $locationsQuery->where('client_id', $intervenantId);
        } elseif ($intervenantType === 'fournisseur' && $intervenantId) {
            $livraisonsQuery->where('fournisseur_id', $intervenantId);
            $locationsQuery->where('id', 0);
        }

        $livraisons = $livraisonsQuery->get();
        $locations = $locationsQuery->get();

        return view('reports.statistics', compact('livraisons', 'locations', 'startDate', 'endDate'));
    }
}
