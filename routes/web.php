<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

use App\Http\Controllers\DashboardController;

Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])->name('dashboard');

use App\Http\Controllers\ServiceController;
use App\Http\Controllers\ActivityController;
use App\Http\Controllers\EntrepriseConfigController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\FournisseurController;
use App\Http\Controllers\PartenaireController;
use App\Http\Controllers\ResponsableController;
use App\Models\PartialDelivery;
use App\Http\Controllers\ChantierController;
use App\Http\Controllers\LivraisonController;
use App\Http\Controllers\PartialDeliveryController;
use App\Http\Controllers\RentalContractController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\PlanificationController;
use App\Http\Controllers\NotificationController;

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Entreprise Settings
    Route::get('/settings', [EntrepriseConfigController::class, 'edit'])->name('settings.edit');
    Route::patch('/settings', [EntrepriseConfigController::class, 'update'])->name('settings.update');

    // Services & Activities
    Route::resource('services', ServiceController::class);
    Route::post('services/{service}/activities', [ActivityController::class, 'store'])->name('activities.store');
    Route::delete('activities/{activity}', [ActivityController::class, 'destroy'])->name('activities.destroy');

    // Intervenants (Annuaire)
    Route::get('/intervenants', [ClientController::class, 'index'])->name('intervenants.index');
    Route::resource('clients', ClientController::class)->except(['index']);
    Route::resource('fournisseurs', FournisseurController::class);
    Route::resource('partenaires', PartenaireController::class);
    Route::resource('responsables', ResponsableController::class);

    // Chantiers
    Route::resource('chantiers', ChantierController::class);

    // Livraisons & BL
    Route::resource('livraisons', LivraisonController::class);
    Route::post('/livraisons/{livraison}/partials', [PartialDeliveryController::class, 'store'])->name('livraisons.partials.store');

    // Locations (Engins)
    Route::resource('locations', RentalContractController::class);

    // Planifications et tâches associées
    Route::resource('planifications', PlanificationController::class)->except(['create', 'edit', 'show']);
    Route::post('/planifications/{planification}/tasks', [PlanificationController::class, 'storeTask'])->name('planifications.tasks.store');
    Route::patch('/planifications/{planification}/tasks/{task}', [PlanificationController::class, 'updateTask'])->name('planifications.tasks.update');
    Route::patch('/planifications/{planification}/tasks/{task}/status', [PlanificationController::class, 'updateTaskStatus'])->name('planifications.tasks.status');
    Route::delete('/planifications/{planification}/tasks/{task}', [PlanificationController::class, 'destroyTask'])->name('planifications.tasks.destroy');

    // Paiements Polymorphiques
    Route::post('/payments/{type}/{id}', [PaymentController::class, 'store'])->name('payments.store');

    // Statistiques Avancées & Reporting
    Route::get('/statistics', [\App\Http\Controllers\StatisticsController::class, 'index'])->name('statistics.index');
    Route::get('/statistics/print', [\App\Http\Controllers\StatisticsController::class, 'print'])->name('statistics.print');

    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::patch('/notifications/{notification}/read', [NotificationController::class, 'markAsRead'])->name('notifications.read');
    Route::patch('/notifications/read-all', [NotificationController::class, 'markAllAsRead'])->name('notifications.readAll');
});

require __DIR__.'/auth.php';
