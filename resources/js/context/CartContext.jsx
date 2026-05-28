import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
    const { user } = useAuth();
    const [cart, setCart] = useState(null);

    const fetchCart = useCallback(async () => {
        if (!user) { setCart(null); return; }
        const res = await api.get('/cart');
        setCart(res.data);
    }, [user]);

    useEffect(() => { fetchCart(); }, [fetchCart]);

    async function addToCart(productId, quantity = 1) {
        const res = await api.post('/cart/items', { product_id: productId, quantity });
        setCart(res.data);
    }

    async function removeFromCart(itemId) {
        await api.delete(`/cart/items/${itemId}`);
        fetchCart();
    }

    async function clearCart() {
        await api.delete('/cart');
        fetchCart();
    }

    const itemCount = cart?.items?.reduce((sum, i) => sum + i.quantity, 0) ?? 0;

    return (
        <CartContext.Provider value={{ cart, itemCount, addToCart, removeFromCart, clearCart, fetchCart }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}