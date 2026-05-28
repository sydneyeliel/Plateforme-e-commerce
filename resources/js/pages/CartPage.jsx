import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';

export default function CartPage() {
    const { cart, removeFromCart, clearCart, fetchCart } = useCart();
    const navigate = useNavigate();

    async function handleOrder() {
        await api.post('/orders');
        await clearCart();
        navigate('/orders');
    }

    async function handleQtyChange(itemId, qty) {
        if (qty < 1) return;
        await api.put(`/cart/items/${itemId}`, { quantity: qty });
        fetchCart();
    }

    if (!cart) return <p className="text-center py-20 text-gray-500">Chargement...</p>;

    const total = cart.items?.reduce((sum, i) => sum + i.quantity * i.product.price, 0) ?? 0;

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Mon panier</h1>

            {cart.items?.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-gray-500 mb-4">Votre panier est vide.</p>
                    <button onClick={() => navigate('/shop')} className="text-indigo-600 hover:underline">
                        Continuer mes achats
                    </button>
                </div>
            ) : (
                <>
                    <div className="space-y-4 mb-8">
                        {cart.items.map((item) => (
                            <div key={item.id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4">
                                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <span className="text-xs text-gray-400">3D</span>
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-900">{item.product.name}</p>
                                    <p className="text-indigo-600 font-medium">{item.product.price} €</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleQtyChange(item.id, item.quantity - 1)}
                                        className="w-8 h-8 border border-gray-300 rounded-md hover:bg-gray-100 font-bold"
                                    >−</button>
                                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                                    <button
                                        onClick={() => handleQtyChange(item.id, item.quantity + 1)}
                                        className="w-8 h-8 border border-gray-300 rounded-md hover:bg-gray-100 font-bold"
                                    >+</button>
                                </div>
                                <p className="w-20 text-right font-semibold text-gray-900">
                                    {(item.quantity * item.product.price).toFixed(2)} €
                                </p>
                                <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="text-red-400 hover:text-red-600 text-sm"
                                >✕</button>
                            </div>
                        ))}
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-lg font-semibold text-gray-900">Total</span>
                            <span className="text-2xl font-bold text-indigo-600">{total.toFixed(2)} €</span>
                        </div>
                        <button
                            onClick={handleOrder}
                            className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 font-semibold text-lg"
                        >
                            Passer la commande
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}