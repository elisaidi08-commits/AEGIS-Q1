import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { RoundedBox, Environment } from '@react-three/drei';
import * as THREE from 'three';

function CardMesh({ variant = 'core' }: { variant?: 'core' | 'aurora' | 'obsidian' }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
      meshRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.3) * 0.05;

      if (hovered) {
        meshRef.current.rotation.y += 0.01;
      }
    }
  });

  const materials = {
    core: new THREE.MeshStandardMaterial({
      color: '#00F5A0',
      metalness: 0.9,
      roughness: 0.1,
      emissive: '#00F5A0',
      emissiveIntensity: 0.2,
    }),
    aurora: new THREE.MeshStandardMaterial({
      color: '#7C3AED',
      metalness: 0.95,
      roughness: 0.05,
      emissive: '#3B82F6',
      emissiveIntensity: 0.3,
    }),
    obsidian: new THREE.MeshStandardMaterial({
      color: '#1a1a1a',
      metalness: 0.95,
      roughness: 0.15,
      emissive: '#00F5A0',
      emissiveIntensity: 0.1,
    }),
  };

  return (
    <RoundedBox
      ref={meshRef}
      args={[3.4, 2.1, 0.1]}
      radius={0.15}
      smoothness={4}
      material={materials[variant]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <meshStandardMaterial attach="material" {...materials[variant]} />
    </RoundedBox>
  );
}

interface Card3DProps {
  variant?: 'core' | 'aurora' | 'obsidian';
  className?: string;
}

export const Card3D: React.FC<Card3DProps> = ({ variant = 'core', className = '' }) => {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <CardMesh variant={variant} />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
};
