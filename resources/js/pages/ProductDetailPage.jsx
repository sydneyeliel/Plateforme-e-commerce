import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const PRODUCT_IMG = 'https://lh3.googleusercontent.com/aida-public/AB6AXuClfOlzd3yu-kLO7gG5uXQEtTbPab1HmjBdr57z8h_GaTl9s2qwIxq_BmCl9QbMjWpg4ZyVItHpBdo2ljn7JdARre2TKye6KdTtofoUd2LAOPlZistJAlqugIsGYXJkdt6NkjBHyRKfJsahnhIeGj_HCAFYkgDjh7tOcnvPPOf44d6EA9YJpSbfXTSNpWOlboBlT9Cl7XP5lc5dkGmGu-_qxldv-TYHUO1rJWh6J-KgkRsZ7irP3Xd-1ikiABI933qgYizQuuXxlu4';
const COMMUNITY_IMGS = [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBMJm0GzoMfTkQQT7LZzUoItsWFJJ66CVsET9wTenWgeTYgSqElPNj4j_Y0uJCWW4OYm1xSIy217EAoEXr4HqtvzXIkP9k38uJ9iBOgj_UKCRvzX52QEmXgdk5jZVHJXk6F6dXWKQEcPv4oLRMz9PyNJkrJRbGFwXhjaXQF8sduKjnx2nG44UUEOF9YV4tMUCVYjWCr9xyCJeeP91sQr62nR199EyTgSXaKVhObW10olBAVQGg3sOZoV3cFVbf-ANrqi-qpAvC5IV8',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuD2vRTeCw4qL4S2EoBDI6RctH8kcFqH2jyrW7XDIwETiE3OQ5Y0W0_3d8TTY32nN5FgtYViprKNstUowJ0jqopHad9QzpwNt5aVTp-iKVMEgUXnDuzOhzkc1ZC9Kt5qNOD9WiuEeq6rINCXM8SN267UKBzqMEqNRDqRJcuQJ5adczHCoqU04n4dPVK5vpMHtmq2RWMhSfcpxuFHl8befFTEDijERwU5wEwq-aP-EAy49_Em27m83bRxI5ETQgD9U_BkaFCvQQcbCuc',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDySksXvVod4e-OA84ro01MK38nWPsEMiXUi6yWY4V3QJBgWRGsdZ9gjoebVuUT_pNlYvsr8tR9BLVSbuhLts-gqnIGkaOFEbLXJO_RWf6q2zuxtOCBtcF21NhrHn6ct7jBVnTka832JuwSowfiEi9IgPSAsPiQOpvDPZFyBUM1es8kps9gR3nnCrZntpu5Ttu2gjdXPc4BjNrJTbYdd7ZPmtZmR9hu3QlT1FRYWW24eIheVWwNoIiNK9O3HS0GhA3WLWNV2KNtHOo',
];

