import { useEffect, useState } from 'react';
import api from '../api/axios';

const STATUS_LABELS = {
    pending:   { label: 'En attente',  color: 'bg-yellow-100 text-yellow-700' },
    confirmed: { label: 'Confirmée',   color: 'bg-blue-100 text-blue-700' },
    shipped:   { label: 'Expédiée',    color: 'bg-purple-100 text-purple-700' },
    delivered: { label: 'Livrée',      color: 'bg-green-100 text-green-700' },
    cancelled: { label: 'Annulée',     color: 'bg-red-100 text-red-700' },
};

export default function OrdersPage() {
    const [orders, setOrders]   = useState([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen]       = useState(null);

    useEffect(() => {
        api.get('/orders')
            .then((res) => setOrders(res.data.data))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p className="text-center py-20 text-gray-500">Chargement...</p>;

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Mes commandes</h1>

            {orders.length === 0 ? (
                <p className="text-center text-gray-500 py-20">Aucune commande pour le moment.</p>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => {
                        const s = STATUS_LABELS[order.status] ?? { label: order.status, color: 'bg-gray-100 text-gray-700' };
                        return (
                            <div key={order.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                                <button
                                    onClick={() => setOpen(open === order.id ? null : order.id)}
                                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
                                >
                                    <div className="flex items-center gap-4">
                                        <span className="font-semibold text-gray-900">Commande #{order.id}</span>
                                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${s.color}`}>{s.label}</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                        <span>{Number(order.total).toFixed(2)} €</span>
                                        <span>{new Date(order.created_at).toLocaleDateString('fr-FR')}</span>
                                        <span>{open === order.id ? '▲' : '▼'}</span>
                                    </div>
                                </button>

                                {open === order.id && (
                                    <div className="border-t border-gray-100 p-4 space-y-3">
                                        {order.items?.map((item) => (
                                            <div key={item.id} className="flex justify-between text-sm text-gray-700">
                                                <span>{item.product?.name} × {item.quantity}</span>
                                                <span>{(item.quantity * item.unit_price).toFixed(2)} €</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}