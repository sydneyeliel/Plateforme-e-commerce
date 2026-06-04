import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser]       = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function init() {
            // Échange le cookie httpOnly oauth_exchange contre le vrai token (usage unique)
            try {
                const res = await api.post('/auth/exchange');
                if (res.data.token) {
                    localStorage.setItem('token', res.data.token);
                }
            } catch {}

            const token = localStorage.getItem('token');
            if (token) {
                api.get('/me')
                    .then((res) => setUser(res.data))
                    .catch(() => localStorage.removeItem('token'))
                    .finally(() => setLoading(false));
            } else {
                setLoading(false);
            }
        }
        init();
    }, []);

    async function login(email, password) {
        const res = await api.post('/login', { email, password });
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
        return res.data.user;
    }

    async function register(name, email, password, password_confirmation) {
        const res = await api.post('/register', { name, email, password, password_confirmation });
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
        return res.data.user;
    }

    async function logout() {
        await api.post('/logout').catch(() => {});
        localStorage.removeItem('token');
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}