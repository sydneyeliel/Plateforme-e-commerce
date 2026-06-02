import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const SHOP_IMGS = [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBI3xrao_zOnHCFXfra0lZeNC2jpcloIJ1WG8IJOfQhO0-gCrg0JEEsPtQ1QNxpNCsRBL-xaDR1cPgphPt5q7CAbNTcrlGzzO12RKSRvWoxm_wdaBHLzbmN010mOMp22UHNW9eYCG2dgF-psjRIiovjoEeMFzWrGef4-Q4marXlSCyYK1rvGn4z6L98rdDUKLDjostVZrqcR55JBO7fy2JcKgJQaZ-sbyQVAOquysH37RH23E6y6ZTZ3ch-jXBGTIJRAWB7N9G-pMs',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAxml4Qu1PMB_rcM5iHDDJ_nbvhfU87U5pc69L8pfKhrRrtGTnvzVJvMBKFKAHMk-yTMV66QJOlDQIdNnfx4jV9PG3CILY41PQp0vRxK5OsoO2RhwlBOvAX1huLtQ7EiwRCFZCFJAThoZx7OSKCoCotQuq5eIzF8F3zh3JacLYA4RFDG__C_xxHpeGGroX8Gw6nHWT8nBCmLlw2y3z0mGplW8b-79YBRDZAlYrXmAFL1VTtL1Ek7H_lBpXhGBRCmYJAWTiNjZcfSPk',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBebbKPpzWTxgWm4yPhaQCOUKOT3M547gR2u0BlaxMhUGt9vxM9jPOcNUPZQaxJDfT9W_Jd_eyRC0CN8AGz6Z-EvrhFaqoWeLKn5beeorAJGWj3jPUG0X7Pyuc3PjpFbzIS5T7THFzzgGHaD4OuWsiebW7h0_tAFezeUqQojQaSRYtcuGG1RFMGwZw0FogRHs6fRo9yPpmZZIlsuagGNwQSKw1TOcRwKMFob3dmIJsQZGt8HqxhyGLmfAcCnHiNuyH9Gar-dbAeOfE',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuASR9-QzpBp59YLegyot90Xwltf_ly3w0c2eqeSUsndnFk_wIQObbIr0AVO3VZrKRBkd0ScGBzmk6oYVGdv1zpBTbTvcbdAjhRMCmIabzrquCUz7KqpbDFUmFb2pSXL-p_Ehuf_aqq7UunD59mDqqdBX1B3UwGnzfymxNrtf6CIAxMilWi0IjKZYFQhA7ldHbrtllBaU62LAUrjlmDgpPJ6PmvvfoUu0Ew68PZc1WFaJdS90nQEcs90_MsuYuVmEMVGBEZH_MGk9a0',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuC63wvjnbht-FTrCa69snB_uTfCLdg4vBgnyrJH3VOC0xYlDlkMz4T97QOtrJ4Af2Gc-ceucI6cjYjzyjyvlBjkdAHbnGeY3hes1nCa3j4CstXbaC_lEb5d-Ac1-DNm6KaVeQihl4moyu2j2LJSxMgtcBvX5alZiwKzdLaPItYWCABCcTUY5CGyOxjs1Gip53FaKrjCNwtrld1tfs1ND4PwbnVLgiXhXyY5GKSpay1GvHGbjG7COCrdUObUjOEEb8uxU9a6gPf79pE',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBEgjYLTytImIfskrbA0GTLCrPAmCCT2y5AFqTYcaY2J5hlY1jrO7lXesgkkIXMi5Fyu9_JV3Zu4t8hvvatx4bUP63NkmVI4I97-Jc7QsRGeG3Fx4s6sbWVqCUB3yB2JiKVWraKtHrvdVjUN53kCyQ477rjYmtkRiI5mQMfBIEvhC4PH5Kcyv3KOI2uD2Tuqz5y_oRP-4q-qn-sekXa-egXsbprG351I6l0rCraE57oow-c8JG8YE6QVs6OpINN6rSWayNN8OTsn_w',
];

