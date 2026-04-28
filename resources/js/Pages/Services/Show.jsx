import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Layers, ChevronLeft, Plus, Trash2, LayoutGrid, CheckCircle2, MoreVertical } from 'lucide-react';
import { useState } from 'react';

export default function Show({ service }) {
    const { data, setData, post, delete: destroy, processing, errors, reset } = useForm({
        nom: '',
        description: ''
    });

    const [showAddActivity, setShowAddActivity] = useState(false);

    const submitActivity = (e) => {
        e.preventDefault();
        post(route('activities.store', service.id), {
            onSuccess: () => {
                setShowAddActivity(false);
                reset();
            }
        });
    };

    const deleteActivity = (id) => {
        if (confirm('Voulez-vous vraiment supprimer cette activité ?')) {
            destroy(route('activities.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-4">
                    <Link href={route('services.index')} className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        <ChevronLeft className="h-4 w-4" />
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-600 text-white">
                            <Layers className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold dark:text-white leading-none">{service.nom}</h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Détails et Activités métiers</p>
                        </div>
                    </div>
                </div>
            }
            action={
                <button
                    onClick={() => setShowAddActivity(true)}
                    className="btn-premium gradient-primary px-6 py-2 rounded-xl text-white flex items-center gap-2 text-sm shadow-xl shadow-blue-500/20"
                >
                    <Plus className="h-4 w-4" />
                    Ajouter une activité
                </button>
            }
        >
            <Head title={`Service : ${service.nom}`} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Info Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">À propos</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                            {service.description || 'Aucune description spécifiée pour ce service.'}
                        </p>
                        <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-500">Statut</span>
                                <span className="flex items-center gap-1.5 font-bold text-emerald-500">
                                    <CheckCircle2 className="h-4 w-4" /> Actif
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 text-white shadow-xl shadow-blue-500/20">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                                <LayoutGrid className="h-5 w-5" />
                            </div>
                        </div>
                        <h4 className="text-2xl font-black mb-1">{service.activities.length}</h4>
                        <p className="text-blue-100 text-xs font-bold uppercase tracking-tight">Activités métier actives</p>
                    </div>
                </div>

                {/* Main Content - Activities List */}
                <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-lg font-bold dark:text-white mb-2">Activités rattachées</h3>
                    
                    <div className="space-y-3">
                        {service.activities.map((activity) => (
                            <div 
                                key={activity.id}
                                className="group flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                        <Plus className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                                            {activity.nom}
                                        </h4>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            {activity.description || 'Description standard'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => deleteActivity(activity.id)}
                                        className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))}

                        {service.activities.length === 0 && !showAddActivity && (
                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 py-12 text-center">
                                <Plus className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                                <p className="text-sm text-slate-500">Aucune activité pour le moment.</p>
                                <button 
                                    onClick={() => setShowAddActivity(true)}
                                    className="text-blue-600 font-bold text-sm mt-1 hover:underline"
                                >
                                    Ajouter la première ?
                                </button>
                            </div>
                        )}

                        {showAddActivity && (
                            <form 
                                onSubmit={submitActivity}
                                className="bg-white dark:bg-slate-900 border border-blue-500/50 p-4 rounded-2xl shadow-xl shadow-blue-500/5 animate-in slide-in-from-top-2 duration-200"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <input
                                            type="text"
                                            value={data.nom}
                                            onChange={e => setData('nom', e.target.value)}
                                            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500/20 text-sm dark:text-white"
                                            placeholder="Nom de l'activité..."
                                            autoFocus
                                        />
                                        {errors.nom && <p className="text-xs text-red-500 mt-1">{errors.nom}</p>}
                                    </div>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={data.description}
                                            onChange={e => setData('description', e.target.value)}
                                            className="flex-1 px-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500/20 text-sm dark:text-white"
                                            placeholder="Description (optionnel)..."
                                        />
                                        <button
                                            disabled={processing}
                                            className="px-6 py-2 rounded-xl gradient-primary text-white text-sm font-bold shadow-lg shadow-blue-500/20"
                                        >
                                            Enregistrer
                                        </button>
                                        <button 
                                            type="button" 
                                            onClick={() => setShowAddActivity(false)}
                                            className="p-2 rounded-xl bg-slate-50 text-slate-400"
                                        >
                                            ×
                                        </button>
                                    </div>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
