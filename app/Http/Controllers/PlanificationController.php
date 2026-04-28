<?php

namespace App\Http\Controllers;

use App\Models\AppNotification;
use App\Models\Planification;
use App\Models\Responsable;
use App\Models\Task;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PlanificationController extends Controller
{
    public function index()
    {
        return Inertia::render('Planifications/Index', [
            'planifications' => Planification::with(['responsable', 'tasks.responsable'])
                ->latest()
                ->get()
                ->map(function ($planification) {
                    $planification->tasks->transform(function ($task) {
                        $task->alert_level = $this->resolveTaskAlertLevel($task);
                        return $task;
                    });

                    return $planification;
                }),
            'responsables' => Responsable::select('id', 'nom')->orderBy('nom')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'titre' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|string|max:80',
            'responsable_id' => 'required|exists:responsables,id',
            'date_debut' => 'nullable|date',
            'date_fin' => 'nullable|date|after_or_equal:date_debut',
            'priorite' => 'required|in:Basse,Normale,Haute,Urgente',
            'status' => 'required|in:A faire,En cours,Terminé,Annulé',
            'notes' => 'nullable|string',
        ]);

        $validated['created_by'] = $request->user()->id;

        Planification::create($validated);

        return redirect()->back()->with('message', 'Planification créée.');
    }

    public function update(Request $request, Planification $planification)
    {
        $validated = $request->validate([
            'titre' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|string|max:80',
            'responsable_id' => 'required|exists:responsables,id',
            'date_debut' => 'nullable|date',
            'date_fin' => 'nullable|date|after_or_equal:date_debut',
            'priorite' => 'required|in:Basse,Normale,Haute,Urgente',
            'status' => 'required|in:A faire,En cours,Terminé,Annulé',
            'notes' => 'nullable|string',
        ]);

        $taskDates = $planification->tasks()
            ->where(function ($query) {
                $query->whereNotNull('date_debut')->orWhereNotNull('date_fin');
            })
            ->get(['date_debut', 'date_fin']);

        if ($validated['date_debut'] ?? null) {
            $newStart = Carbon::parse($validated['date_debut'])->startOfDay();
            $hasTaskBeforeStart = $taskDates->contains(function ($task) use ($newStart) {
                return $task->date_debut && Carbon::parse($task->date_debut)->lt($newStart);
            });

            if ($hasTaskBeforeStart) {
                return redirect()->back()->withErrors([
                    'date_debut' => 'La date de début de la planification doit couvrir les dates de début des tâches existantes.',
                ]);
            }
        }

        if ($validated['date_fin'] ?? null) {
            $newEnd = Carbon::parse($validated['date_fin'])->endOfDay();
            $hasTaskAfterEnd = $taskDates->contains(function ($task) use ($newEnd) {
                $taskEnd = $task->date_fin ?? $task->date_debut;
                return $taskEnd && Carbon::parse($taskEnd)->gt($newEnd);
            });

            if ($hasTaskAfterEnd) {
                return redirect()->back()->withErrors([
                    'date_fin' => 'La date de fin de la planification doit couvrir les dates des tâches existantes.',
                ]);
            }
        }

        $planification->update($validated);

        return redirect()->back()->with('message', 'Planification mise à jour.');
    }

    public function destroy(Planification $planification)
    {
        $planification->delete();

        return redirect()->back()->with('message', 'Planification supprimée.');
    }

    public function storeTask(Request $request, Planification $planification)
    {
        $validated = $request->validate([
            'libelle' => 'required|string|max:255',
            'description' => 'nullable|string',
            'responsable_id' => 'required|exists:responsables,id',
            'date_debut' => 'nullable|date',
            'date_fin' => 'nullable|date|after_or_equal:date_debut',
            'priorite' => 'required|in:Basse,Normale,Haute,Urgente',
            'status' => 'required|in:A faire,En cours,Terminé,Annulé',
            'ordre' => 'nullable|integer|min:1',
            'notes' => 'nullable|string',
        ]);

        if (!$this->areTaskDatesInsidePlanification($planification, $validated['date_debut'] ?? null, $validated['date_fin'] ?? null)) {
            return redirect()->back()->withErrors([
                'date_debut' => 'Les dates de la tâche doivent être incluses dans la période de la planification.',
                'date_fin' => 'Les dates de la tâche doivent être incluses dans la période de la planification.',
            ]);
        }

        $validated['planification_id'] = $planification->id;
        $validated['ordre'] = $validated['ordre'] ?? (($planification->tasks()->max('ordre') ?? 0) + 1);

        Task::create($validated);
        $this->syncPlanificationStatusFromTasks($planification->fresh());
        $this->syncTaskNotifications($planification->fresh()->tasks()->latest('id')->first());

        return redirect()->back()->with('message', 'Tâche ajoutée à la planification.');
    }

    public function updateTask(Request $request, Planification $planification, Task $task)
    {
        abort_unless($task->planification_id === $planification->id, 404);

        $validated = $request->validate([
            'libelle' => 'required|string|max:255',
            'description' => 'nullable|string',
            'responsable_id' => 'required|exists:responsables,id',
            'date_debut' => 'nullable|date',
            'date_fin' => 'nullable|date|after_or_equal:date_debut',
            'priorite' => 'required|in:Basse,Normale,Haute,Urgente',
            'status' => 'required|in:A faire,En cours,Terminé,Annulé',
            'ordre' => 'required|integer|min:1',
            'notes' => 'nullable|string',
        ]);

        if (!$this->areTaskDatesInsidePlanification($planification, $validated['date_debut'] ?? null, $validated['date_fin'] ?? null)) {
            return redirect()->back()->withErrors([
                'date_debut' => 'Les dates de la tâche doivent être incluses dans la période de la planification.',
                'date_fin' => 'Les dates de la tâche doivent être incluses dans la période de la planification.',
            ]);
        }

        $task->update($validated);
        $this->syncPlanificationStatusFromTasks($planification);
        $this->syncTaskNotifications($task->fresh());

        return redirect()->back()->with('message', 'Tâche mise à jour.');
    }

    public function destroyTask(Planification $planification, Task $task)
    {
        abort_unless($task->planification_id === $planification->id, 404);

        $task->delete();
        $this->syncPlanificationStatusFromTasks($planification);

        return redirect()->back()->with('message', 'Tâche supprimée.');
    }

    public function updateTaskStatus(Request $request, Planification $planification, Task $task)
    {
        abort_unless($task->planification_id === $planification->id, 404);

        $validated = $request->validate([
            'status' => 'required|in:A faire,En cours,Terminé,Annulé',
        ]);

        $task->update(['status' => $validated['status']]);
        $this->syncPlanificationStatusFromTasks($planification);
        $this->syncTaskNotifications($task->fresh());

        return redirect()->back()->with('message', 'Statut de la tâche mis à jour.');
    }

    private function areTaskDatesInsidePlanification(Planification $planification, ?string $taskStart, ?string $taskEnd): bool
    {
        $planStart = $planification->date_debut ? Carbon::parse($planification->date_debut)->startOfDay() : null;
        $planEnd = $planification->date_fin ? Carbon::parse($planification->date_fin)->endOfDay() : null;

        if (!$planStart && !$planEnd) {
            return true;
        }

        $taskStartDate = $taskStart ? Carbon::parse($taskStart)->startOfDay() : null;
        $taskEndDate = $taskEnd ? Carbon::parse($taskEnd)->endOfDay() : $taskStartDate;

        if ($planStart && $taskStartDate && $taskStartDate->lt($planStart)) {
            return false;
        }

        if ($planStart && $taskEndDate && $taskEndDate->lt($planStart)) {
            return false;
        }

        if ($planEnd && $taskStartDate && $taskStartDate->gt($planEnd)) {
            return false;
        }

        if ($planEnd && $taskEndDate && $taskEndDate->gt($planEnd)) {
            return false;
        }

        return true;
    }

    private function syncPlanificationStatusFromTasks(Planification $planification): void
    {
        $tasks = $planification->tasks()->get(['status']);
        if ($tasks->isEmpty()) {
            return;
        }

        $statuses = $tasks->pluck('status');

        if ($statuses->every(fn ($status) => $status === 'Terminé')) {
            $planification->update(['status' => 'Terminé']);
            return;
        }

        if ($statuses->contains('En cours')) {
            $planification->update(['status' => 'En cours']);
            return;
        }

        if ($statuses->contains('A faire')) {
            $planification->update(['status' => 'A faire']);
            return;
        }

        if ($statuses->every(fn ($status) => $status === 'Annulé')) {
            $planification->update(['status' => 'Annulé']);
        }
    }

    private function resolveTaskAlertLevel(Task $task): string
    {
        if (in_array($task->status, ['Terminé', 'Annulé'], true)) {
            return 'done';
        }

        if (!$task->date_fin) {
            return 'normal';
        }

        $today = Carbon::today();
        $end = Carbon::parse($task->date_fin)->startOfDay();

        if ($end->lt($today)) {
            return 'overdue';
        }

        if ($end->equalTo($today)) {
            return 'today';
        }

        if ($end->lte($today->copy()->addDays(3))) {
            return 'soon';
        }

        return 'normal';
    }

    private function syncTaskNotifications(?Task $task): void
    {
        if (!$task) {
            return;
        }

        $alertLevel = $this->resolveTaskAlertLevel($task);

        if (in_array($alertLevel, ['done', 'normal'], true)) {
            AppNotification::where('unique_key', 'like', "task_alert_{$task->id}_%")->delete();
            return;
        }

        $levelLabel = match ($alertLevel) {
            'overdue' => 'En retard',
            'today' => "A livrer aujourd'hui",
            'soon' => 'Echeance proche',
            default => 'Alerte',
        };

        $datePart = $task->date_fin ? Carbon::parse($task->date_fin)->format('Y-m-d') : 'none';
        $uniqueKey = "task_alert_{$task->id}_{$alertLevel}_{$datePart}";

        AppNotification::updateOrCreate(
            ['unique_key' => $uniqueKey],
            [
                'type' => 'task_alert',
                'title' => "Tache {$levelLabel}",
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
