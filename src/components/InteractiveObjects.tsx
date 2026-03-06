import { Center, Text3D, useCursor, useGLTF } from '@react-three/drei';
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
    </group>
  );
}

function EmbossedFaceLabel({
  text,
  position,
  color,
}: {
  text: string;
  position: [number, number, number];
  color: string;
}) {
  return (
    <>
      <Center position={[position[0], position[1], position[2] + 0.035]}>
        <Text3D
          font={textFont}
          size={0.15}
          height={0.035}
          bevelEnabled
          bevelSize={0.006}
          bevelThickness={0.006}
          curveSegments={8}
        >
          {text}
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.45}
            metalness={0.62}
            roughness={0.2}
          />
        </Text3D>
      </Center>
      <Center position={[position[0], position[1], position[2] - 0.035]} rotation={[0, Math.PI, 0]}>
        <Text3D
          font={textFont}
          size={0.15}
          height={0.035}
          bevelEnabled
          bevelSize={0.006}
          bevelThickness={0.006}
          curveSegments={8}
        >
          {text}
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.45}
            metalness={0.62}
            roughness={0.2}
          />
        </Text3D>
      </Center>
    </>
  );
}

function CircularEmbossedWord({
  text,
  radius,
  y = 0,
  color,
  clockwise = true,
}: {
  text: string;
  radius: number;
  y?: number;
  color: string;
  clockwise?: boolean;
}) {
  const chars = text.split('');
  const spread = Math.PI * 0.82;
  const start = -spread / 2;

  return (
    <group position={[0, y, 0]}>
      {chars.map((char, index) => {
        const t = chars.length === 1 ? 0.5 : index / (chars.length - 1);
        const angle = start + t * spread;
        const x = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius;
        const rotationY = (clockwise ? 1 : -1) * angle;

        return (
          <Center
            key={`${text}-${index}-${char}`}
            position={[x, 0, z]}
            rotation={[0, rotationY, 0]}
          >
            <Text3D
              font={textFont}
              size={0.1}
              height={0.028}
              bevelEnabled
              bevelSize={0.004}
              bevelThickness={0.004}
              curveSegments={6}
            >
              {char}
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={0.42}
                metalness={0.55}
                roughness={0.24}
              />
            </Text3D>
          </Center>
        );
      })}
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
        onSelect={onOpenProjects}
        position={[-2.55, 1.02, 0.95]}
      >
        <group>
          <AssetModel assetUrl={laptopAssetUrl} rotation={[-0.18, 0.32, 0]} scale={0.92} />
          <group rotation={[-0.18, 0.32, 0]} position={[0, 1.02, -0.55]}>
            <EmbossedFaceLabel text="PROJECTS" position={[0, 0, 0]} color="#8ef9ff" />
          </group>
        </group>
      </Hotspot>

      <Hotspot
        color="#ff00aa"
        glowColor="#ff7bd3"
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
          <EmbossedFaceLabel text="ABOUT" position={[0, -0.08, 0]} color="#ff7bd3" />
        </group>
      </Hotspot>

      <Hotspot
        color={sunsetMode ? '#ffb347' : '#ffff00'}
        glowColor="#fff5a8"
        onSelect={onToggleMiami}
        position={[2.25, 0.88, 1.35]}
      >
        <group>
          <AssetModel assetUrl={cocktailAssetUrl} scale={0.88} />
          <CircularEmbossedWord
            text="MIAMI"
            radius={0.47}
            y={0.62}
            color={sunsetMode ? '#ffd089' : '#ffff8f'}
          />
        </group>
      </Hotspot>

      <Hotspot
        color="#8b5cf6"
        glowColor="#bca5ff"
        onSelect={onOpenContact}
        position={[0.15, 2.55, 1.75]}
      >
        <group>
          <AssetModel assetUrl={contactOrbAssetUrl} scale={0.95} />
          <CircularEmbossedWord text="CONTACT" radius={0.9} y={0} color="#c7b4ff" />
        </group>
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
