import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Viewer3DModal from '../components/Viewer3DModal';

const CATEGORY_VISUALS = {
    Tech:   { icon: 'memory',      color: '#0e7490', light: '#ecfeff' },
    Living: { icon: 'lamp',        color: '#9d4300', light: '#fff7ed' },
    Wear:   { icon: 'footprint',   color: '#4f46e5', light: '#eef2ff' },
};

const FEATURES = [
    { icon: 'view_in_ar',     title: 'True 3D Preview',     desc: 'Spin, zoom and inspect every detail before buying. No surprises.' },
    { icon: 'verified',       title: 'Certified Quality',   desc: 'Every object is reviewed and validated by our curation team.' },
    { icon: 'local_shipping', title: 'Fast Delivery',       desc: 'Worldwide shipping with real-time tracking on every order.' },
];

const STATS = [
    { value: '500+',  label: 'Objects sold'    },
    { value: '3D',    label: 'Native viewer'   },
    { value: '4.9★',  label: 'Average rating'  },
    { value: '120+',  label: 'Creators'        },
];

const FEED_POSTS = [
    { user: '@marcus_vibe',     color: '#0e7490', icon: 'view_in_ar'    },
    { user: '@clay_steel',      color: '#0891b2', icon: 'deployed_code' },
    { user: '@retro_aether',    color: '#155e75', icon: 'diamond'       },
    { user: '@gallery_spatial', color: '#164e63', icon: 'auto_awesome'  },
];

