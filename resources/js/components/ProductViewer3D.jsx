import { Component, Suspense, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF, Html } from '@react-three/drei';
import * as THREE from 'three';

/*
 * Modèles 3D réalistes depuis la CDN jsDelivr (miroir de KhronosGroup glTF-Sample-Models).
 * Ces modèles sont libres de droits (CC BY 4.0) et représentent de vrais objets 3D.
 *
 * Ajouter de nouvelles catégories : associer l'ID catégorie à une URL de fichier .glb
 */
const BASE = 'https://cdn.jsdelivr.net/gh/KhronosGroup/glTF-Sample-Models/2.0';
export const CATEGORY_GLBS = {
    1: `${BASE}/ToyCar/glTF-Binary/ToyCar.glb`,
    2: `${BASE}/Avocado/glTF-Binary/Avocado.glb`,
    3: `${BASE}/BoomBox/glTF-Binary/BoomBox.glb`,
    4: `${BASE}/Lantern/glTF-Binary/Lantern.glb`,
    5: `${BASE}/MaterialsVariantsShoe/glTF-Binary/MaterialsVariantsShoe.glb`,
    6: `${BASE}/AntiqueCamera/glTF-Binary/AntiqueCamera.glb`,
    7: `${BASE}/SciFiHelmet/glTF-Binary/SciFiHelmet.glb`,
    8: `${BASE}/WaterBottle/glTF-Binary/WaterBottle.glb`,
};
/* Utilisé quand la catégorie n'est pas dans la liste ci-dessus */
const FALLBACK_GLBS = [
    `${BASE}/Duck/glTF-Binary/Duck.glb`,
    `${BASE}/Fox/glTF-Binary/Fox.glb`,
    `${BASE}/DamagedHelmet/glTF-Binary/DamagedHelmet.glb`,
    `${BASE}/SciFiHelmet/glTF-Binary/SciFiHelmet.glb`,
    `${BASE}/MaterialsVariantsShoe/glTF-Binary/MaterialsVariantsShoe.glb`,
    `${BASE}/Lantern/glTF-Binary/Lantern.glb`,
    `${BASE}/ToyCar/glTF-Binary/ToyCar.glb`,
    `${BASE}/BoomBox/glTF-Binary/BoomBox.glb`,
];

export function resolveModelUrl(categoryId, modelPath, productIndex = 0) {
    if (modelPath) return modelPath; // modèle spécifique uploadé
    if (CATEGORY_GLBS[categoryId]) return CATEGORY_GLBS[categoryId];
    return FALLBACK_GLBS[productIndex % FALLBACK_GLBS.length];
}

/* ── Composant qui charge et affiche le modèle GLTF ── */
function ModelGLTF({ url }) {
    const { scene } = useGLTF(url);
    const object = useMemo(() => {
        const clone = scene.clone(true);
        /* Auto-scale pour tenir dans ~2 unités Three.js */
        const box = new THREE.Box3().setFromObject(clone);
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        if (maxDim > 0) clone.scale.setScalar(2.2 / maxDim);
        /* Centrer le modèle */
        const box2 = new THREE.Box3().setFromObject(clone);
        const center = box2.getCenter(new THREE.Vector3());
        clone.position.sub(center);
        return clone;
    }, [scene]);

    return <primitive object={object} />;
}

/* ── Fallback affiché PENDANT le chargement ── */
function LoadingRing() {
    const ref = useRef();
    useFrame((_, dt) => { if (ref.current) ref.current.rotation.z += dt * 1.5; });
    return (
        <mesh ref={ref}>
            <torusGeometry args={[0.7, 0.12, 16, 60]} />
            <meshStandardMaterial color="#f97316" roughness={0.4} />
        </mesh>
    );
}

/* ── Fallback affiché si le chargement ÉCHOUE ── */
function ErrorShape() {
    return (
        <mesh>
            <icosahedronGeometry args={[1, 2]} />
            <meshStandardMaterial color="#9d4300" roughness={0.3} metalness={0.4} wireframe />
        </mesh>
    );
}

/* ── Error boundary React (classe) ── */
class ModelBoundary extends Component {
    constructor(p) { super(p); this.state = { err: false }; }
    static getDerivedStateFromError() { return { err: true }; }
    render() { return this.state.err ? <ErrorShape /> : this.props.children; }
}

/* ── Composant principal ── */
export default function ProductViewer3D({
    categoryId,
    modelUrl: modelUrlProp,
    productIndex = 0,
    height = 'calc(100vh - 56px)',
}) {
    const controlsRef = useRef();
    const [autoRotate, setAutoRotate] = useState(true);
    const [resetKey, setResetKey]     = useState(0);

    const modelUrl = resolveModelUrl(categoryId, modelUrlProp, productIndex);

    function handleZoomIn() {
        const c = controlsRef.current;
        if (!c) return;
        const dir = c.object.position.clone().sub(c.target).normalize();
        c.object.position.addScaledVector(dir, -0.6);
        c.update();
    }
    function handleZoomOut() {
        const c = controlsRef.current;
        if (!c) return;
        const dir = c.object.position.clone().sub(c.target).normalize();
        c.object.position.addScaledVector(dir, 0.6);
        c.update();
    }
    function handleReset() { setResetKey(k => k + 1); setAutoRotate(true); }

    const ctrlBtns = [
        { icon: 'rotate_90_degrees_ccw', label: 'Rotate', onClick: () => setAutoRotate(r => !r), active: autoRotate },
        { icon: 'zoom_in',               label: 'Zoom',   onClick: handleZoomIn },
        { icon: 'restart_alt',           label: 'Reset',  onClick: handleReset },
    ];

    return (
        <div style={{ position: 'relative', width: '100%', height }}>
            <Canvas
                camera={{ position: [0, 0.5, 4.5], fov: 45 }}
                style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
                shadows
                dpr={[1, 2]}
            >
                <ambientLight intensity={0.8} />
                <directionalLight position={[5, 8, 5]} intensity={1.5} castShadow />
                <pointLight position={[-4, -2, -4]} intensity={0.6} color="#f97316" />

                <Suspense fallback={<LoadingRing />}>
                    <ModelBoundary>
                        <ModelGLTF url={modelUrl} />
                    </ModelBoundary>
                </Suspense>

                <OrbitControls
                    ref={controlsRef}
                    key={resetKey}
                    autoRotate={autoRotate}
                    autoRotateSpeed={2.2}
                    enableDamping
                    dampingFactor={0.07}
                    minDistance={1.5}
                    maxDistance={10}
                    onStart={() => setAutoRotate(false)}
                />
                <Environment preset="studio" />
            </Canvas>

            {/* Barre de contrôles */}
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
                        <button onClick={ctrl.onClick}
                            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer' }}>
                            <span className="material-symbols-outlined"
                                style={{ color: ctrl.active ? '#9d4300' : '#1a1c1c', transition: 'color 0.2s' }}>
                                {ctrl.icon}
                            </span>
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
