/**
 * ProductShape3D
 * – Chaussures : vrai modèle GLB (Nike via jsDelivr)
 * – Lunettes, Casques, Montres : formes procédurales fidèles
 */
import { Component, Suspense, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

/* ── GLB réel pour les chaussures ── */
const SHOE_GLB = 'https://cdn.jsdelivr.net/gh/KhronosGroup/glTF-Sample-Models@main/2.0/MaterialsVariantsShoe/glTF-Binary/MaterialsVariantsShoe.glb';

function GLBModel({ url }) {
    const { scene } = useGLTF(url);
    const obj = useMemo(() => {
        const clone  = scene.clone(true);
        const box    = new THREE.Box3().setFromObject(clone);
        const size   = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        if (maxDim > 0) clone.scale.setScalar(2.2 / maxDim);
        const box2   = new THREE.Box3().setFromObject(clone);
        const center = box2.getCenter(new THREE.Vector3());
        clone.position.sub(center);
        return clone;
    }, [scene]);
    return <primitive object={obj} />;
}

function Ring() {
    const ref = useRef();
    useFrame((_, dt) => { if (ref.current) ref.current.rotation.z += dt * 2; });
    return (
        <mesh ref={ref}>
            <torusGeometry args={[0.6, 0.1, 8, 50]} />
            <meshStandardMaterial color="#9d4300" roughness={0.4} />
        </mesh>
    );
}

class Boundary extends Component {
    constructor(p) { super(p); this.state = { err: false }; }
    static getDerivedStateFromError() { return { err: true }; }
    render() { return this.state.err ? this.props.fallback : this.props.children; }
}

/* ══════════════════════════════════════════
   LUNETTES — deux verres ronds + branches
   ══════════════════════════════════════════ */
function Glasses({ frameColor = '#111111', lensColor = '#050505' }) {
    return (
        <group rotation={[0.18, 0, 0]}>
            {/* Verre gauche */}
            <group position={[-0.56, 0, 0]}>
                <mesh>
                    <torusGeometry args={[0.38, 0.058, 16, 64]} />
                    <meshStandardMaterial color={frameColor} roughness={0.08} metalness={0.65} />
                </mesh>
                <mesh position={[0, 0, -0.01]}>
                    <circleGeometry args={[0.33, 64]} />
                    <meshStandardMaterial color={lensColor} roughness={0.02} metalness={0.15}
                        transparent opacity={0.9} />
                </mesh>
            </group>
            {/* Verre droit */}
            <group position={[0.56, 0, 0]}>
                <mesh>
                    <torusGeometry args={[0.38, 0.058, 16, 64]} />
                    <meshStandardMaterial color={frameColor} roughness={0.08} metalness={0.65} />
                </mesh>
                <mesh position={[0, 0, -0.01]}>
                    <circleGeometry args={[0.33, 64]} />
                    <meshStandardMaterial color={lensColor} roughness={0.02} metalness={0.15}
                        transparent opacity={0.9} />
                </mesh>
            </group>
            {/* Pont nez */}
            <mesh position={[0, 0.07, 0]}>
                <boxGeometry args={[0.36, 0.05, 0.04]} />
                <meshStandardMaterial color={frameColor} roughness={0.08} metalness={0.65} />
            </mesh>
            {/* Branche gauche */}
            <mesh position={[-1.04, 0.04, -0.22]} rotation={[0, 0.38, 0]}>
                <boxGeometry args={[0.6, 0.045, 0.04]} />
                <meshStandardMaterial color={frameColor} roughness={0.08} metalness={0.65} />
            </mesh>
            {/* Branche droite */}
            <mesh position={[1.04, 0.04, -0.22]} rotation={[0, -0.38, 0]}>
                <boxGeometry args={[0.6, 0.045, 0.04]} />
                <meshStandardMaterial color={frameColor} roughness={0.08} metalness={0.65} />
            </mesh>
        </group>
    );
}

/* ══════════════════════════════════════════
   CASQUE AUDIO over-ear
   ══════════════════════════════════════════ */
function Headphones({ color = '#1c1c1c', accent = '#9d4300' }) {
    return (
        <group scale={[0.9, 0.9, 0.9]}>
            {/* Arceau */}
            <mesh castShadow position={[0, 0.35, 0]} rotation={[0, 0, Math.PI]}>
                <torusGeometry args={[0.98, 0.08, 16, 100, Math.PI]} />
                <meshStandardMaterial color={color} roughness={0.15} metalness={0.72} />
            </mesh>
            {/* Oreillettes */}
            {[[-0.97, -0.36], [0.97, -0.36]].map(([x, y], i) => (
                <group key={i} position={[x, y, 0]}>
                    <mesh castShadow rotation={[0, 0, Math.PI / 2]}>
                        <cylinderGeometry args={[0.44, 0.44, 0.3, 64]} />
                        <meshStandardMaterial color="#1a1a1a" roughness={0.82} metalness={0.05} />
                    </mesh>
                    <mesh castShadow position={[i === 0 ? -0.19 : 0.19, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                        <cylinderGeometry args={[0.42, 0.42, 0.07, 64]} />
                        <meshStandardMaterial color={color} roughness={0.1} metalness={0.78} />
                    </mesh>
                    <mesh position={[i === 0 ? -0.24 : 0.24, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                        <cylinderGeometry args={[0.13, 0.13, 0.01, 32]} />
                        <meshStandardMaterial color={accent} roughness={0.05} metalness={0.9} />
                    </mesh>
                </group>
            ))}
            {/* Tiges réglables */}
            {[[-0.97, -0.03], [0.97, -0.03]].map(([x, y], i) => (
                <mesh key={i} castShadow position={[x, y, 0]}>
                    <boxGeometry args={[0.09, 0.72, 0.09]} />
                    <meshStandardMaterial color={color} roughness={0.18} metalness={0.68} />
                </mesh>
            ))}
        </group>
    );
}

/* ══════════════════════════════════════════
   CASQUE GAMING — plus angulaire, accents RGB
   ══════════════════════════════════════════ */
function GamingHeadset({ color = '#111827' }) {
    return (
        <group scale={[0.88, 0.88, 0.88]}>
            {/* Arceau */}
            <mesh castShadow position={[0, 0.38, 0]} rotation={[0, 0, Math.PI]}>
                <torusGeometry args={[1.0, 0.1, 8, 80, Math.PI]} />
                <meshStandardMaterial color={color} roughness={0.2} metalness={0.6} />
            </mesh>
            {/* Oreillettes gaming */}
            {[[-1.0, -0.36], [1.0, -0.36]].map(([x, y], i) => (
                <group key={i} position={[x, y, 0]}>
                    {/* Corps angulaire */}
                    <mesh castShadow rotation={[0, 0, Math.PI / 2]}>
                        <cylinderGeometry args={[0.48, 0.42, 0.32, 8]} />
                        <meshStandardMaterial color="#0f0f0f" roughness={0.6} metalness={0.1} />
                    </mesh>
                    {/* Coque extérieure */}
                    <mesh castShadow position={[i === 0 ? -0.2 : 0.2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                        <cylinderGeometry args={[0.44, 0.44, 0.07, 8]} />
                        <meshStandardMaterial color={color} roughness={0.15} metalness={0.8} />
                    </mesh>
                    {/* Bande RGB */}
                    <mesh position={[i === 0 ? -0.25 : 0.25, 0.1, 0]} rotation={[0, 0, Math.PI / 2]}>
                        <boxGeometry args={[0.02, 0.6, 0.08]} />
                        <meshStandardMaterial color="#ff0040" roughness={0} metalness={0}
                            emissive="#ff0040" emissiveIntensity={1.5} />
                    </mesh>
                </group>
            ))}
            {/* Tiges */}
            {[[-1.0, -0.02], [1.0, -0.02]].map(([x, y], i) => (
                <mesh key={i} castShadow position={[x, y, 0]}>
                    <boxGeometry args={[0.1, 0.74, 0.1]} />
                    <meshStandardMaterial color={color} roughness={0.2} metalness={0.7} />
                </mesh>
            ))}
            {/* Micro boom */}
            <mesh castShadow position={[-1.12, -0.7, 0.3]} rotation={[0.3, 0, 0.2]}>
                <cylinderGeometry args={[0.03, 0.03, 0.55, 12]} />
                <meshStandardMaterial color="#0a0a0a" roughness={0.4} metalness={0.5} />
            </mesh>
            <mesh castShadow position={[-1.14, -0.96, 0.44]}>
                <sphereGeometry args={[0.07, 16, 16]} />
                <meshStandardMaterial color="#0a0a0a" roughness={0.6} metalness={0.3} />
            </mesh>
        </group>
    );
}

/* ══════════════════════════════════════════
   MONTRE CHRONOGRAPHE ronde
   ══════════════════════════════════════════ */
function Watch({ color = '#8b8b8b' }) {
    const hourMarks = useMemo(
        () => Array.from({ length: 12 }, (_, i) => {
            const a = (i * Math.PI * 2) / 12;
            return [Math.sin(a) * 0.48, Math.cos(a) * 0.48];
        }),
        []
    );
    return (
        <group rotation={[0.22, 0, 0]}>
            <mesh castShadow>
                <cylinderGeometry args={[0.64, 0.64, 0.19, 64]} />
                <meshStandardMaterial color={color} roughness={0.06} metalness={0.92} />
            </mesh>
            <mesh position={[0, 0.1, 0]}>
                <cylinderGeometry args={[0.6, 0.6, 0.01, 64]} />
                <meshStandardMaterial color="#f5f5f0" roughness={0.04} metalness={0.05} />
            </mesh>
            {hourMarks.map(([sx, sz], i) => (
                <mesh key={i} position={[sx, 0.11, sz]}>
                    <boxGeometry args={[i % 3 === 0 ? 0.06 : 0.03, 0.01, i % 3 === 0 ? 0.06 : 0.03]} />
                    <meshStandardMaterial color="#1a1c1c" />
                </mesh>
            ))}
            <mesh>
                <torusGeometry args={[0.64, 0.075, 16, 64]} />
                <meshStandardMaterial color={color} roughness={0.04} metalness={0.96} />
            </mesh>
            <mesh position={[0.74, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.065, 0.065, 0.13, 16]} />
                <meshStandardMaterial color={color} roughness={0.1} metalness={0.88} />
            </mesh>
            {[-0.9, 0.9].map((z, i) => (
                <mesh key={i} castShadow position={[0, 0, z]}>
                    <boxGeometry args={[0.82, 0.13, 0.92]} />
                    <meshStandardMaterial color="#111111" roughness={0.75} metalness={0.08} />
                </mesh>
            ))}
            <mesh position={[-0.09, 0.115, 0.05]} rotation={[0, 0, 0.55]}>
                <boxGeometry args={[0.04, 0.28, 0.015]} />
                <meshStandardMaterial color="#1a1c1c" />
            </mesh>
            <mesh position={[0.07, 0.115, -0.06]} rotation={[0, 0, -1.05]}>
                <boxGeometry args={[0.03, 0.42, 0.012]} />
                <meshStandardMaterial color="#1a1c1c" />
            </mesh>
            <mesh position={[0, 0.118, 0]} rotation={[0, 0, 2.1]}>
                <boxGeometry args={[0.018, 0.5, 0.01]} />
                <meshStandardMaterial color="#f97316" emissive="#f97316" emissiveIntensity={0.4} />
            </mesh>
        </group>
    );
}

/* ══════════════════════════════════════════
   SMARTWATCH — écran rectangulaire
   ══════════════════════════════════════════ */
function Smartwatch({ color = '#1c1c1e' }) {
    return (
        <group rotation={[0.22, 0, 0]}>
            {/* Corps */}
            <mesh castShadow>
                <boxGeometry args={[0.78, 0.92, 0.2]} />
                <meshStandardMaterial color={color} roughness={0.1} metalness={0.7} />
            </mesh>
            {/* Écran AMOLED */}
            <mesh position={[0, 0, 0.105]}>
                <boxGeometry args={[0.66, 0.8, 0.01]} />
                <meshStandardMaterial color="#000408" roughness={0.02} metalness={0.05}
                    emissive="#0a1628" emissiveIntensity={0.6} />
            </mesh>
            {/* Heure fictive */}
            <mesh position={[0, 0.12, 0.112]}>
                <boxGeometry args={[0.4, 0.1, 0.005]} />
                <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.8} />
            </mesh>
            <mesh position={[0, -0.05, 0.112]}>
                <boxGeometry args={[0.28, 0.055, 0.005]} />
                <meshStandardMaterial color="#8888aa" emissive="#8888aa" emissiveIntensity={0.5} />
            </mesh>
            {/* Couronne */}
            <mesh position={[0.43, 0.18, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.055, 0.055, 0.1, 16]} />
                <meshStandardMaterial color={color} roughness={0.1} metalness={0.8} />
            </mesh>
            {/* Bracelet haut / bas */}
            {[-0.62, 0.62].map((y, i) => (
                <mesh key={i} castShadow position={[0, y, 0]}>
                    <boxGeometry args={[0.72, 0.55, 0.18]} />
                    <meshStandardMaterial color="#111111" roughness={0.75} metalness={0.05} />
                </mesh>
            ))}
        </group>
    );
}

/* ── Fallback ── */
function FallbackSphere() {
    const ref = useRef();
    useFrame((_, dt) => { if (ref.current) ref.current.rotation.y += dt * 0.5; });
    return (
        <mesh ref={ref}>
            <icosahedronGeometry args={[1, 2]} />
            <meshStandardMaterial color="#9d4300" roughness={0.3} metalness={0.4} />
        </mesh>
    );
}

/* ── Chaussure GLB ── */
function ShoeShape() {
    return (
        <Boundary fallback={<FallbackSphere />}>
            <Suspense fallback={<Ring />}>
                <GLBModel url={SHOE_GLB} />
            </Suspense>
        </Boundary>
    );
}

/* ══════════════════════════════════════════
   DÉTECTION + COULEURS PAR PRODUIT
   ══════════════════════════════════════════ */

export function detectShapeKey(name = '', categoryId) {
    const n = (name || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    if (/audio|headphone|ecouteur/.test(n))                                                     return 'headphones';
    if (/gaming|nexus|gamer/.test(n))                                                           return 'gaming';
    if (/casque/.test(n))                                                                       return 'headphones';
    if (/chaussure|shoe|basket|sneaker|botte|tennis|runner|running|velocity|trail/.test(n))     return 'shoe';
    if (/lunette|glass|ocular|optical|vision|soleil|optique|eyewear|ar glass/.test(n))         return 'glasses';
    if (/smartwatch|smart watch|motion/.test(n))                                               return 'smartwatch';
    if (/montre|watch|chrono|chronograph/.test(n))                                             return 'watch';
    // fallback par catégorie
    const CAT = { 1: 'glasses', 2: 'headphones', 3: 'shoe', 4: 'watch' };
    return CAT[categoryId] ?? 'glasses';
}

function resolveColors(key, productName) {
    const n = (productName || '').toLowerCase();
    switch (key) {
        case 'glasses':
            if (/ar|augment|ocular/.test(n)) return { frameColor: '#111111', lensColor: '#001a33' }; // AR → verre bleu sombre
            return { frameColor: '#111111', lensColor: '#050505' };                                   // sunglasses classiques

        case 'headphones':
            return { color: '#1c1c1c', accent: '#9d4300' };

        case 'gaming':
            return { color: '#111827' };

        case 'watch':
            if (/stone|elite/.test(n)) return { color: '#9b9b9b' }; // acier brossé
            return { color: '#8b8b8b' };

        case 'smartwatch':
            return { color: '#1c1c1e' }; // noir Apple-style

        default:
            return {};
    }
}

const SHAPE_MAP = {
    shoe:       ShoeShape,
    headphones: Headphones,
    gaming:     GamingHeadset,
    glasses:    Glasses,
    watch:      Watch,
    smartwatch: Smartwatch,
};

export default function ProductShape3D({ productName, categoryId }) {
    const key       = detectShapeKey(productName, categoryId);
    const ShapeComp = SHAPE_MAP[key] ?? Glasses;
    const colors    = resolveColors(key, productName);
    return <ShapeComp {...colors} />;
}
