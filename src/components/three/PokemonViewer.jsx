import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, ContactShadows } from '@react-three/drei';
import SafeCanvas from './SafeCanvas';
import SafeOrbitControls from './SafeOrbitControls';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RotateCcw, Sparkles, Box, Layers, RefreshCw } from 'lucide-react';
import { getTypeColor } from '../../utils/typeColors';

// -------------------------------------------------------------
// Pure 3D Canvas Sub-components
// -------------------------------------------------------------

function GltfModelMesh({ scene }) {
  const groupRef = useRef();

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005;
    }
  });

  if (!scene) return null;

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  );
}

function Volumetric3DStatueMesh({ texture, typeColor }) {
  const groupRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * 1.5) * 0.08;
      groupRef.current.rotation.y = Math.sin(t * 0.5) * 0.12;
    }
  });

  if (!texture) return null;

  return (
    <group ref={groupRef} position={[0, 0.2, 0]}>
      {/* 3D Glass Prism Frame */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2.8, 2.8, 0.35]} />
        <meshPhysicalMaterial
          color={typeColor}
          transmission={0.85}
          opacity={0.92}
          transparent
          roughness={0.12}
          metalness={0.3}
          clearcoat={1.0}
          clearcoatRoughness={0.1}
          ior={1.45}
          thickness={0.5}
        />
      </mesh>

      {/* Front Face Sprite */}
      <mesh position={[0, 0, 0.19]}>
        <planeGeometry args={[2.6, 2.6]} />
        <meshBasicMaterial map={texture} transparent side={THREE.FrontSide} />
      </mesh>

      {/* Back Face Sprite */}
      <mesh position={[0, 0, -0.19]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[2.6, 2.6]} />
        <meshBasicMaterial map={texture} transparent side={THREE.FrontSide} />
      </mesh>

      {/* Metallic Wireframe Border */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2.85, 2.85, 0.36]} />
        <meshStandardMaterial
          color={typeColor}
          wireframe
          emissive={typeColor}
          emissiveIntensity={0.7}
        />
      </mesh>

      {/* Internal Floating Depth Layer */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[2.4, 2.4]} />
        <meshBasicMaterial
          map={texture}
          transparent
          opacity={0.35}
          color={typeColor}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

function HoloStageBase({ typeColor, isShiny }) {
  const ringRef = useRef();
  const particleGroup = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ringRef.current) ringRef.current.rotation.z = t * 0.3;
    if (particleGroup.current) particleGroup.current.rotation.y = t * 0.15;
  });

  const particles = React.useMemo(() => {
    return Array.from({ length: 24 }).map((_, i) => ({
      angle: (i / 24) * Math.PI * 2,
      radius: 1.4 + (i % 4) * 0.25,
      y: ((i % 5) - 2) * 0.35,
      size: 0.035 + (i % 3) * 0.02,
    }));
  }, []);

  const stageColor = isShiny ? '#f59e0b' : typeColor;

  return (
    <group position={[0, -1.2, 0]}>
      {/* 3D Pedestal Base */}
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[1.5, 1.8, 0.22, 32]} />
        <meshStandardMaterial
          color="#090d16"
          metalness={0.92}
          roughness={0.15}
          emissive={stageColor}
          emissiveIntensity={isShiny ? 0.6 : 0.25}
        />
      </mesh>

      {/* Glowing Outer Ring */}
      <mesh ref={ringRef} position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.28, 1.52, 32]} />
        <meshBasicMaterial color={stageColor} transparent opacity={0.85} side={THREE.DoubleSide} />
      </mesh>

      {/* Floating 3D Specular Particles */}
      <group ref={particleGroup}>
        {particles.map((p, idx) => (
          <mesh
            key={idx}
            position={[
              Math.cos(p.angle) * p.radius,
              p.y,
              Math.sin(p.angle) * p.radius,
            ]}
          >
            <sphereGeometry args={[p.size, 12, 12]} />
            <meshBasicMaterial color={stageColor} transparent opacity={0.9} />
          </mesh>
        ))}
      </group>

      {/* Soft Contact Shadow */}
      <ContactShadows position={[0, -0.22, 0]} opacity={0.65} scale={4.5} blur={2.0} far={2.5} />
    </group>
  );
}

