import { Head, Link } from '@inertiajs/react';
import { 
    LayoutDashboard, 
    ArrowRight, 
    ShieldCheck, 
    Zap, 
    BarChart3,
    Construction
} from 'lucide-react';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    return (
        <>
            <Head title="Portail FLR Enterprise" />
            
            {/* Background avec effets décoratifs */}
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 flex flex-col relative overflow-hidden transition-colors duration-500">
                {/* Effets lumineux de fond */}
                <div className="absolute top-0 left-1/2 w-full -translate-x-1/2 overflow-hidden pointer-events-none opacity-40 dark:opacity-20 z-0 flex justify-center">
                    <div className="w-[800px] h-[500px] bg-blue-500/30 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen absolute -top-40 -left-64 animate-pulse-slow"></div>
                    <div className="w-[600px] h-[400px] bg-indigo-500/20 blur-[100px] rounded-full mix-blend-multiply dark:mix-blend-screen absolute top-10 right-10"></div>
                </div>

                {/* Navbar */}
                <nav className="w-full z-50 py-6 px-8 flex justify-between items-center max-w-7xl mx-auto relative relative">
                    <div className="flex items-center gap-3">
                        <ApplicationLogo className="w-12 h-12" />
                        <span className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                            FLR
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="px-6 py-2.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-sm hover:scale-105 hover:shadow-xl hover:shadow-slate-500/20 transition-all duration-300 flex items-center gap-2"
                            >
                                <LayoutDashboard className="w-4 h-4" />
                                Mon Espace
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="px-6 py-2.5 rounded-full text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-300"
                                >
                                    Connexion
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="px-6 py-2.5 rounded-full bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300"
                                >
                                    S'inscrire
                                </Link>
                            </>
                        )}
                    </div>
                </nav>

                {/* Hero Section */}
                <main className="flex-1 flex flex-col items-center justify-center relative z-10 px-6 max-w-5xl mx-auto w-full pt-12 pb-24 text-center">
                    
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6 leading-tight drop-shadow-sm">
                        Pilotez vos opérations <br className="hidden md:block"/> 
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 relative inline-block">
                            avec précision.
                            <svg className="absolute w-full h-3 -bottom-1 left-0 text-blue-500/30" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="none"/></svg>
                        </span>
                    </h1>
                    
                    <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 mb-12 max-w-2xl font-medium leading-relaxed">
                        Plateforme centralisée pour la gestion avancée des prestataires, 
                        le suivi des chantiers, la logistique de livraison et la facturation.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="group relative px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-lg shadow-2xl shadow-blue-500/30 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    Accéder au système
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </Link>
                        ) : (
                            <Link
                                href={route('login')}
                                className="group relative px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold text-lg shadow-2xl shadow-slate-900/20 dark:shadow-white/10 transition-all duration-300 hover:-translate-y-1"
                            >
                                <span className="flex items-center gap-2">
                                    Se connecter <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </Link>
                        )}
                        <a 
                            href="#features" 
                            className="px-8 py-4 rounded-2xl font-bold text-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-300"
                        >
                            Découvrir
                        </a>
                    </div>
                </main>

                {/* Features Highlight */}
                <div id="features" className="relative z-10 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 py-20 mt-auto w-full">
                    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="glass-card p-8 rounded-[2rem] hover:-translate-y-2 transition-transform duration-300">
                            <div className="w-14 h-14 bg-blue-100 dark:bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 text-blue-600">
                                <Construction className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Opérations Terrain</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                                Suivi en temps réel des chantiers, gestion du parc matériel et pilotage précis 
                                de chaque intervenant sur site.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="glass-card p-8 rounded-[2rem] hover:-translate-y-2 transition-transform duration-300">
                            <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 text-emerald-600">
                                <BarChart3 className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Pilotage Financier</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                                Agrégation automatisée des coûts, génération de rapports PDF et 
                                traçabilité complète des paiements et créances.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="glass-card p-8 rounded-[2rem] hover:-translate-y-2 transition-transform duration-300">
                            <div className="w-14 h-14 bg-purple-100 dark:bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 text-purple-600">
                                <ShieldCheck className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Espace Sécurisé</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                                Infrastructure robuste certifiée, accès cloisonnés et protection 
                                totale de vos données commerciales sensibles.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer simple aligné */}
                <footer className="w-full text-center py-8 text-sm text-slate-400 dark:text-slate-500 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800/50">
                    <p>&copy; {new Date().getFullYear()} Ezafri Solutions. Propulsé par EZAFRI PHP v{phpVersion}.</p>
                </footer>
            </div>

            <style dangerouslySetInnerHTML={{__html: `
                .animate-pulse-slow {
                    animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
            `}} />
        </>
    );
}
