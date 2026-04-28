import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { 
    Key, 
    Plus, 
    Search, 
    Calendar, 
    User, 
    Clock, 
    CreditCard, 
    Trash2, 
    Edit2,
    CheckCircle2,
    AlertCircle,
    HardHat,
    DollarSign,
    ChevronRight,
    Activity as ActivityIcon
} from 'lucide-react';
import { useState } from 'react';

export default function Index({ locations, clients, activities, responsables }) {
    const { data, setData, post, patch, delete: destroy, processing, errors, reset } = useForm({
        id: null,
        client_id: '',
        activity_id: '',
        responsable_id: '',
        materiel_loue: '',
        date_debut: '',
        date_fin: '',
        tarif_unitaire: '',
        unite_temps: 'jour',
        montant_total_prevu: '',
        status: 'en_attente',
        notes: '',
    });

    const paymentForm = useForm({
        montant: '',
        date_paiement: new Date().toISOString().split('T')[0],
        mode_paiement: 'Virement',
        reference: '',
        notes: '',
    });

    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const statusOptions = [
        { value: 'en_attente', label: 'En attente', color: 'bg-slate-100 text-slate-600' },
        { value: 'en_cours', label: 'Actif', color: 'bg-blue-100 text-blue-600' },
        { value: 'termine', label: 'Terminé', color: 'bg-emerald-100 text-emerald-600' },
        { value: 'annule', label: 'Annulé', color: 'bg-red-100 text-red-600' },
    ];

    const getPaymentStatus = (loc) => {
        const totalPaid = loc.payments?.reduce((sum, p) => sum + parseFloat(p.montant), 0) || 0;
        const totalDue = parseFloat(loc.montant_total_prevu || 0);

        if (totalDue <= 0) return { label: 'Gratuit', color: 'bg-slate-50 text-slate-400' };
        if (totalPaid >= totalDue) return { label: 'Réglé', color: 'bg-emerald-500 text-white' };
        if (totalPaid > 0) return { label: 'Partiel', color: 'bg-orange-100 text-orange-600' };
        return { label: 'Impayé', color: 'bg-red-50 text-red-500' };
    };

    const handleAdd = () => {
        setEditMode(false);
        reset();
        setShowModal(true);
    };

    const handleEdit = (location) => {
        setEditMode(true);
        setData({
            id: location.id,
            client_id: location.client_id,
            activity_id: location.activity_id,
            responsable_id: location.responsable_id,
            materiel_loue: location.materiel_loue,
            date_debut: location.date_debut || '',
            date_fin: location.date_fin || '',
            tarif_unitaire: location.tarif_unitaire,
            unite_temps: location.unite_temps || 'jour',
            montant_total_prevu: location.montant_total_prevu || '',
            status: location.status,
            notes: location.notes || '',
        });
        setShowModal(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce contrat de location ?')) {
            destroy(route('locations.destroy', id));
        }
    };

    const handleAddPayment = (location) => {
        setSelectedLocation(location);
        paymentForm.reset();
        setShowPaymentModal(true);
    };

    const submit = (e) => {
        e.preventDefault();
        const url = editMode ? route('locations.update', data.id) : route('locations.store');
        const method = editMode ? patch : post;

        method(url, {
            onSuccess: () => {
                setShowModal(false);
                reset();
            }
        });
    };

    const submitPayment = (e) => {
        e.preventDefault();
        paymentForm.post(route('payments.store', { type: 'location', id: selectedLocation.id }), {
            onSuccess: () => {
                setShowPaymentModal(false);
                paymentForm.reset();
            }
        });
    };

    const filteredLocations = locations.filter(l => 
        l.materiel_loue.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.client?.nom_societe_ou_contact.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <AuthenticatedLayout
            header="Parc Materiel & Locations"
            action={
                <button
                    onClick={handleAdd}
                    className="btn-premium gradient-primary px-6 py-2 rounded-xl text-white flex items-center gap-2 text-sm shadow-xl shadow-blue-500/20"
                >
                    <Plus className="h-4 w-4" />
                    Nouveau Contrat
                </button>
            }
        >
            <Head title="Locations" />

            <div className="glass-card rounded-[3rem] p-8 min-h-[600px] mb-8">
                <div className="space-y-6">
                    {/* Search Bar */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Rechercher un engin ou un client..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-11 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-500/20 text-sm dark:text-white"
                            />
                        </div>
                    </div>

                    {/* Table-like List */}
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
                        <div className="hidden md:grid grid-cols-12 gap-4 px-8 py-4 bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-400">
                            <div className="col-span-3">Matériel / Engin</div>
                            <div className="col-span-2">Client</div>
                            <div className="col-span-2 text-center">Tarif & Unité</div>
                            <div className="col-span-2 text-center">Encaissement</div>
                            <div className="col-span-2 text-center">Statut</div>
                            <div className="col-span-1"></div>
                        </div>

                        <div className="divide-y divide-slate-50 dark:divide-slate-800">
                            {filteredLocations.map((loc) => {
                                const payStatus = getPaymentStatus(loc);
                                
                                return (
                                    <div 
                                        key={loc.id}
                                        className="grid grid-cols-1 md:grid-cols-12 gap-4 px-8 py-6 items-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group relative"
                                    >
                                        <Link href={route('locations.show', loc.id)} className="absolute inset-0 z-0"></Link>
                                        
                                        <div className="col-span-3 flex items-center gap-4 relative z-10 pointer-events-none">
                                            <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                                <Key className="h-5 w-5" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-extrabold text-slate-900 dark:text-white truncate uppercase tracking-tight leading-tight">{loc.materiel_loue}</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ref: {loc.id}</p>
                                            </div>
                                        </div>

                                        <div className="col-span-2 relative z-10 pointer-events-none">
                                            <div className="flex items-center gap-2">
                                                <User className="h-3 w-3 text-slate-400" />
                                                <p className="text-sm font-bold text-slate-600 dark:text-slate-300 truncate">{loc.client?.nom_societe_ou_contact}</p>
                                            </div>
                                        </div>

                                        <div className="col-span-2 text-center relative z-10 pointer-events-none">
                                            <p className="text-sm font-black text-blue-600">{parseFloat(loc.tarif_unitaire).toLocaleString()} CFA</p>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">/ {loc.unite_temps}</p>
                                        </div>

                                        <div className="col-span-2 flex justify-center relative z-10 pointer-events-none">
                                            <span className={`text-[9px] font-black px-2 py-0.5 rounded-lg uppercase tracking-tighter flex items-center gap-1 ${payStatus.color}`}>
                                                <DollarSign className="h-2.5 w-2.5" />
                                                {payStatus.label}
                                            </span>
                                        </div>

                                        <div className="col-span-2 flex justify-center relative z-10 pointer-events-none">
                                            <span className={`text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-wider ${statusOptions.find(o => o.value === loc.status)?.color}`}>
                                                {statusOptions.find(o => o.value === loc.status)?.label}
                                            </span>
                                        </div>

                                        <div className="col-span-1 flex justify-end gap-2 relative z-20">
                                            <button 
                                                onClick={(e) => { e.preventDefault(); handleAddPayment(loc); }}
                                                className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all shadow-sm shadow-emerald-500/10"
                                                title="Encaisser"
                                            >
                                                <DollarSign className="h-4 w-4" />
                                            </button>
                                            {loc.status === 'en_attente' && (
                                                <>
                                                    <button 
                                                        onClick={(e) => { e.preventDefault(); handleEdit(loc); }}
                                                        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-blue-600 transition-colors"
                                                    >
                                                        <Edit2 className="h-4 w-4" />
                                                    </button>
                                                    <button 
                                                        onClick={(e) => { e.preventDefault(); handleDelete(loc.id); }}
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

                            {filteredLocations.length === 0 && (
                                <div className="py-24 text-center">
                                    <Key className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                                    <h3 className="text-slate-900 dark:text-white font-bold">Aucune location trouvée</h3>
                                    <p className="text-slate-500 text-sm">Créez un nouveau contrat pour débuter.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Paiement */}
            {showPaymentModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-emerald-50/50 dark:bg-emerald-900/10">
                            <div>
                                <h3 className="font-extrabold text-slate-900 dark:text-white text-xl">Encaisser Règlement</h3>
                                <p className="text-[10px] uppercase font-black text-emerald-600 mt-1">{selectedLocation?.materiel_loue}</p>
                            </div>
                            <button onClick={() => setShowPaymentModal(false)} className="h-10 w-10 flex items-center justify-center rounded-full bg-white dark:bg-slate-800 text-slate-400 hover:text-slate-600">×</button>
                        </div>
                        <form onSubmit={submitPayment} className="p-8 space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-slate-400 pl-1">Montant Encaissé (FCFA)</label>
                                    <input type="number" value={paymentForm.data.montant} onChange={e => paymentForm.setData('montant', e.target.value)} className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-lg font-black dark:text-white" placeholder="0.00" autoFocus />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase text-slate-400 pl-1">Mode</label>
                                        <select value={paymentForm.data.mode_paiement} onChange={e => paymentForm.setData('mode_paiement', e.target.value)} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-bold">
                                            <option value="Virement">Virement</option>
                                            <option value="Espèces">Espèces</option>
                                            <option value="Chèque">Chèque</option>
                                            <option value="Mobile Money">Mobile Money</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase text-slate-400 pl-1">Date</label>
                                        <input type="date" value={paymentForm.data.date_paiement} onChange={e => paymentForm.setData('date_paiement', e.target.value)} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs" />
                                    </div>
                                </div>
                            </div>
                            <button disabled={paymentForm.processing} className="w-full py-4 rounded-2xl bg-emerald-600 text-white font-black text-sm shadow-xl shadow-emerald-500/20">Valider le règlement</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal UNIQUE (Création ou Édition) */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 my-8">
                        <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                            <div>
                                <h3 className="font-extrabold text-slate-900 dark:text-white text-xl">{editMode ? 'Modifier le Contrat' : 'Nouveau Contrat'}</h3>
                                <p className="text-[10px] uppercase font-black text-slate-400 mt-1">{editMode ? `Ref: ${data.id}` : 'Initialiser une location'}</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="h-10 w-10 flex items-center justify-center rounded-full bg-white dark:bg-slate-800 text-slate-400 hover:text-slate-600">×</button>
                        </div>
                        <form onSubmit={submit} className="p-8 space-y-6">
                            {/* Alert if calculation will be automatic or missing */}
                            {(data.date_debut && data.date_fin && !data.montant_total_prevu) && (
                                <div className="p-4 bg-blue-50 dark:bg-blue-500/10 rounded-2xl border border-blue-100 dark:border-blue-800 flex items-center gap-3">
                                    <AlertCircle className="h-5 w-5 text-blue-600" />
                                    <p className="text-xs font-bold text-blue-700 dark:text-blue-400">Le montant sera calculé automatiquement basé sur les dates.</p>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Matériel / Engin</label>
                                    <input type="text" value={data.materiel_loue} onChange={e => setData('materiel_loue', e.target.value)} className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl dark:text-white text-sm" placeholder="Ex: Pelle Hydraulique..." />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Client</label>
                                    <select value={data.client_id} onChange={e => setData('client_id', e.target.value)} className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl dark:text-white text-sm">
                                        <option value="">Sélectionner...</option>
                                        {clients.map(c => <option key={c.id} value={c.id}>{c.nom_societe_ou_contact}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Pôle / Activité</label>
                                    <select value={data.activity_id} onChange={e => setData('activity_id', e.target.value)} className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl dark:text-white text-sm">
                                        <option value="">Sélectionner...</option>
                                        {activities.map(a => <option key={a.id} value={a.id}>{a.service?.nom} — {a.nom}</option>)}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Date Debut</label>
                                    <input type="date" value={data.date_debut} onChange={e => setData('date_debut', e.target.value)} className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm dark:text-white" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Date Fin (facultatif)</label>
                                    <input type="date" value={data.date_fin} onChange={e => setData('date_fin', e.target.value)} className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm dark:text-white" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Tarif Unitaire</label>
                                    <input type="number" value={data.tarif_unitaire} onChange={e => setData('tarif_unitaire', e.target.value)} className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm dark:text-white" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Unité</label>
                                    <select value={data.unite_temps} onChange={e => setData('unite_temps', e.target.value)} className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm dark:text-white">
                                        <option value="jour">Par Jour</option>
                                        <option value="semaine">Par Semaine</option>
                                        <option value="mois">Par Mois</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Montant Total Prévu (FCFA)</label>
                                    <input type="number" value={data.montant_total_prevu} onChange={e => setData('montant_total_prevu', e.target.value)} className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm dark:text-white" placeholder={!data.date_fin ? "Obligatoire si pas de date de fin" : "Laissez vide pour calcul auto"} />
                                    {errors.montant_total_prevu && <p className="text-[10px] text-red-500 font-bold mt-1 uppercase tracking-tight">{errors.montant_total_prevu}</p>}
                                </div>
                                {editMode && (
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Statut</label>
                                        <select value={data.status} onChange={e => setData('status', e.target.value)} className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm dark:text-white text-blue-600 font-extrabold uppercase">
                                            {statusOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                        </select>
                                    </div>
                                )}
                            </div>
                            <div className="pt-6 flex gap-4">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold text-sm">Annuler</button>
                                <button disabled={processing} className="flex-1 py-4 rounded-2xl gradient-primary text-white font-bold text-sm shadow-xl shadow-blue-500/20">{editMode ? 'Confirmer les modifications' : 'Lancer la location'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