function StudioLighting({ colorHex, isShiny }) {
  return (
    <>
      <ambientLight intensity={1.2} color="#f1f5f9" />
      <directionalLight position={[6, 9, 6]} intensity={2.2} castShadow />
      <directionalLight position={[-6, 4, -4]} intensity={1.0} color="#06b6d4" />
      <directionalLight position={[0, -2, -6]} intensity={1.4} color="#38bdf8" />
      <pointLight position={[0, 2.2, 3]} color={isShiny ? '#fbbf24' : colorHex} intensity={isShiny ? 4.5 : 3.5} distance={10} />
    </>
  );
}

// -------------------------------------------------------------
// Main Component
// -------------------------------------------------------------

export default function PokemonViewer({ pokemon, isShiny, onToggleShiny }) {
  const controlsRef = useRef();
  const [viewMode, setViewMode] = useState('mesh'); // 'mesh' | 'sculpture'
  const [gltfScene, setGltfScene] = useState(null);
  const [texture, setTexture] = useState(null);
  const [loadingGltf, setLoadingGltf] = useState(true);
  const [gltfError, setGltfError] = useState(false);

  const primaryType = pokemon?.types[0]?.name || 'normal';
  const colorInfo = getTypeColor(primaryType);
  const activeImage = isShiny ? pokemon.shinyImage : pokemon.image;

  // Load Texture
  useEffect(() => {
    if (!activeImage) return;
    const loader = new THREE.TextureLoader();
    loader.load(
      activeImage,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        setTexture(tex);
      },
      undefined,
      (err) => console.warn('Texture load error:', err)
    );
  }, [activeImage]);

  // Load 3D GLTF Model with PBR Material Polish
  useEffect(() => {
    let isMounted = true;
    setGltfScene(null);
    setLoadingGltf(true);
    setGltfError(false);

    if (!pokemon?.id) return;

    const loader = new GLTFLoader();
    const paddedId = String(pokemon.id).padStart(3, '0');

    const urls = isShiny
      ? [
          `https://raw.githubusercontent.com/Sudhanshu-Ambastha/Pokemon-3D/main/models/glb/shiny/${pokemon.id}.glb`,
          `https://raw.githubusercontent.com/Sudhanshu-Ambastha/Pokemon-3D/main/models/glb/regular/${pokemon.id}.glb`,
          `https://raw.githubusercontent.com/06wj/pokemon/master/models/${paddedId}/glTF/model.gltf`,
        ]
      : [
          `https://raw.githubusercontent.com/Sudhanshu-Ambastha/Pokemon-3D/main/models/glb/regular/${pokemon.id}.glb`,
          `https://raw.githubusercontent.com/06wj/pokemon/master/models/${paddedId}/glTF/model.gltf`,
          `https://raw.githubusercontent.com/Sudhanshu-Ambastha/Pokemon-3D/main/models/glb/${pokemon.id}.glb`,
        ];

    let attemptedIndex = 0;

    function tryLoadNext() {
      if (attemptedIndex >= urls.length) {
        if (isMounted) {
          setLoadingGltf(false);
          setGltfError(true);
        }
        return;
      }

      const url = urls[attemptedIndex++];

      loader.load(
        url,
        (gltf) => {
          if (!isMounted) return;
          const object = gltf.scene;

          // Auto center and scale
          const box = new THREE.Box3().setFromObject(object);
          const size = box.getSize(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z) || 1;
          const scale = 2.6 / maxDim;

          object.scale.set(scale, scale, scale);

          const center = box.getCenter(new THREE.Vector3());
          object.position.x = -center.x * scale;
          object.position.y = -center.y * scale - 0.2;
          object.position.z = -center.z * scale;

          // Material Polish for realistic lighting
          object.traverse((child) => {
            if (child.isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
              if (child.material) {
                child.material.envMapIntensity = 1.2;
                if (child.material.isMeshStandardMaterial || child.material.isMeshPhysicalMaterial) {
                  child.material.roughness = Math.max(child.material.roughness || 0.3, 0.2);
                  child.material.metalness = child.material.metalness || 0.1;
                }
                child.material.needsUpdate = true;
              }
            }
          });

          setGltfScene(object);
          setLoadingGltf(false);
        },
        undefined,
        () => tryLoadNext()
      );
    }

    tryLoadNext();

    return () => {
      isMounted = false;
    };
  }, [pokemon?.id, isShiny]);

  const handleResetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  const isMeshActive = viewMode === 'mesh' && !gltfError && gltfScene;

  return (
    <div className="relative w-full h-[400px] sm:h-[480px] glass-panel rounded-3xl border border-white/10 overflow-hidden flex flex-col justify-between p-4 shadow-[0_0_50px_rgba(6,182,212,0.15)] transition-all">
      {/* Background Color Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-[100px] opacity-25 pointer-events-none transition-all duration-700"
        style={{ backgroundColor: colorInfo.hex }}
      />

      {/* Top Header Overlay */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 rounded-2xl bg-slate-900/90 border border-white/10 font-mono text-[11px] shadow-lg">
            <button
              onClick={() => setViewMode('mesh')}
              className={`px-3 py-1.5 rounded-xl font-bold uppercase transition-all flex items-center gap-1.5 ${
                viewMode === 'mesh' && !gltfError
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              <span>3D Mesh</span>
            </button>

            <button
              onClick={() => setViewMode('sculpture')}
              className={`px-3 py-1.5 rounded-xl font-bold uppercase transition-all flex items-center gap-1.5 ${
                viewMode === 'sculpture' || gltfError
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>3D Hologram</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Shiny Toggle Button */}
          <button
            onClick={onToggleShiny}
            className={`px-3 py-1.5 rounded-xl border text-xs font-mono uppercase font-bold flex items-center gap-1.5 transition-all shadow-md ${
              isShiny
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                : 'bg-slate-900/80 text-slate-300 border-white/10 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{isShiny ? 'Shiny' : 'Normal'}</span>
          </button>

          {/* Reset Camera Button */}
          <button
            onClick={handleResetCamera}
            className="p-2 rounded-xl bg-slate-900/80 border border-white/10 text-slate-300 hover:text-cyan-400 transition-colors shadow-md"
            title="Reset Camera View"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Loading Overlay */}
      {viewMode === 'mesh' && loadingGltf && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/60 backdrop-blur-sm pointer-events-none transition-opacity duration-300">
          <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-slate-900/90 border border-cyan-500/40 text-cyan-400 font-mono text-xs shadow-[0_0_25px_rgba(6,182,212,0.3)]">
            <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
            <span>Rendering 3D Mesh...</span>
          </div>
        </div>
      )}

      {/* 3D WebGL Canvas */}
      <div className="w-full h-full absolute inset-0">
        <SafeCanvas camera={{ position: [0, 0.3, 4.8], fov: 45 }} shadows>
          <StudioLighting colorHex={colorInfo.hex} isShiny={isShiny} />
          <HoloStageBase typeColor={colorInfo.hex} isShiny={isShiny} />

          {isMeshActive ? (
            <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.25}>
              <GltfModelMesh scene={gltfScene} />
            </Float>
          ) : (
            <Float speed={2} rotationIntensity={0.2} floatIntensity={0.4}>
              <Volumetric3DStatueMesh texture={texture} typeColor={colorInfo.hex} />
            </Float>
          )}

          <SafeOrbitControls
            ref={controlsRef}
            enableDamping={true}
            dampingFactor={0.05}
            rotateSpeed={0.8}
            zoomSpeed={0.8}
            enableZoom={true}
            minDistance={2.5}
            maxDistance={8}
            enablePan={false}
            maxPolarAngle={Math.PI / 2 + 0.1}
          />
        </SafeCanvas>
      </div>

      {/* Bottom Status Footer */}
      <div className="relative z-10 mt-auto flex items-center justify-between text-[10px] font-mono text-slate-300 bg-slate-950/80 p-2.5 rounded-2xl border border-white/10 backdrop-blur-md">
        <span className="hidden sm:inline">3D CONTROLS: Drag to rotate 360° // Scroll to zoom</span>
        <span className="sm:hidden">3D: Drag to rotate // Pinch to zoom</span>
        <div className="flex items-center gap-2">
          <span className="text-cyan-400 font-extrabold uppercase">{pokemon.displayName}</span>
          <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[9px]">
            {isMeshActive ? 'GLTF 3D MESH' : '3D HOLOGRAM'}
          </span>
        </div>
      </div>
    </div>
  );
}
