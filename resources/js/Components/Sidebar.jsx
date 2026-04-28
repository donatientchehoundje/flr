import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { 
    LayoutDashboard, 
    Construction, 
    Truck, 
    Calendar, 
    Users, 
    Settings,
    ChevronRight,
    Menu,
    LogOut,
    CreditCard,
    Key,
    Layers,
    ShieldCheck,
    Bell
} from 'lucide-react';

const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, route: 'dashboard', active: 'dashboard' },
    { label: 'Services', icon: Layers, route: 'services.index', active: 'services.*' },
    { label: 'Intervenants', icon: Users, route: 'intervenants.index', active: 'intervenants.index' },
    { label: 'Équipe', icon: ShieldCheck, route: 'responsables.index', active: 'responsables.index' },
    { label: 'Chantiers', icon: Construction, route: 'chantiers.index', active: 'chantiers.*' },
    { label: 'Pilotage & Stats', icon: LayoutDashboard, route: 'statistics.index', active: 'statistics.*' },
    { label: 'Livraisons', icon: Truck, route: 'livraisons.index', active: 'livraisons.*' },
    { label: 'Locations', icon: Key, route: 'locations.index', active: 'locations.*' },
    { label: 'Planifications', icon: Calendar, route: 'planifications.index', active: 'planifications.*' },
    { label: 'Notifications', icon: Bell, route: 'notifications.index', active: 'notifications.*' },
    { label: 'Paiements', icon: CreditCard, route: 'dashboard', active: 'paiements' },
];

export default function Sidebar({ isOpen, setIsOpen }) {
    return (
        <>
            {/* Mobile Overlay */}
            <div 
                className={`fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm transition-opacity lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsOpen(false)}
            />

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 right-0 z-50 w-72 transform bg-slate-900 text-slate-300 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex h-full flex-col">
                    {/* Header */}
                    <div className="flex h-20 items-center justify-between px-6">
                        <Link href="/" className="flex items-center gap-3">
                            <ApplicationLogo className="h-10 w-auto" />
                            <span className="text-xl font-bold tracking-tight text-white">FLR Gestion</span>
                        </Link>
                        <button onClick={() => setIsOpen(false)} className="lg:hidden">
                            <ChevronRight className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-1 px-4 py-4">
                        {navItems.map((item) => (
                            <Link
                                key={item.label}
                                href={route(item.route)}
                                className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                                    route().current(item.active) 
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                                    : 'hover:bg-slate-800 hover:text-white'
                                }`}
                            >
                                <item.icon className={`h-5 w-5 ${route().current(item.active) ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'}`} />
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Footer */}
                    <div className="border-t border-slate-800 p-4">
                        <Link
                            href={route('settings.edit')}
                            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                                route().current('settings.edit') 
                                ? 'bg-slate-800 text-white' 
                                : 'hover:bg-slate-800 hover:text-white'
                            }`}
                        >
                            <Settings className="h-5 w-5 text-slate-400" />
                            Configuration
                        </Link>
                        <Link
                            method="post"
                            href={route('logout')}
                            as="button"
                            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all"
                        >
                            <LogOut className="h-5 w-5" />
                            Déconnexion
                        </Link>
                    </div>
                </div>
            </aside>
        </>
    );
}
