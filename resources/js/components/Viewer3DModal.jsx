import { useEffect } from 'react';
import ProductViewer3D from './ProductViewer3D';

export default function Viewer3DModal({ product, productIndex, onClose }) {
    useEffect(() => {
        function onKey(e) { if (e.key === 'Escape') onClose(); }
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [onClose]);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: 'rgba(26,28,28,0.72)', backdropFilter: 'blur(12px)' }}
            onClick={onClose}
        >
            <div
                className="relative rounded-3xl overflow-hidden flex flex-col"
                style={{
                    width: 'min(92vw, 700px)',
                    height: 'min(88vh, 600px)',
                    background: '#eeeeed',
                    boxShadow: '0 40px 80px rgba(26,28,28,0.4)',
                }}
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4"
                    style={{ borderBottom: '1px solid rgba(224,192,177,0.15)', background: '#f9f9f8' }}>
                    <div>
                        <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#584237', fontWeight: 700 }}>
                            Vue 3D
                        </p>
                        <h2 className="text-lg font-extrabold tracking-tight" style={{ color: '#1a1c1c' }}>
                            {product?.name}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
                        style={{ background: '#f3f4f3', color: '#1a1c1c' }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#1a1c1c'; e.currentTarget.style.color = '#f9f9f8'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#f3f4f3'; e.currentTarget.style.color = '#1a1c1c'; }}
                    >
                        <span className="material-symbols-outlined text-xl">close</span>
                    </button>
                </div>

                {/* 3D Canvas */}
                <div className="flex-1 relative" style={{ minHeight: 0 }}>
                    <ProductViewer3D
                        productName={product?.name}
                        categoryId={product?.category_id}
                        productIndex={productIndex}
                        height="100%"
                    />
                </div>

                {/* Footer */}
                <div className="px-6 py-3 flex items-center justify-between"
                    style={{ borderTop: '1px solid rgba(224,192,177,0.15)', background: '#f9f9f8' }}>
                    <span style={{ fontSize: '11px', color: '#584237' }}>
                        Utilisez la souris pour pivoter · Molette pour zoomer
                    </span>
                    <span className="font-extrabold" style={{ color: '#9d4300', fontSize: '1.1rem' }}>
                        {product?.price ? `$${product.price}` : ''}
                    </span>
                </div>
            </div>
        </div>
    );
}
