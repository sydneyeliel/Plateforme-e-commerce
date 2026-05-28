import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
    const { user, logout } = useAuth();
    const { itemCount }    = useCart();
    const navigate         = useNavigate();

    async function handleLogout() {
        await logout();
        navigate('/login');
    }

    return (
        <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
                <Link to="/" className="text-xl font-bold text-indigo-600">ShopSocial 3D</Link>

                <div className="flex items-center gap-6 text-sm font-medium text-gray-700">
                    <Link to="/shop" className="hover:text-indigo-600">Boutique</Link>
                    <Link to="/feed" className="hover:text-indigo-600">Fil d'actualité</Link>

                    {user ? (
                        <>
                            <Link to="/cart" className="relative hover:text-indigo-600">
                                Panier
                                {itemCount > 0 && (
                                    <span className="absolute -top-2 -right-3 bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                        {itemCount}
                                    </span>
                                )}
                            </Link>
                            <Link to="/orders" className="hover:text-indigo-600">Commandes</Link>
                            <button onClick={handleLogout} className="hover:text-red-500">Déconnexion</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="hover:text-indigo-600">Connexion</Link>
                            <Link to="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                                Inscription
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}