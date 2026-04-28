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
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('responsable_id')->constrained()->onDelete('cascade');
            $table->string('libelle');
            $table->text('description')->nullable();
            $table->date('date_echeance')->nullable();
            $table->enum('priorite', ['Basse', 'Moyenne', 'Haute', 'Critique'])->default('Moyenne');
            $table->enum('status', ['A faire', 'En cours', 'Terminé', 'En attente'])->default('A faire');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
