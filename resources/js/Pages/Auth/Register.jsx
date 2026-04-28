import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <form onSubmit={submit} className="flex flex-col gap-5">
                <div>
                    <label htmlFor="name" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Nom d'utilisateur
                    </label>
                    <input
                        id="name"
                        name="name"
                        value={data.name}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500/50 shadow-inner dark:text-white transition-all"
                        autoComplete="name"
                        autoFocus
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />
                    <InputError message={errors.name} className="mt-2 text-rose-500" />
                </div>

                <div>
                    <label htmlFor="email" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Adresse Email Professionnelle
                    </label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500/50 shadow-inner dark:text-white transition-all"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />
                    <InputError message={errors.email} className="mt-2 text-rose-500" />
                </div>

                <div>
                    <label htmlFor="password" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Mot de passe
                    </label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500/50 shadow-inner dark:text-white transition-all"
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />
                    <InputError message={errors.password} className="mt-2 text-rose-500" />
                </div>

                <div>
                    <label htmlFor="password_confirmation" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Confirmer le mot de passe
                    </label>
                    <input
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500/50 shadow-inner dark:text-white transition-all"
                        autoComplete="new-password"
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        required
                    />
                    <InputError message={errors.password_confirmation} className="mt-2 text-rose-500" />
                </div>

                <div className="mt-4">
                    <button 
                        type="submit"
                        disabled={processing}
                        className={`w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold text-sm shadow-xl shadow-blue-500/30 transition-all duration-300 flex items-center justify-center gap-2 hover:-translate-y-0.5 ${processing ? 'opacity-70 cursor-wait' : ''}`}
                    >
                        {processing ? 'Création en cours...' : 'S\'inscrire'}
                    </button>

                    <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
                        Vous avez déjà un compte ?{' '}
                        <Link href={route('login')} className="text-blue-600 hover:underline font-bold">
                            Connectez-vous
                        </Link>
                    </div>
                </div>
            </form>
        </GuestLayout>
    );
}
