<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('rental_contracts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained()->onDelete('cascade');
            $table->foreignId('activity_id')->constrained()->onDelete('cascade');
            $table->foreignId('responsable_id')->constrained()->onDelete('cascade');
            $table->string('materiel_loue');
            $table->date('date_debut');
            $table->date('date_fin')->nullable();
            $table->decimal('tarif_unitaire', 15, 2);
            $table->enum('unite_temps', ['jour', 'semaine', 'mois'])->default('jour');
            $table->decimal('montant_total_prevu', 15, 2)->default(0);
            $table->enum('status', ['En cours', 'Terminé', 'Annulé', 'En attente'])->default('En attente');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rental_contracts');
    }
};
