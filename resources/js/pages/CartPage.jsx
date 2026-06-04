import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop&q=80';

export default function CartPage() {
    const { cart, removeFromCart, updateItem, clearCart, itemCount } = useCart();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ firstName:'', lastName:'', address:'', city:'', postal:'', cardNum:'', expiry:'', cvv:'' });
    const [ordering, setOrdering] = useState(false);
    const [success, setSuccess]   = useState(false);

    const subtotal = cart?.items?.reduce((s, i) => s + i.product.price * i.quantity, 0) ?? 0;
    const shipping = subtotal > 0 ? 45 : 0;
    const tax      = Math.round(subtotal * 0.048);
    const total    = subtotal + shipping + tax;

    async function handleOrder(e) {
        e.preventDefault();
        setOrdering(true);
        try {
            await api.post('/orders');
            await clearCart();
            setSuccess(true);
        } catch { /* handled */ }
        finally { setOrdering(false); }
    }

    if (success) return (
        <div className="min-h-screen flex items-center justify-center" style={{background:'#f9f9f8'}}>
            <div className="text-center p-12 rounded-2xl ambient-shadow" style={{background:'#ffffff'}}>
                <span className="material-symbols-outlined text-6xl" style={{color:'#9d4300'}}>check_circle</span>
                <h2 className="text-2xl font-bold mt-4 mb-2">Order placed!</h2>
                <p style={{color:'#584237'}} className="mb-6">Your collection is on its way.</p>
                <button onClick={() => navigate('/')}
                    className="px-8 py-3 rounded-lg text-white font-bold"
                    style={{background:'linear-gradient(to right, #9d4300, #f97316)'}}>
                    Back to Home
                </button>
            </div>
        </div>
    );

    return (
        <div style={{background:'#f9f9f8', color:'#1a1c1c', minHeight:'100vh'}}>
            <main className="pt-32 pb-24 px-8 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

                    {/* Left: Forms */}
                    <div className="lg:col-span-7 space-y-12">
                        <header>
                            <h1 className="text-4xl font-bold tracking-tight">Checkout</h1>
                            <p className="mt-2" style={{color:'#584237'}}>Complete your order to bring tactile beauty home.</p>
                        </header>

                        {/* Shipping */}
                        <section className="space-y-8">
                            <div className="flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
                                    style={{background:'#ffdbca', color:'#783200'}}>1</span>
                                <h2 className="text-xl font-semibold tracking-tight">Shipping Information</h2>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                {[
                                    { id:'firstName', label:'First Name', span:1, type:'text', placeholder:'John' },
                                    { id:'lastName',  label:'Last Name',  span:1, type:'text', placeholder:'Doe' },
                                    { id:'address',   label:'Street Address', span:2, type:'text', placeholder:'123 Main St' },
                                    { id:'city',      label:'City',      span:1, type:'text', placeholder:'Paris' },
                                    { id:'postal',    label:'Postal Code', span:1, type:'text', placeholder:'75001' },
                                ].map(field => (
                                    <div key={field.id} className={`relative col-span-2 md:col-span-${field.span}`}>
                                        <input
                                            id={field.id} type={field.type} placeholder=" "
                                            value={formData[field.id]}
                                            onChange={e => setFormData(p => ({...p, [field.id]: e.target.value}))}
                                            className="peer w-full rounded-lg px-4 pt-6 pb-2 text-sm focus:outline-none"
                                            style={{background:'#f3f4f3', border:'none'}}/>
                                        <label htmlFor={field.id}
                                            className="absolute left-4 top-2 text-[10px] uppercase tracking-widest font-bold"
                                            style={{color:'#584237'}}>
                                            {field.label}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Payment */}
                        <section className="space-y-8">
                            <div className="flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
                                    style={{background:'#ffdbca', color:'#783200'}}>2</span>
                                <h2 className="text-xl font-semibold tracking-tight">Payment Method</h2>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                {[
                                    { id:'cardNum', label:'Card Number', span:2, placeholder:'•••• •••• •••• ••••' },
                                    { id:'expiry',  label:'Expiry Date (MM/YY)', span:1, placeholder:'MM/YY' },
                                    { id:'cvv',     label:'CVV', span:1, placeholder:'•••' },
                                ].map(field => (
                                    <div key={field.id} className={`relative col-span-2 md:col-span-${field.span}`}>
                                        <input
                                            id={field.id} type="text" placeholder=" "
                                            value={formData[field.id]}
                                            onChange={e => setFormData(p => ({...p, [field.id]: e.target.value}))}
                                            className="peer w-full rounded-lg px-4 pt-6 pb-2 text-sm focus:outline-none"
                                            style={{background:'#f3f4f3', border:'none'}}/>
                                        <label htmlFor={field.id}
                                            className="absolute left-4 top-2 text-[10px] uppercase tracking-widest font-bold"
                                            style={{color:'#584237'}}>
                                            {field.label}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Right: Order Summary */}
                    <div className="lg:col-span-5">
                        <div className="sticky top-32 rounded-2xl p-8 space-y-8 ambient-shadow"
                            style={{background:'#ffffff', border:'1px solid rgba(224,192,177,0.2)'}}>
                            <h3 className="text-xl font-bold tracking-tight">Order Summary</h3>

                            {cart?.items?.length > 0 ? (
                                <div className="space-y-6">
                                    {cart.items.map((item, i) => (
                                        <div key={item.id} className="flex items-center gap-4">
                                            <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0" style={{background:'#f3f4f3'}}>
                                                <img src={item.product?.image || FALLBACK_IMG} alt={item.product?.name} className="w-full h-full object-cover"
                                                    onError={e => { e.currentTarget.src = FALLBACK_IMG; }}/>
                                            </div>
                                            <div className="flex-grow">
                                                <p className="font-bold text-sm">{item.product.name}</p>
                                                <p className="text-xs" style={{color:'#584237'}}>Qty: {item.quantity}</p>
                                                <p className="text-sm font-bold mt-1" style={{color:'#f97316'}}>${(item.product.price * item.quantity).toFixed(2)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm" style={{color:'#584237'}}>Votre panier est vide.</p>
                            )}

                            <div className="pt-8 space-y-4" style={{borderTop:'1px solid rgba(224,192,177,0.2)'}}>
                                {[['Subtotal', `$${subtotal.toFixed(2)}`], ['Shipping', `$${shipping}`], ['Tax', `$${tax}`]].map(([l,v]) => (
                                    <div key={l} className="flex justify-between text-sm">
                                        <span style={{color:'#584237'}}>{l}</span>
                                        <span className="font-bold">{v}</span>
                                    </div>
                                ))}
                                <div className="flex justify-between text-xl pt-4" style={{borderTop:'1px solid rgba(224,192,177,0.2)'}}>
                                    <span className="font-extrabold tracking-tight">Total</span>
                                    <span className="font-extrabold" style={{color:'#9d4300'}}>${total.toFixed(2)}</span>
                                </div>
                            </div>

                            <form onSubmit={handleOrder}>
                                <button type="submit" disabled={ordering || !cart?.items?.length}
                                    className="w-full py-4 rounded-lg font-bold text-white transition-all active:scale-[0.98] disabled:opacity-50"
                                    style={{background:'linear-gradient(to right, #9d4300, #f97316)', boxShadow:'0 10px 20px rgba(157,67,0,0.2)'}}>
                                    {ordering ? 'Processing...' : 'Complete Purchase'}
                                </button>
                            </form>

                            <div className="flex items-center justify-center gap-2" style={{fontSize:'10px', color:'#584237', textTransform:'uppercase', letterSpacing:'0.1em', fontWeight:700}}>
                                <span className="material-symbols-outlined text-xs">lock</span>
                                Secure SSL Encrypted Checkout
                            </div>
                        </div>
                    </div>
                </div>
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
