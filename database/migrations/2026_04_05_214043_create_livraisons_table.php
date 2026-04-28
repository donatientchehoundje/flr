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
        Schema::create('livraisons', function (Blueprint $table) {
            $table->id();
            $table->foreignId('chantier_id')->constrained()->onDelete('cascade');
            $table->foreignId('fournisseur_id')->constrained()->onDelete('cascade');
            $table->foreignId('responsable_id')->constrained()->onDelete('cascade');
            $table->string('reference_bl')->nullable();
            $table->date('date_livraison_prevue')->nullable();
            $table->decimal('quantite_commandee', 15, 2)->default(0);
            $table->string('unite')->nullable(); // ex: m3, tonne, kg
            $table->decimal('montant_total_fournisseur', 15, 2)->default(0);
            $table->decimal('montant_total_retenu_client', 15, 2)->default(0);
            $table->enum('status', ['En attente', 'En cours', 'Livré partiellement', 'Livré', 'Annulé'])->default('En attente');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('livraisons');
    }
};
