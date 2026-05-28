import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
    const { register } = useAuth();
    const navigate     = useNavigate();
    const [form, setForm]   = useState({ name: '', email: '', password: '', password_confirmation: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    function handleChange(e) {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        if (form.password !== form.password_confirmation) {
            setError('Les mots de passe ne correspondent pas');
            return;
        }
        setLoading(true);
        try {
            await register(form.name, form.email, form.password, form.password_confirmation);
            navigate('/');
        } catch (err) {
            const errors = err.response?.data?.errors;
            if (errors) {
                setError(Object.values(errors).flat().join(' — '));
            } else {
                setError(err.response?.data?.message || 'Erreur lors de l\'inscription');
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-md">
                <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Créer un compte</h1>

                {error && <p className="text-red-500 text-sm mb-4 bg-red-50 p-3 rounded">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {[
                        { label: 'Nom complet', name: 'name', type: 'text' },
                        { label: 'Email', name: 'email', type: 'email' },
                        { label: 'Mot de passe', name: 'password', type: 'password' },
                        { label: 'Confirmer le mot de passe', name: 'password_confirmation', type: 'password' },
                    ].map(({ label, name, type }) => (
                        <div key={name}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                            <input
                                type={type} name={name} value={form[name]} onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                required
                            />
                        </div>
                    ))}
                    <button
                        type="submit" disabled={loading}
                        className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 font-medium disabled:opacity-50"
                    >
                        {loading ? 'Inscription...' : 'S\'inscrire'}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-600 mt-4">
                    Déjà un compte ?{' '}
                    <Link to="/login" className="text-indigo-600 hover:underline">Se connecter</Link>
                </p>
            </div>
        </div>
    );
}