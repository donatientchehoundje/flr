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
        Schema::table('partial_deliveries', function (Blueprint $table) {
            $table->dropColumn(['quantite_livree', 'date_livraison_effective', 'status']);
        });

        Schema::table('partial_deliveries', function (Blueprint $table) {
            $table->decimal('quantite', 15, 2)->after('livraison_id')->default(0);
            $table->string('bl_numero')->after('quantite')->nullable();
            $table->date('date_reception')->after('bl_numero')->nullable();
            $table->string('status')->after('date_reception')->default('conforme');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Pas de retour arrière nécessaire car c'est un correctif de structure initial
    }
};
