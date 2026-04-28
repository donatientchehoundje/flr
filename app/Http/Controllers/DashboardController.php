<?php

namespace App\Http\Controllers;

use App\Models\AppNotification;
use Illuminate\Http\Request;

use App\Models\Chantier;
use App\Models\Livraison;
use App\Models\Task;
use App\Models\RentalContract;
use App\Models\Payment;
use App\Models\PartialDelivery;
use Carbon\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $this->syncTaskAlertNotifications();

        $chantiersActifs = Chantier::where('status', 'en_cours')->count();
        $livraisonsAttente = Livraison::where('status', 'en_attente')->count();
        
        $caPrevu = RentalContract::where('status', '!=', 'annule')->sum('montant_total_prevu');
        $caEncaisse = Payment::where('payable_type', RentalContract::class)->sum('montant');
        
        $dettesTotal = Livraison::sum('montant_total_fournisseur');
        $dettesPayees = Payment::where('payable_type', Livraison::class)->sum('montant');
        $dettesRestantes = $dettesTotal - $dettesPayees;

        // Activités récentes (Paiements + Réceptions BL)
        $recentPayments = Payment::with('payable')->latest()->take(5)->get();
        $recentBL = PartialDelivery::with('livraison.chantier')->latest()->take(5)->get();

        return Inertia::render('Dashboard', [
            'stats' => [
                'chantiers_actifs' => $chantiersActifs,
                'livraisons_attente' => $livraisonsAttente,
                'ca_prevu' => (float)$caPrevu,
                'ca_encaisse' => (float)$caEncaisse,
                'dettes_fournisseurs' => (float)$dettesRestantes,
            ],
            'recent_payments' => $recentPayments,
            'recent_bl' => $recentBL,
        ]);
    }

    private function syncTaskAlertNotifications(): void
    {
        $today = Carbon::today();

        $tasks = Task::whereNotIn('status', ['Terminé', 'Annulé'])
            ->whereNotNull('date_fin')
            ->get();

        foreach ($tasks as $task) {
            $end = Carbon::parse($task->date_fin)->startOfDay();
            $level = null;

            if ($end->lt($today)) {
                $level = 'overdue';
            } elseif ($end->equalTo($today)) {
                $level = 'today';
            } elseif ($end->lte($today->copy()->addDays(3))) {
                $level = 'soon';
            }

            if (!$level) {
                AppNotification::where('unique_key', 'like', "task_alert_{$task->id}_%")->delete();
                continue;
            }

            $label = match ($level) {
                'overdue' => 'En retard',
                'today' => "A livrer aujourd'hui",
                default => 'Echeance proche',
            };

            $datePart = $end->format('Y-m-d');
            $uniqueKey = "task_alert_{$task->id}_{$level}_{$datePart}";

            AppNotification::updateOrCreate(
                ['unique_key' => $uniqueKey],
                [
                    'type' => 'task_alert',
                    'title' => "Tache {$label}",
                    'message' => "{$task->libelle} ({$task->status}) - echeance {$datePart}",
                    'related_type' => Task::class,
                    'related_id' => $task->id,
                    'is_read' => false,
                ]
            );

            AppNotification::where('unique_key', 'like', "task_alert_{$task->id}_%")
                ->where('unique_key', '!=', $uniqueKey)
                ->delete();
        }
    }
}
