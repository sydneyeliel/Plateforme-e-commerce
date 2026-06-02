import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const HERO_IMG   = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDpAqPocNxHW_CaqCvNymlY-MLA-D91H2IiUyXeRwDd-JiWBJfd9KmwJzUk-chULyRo8ysZU9fSikG4OvUg5zK6yF1ikdR-XpAqHrVJw5QNHI4TmNz1WJAEJNr86jN65XGZN7xrL05jyew1GuB79uG7yGVh5GBPwiRlTNg8g7rCFdXxg_Lbf3fmm-ib-cEJ-IRdzdB4vLMbiBE6t-JGh0szHn84yiSFUoavitCZqT7XM0707FHVrYgjuA_qKmhET5VtUGsFuNT1m7c';
const PROD_IMGS  = [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBDeUFaSJpTiAtcRt2u-sfRmkU9adHqXUZk2sWFJZZPzPiyoP5qMTfVtCfcwKfEm0eoFpj-1DQhn_13Y--e8iDJzRo4RMcSu5Zm3xd3zGxRVpK8tn0nw78eFJGNleByN9QWYLFdSaCmI_YSXdYGnSd8-8RGErm6WEH-bjzQEaQk8h83FC5dxJQuwyJ3TLsvXLU8XTOWm92VR346fvYVhdDIAAu8hxdnsTZqEEm2DKMKHJPSryzlbZ7pSYr1cI6_iksCoNQVuNHCtOA',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDagwFUUr7T48zGZouTzQqYO_3ktr6qx0fmGH88s1UOAqAIlO4x0EO_wyw3Ll0Z_0H6kFSnNraXCMsLkejuf5aAllk0wpbEirzZVHNn2oUcw-1DBfjrCxoNefPlhyWsStmRjB3-Ra-dAwT5um1aRVEM3D0tbDuPSj69A-2ysdicHQwR8mImjxkNZNTt3o51UvKLRFaQKv4Ca0uiU2fWvfjzZuk2F4b08fbWxotnok4RYjET3Xs808ycOk-AQXU0E87gmu-IR1FvCdY',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDQbmUxAgZGkJCx8zh-uiVRxpzNdbi4_osN49dZMO_sDdNcnj4INoOhbydXRHt1yIrhsKo8IhzTj5qhdifTVUbdhliEDIhL7XVAL7voVXcQ85zPIGQqG1aZRhleWt6cGcN4R2beB4qdyf7iu5Al0xkoejARvbRXMdbq3eAihHCPxsOsgPEjIaAyE2ym5llgkegxrscD6Ksd8RpZHyLnzMRRPoCKRevjpIJ7tLb23bLEKXXLpRrNgdI-i643_z62SOxdqVTzlMTmzRk',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCUQIxrhaMteHNsUvET7473yNBy9i9cRC-EWTWVwLSSLV6of3Ap8733mE-ujh-9H_OxMsWoHFsDtMxIYefVh4dUSd9xZpLXwSTxkoTAo21LiTmUYJbTWQRPoH0i__FfgslsWROOAKqpVb7KSkvEQd69vUcqGgq0aXsWYWVLCVXHzXPYoEPte25y-0vgEdJHyXdjmbP0v4ktRTSl15c1ywzkQqlMWG2CNbHRuikewr3jBrJoCXIIAF2C16CAw33tKsZtEQHXmh7KXUo',
];
const FEED_IMGS = [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBHEPPlEp-Kt6RgoF2Igs6M37mr-IyPZGQ9xxKMG-qgJPsUsyoO3kytb_7TqGc4oluqtq2Bdlz0R6n9BprdcHme0ztT0IizDRUUnSXhehQ-7jw3lPlCyvFQbK-wRQspZvX_X1myaDI7pcV293p_RQ26uzsbVICLvkmSlMqdaueXhvTnQEpJMLrjGRAm276AZBIWYRoB3x9esnLkxxqFtn3Q9Ludx8DEpDH7zay8fXD2A7V_2JaxdMrJUA8ch5Splp3-A8mFghJlIaU',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuC8Gc2Qc0GkEvc9G5gFfdh87RDcrxdR6qIVq3r6bsjf9qcCzertcy5pnZosRVvHE2LP8o9_xe28Lr7FsAwAxSqWtmwALmLmunI0axRm41f1iYJBiU8cn8KHqOZa3P_O4haiL6M-9AK5KxgmY3hcnUQvbmvqaQDFxTiYqs2JaCvuVnWltWllfbRyclwnoW5mvpg8jZBc1h32Y7EyHYc51YEfw_yICX-XBKkLCIuZgi51YH-da3r3u0QrybTcCRHKCNWYQGgGUvxR4I0',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAiKVaSXwiX_57tKX7PNtDi-24TtQtU9s-IQRrsPEcv3KrZMjg-_gMi1Ytgx7GHmmTkja5tl9QP8Uw8JO_p_5G3rAm7t2xarwLI3mS3yZByyfskKAS-fMJwp4mRgSlSXXgnLheexdPW0Hk1_ABS9dMN2QhqJYVGKw9ChSypPObvv3sW4B6JycbhH__cWWM3CF426fPgknE3J_M8Ja4rjZk4Q3v2snFe7BdlWqm-v8SvfoqfGrX8K_SGjSkSu0-DZtF0ZV1OigsZxm4',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBc0icxr4Ve9_vpLFCJM9eQzJYJamJ6fzNfb18Su_5bSHvu7Lg1Y4cL2LLV7RPY9wOJ9Yfb8ffNDTADLrhZvkCn9kCZHKhl35kp8ZvRf86pJkILNw6B8fngZXJqeoRMFa83KGukt6EcTrnuEx8jHkZv-Qs5VLdjF9qDChQbieuUTLz6uLgoplmTD4UQIPZIUNqjwQ8WfdUQI6muRppoHk7_x8vXMUU-rZb8aRa2DkWzdv7pkpCYa7zOaQ1WPjv74h_-pKobQjSUwx0',
];
const PROD_NAMES = ['Ocular Pro G1', 'Aether Audio V3', 'Velocity Runner', 'Stone Series Chrono'];
const PROD_CATS  = ['Wearables / Next-Gen', 'Audio / Immersive', 'Fashion / Motion', 'Lifestyle / Static'];
const PROD_PRICES= ['$899', '$450', '$180', '$299'];
const FEED_USERS = ['@marcus_vibe', '@clay_and_steel', '@retro_aether', '@gallery_spatial'];

