import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Viewer3DModal from '../components/Viewer3DModal';

const FEED_POSTS = [
    { user: '@marcus_vibe',     color: '#0e7490', icon: 'view_in_ar'    },
    { user: '@clay_steel',      color: '#0891b2', icon: 'deployed_code' },
    { user: '@retro_aether',    color: '#155e75', icon: 'diamond'       },
    { user: '@gallery_spatial', color: '#164e63', icon: 'auto_awesome'  },
];

export default function HomePage() {
    const [products, setProducts] = useState([]);
    const [modal3D,  setModal3D]  = useState(null);
    const [heroIdx,  setHeroIdx]  = useState(0);

    useEffect(() => {
        api.get('/products').then((res) => setProducts(res.data.data?.slice(0, 4) ?? []));
    }, []);

    const hero = products[heroIdx] ?? null;

    return (
        <div style={{ background: '#f9f9f8', color: '#1a1c1c' }}>

            {/* ── HERO ─────────────────────────────────────────────── */}
            <section className="relative min-h-screen flex items-center pt-20" style={{ background: '#ffffff' }}>
                <div className="max-w-7xl mx-auto px-8 w-full grid lg:grid-cols-2 gap-16 items-center">

                    {/* Texte gauche */}
                    <div className="space-y-8">
                        <p style={{ fontSize: 11, fontWeight: 700, color: '#9d4300', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                            Next-Gen Commerce
                        </p>
                        <h1 className="font-extrabold tracking-tighter leading-[1.08]"
                            style={{ fontSize: 'clamp(2.5rem,5vw,4rem)', color: '#1a1c1c' }}>
                            Explore products like{' '}
                            <span style={{ color: '#9d4300', fontStyle: 'italic' }}>never before</span>
                        </h1>
                        <p style={{ color: '#584237', fontSize: '1rem', lineHeight: 1.7, maxWidth: 420 }}>
                            High-fidelity 3D environments where every texture, shadow and detail
                            is rendered with ethereal precision.
                        </p>
                        <div className="flex gap-4 flex-wrap">
                            <Link to="/shop"
                                className="px-8 py-4 font-bold rounded-xl text-white transition-all hover:opacity-90 hover:scale-105"
                                style={{ background: '#9d4300', fontSize: 14 }}>
                                Shop the Collection
                            </Link>
                            <Link to="/feed"
                                className="px-8 py-4 font-bold rounded-xl transition-all hover:bg-gray-100"
                                style={{ border: '1px solid rgba(26,28,28,0.15)', fontSize: 14, color: '#1a1c1c' }}>
                                Explore Feed
                            </Link>
                        </div>
                    </div>

                    {/* Image droite */}
                    <div className="flex flex-col items-center gap-5">
                        <div className="w-full rounded-3xl overflow-hidden relative"
                            style={{ aspectRatio: '4/3', background: '#f3f4f3', boxShadow: '0 32px 80px rgba(26,28,28,0.08)' }}>
                            {hero?.image ? (
                                <img src={hero.image} alt={hero.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <span className="material-symbols-outlined" style={{ fontSize: 64, color: 'rgba(26,28,28,0.1)' }}>deployed_code</span>
                                </div>
                            )}

                            {/* Badge produit */}
                            {hero && (
                                <div className="absolute bottom-5 left-5 px-4 py-3 rounded-2xl"
                                    style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                                    <p style={{ fontWeight: 700, fontSize: 13, color: '#1a1c1c' }}>{hero.name}</p>
                                    <p style={{ fontSize: 12, color: '#9d4300', fontWeight: 800 }}>${Number(hero.price).toFixed(0)}</p>
                                </div>
                            )}

                            {/* Bouton 3D */}
                            {hero && (
                                <button
                                    onClick={() => setModal3D({ name: hero.name, price: hero.price, index: heroIdx, categoryId: hero.category_id })}
                                    className="absolute top-4 right-4 px-3 py-1.5 rounded-full text-white font-bold text-xs transition-all hover:scale-105"
                                    style={{ background: '#9d4300', letterSpacing: '0.05em', boxShadow: '0 4px 12px rgba(157,67,0,0.35)' }}>
                                    3D VIEW
                                </button>
                            )}
                        </div>

                        {/* Miniatures */}
                        {products.length > 0 && (
                            <div className="flex gap-3">
                                {products.map((p, i) => (
                                    <button key={p.id} onClick={() => setHeroIdx(i)}
                                        className="rounded-xl overflow-hidden transition-all"
                                        style={{
                                            width: 60, height: 60,
                                            border: heroIdx === i ? '2px solid #9d4300' : '2px solid transparent',
                                            background: '#f3f4f3',
                                            opacity: heroIdx === i ? 1 : 0.5,
                                        }}>
                                        {p.image && <img src={p.image} alt={p.name} className="w-full h-full object-cover" />}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
                    <span style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 700, color: 'rgba(26,28,28,0.3)' }}>Scroll</span>
                    <span className="material-symbols-outlined animate-bounce" style={{ fontSize: 20, color: '#9d4300' }}>keyboard_arrow_down</span>
                </div>
            </section>

            {/* ── FEATURED SCULPTURES ──────────────────────────────── */}
            <section className="py-20" style={{ background: '#f9f9f8' }}>
                <div className="max-w-7xl mx-auto px-8">
                    <div className="flex justify-between items-end mb-10">
                        <div>
                            <p style={{ fontSize: 10, fontWeight: 700, color: '#9d4300', textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: 6 }}>Curation</p>
                            <h2 className="text-2xl font-extrabold tracking-tighter">Featured Sculptures</h2>
                        </div>
                        <Link to="/shop" style={{ fontSize: 13, fontWeight: 600, color: '#9d4300' }}
                            className="hover:opacity-75 transition-opacity">
                            View all →
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                        {(products.length > 0 ? products : Array(4).fill(null)).map((p, i) => (
                            <Link key={p?.id ?? i}
                                to={p ? `/products/${p.id}` : '/shop'}
                                className="group rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                                style={{ background: '#fff', border: '1px solid rgba(26,28,28,0.06)' }}>
                                <div className="relative overflow-hidden" style={{ height: 200, background: '#1a1c1c' }}>
                                    {p?.image ? (
                                        <img src={p.image} alt={p.name}
                                            className="w-full h-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <span className="material-symbols-outlined" style={{ fontSize: 40, color: 'rgba(255,255,255,0.15)' }}>deployed_code</span>
                                        </div>
                                    )}
                                    {p && (
                                        <button onClick={(e) => { e.preventDefault(); setModal3D({ name: p.name, price: p.price, index: i, categoryId: p.category_id }); }}
                                            className="absolute top-3 right-3 px-2 py-1 rounded-md text-[11px] font-bold transition-all hover:scale-110"
                                            style={{ background: '#9d4300', color: '#fff' }}>
                                            3D
                                        </button>
                                    )}
                                </div>
                                <div className="p-4">
                                    <p style={{ fontWeight: 700, fontSize: 13, color: '#1a1c1c', marginBottom: 4 }}>{p?.name ?? '—'}</p>
                                    <div className="flex justify-between items-center">
                                        <span style={{ fontSize: 10, color: '#584237', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{p?.category?.name ?? ''}</span>
                                        <span style={{ fontWeight: 800, fontSize: 13, color: '#9d4300' }}>
                                            {p ? `$${Number(p.price).toFixed(0)}` : '—'}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── SHARED BY THE COLLECTIVE ─────────────────────────── */}
            <section className="py-20" style={{ background: '#f9f9f8' }}>
                <div className="max-w-7xl mx-auto px-8">
                    <div className="text-center mb-12">
                        <p style={{ fontSize: 10, fontWeight: 700, color: '#9d4300', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 10 }}>The Feed</p>
                        <h2 className="text-2xl font-extrabold tracking-tighter">Shared by the Collective</h2>
                        <p style={{ color: '#584237', marginTop: 10, fontSize: 13, maxWidth: 420, margin: '10px auto 0' }}>
                            Real users, real perspectives — explore how the community styles their Aetheria pieces.
                        </p>
                    </div>

                    {/* Grille mosaïque */}
                    <div className="grid grid-cols-3 grid-rows-2 gap-4" style={{ height: 400 }}>
                        {/* Grande card gauche */}
                        <Link to="/feed"
                            className="row-span-2 rounded-2xl p-6 flex flex-col justify-between hover:opacity-90 transition-opacity"
                            style={{ background: FEED_POSTS[0].color, textDecoration: 'none' }}>
                            <span className="material-symbols-outlined" style={{ color: 'rgba(255,255,255,0.22)', fontSize: 52, alignSelf: 'flex-end' }}>
                                {FEED_POSTS[0].icon}
                            </span>
                            <div>
                                <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
                                    style={{ background: 'rgba(255,255,255,0.18)' }}>
                                    <span className="material-symbols-outlined" style={{ color: '#fff', fontSize: 20 }}>person</span>
                                </div>
                                <p style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>{FEED_POSTS[0].user}</p>
                                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, marginTop: 2 }}>View post →</p>
                            </div>
                        </Link>

                        {/* 3 petites cards à droite */}
                        {FEED_POSTS.slice(1).map((post, i) => (
                            <Link key={i} to="/feed"
                                className="rounded-2xl p-5 flex flex-col justify-between hover:opacity-90 transition-opacity"
                                style={{ background: post.color, textDecoration: 'none' }}>
                                <span className="material-symbols-outlined" style={{ color: 'rgba(255,255,255,0.2)', fontSize: 28, alignSelf: 'flex-end' }}>
                                    {post.icon}
                                </span>
                                <div>
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center mb-2"
                                        style={{ background: 'rgba(255,255,255,0.18)' }}>
                                        <span className="material-symbols-outlined" style={{ color: '#fff', fontSize: 16 }}>person</span>
                                    </div>
                                    <p style={{ color: '#fff', fontWeight: 600, fontSize: 11 }}>{post.user}</p>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div className="text-center mt-10">
                        <Link to="/feed"
                            className="inline-flex items-center gap-2 px-7 py-3 rounded-xl font-semibold transition-all hover:opacity-75"
                            style={{ border: '1px solid rgba(26,28,28,0.15)', color: '#1a1c1c', fontSize: 13 }}>
                            Explore the Feed
                            <span className="material-symbols-outlined" style={{ fontSize: 17 }}>arrow_forward</span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── FOOTER ───────────────────────────────────────────── */}
            <footer className="w-full pt-10 pb-8" style={{ background: '#f9f9f8', borderTop: '1px solid rgba(224,192,177,0.2)' }}>
                <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-5">
                    <div style={{ fontSize: 15, fontWeight: 900, letterSpacing: '-0.02em', color: '#1a1c1c' }}>AETHERIA</div>
                    <div className="flex flex-wrap justify-center gap-7"
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
                    product={{ name: modal3D.name, price: String(modal3D.price).replace('$', ''), category_id: modal3D.categoryId }}
                    productIndex={modal3D.index}
                    onClose={() => setModal3D(null)}
                />
            )}
        </div>
    );
}