export default function ShopPage() {
    const { user }              = useAuth();
    const { addToCart }         = useCart();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState('');
    const [search, setSearch]   = useState('');
    const [loading, setLoading] = useState(true);
    const [added, setAdded]     = useState(null);
    const [total, setTotal]     = useState(0);

    useEffect(() => {
        api.get('/categories').then((res) => setCategories(res.data));
    }, []);

    useEffect(() => {
        setLoading(true);
        const params = {};
        if (search)         params.search   = search;
        if (activeCategory) params.category = activeCategory;
        api.get('/products', { params })
            .then((res) => { setProducts(res.data.data); setTotal(res.data.total); })
            .finally(() => setLoading(false));
    }, [search, activeCategory]);

    async function handleAddToCart(productId) {
        if (!user) return;
        await addToCart(productId, 1);
        setAdded(productId);
        setTimeout(() => setAdded(null), 1500);
    }

    return (
        <div style={{background:'#f9f9f8', color:'#1a1c1c', minHeight:'100vh'}}>
            <main className="pt-32 pb-24 max-w-7xl mx-auto px-8">
                {/* Header */}
                <section className="mb-16">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                        <div>
                            <h1 className="font-extrabold tracking-tighter mb-4" style={{fontSize:'clamp(2.5rem,5vw,4rem)', lineHeight:1.1}}>
                                The Sculpted<br/>
                                <span style={{color:'#9d4300', fontStyle:'italic'}}>Catalog</span>
                            </h1>
                            <p className="max-w-md leading-relaxed" style={{color:'#584237'}}>
                                Discover a curated collection of tactile digital assets, meticulously crafted for the next generation of spatial experiences.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <button onClick={() => setActiveCategory('')}
                                className="px-6 py-2.5 rounded-full font-semibold text-sm transition-all"
                                style={activeCategory === '' ? {background:'#9d4300', color:'#fff', boxShadow:'0 4px 12px rgba(157,67,0,0.2)'} : {background:'#f3f4f3', color:'#1a1c1c'}}>
                                All
                            </button>
                            {categories.map((c) => (
                                <button key={c.id} onClick={() => setActiveCategory(c.id)}
                                    className="px-6 py-2.5 rounded-full font-medium text-sm transition-all"
                                    style={activeCategory === c.id ? {background:'#9d4300', color:'#fff'} : {background:'#f3f4f3', color:'#1a1c1c'}}>
                                    {c.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center justify-between py-6" style={{borderTop:'1px solid rgba(224,192,177,0.2)', borderBottom:'1px solid rgba(224,192,177,0.2)'}}>
                        <div className="flex items-center gap-2 text-sm" style={{color:'#584237'}}>
                            <span className="font-bold" style={{color:'#1a1c1c'}}>{total}</span> Items found
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="relative hidden md:block">
                                <input type="text" placeholder="Search objects..." value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="rounded-full px-6 py-2 text-sm focus:outline-none w-64"
                                    style={{background:'#f3f4f3', border:'none', color:'#1a1c1c'}}/>
                                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-lg" style={{color:'#584237'}}>search</span>
                            </div>
                            <button className="flex items-center gap-2 text-sm font-medium hover:text-[#9d4300] transition-colors">
                                <span className="material-symbols-outlined text-lg">tune</span>
                                Filters
                            </button>
                        </div>
                    </div>
                </section>

                {/* Grid */}
                {loading ? (
                    <p className="text-center py-20" style={{color:'#584237'}}>Chargement...</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                        {products.map((product, i) => (
                            <div key={product.id} className="group relative flex flex-col">
                                <div className="relative rounded-[1rem] overflow-hidden mb-6 transition-all duration-500 group-hover:-translate-y-1"
                                    style={{aspectRatio:'4/5', background:'#f3f4f3'}}>
                                    <img src={SHOP_IMGS[i % SHOP_IMGS.length]} alt={product.name}
                                        className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
                                        style={{mixBlendMode:'multiply'}}/>
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <Link to={`/products/${product.id}`}
                                            className="px-8 py-3 rounded-full font-bold text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                                            style={{background:'#1a1c1c', color:'#f9f9f8'}}>
                                            Quick View
                                        </Link>
                                    </div>
                                    <div className="absolute top-4 left-4">
                                        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest glass-panel"
                                            style={{color:'#1a1c1c'}}>NEW</span>
                                    </div>
                                </div>
                                <div className="flex flex-col flex-grow px-2">
                                    <div className="flex justify-between items-start mb-2">
                                        <Link to={`/products/${product.id}`}>
                                            <h3 className="text-xl font-bold tracking-tight hover:text-[#9d4300] transition-colors">{product.name}</h3>
                                        </Link>
                                        <span className="text-lg font-extrabold" style={{color:'#9d4300'}}>${product.price}</span>
                                    </div>
                                    <p className="text-sm leading-relaxed mb-6" style={{color:'#584237'}}>{product.description}</p>
                                    <div className="mt-auto pt-4 flex items-center justify-between"
                                        style={{borderTop:'1px solid rgba(224,192,177,0.1)'}}>
                                        <div className="flex items-center gap-4">
                                            <button className="flex items-center gap-1.5 transition-colors hover:text-[#9d4300]"
                                                style={{color:'#584237'}}>
                                                <span className="material-symbols-outlined text-lg">favorite</span>
                                                <span className="text-xs font-semibold">0</span>
                                            </button>
                                            <button className="flex items-center gap-1.5 transition-colors hover:text-[#9d4300]"
                                                style={{color:'#584237'}}>
                                                <span className="material-symbols-outlined text-lg">chat_bubble</span>
                                                <span className="text-xs font-semibold">0</span>
                                            </button>
                                        </div>
                                        <button onClick={() => handleAddToCart(product.id)}
                                            disabled={product.stock === 0 || !user}
                                            className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
                                            style={{border:'1px solid rgba(224,192,177,0.3)', color:'#1a1c1c'}}
                                            title={!user ? 'Connectez-vous' : 'Ajouter au panier'}
                                            onMouseEnter={e => { e.currentTarget.style.background='#9d4300'; e.currentTarget.style.color='#fff'; e.currentTarget.style.borderColor='#9d4300'; }}
                                            onMouseLeave={e => { e.currentTarget.style.background=''; e.currentTarget.style.color='#1a1c1c'; e.currentTarget.style.borderColor='rgba(224,192,177,0.3)'; }}>
                                            {added === product.id
                                                ? <span className="material-symbols-outlined text-xl">check</span>
                                                : <span className="material-symbols-outlined text-xl">add_shopping_cart</span>
                                            }
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <footer className="w-full pt-12 pb-8 mt-24" style={{borderTop:'1px solid rgba(224,192,177,0.2)', background:'#f9f9f8'}}>
                <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6"
                    style={{fontSize:'10px', textTransform:'uppercase', letterSpacing:'0.05em', color:'rgba(26,28,28,0.4)'}}>
                    <div className="text-lg font-black" style={{color:'#1a1c1c'}}>AETHERIA</div>
                    <div className="flex flex-wrap justify-center gap-8">
                        {['Imprint','Terms of Service','Creator Policy','Sustainability'].map(l => (
                            <a key={l} href="#" className="underline underline-offset-4 hover:text-[#F97316] transition-all">{l}</a>
                        ))}
                    </div>
                    <div>© 2026 Aetheria Tactile. All rights reserved.</div>
                </div>
            </footer>
        </div>
    );
}
