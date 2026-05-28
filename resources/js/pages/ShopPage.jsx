import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';

export default function ShopPage() {
    const { addToCart }         = useCart();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [filters, setFilters] = useState({ search: '', category: '' });
    const [loading, setLoading] = useState(true);
    const [added, setAdded]     = useState(null);

    useEffect(() => {
        api.get('/categories').then((res) => setCategories(res.data));
    }, []);

    useEffect(() => {
        setLoading(true);
        const params = {};
        if (filters.search)   params.search   = filters.search;
        if (filters.category) params.category = filters.category;
        api.get('/products', { params })
            .then((res) => setProducts(res.data.data))
            .finally(() => setLoading(false));
    }, [filters]);

    async function handleAddToCart(productId) {
        await addToCart(productId, 1);
        setAdded(productId);
        setTimeout(() => setAdded(null), 1500);
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Boutique</h1>

            {/* Filtres */}
            <div className="flex gap-4 mb-8">
                <input
                    type="text"
                    placeholder="Rechercher un produit..."
                    value={filters.search}
                    onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
                    className="border border-gray-300 rounded-md px-3 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <select
                    value={filters.category}
                    onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))}
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    <option value="">Toutes les catégories</option>
                    {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>
            </div>

            {/* Grille de produits */}
            {loading ? (
                <p className="text-center text-gray-500">Chargement...</p>
            ) : products.length === 0 ? (
                <p className="text-center text-gray-500">Aucun produit trouvé.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition">
                            <div className="h-48 bg-gray-100 flex items-center justify-center">
                                <span className="text-gray-400 text-sm">Modèle 3D</span>
                            </div>
                            <div className="p-4">
                                <p className="text-xs text-indigo-600 font-medium mb-1">{product.category?.name}</p>
                                <Link to={`/products/${product.id}`}>
                                    <h3 className="font-semibold text-gray-900 hover:text-indigo-600">{product.name}</h3>
                                </Link>
                                <p className="text-gray-500 text-sm mt-1 line-clamp-2">{product.description}</p>
                                <div className="flex items-center justify-between mt-4">
                                    <span className="text-lg font-bold text-indigo-600">{product.price} €</span>
                                    <button
                                        onClick={() => handleAddToCart(product.id)}
                                        disabled={product.stock === 0}
                                        className="bg-indigo-600 text-white text-sm px-3 py-1.5 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {added === product.id ? 'Ajouté ✓' : product.stock === 0 ? 'Rupture' : 'Ajouter'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}