import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { 
    Users, 
    UserPlus, 
    Search, 
    Filter, 
    Phone, 
    Mail, 
    MapPin, 
    MoreHorizontal, 
    Trash2, 
    Edit2,
    Briefcase,
    Building,
    CheckCircle2,
    XCircle,
    ChevronRight,
    Globe
} from 'lucide-react';
import { useState } from 'react';

export default function Index({ clients, fournisseurs, partenaires, services }) {
    const [activeTab, setActiveTab ] = useState('clients');
    const [searchQuery, setSearchQuery] = useState('');

    const { data, setData, post, patch, delete: destroy, processing, errors, reset } = useForm({
        id: null,
        nom_societe_ou_contact: '',
        nom: '', // for partenaires
        societe: '',
        fonction: '',
        telephone: '',
        email: '',
        adresse: '',
        status: 'actif',
        activity_ids: [],
        service_ids: [],
    });

    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);

    const tabs = [
        { id: 'clients', label: 'Clients', count: clients.length, icon: Users },
        { id: 'fournisseurs', label: 'Fournisseurs', count: fournisseurs.length, icon: Building },
        { id: 'partenaires', label: 'Partenaires', count: partenaires.length, icon: Briefcase },
    ];

    const getCurrentData = () => {
        const query = searchQuery.toLowerCase();
        let list = [];
        if (activeTab === 'clients') list = clients;
        if (activeTab === 'fournisseurs') list = fournisseurs;
        if (activeTab === 'partenaires') list = partenaires;

        return list.filter(item => 
            (item.nom_societe_ou_contact || item.nom || '').toLowerCase().includes(query) ||
            (item.email || '').toLowerCase().includes(query)
        );
    };

    const handleAdd = () => {
        setEditMode(false);
        reset();
        setShowModal(true);
    };

    const handleEdit = (item) => {
        setEditMode(true);
        setData({
            id: item.id,
            nom_societe_ou_contact: item.nom_societe_ou_contact || '',
            nom: item.nom || '',
            societe: item.societe || '',
            fonction: item.fonction || '',
            telephone: item.telephone || '',
            email: item.email || '',
            adresse: item.adresse || '',
            status: item.status || 'actif',
            activity_ids: item.activities?.map(a => a.id) || [],
            service_ids: item.services?.map(s => s.id) || [],
        });
        setShowModal(true);
    };

    const submit = (e) => {
        e.preventDefault();
        const url = editMode 
            ? route(`${activeTab}.update`, data.id) 
            : route(`${activeTab}.store`);
        
        const method = editMode ? patch : post;

        method(url, {
            onSuccess: () => {
                setShowModal(false);
                reset();
            }
        });
    };

    const getIcon = (type) => {
        if (type === 'clients') return <Users className="h-5 w-5" />;
        if (type === 'fournisseurs') return <Building className="h-5 w-5" />;
        if (type === 'partenaires') return <Briefcase className="h-5 w-5" />;
        return <Users className="h-5 w-5" />;
    };

    return (
        <AuthenticatedLayout
            header="Annuaire des Intervenants"
            action={
                <button
                    onClick={handleAdd}
                    className="btn-premium gradient-primary px-6 py-2 rounded-xl text-white flex items-center gap-2 text-sm shadow-xl shadow-blue-500/20"
                >
                    <UserPlus className="h-4 w-4" />
                    Ajouter {activeTab.slice(0, -1)}
                </button>
            }
        >
            <Head title="Intervenants" />

            <div className="glass-card rounded-[3rem] p-8 min-h-[600px] mb-8">
                <div className="space-y-6">
                    {/* Search & Tabs Bar */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-xl hover:shadow-blue-500/5">
                        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                                        activeTab === tab.id 
                                        ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' 
                                        : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                    }`}
                                >
                                    <tab.icon className="h-4 w-4" />
                                    {tab.label}
                                    <span className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-blue-100 text-blue-600' : 'bg-slate-200 text-slate-500'}`}>
                                        {tab.count}
                                    </span>
                                </button>
                            ))}
                        </div>

                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder={`Rechercher un ${activeTab.slice(0, -1)}...`}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-11 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-500/20 text-sm dark:text-white"
                            />
                        </div>
                    </div>

                    {/* Table-like List */}
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
                        <div className="hidden md:grid grid-cols-12 gap-4 px-8 py-4 bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-400">
                            <div className="col-span-3">Identité / Entreprise</div>
                            <div className="col-span-3">Contact Direct</div>
                            <div className="col-span-2">Localisation</div>
                            <div className="col-span-2">Domaines / Métiers</div>
                            <div className="col-span-1 text-center">Statut</div>
                            <div className="col-span-1"></div>
                        </div>

                        <div className="divide-y divide-slate-50 dark:divide-slate-800">
                            {getCurrentData().map((item) => {
                                const activities = item.activities || item.services || [];
                                
                                return (
                                    <div 
                                        key={item.id}
                                        className="grid grid-cols-1 md:grid-cols-12 gap-4 px-8 py-5 items-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group lg:min-h-[80px]"
                                    >
                                        <div className="col-span-3 flex items-center gap-4 relative z-10">
                                            <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                {getIcon(activeTab)}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-extrabold text-slate-900 dark:text-white truncate uppercase tracking-tight leading-tight">
                                                    {item.nom_societe_ou_contact || item.nom}
                                                </p>
                                                {item.societe && (
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">
                                                        {item.societe} {item.fonction ? `— ${item.fonction}` : ''}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="col-span-3 relative z-10">
                                            <div className="space-y-0.5">
                                                <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                                                    <Phone className="h-3 w-3 text-slate-400 shrink-0" />
                                                    <span>{item.telephone || 'N/A'}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-[10px] font-medium text-slate-400">
                                                    <Mail className="h-3 w-3 text-slate-300 shrink-0" />
                                                    <span className="truncate">{item.email || 'N/A'}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-span-2 relative z-10">
                                            <div className="flex items-start gap-2 max-w-[150px]">
                                                <MapPin className="h-3 w-3 text-slate-300 shrink-0 mt-0.5" />
                                                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 line-clamp-2 leading-tight">
                                                    {item.adresse || 'Abidjan, CI'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="col-span-2 relative z-10">
                                            <div className="flex flex-wrap gap-1">
                                                {activities.slice(0, 2).map((tag) => (
                                                    <span key={tag.id} className="text-[9px] font-black px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-500/10 text-blue-600 uppercase tracking-tighter">
                                                        {tag.nom}
                                                    </span>
                                                ))}
                                                {activities.length > 2 && (
                                                    <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-400 uppercase">
                                                        +{activities.length - 2}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="col-span-1 flex justify-center relative z-10">
                                            <span className={`text-[9px] font-black px-2 py-0.5 rounded flex items-center gap-1 uppercase tracking-tighter ${item.status === 'actif' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                                                <CheckCircle2 className={`h-2.5 w-2.5 ${item.status === 'actif' ? 'text-emerald-500' : 'text-slate-300'}`} />
                                                {item.status || 'Actif'}
                                            </span>
                                        </div>

                                        <div className="col-span-1 flex justify-end gap-2 relative z-20">
                                            <button 
                                                onClick={(e) => { e.preventDefault(); handleEdit(item); }}
                                                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-blue-600 transition-colors"
                                            >
                                                <Edit2 className="h-4 w-4" />
                                            </button>
                                            <div className="p-2">
                                                <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            {getCurrentData().length === 0 && (
                                <div className="py-24 text-center">
                                    <div className="h-16 w-16 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-slate-100 dark:border-slate-800">
                                        <Users className="h-8 w-8 text-slate-200" />
                                    </div>
                                    <h3 className="text-slate-900 dark:text-white font-black text-lg uppercase tracking-tight">Aucun {activeTab.slice(0, -1)}</h3>
                                    <p className="text-slate-400 text-xs font-bold uppercase mt-1">Élargissez votre réseau en ajoutant des intervenants.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de Création / Édition */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 my-8">
                        <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                            <div>
                                <h3 className="font-extrabold text-slate-900 dark:text-white text-xl">
                                    {editMode ? 'Modifier' : 'Ajouter'} un {activeTab.slice(0, -1)}
                                </h3>
                                <p className="text-[10px] font-black uppercase text-slate-400 mt-1">Fiche technique de l'intervenant</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="h-10 w-10 flex items-center justify-center rounded-full bg-white dark:bg-slate-800 shadow-sm text-slate-400 hover:text-slate-600">×</button>
                        </div>
                        
                        <form onSubmit={submit} className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest pl-1">Identité Principale</label>
                                    <input
                                        type="text"
                                        value={activeTab === 'partenaires' ? data.nom : data.nom_societe_ou_contact}
                                        onChange={e => setData(activeTab === 'partenaires' ? 'nom' : 'nom_societe_ou_contact', e.target.value)}
                                        className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-500/20 dark:text-white text-sm"
                                        placeholder={activeTab === 'partenaires' ? "Nom complet..." : "Société ou Contact principal..."}
                                        autoFocus
                                    />
                                    {errors.nom_societe_ou_contact && <p className="text-xs text-red-500">{errors.nom_societe_ou_contact}</p>}
                                </div>

                                {activeTab === 'partenaires' && (
                                    <>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest pl-1">Organisation</label>
                                            <input type="text" value={data.societe} onChange={e => setData('societe', e.target.value)} className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-500/20 text-sm dark:text-white" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest pl-1">Position / Titre</label>
                                            <input type="text" value={data.fonction} onChange={e => setData('fonction', e.target.value)} className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-500/20 text-sm dark:text-white" />
                                        </div>
                                    </>
                                )}

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest pl-1">Contact Téléphonique</label>
                                    <input type="text" value={data.telephone} onChange={e => setData('telephone', e.target.value)} className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-500/20 text-sm dark:text-white" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest pl-1">Courrier Électronique</label>
                                    <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-500/20 text-sm dark:text-white" />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest pl-1">Localisation / Adresse</label>
                                    <textarea rows="2" value={data.adresse} onChange={e => setData('adresse', e.target.value)} className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-500/20 text-sm dark:text-white"></textarea>
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest pl-1">Domaines d'intervention / Métiers</label>
                                    <div className="grid grid-cols-2 gap-2 overflow-y-auto max-h-40 p-4 bg-slate-50 dark:bg-slate-800 rounded-[1.5rem] border border-slate-100 dark:border-slate-800">
                                        {activeTab === 'partenaires' ? (
                                            services.map(s => (
                                                <label key={s.id} className="flex items-center gap-2 p-2 rounded-xl hover:bg-white dark:hover:bg-slate-700 cursor-pointer transition-colors group">
                                                    <input 
                                                        type="checkbox" 
                                                        checked={data.service_ids.includes(s.id)}
                                                        onChange={(e) => {
                                                            const ids = e.target.checked ? [...data.service_ids, s.id] : data.service_ids.filter(id => id !== s.id);
                                                            setData('service_ids', ids);
                                                        }}
                                                        className="rounded-md border-slate-300 text-blue-600 focus:ring-blue-500/20" 
                                                    />
                                                    <span className="text-[10px] font-black uppercase text-slate-600 dark:text-slate-400 group-hover:text-blue-600">{s.nom}</span>
                                                </label>
                                            ))
                                        ) : (
                                            services.flatMap(s => s.activities).map(a => (
                                                <label key={a.id} className="flex items-center gap-2 p-2 rounded-xl hover:bg-white dark:hover:bg-slate-700 cursor-pointer transition-colors group">
                                                    <input 
                                                        type="checkbox" 
                                                        checked={data.activity_ids.includes(a.id)}
                                                        onChange={(e) => {
                                                            const ids = e.target.checked ? [...data.activity_ids, a.id] : data.activity_ids.filter(id => id !== a.id);
                                                            setData('activity_ids', ids);
                                                        }}
                                                        className="rounded-md border-slate-300 text-blue-600 focus:ring-blue-500/20" 
                                                    />
                                                    <span className="text-[10px] font-black uppercase text-slate-600 dark:text-slate-400 group-hover:text-blue-600">{a.nom}</span>
                                                </label>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 py-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-extrabold text-sm transition-all hover:bg-slate-200"
                                >
                                    Annuler
                                </button>
                                <button
                                    disabled={processing}
                                    className="flex-1 py-4 rounded-2xl gradient-primary text-white font-extrabold text-sm shadow-xl shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    {editMode ? 'Mettre à jour' : `Créer le ${activeTab.slice(0, -1)}`}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
