import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import SafeCanvas from './SafeCanvas';
import SafeOrbitControls from './SafeOrbitControls';

function PokéBallMesh() {
  const ballRef = useRef();
  const ringRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ballRef.current) {
      ballRef.current.rotation.y = t * 0.4;
      ballRef.current.rotation.x = Math.sin(t * 0.2) * 0.1;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = -t * 0.6;
      ringRef.current.rotation.x = Math.cos(t * 0.3) * 0.2;
    }
  });

  return (
    <group ref={ballRef}>
      {/* Top Hemisphere (Red / Cyan Glow) */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1.5, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#06b6d4" roughness={0.2} metalness={0.8} emissive="#0284c7" emissiveIntensity={0.3} />
      </mesh>

      {/* Bottom Hemisphere (White Metallic) */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1.5, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.3} metalness={0.9} />
      </mesh>

      {/* Middle Dark Band */}
      <mesh position={[0, 0, 0]} scale={[1.52, 0.2, 1.52]}>
        <cylinderGeometry args={[1, 1, 1, 32]} />
        <meshStandardMaterial color="#090d16" roughness={0.5} metalness={0.5} />
      </mesh>

      {/* Center Outer Button Ring */}
      <mesh position={[0, 0, 1.48]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.1, 32]} />
        <meshStandardMaterial color="#0f172a" metalness={0.8} />
      </mesh>

      {/* Center Glowing Pulse Button */}
      <mesh position={[0, 0, 1.52]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.1, 32]} />
        <meshBasicMaterial color="#38bdf8" />
      </mesh>

      {/* Holographic Energy Ring */}
      <group ref={ringRef}>
        <mesh rotation={[Math.PI / 3, 0, 0]}>
          <torusGeometry args={[2.3, 0.03, 16, 100]} />
          <meshBasicMaterial color="#06b6d4" transparent opacity={0.6} />
        </mesh>
      </group>
    </group>
  );
}

function FloatingParticles() {
  const count = 60;
  const positions = React.useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return pos;
  }, []);

  const pointsRef = useRef();
  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.08} color="#06b6d4" transparent opacity={0.7} sizeAttenuation />
    </points>
  );
}

export default function HeroBallScene() {
  return (
    <div className="w-full h-full min-h-[350px] relative flex items-center justify-center">
      <SafeCanvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} />
        <pointLight position={[-5, -5, -5]} color="#06b6d4" intensity={2} />

        <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
          <PokéBallMesh />
        </Float>

        <FloatingParticles />

        <SafeOrbitControls enableZoom={false} autoRotate autoRotateSpeed={1.5} enableDamping={true} dampingFactor={0.05} />
      </SafeCanvas>
    </div>
  );
}
