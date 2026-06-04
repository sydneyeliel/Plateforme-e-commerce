import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
    const [email, setEmail]       = useState('');
    const [password, setPassword] = useState('');
    const [showPwd, setShowPwd]   = useState(false);
    const [error, setError]       = useState('');
    const [loading, setLoading]   = useState(false);
    const { login }               = useAuth();
    const navigate                = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            navigate('/');
        } catch {
            setError('Email ou mot de passe incorrect.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex flex-col relative overflow-hidden" style={{background:'#f9f9f8'}}>
            <div className="absolute -top-[10%] -left-[5%] w-96 h-96 rounded-full blur-[120px]"
                style={{background:'rgba(255,219,202,0.2)'}}/>
            <div className="absolute -bottom-[10%] -right-[5%] w-96 h-96 rounded-full blur-[120px]"
                style={{background:'rgba(255,221,183,0.1)'}}/>

            <main className="flex-grow flex items-center justify-center px-4 py-12 relative z-10">
                <div className="w-full max-w-[440px] rounded-[1rem] p-10 ambient-shadow"
                    style={{background:'#ffffff', border:'1px solid rgba(224,192,177,0.2)'}}>

                    <div className="flex flex-col items-center mb-10">
                        <div className="text-[1.75rem] font-extrabold tracking-tighter mb-2">AETHERIA</div>
                        <div style={{fontSize:'12px', textTransform:'uppercase', letterSpacing:'0.1em', color:'rgba(88,66,55,0.6)'}}>
                            Welcome to Aetheria
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 mb-8">
                        <button
                            onClick={() => window.location.href = '/auth/google/redirect'}
                            className="flex items-center justify-center gap-3 w-full py-3.5 rounded-lg font-semibold text-sm transition-all hover:bg-[#eeeeed] cursor-pointer"
                            style={{background:'#f3f4f3', color:'#1a1c1c'}}>
                            <svg width="20" height="20" viewBox="0 0 24 24" style={{pointerEvents:'none'}}>
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                            </svg>
                            Continue with Google
                        </button>
                    </div>

                    <div className="relative flex items-center justify-center mb-8">
                        <div className="w-full h-px" style={{background:'rgba(224,192,177,0.2)'}}/>
                        <span className="absolute px-4 text-[10px] font-bold uppercase tracking-widest"
                            style={{background:'#ffffff', color:'rgba(88,66,55,0.4)'}}>OR</span>
                    </div>

                    {error && (
                        <div className="mb-4 px-4 py-3 rounded-lg text-sm"
                            style={{background:'#ffdad6', color:'#93000a'}}>{error}</div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="relative">
                            <label className="absolute -top-2.5 left-3 px-1.5 text-[10px] font-bold uppercase tracking-wider z-20"
                                style={{background:'#ffffff', color:'#9d4300'}}>Email Address</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@example.com" required
                                className="w-full px-4 py-4 rounded-lg text-sm focus:outline-none"
                                style={{background:'#f3f4f3', border:'1px solid rgba(224,192,177,0.2)', color:'#1a1c1c'}}/>
                        </div>

                        <div className="relative">
                            <div className="flex justify-between absolute -top-2.5 left-3 right-3 z-20">
                                <label className="px-1.5 text-[10px] font-bold uppercase tracking-wider"
                                    style={{background:'#ffffff', color:'#9d4300'}}>Password</label>
                                <a href="#" className="px-1.5 text-[10px] font-bold uppercase tracking-wider hover:text-[#9d4300]"
                                    style={{background:'#ffffff', color:'rgba(88,66,55,0.4)'}}>Forgot?</a>
                            </div>
                            <div className="relative">
                                <input type={showPwd ? 'text' : 'password'}
                                    value={password} onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••" required
                                    className="w-full px-4 py-4 rounded-lg text-sm focus:outline-none"
                                    style={{background:'#f3f4f3', border:'1px solid rgba(224,192,177,0.2)', color:'#1a1c1c'}}/>
                                <button type="button" onClick={() => setShowPwd(!showPwd)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2" style={{color:'rgba(88,66,55,0.4)'}}>
                                    <span className="material-symbols-outlined text-xl">{showPwd ? 'visibility_off' : 'visibility'}</span>
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 py-1">
                            <input type="checkbox" className="w-5 h-5 rounded cursor-pointer"/>
                            <label className="text-xs font-medium cursor-pointer" style={{color:'rgba(88,66,55,0.7)'}}>
                                Keep me signed in for 30 days
                            </label>
                        </div>

                        <button type="submit" disabled={loading}
                            className="w-full py-4 font-bold rounded-lg text-white transition-all hover:opacity-90 active:scale-[0.98] ambient-shadow"
                            style={{background:'linear-gradient(to bottom right, #9d4300, #f97316)'}}>
                            {loading ? 'Connexion...' : 'Sign in to Aetheria'}
                        </button>
                    </form>

                    <div className="mt-10 pt-8 text-center" style={{borderTop:'1px solid rgba(224,192,177,0.1)'}}>
                        <p className="text-sm" style={{color:'rgba(88,66,55,0.6)'}}>
                            Don't have an account?{' '}
                            <Link to="/register" className="font-bold hover:underline underline-offset-4 ml-1" style={{color:'#9d4300'}}>
                                Create one for free
                            </Link>
                        </p>
                    </div>
                </div>
            </main>

            <footer className="w-full pt-12 pb-8" style={{borderTop:'1px solid rgba(224,192,177,0.2)'}}>
                <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6"
                    style={{fontSize:'10px', textTransform:'uppercase', letterSpacing:'0.05em', color:'rgba(26,28,28,0.4)'}}>
                    <div className="text-lg font-black" style={{color:'#1a1c1c'}}>AETHERIA</div>
                    <div className="flex flex-wrap justify-center gap-8">
                        {['Imprint','Terms of Service','Creator Policy','Sustainability'].map(l => (
                            <a key={l} href="#" className="underline underline-offset-4 hover:text-[#F97316] transition-all">{l}</a>
                        ))}
                    </div>
                    <div>© 2026 Aetheria Tactile. All rights reserved.</div>
                </div>
            </footer>
        </div>
    );
}
