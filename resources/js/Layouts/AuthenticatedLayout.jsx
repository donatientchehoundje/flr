import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import Sidebar from '@/Components/Sidebar';
import { Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Menu, Bell, Search, User, CheckCheck } from 'lucide-react';

export default function AuthenticatedLayout({ header, action, children }) {
    const { auth, notifications } = usePage().props;
    const user = auth.user;
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const latestNotifications = notifications?.latest || [];

    const markNotificationAsRead = (id) => {
        router.patch(route('notifications.read', id), {}, { preserveScroll: true });
    };

    const markAllNotificationsAsRead = () => {
        router.patch(route('notifications.readAll'), {}, { preserveScroll: true });
    };

    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* Sidebar Component */}
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Topbar */}
                <header className="sticky top-0 z-30 h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80">
                    <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">
                        {/* Search Bar (Hidden on Mobile) */}
                        <div className="hidden lg:flex flex-1 max-w-md ml-4">
                            <div className="relative w-full group">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Rechercher..."
                                    className="w-full bg-slate-50 border-none rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 transition-all dark:bg-slate-800"
                                />
                            </div>
                        </div>

                        {/* Right Actions */}
                        <div className="flex items-center gap-2 sm:gap-4 ml-auto lg:ml-0">
                            {/* Mobile: burger on the right */}
                            <button
                                onClick={() => setIsSidebarOpen(true)}
                                className="p-2 text-slate-500 hover:bg-slate-100 lg:hidden rounded-lg transition-colors"
                                aria-label="Ouvrir le menu"
                            >
                                <Menu className="h-6 w-6" />
                            </button>

                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors dark:hover:bg-slate-800">
                                        <Bell className="h-5 w-5" />
                                        {(notifications?.unread_count || 0) > 0 && (
                                            <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center">
                                                {notifications.unread_count > 99 ? '99+' : notifications.unread_count}
                                            </span>
                                        )}
                                    </button>
                                </Dropdown.Trigger>

                                <Dropdown.Content width="96" contentClasses="bg-white dark:bg-slate-900 py-0 overflow-hidden">
                                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                                        <div>
                                            <p className="text-sm font-black text-slate-900 dark:text-white">Notifications</p>
                                            <p className="text-[11px] text-slate-500">
                                                {notifications?.unread_count || 0} non lue(s)
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                markAllNotificationsAsRead();
                                            }}
                                            className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-700"
                                        >
                                            <CheckCheck className="h-3.5 w-3.5" />
                                            Tout lire
                                        </button>
                                    </div>

                                    <div className="max-h-96 overflow-y-auto">
                                        {latestNotifications.length > 0 ? (
                                            latestNotifications.map((notification) => (
                                                <div
                                                    key={notification.id}
                                                    className={`px-4 py-3 border-b border-slate-100 dark:border-slate-800 ${
                                                        notification.is_read ? 'bg-white dark:bg-slate-900' : 'bg-blue-50/50 dark:bg-blue-500/10'
                                                    }`}
                                                >
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            if (!notification.is_read) {
                                                                markNotificationAsRead(notification.id);
                                                            } else {
                                                                router.get(route('notifications.index'));
                                                            }
                                                        }}
                                                        className="w-full text-left"
                                                    >
                                                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                                                            {notification.title}
                                                        </p>
                                                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                                                            {notification.message}
                                                        </p>
                                                        <p className="text-[10px] text-slate-400 mt-1">
                                                            {new Date(notification.created_at).toLocaleString()}
                                                        </p>
                                                    </button>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="px-4 py-8 text-center text-sm text-slate-500">
                                                Aucune notification récente.
                                            </div>
                                        )}
                                    </div>

                                    <div className="px-4 py-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800">
                                        <Link
                                            href={route('notifications.index')}
                                            className="block text-center text-sm font-bold text-blue-600 hover:text-blue-700"
                                        >
                                            Voir toutes les notifications
                                        </Link>
                                    </div>
                                </Dropdown.Content>
                            </Dropdown>
                            
                            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800" />

                            <div className="relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button className="flex items-center gap-2 p-1 text-sm font-medium transition-colors hover:text-blue-600">
                                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="hidden sm:inline dark:text-slate-200">{user.name}</span>
                                        </button>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link href={route('profile.edit')}>Mon Profil</Dropdown.Link>
                                        <Dropdown.Link href={route('logout')} method="post" as="button">Déconnexion</Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Header */}
                {header && (
                    <div className="px-4 py-6 sm:px-6 lg:px-8">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex flex-col gap-1">
                                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                                    {header}
                                </h1>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    Suivi et gestion automatisée de vos opérations.
                                </p>
                            </div>
                            {action && (
                                <div className="flex items-center gap-3">
                                    {action}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Content Area */}
                <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8 max-w-[1700px] w-full mx-auto">
                    {children}
                </main>

                {/* Footer */}
                <footer className="py-6 px-8 text-center text-xs text-slate-400">
                    &copy; {new Date().getFullYear()} FLR Gestion. Système de Gestion et d'Automatisation.
                </footer>
            </div>
        </div>
    );
}
