import { Center, Html, Text3D, useCursor, useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { type ReactNode, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import helvetikerFont from 'three/examples/fonts/helvetiker_bold.typeface.json';
import cocktailAssetUrl from '../assets/generated/cocktail.glb?url';
import contactOrbAssetUrl from '../assets/generated/contact-orb.glb?url';
import laptopAssetUrl from '../assets/generated/laptop.glb?url';

const textFont = helvetikerFont as unknown as string;

interface InteractiveObjectsProps {
  sunsetMode: boolean;
  onOpenBio: () => void;
  onOpenProjects: () => void;
  onOpenContact: () => void;
  onToggleMiami: () => void;
}

interface HotspotProps {
  color: string;
  glowColor?: string;
  hint: string;
  onSelect: () => void;
  position: [number, number, number];
  children: ReactNode;
}

function AssetModel({
  assetUrl,
  rotation,
  scale = 1,
}: {
  assetUrl: string;
  rotation?: [number, number, number];
  scale?: number;
}) {
  const gltf = useGLTF(assetUrl);
  const clone = useMemo(() => gltf.scene.clone(true), [gltf.scene]);

  return <primitive object={clone} rotation={rotation} scale={scale} />;
}

function Hotspot({
  color,
  glowColor,
  hint,
  onSelect,
  position,
  children,
}: HotspotProps) {
  const group = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  useCursor(hovered, 'pointer', 'auto');

  useFrame(({ clock }, delta) => {
    if (!group.current) {
      return;
    }

    const scale = hovered ? 1.08 : 1;
    group.current.scale.lerp(new THREE.Vector3(scale, scale, scale), delta * 4);
    group.current.position.y = THREE.MathUtils.lerp(
      group.current.position.y,
      position[1] + Math.sin(clock.elapsedTime * 1.4 + position[0]) * 0.06,
      delta * 2.2,
    );
  });

  return (
    <group
      ref={group}
      position={position}
      onPointerDown={(event) => {
        event.stopPropagation();
        onSelect();
      }}
      onPointerOut={() => setHovered(false)}
      onPointerOver={(event) => {
        event.stopPropagation();
        setHovered(true);
      }}
    >
      {children}
      <mesh renderOrder={20}>
        <sphereGeometry args={[0.46, 18, 18]} />
        <meshBasicMaterial
          color={hovered ? glowColor ?? color : color}
          transparent
          opacity={hovered ? 0.09 : 0.025}
          depthTest={false}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh renderOrder={21}>
        <sphereGeometry args={[0.34, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.001}
          depthTest={false}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      {hovered && (
        <Html position={[0, 1.12, 0]} distanceFactor={7}>
          <div className="pointer-events-none rounded-full border border-white/20 bg-black/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.35em] text-white shadow-neon">
            {hint}
          </div>
        </Html>
      )}
    </group>
  );
}

function FloatingDecor({ sunsetMode }: { sunsetMode: boolean }) {
  const orbs = useMemo(
    () => [
      { position: [-2.8, 2.8, -0.8] as [number, number, number], color: '#00ffff', radius: 0.14 },
      { position: [2.4, 2.2, 0.5] as [number, number, number], color: '#ff00aa', radius: 0.1 },
      { position: [0.4, 3.4, -1.4] as [number, number, number], color: '#ffff00', radius: 0.09 },
    ],
    [],
  );

  const group = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!group.current) {
      return;
    }

    group.current.children.forEach((child, index) => {
      child.position.y =
        orbs[index].position[1] + Math.sin(clock.elapsedTime * (0.9 + index * 0.2)) * 0.18;
      child.rotation.y += 0.01;
    });
  });

  return (
    <group ref={group}>
      {orbs.map((orb) => (
        <mesh key={orb.position.join('-')} position={orb.position}>
          <icosahedronGeometry args={[orb.radius, 1]} />
          <meshStandardMaterial
            color={orb.color}
            emissive={sunsetMode && orb.color === '#00ffff' ? '#ffb347' : orb.color}
            emissiveIntensity={1.8}
            transparent
            opacity={0.88}
            roughness={0.15}
            metalness={0.1}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function InteractiveObjects({
  sunsetMode,
  onOpenBio,
  onOpenProjects,
  onOpenContact,
  onToggleMiami,
}: InteractiveObjectsProps) {
  return (
    <group>
      <Hotspot
        color="#00ffff"
        glowColor="#9afcff"
        hint="Open projects"
        onSelect={onOpenProjects}
        position={[-2.55, 1.02, 0.95]}
      >
        <AssetModel assetUrl={laptopAssetUrl} rotation={[-0.18, 0.32, 0]} scale={0.92} />
      </Hotspot>

      <Hotspot
        color="#ff00aa"
        glowColor="#ff7bd3"
        hint="Read bio"
        onSelect={onOpenBio}
        position={[2.55, 2.2, -0.3]}
      >
        <group>
          <mesh position={[0, 0, -0.04]}>
            <boxGeometry args={[2.18, 0.5, 0.12]} />
            <meshStandardMaterial
              color="#120d15"
              emissive="#ff00aa"
              emissiveIntensity={0.9}
              metalness={0.68}
              roughness={0.2}
            />
          </mesh>
          <mesh position={[-0.96, 0, 0.02]}>
            <boxGeometry args={[0.08, 0.58, 0.08]} />
            <meshStandardMaterial color="#0f1018" emissive="#00ffff" emissiveIntensity={0.9} />
          </mesh>
          <mesh position={[0.96, 0, 0.02]}>
            <boxGeometry args={[0.08, 0.58, 0.08]} />
            <meshStandardMaterial color="#0f1018" emissive="#ff00aa" emissiveIntensity={0.9} />
          </mesh>
          <mesh position={[0, 0, -0.09]}>
            <boxGeometry args={[2.45, 0.78, 0.03]} />
            <meshStandardMaterial color="#2d0d25" emissive="#ff00aa" emissiveIntensity={0.4} />
          </mesh>
          <Center position={[0, -0.08, 0.07]}>
            <Text3D
              font={textFont}
              size={0.22}
              height={0.05}
              bevelEnabled
              bevelSize={0.01}
              bevelThickness={0.01}
              curveSegments={8}
            >
              ABOUT
              <meshStandardMaterial
                color="#ff7bd3"
                emissive="#ff00aa"
                emissiveIntensity={0.9}
                metalness={0.5}
                roughness={0.18}
              />
            </Text3D>
          </Center>
        </group>
      </Hotspot>

      <Hotspot
        color={sunsetMode ? '#ffb347' : '#ffff00'}
        glowColor="#fff5a8"
        hint="Toggle Miami mode"
        onSelect={onToggleMiami}
        position={[2.25, 0.88, 1.35]}
      >
        <AssetModel assetUrl={cocktailAssetUrl} scale={0.88} />
      </Hotspot>

      <Hotspot
        color="#8b5cf6"
        glowColor="#bca5ff"
        hint="Open contact links"
        onSelect={onOpenContact}
        position={[0.15, 2.55, 1.75]}
      >
        <AssetModel assetUrl={contactOrbAssetUrl} scale={0.95} />
      </Hotspot>

      <group position={[4.35, 1.8, -1.5]}>
        <mesh rotation={[0, -0.35, 0]}>
          <octahedronGeometry args={[0.18, 0]} />
          <meshStandardMaterial
            color="#00ffff"
            emissive="#00ffff"
            emissiveIntensity={1.6}
            transparent
            opacity={0.55}
          />
        </mesh>
        <mesh position={[0, -0.35, 0]}>
          <cylinderGeometry args={[0.03, 0.06, 0.7, 8]} />
          <meshStandardMaterial color="#89fff5" emissive="#00ffff" emissiveIntensity={1.2} />
        </mesh>
        <mesh position={[0.18, -0.05, 0]} rotation={[0, 0, Math.PI / 6]}>
          <boxGeometry args={[0.28, 0.09, 0.02]} />
          <meshStandardMaterial color="#89fff5" emissive="#00ffff" emissiveIntensity={0.8} />
        </mesh>
        <mesh position={[-0.18, 0.08, 0]} rotation={[0, 0, -Math.PI / 6]}>
          <boxGeometry args={[0.28, 0.09, 0.02]} />
          <meshStandardMaterial color="#89fff5" emissive="#00ffff" emissiveIntensity={0.8} />
        </mesh>
      </group>

      <FloatingDecor sunsetMode={sunsetMode} />
    </group>
  );
}

useGLTF.preload(laptopAssetUrl);
useGLTF.preload(cocktailAssetUrl);
useGLTF.preload(contactOrbAssetUrl);
