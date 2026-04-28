<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('planifications', function (Blueprint $table) {
            $table->id();
            $table->string('titre');
            $table->text('description')->nullable();
            $table->string('type')->default('interne');
            $table->foreignId('responsable_id')->constrained()->onDelete('cascade');
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->date('date_debut')->nullable();
            $table->date('date_fin')->nullable();
            $table->string('priorite')->default('Normale');
            $table->string('status')->default('A faire');
            $table->text('notes')->nullable();
            $table->nullableMorphs('plannable');
            $table->softDeletes();
            $table->timestamps();

            $table->index(['status', 'date_fin']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('planifications');
    }
};
