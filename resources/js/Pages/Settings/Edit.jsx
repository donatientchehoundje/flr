import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { Building2, Save, Mail, Phone, MapPin, Fingerprint, FileText } from 'lucide-react';

export default function Edit({ config }) {
    const { data, setData, patch, processing, errors, recentlySuccessful } = useForm({
        nom: config.nom || '',
        ifu: config.ifu || '',
        rccm: config.rccm || '',
        responsable_legal: config.responsable_legal || '',
        contact_infos: {
            telephone: config.contact_infos?.telephone || '',
            email: config.contact_infos?.email || '',
            adresse: config.contact_infos?.adresse || '',
        }
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('settings.update'));
    };

    return (
        <AuthenticatedLayout
            header="Configuration de l'Entreprise"
        >
            <Head title="Paramètres" />

            <div className="max-w-4xl mx-auto space-y-6">
                <form onSubmit={submit} className="space-y-8">
                    {/* General Section */}
                    <div className="bg-white dark:bg-slate-900 shadow-sm rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                            <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                <Building2 className="h-4 w-4 text-blue-500" />
                                Informations Légales
                            </h3>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Nom de l'entreprise</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={data.nom}
                                        onChange={e => setData('nom', e.target.value)}
                                        className="w-full pl-4 pr-4 py-2 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500/20 dark:bg-slate-800 dark:text-white"
                                    />
                                </div>
                                {errors.nom && <p className="text-xs text-red-500">{errors.nom}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Responsable Légal</label>
                                <input
                                    type="text"
                                    value={data.responsable_legal}
                                    onChange={e => setData('responsable_legal', e.target.value)}
                                    className="w-full px-4 py-2 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500/20 dark:bg-slate-800 dark:text-white"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                    <Fingerprint className="h-3 w-3" /> IFU
                                </label>
                                <input
                                    type="text"
                                    value={data.ifu}
                                    onChange={e => setData('ifu', e.target.value)}
                                    className="w-full px-4 py-2 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500/20 dark:bg-slate-800 dark:text-white placeholder:text-slate-400"
                                    placeholder="Ex: 32026..."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                    <FileText className="h-3 w-3" /> RCCM
                                </label>
                                <input
                                    type="text"
                                    value={data.rccm}
                                    onChange={e => setData('rccm', e.target.value)}
                                    className="w-full px-4 py-2 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500/20 dark:bg-slate-800 dark:text-white"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Contact Section */}
                    <div className="bg-white dark:bg-slate-900 shadow-sm rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Coordonnées</h3>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                        <Phone className="h-3 w-3" /> Téléphone
                                    </label>
                                    <input
                                        type="text"
                                        value={data.contact_infos.telephone}
                                        onChange={e => setData('contact_infos', { ...data.contact_infos, telephone: e.target.value })}
                                        className="w-full px-4 py-2 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500/20 dark:bg-slate-800 dark:text-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                        <Mail className="h-3 w-3" /> Email
                                    </label>
                                    <input
                                        type="email"
                                        value={data.contact_infos.email}
                                        onChange={e => setData('contact_infos', { ...data.contact_infos, email: e.target.value })}
                                        className="w-full px-4 py-2 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500/20 dark:bg-slate-800 dark:text-white"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                    <MapPin className="h-3 w-3" /> Adresse
                                </label>
                                <textarea
                                    value={data.contact_infos.adresse}
                                    onChange={e => setData('contact_infos', { ...data.contact_infos, adresse: e.target.value })}
                                    rows="2"
                                    className="w-full px-4 py-2 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500/20 dark:bg-slate-800 dark:text-white"
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-4">
                        {recentlySuccessful && (
                            <p className="text-sm text-emerald-600 font-medium">Enregistré !</p>
                        )}
                        <button
                            disabled={processing}
                            className="btn-premium gradient-primary text-white flex items-center gap-2 px-8"
                        >
                            <Save className="h-4 w-4" />
                            Enregistrer les modifications
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