export default function ProductDetailPage() {
    const { id }          = useParams();
    const { user }        = useAuth();
    const { addToCart }   = useCart();
    const navigate        = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [added, setAdded]     = useState(false);
    const [selectedFinish, setSelectedFinish] = useState('Ochre Clay');
    const [selectedSize, setSelectedSize]     = useState('Medium');

    useEffect(() => {
        api.get(`/products/${id}`)
            .then((res) => setProduct(res.data))
            .finally(() => setLoading(false));
    }, [id]);

    async function handleAddToCart() {
        if (!user) { navigate('/login'); return; }
        await addToCart(product.id, 1);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    }

    if (loading) return <div className="min-h-screen flex items-center justify-center" style={{background:'#f9f9f8'}}>
        <p style={{color:'#584237'}}>Chargement...</p>
    </div>;

    if (!product) return <div className="min-h-screen flex items-center justify-center" style={{background:'#f9f9f8'}}>
        <p style={{color:'#584237'}}>Produit introuvable.</p>
    </div>;

    return (
        <div style={{background:'#f9f9f8', color:'#1a1c1c', minHeight:'100vh'}}>
            <main className="pt-[56px] min-h-screen">
                {/* 60/40 Split */}
                <section className="flex flex-col lg:flex-row" style={{minHeight:'calc(100vh - 56px)'}}>
                    {/* Left: Product Viewer */}
                    <div className="lg:w-[60%] relative overflow-hidden flex items-center justify-center" style={{background:'#eeeeed', minHeight:500}}>
                        <img src={PRODUCT_IMG} alt={product.name}
                            className="w-full h-full object-cover opacity-90"/>
                        <div className="absolute inset-0"
                            style={{background:'linear-gradient(to top right, rgba(249,249,248,0.4), transparent)'}}/>

                        <div className="absolute top-1/3 left-1/2 -translate-x-12 z-10">
                            <button className="w-6 h-6 rounded-full border-4 border-white shadow-lg animate-pulse"
                                style={{background:'#f97316'}}/>
                        </div>
                        <div className="absolute bottom-1/3 right-1/4 z-10">
                            <button className="w-6 h-6 rounded-full border-4 border-white shadow-lg animate-pulse"
                                style={{background:'#f97316'}}/>
                        </div>

                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6 px-6 py-3 rounded-full z-20 glass-panel"
                            style={{border:'1px solid rgba(224,192,177,0.2)', boxShadow:'0 20px 40px rgba(26,28,28,0.1)'}}>
                            {[{icon:'rotate_90_degrees_ccw', label:'Rotate'},{icon:'zoom_in', label:'Zoom'},{icon:'restart_alt', label:'Reset'}].map((ctrl, i) => (
                                <button key={ctrl.label} className="flex flex-col items-center gap-1 group">
                                    <span className="material-symbols-outlined group-hover:text-[#9d4300] transition-colors">{ctrl.icon}</span>
                                    <span style={{fontSize:'10px', textTransform:'uppercase', fontWeight:700, letterSpacing:'0.1em', color:'rgba(26,28,28,0.6)'}}>{ctrl.label}</span>
                                </button>
                            )).reduce((acc, el, i, arr) => [
                                ...acc,
                                el,
                                i < arr.length - 1 ? <span key={`sep-${i}`} style={{width:1, height:24, background:'rgba(224,192,177,0.3)', display:'inline-block'}}/> : null
                            ], [])}
                        </div>
                    </div>

                    {/* Right: Info Panel */}
                    <div className="lg:w-[40%] p-8 lg:p-12 xl:p-16" style={{background:'#ffffff'}}>
                        <div className="sticky top-32">
                            <nav className="flex items-center gap-2 mb-8" style={{fontSize:'10px', textTransform:'uppercase', letterSpacing:'0.1em', color:'#584237'}}>
                                <a href="#" className="hover:text-[#9d4300] transition-colors">Discover</a>
                                <span className="material-symbols-outlined text-xs">chevron_right</span>
                                <a href="#" className="hover:text-[#9d4300] transition-colors">Tactile Sculptures</a>
                                <span className="material-symbols-outlined text-xs">chevron_right</span>
                                <span style={{color:'#1a1c1c', fontWeight:700}}>{product.name}</span>
                            </nav>

                            <div className="inline-block px-3 py-1 rounded-full text-[10px] font-bold tracking-tighter mb-4"
                                style={{background:'#ffdbca', color:'#783200'}}>NEW COLLECTION</div>

                            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tighter mb-4">{product.name}</h1>
                            <p className="text-3xl font-bold mb-8" style={{color:'#9d4300'}}>${product.price}</p>
                            <p className="leading-relaxed mb-10 text-lg" style={{color:'#584237'}}>{product.description}</p>

                            <div className="space-y-8 mb-12">
                                <div>
                                    <label style={{fontSize:'10px', fontWeight:900, textTransform:'uppercase', letterSpacing:'0.1em', color:'rgba(26,28,28,0.4)', display:'block', marginBottom:16}}>Material Finish</label>
                                    <div className="flex flex-wrap gap-3">
                                        {['Ochre Clay','Stone Matte','Glacial Frost'].map(f => (
                                            <button key={f} onClick={() => setSelectedFinish(f)}
                                                className="px-6 py-2 rounded-full text-sm font-medium transition-all"
                                                style={selectedFinish === f
                                                    ? {border:'2px solid #9d4300', color:'#9d4300', fontWeight:700}
                                                    : {background:'#f3f4f3', color:'#584237'}}>
                                                {f}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label style={{fontSize:'10px', fontWeight:900, textTransform:'uppercase', letterSpacing:'0.1em', color:'rgba(26,28,28,0.4)', display:'block', marginBottom:16}}>Size Variant</label>
                                    <div className="flex flex-wrap gap-3">
                                        {['Small','Medium','Large'].map(s => (
                                            <button key={s} onClick={() => setSelectedSize(s)}
                                                className="px-6 py-2 rounded-full text-sm font-medium transition-all"
                                                style={selectedSize === s
                                                    ? {border:'2px solid #9d4300', color:'#9d4300', fontWeight:700}
                                                    : {background:'#f3f4f3', color:'#584237'}}>
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 mb-12">
                                <button onClick={handleAddToCart}
                                    className="flex-1 py-5 rounded-lg font-bold text-white flex justify-center items-center gap-2 transition-all active:scale-90"
                                    style={{background:'linear-gradient(to right, #9d4300, #f97316)', boxShadow:'0 10px 20px rgba(157,67,0,0.2)'}}>
                                    <span className="material-symbols-outlined">shopping_cart</span>
                                    {added ? 'Added!' : 'Add to Cart'}
                                </button>
                                <button className="px-8 py-5 rounded-lg font-bold flex justify-center items-center transition-colors"
                                    style={{border:'1px solid rgba(224,192,177,0.3)', color:'#1a1c1c'}}>
                                    <span className="material-symbols-outlined">favorite</span>
                                </button>
                            </div>

                            <div className="space-y-2">
                                {['Technical Specifications','Sustainability & Shipping'].map((item, i) => (
                                    <div key={item} className="p-6 rounded-xl" style={{background:'#f3f4f3'}}>
                                        <div className="flex justify-between items-center cursor-pointer">
                                            <span className="font-bold">{item}</span>
                                            <span className="material-symbols-outlined">{i === 0 ? 'add' : 'expand_more'}</span>
                                        </div>
                                        {i === 1 && (
                                            <p className="mt-4 text-sm leading-relaxed" style={{color:'#584237'}}>
                                                Our vessels are printed on demand using recycled polymers. Standard delivery takes 12-14 business days globally with carbon-neutral shipping.
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Community Section */}
                <section className="max-w-7xl mx-auto px-8 py-24">
                    <div className="mb-16 text-center">
                        <h2 className="text-4xl font-extrabold tracking-tighter mb-4">What the community says</h2>
                        <p style={{color:'#584237'}}>Real-time captures and impressions from Aetheria owners across the globe.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 md:row-span-2 relative group rounded-3xl overflow-hidden shadow-sm" style={{background:'#f3f4f3'}}>
                            <img src={COMMUNITY_IMGS[0]} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"/>
                            <div className="absolute inset-0 flex flex-col justify-end p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                style={{background:'linear-gradient(to top, rgba(26,28,28,0.8), transparent)'}}>
                                <p className="text-white text-lg">"The way the light hits the Ochre finish is just ethereal. Worth every penny."</p>
                            </div>
                        </div>
                        {COMMUNITY_IMGS.slice(1).map((img, i) => (
                            <div key={i} className="relative group rounded-3xl overflow-hidden shadow-sm aspect-square" style={{background:'#f3f4f3'}}>
                                <img src={img} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            <footer className="w-full pt-12 pb-8" style={{borderTop:'1px solid rgba(224,192,177,0.2)', background:'#f9f9f8'}}>
                <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6"
                    style={{fontSize:'10px', textTransform:'uppercase', letterSpacing:'0.05em', color:'rgba(26,28,28,0.4)'}}>
                    <div className="text-lg font-black" style={{color:'#1a1c1c'}}>AETHERIA TACTILE</div>
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
