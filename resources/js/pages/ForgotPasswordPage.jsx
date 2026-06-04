import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function ForgotPasswordPage() {
    const [email,   setEmail]   = useState('');
    const [status,  setStatus]  = useState('');
    const [error,   setError]   = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setStatus('');
        setLoading(true);
        try {
            await api.post('/auth/forgot-password', { email });
            setStatus('Si un compte existe avec cet email, un lien de réinitialisation vous a été envoyé.');
        } catch (err) {
            setError(err.response?.data?.message ?? 'Une erreur est survenue.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex flex-col relative overflow-hidden" style={{ background: '#f9f9f8' }}>
            <div className="absolute -top-[10%] -left-[5%] w-96 h-96 rounded-full blur-[120px]"
                style={{ background: 'rgba(255,219,202,0.2)' }} />
            <div className="absolute -bottom-[10%] -right-[5%] w-96 h-96 rounded-full blur-[120px]"
                style={{ background: 'rgba(255,221,183,0.1)' }} />

            <main className="flex-grow flex items-center justify-center px-4 py-12 relative z-10">
                <div className="w-full max-w-[440px] rounded-[1rem] p-10"
                    style={{ background: '#ffffff', border: '1px solid rgba(224,192,177,0.2)', boxShadow: '0 20px 60px rgba(26,28,28,0.06)' }}>

                    <div className="flex flex-col items-center mb-10">
                        <div className="text-[1.75rem] font-extrabold tracking-tighter mb-2">AETHERIA</div>
                        <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(88,66,55,0.6)' }}>
                            Réinitialiser le mot de passe
                        </div>
                    </div>

                    {status ? (
                        <div className="text-center space-y-6">
                            <div className="w-14 h-14 mx-auto rounded-full flex items-center justify-center"
                                style={{ background: '#f0fdf4' }}>
                                <span className="material-symbols-outlined" style={{ color: '#16a34a', fontSize: 28 }}>mark_email_read</span>
                            </div>
                            <p className="text-sm leading-relaxed" style={{ color: '#584237' }}>{status}</p>
                            <Link to="/login" className="block text-sm font-bold hover:underline underline-offset-4"
                                style={{ color: '#9d4300' }}>
                                ← Retour à la connexion
                            </Link>
                        </div>
                    ) : (
                        <>
                            <p className="text-sm mb-8 text-center" style={{ color: 'rgba(88,66,55,0.7)', lineHeight: 1.6 }}>
                                Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
                            </p>

                            {error && (
                                <div className="mb-4 px-4 py-3 rounded-lg text-sm"
                                    style={{ background: '#ffdad6', color: '#93000a' }}>{error}</div>
                            )}

                            <form className="space-y-6" onSubmit={handleSubmit}>
                                <div className="relative">
                                    <label className="absolute -top-2.5 left-3 px-1.5 text-[10px] font-bold uppercase tracking-wider z-20"
                                        style={{ background: '#ffffff', color: '#9d4300' }}>Email Address</label>
                                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                                        placeholder="name@example.com" required
                                        className="w-full px-4 py-4 rounded-lg text-sm focus:outline-none"
                                        style={{ background: '#f3f4f3', border: '1px solid rgba(224,192,177,0.2)', color: '#1a1c1c' }} />
                                </div>

                                <button type="submit" disabled={loading}
                                    className="w-full py-4 font-bold rounded-lg text-white transition-all hover:opacity-90 active:scale-[0.98]"
                                    style={{ background: 'linear-gradient(to bottom right, #9d4300, #f97316)' }}>
                                    {loading ? 'Envoi en cours...' : 'Envoyer le lien'}
                                </button>
                            </form>

                            <div className="mt-8 text-center">
                                <Link to="/login" className="text-sm font-bold hover:underline underline-offset-4"
                                    style={{ color: 'rgba(88,66,55,0.6)' }}>
                                    ← Retour à la connexion
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}
