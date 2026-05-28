import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
    const { login }        = useAuth();
    const navigate         = useNavigate();
    const [email, setEmail]       = useState('');
    const [password, setPassword] = useState('');
    const [error, setError]       = useState('');
    const [loading, setLoading]   = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur de connexion');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-md">
                <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Connexion</h1>

                {error && <p className="text-red-500 text-sm mb-4 bg-red-50 p-3 rounded">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
                        <input
                            type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                    </div>
                    <button
                        type="submit" disabled={loading}
                        className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 font-medium disabled:opacity-50"
                    >
                        {loading ? 'Connexion...' : 'Se connecter'}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-600 mt-4">
                    Pas encore de compte ?{' '}
                    <Link to="/register" className="text-indigo-600 hover:underline">S'inscrire</Link>
                </p>
            </div>
        </div>
    );
}