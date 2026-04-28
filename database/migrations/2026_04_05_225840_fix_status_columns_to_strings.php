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
        Schema::table('chantiers', function (Blueprint $table) {
            $table->string('status')->default('en_cours')->change();
        });

        Schema::table('livraisons', function (Blueprint $table) {
            $table->string('status')->default('en_attente')->change();
        });

        Schema::table('rental_contracts', function (Blueprint $table) {
            $table->string('status')->default('en_cours')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('chantiers', function (Blueprint $table) {
            $table->enum('status', ['En préparation', 'En cours', 'Terminé', 'Suspendu'])->default('En cours')->change();
        });
    }
};
