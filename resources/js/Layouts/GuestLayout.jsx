import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-slate-50 dark:bg-slate-950 relative overflow-hidden transition-colors duration-500 font-sans">
            
            {/* Effets lumineux d'arrière plan analogues à la page d'accueil */}
            <div className="absolute top-0 left-1/2 w-full -translate-x-1/2 overflow-hidden pointer-events-none opacity-40 dark:opacity-20 z-0 flex justify-center h-full">
                <div className="w-[800px] h-[500px] bg-blue-500/30 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen absolute top-[-20%] left-[-10%] animate-pulse-slow"></div>
                <div className="w-[600px] h-[400px] bg-purple-500/20 blur-[100px] rounded-full mix-blend-multiply dark:mix-blend-screen absolute bottom-[-10%] right-[-10%]"></div>
            </div>

            <div className="relative z-10 w-full sm:max-w-md mt-6 px-8 py-10 glass-card bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl shadow-2xl border border-slate-200/50 dark:border-slate-800/50 sm:rounded-[2rem]">
                <div className="flex flex-col items-center justify-center mb-8">
                    <Link href="/" className="group flex flex-col items-center gap-3">
                        <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 group-hover:scale-105 transition-transform duration-300">
                            <ApplicationLogo className="h-10 w-10" />
                        </div>
                        <span className="text-xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                            FLR Authentification
                        </span>
                    </Link>
                </div>

                <div className="w-full">
                    {children}
                </div>
            </div>
            
            <div className="relative z-10 mt-8 text-center text-xs text-slate-500 dark:text-slate-400 font-medium">
                &copy; {new Date().getFullYear()} Ezafri Solutions. Accès sécurisé.
            </div>

            <style dangerouslySetInnerHTML={{__html: `
                .animate-pulse-slow { animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
            `}} />
        </div>
    );
}
