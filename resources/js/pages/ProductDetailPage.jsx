import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import ProductViewer3D from '../components/ProductViewer3D';

const CATEGORY_IMGS = {
    1: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop&q=85',
    2: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&h=800&fit=crop&q=85',
    3: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop&q=85',
};

const COMMUNITY_IMGS = [
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&h=400&fit=crop&q=80',
    'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400&h=400&fit=crop&q=80',
];

export default function ProductDetailPage() {
    const { id }        = useParams();
    const { user }      = useAuth();
    const { addToCart } = useCart();
    const { addToast }  = useToast();
    const navigate      = useNavigate();

    const [product, setProduct]               = useState(null);
    const [loading, setLoading]               = useState(true);
    const [adding, setAdding]                 = useState(false);
    const [quantity, setQuantity]             = useState(1);
    const [selectedFinish, setSelectedFinish] = useState('Ochre Clay');
    const [selectedSize, setSelectedSize]     = useState('Medium');
    const [show3D, setShow3D]                 = useState(false);
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);

    useEffect(() => {
        api.get(`/products/${id}`)
            .then((res) => setProduct(res.data))
            .finally(() => setLoading(false));
    }, [id]);

    async function handleAddToCart() {
        if (!user) { setShowLoginPrompt(true); return; }
        if (product.stock === 0) { addToast('Ce produit est indisponible', 'error'); return; }
        setAdding(true);
        try {
            await addToCart(product.id, quantity);
            addToast(`${product.name} × ${quantity} ajouté au panier`, 'cart');
        } catch {
            addToast('Erreur lors de l\'ajout au panier', 'error');
        } finally {
            setAdding(false);
        }
    }

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: '#f9f9f8' }}>
            <div style={{ textAlign: 'center' }}>
                <div className="skeleton" style={{ width: 48, height: 48, borderRadius: '50%', margin: '0 auto 16px' }} />
                <div className="skeleton" style={{ width: 120, height: 12, margin: '0 auto' }} />
            </div>
        </div>
    );
    if (!product) return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: '#f9f9f8' }}>
            <p style={{ color: '#584237' }}>Produit introuvable.</p>
        </div>
    );

    const productImg = product.image || CATEGORY_IMGS[product.category_id] || CATEGORY_IMGS[1];

    return (
        <div style={{ background: '#f9f9f8', color: '#1a1c1c', minHeight: '100vh' }}>
            <main className="pt-[56px] min-h-screen">
                <section className="flex flex-col lg:flex-row" style={{ minHeight: 'calc(100vh - 56px)' }}>

                    {/* ── Panneau gauche : Photo ou Vue 3D ── */}
                    <div className="lg:w-[60%] relative flex flex-col" style={{ background: '#eeeeed', minHeight: 500 }}>

                        {/* Boutons de bascule */}
                        <div className="absolute top-4 left-4 z-30 flex gap-2">
                            <button
                                onClick={() => setShow3D(false)}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all"
                                style={!show3D
                                    ? { background: '#9d4300', color: '#fff', boxShadow: '0 4px 12px rgba(157,67,0,0.28)' }
                                    : { background: 'rgba(249,249,248,0.75)', color: '#584237', backdropFilter: 'blur(10px)' }}>
                                <span className="material-symbols-outlined text-base">image</span>
                                Photo
                            </button>
                            <button
                                onClick={() => setShow3D(true)}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all"
                                style={show3D
                                    ? { background: '#9d4300', color: '#fff', boxShadow: '0 4px 12px rgba(157,67,0,0.28)' }
                                    : { background: 'rgba(249,249,248,0.75)', color: '#584237', backdropFilter: 'blur(10px)' }}>
                                <span className="material-symbols-outlined text-base">view_in_ar</span>
                                Vue 3D
                            </button>
                        </div>

                        {show3D ? (
                            /* ── Vue 3D interactive ── */
                            <ProductViewer3D
                                productName={product.name}
                                categoryId={product.category_id}
                                productIndex={Math.max(0, (product.id ?? 1) - 1)}
                                height="calc(100vh - 56px)"
                            />
                        ) : (
                            /* ── Photo du produit ── */
                            <div className="flex-1 flex items-center justify-center relative overflow-hidden" style={{ minHeight: 500 }}>
                                <img
                                    src={productImg}
                                    alt={product.name}
                                    className="w-full h-full object-contain"
                                    style={{ padding: '3rem', maxHeight: 'calc(100vh - 56px)' }}
                                />
                                <div style={{
                                    position: 'absolute', inset: 0, pointerEvents: 'none',
                                    background: 'radial-gradient(ellipse at center, transparent 50%, rgba(238,238,237,0.6) 100%)',
                                }} />
                                {/* Invitation à activer la 3D */}
                                <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
                                    <button
                                        onClick={() => setShow3D(true)}
                                        className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all hover:scale-105"
                                        style={{ background: '#9d4300', color: '#fff', boxShadow: '0 8px 24px rgba(157,67,0,0.3)' }}>
                                        <span className="material-symbols-outlined">view_in_ar</span>
                                        Voir en 3D interactif
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ── Panneau droit : Infos produit ── */}
                    <div className="lg:w-[40%] p-8 lg:p-12 xl:p-16 overflow-y-auto" style={{ background: '#ffffff' }}>
                        <div className="sticky top-8">
                            <nav className="flex items-center gap-2 mb-8" style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#584237' }}>
                                <a href="#" className="hover:text-[#9d4300] transition-colors">Discover</a>
                                <span className="material-symbols-outlined text-xs">chevron_right</span>
                                <a href="#" className="hover:text-[#9d4300] transition-colors">Collection</a>
                                <span className="material-symbols-outlined text-xs">chevron_right</span>
                                <span style={{ color: '#1a1c1c', fontWeight: 700 }}>{product.name}</span>
                            </nav>

                            <div className="inline-block px-3 py-1 rounded-full text-[10px] font-bold tracking-tighter mb-4"
                                style={{ background: '#ffdbca', color: '#783200' }}>NEW COLLECTION</div>

                            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tighter mb-4">{product.name}</h1>
                            <p className="text-3xl font-bold mb-8" style={{ color: '#9d4300' }}>${product.price}</p>
                            <p className="leading-relaxed mb-10 text-lg" style={{ color: '#584237' }}>{product.description}</p>

                            <div className="space-y-8 mb-12">
                                <div>
                                    <label style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(26,28,28,0.4)', display: 'block', marginBottom: 16 }}>Material Finish</label>
                                    <div className="flex flex-wrap gap-3">
                                        {['Ochre Clay', 'Stone Matte', 'Glacial Frost'].map(f => (
                                            <button key={f} onClick={() => setSelectedFinish(f)}
                                                className="px-6 py-2 rounded-full text-sm font-medium transition-all"
                                                style={selectedFinish === f
                                                    ? { border: '2px solid #9d4300', color: '#9d4300', fontWeight: 700 }
                                                    : { background: '#f3f4f3', color: '#584237' }}>
                                                {f}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(26,28,28,0.4)', display: 'block', marginBottom: 16 }}>Size Variant</label>
                                    <div className="flex flex-wrap gap-3">
                                        {['Small', 'Medium', 'Large'].map(s => (
                                            <button key={s} onClick={() => setSelectedSize(s)}
                                                className="px-6 py-2 rounded-full text-sm font-medium transition-all"
                                                style={selectedSize === s
                                                    ? { border: '2px solid #9d4300', color: '#9d4300', fontWeight: 700 }
                                                    : { background: '#f3f4f3', color: '#584237' }}>
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Sélecteur de quantité */}
                            <div className="flex items-center gap-4 mb-8">
                                <span style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(26,28,28,0.4)' }}>Quantité</span>
                                <div className="flex items-center rounded-xl overflow-hidden" style={{ border: '1px solid rgba(26,28,28,0.12)' }}>
                                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                        className="w-10 h-10 flex items-center justify-center transition-colors hover:bg-gray-100"
                                        style={{ color: '#1a1c1c', fontSize: 18 }}>−</button>
                                    <span className="w-10 text-center font-bold text-sm">{quantity}</span>
                                    <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                                        className="w-10 h-10 flex items-center justify-center transition-colors hover:bg-gray-100"
                                        style={{ color: '#1a1c1c', fontSize: 18 }}>+</button>
                                </div>
                                <span style={{ fontSize: 12, color: '#584237' }}>{product.stock} en stock</span>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 mb-12">
                                <button onClick={handleAddToCart} disabled={adding || product.stock === 0}
                                    className="flex-1 py-5 rounded-lg font-bold text-white flex justify-center items-center gap-2 transition-all active:scale-95 disabled:opacity-60"
                                    style={{ background: 'linear-gradient(to right, #9d4300, #f97316)', boxShadow: '0 10px 20px rgba(157,67,0,0.2)' }}>
                                    <span className="material-symbols-outlined">
                                        {adding ? 'hourglass_empty' : product.stock === 0 ? 'remove_shopping_cart' : 'shopping_cart'}
                                    </span>
                                    {adding ? 'Ajout en cours...' : product.stock === 0 ? 'Rupture de stock' : 'Add to Cart'}
                                </button>
                                <button className="px-8 py-5 rounded-lg font-bold flex justify-center items-center transition-colors hover:bg-red-50"
                                    style={{ border: '1px solid rgba(224,192,177,0.3)', color: '#1a1c1c' }}>
                                    <span className="material-symbols-outlined">favorite_border</span>
                                </button>
                            </div>

                            <div className="space-y-2">
                                {['Technical Specifications', 'Sustainability & Shipping'].map((item, i) => (
                                    <div key={item} className="p-6 rounded-xl" style={{ background: '#f3f4f3' }}>
                                        <div className="flex justify-between items-center cursor-pointer">
                                            <span className="font-bold">{item}</span>
                                            <span className="material-symbols-outlined">{i === 0 ? 'add' : 'expand_more'}</span>
                                        </div>
                                        {i === 1 && (
                                            <p className="mt-4 text-sm leading-relaxed" style={{ color: '#584237' }}>
                                                Livraison sous 5-7 jours ouvrés. Retours gratuits sous 30 jours. Emballage éco-responsable.
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Ce que dit la communauté ── */}
                <section className="max-w-7xl mx-auto px-8 py-24">
                    <div className="mb-16 text-center">
                        <h2 className="text-4xl font-extrabold tracking-tighter mb-4">What the community says</h2>
                        <p style={{ color: '#584237' }}>Real-time captures and impressions from Aetheria owners across the globe.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 md:row-span-2 relative group rounded-3xl overflow-hidden shadow-sm" style={{ background: '#f3f4f3', minHeight: 320 }}>
                            <img src={COMMUNITY_IMGS[0]} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                            <div className="absolute inset-0 flex flex-col justify-end p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                style={{ background: 'linear-gradient(to top, rgba(26,28,28,0.8), transparent)' }}>
                                <p className="text-white text-lg">"Qualité exceptionnelle, exactement ce que j'attendais."</p>
                            </div>
                        </div>
                        {COMMUNITY_IMGS.slice(1).map((img, i) => (
                            <div key={i} className="relative group rounded-3xl overflow-hidden shadow-sm aspect-square" style={{ background: '#f3f4f3' }}>
                                <img src={img} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            {/* Modal connexion requise */}
            {showLoginPrompt && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    style={{ background: 'rgba(26,28,28,0.5)', backdropFilter: 'blur(4px)' }}
                    onClick={() => setShowLoginPrompt(false)}>
                    <div className="w-full max-w-sm rounded-2xl p-8 text-center animate-fade-in-up"
                        style={{ background: '#fff', boxShadow: '0 32px 80px rgba(0,0,0,0.2)' }}
                        onClick={e => e.stopPropagation()}>
                        <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-5"
                            style={{ background: '#fff7ed' }}>
                            <span className="material-symbols-outlined" style={{ color: '#9d4300', fontSize: 32 }}>lock</span>
                        </div>
                        <h3 className="text-xl font-extrabold tracking-tight mb-2">Connexion requise</h3>
                        <p style={{ color: '#584237', fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>
                            Connectez-vous pour acheter <strong>{product.name}</strong> et profiter de toutes les fonctionnalités Aetheria.
                        </p>
                        <div className="flex gap-3">
                            <button onClick={() => setShowLoginPrompt(false)}
                                className="flex-1 py-3 rounded-xl font-semibold text-sm transition-colors hover:bg-gray-100"
                                style={{ border: '1px solid rgba(26,28,28,0.12)', color: '#584237' }}>
                                Continuer à explorer
                            </button>
                            <button onClick={() => navigate('/login')}
                                className="flex-1 py-3 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90"
                                style={{ background: 'linear-gradient(to right, #9d4300, #f97316)' }}>
                                Se connecter
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <footer className="w-full pt-12 pb-8" style={{ borderTop: '1px solid rgba(224,192,177,0.2)', background: '#f9f9f8' }}>
                <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6"
                    style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(26,28,28,0.4)' }}>
                    <div className="text-lg font-black" style={{ color: '#1a1c1c' }}>AETHERIA TACTILE</div>
                    <div className="flex flex-wrap justify-center gap-8">
                        {['Imprint', 'Terms of Service', 'Creator Policy', 'Sustainability'].map(l => (
                            <a key={l} href="#" className="underline underline-offset-4 hover:text-[#F97316] transition-all">{l}</a>
                        ))}
                    </div>
                    <div>© 2026 Aetheria Tactile. All rights reserved.</div>
                </div>
            </footer>
        </div>
    );
}
