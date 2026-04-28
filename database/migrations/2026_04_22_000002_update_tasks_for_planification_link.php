<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->foreignId('planification_id')->nullable()->after('id')->constrained('planifications')->nullOnDelete();
            $table->date('date_debut')->nullable()->after('description');
            $table->date('date_fin')->nullable()->after('date_debut');
            $table->unsignedInteger('ordre')->default(1)->after('status');
            $table->text('notes')->nullable()->after('ordre');
        });

        DB::statement("ALTER TABLE tasks MODIFY priorite VARCHAR(50) NOT NULL DEFAULT 'Normale'");
        DB::statement("ALTER TABLE tasks MODIFY status VARCHAR(50) NOT NULL DEFAULT 'A faire'");

        DB::table('tasks')
            ->whereNull('date_fin')
            ->update(['date_fin' => DB::raw('date_echeance')]);
    }

    public function down(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->dropConstrainedForeignId('planification_id');
            $table->dropColumn(['date_debut', 'date_fin', 'ordre', 'notes']);
        });
    }
};
