<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use App\Models\Service;
use App\Models\Activity;
use App\Models\EntrepriseConfig;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Utilisateur Admin par défaut
        User::updateOrCreate(
            ['email' => 'admin@flr.com'],
            [
                'name' => 'Administrateur Kanzbile',
                'password' => Hash::make('password'),
            ]
        );

        // 2. Configuration de l'Entreprise
        EntrepriseConfig::updateOrCreate(
            ['nom' => 'Kanzbile Gestion'],
            [
                'ifu' => '3202612345678',
                'rccm' => 'RB/COT/26 B 12345',
                'responsable_legal' => 'Directeur Général',
                'logo' => 'images/logo.jpg',
                'contact_infos' => [
                    'telephone' => '+229 00 00 00 00',
                    'email' => 'contact@kanzbile.com',
                    'adresse' => 'Cotonou, Bénin'
                ]
            ]
        );

        // 3. Services et Activités
        $services = [
            'BTP' => [
                'Terrassement',
                'Gros Œuvre',
                'Second Œuvre',
                'Vente Matériaux'
            ],
            'Location' => [
                'Location Engins',
                'Location Camions',
                'Vente Matériel'
            ],
            'Services' => [
                'Expertise Technique',
                'Conseil & Formation'
            ]
        ];

        foreach ($services as $serviceName => $activities) {
            $service = Service::updateOrCreate(['nom' => $serviceName]);
            foreach ($activities as $activityName) {
                Activity::updateOrCreate([
                    'service_id' => $service->id,
                    'nom' => $activityName
                ]);
            }
        }
    }
}
