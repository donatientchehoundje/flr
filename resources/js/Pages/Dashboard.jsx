import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { 
    Construction, 
    Truck, 
    CreditCard, 
    AlertCircle, 
    ArrowUpRight, 
    TrendingUp,
    Clock,
    DollarSign,
    Package,
    ChevronRight,
    Wallet,
    ArrowDownRight,
    Activity as ActivityIcon
} from 'lucide-react';

const StatCard = ({ title, value, subvalue, icon: Icon, color, trend }) => (
    <div className="flex flex-col gap-4 p-6 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-xl hover:shadow-blue-500/5 group">
        <div className="flex justify-between items-start">
            <div className={`p-4 rounded-2xl bg-${color}-50 dark:bg-${color}-500/10 text-${color}-600 dark:text-${color}-400 group-hover:scale-110 transition-transform`}>
                <Icon className="h-6 w-6" />
            </div>
            {trend && (
                <div className="flex items-center gap-1 text-[10px] font-black bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-full uppercase tracking-tighter">
                    <ActivityIcon className="h-3 w-3" />
                    <span>Live</span>
                </div>
            )}
        </div>
        <div>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none mb-2">{title}</p>
            <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white truncate">
                {value}
            </h3>
            {subvalue && <p className="text-[10px] font-bold text-slate-500 dark:text-slate-500 mt-1 truncate uppercase">{subvalue}</p>}
        </div>
    </div>
);

export default function Dashboard({ stats, recent_payments, recent_bl }) {
    const totalCa = stats.ca_prevu || 0;
    const caRatio = totalCa > 0 ? (stats.ca_encaisse / totalCa) * 100 : 0;

    return (
        <AuthenticatedLayout
            header="Cockpit Opérationnel"
        >
            <Head title="Tableau de Bord" />

            <div className="space-y-8 animate-in fade-in duration-700">
                {/* Statistics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard 
                        title="Chantiers Actifs" 
                        value={stats.chantiers_actifs} 
                        subvalue="En cours de réalisation"
                        icon={Construction} 
                        color="blue" 
                        trend={true}
                    />
                    <StatCard 
                        title="Commandes/Livraisons" 
                        value={stats.livraisons_attente} 
                        subvalue="En attente de réception"
                        icon={Truck} 
                        color="orange" 
                    />
                    <StatCard 
                        title="Encaissements Locations" 
                        value={`${stats.ca_encaisse.toLocaleString()} CFA`} 
                        subvalue={`Sur ${stats.ca_prevu.toLocaleString()} prévus`}
                        icon={TrendingUp} 
                        color="emerald" 
                    />
                    <StatCard 
                        title="Dettes Fournisseurs" 
                        value={`${stats.dettes_fournisseurs.toLocaleString()} CFA`} 
                        subvalue="Reste à régler"
                        icon={AlertCircle} 
                        color="red" 
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Activity Feed */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-black text-slate-900 dark:text-white">Flux d'Activité</h3>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Temps réel</p>
                            </div>
                            <Link href={route('livraisons.index')} className="text-[10px] font-black text-blue-600 uppercase hover:underline">Voir logistique</Link>
                        </div>

                        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-2 overflow-hidden shadow-sm">
                            <div className="divide-y divide-slate-50 dark:divide-slate-800">
                                {recent_bl.map((bl) => (
                                    <div key={`bl-${bl.id}`} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-[1.5rem] transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-2xl bg-blue-50 dark:bg-blue-500/10 flex flex-col items-center justify-center">
                                                <Package className="h-5 w-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-slate-900 dark:text-white leading-tight">
                                                    Réception de {bl.quantite} {bl.livraison?.unite}
                                                </p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase">
                                                    Chantier: {bl.livraison?.chantier?.libelle} — BL: {bl.bl_numero}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[9px] font-black text-slate-500 uppercase">{new Date(bl.date_reception).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                ))}

                                {recent_payments.map((p) => (
                                    <div key={`p-${p.id}`} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-[1.5rem] transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex flex-col items-center justify-center">
                                                <Wallet className="h-5 w-5 text-emerald-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-slate-900 dark:text-white leading-tight">
                                                    Règlement de {parseFloat(p.montant).toLocaleString()} FCFA
                                                </p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase">
                                                    Mode: {p.mode_paiement} — {p.payable_type === 'App\\Models\\Livraison' ? 'Sortie Fournisseur' : 'Encaissement Location'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[9px] font-black text-slate-500 uppercase">{new Date(p.date_paiement).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                ))}

                                {[...recent_bl, ...recent_payments].length === 0 && (
                                    <div className="py-20 text-center">
                                        <ActivityIcon className="h-10 w-10 text-slate-200 mx-auto mb-2" />
                                        <p className="text-xs text-slate-400 font-bold uppercase">Aucune activité récente</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Financial Cockpit */}
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-black text-slate-900 dark:text-white">Santé Financière</h3>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">KPIs Locations</p>
                        </div>
                        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <TrendingUp className="h-24 w-24" />
                            </div>
                            <div className="relative z-10">
                                <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] mb-2">Performance Collections</p>
                                <h4 className="text-4xl font-black tracking-tighter mb-8">{stats.ca_encaisse.toLocaleString()} <span className="text-sm font-bold text-slate-400 uppercase">CFA</span></h4>
                                
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                                            <span>Couverture CA Prévu</span>
                                            <span className="text-white">{Math.round(caRatio)}%</span>
                                        </div>
                                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-emerald-500 transition-all duration-1000 shadow-[0_0_10px_rgba(16,185,129,0.5)]" 
                                                style={{ width: `${caRatio}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-6 grid grid-cols-1 gap-3">
                                        <Link href={route('locations.index')} className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 flex items-center justify-center gap-2 text-xs font-black uppercase transition-all">
                                            <ArrowUpRight className="h-4 w-4" />
                                            Parc Matériel
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Action */}
                        <div className="p-6 bg-blue-600 rounded-[2.5rem] text-white flex items-center justify-between group cursor-pointer hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20">
                            <div>
                                <p className="text-xs font-black uppercase">Nouveau Chantier ?</p>
                                <p className="text-[10px] opacity-80">Initialiser un projet</p>
                            </div>
                            <Link href={route('chantiers.index')} className="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center group-hover:translate-x-1 transition-transform">
                                <ChevronRight className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
