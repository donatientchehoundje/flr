import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { 
    BarChart3, 
    Calendar, 
    Filter, 
    Download, 
    TrendingUp, 
    ArrowUpRight, 
    ArrowDownRight,
    Briefcase,
    Building,
    MapPin,
    Users,
    Wallet
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function StatisticsIndex({ stats, filters, referenceData }) {
    
    // Inertia form to handle filters
    const { data, setData, get, processing } = useForm({
        start_date: filters.start_date || stats.period.start,
        end_date: filters.end_date || stats.period.end,
        intervenant_type: filters.intervenant_type || '', // 'client' or 'fournisseur'
        intervenant_id: filters.intervenant_id || '',
        chantier_id: filters.chantier_id || '',
        service_id: filters.service_id || '',
        activity_id: filters.activity_id || '',
    });

    const handleFilterSubmit = (e) => {
        e.preventDefault();
        get(route('statistics.index'), { preserveState: true });
    };

    const handlePrint = () => {
        const query = new URLSearchParams({
            start_date: data.start_date,
            end_date: data.end_date,
            intervenant_type: data.intervenant_type,
            intervenant_id: data.intervenant_id,
            chantier_id: data.chantier_id,
            service_id: data.service_id,
            activity_id: data.activity_id
        }).toString();
        
        window.open(route('statistics.print') + '?' + query, '_blank');
    };

    // Format currency
    const formatMoney = (amount) => {
        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(amount);
    };

    return (
        <AuthenticatedLayout
            header="Pilotage & Statistiques"
            action={
                <button
                    onClick={handlePrint}
                    className="btn-premium bg-slate-900 border border-slate-700 px-6 py-2 rounded-xl text-white flex items-center gap-2 text-sm shadow-xl hover:scale-105 transition-all"
                >
                    <Download className="h-4 w-4" />
                    Rapport PDF
                </button>
            }
        >
            <Head title="Pilotage & Statistiques" />

            <div className="glass-card rounded-[3rem] p-8 min-h-[600px] mb-8">
                
                {/* FILTERS BAR */}
                <form onSubmit={handleFilterSubmit} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <Filter className="h-4 w-4 text-blue-500" />
                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">Filtres de Synthèse</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase">Date de début</label>
                            <input 
                                type="date" 
                                value={data.start_date}
                                onChange={e => setData('start_date', e.target.value)}
                                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 dark:text-white"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase">Date de fin</label>
                            <input 
                                type="date" 
                                value={data.end_date}
                                onChange={e => setData('end_date', e.target.value)}
                                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 dark:text-white"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase">Cible Intervenant</label>
                            <select 
                                value={data.intervenant_type}
                                onChange={e => setData('intervenant_type', e.target.value)}
                                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 dark:text-white"
                            >
                                <option value="">Tous les intervenants</option>
                                <option value="client">Clients</option>
                                <option value="fournisseur">Fournisseurs</option>
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase">Intervenant Spécifique</label>
                            <select 
                                value={data.intervenant_id}
                                onChange={e => setData('intervenant_id', e.target.value)}
                                disabled={!data.intervenant_type}
                                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm disabled:opacity-50"
                            >
                                <option value="">Sélectionnez...</option>
                                {data.intervenant_type === 'client' && referenceData.clients.map(c => <option key={c.id} value={c.id}>{c.nom_societe_ou_contact}</option>)}
                                {data.intervenant_type === 'fournisseur' && referenceData.fournisseurs.map(f => <option key={f.id} value={f.id}>{f.nom_societe_ou_contact}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase">Chantier / Projet</label>
                            <select 
                                value={data.chantier_id}
                                onChange={e => setData('chantier_id', e.target.value)}
                                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm"
                            >
                                <option value="">Tous les chantiers</option>
                                {referenceData.chantiers.map(chantier => (
                                    <option key={chantier.id} value={chantier.id}>{chantier.nom_chantier}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase">Domaine / Service</label>
                            <select 
                                value={data.service_id}
                                onChange={e => {
                                    setData({ ...data, service_id: e.target.value, activity_id: '' });
                                }}
                                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm"
                            >
                                <option value="">Tous les services</option>
                                {referenceData.services.map(service => (
                                    <option key={service.id} value={service.id}>{service.nom}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase">Métier / Activité</label>
                            <select 
                                value={data.activity_id}
                                onChange={e => setData('activity_id', e.target.value)}
                                disabled={!data.service_id}
                                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm disabled:opacity-50"
                            >
                                <option value="">Toutes les activités</option>
                                {referenceData.services
                                    .find(s => s.id.toString() === data.service_id.toString())
                                    ?.activities.map(activity => (
                                        <option key={activity.id} value={activity.id}>{activity.nom}</option>
                                    ))
                                }
                            </select>
                        </div>
                    </div>
                    
                    <div className="mt-4 flex justify-end">
                        <button type="submit" disabled={processing} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-2">
                            {processing && <span className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>}
                            Générer les Statistiques
                        </button>
                    </div>
                </form>

                {/* KPI MAIN DASHBOARD */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    
                    {/* TOTAL CA */}
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-3xl shadow-xl shadow-blue-500/10 text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:scale-110 transition-transform duration-500">
                            <Wallet className="w-32 h-32" />
                        </div>
                        <div className="flex items-center gap-2 mb-6">
                            <div className="h-10 w-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                                <TrendingUp className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-xs font-black uppercase tracking-widest text-blue-100">C.A. PRÉVISIONNEL</span>
                        </div>
                        <h2 className="text-4xl font-black tracking-tight mb-2 relative z-10">
                            {formatMoney(stats.kpis.global.total_volume)}
                        </h2>
                        <div className="flex items-center gap-4 text-xs font-bold text-blue-200 uppercase tracking-wider relative z-10">
                            <span>Livraisons : {formatMoney(stats.kpis.livraisons.total_facture)}</span>
                            <span>•</span>
                            <span>Locations : {formatMoney(stats.kpis.locations.total_prevu)}</span>
                        </div>
                    </div>

                    {/* ENCAISSE */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="h-10 w-10 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl flex items-center justify-center">
                                <ArrowUpRight className="h-5 w-5 text-emerald-600" />
                            </div>
                            <span className="text-xs font-black uppercase tracking-widest text-slate-500">Total Encaissé</span>
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
                            {formatMoney(stats.kpis.global.total_encaisse)}
                        </h2>
                        
                        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 mt-6">
                            <div 
                                className="bg-emerald-500 h-2 rounded-full transition-all" 
                                style={{ width: `${stats.kpis.global.total_volume > 0 ? (stats.kpis.global.total_encaisse / stats.kpis.global.total_volume) * 100 : 0}%` }}
                            ></div>
                        </div>
                        <p className="text-xs text-slate-400 mt-2 font-bold select-none">
                            Taux de recouvrement : {stats.kpis.global.total_volume > 0 ? Math.round((stats.kpis.global.total_encaisse / stats.kpis.global.total_volume) * 100) : 0}%
                        </p>
                    </div>

                    {/* RESTE A PAYER */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="h-10 w-10 bg-rose-50 dark:bg-rose-500/10 rounded-xl flex items-center justify-center">
                                <ArrowDownRight className="h-5 w-5 text-rose-600" />
                            </div>
                            <span className="text-xs font-black uppercase tracking-widest text-slate-500">Reste à Payer / Dettes</span>
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
                            {formatMoney(stats.kpis.global.total_restant)}
                        </h2>
                        
                        <div className="mt-6 flex flex-col gap-2">
                            <div className="flex justify-between items-center text-xs">
                                <span className="font-bold text-slate-400">Sur Livraisons</span>
                                <span className="font-black text-rose-500">{formatMoney(stats.kpis.livraisons.reste_a_payer)}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="font-bold text-slate-400">Sur Locations</span>
                                <span className="font-black text-rose-500">{formatMoney(stats.kpis.locations.reste_a_payer)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* VOLUME METRICS */}
                <h3 className="font-extrabold text-slate-900 dark:text-white text-lg mb-4 ml-2">Analyse Volumétrique</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Livraisons effectuées</p>
                            <h4 className="text-3xl font-black text-slate-900 dark:text-white">{stats.kpis.livraisons.count} <span className="text-sm text-slate-400">voyages</span></h4>
                        </div>
                        <div className="h-16 w-16 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-sm text-blue-600">
                            <MapPin className="h-8 w-8" />
                        </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Engins en location</p>
                            <h4 className="text-3xl font-black text-slate-900 dark:text-white">{stats.kpis.locations.count} <span className="text-sm text-slate-400">contrats</span></h4>
                        </div>
                        <div className="h-16 w-16 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-sm text-amber-500">
                            <Briefcase className="h-8 w-8" />
                        </div>
                    </div>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}
