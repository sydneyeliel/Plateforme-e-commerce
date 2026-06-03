import { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import ProductShape3D from './ProductShape3D';

export default function ProductViewer3D({
    productName,
    categoryId,
    productIndex = 0,
    height = 'calc(100vh - 56px)',
}) {
    const controlsRef = useRef();
    const [autoRotate, setAutoRotate] = useState(true);
    const [resetKey, setResetKey]     = useState(0);

    function handleZoomIn() {
        const c = controlsRef.current;
        if (!c) return;
        const dir = c.object.position.clone().sub(c.target).normalize();
        c.object.position.addScaledVector(dir, -0.55);
        c.update();
    }
    function handleZoomOut() {
        const c = controlsRef.current;
        if (!c) return;
        const dir = c.object.position.clone().sub(c.target).normalize();
        c.object.position.addScaledVector(dir, 0.55);
        c.update();
    }
    function handleReset() { setResetKey(k => k + 1); setAutoRotate(true); }

    const ctrlBtns = [
        { icon: 'rotate_90_degrees_ccw', label: 'Rotate', onClick: () => setAutoRotate(r => !r), active: autoRotate },
        { icon: 'zoom_in',               label: 'Zoom',   onClick: handleZoomIn },
        { icon: 'restart_alt',           label: 'Reset',  onClick: handleReset },
    ];

    return (
        <div style={{ position: 'relative', width: '100%', height, background: '#eeeeed' }}>
            <Canvas
                camera={{ position: [0, 0.3, 4.2], fov: 46 }}
                style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
                shadows
                dpr={[1, 2]}
            >
                <ambientLight intensity={0.65} />
                <directionalLight position={[5, 8, 5]} intensity={1.4} castShadow />
                <pointLight position={[-4, -2, -4]} intensity={0.5} color="#f97316" />
                <pointLight position={[2, 5, 2]}  intensity={0.3} color="#fff8f0" />

                <ProductShape3D
                    productName={productName}
                    categoryId={categoryId}
                    productIndex={productIndex}
                />

                <OrbitControls
                    ref={controlsRef}
                    key={resetKey}
                    autoRotate={autoRotate}
                    autoRotateSpeed={2.2}
                    enableDamping
                    dampingFactor={0.07}
                    minDistance={1.8}
                    maxDistance={10}
                    onStart={() => setAutoRotate(false)}
                />
                <Environment preset="studio" />
            </Canvas>

            {/* Barre Rotate / Zoom / Reset */}
            <div style={{
                position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)',
                display: 'flex', alignItems: 'center', gap: 24,
                padding: '12px 24px', borderRadius: 9999, zIndex: 20,
                background: 'rgba(249,249,248,0.72)', backdropFilter: 'blur(24px)',
                border: '1px solid rgba(224,192,177,0.25)',
                boxShadow: '0 20px 40px rgba(26,28,28,0.12)', whiteSpace: 'nowrap',
            }}>
                {ctrlBtns.map((ctrl, i) => (
                    <span key={ctrl.label} style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                        <button onClick={ctrl.onClick} style={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                            background: 'none', border: 'none', cursor: 'pointer',
                        }}>
                            <span className="material-symbols-outlined" style={{
                                color: ctrl.active ? '#9d4300' : '#1a1c1c', transition: 'color 0.2s',
                            }}>{ctrl.icon}</span>
                            <span style={{ fontSize: 10, textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.1em', color: 'rgba(26,28,28,0.6)' }}>
                                {ctrl.label}
                            </span>
                        </button>
                        {i < ctrlBtns.length - 1 && (
                            <span style={{ width: 1, height: 24, background: 'rgba(224,192,177,0.3)', display: 'inline-block' }} />
                        )}
                    </span>
                ))}
            </div>

            <div style={{
                position: 'absolute', top: 16, right: 16,
                fontSize: 11, padding: '4px 12px', borderRadius: 9999,
                background: 'rgba(26,28,28,0.07)', color: '#584237',
            }}>
                Glisser pour pivoter
            </div>
        </div>
    );
}
