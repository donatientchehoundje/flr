import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { Calendar, Plus, Trash2, ListTodo, Search } from 'lucide-react';
import { useState } from 'react';

const statusOptions = ['A faire', 'En cours', 'Terminé', 'Annulé'];
const priorityOptions = ['Basse', 'Normale', 'Haute', 'Urgente'];
const typeOptions = ['interne', 'livraison', 'chantier', 'location', 'client'];

export default function Index({ planifications, responsables }) {
    const [selectedPlanificationId, setSelectedPlanificationId] = useState(null);
    const [showPlanModal, setShowPlanModal] = useState(false);
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [selectedPlanification, setSelectedPlanification] = useState(null);
    const [planSearch, setPlanSearch] = useState('');
    const [planStatusFilter, setPlanStatusFilter] = useState('all');
    const [planPriorityFilter, setPlanPriorityFilter] = useState('all');
    const [visiblePlanCount, setVisiblePlanCount] = useState(20);
    const [taskSearch, setTaskSearch] = useState('');
    const [taskStatusFilter, setTaskStatusFilter] = useState('all');
    const [taskPriorityFilter, setTaskPriorityFilter] = useState('all');

    const planForm = useForm({
        titre: '',
        description: '',
        type: 'interne',
        responsable_id: '',
        date_debut: '',
        date_fin: '',
        priorite: 'Normale',
        status: 'A faire',
        notes: '',
    });

    const taskForm = useForm({
        libelle: '',
        description: '',
        responsable_id: '',
        date_debut: '',
        date_fin: '',
        priorite: 'Normale',
        status: 'A faire',
        ordre: '',
        notes: '',
    });

    const submitPlanification = (e) => {
        e.preventDefault();
        planForm.post(route('planifications.store'), {
            onSuccess: () => {
                planForm.reset();
                setShowPlanModal(false);
            },
        });
    };

    const submitTask = (e) => {
        e.preventDefault();
        if (!selectedPlanification) {
            return;
        }

        taskForm.post(route('planifications.tasks.store', selectedPlanification.id), {
            onSuccess: () => {
                taskForm.reset();
                setShowTaskModal(false);
            },
        });
    };

    const openTaskModal = (planification) => {
        setSelectedPlanification(planification);
        setTaskFormDefaults(planification);
        setShowTaskModal(true);
    };

    const setTaskFormDefaults = (planification) => {
        taskForm.setData({
            libelle: '',
            description: '',
            responsable_id: planification?.responsable_id ? String(planification.responsable_id) : '',
            date_debut: '',
            date_fin: '',
            priorite: 'Normale',
            status: 'A faire',
            ordre: '',
            notes: '',
        });
        taskForm.clearErrors();
    };

    const removePlanification = (id) => {
        if (window.confirm('Supprimer cette planification et ses tâches ?')) {
            planForm.delete(route('planifications.destroy', id));
        }
    };

    const removeTask = (planificationId, taskId) => {
        if (window.confirm('Supprimer cette tâche ?')) {
            taskForm.delete(route('planifications.tasks.destroy', [planificationId, taskId]));
        }
    };

    const changeTaskStatus = (planificationId, taskId, status) => {
        router.patch(
            route('planifications.tasks.status', [planificationId, taskId]),
            { status },
            { preserveScroll: true }
        );
    };

    const statusPillClass = (status) => {
        switch (status) {
            case 'Terminé':
                return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300';
            case 'En cours':
                return 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300';
            case 'Annulé':
                return 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-300';
            case 'A faire':
            default:
                return 'bg-slate-100 text-slate-700 dark:bg-slate-700/40 dark:text-slate-200';
        }
    };

    const priorityPillClass = (priority) => {
        switch (priority) {
            case 'Urgente':
                return 'bg-red-600 text-white';
            case 'Haute':
                return 'bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-300';
            case 'Basse':
                return 'bg-slate-100 text-slate-600 dark:bg-slate-700/40 dark:text-slate-200';
            case 'Normale':
            default:
                return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300';
        }
    };

    const alertPillClass = (alertLevel) => {
        switch (alertLevel) {
            case 'overdue':
                return 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-300';
            case 'today':
                return 'bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-300';
            case 'soon':
                return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-300';
            case 'done':
                return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300';
            default:
                return 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300';
        }
    };

    const alertLabel = (alertLevel) => {
        switch (alertLevel) {
            case 'overdue':
                return 'En retard';
            case 'today':
                return "Aujourd'hui";
            case 'soon':
                return 'Echeance proche';
            case 'done':
                return 'Terminee';
            default:
                return 'Normale';
        }
    };

    const selected = planifications.find((p) => p.id === selectedPlanificationId) || null;
    const filteredPlanifications = planifications.filter((p) => {
        const q = planSearch.trim().toLowerCase();
        const matchesSearch = !q || p.titre?.toLowerCase().includes(q) || p.responsable?.nom?.toLowerCase().includes(q);
        const matchesStatus = planStatusFilter === 'all' || p.status === planStatusFilter;
        const matchesPriority = planPriorityFilter === 'all' || p.priorite === planPriorityFilter;
        return matchesSearch && matchesStatus && matchesPriority;
    });
    const displayedPlanifications = filteredPlanifications.slice(0, visiblePlanCount);

    const filteredTasks = (selected?.tasks || []).filter((task) => {
        const q = taskSearch.trim().toLowerCase();
        const matchesSearch = !q || task.libelle?.toLowerCase().includes(q) || task.responsable?.nom?.toLowerCase().includes(q);
        const matchesStatus = taskStatusFilter === 'all' || task.status === taskStatusFilter;
        const matchesPriority = taskPriorityFilter === 'all' || task.priorite === taskPriorityFilter;
        return matchesSearch && matchesStatus && matchesPriority;
    });

    return (
        <AuthenticatedLayout header="Planifications">
            <Head title="Planifications" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <section className="lg:col-span-5 glass-card rounded-[3rem] p-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <div>
                            <h2 className="text-lg font-black text-slate-900 dark:text-white">Planifications</h2>
                            <p className="text-xs text-slate-500 mt-1">Sélectionne une planification pour voir et gérer ses tâches.</p>
                        </div>
                        <button
                            onClick={() => {
                                planForm.reset();
                                planForm.clearErrors();
                                setShowPlanModal(true);
                            }}
                            className="btn-premium gradient-primary px-6 py-2 rounded-xl text-white flex items-center gap-2 text-sm shadow-xl shadow-blue-500/20"
                        >
                            <Plus className="h-4 w-4" />
                            Nouvelle
                        </button>
                    </div>

                    <div className="space-y-3">
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-3 space-y-3">
                            <div className="relative">
                                <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    value={planSearch}
                                    onChange={(e) => {
                                        setPlanSearch(e.target.value);
                                        setVisiblePlanCount(20);
                                    }}
                                    placeholder="Rechercher planification ou responsable..."
                                    className="w-full pl-10 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <select
                                    value={planStatusFilter}
                                    onChange={(e) => {
                                        setPlanStatusFilter(e.target.value);
                                        setVisiblePlanCount(20);
                                    }}
                                    className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold"
                                >
                                    <option value="all">Tous statuts</option>
                                    {statusOptions.map((status) => <option key={status} value={status}>{status}</option>)}
                                </select>
                                <select
                                    value={planPriorityFilter}
                                    onChange={(e) => {
                                        setPlanPriorityFilter(e.target.value);
                                        setVisiblePlanCount(20);
                                    }}
                                    className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold"
                                >
                                    <option value="all">Toutes priorités</option>
                                    {priorityOptions.map((priority) => <option key={priority} value={priority}>{priority}</option>)}
                                </select>
                            </div>
                            <p className="text-xs text-slate-500">
                                {filteredPlanifications.length} planification(s) trouvée(s)
                            </p>
                        </div>

                        {displayedPlanifications.map((p) => (
                            <button
                                key={p.id}
                                type="button"
                                onClick={() => setSelectedPlanificationId(p.id)}
                                className={`w-full text-left rounded-3xl border p-5 transition-all ${
                                    selectedPlanificationId === p.id
                                        ? 'border-blue-500/40 bg-blue-50/50 dark:bg-blue-500/10'
                                        : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                                }`}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <p className="font-black text-slate-900 dark:text-white uppercase tracking-tight truncate">{p.titre}</p>
                                        <p className="text-xs text-slate-500 mt-1 truncate">Responsable: {p.responsable?.nom}</p>
                                    </div>
                                    <div className="flex flex-col items-end gap-2 shrink-0">
                                        <span className={`text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-wider ${statusPillClass(p.status)}`}>
                                            {p.status}
                                        </span>
                                        <span className={`text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-wider ${priorityPillClass(p.priorite)}`}>
                                            {p.priorite}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                                    <span>Tâches: {(p.tasks || []).length}</span>
                                    <span className="font-bold text-blue-600 dark:text-blue-300">Gérer les tâches →</span>
                                </div>
                            </button>
                        ))}

                        {filteredPlanifications.length === 0 && (
                            <div className="py-10 text-center text-slate-500">
                                <Calendar className="h-10 w-10 mx-auto mb-3 text-slate-300" />
                                Aucune planification ne correspond à la recherche.
                            </div>
                        )}

                        {displayedPlanifications.length < filteredPlanifications.length && (
                            <button
                                type="button"
                                onClick={() => setVisiblePlanCount((prev) => prev + 20)}
                                className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-bold"
                            >
                                Afficher 20 de plus
                            </button>
                        )}
                    </div>
                </section>

                <section className="lg:col-span-7 glass-card rounded-[3rem] p-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <div>
                            <h2 className="text-lg font-black text-slate-900 dark:text-white">Tâches</h2>
                            <p className="text-xs text-slate-500 mt-1">
                                {selected ? (
                                    <><span className="font-bold">{selected.titre}</span></>
                                ) : (
                                    'Aucune planification sélectionnée.'
                                )}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            {selected && (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => openTaskModal(selected)}
                                        className="inline-flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
                                    >
                                        <ListTodo className="h-4 w-4" />
                                        Nouvelle tâche
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => removePlanification(selected.id)}
                                        className="inline-flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        Supprimer planif
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {!selected && (
                        <div className="py-16 text-center text-slate-500">
                            <p className="font-bold">Sélectionne une planification à gauche</p>
                            <p className="text-sm mt-1">Les tâches et leurs statuts apparaîtront ici.</p>
                        </div>
                    )}

                    {selected && (
                        <div className="space-y-3">
                            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-3 space-y-3">
                                <div className="relative">
                                    <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                    <input
                                        value={taskSearch}
                                        onChange={(e) => setTaskSearch(e.target.value)}
                                        placeholder="Rechercher tâche ou responsable..."
                                        className="w-full pl-10 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <select
                                        value={taskStatusFilter}
                                        onChange={(e) => setTaskStatusFilter(e.target.value)}
                                        className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold"
                                    >
                                        <option value="all">Tous statuts</option>
                                        {statusOptions.map((status) => <option key={status} value={status}>{status}</option>)}
                                    </select>
                                    <select
                                        value={taskPriorityFilter}
                                        onChange={(e) => setTaskPriorityFilter(e.target.value)}
                                        className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold"
                                    >
                                        <option value="all">Toutes priorités</option>
                                        {priorityOptions.map((priority) => <option key={priority} value={priority}>{priority}</option>)}
                                    </select>
                                </div>
                                <p className="text-xs text-slate-500">
                                    {filteredTasks.length} tâche(s) trouvée(s) sur {(selected.tasks || []).length}
                                </p>
                            </div>

                            {filteredTasks.map((task) => (
                                <div key={task.id} className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 px-4 py-3 rounded-2xl">
                                    <div className="min-w-0">
                                        <p className="text-sm font-extrabold text-slate-900 dark:text-white truncate">
                                            {task.ordre}. {task.libelle}
                                        </p>
                                        <p className="text-xs text-slate-500 truncate">
                                            Resp: {task.responsable?.nom} {task.date_fin ? `| Échéance: ${task.date_fin}` : ''}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-2 shrink-0">
                                        <span className={`text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-wider ${priorityPillClass(task.priorite)}`}>
                                            {task.priorite}
                                        </span>
                                        <span className={`text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-wider ${alertPillClass(task.alert_level)}`}>
                                            {alertLabel(task.alert_level)}
                                        </span>
                                        <span className={`text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-wider ${statusPillClass(task.status)}`}>
                                            {task.status}
                                        </span>
                                        <select
                                            value={task.status}
                                            onChange={(e) => changeTaskStatus(selected.id, task.id, e.target.value)}
                                            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                                            aria-label="Changer le statut"
                                        >
                                            {statusOptions.map((status) => (
                                                <option key={status} value={status}>{status}</option>
                                            ))}
                                        </select>
                                        <button type="button" onClick={() => removeTask(selected.id, task.id)} className="text-red-500 hover:text-red-600">
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {(selected.tasks || []).length === 0 && (
                                <div className="py-10 text-center text-slate-500">
                                    <p className="font-bold">Aucune tâche</p>
                                    <p className="text-sm mt-1">Crée la première tâche pour cette planification.</p>
                                </div>
                            )}

                            {(selected.tasks || []).length > 0 && filteredTasks.length === 0 && (
                                <div className="py-10 text-center text-slate-500">
                                    <p className="font-bold">Aucun résultat</p>
                                    <p className="text-sm mt-1">Aucune tâche ne correspond aux filtres actuels.</p>
                                </div>
                            )}
                        </div>
                    )}
                </section>
            </div>

            {showPlanModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 my-8">
                        <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                            <h3 className="font-extrabold text-slate-900 dark:text-white text-xl">Nouvelle planification</h3>
                            <button onClick={() => setShowPlanModal(false)} className="h-10 w-10 flex items-center justify-center rounded-full bg-white dark:bg-slate-800 shadow-sm text-slate-400 hover:text-slate-600">×</button>
                        </div>
                        <form onSubmit={submitPlanification} className="p-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <input value={planForm.data.titre} onChange={(e) => planForm.setData('titre', e.target.value)} placeholder="Titre (ex: Livraison de ciment à Mr BONI)" className="px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none md:col-span-2" />
                            <select value={planForm.data.responsable_id} onChange={(e) => planForm.setData('responsable_id', e.target.value)} className="px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none">
                                <option value="">Responsable</option>
                                {responsables.map((r) => <option key={r.id} value={r.id}>{r.nom}</option>)}
                            </select>
                            <select value={planForm.data.type} onChange={(e) => planForm.setData('type', e.target.value)} className="px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none">
                                {typeOptions.map((type) => <option key={type} value={type}>{type}</option>)}
                            </select>
                            <select value={planForm.data.priorite} onChange={(e) => planForm.setData('priorite', e.target.value)} className="px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none">
                                {priorityOptions.map((priority) => <option key={priority} value={priority}>{priority}</option>)}
                            </select>
                            <select value={planForm.data.status} onChange={(e) => planForm.setData('status', e.target.value)} className="px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none">
                                {statusOptions.map((status) => <option key={status} value={status}>{status}</option>)}
                            </select>
                            <input type="date" value={planForm.data.date_debut} onChange={(e) => planForm.setData('date_debut', e.target.value)} className="px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none" />
                            <input type="date" value={planForm.data.date_fin} onChange={(e) => planForm.setData('date_fin', e.target.value)} className="px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none" />
                            <input value={planForm.data.notes} onChange={(e) => planForm.setData('notes', e.target.value)} placeholder="Notes" className="px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none" />
                            <textarea value={planForm.data.description} onChange={(e) => planForm.setData('description', e.target.value)} placeholder="Description" rows="2" className="px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none md:col-span-3" />
                            {Object.keys(planForm.errors).length > 0 && <p className="text-sm text-red-500 md:col-span-3">Vérifie les champs requis de la planification.</p>}
                            <div className="md:col-span-3 flex gap-3 pt-2">
                                <button type="button" onClick={() => setShowPlanModal(false)} className="flex-1 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold text-sm">Annuler</button>
                                <button className="flex-1 py-3 rounded-2xl gradient-primary text-white font-bold text-sm" disabled={planForm.processing}>Créer la planification</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showTaskModal && selectedPlanification && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 my-8">
                        <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                            <div>
                                <h3 className="font-extrabold text-slate-900 dark:text-white text-xl">Ajouter une tâche</h3>
                                <p className="text-xs text-slate-500 mt-1">Planification: {selectedPlanification.titre}</p>
                            </div>
                            <button onClick={() => setShowTaskModal(false)} className="h-10 w-10 flex items-center justify-center rounded-full bg-white dark:bg-slate-800 shadow-sm text-slate-400 hover:text-slate-600">×</button>
                        </div>
                        <form onSubmit={submitTask} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input value={taskForm.data.libelle} onChange={(e) => taskForm.setData('libelle', e.target.value)} placeholder="Libellé de la tâche" className="px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none md:col-span-2" />
                            <select value={taskForm.data.responsable_id} onChange={(e) => taskForm.setData('responsable_id', e.target.value)} className="px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none">
                                <option value="">Responsable</option>
                                {responsables.map((r) => <option key={r.id} value={r.id}>{r.nom}</option>)}
                            </select>
                            <input type="number" min="1" value={taskForm.data.ordre} onChange={(e) => taskForm.setData('ordre', e.target.value)} placeholder="Ordre (optionnel)" className="px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none" />
                            <input type="date" value={taskForm.data.date_debut} onChange={(e) => taskForm.setData('date_debut', e.target.value)} className="px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none" />
                            <input type="date" value={taskForm.data.date_fin} onChange={(e) => taskForm.setData('date_fin', e.target.value)} className="px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none" />
                            <select value={taskForm.data.priorite} onChange={(e) => taskForm.setData('priorite', e.target.value)} className="px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none">
                                {priorityOptions.map((priority) => <option key={priority} value={priority}>{priority}</option>)}
                            </select>
                            <select value={taskForm.data.status} onChange={(e) => taskForm.setData('status', e.target.value)} className="px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none">
                                {statusOptions.map((status) => <option key={status} value={status}>{status}</option>)}
                            </select>
                            <textarea value={taskForm.data.description} onChange={(e) => taskForm.setData('description', e.target.value)} placeholder="Description" rows="2" className="px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none md:col-span-2" />
                            {Object.keys(taskForm.errors).length > 0 && <p className="text-sm text-red-500 md:col-span-2">Impossible d'ajouter la tâche: vérifie les champs requis.</p>}
                            <div className="md:col-span-2 flex gap-3 pt-2">
                                <button type="button" onClick={() => setShowTaskModal(false)} className="flex-1 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold text-sm">Annuler</button>
                                <button className="flex-1 py-3 rounded-2xl gradient-primary text-white font-bold text-sm" disabled={taskForm.processing}>Ajouter à la planification</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
