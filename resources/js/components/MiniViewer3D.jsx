import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import ProductShape3D from './ProductShape3D';

/**
 * Viewer 3D compact intégré dans les cartes produit.
 * Affiche la vraie forme 3D du produit (chaise, vase, chaussure, casque...).
 * Le parent doit être position:relative avec une hauteur définie.
 */
export default function MiniViewer3D({ productName, categoryId, productIndex = 0 }) {
    return (
        <Canvas
            camera={{ position: [0, 0.3, 4.0], fov: 46 }}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            dpr={[1, 1.5]}
            shadows
        >
            <ambientLight intensity={0.65} />
            <directionalLight position={[4, 6, 4]} intensity={1.4} castShadow />
            <pointLight position={[-3, -2, -2]} intensity={0.5} color="#f97316" />

            <ProductShape3D
                productName={productName}
                categoryId={categoryId}
                productIndex={productIndex}
            />

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
