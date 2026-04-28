import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { 
    Truck, 
    Plus, 
    Search, 
    Calendar, 
    Package, 
    ChevronRight, 
    Construction, 
    Building,
    CheckCircle2,
    Clock,
    AlertCircle,
    BarChart3,
    Edit2,
    Trash2,
    DollarSign,
    CreditCard,
    User
} from 'lucide-react';
import { useState } from 'react';

export default function Index({ livraisons, chantiers, fournisseurs, responsables }) {
    const { data, setData, post, patch, delete: destroy, processing, errors, reset } = useForm({
        id: null,
        chantier_id: '',
        fournisseur_id: '',
        responsable_id: '',
        reference_bl: '',
        date_livraison_prevue: '',
        quantite_commandee: '',
        unite: 'm3',
        montant_total_fournisseur: '',
        montant_total_retenu_client: '',
        status: 'en_attente',
        notes: '',
    });

    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const statusOptions = [
        { value: 'en_attente', label: 'En attente', color: 'bg-slate-100 text-slate-600' },
        { value: 'en_cours', label: 'En cours', color: 'bg-blue-100 text-blue-600' },
        { value: 'termine', label: 'Terminé', color: 'bg-emerald-100 text-emerald-600' },
        { value: 'annule', label: 'Annulé', color: 'bg-red-100 text-red-600' },
    ];

    const handleAdd = () => {
        setEditMode(false);
        reset();
        setShowModal(true);
    };

    const handleEdit = (livraison) => {
        setEditMode(true);
        setData({
            id: livraison.id,
            chantier_id: livraison.chantier_id,
            fournisseur_id: livraison.fournisseur_id,
            responsable_id: livraison.responsable_id,
            reference_bl: livraison.reference_bl || '',
            date_livraison_prevue: livraison.date_livraison_prevue || '',
            quantite_commandee: livraison.quantite_commandee,
            unite: livraison.unite || 'm3',
            montant_total_fournisseur: livraison.montant_total_fournisseur || '',
            montant_total_retenu_client: livraison.montant_total_retenu_client || '',
            status: livraison.status,
            notes: livraison.notes || '',
        });
        setShowModal(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette commande ?')) {
            destroy(route('livraisons.destroy', id));
        }
    };

    const submit = (e) => {
        e.preventDefault();
        const url = editMode ? route('livraisons.update', data.id) : route('livraisons.store');
        const method = editMode ? patch : post;

        method(url, {
            onSuccess: () => {
                setShowModal(false);
                reset();
            }
        });
    };

    const getPaymentStatus = (livraison) => {
        const totalPaid = livraison.payments?.reduce((sum, p) => sum + parseFloat(p.montant), 0) || 0;
        const totalDue = parseFloat(livraison.montant_total_fournisseur || 0);

        if (totalDue <= 0) return { label: 'Gratuit', color: 'bg-slate-50 text-slate-400' };
        if (totalPaid >= totalDue) return { label: 'Payé', color: 'bg-emerald-500 text-white' };
        if (totalPaid > 0) return { label: 'Partiel', color: 'bg-orange-100 text-orange-600' };
        return { label: 'Non Payé', color: 'bg-red-50 text-red-500' };
    };

    const filteredLivraisons = livraisons.filter(l => 
        l.chantier?.libelle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.fournisseur?.nom_societe_ou_contact.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <AuthenticatedLayout
            header="Suivi des Livraisons"
            action={
                <button
                    onClick={handleAdd}
                    className="btn-premium gradient-primary px-6 py-2 rounded-xl text-white flex items-center gap-2 text-sm shadow-xl shadow-blue-500/20"
                >
                    <Plus className="h-4 w-4" />
                    Nouvelle Commande
                </button>
            }
        >
            <Head title="Livraisons" />

            <div className="glass-card rounded-[3rem] p-8 min-h-[600px] mb-8">
                <div className="space-y-6">
                    {/* Search Bar */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="relative flex-1 max-md:w-full max-w-md">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Rechercher par chantier ou fournisseur..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-11 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-500/20 text-sm dark:text-white"
                            />
                        </div>
                    </div>

                    {/* Table-like List */}
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
                        <div className="hidden md:grid grid-cols-12 gap-4 px-8 py-4 bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-400">
                            <div className="col-span-3">Chantier / Destination</div>
                            <div className="col-span-2">Fournisseur</div>
                            <div className="col-span-2 text-center">Progression</div>
                            <div className="col-span-2 text-center">Paiement</div>
                            <div className="col-span-2 text-center">Statut</div>
                            <div className="col-span-1"></div>
                        </div>

                        <div className="divide-y divide-slate-50 dark:divide-slate-800">
                            {filteredLivraisons.map((livraison) => {
                                const progress = Math.min((livraison.total_recu / livraison.quantite_commandee) * 100, 100);
                                const payStatus = getPaymentStatus(livraison);
                                
                                return (
                                    <div 
                                        key={livraison.id}
                                        className="grid grid-cols-1 md:grid-cols-12 gap-4 px-8 py-6 items-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group relative"
                                    >
                                        <Link href={route('livraisons.show', livraison.id)} className="absolute inset-0 z-0"></Link>
                                        
                                        <div className="col-span-3 flex items-center gap-4 relative z-10 pointer-events-none">
                                            <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                <Construction className="h-5 w-5" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-extrabold text-slate-900 dark:text-white truncate uppercase tracking-tight leading-tight">{livraison.chantier?.libelle}</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ref: {livraison.id}</p>
                                            </div>
                                        </div>

                                        <div className="col-span-2 relative z-10 pointer-events-none">
                                            <div className="flex items-center gap-2">
                                                <Building className="h-3 w-3 text-slate-400" />
                                                <p className="text-sm font-bold text-slate-600 dark:text-slate-300 truncate">{livraison.fournisseur?.nom_societe_ou_contact}</p>
                                            </div>
                                        </div>

                                        <div className="col-span-2 relative z-10 pointer-events-none">
                                            <div className="flex justify-between text-[9px] font-black uppercase text-slate-500 mb-1 px-1">
                                                <span>{livraison.total_recu} {livraison.unite}</span>
                                                <span>{Math.round(progress)}%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-blue-600 rounded-full transition-all duration-700"
                                                    style={{ width: `${progress}%` }}
                                                />
                                            </div>
                                        </div>

                                        <div className="col-span-2 flex justify-center relative z-10 pointer-events-none">
                                            <span className={`text-[9px] font-black px-2 py-0.5 rounded-lg uppercase tracking-tighter flex items-center gap-1 ${payStatus.color}`}>
                                                <DollarSign className="h-2.5 w-2.5" />
                                                {payStatus.label}
                                            </span>
                                        </div>

                                        <div className="col-span-2 flex justify-center relative z-10 pointer-events-none">
                                            <span className={`text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-wider ${statusOptions.find(o => o.value === livraison.status)?.color}`}>
                                                {statusOptions.find(o => o.value === livraison.status)?.label}
                                            </span>
                                        </div>

                                        <div className="col-span-1 flex justify-end gap-2 relative z-20">
                                            {livraison.status === 'en_attente' && (
                                                <>
                                                    <button 
                                                        onClick={(e) => { e.preventDefault(); handleEdit(livraison); }}
                                                        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-blue-600 transition-colors"
                                                    >
                                                        <Edit2 className="h-4 w-4" />
                                                    </button>
                                                    <button 
                                                        onClick={(e) => { e.preventDefault(); handleDelete(livraison.id); }}
                                                        className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition-colors"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </>
                                            )}
                                            <div className="p-2">
                                                <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            {filteredLivraisons.length === 0 && (
                                <div className="py-24 text-center">
                                    <Truck className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                                    <h3 className="text-slate-900 dark:text-white font-bold">Aucune livraison trouvée</h3>
                                    <p className="text-slate-500 text-sm">Créez une nouvelle commande pour débuter.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal UNIQUE (Création ou Édition) */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 my-8">
                        <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                            <div>
                                <h3 className="font-extrabold text-slate-900 dark:text-white text-xl">
                                    {editMode ? 'Modifier la Commande' : 'Nouvelle Commande'}
                                </h3>
                                <p className="text-[10px] uppercase font-black text-slate-400 mt-1">
                                    {editMode ? `Commande N° ${data.id}` : 'Initialiser un suivi de livraison'}
                                </p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="h-10 w-10 flex items-center justify-center rounded-full bg-white dark:bg-slate-800 shadow-sm text-slate-400 hover:text-slate-600">×</button>
                        </div>

                        <form onSubmit={submit} className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Chantier</label>
                                    <select value={data.chantier_id} onChange={e => setData('chantier_id', e.target.value)} className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl dark:text-white text-sm" autoFocus>
                                        <option value="">Sélectionner...</option>
                                        {chantiers.map(c => <option key={c.id} value={c.id}>{c.libelle}</option>)}
                                    </select>
                                    {errors.chantier_id && <p className="text-xs text-red-500">{errors.chantier_id}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Fournisseur</label>
                                    <select value={data.fournisseur_id} onChange={e => setData('fournisseur_id', e.target.value)} className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl dark:text-white text-sm">
                                        <option value="">Sélectionner...</option>
                                        {fournisseurs.map(f => <option key={f.id} value={f.id}>{f.nom_societe_ou_contact}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Volume Commandé</label>
                                    <input type="number" step="0.01" value={data.quantite_commandee} onChange={e => setData('quantite_commandee', e.target.value)} className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm dark:text-white" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Unité</label>
                                    <select value={data.unite} onChange={e => setData('unite', e.target.value)} className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm dark:text-white">
                                        <option value="m3">m³</option>
                                        <option value="tonnes">Tonnes</option>
                                        <option value="unites">Unités</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Montant Fournisseur (FCFA)</label>
                                    <input type="number" value={data.montant_total_fournisseur} onChange={e => setData('montant_total_fournisseur', e.target.value)} className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm dark:text-white" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Montant Facturé (FCFA)</label>
                                    <input type="number" value={data.montant_total_retenu_client} onChange={e => setData('montant_total_retenu_client', e.target.value)} className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm dark:text-white" />
                                </div>
                                
                                {editMode && (
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Statut</label>
                                        <select value={data.status} onChange={e => setData('status', e.target.value)} className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm dark:text-white text-blue-600 font-bold uppercase tracking-tight">
                                            {statusOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                        </select>
                                    </div>
                                )}

                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Notes</label>
                                    <textarea rows="2" value={data.notes} onChange={e => setData('notes', e.target.value)} className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm dark:text-white"></textarea>
                                </div>
                            </div>

                            <div className="pt-6 flex gap-4">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold text-sm">Annuler</button>
                                <button disabled={processing} className="flex-1 py-4 rounded-2xl gradient-primary text-white font-bold text-sm shadow-xl shadow-blue-500/20">
                                    {editMode ? 'Appliquer les modifications' : 'Lancer la commande'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
