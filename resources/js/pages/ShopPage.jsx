import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import SkeletonCard from '../components/SkeletonCard';

function fakeStats(id) {
    const likes    = [1200, 842, 2400, 512, 1800, 3200];
    const comments = [48,   12,  156,  9,   89,   214];
    const idx = (id - 1) % 6;
    return { likes: likes[idx], comments: comments[idx] };
}

function fmt(n) {
    return n >= 1000 ? (n / 1000).toFixed(1) + 'k' : String(n);
}

const SIDEBAR_W = 290;

const TABS = [
    { key: 'Cart',            icon: 'shopping_cart'  },
    { key: 'Wishlist',        icon: 'favorite_border' },
    { key: 'Recently Viewed', icon: 'history'         },
];

const SORT_OPTIONS = [
    { key: 'newest',     label: 'Newest First'     },
    { key: 'oldest',     label: 'Oldest First'     },
    { key: 'price_asc',  label: 'Price: Low → High' },
    { key: 'price_desc', label: 'Price: High → Low' },
];

export default function ShopPage() {
    const { user }                       = useAuth();
    const { addToCart, cart, itemCount } = useCart();
    const { addToast }                   = useToast();
    const [searchParams]                 = useSearchParams();
    const sortRef                        = useRef(null);

    const [products, setProducts]             = useState([]);
    const [categories, setCategories]         = useState([]);
    const [activeCategory, setActiveCategory] = useState('');
    const [sort, setSort]                     = useState('newest');
    const [sortOpen, setSortOpen]             = useState(false);
    const [loading, setLoading]               = useState(true);
    const [adding, setAdding]                 = useState(null);
    const [total, setTotal]                   = useState(0);
    const [sidebarTab, setSidebarTab]         = useState('Cart');
    const [showSidebar, setShowSidebar]       = useState(true);
    const [recentlyViewed]                    = useState(() => JSON.parse(localStorage.getItem('recentlyViewed') || '[]'));

    const search = searchParams.get('q') ?? '';

    useEffect(() => {
        api.get('/categories').then((res) => setCategories(res.data));
    }, []);

    useEffect(() => {
        setLoading(true);
        const params = { sort };
        if (search)         params.search   = search;
        if (activeCategory) params.category = activeCategory;
        api.get('/products', { params })
            .then((res) => {
                setProducts(res.data.data ?? []);
                setTotal(res.data.total ?? 0);
            })
            .finally(() => setLoading(false));
    }, [search, activeCategory, sort]);

    useEffect(() => {
        function close(e) { if (sortRef.current && !sortRef.current.contains(e.target)) setSortOpen(false); }
        document.addEventListener('mousedown', close);
        return () => document.removeEventListener('mousedown', close);
    }, []);

    async function handleCart(e, product) {
        e.preventDefault();
        e.stopPropagation();
        if (!user) { addToast('Connectez-vous pour ajouter au panier', 'info'); return; }
        if (adding) return;
        setAdding(product.id);
        try {
            await addToCart(product.id, 1);
            addToast(`${product.name} ajouté au panier`, 'cart');
        } catch {
            addToast('Erreur lors de l\'ajout au panier', 'error');
        } finally {
            setAdding(null);
        }
    }

    const sidebarOpen = user && showSidebar;

    return (
        <div
            style={{
                background: '#f9f9f8',
                color: '#1a1c1c',
                minHeight: '100vh',
                paddingRight: sidebarOpen ? SIDEBAR_W : 0,
                transition: 'padding-right 0.3s ease',
            }}
        >
            {/* ─── Main content ─────────────────────────────────────── */}
            <main className="pt-28 pb-24 max-w-5xl mx-auto px-6">

                {/* Header: title left · category pills right */}
                <div className="flex items-start justify-between gap-6 mb-10">
                    <div>
                        <h1
                            className="font-extrabold tracking-tighter leading-tight mb-3"
                            style={{ fontSize: 'clamp(2rem,4vw,3rem)' }}
                        >
                            The Sculpted<br />
                            <span style={{ color: '#9d4300', fontStyle: 'italic' }}>Catalog</span>
                        </h1>
                        <p style={{ color: '#584237', fontSize: '0.875rem', maxWidth: 400, lineHeight: 1.6 }}>
                            Discover a curated collection of tactile digital assets,
                            meticulously crafted for the next generation of spatial experiences.
                        </p>
                    </div>

                    {/* Category pills */}
                    <div className="flex gap-2 flex-wrap justify-end shrink-0 mt-4">
                        <button
                            onClick={() => setActiveCategory('')}
                            className="px-5 py-2 rounded-full font-semibold text-sm transition-all"
                            style={
                                activeCategory === ''
                                    ? { background: '#9d4300', color: '#fff' }
                                    : { background: '#eeeeed', color: '#1a1c1c' }
                            }
                        >
                            All
                        </button>
                        {categories.map((c) => (
                            <button
                                key={c.id}
                                onClick={() => setActiveCategory(c.id)}
                                className="px-5 py-2 rounded-full font-medium text-sm transition-all"
                                style={
                                    activeCategory === c.id
                                        ? { background: '#9d4300', color: '#fff' }
                                        : { background: '#eeeeed', color: '#1a1c1c' }
                                }
                            >
                                {c.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Results bar */}
                <div
                    className="flex items-center justify-between mb-8 py-3"
                    style={{
                        borderTop: '1px solid rgba(26,28,28,0.08)',
                        borderBottom: '1px solid rgba(26,28,28,0.08)',
                    }}
                >
                    <span className="text-sm" style={{ color: '#584237' }}>
                        <strong style={{ color: '#1a1c1c' }}>{total}</strong> Items found
                    </span>
                    <div className="flex items-center gap-3">
                        {/* Sort dropdown */}
                        <div className="relative" ref={sortRef}>
                            <button
                                onClick={() => setSortOpen(o => !o)}
                                className="flex items-center gap-1.5 text-sm px-4 py-1.5 rounded-lg transition-colors hover:bg-gray-100"
                                style={{ color: '#1a1c1c', border: '1px solid rgba(26,28,28,0.12)' }}
                            >
                                Sort:&nbsp;<span style={{ fontWeight: 700 }}>{SORT_OPTIONS.find(o => o.key === sort)?.label}</span>
                                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>expand_more</span>
                            </button>
                            {sortOpen && (
                                <div className="absolute right-0 mt-1 w-52 rounded-xl overflow-hidden z-50"
                                    style={{ background: '#fff', boxShadow: '0 8px 32px rgba(26,28,28,0.12)', border: '1px solid rgba(26,28,28,0.08)' }}>
                                    {SORT_OPTIONS.map(o => (
                                        <button key={o.key}
                                            onClick={() => { setSort(o.key); setSortOpen(false); }}
                                            className="w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-[#f9f0eb]"
                                            style={{ color: sort === o.key ? '#9d4300' : '#1a1c1c', fontWeight: sort === o.key ? 700 : 500 }}>
                                            {o.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Product grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array(6).fill(null).map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                ) : products.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 gap-4">
                        <span className="material-symbols-outlined" style={{ fontSize: 56, color: 'rgba(26,28,28,0.15)' }}>search_off</span>
                        <p style={{ fontWeight: 700, fontSize: 16, color: '#1a1c1c' }}>Aucun produit trouvé</p>
                        <p style={{ fontSize: 13, color: '#584237' }}>Essayez une autre catégorie ou un autre filtre</p>
                        <button onClick={() => { setActiveCategory(''); }}
                            className="mt-2 px-6 py-2 rounded-full text-sm font-bold text-white"
                            style={{ background: '#9d4300' }}>
                            Voir tout
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((product, i) => {
                            const stats = fakeStats(product.id);
                            return (
                                <Link
                                    key={product.id}
                                    to={`/products/${product.id}`}
                                    className="group flex flex-col rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
                                    style={{
                                        background: '#fff',
                                        border: '1px solid rgba(26,28,28,0.07)',
                                        boxShadow: '0 2px 10px rgba(26,28,28,0.04)',
                                    }}
                                >
                                    {/* Product image */}
                                    <div
                                        className="relative overflow-hidden"
                                        style={{ aspectRatio: '1/1', background: '#f3f4f3' }}
                                    >
                                        {product.image ? (
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center"
                                                style={{ background: `hsl(${(product.id * 47) % 360},18%,88%)` }}>
                                                <span className="material-symbols-outlined" style={{ fontSize: 40, color: 'rgba(26,28,28,0.2)' }}>deployed_code</span>
                                            </div>
                                        )}
                                        {i === 0 && (
                                            <span
                                                style={{
                                                    position: 'absolute',
                                                    top: 12,
                                                    left: 12,
                                                    background: 'rgba(255,255,255,0.92)',
                                                    color: '#1a1c1c',
                                                    fontSize: 9,
                                                    fontWeight: 800,
                                                    letterSpacing: '0.12em',
                                                    padding: '4px 10px',
                                                    borderRadius: 20,
                                                    textTransform: 'uppercase',
                                                }}
                                            >
                                                NEW
                                            </span>
                                        )}
                                    </div>

                                    {/* Card body */}
                                    <div className="p-4 flex flex-col flex-grow">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3
                                                style={{
                                                    fontWeight: 700,
                                                    fontSize: 14,
                                                    lineHeight: 1.3,
                                                    color: '#1a1c1c',
                                                }}
                                            >
                                                {product.name}
                                            </h3>
                                            <span
                                                style={{
                                                    fontWeight: 800,
                                                    fontSize: 14,
                                                    marginLeft: 8,
                                                    flexShrink: 0,
                                                    color: '#9d4300',
                                                }}
                                            >
                                                ${Number(product.price).toFixed(0)}
                                            </span>
                                        </div>
                                        <p
                                            style={{
                                                fontSize: 11,
                                                lineHeight: 1.65,
                                                color: '#584237',
                                                flexGrow: 1,
                                                marginBottom: 12,
                                            }}
                                        >
                                            {product.description}
                                        </p>

                                        {/* Social stats + cart button */}
                                        <div
                                            className="flex items-center justify-between pt-3"
                                            style={{ borderTop: '1px solid rgba(26,28,28,0.06)' }}
                                        >
                                            <div className="flex items-center gap-4">
                                                <span
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 3,
                                                        fontSize: 11,
                                                        color: '#584237',
                                                    }}
                                                >
                                                    <span
                                                        className="material-symbols-outlined"
                                                        style={{ fontSize: 14 }}
                                                    >
                                                        favorite
                                                    </span>
                                                    {fmt(stats.likes)}
                                                </span>
                                                <span
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 3,
                                                        fontSize: 11,
                                                        color: '#584237',
                                                    }}
                                                >
                                                    <span
                                                        className="material-symbols-outlined"
                                                        style={{ fontSize: 14 }}
                                                    >
                                                        chat_bubble
                                                    </span>
                                                    {stats.comments}
                                                </span>
                                            </div>

                                            <button
                                                onClick={(e) => handleCart(e, product)}
                                                disabled={product.stock === 0 || adding === product.id}
                                                title={!user ? 'Connectez-vous pour ajouter' : 'Ajouter au panier'}
                                                style={{
                                                    width: 32,
                                                    height: 32,
                                                    borderRadius: '50%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    border: '1px solid rgba(26,28,28,0.15)',
                                                    background: 'transparent',
                                                    color: '#1a1c1c',
                                                    cursor: user ? 'pointer' : 'default',
                                                    transition: 'all 0.2s',
                                                    flexShrink: 0,
                                                }}
                                                onMouseEnter={(e) => {
                                                    if (!user) return;
                                                    e.currentTarget.style.background = '#9d4300';
                                                    e.currentTarget.style.color = '#fff';
                                                    e.currentTarget.style.borderColor = '#9d4300';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.background = 'transparent';
                                                    e.currentTarget.style.color = '#1a1c1c';
                                                    e.currentTarget.style.borderColor = 'rgba(26,28,28,0.15)';
                                                }}
                                            >
                                                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
                                                    {adding === product.id ? 'hourglass_empty' : 'add_shopping_cart'}
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}

                {/* Pagination */}
                {!loading && total > 0 && (
                    <div className="flex items-center justify-center gap-2 mt-16">
                        {['‹', '1', '2', '3', '…', '12', '›'].map((p, i) => (
                            <button
                                key={i}
                                style={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: 13,
                                    fontWeight: p === '1' ? 700 : 500,
                                    background: p === '1' ? '#1a1c1c' : '#eeeeed',
                                    color: p === '1' ? '#fff' : '#1a1c1c',
                                    border: 'none',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s',
                                }}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer
                className="w-full pt-12 pb-8"
                style={{ borderTop: '1px solid rgba(224,192,177,0.18)', background: '#f9f9f8' }}
            >
                <div
                    className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6"
                    style={{
                        fontSize: 10,
                        textTransform: 'uppercase',
                        letterSpacing: '0.07em',
                        color: 'rgba(26,28,28,0.38)',
                    }}
                >
                    <div style={{ fontSize: 13, fontWeight: 900, color: '#1a1c1c', letterSpacing: '-0.02em' }}>
                        AETHERIA
                    </div>
                    <div className="flex flex-wrap justify-center gap-8">
                        {['Imprint', 'Terms of Service', 'Creator Policy', 'Sustainability'].map((l) => (
                            <a
                                key={l}
                                href="#"
                                style={{ textDecoration: 'underline', textUnderlineOffset: 3 }}
                                className="hover:text-[#9d4300] transition-colors"
                            >
                                {l}
                            </a>
                        ))}
                    </div>
                    <div>© 2026 Aetheria Tactile. All rights reserved.</div>
                </div>
            </footer>

            {/* ─── Cart Sidebar ──────────────────────────────────────── */}
            {sidebarOpen && (
                <aside
                    style={{
                        position: 'fixed',
                        top: 0,
                        right: 0,
                        width: SIDEBAR_W,
                        height: '100vh',
                        background: '#ffffff',
                        borderLeft: '1px solid rgba(26,28,28,0.08)',
                        display: 'flex',
                        flexDirection: 'column',
                        zIndex: 40,
                        boxShadow: '-8px 0 32px rgba(26,28,28,0.07)',
                    }}
                >
                    {/* Sidebar header */}
                    <div style={{ padding: '28px 20px 0' }}>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: 4,
                            }}
                        >
                            <h3 style={{ fontWeight: 700, fontSize: 15, color: '#1a1c1c' }}>
                                Your Collection
                            </h3>
                            <button
                                onClick={() => setShowSidebar(false)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: 'rgba(26,28,28,0.38)',
                                    fontSize: 16,
                                    lineHeight: 1,
                                    padding: 4,
                                }}
                            >
                                ✕
                            </button>
                        </div>
                        <p style={{ fontSize: 11, color: 'rgba(26,28,28,0.4)', marginBottom: 20 }}>
                            {itemCount} Items ready for checkout
                        </p>

                        {/* Tabs */}
                        <div style={{ display: 'flex', gap: 2 }}>
                            {TABS.map((tab) => (
                                <button
                                    key={tab.key}
                                    onClick={() => setSidebarTab(tab.key)}
                                    style={{
                                        flex: 1,
                                        padding: '8px 4px 10px',
                                        background:
                                            sidebarTab === tab.key ? '#f3f4f3' : 'transparent',
                                        border: 'none',
                                        borderRadius: 6,
                                        cursor: 'pointer',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: 3,
                                        color:
                                            sidebarTab === tab.key
                                                ? '#1a1c1c'
                                                : 'rgba(26,28,28,0.38)',
                                        fontWeight: sidebarTab === tab.key ? 600 : 400,
                                        transition: 'all 0.15s',
                                    }}
                                >
                                    <span
                                        className="material-symbols-outlined"
                                        style={{ fontSize: 18 }}
                                    >
                                        {tab.icon}
                                    </span>
                                    <span style={{ fontSize: 9.5, whiteSpace: 'nowrap' }}>
                                        {tab.key}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Divider */}
                    <div
                        style={{
                            height: 1,
                            background: 'rgba(26,28,28,0.06)',
                            margin: '12px 0 0',
                        }}
                    />

                    {/* Scrollable items */}
                    <div
                        style={{ flex: 1, overflowY: 'auto', padding: '12px 20px' }}
                        className="hide-scrollbar"
                    >
                        {sidebarTab === 'Cart' ? (
                            cart?.items?.length > 0 ? (
                                cart.items.map((item) => (
                                    <div
                                        key={item.id}
                                        style={{
                                            display: 'flex',
                                            gap: 10,
                                            padding: '10px 0',
                                            borderBottom: '1px solid rgba(26,28,28,0.06)',
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: 52,
                                                height: 52,
                                                borderRadius: 8,
                                                background: '#f3f4f3',
                                                overflow: 'hidden',
                                                flexShrink: 0,
                                            }}
                                        >
                                            {item.product?.image && (
                                                <img
                                                    src={item.product.image}
                                                    alt={item.product.name}
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover',
                                                    }}
                                                />
                                            )}
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <p
                                                style={{
                                                    fontSize: 12,
                                                    fontWeight: 600,
                                                    color: '#1a1c1c',
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                }}
                                            >
                                                {item.product?.name}
                                            </p>
                                            <p
                                                style={{
                                                    fontSize: 11,
                                                    color: '#9d4300',
                                                    fontWeight: 700,
                                                    marginTop: 3,
                                                }}
                                            >
                                                ${Number(item.product?.price ?? 0).toFixed(0)} ×{' '}
                                                {item.quantity}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p
                                    style={{
                                        fontSize: 12,
                                        color: 'rgba(26,28,28,0.28)',
                                        textAlign: 'center',
                                        paddingTop: 48,
                                    }}
                                >
                                    Your cart is empty
                                </p>
                            )
                        ) : sidebarTab === 'Recently Viewed' ? (
                            recentlyViewed.length > 0 ? (
                                recentlyViewed.map((item) => (
                                    <Link
                                        key={item.id}
                                        to={`/products/${item.id}`}
                                        style={{
                                            display: 'flex', gap: 10,
                                            padding: '10px 0',
                                            borderBottom: '1px solid rgba(26,28,28,0.06)',
                                            textDecoration: 'none',
                                        }}
                                        className="hover:opacity-80 transition-opacity"
                                    >
                                        <div style={{ width: 52, height: 52, borderRadius: 8, background: '#f3f4f3', overflow: 'hidden', flexShrink: 0 }}>
                                            {item.image && <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <p style={{ fontSize: 12, fontWeight: 600, color: '#1a1c1c', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</p>
                                            <p style={{ fontSize: 11, color: '#9d4300', fontWeight: 700, marginTop: 3 }}>${Number(item.price).toFixed(0)}</p>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <p style={{ fontSize: 12, color: 'rgba(26,28,28,0.28)', textAlign: 'center', paddingTop: 48 }}>
                                    Aucun produit consulté récemment
                                </p>
                            )
                        ) : (
                            <p
                                style={{
                                    fontSize: 12,
                                    color: 'rgba(26,28,28,0.28)',
                                    textAlign: 'center',
                                    paddingTop: 48,
                                }}
                            >
                                Nothing here yet
                            </p>
                        )}
                    </div>

                    {/* Complete Purchase */}
                    <div style={{ padding: '12px 20px 28px' }}>
                        <Link
                            to="/cart"
                            style={{
                                display: 'block',
                                padding: '13px 0',
                                background: '#9d4300',
                                color: '#fff',
                                textAlign: 'center',
                                fontWeight: 700,
                                fontSize: 13,
                                borderRadius: 10,
                                textDecoration: 'none',
                                letterSpacing: '0.03em',
                                transition: 'opacity 0.2s',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.88')}
                            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                        >
                            Complete Purchase
                        </Link>
                    </div>
                </aside>
            )}

            {/* Reopen button when sidebar is closed */}
            {user && !showSidebar && (
                <button
                    onClick={() => setShowSidebar(true)}
                    title="Open cart"
                    style={{
                        position: 'fixed',
                        right: 0,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: '#9d4300',
                        color: '#fff',
                        border: 'none',
                        padding: '12px 6px',
                        borderRadius: '8px 0 0 8px',
                        cursor: 'pointer',
                        zIndex: 40,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '-4px 0 12px rgba(157,67,0,0.2)',
                    }}
                >
                    <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                        shopping_cart
                    </span>
                </button>
            )}
        </div>
    );
}
