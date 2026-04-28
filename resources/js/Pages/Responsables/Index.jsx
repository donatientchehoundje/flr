import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { 
    Users, 
    UserPlus, 
    Mail, 
    Phone, 
    Trash2, 
    Edit2,
    ShieldCheck,
    Briefcase
} from 'lucide-react';
import { useState } from 'react';

export default function Index({ responsables, services }) {
    const { data, setData, post, patch, delete: destroy, processing, errors, reset } = useForm({
        id: null,
        service_ids: [],
        nom: '',
        contact: '',
        email: '',
    });

    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);

    const handleAdd = () => {
        setEditMode(false);
        reset();
        setShowModal(true);
    };

    const handleEdit = (responsable) => {
        setEditMode(true);
        setData({
            id: responsable.id,
            service_ids: responsable.services.map(s => s.id),
            nom: responsable.nom,
            contact: responsable.contact || '',
            email: responsable.email || '',
        });
        setShowModal(true);
    };

    const submit = (e) => {
        e.preventDefault();
        const url = editMode 
            ? route('responsables.update', data.id) 
            : route('responsables.store');
        
        const method = editMode ? patch : post;

        method(url, {
            onSuccess: () => {
                setShowModal(false);
                reset();
            }
        });
    };

    return (
        <AuthenticatedLayout
            header="Gestion de l'Équipe"
            action={
                <button
                    onClick={handleAdd}
                    className="btn-premium gradient-primary px-6 py-2 rounded-xl text-white flex items-center gap-2 text-sm shadow-xl shadow-blue-500/20"
                >
                    <UserPlus className="h-4 w-4" />
                    Ajouter un Responsable
                </button>
            }
        >
            <Head title="Responsables" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {responsables.map((resp) => (
                    <div 
                        key={resp.id}
                        className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all group"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="h-12 w-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                <ShieldCheck className="h-6 w-6" />
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => handleEdit(resp)} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors">
                                    <Edit2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                            {resp.nom}
                        </h3>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {resp.services && resp.services.map(s => (
                                <span key={s.id} className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-500/10 px-3 py-1 rounded-lg">
                                    <Briefcase className="h-3 w-3" />
                                    {s.nom}
                                </span>
                            ))}
                        </div>

                        <div className="space-y-2 mt-4">
                            <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                                <Phone className="h-3.5 w-3.5" />
                                <span>{resp.contact || 'Non renseigné'}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                                <Mail className="h-3.5 w-3.5" />
                                <span className="truncate">{resp.email || 'Email absent'}</span>
                            </div>
                        </div>
                    </div>
                ))}

                {responsables.length === 0 && (
                    <div className="col-span-full py-20 text-center bg-slate-50 dark:bg-slate-800/50 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-700">
                        <div className="mx-auto w-16 h-16 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-400 shadow-sm">
                            <Users className="h-8 w-8" />
                        </div>
                        <h3 className="text-slate-900 dark:text-white font-semibold">Aucun responsable</h3>
                        <p className="text-slate-500 text-sm">Votre équipe apparaîtra ici.</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                            <h3 className="font-extrabold text-slate-900 dark:text-white text-xl">
                                {editMode ? 'Modifier le profil' : 'Nouveau Responsable'}
                            </h3>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">×</button>
                        </div>
                        <form onSubmit={submit} className="p-8 space-y-5">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Nom complet</label>
                                <input
                                    type="text"
                                    value={data.nom}
                                    onChange={e => setData('nom', e.target.value)}
                                    className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-500/20 dark:text-white text-sm"
                                    placeholder="Ex: Jean Dupont"
                                    autoFocus
                                />
                                {errors.nom && <p className="text-xs text-red-500">{errors.nom}</p>}
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Services assignés</label>
                                <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 space-y-3">
                                    {services.length === 0 ? (
                                        <p className="text-xs text-slate-400 italic">Aucun service disponible</p>
                                    ) : (
                                        services.map(s => (
                                            <label key={s.id} className="flex items-center gap-3 cursor-pointer group">
                                                <input
                                                    type="checkbox"
                                                    checked={data.service_ids.includes(s.id)}
                                                    onChange={e => {
                                                        if (e.target.checked) {
                                                            setData('service_ids', [...data.service_ids, s.id]);
                                                        } else {
                                                            setData('service_ids', data.service_ids.filter(id => id !== s.id));
                                                        }
                                                    }}
                                                    className="w-4 h-4 rounded border-slate-300 text-blue-600 cursor-pointer accent-blue-600"
                                                />
                                                <span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white">
                                                    {s.nom}
                                                </span>
                                            </label>
                                        ))
                                    )}
                                </div>
                                {data.service_ids.length === 0 && <p className="text-xs text-amber-600">Au moins un service doit être sélectionné</p>}
                                {errors.service_ids && <p className="text-xs text-red-500">{errors.service_ids}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Contact</label>
                                <input
                                    type="text"
                                    value={data.contact}
                                    onChange={e => setData('contact', e.target.value)}
                                    className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-500/20 dark:text-white text-sm"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Email</label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-500/20 dark:text-white text-sm"
                                />
                            </div>

                            <div className="pt-6 flex gap-3">
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
                                    {editMode ? 'Mettre à jour' : 'Ajouter à l\'équipe'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
