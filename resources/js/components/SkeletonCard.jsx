export default function SkeletonCard() {
    return (
        <div style={{ background: '#fff', border: '1px solid rgba(26,28,28,0.07)', borderRadius: 16, overflow: 'hidden' }}>
            <div className="skeleton" style={{ aspectRatio: '1/1' }} />
            <div style={{ padding: 16 }}>
                <div className="skeleton" style={{ height: 13, marginBottom: 8 }} />
                <div className="skeleton" style={{ height: 11, width: '55%', marginBottom: 14 }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid rgba(26,28,28,0.06)' }}>
                    <div className="skeleton" style={{ height: 10, width: 60 }} />
                    <div className="skeleton" style={{ height: 32, width: 32, borderRadius: '50%' }} />
                </div>
            </div>
        </div>
    );
}