export default function HomePage() {
    const [products,   setProducts]   = useState([]);
    const [categories, setCategories] = useState([]);
    const [modal3D,    setModal3D]    = useState(null);
    const [heroIdx,    setHeroIdx]    = useState(0);

    useEffect(() => {
        api.get('/products').then((res) => setProducts(res.data.data?.slice(0, 4) ?? []));
        api.get('/categories').then((res) => setCategories(res.data ?? []));
    }, []);

    const heroProduct = products[heroIdx] ?? null;

    return (
        <div style={{ background: '#f9f9f8', color: '#1a1c1c' }}>

            {/* ── HERO ─────────────────────────────────────────────── */}
            <section className="relative min-h-screen flex items-center pt-20" style={{ background: '#fff' }}>
                <div className="max-w-7xl mx-auto px-8 w-full grid lg:grid-cols-2 gap-16 items-center">

                    <div className="space-y-8">
                        <p style={{ fontSize: 12, fontWeight: 700, color: '#9d4300', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                            Next-Gen Commerce
                        </p>
                        <h1 className="font-extrabold tracking-tighter leading-tight" style={{ fontSize: 'clamp(2.5rem,5vw,4rem)' }}>
                            Explore products like{' '}
                            <span style={{ color: '#9d4300', fontStyle: 'italic' }}>never before</span>
                        </h1>
                        <p style={{ color: '#584237', fontSize: '1rem', lineHeight: 1.7, maxWidth: 440 }}>
                            High-fidelity 3D environments where every texture, shadow and detail
                            is rendered with ethereal precision. Touch the future of commerce.
                        </p>
                        <div className="flex gap-4 flex-wrap pt-2">
                            <Link to="/shop"
                                className="px-8 py-4 font-bold rounded-xl text-white transition-all hover:opacity-90 hover:scale-105"
                                style={{ background: '#9d4300', fontSize: 14, letterSpacing: '0.03em' }}>
                                Shop the Collection
                            </Link>
                            <Link to="/feed"
                                className="px-8 py-4 font-bold rounded-xl transition-all hover:bg-gray-100"
                                style={{ border: '1px solid rgba(26,28,28,0.15)', fontSize: 14, color: '#1a1c1c' }}>
                                Explore Feed
                            </Link>
                        </div>
                    </div>

                    <div className="relative flex flex-col items-center gap-6">
                        <div className="w-full rounded-3xl overflow-hidden relative"
                            style={{ aspectRatio: '4/3', background: '#f3f4f3', boxShadow: '0 32px 80px rgba(26,28,28,0.1)' }}>
                            {heroProduct?.image ? (
                                <img src={heroProduct.image} alt={heroProduct.name} className="w-full h-full object-cover" />
                            ) : (
                                <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=600&fit=crop&q=80"
                                    alt="hero product" className="w-full h-full object-cover" />
                            )}
                            {heroProduct && (
                                <div className="absolute bottom-5 left-5 px-4 py-3 rounded-2xl"
                                    style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                                    <p style={{ fontWeight: 700, fontSize: 13, color: '#1a1c1c' }}>{heroProduct.name}</p>
                                    <p style={{ fontSize: 12, color: '#9d4300', fontWeight: 800 }}>${Number(heroProduct.price).toFixed(0)}</p>
                                </div>
                            )}
                            {heroProduct && (
                                <button
                                    onClick={() => setModal3D({ name: heroProduct.name, price: `$${heroProduct.price}`, index: heroIdx, categoryId: heroProduct.category_id })}
                                    className="absolute top-4 right-4 px-3 py-1.5 rounded-full text-white font-bold text-xs transition-all hover:scale-105"
                                    style={{ background: '#9d4300', letterSpacing: '0.05em', boxShadow: '0 4px 12px rgba(157,67,0,0.35)' }}>
                                    3D VIEW
                                </button>
                            )}
                        </div>

                        {products.length > 0 && (
                            <div className="flex gap-3">
                                {products.map((p, i) => (
                                    <button key={p.id} onClick={() => setHeroIdx(i)}
                                        className="rounded-xl overflow-hidden transition-all"
                                        style={{ width: 64, height: 64, border: heroIdx === i ? '2px solid #9d4300' : '2px solid transparent', background: '#f3f4f3', opacity: heroIdx === i ? 1 : 0.55 }}>
                                        {p.image && <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
                    <span style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 700, color: 'rgba(26,28,28,0.35)' }}>Scroll</span>
                    <span className="material-symbols-outlined animate-bounce" style={{ color: '#9d4300' }}>keyboard_arrow_down</span>
                </div>
            </section>

            {/* ── STATS BAR ────────────────────────────────────────── */}
            <section style={{ background: '#1a1c1c', color: '#fff' }}>
                <div className="max-w-7xl mx-auto px-8 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
                    {STATS.map((s) => (
                        <div key={s.label} className="text-center">
                            <p className="font-extrabold tracking-tighter" style={{ fontSize: '2rem', color: '#f97316' }}>{s.value}</p>
                            <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.45)', marginTop: 4 }}>{s.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── FEATURED PRODUCTS ────────────────────────────────── */}
            <section className="py-24" style={{ background: '#f9f9f8' }}>
                <div className="max-w-7xl mx-auto px-8">
                    <div className="flex justify-between items-end mb-10">
                        <div>
                            <p style={{ fontSize: 11, fontWeight: 700, color: '#9d4300', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 8 }}>Curation</p>
                            <h2 className="text-3xl font-extrabold tracking-tighter">Featured Sculptures</h2>
                        </div>
                        <Link to="/shop" style={{ fontSize: 13, fontWeight: 600, color: '#9d4300' }} className="hover:opacity-75 transition-opacity">
                            View all →
                        </Link>
                    </div>

                    <div className="flex gap-6 overflow-x-auto pb-4 hide-scrollbar">
                        {(products.length > 0 ? products : Array(4).fill(null)).map((product, i) => (
                            <Link key={product?.id ?? i} to={product ? `/products/${product.id}` : '/shop'}
                                className="group flex-shrink-0 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                                style={{ width: 260, background: '#fff', border: '1px solid rgba(26,28,28,0.07)' }}>
                                <div className="relative overflow-hidden" style={{ height: 240, background: '#f3f4f3' }}>
                                    {product?.image ? (
                                        <img src={product.image} alt={product.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <span className="material-symbols-outlined" style={{ fontSize: 48, color: 'rgba(26,28,28,0.15)' }}>deployed_code</span>
                                        </div>
                                    )}
                                    <span className="absolute top-3 left-3 px-2 py-1 rounded-md text-xs font-bold"
                                        style={{ background: 'rgba(255,255,255,0.9)', color: '#584237' }}>
                                        {product?.category?.name ?? 'Aetheria'}
                                    </span>
                                    {product && (
                                        <button onClick={(e) => { e.preventDefault(); setModal3D({ name: product.name, price: `$${product.price}`, index: i, categoryId: product.category_id }); }}
                                            className="absolute top-3 right-3 px-2 py-1 rounded-md text-xs font-bold transition-all hover:scale-110"
                                            style={{ background: '#9d4300', color: '#fff' }}>
                                            3D
                                        </button>
                                    )}
                                </div>
                                <div className="p-4">
                                    <h3 style={{ fontWeight: 700, fontSize: 14, color: '#1a1c1c', marginBottom: 6 }}>{product?.name ?? '—'}</h3>
                                    <div className="flex justify-between items-center">
                                        <span style={{ fontSize: 11, color: '#584237' }}>{product?.category?.name ?? ''}</span>
                                        <span style={{ fontWeight: 800, fontSize: 14, color: '#9d4300' }}>
                                            {product ? `$${Number(product.price).toFixed(0)}` : '—'}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CATEGORIES ───────────────────────────────────────── */}
            <section className="py-24" style={{ background: '#fff' }}>
                <div className="max-w-7xl mx-auto px-8">
                    <div className="text-center mb-14">
                        <p style={{ fontSize: 11, fontWeight: 700, color: '#9d4300', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 8 }}>Browse</p>
                        <h2 className="text-3xl font-extrabold tracking-tighter">Shop by Category</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {(categories.length > 0 ? categories : [
                            { id: 1, name: 'Tech',   description: 'Gadgets, audio et interfaces numériques' },
                            { id: 2, name: 'Living', description: 'Objets de décoration et luminaires' },
                            { id: 3, name: 'Wear',   description: 'Chaussures, lunettes et accessoires' },
                        ]).map((cat) => {
                            const visual = CATEGORY_VISUALS[cat.name] ?? { icon: 'category', color: '#9d4300', light: '#fff7ed' };
                            return (
                                <Link key={cat.id} to={`/shop?category=${cat.id}`}
                                    className="group rounded-2xl p-8 flex flex-col gap-5 transition-all hover:-translate-y-1 hover:shadow-lg"
                                    style={{ background: visual.light, border: `1px solid ${visual.color}20` }}>
                                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                                        style={{ background: visual.color }}>
                                        <span className="material-symbols-outlined text-white" style={{ fontSize: 28 }}>{visual.icon}</span>
                                    </div>
                                    <div>
                                        <h3 className="font-extrabold text-lg tracking-tight mb-1" style={{ color: '#1a1c1c' }}>{cat.name}</h3>
                                        <p style={{ fontSize: 13, color: '#584237', lineHeight: 1.5 }}>{cat.description}</p>
                                    </div>
                                    <span className="text-sm font-bold transition-colors group-hover:underline underline-offset-4"
                                        style={{ color: visual.color }}>
                                        Explore {cat.name} →
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── WHY 3D ───────────────────────────────────────────── */}
            <section className="py-24" style={{ background: '#f9f9f8' }}>
                <div className="max-w-7xl mx-auto px-8">
                    <div className="text-center mb-14">
                        <p style={{ fontSize: 11, fontWeight: 700, color: '#9d4300', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 8 }}>Experience</p>
                        <h2 className="text-3xl font-extrabold tracking-tighter">Why Aetheria?</h2>
                        <p style={{ color: '#584237', marginTop: 12, fontSize: 14, maxWidth: 440, margin: '12px auto 0' }}>
                            We built a new standard for online shopping — one where you see every detail before you buy.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {FEATURES.map((f) => (
                            <div key={f.title} className="rounded-2xl p-8 text-center flex flex-col items-center gap-5"
                                style={{ background: '#fff', border: '1px solid rgba(26,28,28,0.06)', boxShadow: '0 8px 32px rgba(26,28,28,0.04)' }}>
                                <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                                    style={{ background: 'linear-gradient(to bottom right, #9d4300, #f97316)' }}>
                                    <span className="material-symbols-outlined text-white" style={{ fontSize: 30 }}>{f.icon}</span>
                                </div>
                                <h3 className="font-extrabold text-base tracking-tight" style={{ color: '#1a1c1c' }}>{f.title}</h3>
                                <p style={{ fontSize: 13, color: '#584237', lineHeight: 1.6 }}>{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── COLLECTIVE FEED ──────────────────────────────────── */}
            <section className="py-24" style={{ background: '#fff' }}>
                <div className="max-w-7xl mx-auto px-8">
                    <div className="text-center mb-16">
                        <p style={{ fontSize: 11, fontWeight: 700, color: '#9d4300', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 12 }}>The Feed</p>
                        <h2 className="text-4xl font-extrabold tracking-tighter">Shared by the Collective</h2>
                        <p style={{ color: '#584237', marginTop: 12, fontSize: 14, maxWidth: 480, margin: '12px auto 0' }}>
                            Real users, real perspectives — explore how the community styles their Aetheria pieces.
                        </p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '200px 200px', gap: 16 }}>
                        <Link to="/feed"
                            style={{ gridRow: 'span 2', background: FEED_POSTS[0].color, borderRadius: 24, padding: 28, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', textDecoration: 'none' }}
                            className="hover:opacity-90 transition-opacity">
                            <span className="material-symbols-outlined" style={{ color: 'rgba(255,255,255,0.25)', fontSize: 56, alignSelf: 'flex-end' }}>{FEED_POSTS[0].icon}</span>
                            <div>
                                <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                                    <span className="material-symbols-outlined" style={{ color: '#fff', fontSize: 22 }}>person</span>
                                </div>
                                <p style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>{FEED_POSTS[0].user}</p>
                                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginTop: 3 }}>View post →</p>
                            </div>
                        </Link>
                        {FEED_POSTS.slice(1).map((post, i) => (
                            <Link key={i} to="/feed"
                                style={{ background: post.color, borderRadius: 20, padding: 20, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', textDecoration: 'none' }}
                                className="hover:opacity-90 transition-opacity">
                                <span className="material-symbols-outlined" style={{ color: 'rgba(255,255,255,0.22)', fontSize: 32, alignSelf: 'flex-end' }}>{post.icon}</span>
                                <div>
                                    <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                                        <span className="material-symbols-outlined" style={{ color: '#fff', fontSize: 16 }}>person</span>
                                    </div>
                                    <p style={{ color: '#fff', fontWeight: 600, fontSize: 12 }}>{post.user}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                    <div className="text-center mt-12">
                        <Link to="/feed"
                            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all hover:opacity-80"
                            style={{ border: '1px solid rgba(26,28,28,0.15)', color: '#1a1c1c', fontSize: 14 }}>
                            Explore the Feed
                            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_forward</span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── CTA BANNER ───────────────────────────────────────── */}
            <section className="py-20 mx-8 mb-12 rounded-3xl overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #1a1c1c 0%, #2d1a0e 60%, #9d4300 100%)' }}>
                <div className="max-w-2xl mx-auto px-8 text-center">
                    <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(249,115,22,0.8)', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 16 }}>
                        Ready to explore?
                    </p>
                    <h2 className="font-extrabold tracking-tighter text-white mb-6" style={{ fontSize: 'clamp(1.75rem,4vw,3rem)' }}>
                        Start your 3D shopping experience today
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 15, lineHeight: 1.7, marginBottom: 32 }}>
                        Join thousands of collectors and creators who discover unique 3D objects on Aetheria every day.
                    </p>
                    <div className="flex justify-center gap-4 flex-wrap">
                        <Link to="/shop"
                            className="px-8 py-4 rounded-xl font-bold text-white transition-all hover:scale-105"
                            style={{ background: '#f97316', fontSize: 14 }}>
                            Browse the Market
                        </Link>
                        <Link to="/register"
                            className="px-8 py-4 rounded-xl font-bold transition-all hover:bg-white hover:text-[#1a1c1c]"
                            style={{ border: '1px solid rgba(255,255,255,0.25)', color: '#fff', fontSize: 14 }}>
                            Create an account
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── FOOTER ───────────────────────────────────────────── */}
            <footer className="w-full pt-12 pb-8" style={{ background: '#f9f9f8', borderTop: '1px solid rgba(224,192,177,0.2)' }}>
                <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div style={{ fontSize: 16, fontWeight: 900, letterSpacing: '-0.02em', color: '#1a1c1c' }}>AETHERIA</div>
                    <div className="flex flex-wrap justify-center gap-8"
                        style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'rgba(26,28,28,0.4)' }}>
                        {['Imprint', 'Terms of Service', 'Creator Policy', 'Sustainability'].map((l) => (
                            <a key={l} href="#" className="hover:text-[#9d4300] underline underline-offset-4 transition-colors">{l}</a>
                        ))}
                    </div>
                    <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'rgba(26,28,28,0.4)' }}>
                        © 2026 Aetheria Tactile. All rights reserved.
                    </div>
                </div>
            </footer>

            {modal3D && (
                <Viewer3DModal
                    product={{ name: modal3D.name, price: modal3D.price?.replace('$', ''), category_id: modal3D.categoryId }}
                    productIndex={modal3D.index}
                    onClose={() => setModal3D(null)}
                />
            )}
        </div>
    );
}
