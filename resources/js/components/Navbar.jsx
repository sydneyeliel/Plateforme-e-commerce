import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
    const { user, logout } = useAuth();
    const { itemCount }    = useCart();
    const navigate         = useNavigate();
    const location         = useLocation();

    async function handleLogout() {
        await logout();
        navigate('/login');
    }

    const navLinks = [
        { to: '/shop', label: 'Discover' },
        { to: '/feed', label: 'Feed' },
        { to: '/shop', label: 'Market' },
        { to: '/shop', label: 'Showroom' },
    ];

    return (
        <nav className="fixed top-0 w-full z-50 backdrop-blur-xl" style={{
            background: 'rgba(249,249,248,0.8)',
            boxShadow: '0px 20px 40px rgba(26,28,28,0.06)'
        }}>
            <div className="max-w-[1920px] mx-auto flex justify-between items-center px-8 py-4">
                <Link to="/" className="text-2xl font-bold tracking-tighter" style={{color:'#1a1c1c'}}>
                    AETHERIA
                </Link>

                <div className="hidden md:flex items-center space-x-8 text-sm tracking-tight">
                    {navLinks.map((link) => {
                        const isActive = location.pathname === link.to && link.label !== 'Market' && link.label !== 'Showroom';
                        return (
                            <Link key={link.label} to={link.to}
                                className="transition-colors duration-300"
                                style={isActive
                                    ? {color:'#9d4300', fontWeight:700, borderBottom:'2px solid #9d4300', paddingBottom:'4px'}
                                    : {color:'rgba(26,28,28,0.6)'}
                                }>
                                {link.label}
                            </Link>
                        );
                    })}
                </div>

                <div className="flex items-center space-x-6">
                    {user ? (
                        <>
                            <Link to="/cart" className="relative transition-colors duration-300 hover:text-[#F97316]"
                                style={{color:'rgba(26,28,28,0.6)'}}>
                                <span className="material-symbols-outlined">shopping_bag</span>
                                {itemCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-[#F97316] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                        {itemCount}
                                    </span>
                                )}
                            </Link>
                            <button className="transition-colors duration-300 hover:text-[#F97316]"
                                style={{color:'rgba(26,28,28,0.6)'}}>
                                <span className="material-symbols-outlined">notifications</span>
                            </button>
                            <div
                                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold cursor-pointer"
                                style={{background:'#9d4300'}}
                                onClick={handleLogout}
                                title="Se déconnecter"
                            >
                                {user.name?.[0]?.toUpperCase()}
                            </div>
                        </>
                    ) : (
                        <>
                            <button className="transition-colors duration-300 hover:text-[#F97316]"
                                style={{color:'rgba(26,28,28,0.6)'}}>
                                <span className="material-symbols-outlined">shopping_bag</span>
                            </button>
                            <button className="transition-colors duration-300 hover:text-[#F97316]"
                                style={{color:'rgba(26,28,28,0.6)'}}>
                                <span className="material-symbols-outlined">notifications</span>
                            </button>
                            <Link to="/login"
                                className="text-sm font-semibold px-4 py-2 rounded-full text-white transition-all hover:opacity-90"
                                style={{background:'linear-gradient(to right, #9d4300, #f97316)'}}>
                                Sign In
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
