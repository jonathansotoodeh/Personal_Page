import { Center, Text, Text3D, useCursor, useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { type ReactNode, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import helvetikerFont from 'three/examples/fonts/helvetiker_bold.typeface.json';
import cocktailAssetUrl from '../assets/generated/cocktail.glb?url';
import contactOrbAssetUrl from '../assets/generated/contact-orb.glb?url';

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

function NeonPlaqueLabel({
  text,
  position,
  color,
  plaqueSize = [1.8, 0.36, 0.08],
  textSize = 0.17,
}: {
  text: string;
  position: [number, number, number];
  color: string;
  plaqueSize?: [number, number, number];
  textSize?: number;
}) {
  return (
    <>
      <mesh position={position}>
        <boxGeometry args={plaqueSize} />
        <meshStandardMaterial
          color="#120f19"
          emissive={color}
          emissiveIntensity={0.18}
          metalness={0.72}
          roughness={0.16}
        />
      </mesh>
      <Center position={[position[0], position[1], position[2] + 0.035]}>
        <Text3D
          font={textFont}
          size={textSize}
          height={0.045}
          bevelEnabled
          bevelSize={0.008}
          bevelThickness={0.008}
          curveSegments={8}
        >
          {text}
          <meshBasicMaterial color="#fffaf5" toneMapped={false} />
        </Text3D>
      </Center>
      <Center position={[position[0], position[1], position[2] - 0.035]} rotation={[0, Math.PI, 0]}>
        <Text3D
          font={textFont}
          size={textSize}
          height={0.045}
          bevelEnabled
          bevelSize={0.008}
          bevelThickness={0.008}
          curveSegments={8}
        >
          {text}
          <meshBasicMaterial color="#fffaf5" toneMapped={false} />
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
  size = 0.14,
  bandRadius = 0.12,
}: {
  text: string;
  radius: number;
  y?: number;
  color: string;
  size?: number;
  bandRadius?: number;
}) {
  const chars = text.split('');
  const spread = Math.PI * 0.92;
  const start = -spread / 2;

  return (
    <group position={[0, y, 0]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, bandRadius, 18, 96]} />
        <meshStandardMaterial
          color="#130f1b"
          emissive={color}
          emissiveIntensity={0.18}
          metalness={0.68}
          roughness={0.16}
        />
      </mesh>
      {[0, Math.PI].map((sideRotation) => (
        <group key={sideRotation} rotation={[0, sideRotation, 0]}>
          {chars.map((char, index) => {
            const t = chars.length === 1 ? 0.5 : index / (chars.length - 1);
            const angle = start + t * spread;
            const x = Math.sin(angle) * radius;
            const z = Math.cos(angle) * radius;

            return (
              <Center
                key={`${text}-${sideRotation}-${index}-${char}`}
                position={[x, 0, z]}
                rotation={[0, angle, 0]}
              >
                <Text3D
                  font={textFont}
                  size={size}
                  height={0.045}
                  bevelEnabled
                  bevelSize={0.006}
                  bevelThickness={0.006}
                  curveSegments={6}
                >
                  {char}
                  <meshBasicMaterial color="#fffaf5" toneMapped={false} />
                </Text3D>
              </Center>
            );
          })}
        </group>
      ))}
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

function ProjectsTerminal({ sunsetMode }: { sunsetMode: boolean }) {
  return (
    <group rotation={[-0.08, 0.28, 0]}>
      <mesh position={[0, -0.18, 0.12]}>
        <boxGeometry args={[1.9, 0.14, 1.24]} />
        <meshStandardMaterial color="#101722" emissive="#143244" emissiveIntensity={0.18} metalness={0.74} roughness={0.18} />
      </mesh>
      <mesh position={[0, 0.18, -0.18]}>
        <boxGeometry args={[0.22, 0.48, 0.22]} />
        <meshStandardMaterial color="#151d2b" metalness={0.78} roughness={0.16} />
      </mesh>
      <mesh position={[0, 0.86, -0.28]}>
        <boxGeometry args={[1.32, 1.02, 0.16]} />
        <meshStandardMaterial color="#121927" emissive="#101f33" emissiveIntensity={0.24} metalness={0.66} roughness={0.15} />
      </mesh>
      <mesh position={[0, 0.86, -0.18]}>
        <boxGeometry args={[1.06, 0.76, 0.03]} />
        <meshStandardMaterial
          color={sunsetMode ? '#ffb347' : '#8ef9ff'}
          emissive={sunsetMode ? '#ffb347' : '#00ffff'}
          emissiveIntensity={1.15}
          metalness={0.12}
          roughness={0.08}
        />
      </mesh>
      <Text
        position={[0, 0.97, -0.148]}
        fontSize={0.18}
        maxWidth={0.82}
        textAlign="center"
        anchorX="center"
        anchorY="middle"
        color="#f8feff"
        outlineColor="#09131b"
        outlineWidth={0.008}
        material-toneMapped={false}
      >
        PROJECTS
      </Text>
      {[-0.26, 0, 0.26].map((x) => (
        <mesh key={`screen-line-${x}`} position={[x, 0.71, -0.153]}>
          <boxGeometry args={[0.14, 0.028, 0.012]} />
          <meshStandardMaterial
            color="#081018"
            emissive="#b6ffff"
            emissiveIntensity={0.3}
            metalness={0.08}
            roughness={0.22}
          />
        </mesh>
      ))}
      <mesh position={[0, 0.52, -0.153]}>
        <boxGeometry args={[0.5, 0.032, 0.012]} />
        <meshStandardMaterial
          color="#081018"
          emissive="#d7ffff"
          emissiveIntensity={0.24}
          metalness={0.08}
          roughness={0.22}
        />
      </mesh>
      <mesh position={[0, 0.06, 0.18]}>
        <boxGeometry args={[1.18, 0.04, 0.52]} />
        <meshStandardMaterial color="#0f1724" metalness={0.74} roughness={0.18} />
      </mesh>
      {[-0.34, -0.17, 0, 0.17, 0.34].map((x) => (
        <mesh key={x} position={[x, 0.09, 0.1]}>
          <boxGeometry args={[0.12, 0.02, 0.12]} />
          <meshStandardMaterial color="#18243a" emissive="#00ffff" emissiveIntensity={0.12} />
        </mesh>
      ))}
      <mesh position={[0, 0.07, 0.38]}>
        <boxGeometry args={[0.34, 0.012, 0.18]} />
        <meshStandardMaterial color="#253246" emissive="#8ef9ff" emissiveIntensity={0.08} />
      </mesh>
    </group>
  );
}

function AboutRobot() {
  return (
    <group rotation={[0, -0.18, 0]}>
      <pointLight position={[0.2, 2.1, 1.8]} intensity={18} distance={5.5} color="#dff7ff" />
      <pointLight position={[-0.9, 1.8, 0.9]} intensity={9} distance={4} color="#ffd3f1" />
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.62, 0.74, 0.16, 8]} />
        <meshStandardMaterial color="#506989" emissive="#6b2e83" emissiveIntensity={0.38} metalness={0.56} roughness={0.14} />
      </mesh>
      <mesh position={[0, 0.96, 0]}>
        <boxGeometry args={[1.08, 1.24, 0.56]} />
        <meshStandardMaterial color="#6b88ae" emissive="#6c2d88" emissiveIntensity={0.42} metalness={0.58} roughness={0.12} />
      </mesh>
      <mesh position={[0, 1.95, 0.02]}>
        <boxGeometry args={[0.74, 0.68, 0.54]} />
        <meshStandardMaterial color="#86a7cf" emissive="#365a7d" emissiveIntensity={0.34} metalness={0.46} roughness={0.12} />
      </mesh>
      <mesh position={[0, 2.42, 0.08]}>
        <boxGeometry args={[0.3, 0.08, 0.08]} />
        <meshStandardMaterial color="#21283a" emissive="#00ffff" emissiveIntensity={0.22} />
      </mesh>
      <mesh position={[0, 2.64, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.34, 10]} />
        <meshStandardMaterial color="#95a9c8" emissive="#8ef9ff" emissiveIntensity={0.14} metalness={0.5} roughness={0.14} />
      </mesh>
      <mesh position={[0, 2.83, 0]}>
        <sphereGeometry args={[0.05, 12, 12]} />
        <meshStandardMaterial color="#8ef9ff" emissive="#00ffff" emissiveIntensity={1.2} />
      </mesh>
      <mesh position={[-0.17, 1.98, 0.29]}>
        <sphereGeometry args={[0.06, 14, 14]} />
        <meshStandardMaterial color="#8ef9ff" emissive="#00ffff" emissiveIntensity={1.2} />
      </mesh>
      <mesh position={[0.17, 1.98, 0.29]}>
        <sphereGeometry args={[0.06, 14, 14]} />
        <meshStandardMaterial color="#ff7bd3" emissive="#ff00aa" emissiveIntensity={1.2} />
      </mesh>
      <mesh position={[0, 1.7, 0.3]}>
        <boxGeometry args={[0.24, 0.06, 0.06]} />
        <meshStandardMaterial color="#f3f0b0" emissive="#fef08a" emissiveIntensity={0.85} metalness={0.18} roughness={0.16} />
      </mesh>
      <mesh position={[-0.78, 1.06, 0]} rotation={[0, 0, 0.18]}>
        <boxGeometry args={[0.22, 0.9, 0.22]} />
        <meshStandardMaterial color="#90abd1" emissive="#29476b" emissiveIntensity={0.18} metalness={0.5} roughness={0.16} />
      </mesh>
      <mesh position={[0.78, 1.06, 0]} rotation={[0, 0, -0.18]}>
        <boxGeometry args={[0.22, 0.9, 0.22]} />
        <meshStandardMaterial color="#90abd1" emissive="#29476b" emissiveIntensity={0.18} metalness={0.5} roughness={0.16} />
      </mesh>
      <mesh position={[-0.28, 0.18, 0]} rotation={[0, 0, 0.06]}>
        <boxGeometry args={[0.22, 0.9, 0.22]} />
        <meshStandardMaterial color="#90abd1" emissive="#29476b" emissiveIntensity={0.18} metalness={0.5} roughness={0.16} />
      </mesh>
      <mesh position={[0.28, 0.18, 0]} rotation={[0, 0, -0.06]}>
        <boxGeometry args={[0.22, 0.9, 0.22]} />
        <meshStandardMaterial color="#90abd1" emissive="#29476b" emissiveIntensity={0.18} metalness={0.5} roughness={0.16} />
      </mesh>
      <mesh position={[0, 1.02, 0.31]}>
        <boxGeometry args={[0.6, 0.1, 0.08]} />
        <meshStandardMaterial color="#d7e8ff" emissive="#00ffff" emissiveIntensity={0.48} metalness={0.16} roughness={0.16} />
      </mesh>
      <NeonPlaqueLabel
        text="ABOUT"
        position={[0, 0.98, 0.34]}
        color="#ff7bd3"
        plaqueSize={[0.8, 0.28, 0.08]}
        textSize={0.12}
      />
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
        <ProjectsTerminal sunsetMode={sunsetMode} />
      </Hotspot>

      <Hotspot
        color="#ff00aa"
        glowColor="#ff7bd3"
        onSelect={onOpenBio}
        position={[2.55, 2.2, -0.3]}
      >
        <AboutRobot />
      </Hotspot>

      <Hotspot
        color={sunsetMode ? '#ffb347' : '#ffff00'}
        glowColor="#fff5a8"
        onSelect={onToggleMiami}
        position={[2.25, 0.88, 1.35]}
      >
        <group>
          <AssetModel assetUrl={cocktailAssetUrl} scale={0.88} />
          <mesh position={[0, -0.08, 0]}>
            <cylinderGeometry args={[0.42, 0.48, 0.08, 28]} />
            <meshStandardMaterial color="#111723" emissive="#13303d" emissiveIntensity={0.18} metalness={0.72} roughness={0.18} />
          </mesh>
          <CircularEmbossedWord
            text="MIAMI"
            radius={0.56}
            y={0.58}
            color={sunsetMode ? '#ffd089' : '#ffff8f'}
            size={0.12}
            bandRadius={0.09}
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
          <mesh position={[0, -0.62, 0]}>
            <cylinderGeometry args={[0.1, 0.14, 0.9, 16]} />
            <meshStandardMaterial color="#141622" emissive="#2f215a" emissiveIntensity={0.22} metalness={0.66} roughness={0.22} />
          </mesh>
          <mesh position={[0, -1.08, 0]}>
            <boxGeometry args={[1.44, 0.2, 1.44]} />
            <meshStandardMaterial color="#131621" emissive="#34245d" emissiveIntensity={0.2} metalness={0.7} roughness={0.18} />
          </mesh>
          <Center position={[0, -1.08, 0.76]}>
            <Text3D
              font={textFont}
              size={0.16}
              height={0.05}
              bevelEnabled
              bevelSize={0.006}
              bevelThickness={0.006}
              curveSegments={8}
            >
              CONTACT
              <meshBasicMaterial color="#f8f3ff" toneMapped={false} />
            </Text3D>
          </Center>
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

useGLTF.preload(cocktailAssetUrl);
useGLTF.preload(contactOrbAssetUrl);
