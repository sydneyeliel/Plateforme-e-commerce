import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
    const [name, setName]                         = useState('');
    const [email, setEmail]                       = useState('');
    const [password, setPassword]                 = useState('');
    const [passwordConfirm, setPasswordConfirm]   = useState('');
    const [error, setError]                       = useState('');
    const [loading, setLoading]                   = useState(false);
    const { register }                            = useAuth();
    const navigate                                = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        if (password !== passwordConfirm) {
            setError('Les mots de passe ne correspondent pas.');
            return;
        }
        if (password.length < 8) {
            setError('Le mot de passe doit contenir au moins 8 caractères.');
            return;
        }
        setLoading(true);
        try {
            await register(name, email, password, passwordConfirm);
            navigate('/');
        } catch (err) {
            const msg = err?.response?.data?.errors;
            if (msg) {
                setError(Object.values(msg).flat().join(' '));
            } else {
                setError('Erreur lors de la création du compte.');
            }
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
                            Create your account
                        </div>
                    </div>

                    {error && (
                        <div className="mb-4 px-4 py-3 rounded-lg text-sm"
                            style={{background:'#ffdad6', color:'#93000a'}}>{error}</div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="relative">
                            <label className="absolute -top-2.5 left-3 px-1.5 text-[10px] font-bold uppercase tracking-wider z-20"
                                style={{background:'#ffffff', color:'#9d4300'}}>Full Name</label>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                                placeholder="John Doe" required
                                className="w-full px-4 py-4 rounded-lg text-sm focus:outline-none"
                                style={{background:'#f3f4f3', border:'1px solid rgba(224,192,177,0.2)', color:'#1a1c1c'}}/>
                        </div>

                        <div className="relative">
                            <label className="absolute -top-2.5 left-3 px-1.5 text-[10px] font-bold uppercase tracking-wider z-20"
                                style={{background:'#ffffff', color:'#9d4300'}}>Email Address</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@example.com" required
                                className="w-full px-4 py-4 rounded-lg text-sm focus:outline-none"
                                style={{background:'#f3f4f3', border:'1px solid rgba(224,192,177,0.2)', color:'#1a1c1c'}}/>
                        </div>

                        <div className="relative">
                            <label className="absolute -top-2.5 left-3 px-1.5 text-[10px] font-bold uppercase tracking-wider z-20"
                                style={{background:'#ffffff', color:'#9d4300'}}>Password</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                                placeholder="Min. 8 caractères" required
                                className="w-full px-4 py-4 rounded-lg text-sm focus:outline-none"
                                style={{background:'#f3f4f3', border:'1px solid rgba(224,192,177,0.2)', color:'#1a1c1c'}}/>
                        </div>

                        <div className="relative">
                            <label className="absolute -top-2.5 left-3 px-1.5 text-[10px] font-bold uppercase tracking-wider z-20"
                                style={{background:'#ffffff', color:'#9d4300'}}>Confirm Password</label>
                            <input type="password" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)}
                                placeholder="••••••••" required
                                className="w-full px-4 py-4 rounded-lg text-sm focus:outline-none"
                                style={{background:'#f3f4f3', border:'1px solid rgba(224,192,177,0.2)', color:'#1a1c1c'}}/>
                        </div>

                        <button type="submit" disabled={loading}
                            className="w-full py-4 font-bold rounded-lg text-white transition-all hover:opacity-90 active:scale-[0.98] ambient-shadow"
                            style={{background:'linear-gradient(to bottom right, #9d4300, #f97316)'}}>
                            {loading ? 'Création...' : 'Create Account'}
                        </button>
                    </form>

                    <div className="mt-10 pt-8 text-center" style={{borderTop:'1px solid rgba(224,192,177,0.1)'}}>
                        <p className="text-sm" style={{color:'rgba(88,66,55,0.6)'}}>
                            Already have an account?{' '}
                            <Link to="/login" className="font-bold hover:underline underline-offset-4 ml-1" style={{color:'#9d4300'}}>
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
