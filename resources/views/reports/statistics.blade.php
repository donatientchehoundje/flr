<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Rapport d'Activité et Statistiques</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            color: #333;
            margin: 0;
            padding: 0;
            font-size: 11pt;
            background-color: #f9fafb;
        }
        .page {
            max-width: 210mm;
            margin: 20px auto;
            background: white;
            padding: 30mm 20mm;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        /* Print Rules */
        @media print {
            body { background: white; margin: 0; }
            .page { margin: 0; padding: 15mm; box-shadow: none; max-width: 100%; border: none; }
            .no-print { display: none !important; }
            @page { margin: 10mm; }
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 2px solid #2563eb;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .logo-placeholder {
            font-size: 24pt;
            font-weight: 900;
            color: #2563eb;
            letter-spacing: -1px;
        }
        .header-info {
            text-align: right;
            font-size: 10pt;
            color: #64748b;
        }
        .title-box {
            text-align: center;
            margin-bottom: 30px;
            padding: 15px;
            background: #eff6ff;
            border-radius: 8px;
        }
        h1 { margin: 0; font-size: 18pt; color: #1e3a8a; font-weight: 800; }
        .period { font-size: 10pt; color: #3b82f6; font-weight: bold; margin-top: 5px; }

        .kpi-grid {
            display: flex;
            gap: 15px;
            margin-bottom: 30px;
        }
        .kpi-card {
            flex: 1;
            padding: 15px;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            text-align: center;
        }
        .kpi-title { font-size: 9pt; color: #64748b; text-transform: uppercase; font-weight: bold; margin-bottom: 5px; }
        .kpi-value { font-size: 16pt; color: #0f172a; font-weight: 900; }

        table {
            width: 100%;
            border-collapse: collapse;
            font-size: 9pt;
            margin-bottom: 30px;
        }
        th, td {
            padding: 10px;
            text-align: left;
            border-bottom: 1px solid #e2e8f0;
        }
        th {
            background-color: #f1f5f9;
            color: #475569;
            font-weight: bold;
            text-transform: uppercase;
            font-size: 8pt;
            letter-spacing: 0.5px;
        }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        
        .section-title {
            font-size: 14pt;
            color: #1e293b;
            font-weight: bold;
            margin-bottom: 15px;
            padding-bottom: 5px;
            border-bottom: 1px solid #cbd5e1;
        }

        .status-badge {
            display: inline-block;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 8pt;
            font-weight: bold;
        }
        .status-encours { background: #fef08a; color: #854d0e; }
        .status-termine { background: #bbf7d0; color: #166534; }
        
        .footer {
            margin-top: 50px;
            text-align: center;
            font-size: 8pt;
            color: #94a3b8;
            border-top: 1px solid #e2e8f0;
            padding-top: 15px;
        }

        /* Action Buttons */
        .controls {
            text-align: center;
            margin: 20px 0;
            padding: 10px;
            background: white;
            border-bottom: 1px solid #e2e8f0;
            position: sticky;
            top: 0;
            z-index: 100;
        }
        .btn {
            padding: 10px 20px;
            background: #2563eb;
            color: white;
            border: none;
            border-radius: 5px;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0 4px 6px rgba(37, 99, 235, 0.2);
            transition: background 0.2s;
        }
        .btn:hover { background: #1d4ed8; }
        .btn-back { background: #64748b; margin-right: 10px; box-shadow: 0 4px 6px rgba(100, 116, 139, 0.2); }
        .btn-back:hover { background: #475569; }
    </style>
</head>
<body>

    <div class="controls no-print">
        <button class="btn btn-back" onclick="window.close()">Fermer</button>
        <button class="btn" onclick="window.print()">🖨️ Imprimer en PDF</button>
        <p style="font-size:8pt;color:#64748b;margin-top:5px;">Astuce: Dans la fenêtre d'impression, choisissez "Enregistrer au format PDF". Activez "Graphiques d'arrière-plan" pour les couleurs.</p>
    </div>

    <div class="page">
        <!-- HEADER -->
        <div class="header">
            <div class="logo-placeholder">FLR OPS</div>
            <div class="header-info">
                Généré le: {{ \Carbon\Carbon::now()->format('d/m/Y à H:i') }}<br>
                Service de Reporting
            </div>
        </div>

        <!-- TITLE -->
        <div class="title-box">
            <h1>RAPPORT D'ACTIVITÉ PÉRIODIQUE</h1>
            <div class="period">
                Période: du {{ \Carbon\Carbon::parse($startDate)->format('d/m/Y') }} au {{ \Carbon\Carbon::parse($endDate)->format('d/m/Y') }}
            </div>
        </div>

        @php
            $totalLivraisons = $livraisons->sum('montant_total_facture');
            $totalLocations = $locations->sum('montant_total_prevu');
        @endphp

        <!-- KPI GRID -->
        <div class="kpi-grid">
            <div class="kpi-card">
                <div class="kpi-title">Chiffre d'Affaires Global</div>
                <div class="kpi-value" style="color: #2563eb;">{{ number_format($totalLivraisons + $totalLocations, 0, ',', ' ') }} F</div>
            </div>
            <div class="kpi-card">
                <div class="kpi-title">Volume CA Livraisons</div>
                <div class="kpi-value">{{ number_format($totalLivraisons, 0, ',', ' ') }} F</div>
            </div>
            <div class="kpi-card">
                <div class="kpi-title">Volume CA Locations</div>
                <div class="kpi-value">{{ number_format($totalLocations, 0, ',', ' ') }} F</div>
            </div>
        </div>

        <!-- LIVRAISONS SECTION -->
        <div class="section-title">Détail des Livraisons ({{ $livraisons->count() }})</div>
        @if($livraisons->count() > 0)
        <table>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>N° B.L</th>
                    <th>Client / Fournisseur</th>
                    <th>Chantier</th>
                    <th class="text-right">Montant</th>
                    <th class="text-right">Payé</th>
                </tr>
            </thead>
            <tbody>
                @foreach($livraisons as $livraison)
                <tr>
                    <td>{{ \Carbon\Carbon::parse($livraison->date_livraison_prevue)->format('d/m/Y') }}</td>
                    <td><b>{{ $livraison->reference_bl ?? 'N/A' }}</b></td>
                    <td>
                        {{ $livraison->chantier->client->nom_societe_ou_contact ?? 'N/A' }}<br>
                        <span style="font-size:7pt;color:#94a3b8;">Frs: {{ $livraison->fournisseur->nom_societe_ou_contact ?? 'N/A' }}</span>
                    </td>
                    <td>{{ $livraison->chantier->libelle ?? 'Sur site' }}</td>
                    <td class="text-right font-bold">{{ number_format($livraison->montant_total_retenu_client, 0, ',', ' ') }} F</td>
                    <td class="text-right text-green-600">{{ number_format($livraison->payments->sum('amount'), 0, ',', ' ') }} F</td>
                </tr>
                @endforeach
            </tbody>
        </table>
        @else
        <p style="text-align:center;font-size:9pt;color:#64748b;font-style:italic;">Aucune livraison sur la période sélectionnée.</p>
        @endif

        <!-- LOCATIONS SECTION -->
        <br>
        <div class="section-title">Détail des Locations d'Engins ({{ $locations->count() }})</div>
        @if($locations->count() > 0)
        <table>
            <thead>
                <tr>
                    <th>Début</th>
                    <th>Matériel / Engin</th>
                    <th>Chantier / Client</th>
                    <th>Durée</th>
                    <th class="text-right">Tarif U.</th>
                    <th class="text-right">Montant Total</th>
                </tr>
            </thead>
            <tbody>
                @foreach($locations as $location)
                <tr>
                    <td>{{ \Carbon\Carbon::parse($location->date_debut)->format('d/m/Y') }}</td>
                    <td><b>{{ $location->engin }}</b></td>
                    <td>
                        {{ $location->chantier->libelle ?? 'Sur site' }}<br>
                        <span style="font-size:7pt;color:#94a3b8;">{{ $location->chantier->client->nom_societe_ou_contact ?? '' }}</span>
                    </td>
                    <td>
                        {{ $location->duree_estimee }} 
                        {{ $location->unite_tarification === 'jour' ? 'j' : ($location->unite_tarification === 'semaine' ? 'sem' : 'mois') }}
                    </td>
                    <td class="text-right">{{ number_format($location->tarif_unitaire, 0, ',', ' ') }} F</td>
                    <td class="text-right font-bold">{{ number_format($location->montant_total_prevu, 0, ',', ' ') }} F</td>
                </tr>
                @endforeach
            </tbody>
        </table>
        @else
        <p style="text-align:center;font-size:9pt;color:#64748b;font-style:italic;">Aucune location d'engin sur la période sélectionnée.</p>
        @endif

        <div class="footer">
            Généré automatiquement par le système FLR Enterprise • 100% Confidentiel.
        </div>
    </div>

</body>
</html>
