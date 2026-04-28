import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { 
    Construction, 
    Plus, 
    Search, 
    MapPin, 
    User, 
    Calendar, 
    Clock, 
    MoreHorizontal, 
    Trash2, 
    Edit2,
    Briefcase,
    CheckCircle2,
    AlertCircle,
    Info
} from 'lucide-react';
import { useState } from 'react';

export default function Index({ chantiers, clients, responsables, activities }) {
    const { data, setData, post, patch, delete: destroy, processing, errors, reset } = useForm({
        id: null,
        libelle: '',
        client_id: '',
        activity_id: '',
        responsable_id: '',
        lieu: '',
        date_debut: '',
        date_fin_prevue: '',
        status: 'en_cours',
        notes: '',
    });

    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const statusOptions = [
        { value: 'en_cours', label: 'En cours', color: 'bg-blue-100 text-blue-600' },
        { value: 'termine', label: 'Terminé', color: 'bg-emerald-100 text-emerald-600' },
        { value: 'suspendu', label: 'Suspendu', color: 'bg-amber-100 text-amber-600' },
        { value: 'annule', label: 'Annulé', color: 'bg-red-100 text-red-600' },
    ];

    const handleAdd = () => {
        setEditMode(false);
        reset();
        setShowModal(true);
    };

    const handleEdit = (chantier) => {
        setEditMode(true);
        setData({
            id: chantier.id,
            libelle: chantier.libelle,
            client_id: chantier.client_id,
            activity_id: chantier.activity_id,
            responsable_id: chantier.responsable_id,
            lieu: chantier.lieu || '',
            date_debut: chantier.date_debut || '',
            date_fin_prevue: chantier.date_fin_prevue || '',
            status: chantier.status || 'en_cours',
            notes: chantier.notes || '',
        });
        setShowModal(true);
    };

    const submit = (e) => {
        e.preventDefault();
        const url = editMode 
            ? route('chantiers.update', data.id) 
            : route('chantiers.store');
        
        const method = editMode ? patch : post;

        method(url, {
            onSuccess: () => {
                setShowModal(false);
                reset();
            }
        });
    };

    const filteredChantiers = chantiers.filter(c => 
        c.libelle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.client?.nom_societe_ou_contact.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <AuthenticatedLayout
            header="Gestion des Chantiers"
            action={
                <button
                    onClick={handleAdd}
                    className="btn-premium gradient-primary px-6 py-2 rounded-xl text-white flex items-center gap-2 text-sm shadow-xl shadow-blue-500/20"
                >
                    <Plus className="h-4 w-4" />
                    Nouveau Chantier
                </button>
            }
        >
            <Head title="Chantiers" />

            <div className="glass-card rounded-[3rem] p-8 min-h-[600px] mb-8">
                <div className="space-y-6">
                    {/* Stats Bar */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-white/50 dark:bg-slate-800/50 p-4 rounded-2xl flex items-center gap-4 border border-slate-100 dark:border-slate-800">
                            <div className="p-3 rounded-xl bg-blue-50 text-blue-600"><Construction className="h-5 w-5" /></div>
                            <div>
                                <p className="text-xl font-black">{chantiers.length}</p>
                                <p className="text-[10px] uppercase font-bold text-slate-400">Total Chantiers</p>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Rechercher un chantier ou un client..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-11 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-500/20 text-sm dark:text-white"
                            />
                        </div>
                    </div>

                    {/* List */}
                    <div className="grid grid-cols-1 gap-4">
                        {filteredChantiers.map((chantier) => (
                            <div 
                                key={chantier.id}
                                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all group"
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className="h-14 w-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                            <Construction className="h-7 w-7" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                                {chantier.libelle}
                                                <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg uppercase ${statusOptions.find(o => o.value === chantier.status)?.color}`}>
                                                    {statusOptions.find(o => o.value === chantier.status)?.label}
                                                </span>
                                            </h3>
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-slate-500 dark:text-slate-400">
                                                <span className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
                                                    <User className="h-3 w-3" /> {chantier.client?.nom_societe_ou_contact}
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <MapPin className="h-3 w-3" /> {chantier.lieu || 'Lieu non spécifié'}
                                                </span>
                                                <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-bold">
                                                    <Briefcase className="h-3 w-3" /> {chantier.activity?.nom}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-4 md:border-l border-slate-100 dark:border-slate-800 md:pl-6 px-4">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] uppercase font-black text-slate-400">Responsable</span>
                                            <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{chantier.responsable?.nom || 'Non assigné'}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] uppercase font-black text-slate-400">Délai</span>
                                            <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                                                {chantier.date_fin_prevue ? new Date(chantier.date_fin_prevue).toLocaleDateString() : 'À définir'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => handleEdit(chantier)} className="p-2 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                                <Edit2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {filteredChantiers.length === 0 && (
                            <div className="py-20 text-center bg-slate-50 dark:bg-slate-800/50 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-700">
                                <Construction className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                                <h3 className="text-slate-900 dark:text-white font-semibold">Aucun chantier trouvé</h3>
                                <p className="text-slate-500 text-sm">Commencez par créer votre premier projet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 my-8">
                        <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                            <div>
                                <h3 className="font-extrabold text-slate-900 dark:text-white text-xl">
                                    {editMode ? 'Éditer le Chantier' : 'Nouveau Chantier'}
                                </h3>
                                <p className="text-[10px] uppercase font-black text-slate-400 mt-1">Liaison opérationnelle complète</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="h-10 w-10 flex items-center justify-center rounded-full bg-white dark:bg-slate-800 shadow-sm text-slate-400 hover:text-slate-600">×</button>
                        </div>

                        <form onSubmit={submit} className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Libellé du chantier</label>
                                    <input
                                        type="text"
                                        value={data.libelle}
                                        onChange={e => setData('libelle', e.target.value)}
                                        className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-500/20 dark:text-white text-sm"
                                        placeholder="Ex: Construction Villa Kanz..."
                                        autoFocus
                                    />
                                    {errors.libelle && <p className="text-xs text-red-500">{errors.libelle}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Client</label>
                                    <select
                                        value={data.client_id}
                                        onChange={e => setData('client_id', e.target.value)}
                                        className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-500/20 dark:text-white text-sm"
                                    >
                                        <option value="">Sélectionner un client...</option>
                                        {clients.map(c => <option key={c.id} value={c.id}>{c.nom_societe_ou_contact}</option>)}
                                    </select>
                                    {errors.client_id && <p className="text-xs text-red-500">{errors.client_id}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Activité métier</label>
                                    <select
                                        value={data.activity_id}
                                        onChange={e => setData('activity_id', e.target.value)}
                                        className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-500/20 dark:text-white text-sm"
                                    >
                                        <option value="">Sélectionner une activité...</option>
                                        {activities.map(a => <option key={a.id} value={a.id}>{a.service?.nom} — {a.nom}</option>)}
                                    </select>
                                    {errors.activity_id && <p className="text-xs text-red-500">{errors.activity_id}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Responsable terrain</label>
                                    <select
                                        value={data.responsable_id}
                                        onChange={e => setData('responsable_id', e.target.value)}
                                        className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-500/20 dark:text-white text-sm"
                                    >
                                        <option value="">Sélectionner un responsable...</option>
                                        {responsables.map(r => <option key={r.id} value={r.id}>{r.nom}</option>)}
                                    </select>
                                    {errors.responsable_id && <p className="text-xs text-red-500">{errors.responsable_id}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Statut</label>
                                    <select
                                        value={data.status}
                                        onChange={e => setData('status', e.target.value)}
                                        className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-500/20 dark:text-white text-sm"
                                    >
                                        {statusOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Lieu / Adresse</label>
                                    <input type="text" value={data.lieu} onChange={e => setData('lieu', e.target.value)} className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-500/20 text-sm dark:text-white" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Date début</label>
                                    <input type="date" value={data.date_debut} onChange={e => setData('date_debut', e.target.value)} className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-500/20 text-sm dark:text-white" />
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Notes internes</label>
                                    <textarea rows="2" value={data.notes} onChange={e => setData('notes', e.target.value)} className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-500/20 text-sm dark:text-white"></textarea>
                                </div>
                            </div>

                            <div className="pt-6 flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 py-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold text-sm"
                                >
                                    Annuler
                                </button>
                                <button
                                    disabled={processing}
                                    className="flex-1 py-4 rounded-2xl gradient-primary text-white font-bold text-sm shadow-xl shadow-blue-500/20"
                                >
                                    {editMode ? 'Mettre à jour' : 'Lancer le chantier'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
