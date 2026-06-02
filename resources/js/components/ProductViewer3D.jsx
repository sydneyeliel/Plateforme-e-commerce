import { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Float } from '@react-three/drei';

const PALETTE = [
    '#9d4300', '#c45a00', '#584237', '#8b5a2b',
    '#b5651d', '#a0522d', '#6b3a2a', '#d4722e',
];

const CATEGORY_SHAPE = {
    1: 'box',
    2: 'torus',
    3: 'cylinder',
    4: 'sphere',
};

function ProductMesh({ shape, color }) {
    return (
        <Float speed={1.8} rotationIntensity={0.25} floatIntensity={0.4}>
            <mesh castShadow receiveShadow>
                {shape === 'box'      && <boxGeometry args={[1.5, 1.5, 1.5]} />}
                {shape === 'torus'    && <torusGeometry args={[1, 0.38, 40, 100]} />}
                {shape === 'cylinder' && <cylinderGeometry args={[0.75, 0.9, 1.9, 40]} />}
                {shape === 'sphere'   && <sphereGeometry args={[1.2, 64, 64]} />}
                {shape === 'knot'     && <torusKnotGeometry args={[0.8, 0.28, 200, 20]} />}
                <meshStandardMaterial
                    color={color}
                    roughness={0.22}
                    metalness={0.55}
                    envMapIntensity={1.2}
                />
            </mesh>
        </Float>
    );
}

export default function ProductViewer3D({ categoryId, productIndex = 0 }) {
    const controlsRef = useRef();
    const [autoRotate, setAutoRotate] = useState(true);
    const [resetKey, setResetKey]     = useState(0);

    const shape = CATEGORY_SHAPE[categoryId] ?? 'knot';
    const color = PALETTE[productIndex % PALETTE.length];

    function handleZoomIn() {
        const c = controlsRef.current;
        if (!c) return;
        if (c.dollyIn) { c.dollyIn(1.3); c.update(); }
    }

    function handleZoomOut() {
        const c = controlsRef.current;
        if (!c) return;
        if (c.dollyOut) { c.dollyOut(1.3); c.update(); }
    }

    function handleReset() {
        setResetKey(k => k + 1);
        setAutoRotate(true);
    }

    const controls = [
        { icon: 'rotate_90_degrees_ccw', label: 'Rotate', onClick: () => setAutoRotate(r => !r), active: autoRotate },
        { icon: 'zoom_in',               label: 'Zoom',   onClick: handleZoomIn },
        { icon: 'restart_alt',           label: 'Reset',  onClick: handleReset },
    ];

    return (
        <div className="relative w-full h-full" style={{ minHeight: 400 }}>
            <Canvas
                camera={{ position: [0, 0.5, 4.5], fov: 48 }}
                style={{ background: 'transparent', width: '100%', height: '100%' }}
                shadows
            >
                <ambientLight intensity={0.45} />
                <directionalLight position={[5, 6, 5]} intensity={1.3} castShadow />
                <pointLight position={[-4, -3, -3]} intensity={0.5} color="#f97316" />
                <pointLight position={[3, 4, 3]}  intensity={0.3} color="#fff8f0" />

                <ProductMesh shape={shape} color={color} />

                <OrbitControls
                    ref={controlsRef}
                    key={resetKey}
                    autoRotate={autoRotate}
                    autoRotateSpeed={2.2}
                    enableDamping
                    dampingFactor={0.07}
                    minDistance={2.2}
                    maxDistance={9}
                    onStart={() => setAutoRotate(false)}
                />
                <Environment preset="studio" />
            </Canvas>

            {/* Controls bar */}
            <div
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6 px-6 py-3 rounded-full z-20 glass-panel"
                style={{ border: '1px solid rgba(224,192,177,0.2)', boxShadow: '0 20px 40px rgba(26,28,28,0.1)' }}
            >
                {controls.map((ctrl, i) => (
                    <span key={ctrl.label} className="flex items-center gap-6">
                        <button onClick={ctrl.onClick} className="flex flex-col items-center gap-1 group">
                            <span
                                className="material-symbols-outlined transition-colors"
                                style={{ color: ctrl.active ? '#9d4300' : undefined }}
                            >
                                {ctrl.icon}
                            </span>
                            <span style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.1em', color: 'rgba(26,28,28,0.6)' }}>
                                {ctrl.label}
                            </span>
                        </button>
                        {i < controls.length - 1 && (
                            <span style={{ width: 1, height: 24, background: 'rgba(224,192,177,0.3)', display: 'inline-block' }} />
                        )}
                    </span>
                ))}
            </div>

            {/* Hint */}
            <div className="absolute top-4 right-4 text-xs px-3 py-1 rounded-full"
                style={{ background: 'rgba(26,28,28,0.06)', color: '#584237' }}>
                Glisser pour pivoter
            </div>
        </div>
    );
}
