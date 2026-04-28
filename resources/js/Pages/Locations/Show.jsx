import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { 
    Key, 
    Calendar, 
    User, 
    Clock, 
    CreditCard, 
    ArrowLeft, 
    DollarSign, 
    Plus,
    CheckCircle2,
    AlertCircle,
    Building,
    FileText,
    Activity,
    Trash2
} from 'lucide-react';
import { useState } from 'react';

export default function Show({ location }) {
    const { data, setData, post, processing, reset } = useForm({
        montant: '',
        date_paiement: new Date().toISOString().split('T')[0],
        mode_paiement: 'Virement',
        reference: '',
        notes: '',
    });

    const [showPaymentModal, setShowPaymentModal] = useState(false);

    const totalPaid = location.payments?.reduce((sum, p) => sum + parseFloat(p.montant), 0) || 0;
    const totalDue = parseFloat(location.montant_total_prevu || 0);
    const balance = totalDue - totalPaid;

    const submitPayment = (e) => {
        e.preventDefault();
        post(route('payments.store', { type: 'location', id: location.id }), {
            onSuccess: () => {
                setShowPaymentModal(false);
                reset();
            }
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-4">
                    <Link href={route('locations.index')} className="p-2 rounded-xl bg-white dark:bg-slate-800 shadow-sm text-slate-400 hover:text-blue-600 transition-all">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div>
                        <h2 className="font-black text-xl text-slate-900 dark:text-white uppercase tracking-tight">{location.materiel_loue}</h2>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                            <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded">Réf: {location.id}</span>
                            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                            <span>{location.client?.nom_societe_ou_contact}</span>
                        </div>
                    </div>
                </div>
            }
            action={
                <button
                    onClick={() => setShowPaymentModal(true)}
                    className="btn-premium bg-emerald-600 hover:bg-emerald-700 px-6 py-2 rounded-xl text-white flex items-center gap-2 text-sm shadow-xl shadow-emerald-500/20 transition-all"
                >
                    <DollarSign className="h-4 w-4" />
                    Encaisser un règlement
                </button>
            }
        >
            <Head title={`Location - ${location.materiel_loue}`} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">Montant Prévu</p>
                            <p className="text-2xl font-black text-slate-900 dark:text-white">
                                {totalDue.toLocaleString()} <span className="text-xs text-slate-400 font-bold ml-1">CFA</span>
                            </p>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm border-l-emerald-500 border-l-4">
                            <p className="text-[10px] font-black uppercase text-emerald-600 tracking-widest mb-4">Total Encaissé</p>
                            <p className="text-2xl font-black text-emerald-600">
                                {totalPaid.toLocaleString()} <span className="text-xs text-slate-400 font-bold ml-1">CFA</span>
                            </p>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm border-l-red-500 border-l-4">
                            <p className="text-[10px] font-black uppercase text-red-500 tracking-widest mb-4">Reste à Percevoir</p>
                            <p className="text-2xl font-black text-red-500">
                                {balance.toLocaleString()} <span className="text-xs text-slate-400 font-bold ml-1">CFA</span>
                            </p>
                        </div>
                    </div>

                    {/* Timeline / Payments History */}
                    <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="px-8 py-6 border-b border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex justify-between items-center">
                            <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-tight text-sm">Historique des Règlements</h3>
                            <CreditCard className="h-5 w-5 text-slate-400" />
                        </div>
                        <div className="p-8">
                            {location.payments?.length > 0 ? (
                                <div className="space-y-6">
                                    {location.payments.map((payment, idx) => (
                                        <div key={payment.id} className="flex gap-4 relative">
                                            {idx !== location.payments.length - 1 && (
                                                <div className="absolute left-5 top-10 bottom-0 w-0.5 bg-slate-100 dark:bg-slate-800"></div>
                                            )}
                                            <div className="h-10 w-10 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 shrink-0 relative z-10 border-4 border-white dark:border-slate-900">
                                                <CheckCircle2 className="h-5 w-5" />
                                            </div>
                                            <div className="flex-1 bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-5 hover:bg-slate-100 transition-all">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <p className="font-extrabold text-slate-900 dark:text-white uppercase text-sm tracking-tight">
                                                            {parseFloat(payment.montant).toLocaleString()} CFA
                                                        </p>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                            {payment.mode_paiement} — {payment.reference || 'Sans réf.'}
                                                        </p>
                                                    </div>
                                                    <span className="text-[10px] font-black text-slate-400 bg-white dark:bg-slate-800 px-3 py-1 rounded-full shadow-sm">
                                                        {new Date(payment.date_paiement).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                {payment.notes && (
                                                    <p className="text-xs text-slate-500 italic mt-2">"{payment.notes}"</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-12 text-center">
                                    <AlertCircle className="h-10 w-10 text-slate-200 mx-auto mb-4" />
                                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Aucun paiement enregistré pour ce contrat.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-8">
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-8">
                        <div>
                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-6">Détails du Contrat</p>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="h-10 w-10 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                        <Calendar className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Durée de Location</p>
                                        <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                                            Du {new Date(location.date_debut).toLocaleDateString()} 
                                            {location.date_fin ? ` au ${new Date(location.date_fin).toLocaleDateString()}` : ' (Indéterminée)'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="h-10 w-10 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                        <User className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Responsable Suivi</p>
                                        <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{location.responsable?.nom}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="h-10 w-10 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                        <Clock className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Tarification</p>
                                        <p className="text-sm font-black text-blue-600">{parseFloat(location.tarif_unitaire).toLocaleString()} CFA / {location.unite_temps}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {location.notes && (
                            <div className="pt-8 border-t border-slate-50 dark:border-slate-800">
                                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">Notes Internes</p>
                                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-dotted border-slate-200 dark:border-slate-700">
                                    {location.notes}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal Paiement */}
            {showPaymentModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-emerald-50/50 dark:bg-emerald-900/10">
                            <div>
                                <h3 className="font-extrabold text-slate-900 dark:text-white text-xl">Encaisser Règlement</h3>
                                <p className="text-[10px] uppercase font-black text-emerald-600 mt-1">Saisie de versement client</p>
                            </div>
                            <button onClick={() => setShowPaymentModal(false)} className="h-10 w-10 flex items-center justify-center rounded-full bg-white dark:bg-slate-800 text-slate-400 hover:text-slate-600">×</button>
                        </div>
                        <form onSubmit={submitPayment} className="p-8 space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-slate-400 pl-1">Montant (CFA)</label>
                                    <input 
                                        type="number" 
                                        value={data.montant} 
                                        onChange={e => setData('montant', e.target.value)} 
                                        className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-lg font-black dark:text-white" 
                                        placeholder="0.00" 
                                        autoFocus 
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase text-slate-400 pl-1">Mode de paiement</label>
                                        <select 
                                            value={data.mode_paiement} 
                                            onChange={e => setData('mode_paiement', e.target.value)} 
                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-bold"
                                        >
                                            <option value="Virement">Virement</option>
                                            <option value="Espèces">Espèces</option>
                                            <option value="Chèque">Chèque</option>
                                            <option value="Mobile Money">Mobile Money</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase text-slate-400 pl-1">Date</label>
                                        <input 
                                            type="date" 
                                            value={data.date_paiement} 
                                            onChange={e => setData('date_paiement', e.target.value)} 
                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs" 
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-slate-400 pl-1">Référence Transaction</label>
                                    <input 
                                        type="text" 
                                        value={data.reference} 
                                        onChange={e => setData('reference', e.target.value)} 
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs" 
                                        placeholder="ID Mobile Money, N° Chèque..." 
                                    />
                                </div>
                            </div>
                            <button 
                                disabled={processing} 
                                className="w-full py-4 rounded-2xl bg-emerald-600 text-white font-black text-sm shadow-xl shadow-emerald-500/20"
                            >
                                Confirmer l'encaissement
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
