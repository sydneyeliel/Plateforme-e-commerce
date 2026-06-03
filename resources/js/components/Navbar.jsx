import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
    const { user, logout } = useAuth();
    const { itemCount }    = useCart();
    const navigate         = useNavigate();
    const location         = useLocation();
    const [searchQuery, setSearchQuery] = useState('');

    async function handleLogout() {
        await logout();
        navigate('/login');
    }

    function handleSearch(e) {
        e.preventDefault();
        const q = searchQuery.trim();
        if (q) navigate(`/shop?q=${encodeURIComponent(q)}`);
        else navigate('/shop');
    }

    const navLinks = [
        { to: '/shop', label: 'Discover' },
        { to: '/feed', label: 'Feed' },
        { to: '/shop', label: 'Market' },
        { to: '/shop', label: 'Showroom' },
    ];

    return (
        <nav
            className="fixed top-0 w-full z-50"
            style={{
                background: 'rgba(249,249,248,0.88)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                boxShadow: '0 1px 0 rgba(26,28,28,0.08)',
            }}
        >
            <div
                className="flex items-center px-8 py-3 gap-8"
                style={{ maxWidth: 1920, margin: '0 auto' }}
            >
                {/* Logo */}
                <Link
                    to="/"
                    className="shrink-0 text-xl font-black tracking-tighter"
                    style={{ color: '#1a1c1c' }}
                >
                    AETHERIA
                </Link>

                {/* Nav links */}
                <div className="hidden md:flex items-center gap-7 text-sm">
                    {navLinks.map((link) => {
                        const isActive =
                            location.pathname === link.to &&
                            link.label !== 'Market' &&
                            link.label !== 'Showroom';
                        return (
                            <Link
                                key={link.label}
                                to={link.to}
                                style={
                                    isActive
                                        ? {
                                              color: '#9d4300',
                                              fontWeight: 700,
                                              borderBottom: '2px solid #9d4300',
                                              paddingBottom: 2,
                                          }
                                        : { color: 'rgba(26,28,28,0.55)', fontWeight: 500 }
                                }
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                </div>

                {/* Search bar — grows to fill middle space */}
                <form
                    onSubmit={handleSearch}
                    className="flex-1 max-w-xs hidden md:block"
                >
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search objects..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full text-sm focus:outline-none"
                            style={{
                                background: '#f0f0ef',
                                border: '1px solid rgba(26,28,28,0.08)',
                                borderRadius: 20,
                                padding: '7px 36px 7px 14px',
                                color: '#1a1c1c',
                            }}
                        />
                        <button
                            type="submit"
                            style={{
                                position: 'absolute',
                                right: 10,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: 0,
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            <span
                                className="material-symbols-outlined"
                                style={{ fontSize: 18, color: 'rgba(26,28,28,0.45)' }}
                            >
                                search
                            </span>
                        </button>
                    </div>
                </form>

                {/* Right icons */}
                <div className="flex items-center gap-5 ml-auto">
                    {user ? (
                        <>
                            <Link
                                to="/cart"
                                className="relative"
                                style={{ color: 'rgba(26,28,28,0.6)' }}
                            >
                                <span
                                    className="material-symbols-outlined"
                                    style={{ fontSize: 22 }}
                                >
                                    shopping_bag
                                </span>
                                {itemCount > 0 && (
                                    <span
                                        className="absolute -top-2 -right-2 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold"
                                        style={{ background: '#9d4300' }}
                                    >
                                        {itemCount}
                                    </span>
                                )}
                            </Link>

                            <button
                                style={{
                                    color: 'rgba(26,28,28,0.6)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: 0,
                                    display: 'flex',
                                }}
                            >
                                <span
                                    className="material-symbols-outlined"
                                    style={{ fontSize: 22 }}
                                >
                                    notifications
                                </span>
                            </button>

                            <div
                                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold cursor-pointer shrink-0"
                                style={{ background: '#9d4300' }}
                                onClick={handleLogout}
                                title="Se déconnecter"
                            >
                                {user.name?.[0]?.toUpperCase()}
                            </div>
                        </>
                    ) : (
                        <>
                            <button
                                style={{
                                    color: 'rgba(26,28,28,0.6)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: 0,
                                    display: 'flex',
                                }}
                            >
                                <span
                                    className="material-symbols-outlined"
                                    style={{ fontSize: 22 }}
                                >
                                    shopping_bag
                                </span>
                            </button>

                            <button
                                style={{
                                    color: 'rgba(26,28,28,0.6)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: 0,
                                    display: 'flex',
                                }}
                            >
                                <span
                                    className="material-symbols-outlined"
                                    style={{ fontSize: 22 }}
                                >
                                    notifications
                                </span>
                            </button>

                            <Link
                                to="/login"
                                className="text-sm font-semibold px-4 py-1.5 rounded-full text-white transition-opacity hover:opacity-90 shrink-0"
                                style={{ background: '#9d4300' }}
                            >
                                Sign In
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
