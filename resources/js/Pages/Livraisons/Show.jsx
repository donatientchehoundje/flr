import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { 
    Truck, 
    ChevronLeft, 
    Plus, 
    Calendar, 
    Package, 
    FileText, 
    Trash2, 
    CheckCircle2, 
    History,
    MoreVertical,
    User,
    Building,
    MapPin,
    AlertCircle,
    CreditCard,
    DollarSign,
    Wallet,
    Smartphone
} from 'lucide-react';
import { useState } from 'react';

export default function Show({ livraison }) {
    // Form for BL
    const blForm = useForm({
        quantite: '',
        bl_numero: '',
        date_reception: new Date().toISOString().split('T')[0],
        notes: '',
    });

    // Form for Payment
    const paymentForm = useForm({
        montant: '',
        date_paiement: new Date().toISOString().split('T')[0],
        mode_paiement: 'Virement',
        reference: '',
        notes: '',
    });

    const [showAddBL, setShowAddBL] = useState(false);
    const [showAddPayment, setShowAddPayment] = useState(false);

    const submitBL = (e) => {
        e.preventDefault();
        blForm.post(route('livraisons.partials.store', livraison.id), {
            onSuccess: () => {
                setShowAddBL(false);
                blForm.reset();
            }
        });
    };

    const submitPayment = (e) => {
        e.preventDefault();
        paymentForm.post(route('payments.store', { type: 'livraison', id: livraison.id }), {
            onSuccess: () => {
                setShowAddPayment(false);
                paymentForm.reset();
            }
        });
    };

    const progress = Math.min((livraison.total_recu / livraison.quantite_commandee) * 100, 100);
    const totalPaid = livraison.payments?.reduce((sum, p) => sum + parseFloat(p.montant), 0) || 0;
    const balance = parseFloat(livraison.montant_total_fournisseur || 0) - totalPaid;

    const getPaymentIcon = (mode) => {
        switch(mode) {
            case 'Virement': return <CreditCard className="h-4 w-4" />;
            case 'Espèces': return <Wallet className="h-4 w-4" />;
            case 'Mobile Money': return <Smartphone className="h-4 w-4" />;
            default: return <FileText className="h-4 w-4" />;
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-4">
                    <Link href={route('livraisons.index')} className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        <ChevronLeft className="h-4 w-4" />
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-600 text-white shadow-lg shadow-blue-600/20">
                            <Truck className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black dark:text-white leading-none">Détail Livraison</h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">N° {livraison.id} — {livraison.chantier?.libelle}</p>
                        </div>
                    </div>
                </div>
            }
            action={
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowAddPayment(true)}
                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-6 py-2 rounded-xl text-slate-600 dark:text-slate-300 flex items-center gap-2 text-sm shadow-sm hover:bg-slate-50 transition-all font-bold"
                    >
                        <DollarSign className="h-4 w-4" />
                        Régler
                    </button>
                    {livraison.status !== 'termine' && (
                        <button
                            onClick={() => setShowAddBL(true)}
                            className="btn-premium gradient-primary px-6 py-2 rounded-xl text-white flex items-center gap-2 text-sm shadow-xl shadow-blue-500/20"
                        >
                            <Plus className="h-4 w-4" />
                            Réceptionner BL
                        </button>
                    )}
                </div>
            }
        >
            <Head title={`Livraison #${livraison.id}`} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Information Columns */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Status & Progress Card */}
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-xs font-black uppercase tracking-widest text-slate-400">État d'avancement</span>
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg uppercase ${livraison.status === 'termine' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
                                {livraison.status}
                            </span>
                        </div>
                        
                        <div className="text-center mb-6">
                            <div className="inline-flex items-center justify-center relative mb-4">
                                <svg className="h-24 w-24">
                                    <circle className="text-slate-100 dark:text-slate-800" strokeWidth="6" stroke="currentColor" fill="transparent" r="40" cx="48" cy="48" />
                                    <circle className="text-blue-600" strokeWidth="6" strokeDasharray={2 * Math.PI * 40} strokeDashoffset={2 * Math.PI * 40 * (1 - progress / 100)} strokeLinecap="round" stroke="currentColor" fill="transparent" r="40" cx="48" cy="48" />
                                </svg>
                                <span className="absolute text-xl font-black tracking-tight">{Math.round(progress)}%</span>
                            </div>
                            <h4 className="text-2xl font-black">{livraison.total_recu} <span className="text-sm font-bold text-slate-400">{livraison.unite}</span></h4>
                            <p className="text-xs text-slate-400 font-bold uppercase">sur {livraison.quantite_commandee} commandés</p>
                        </div>
                    </div>

                    {/* Financial Summary Card */}
                    <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl shadow-slate-900/20 space-y-6 overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <DollarSign className="h-24 w-24" />
                        </div>
                        <div className="relative z-10">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Résumé Financier</p>
                            <h4 className="text-3xl font-black">{livraison.montant_total_fournisseur?.toLocaleString()} <span className="text-sm font-bold text-slate-400">FCFA</span></h4>
                            <p className="text-[10px] font-bold text-blue-400 uppercase mt-1">Montant Total Facturé</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 relative z-10">
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                                <p className="text-[9px] font-black uppercase text-slate-500 mb-1">Déjà Payé</p>
                                <p className="text-lg font-black text-emerald-400">{totalPaid.toLocaleString()}</p>
                            </div>
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                                <p className="text-[9px] font-black uppercase text-slate-500 mb-1">Reste à Payer</p>
                                <p className="text-lg font-black text-orange-400">{balance.toLocaleString()}</p>
                            </div>
                        </div>

                        {balance <= 0 && (
                            <div className="bg-emerald-500/20 p-3 rounded-xl flex items-center gap-2 text-emerald-400 border border-emerald-500/30">
                                <CheckCircle2 className="h-4 w-4" />
                                <span className="text-[10px] font-black uppercase tracking-wider">Solde réglé</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Content - History of BLs & Payments */}
                <div className="lg:col-span-2 space-y-8">
                    {/* History BL */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-black dark:text-white flex items-center gap-2">
                                <History className="h-5 w-5 text-blue-600" />
                                Historique des Réceptions
                            </h3>
                            <button onClick={() => setShowAddBL(true)} className="text-xs font-black text-blue-600 uppercase hover:underline">+ Ajouter BL</button>
                        </div>

                        {showAddBL && (
                            <form onSubmit={submitBL} className="bg-white dark:bg-slate-900 border-2 border-blue-600 p-6 rounded-[2rem] shadow-2xl animate-in slide-in-from-top-4 duration-300 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-slate-400">Volume sur le BL</label>
                                    <input type="number" step="0.01" value={blForm.data.quantite} onChange={e => blForm.setData('quantite', e.target.value)} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm" placeholder="Ex: 10.5" autoFocus />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-slate-400">N° de BL</label>
                                    <input type="text" value={blForm.data.bl_numero} onChange={e => blForm.setData('bl_numero', e.target.value)} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm" placeholder="BL-XXXX" />
                                </div>
                                <button disabled={blForm.processing} className="md:col-span-2 py-3 rounded-xl gradient-primary text-white font-black text-sm">Enregistrer le BL</button>
                            </form>
                        )}

                        <div className="space-y-3">
                            {livraison.partial_deliveries.map((bl) => (
                                <div key={bl.id} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400"><FileText className="h-5 w-5" /></div>
                                        <div>
                                            <p className="font-extrabold text-sm dark:text-white">BL n° {bl.bl_numero}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase">{new Date(bl.date_reception).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <p className="text-lg font-black dark:text-white">+{bl.quantite} <span className="text-[10px] text-slate-400">{livraison.unite}</span></p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* History Payments */}
                    <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-black dark:text-white flex items-center gap-2">
                                <DollarSign className="h-5 w-5 text-emerald-600" />
                                Historique des Règlements (Paiements)
                            </h3>
                            <button onClick={() => setShowAddPayment(true)} className="text-xs font-black text-emerald-600 uppercase hover:underline">+ Nouveau Règlement</button>
                        </div>

                        {showAddPayment && (
                            <form onSubmit={submitPayment} className="bg-white dark:bg-slate-900 border-2 border-emerald-600 p-6 rounded-[2rem] shadow-2xl animate-in slide-in-from-top-4 duration-300 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-slate-400">Montant du versement (FCFA)</label>
                                    <input type="number" value={paymentForm.data.montant} onChange={e => paymentForm.setData('montant', e.target.value)} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm" placeholder={balance} autoFocus />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-slate-400">Mode de paiement</label>
                                    <select value={paymentForm.data.mode_paiement} onChange={e => paymentForm.setData('mode_paiement', e.target.value)} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm">
                                        <option value="Virement">Virement</option>
                                        <option value="Espèces">Espèces</option>
                                        <option value="Chèque">Chèque</option>
                                        <option value="Mobile Money">Mobile Money</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-slate-400">Référence / N° de Transaction</label>
                                    <input type="text" value={paymentForm.data.reference} onChange={e => paymentForm.setData('reference', e.target.value)} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm" placeholder="Ex: T-9080..." />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-slate-400">Date du règlement</label>
                                    <input type="date" value={paymentForm.data.date_paiement} onChange={e => paymentForm.setData('date_paiement', e.target.value)} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm" />
                                </div>
                                <button disabled={paymentForm.processing} className="md:col-span-2 py-3 rounded-xl bg-emerald-600 text-white font-black text-sm shadow-xl shadow-emerald-500/20">Valider le paiement</button>
                            </form>
                        )}

                        <div className="space-y-3">
                            {livraison.payments?.map((payment) => (
                                <div key={payment.id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between shadow-sm">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                                            {getPaymentIcon(payment.mode_paiement)}
                                        </div>
                                        <div>
                                            <p className="font-extrabold text-sm dark:text-white">{payment.mode_paiement} {payment.reference && <span className="font-medium text-slate-400">— Ref: {payment.reference}</span>}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{new Date(payment.date_paiement).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-black text-emerald-600">-{parseFloat(payment.montant).toLocaleString()} <span className="text-[10px] font-bold uppercase">CFA</span></p>
                                    </div>
                                </div>
                            ))}

                            {!livraison.payments?.length && (
                                <div className="text-center py-10 bg-slate-50/50 dark:bg-slate-800/20 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-slate-700">
                                    <DollarSign className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                                    <p className="text-sm text-slate-500 font-bold">Aucun règlement enregistré pour cette livraison.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
