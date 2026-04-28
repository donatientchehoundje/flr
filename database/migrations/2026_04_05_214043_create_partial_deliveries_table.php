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
        Schema::create('partial_deliveries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('livraison_id')->constrained()->onDelete('cascade');
            $table->date('date_livraison_effective');
            $table->decimal('quantite_livree', 15, 2);
            $table->enum('status', ['Conforme', 'Non-conforme', 'Litige'])->default('Conforme');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('partial_deliveries');
    }
};
