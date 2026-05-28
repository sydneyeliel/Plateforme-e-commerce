import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function ProductDetailPage() {
    const { id }          = useParams();
    const { user }        = useAuth();
    const { addToCart }   = useCart();
    const navigate        = useNavigate();
    const [product, setProduct]   = useState(null);
    const [qty, setQty]           = useState(1);
    const [review, setReview]     = useState({ rating: 5, comment: '' });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        api.get(`/products/${id}`).then((res) => setProduct(res.data));
    }, [id]);

    async function handleAddToCart() {
        if (!user) { navigate('/login'); return; }
        await addToCart(product.id, qty);
        navigate('/cart');
    }

    if (!product) return <p className="text-center py-20 text-gray-500">Chargement...</p>;

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Visuel */}
                <div className="bg-gray-100 rounded-xl h-80 flex items-center justify-center">
                    <span className="text-gray-400">Modèle 3D — {product.name}</span>
                </div>

                {/* Infos */}
                <div>
                    <p className="text-sm text-indigo-600 font-medium mb-1">{product.category?.name}</p>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                    <p className="text-gray-600 mb-4">{product.description}</p>

                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-yellow-400 text-lg">{'★'.repeat(Math.round(product.average_rating ?? 0))}</span>
                        <span className="text-gray-500 text-sm">({product.reviews?.length ?? 0} avis)</span>
                    </div>

                    <p className="text-3xl font-bold text-indigo-600 mb-6">{product.price} €</p>

                    {product.stock > 0 ? (
                        <div className="flex items-center gap-4">
                            <input
                                type="number" min="1" max={product.stock} value={qty}
                                onChange={(e) => setQty(Number(e.target.value))}
                                className="w-20 border border-gray-300 rounded-md px-3 py-2 text-center"
                            />
                            <button
                                onClick={handleAddToCart}
                                className="flex-1 bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 font-medium"
                            >
                                Ajouter au panier
                            </button>
                        </div>
                    ) : (
                        <p className="text-red-500 font-medium">Rupture de stock</p>
                    )}
                    <p className="text-sm text-gray-400 mt-2">Stock disponible : {product.stock}</p>
                </div>
            </div>

            {/* Avis */}
            <div className="mt-12">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Avis clients</h2>
                {product.reviews?.length === 0 && (
                    <p className="text-gray-500 mb-4">Aucun avis pour le moment.</p>
                )}
                <div className="space-y-4 mb-8">
                    {product.reviews?.map((r) => (
                        <div key={r.id} className="bg-white border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-gray-900">{r.user?.name}</span>
                                <span className="text-yellow-400">{'★'.repeat(r.rating)}</span>
                            </div>
                            <p className="text-gray-600 text-sm">{r.comment}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}