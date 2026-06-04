import { createContext, useCallback, useContext, useState } from 'react';

const ToastContext = createContext(null);

const ICONS  = { success: 'check_circle', error: 'error', info: 'info', cart: 'shopping_bag' };
const COLORS = {
    success: { bg: '#f0fdf4', border: '#86efac', icon: '#16a34a', text: '#15803d' },
    error:   { bg: '#fef2f2', border: '#fca5a5', icon: '#dc2626', text: '#b91c1c' },
    info:    { bg: '#eff6ff', border: '#93c5fd', icon: '#2563eb', text: '#1d4ed8' },
    cart:    { bg: '#fff7ed', border: '#fdba74', icon: '#9d4300', text: '#7c2d12' },
};

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'success') => {
        const id = Date.now() + Math.random();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3200);
    }, []);

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div style={{
                position: 'fixed', bottom: 28, right: 28, zIndex: 9999,
                display: 'flex', flexDirection: 'column', gap: 10,
                pointerEvents: 'none',
            }}>
                {toasts.map(t => {
                    const c = COLORS[t.type] ?? COLORS.info;
                    return (
                        <div key={t.id} style={{
                            display: 'flex', alignItems: 'center', gap: 12,
                            padding: '12px 18px', borderRadius: 14,
                            background: c.bg, border: `1px solid ${c.border}`,
                            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                            minWidth: 260, maxWidth: 360,
                            animation: 'slideInRight 0.25s ease-out',
                            pointerEvents: 'all',
                        }}>
                            <span className="material-symbols-outlined" style={{ color: c.icon, fontSize: 20, flexShrink: 0 }}>
                                {ICONS[t.type] ?? 'info'}
                            </span>
                            <p style={{ fontSize: 13, fontWeight: 600, color: c.text, flex: 1, lineHeight: 1.4 }}>
                                {t.message}
                            </p>
                        </div>
                    );
                })}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    return useContext(ToastContext);
}
