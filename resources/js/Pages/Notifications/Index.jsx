import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { Bell, CheckCheck, CheckCircle2 } from 'lucide-react';
import { useMemo, useState } from 'react';

export default function Index({ notifications, filters }) {
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState(filters?.status || 'all');

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();

        return (notifications || []).filter((n) => {
            const matchesSearch = !q || n.title?.toLowerCase().includes(q) || n.message?.toLowerCase().includes(q);
            const matchesStatus = status === 'all' || (status === 'unread' ? !n.is_read : n.is_read);
            return matchesSearch && matchesStatus;
        });
    }, [notifications, search, status]);

    const markAsRead = (id) => {
        router.patch(route('notifications.read', id), {}, { preserveScroll: true });
    };

    const markAll = () => {
        router.patch(route('notifications.readAll'));
    };

    return (
        <AuthenticatedLayout
            header="Notifications"
            action={(
                <button
                    type="button"
                    onClick={markAll}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700"
                >
                    <CheckCheck className="h-4 w-4" />
                    Tout marquer lu
                </button>
            )}
        >
            <Head title="Notifications" />

            <div className="glass-card rounded-[3rem] p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Rechercher une notification..."
                        className="md:col-span-2 px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
                    />
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold"
                    >
                        <option value="all">Toutes</option>
                        <option value="unread">Non lues</option>
                        <option value="read">Lues</option>
                    </select>
                </div>

                <p className="text-xs text-slate-500">{filtered.length} notification(s)</p>

                <div className="space-y-3">
                    {filtered.map((n) => (
                        <div key={n.id} className={`rounded-2xl border px-4 py-4 flex flex-col md:flex-row md:items-center justify-between gap-3 ${n.is_read ? 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800' : 'bg-blue-50/50 dark:bg-blue-500/10 border-blue-200/60 dark:border-blue-500/20'}`}>
                            <div className="min-w-0">
                                <p className="font-black text-slate-900 dark:text-white truncate">{n.title}</p>
                                <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{n.message}</p>
                                <p className="text-[11px] text-slate-400 mt-1">
                                    {new Date(n.created_at).toLocaleString()}
                                </p>
                            </div>
                            {!n.is_read && (
                                <button
                                    type="button"
                                    onClick={() => markAsRead(n.id)}
                                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-blue-600 dark:text-blue-300"
                                >
                                    <CheckCircle2 className="h-4 w-4" />
                                    Marquer lu
                                </button>
                            )}
                        </div>
                    ))}

                    {filtered.length === 0 && (
                        <div className="py-16 text-center text-slate-500">
                            <Bell className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                            Aucune notification à afficher.
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
