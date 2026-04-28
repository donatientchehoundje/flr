import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Layers, Plus, Trash2, Edit2, ChevronRight, AlertCircle } from 'lucide-react';
import { useState } from 'react';

export default function Index({ services }) {
    const { data, setData, post, patch, delete: destroy, processing, errors, reset } = useForm({
        nom: '',
        description: ''
    });

    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const handleAdd = () => {
        setEditMode(false);
        reset();
        setShowModal(true);
    };

    const handleEdit = (service) => {
        setEditMode(true);
        setEditingId(service.id);
        setData({
            nom: service.nom,
            description: service.description || ''
        });
        setShowModal(true);
    };

    const submit = (e) => {
        e.preventDefault();
        const url = editMode 
            ? route('services.update', editingId)
            : route('services.store');
        
        const method = editMode ? patch : post;

        method(url, {
            onSuccess: () => {
                setShowModal(false);
                reset();
            }
        });
    };

    const handleDelete = (serviceId) => {
        destroy(route('services.destroy', serviceId), {
            onSuccess: () => {
                setDeleteConfirm(null);
            }
        });
    };

    return (
        <AuthenticatedLayout
            header="Gestion des Services"
            action={
                <button
                    onClick={handleAdd}
                    className="btn-premium gradient-primary px-6 py-2 rounded-xl text-white flex items-center gap-2 text-sm shadow-xl shadow-blue-500/20"
                >
                    <Plus className="h-4 w-4" />
                    Nouveau Service
                </button>
            }
        >
            <Head title="Services" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                    <div 
                        key={service.id}
                        className="group relative bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 overflow-hidden"
                    >
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">
                                    <Layers className="h-6 w-6" />
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                        {service.activities_count} activités
                                    </span>
                                    <button
                                        onClick={() => handleEdit(service)}
                                        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-blue-600 transition-colors"
                                        title="Modifier"
                                    >
                                        <Edit2 className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => setDeleteConfirm(service.id)}
                                        className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-slate-400 hover:text-red-600 transition-colors"
                                        title="Supprimer"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">
                                {service.nom}
                            </h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-6">
                                {service.description || 'Aucune description fournie.'}
                            </p>

                            <Link
                                href={route('services.show', service.id)}
                                className="w-full py-3 px-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm font-semibold flex items-center justify-center gap-2 group-hover:bg-blue-600 group-hover:text-white transition-all"
                            >
                                Gérer les activités
                                <ChevronRight className="h-4 w-4" />
                            </Link>
                        </div>

                        {/* Confirmation de suppression */}
                        {deleteConfirm === service.id && (
                            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-3xl flex items-center justify-center p-4 z-10">
                                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 max-w-sm text-center">
                                    <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center mx-auto mb-4 text-red-600">
                                        <AlertCircle className="h-6 w-6" />
                                    </div>
                                    <h4 className="font-bold text-slate-900 dark:text-white mb-2">Supprimer ce service?</h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                                        Cette action supprimera le service et toutes ses activités associées.
                                    </p>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setDeleteConfirm(null)}
                                            className="flex-1 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold text-sm"
                                        >
                                            Annuler
                                        </button>
                                        <button
                                            onClick={() => handleDelete(service.id)}
                                            disabled={processing}
                                            className="flex-1 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-sm disabled:opacity-50"
                                        >
                                            Supprimer
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                {services.length === 0 && (
                    <div className="col-span-full py-20 text-center">
                        <div className="mx-auto w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-400">
                            <Layers className="h-8 w-8" />
                        </div>
                        <h3 className="text-slate-900 dark:text-white font-semibold">Aucun service</h3>
                        <p className="text-slate-500 text-sm">Commencez par ajouter votre premier pôle d'activité.</p>
                    </div>
                )}
            </div>

            {/* Modal Simple (à étoffer si besoin de plus de style) */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                            <h3 className="font-extrabold text-slate-900 dark:text-white text-xl">
                                {editMode ? 'Modifier le service' : 'Nouveau Service'}
                            </h3>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">×</button>
                        </div>
                        <form onSubmit={submit} className="p-8 space-y-5">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Nom du service</label>
                                <input
                                    type="text"
                                    value={data.nom}
                                    onChange={e => setData('nom', e.target.value)}
                                    className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-500/20 dark:text-white text-sm"
                                    placeholder="Ex: BTP, Location..."
                                    autoFocus
                                />
                                {errors.nom && <p className="text-xs text-red-500 mt-1">{errors.nom}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Description</label>
                                <textarea
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                    className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-500/20 dark:text-white text-sm resize-none"
                                    rows="3"
                                    placeholder="Optionnel: Décrivez ce service..."
                                ></textarea>
                                {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
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
                                    className="flex-1 py-4 rounded-2xl gradient-primary text-white font-bold text-sm shadow-xl shadow-blue-500/20 disabled:opacity-50"
                                >
                                    {editMode ? 'Mettre à jour' : 'Créer le service'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