export default function HomePage() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        api.get('/products').then((res) => setProducts(res.data.data?.slice(0, 4) ?? []));
    }, []);

    return (
        <div style={{background:'#f9f9f8', color:'#1a1c1c', fontFamily:"'Plus Jakarta Sans', sans-serif"}}>

            {/* ── Hero ─────────────────────────────────────────────── */}
            <section className="relative min-h-screen flex items-center pt-20 overflow-hidden"
                style={{background:'radial-gradient(circle at 70% 50%, rgba(249,115,22,0.05) 0%, transparent 50%)'}}>
                <div className="container mx-auto px-8 grid lg:grid-cols-2 gap-12 items-center">
                    <div className="z-10 space-y-8 max-w-2xl">
                        <h1 className="font-extrabold tracking-tight" style={{fontSize:'3.5rem', lineHeight:1.1}}>
                            Explore products like{' '}
                            <span style={{
                                background:'linear-gradient(to right, #9d4300, #f97316)',
                                WebkitBackgroundClip:'text',
                                WebkitTextFillColor:'transparent'
                            }}>never before</span>
                        </h1>
                        <p className="text-lg leading-relaxed max-w-lg" style={{color:'#584237'}}>
                            The future of commerce is tactile. Dive into high-fidelity 3D environments where every texture, shadow, and detail is rendered with ethereal precision.
                        </p>
                        <div className="flex flex-wrap gap-4 pt-4">
                            <Link to="/shop"
                                className="px-8 py-4 font-semibold rounded-lg text-white transition-all hover:scale-105 active:scale-95"
                                style={{background:'linear-gradient(to right, #9d4300, #f97316)', boxShadow:'0px 10px 20px rgba(157,67,0,0.2)'}}>
                                Shop the Collection
                            </Link>
                            <button className="px-8 py-4 font-semibold rounded-lg transition-colors"
                                style={{background:'#e8e8e7', color:'#1a1c1c'}}>
                                Launch Metaverse
                            </button>
                        </div>
                    </div>

                    <div className="relative h-[600px] lg:h-[700px] flex items-center justify-center">
                        <div className="absolute inset-0 rounded-[2.5rem] blur-3xl opacity-30"
                            style={{background:'linear-gradient(to top right, rgba(255,182,144,0.2), transparent)'}}/>
                        <div className="relative w-full h-full flex items-center justify-center">
                            <img src={HERO_IMG} alt="Featured Watch"
                                className="w-4/5 h-auto object-contain z-10"
                                style={{filter:'drop-shadow(0 35px 60px rgba(0,0,0,0.3))'}}/>
                            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-4 px-6 py-3 rounded-full z-20 glass-panel border"
                                style={{borderColor:'rgba(224,192,177,0.2)', boxShadow:'0 20px 40px rgba(26,28,28,0.1)'}}>
                                <button style={{color:'#9d4300'}}><span className="material-symbols-outlined">rotate_right</span></button>
                                <span style={{width:1, height:16, background:'rgba(224,192,177,0.3)', display:'inline-block'}}/>
                                <button style={{color:'#1a1c1c'}}><span className="material-symbols-outlined">zoom_in</span></button>
                                <span style={{width:1, height:16, background:'rgba(224,192,177,0.3)', display:'inline-block'}}/>
                                <button style={{color:'#1a1c1c'}}><span className="material-symbols-outlined">layers</span></button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
                    <span style={{fontSize:'10px', textTransform:'uppercase', letterSpacing:'0.2em', fontWeight:700, color:'rgba(26,28,28,0.4)'}}>Scroll</span>
                    <span className="material-symbols-outlined animate-bounce" style={{color:'#9d4300', fontSize:'2rem'}}>keyboard_arrow_down</span>
                </div>
            </section>

            {/* ── Featured Products ──────────────────────────────────── */}
            <section className="py-24 overflow-hidden" style={{background:'#f3f4f3'}}>
                <div className="px-8 max-w-7xl mx-auto mb-12 flex justify-between items-end">
                    <div>
                        <span style={{fontSize:'12px', fontWeight:700, color:'#9d4300', textTransform:'uppercase', letterSpacing:'0.1em', display:'block', marginBottom:8}}>Curation</span>
                        <h2 className="text-4xl font-bold tracking-tighter">Featured Sculptures</h2>
                    </div>
                    <div className="flex gap-4">
                        <button className="w-12 h-12 rounded-full flex items-center justify-center transition-colors hover:bg-white"
                            style={{border:'1px solid rgba(224,192,177,0.3)'}}>
                            <span className="material-symbols-outlined">west</span>
                        </button>
                        <button className="w-12 h-12 rounded-full flex items-center justify-center transition-colors hover:bg-white"
                            style={{border:'1px solid rgba(224,192,177,0.3)'}}>
                            <span className="material-symbols-outlined">east</span>
                        </button>
                    </div>
                </div>

                <div className="flex gap-8 overflow-x-auto px-8 pb-12 hide-scrollbar snap-x snap-mandatory">
                    {(products.length > 0 ? products : Array(4).fill(null)).map((product, i) => (
                        <Link to={product ? `/products/${product.id}` : '#'} key={i}
                            className="min-w-[320px] md:min-w-[380px] snap-start group">
                            <div className="rounded-2xl p-6 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
                                style={{background:'#f9f9f8'}}>
                                <div className="aspect-square rounded-xl mb-6 overflow-hidden relative"
                                    style={{background:'#f3f4f3'}}>
                                    <img src={PROD_IMGS[i % 4]} alt={PROD_NAMES[i % 4]}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"/>
                                    <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-white"
                                        style={{background:'#9d4300', fontSize:'10px', fontWeight:700}}>3D VIEW</div>
                                </div>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-xl font-bold tracking-tight">{product?.name ?? PROD_NAMES[i % 4]}</h3>
                                        <p className="text-sm mt-1" style={{color:'#584237'}}>{product?.category?.name ?? PROD_CATS[i % 4]}</p>
                                    </div>
                                    <span className="text-lg font-bold" style={{color:'#9d4300'}}>
                                        {product ? `$${product.price}` : PROD_PRICES[i % 4]}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* ── Social Feed ───────────────────────────────────────── */}
            <section className="py-24" style={{background:'#f9f9f8'}}>
                <div className="max-w-7xl mx-auto px-8">
                    <div className="text-center mb-20 max-w-2xl mx-auto">
                        <span style={{fontSize:'12px', fontWeight:800, color:'#9d4300', textTransform:'uppercase', letterSpacing:'0.3em', display:'block', marginBottom:16}}>The Feed</span>
                        <h2 className="text-5xl font-extrabold tracking-tighter mb-6">Shared by the Collective</h2>
                        <p style={{color:'#584237'}}>Real users, real perspectives. Explore how our community styles their digital and physical Aetheria pieces.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Link to="/feed" className="lg:col-span-2 lg:row-span-2 relative group rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500">
                            <img src={FEED_IMGS[0]} alt="Feed" className="w-full h-full object-cover"/>
                            <div className="absolute inset-0 flex flex-col justify-end p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                style={{background:'linear-gradient(to top, rgba(0,0,0,0.6), transparent)'}}>
                                <span className="text-white font-bold">{FEED_USERS[0]}</span>
                            </div>
                        </Link>
                        {[1,2,3].map((i) => (
                            <Link to="/feed" key={i} className="relative group rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 h-64">
                                <img src={FEED_IMGS[i]} alt="Feed" className="w-full h-full object-cover"/>
                                <div className="absolute inset-0 flex items-end p-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                    style={{background:'linear-gradient(to top, rgba(0,0,0,0.4), transparent)'}}>
                                    <span className="text-white text-xs font-bold">{FEED_USERS[i]}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Footer ────────────────────────────────────────────── */}
            <footer className="w-full pt-12 pb-8 mt-24" style={{background:'#f9f9f8', borderTop:'1px solid rgba(224,192,177,0.2)'}}>
                <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-lg font-black tracking-tight">AETHERIA</div>
                    <div className="flex flex-wrap justify-center gap-8" style={{fontSize:'10px', textTransform:'uppercase', letterSpacing:'0.05em', color:'rgba(26,28,28,0.4)'}}>
                        {['Imprint','Terms of Service','Creator Policy','Sustainability'].map((l) => (
                            <a key={l} href="#" className="hover:text-[#F97316] underline underline-offset-4 transition-all">{l}</a>
                        ))}
                    </div>
                    <div style={{fontSize:'10px', textTransform:'uppercase', letterSpacing:'0.05em', color:'rgba(26,28,28,0.4)'}}>
                        © 2026 Aetheria Tactile. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}
