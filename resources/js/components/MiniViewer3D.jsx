import { Component, Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { resolveModelUrl } from './ProductViewer3D';

/* ── Modèle GLTF chargé et mis à l'échelle automatiquement ── */
function ModelGLTF({ url }) {
    const { scene } = useGLTF(url);
    const object = useMemo(() => {
        const clone = scene.clone(true);
        const box = new THREE.Box3().setFromObject(clone);
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        if (maxDim > 0) clone.scale.setScalar(2.0 / maxDim);
        const box2 = new THREE.Box3().setFromObject(clone);
        const center = box2.getCenter(new THREE.Vector3());
        clone.position.sub(center);
        return clone;
    }, [scene]);

    return <primitive object={object} />;
}

/* Anneau animé affiché pendant le chargement */
function LoadingRing() {
    const ref = useRef();
    useFrame((_, dt) => { if (ref.current) ref.current.rotation.z += dt * 1.5; });
    return (
        <mesh ref={ref}>
            <torusGeometry args={[0.6, 0.1, 12, 50]} />
            <meshStandardMaterial color="#f97316" />
        </mesh>
    );
}

/* Fallback si le chargement échoue */
function ErrorShape() {
    const ref = useRef();
    useFrame((_, dt) => { if (ref.current) ref.current.rotation.y += dt * 0.5; });
    return (
        <mesh ref={ref}>
            <octahedronGeometry args={[1]} />
            <meshStandardMaterial color="#9d4300" roughness={0.3} metalness={0.4} />
        </mesh>
    );
}

class ModelBoundary extends Component {
    constructor(p) { super(p); this.state = { err: false }; }
    static getDerivedStateFromError() { return { err: true }; }
    render() { return this.state.err ? <ErrorShape /> : this.props.children; }
}

/**
 * Viewer 3D léger pour les cartes produit.
 * Charge un vrai modèle .glb représentatif de la catégorie du produit.
 * Le parent doit être position:relative avec une hauteur définie.
 */
export default function MiniViewer3D({ categoryId, modelUrl: modelUrlProp, productIndex = 0 }) {
    const modelUrl = resolveModelUrl(categoryId, modelUrlProp, productIndex);

    return (
        <Canvas
            camera={{ position: [0, 0.5, 4], fov: 45 }}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            dpr={[1, 1.5]}
        >
            <ambientLight intensity={0.8} />
            <directionalLight position={[4, 6, 4]} intensity={1.4} castShadow />
            <pointLight position={[-3, -2, -2]} intensity={0.5} color="#f97316" />

            <Suspense fallback={<LoadingRing />}>
                <ModelBoundary>
                    <ModelGLTF url={modelUrl} />
                </ModelBoundary>
            </Suspense>

            <OrbitControls
                enableZoom={false}
                enablePan={false}
                autoRotate
                autoRotateSpeed={3}
                enableDamping
                dampingFactor={0.1}
            />
            <Environment preset="studio" />
        </Canvas>
    );
}
