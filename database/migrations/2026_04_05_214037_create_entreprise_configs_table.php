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
        Schema::create('entreprise_configs', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->string('ifu')->nullable();
            $table->string('rccm')->nullable();
            $table->string('responsable_legal')->nullable();
            $table->string('logo')->nullable();
            $table->json('contact_infos')->nullable(); // telephone, email, adresse, etc.
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('entreprise_configs');
    }
};
