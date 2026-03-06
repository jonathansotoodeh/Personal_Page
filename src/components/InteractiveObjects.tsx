import { Html, useCursor } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { type ReactNode, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

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

function Hotspot({ color, glowColor, hint, onSelect, position, children }: HotspotProps) {
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
      <mesh>
        <sphereGeometry args={[0.54, 20, 20]} />
        <meshBasicMaterial
          color={hovered ? glowColor ?? color : color}
          transparent
          opacity={hovered ? 0.22 : 0.1}
        />
      </mesh>
      {hovered && (
        <Html center distanceFactor={7}>
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
        <group castShadow>
          <mesh position={[0, 0.06, 0]} rotation={[-0.18, 0.32, 0]}>
            <boxGeometry args={[1.28, 0.08, 0.9]} />
            <meshStandardMaterial color="#1a2130" metalness={0.78} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.44, -0.32]} rotation={[-1.12, 0.32, 0]}>
            <boxGeometry args={[1.24, 0.05, 0.78]} />
            <meshStandardMaterial
              color="#0f1724"
              emissive="#00ffff"
              emissiveIntensity={1.4}
              metalness={0.25}
              roughness={0.15}
            />
          </mesh>
          <mesh position={[0, 0.44, -0.28]} rotation={[-1.12, 0.32, 0]}>
            <planeGeometry args={[1.02, 0.58]} />
            <meshBasicMaterial color={sunsetMode ? '#ffb347' : '#80ffff'} />
          </mesh>
        </group>
      </Hotspot>

      <Hotspot
        color="#ff00aa"
        glowColor="#ff7bd3"
        hint="Read bio"
        onSelect={onOpenBio}
        position={[2.55, 2.2, -0.3]}
      >
        <group>
          <mesh>
            <boxGeometry args={[2.1, 0.28, 0.18]} />
            <meshStandardMaterial
              color="#1b0f1b"
              emissive="#ff00aa"
              emissiveIntensity={1.8}
              metalness={0.55}
              roughness={0.24}
            />
          </mesh>
          <Html center distanceFactor={7.6} transform>
            <div className="font-display text-lg uppercase tracking-[0.45em] text-neonPink drop-shadow-[0_0_10px_rgba(255,0,170,0.9)]">
              About
            </div>
          </Html>
        </group>
      </Hotspot>

      <Hotspot
        color={sunsetMode ? '#ffb347' : '#ffff00'}
        glowColor="#fff5a8"
        hint="Toggle Miami mode"
        onSelect={onToggleMiami}
        position={[2.25, 0.88, 1.35]}
      >
        <group castShadow>
          <mesh position={[0, 0.33, 0]}>
            <cylinderGeometry args={[0.1, 0.22, 0.72, 18, 1, true]} />
            <meshPhysicalMaterial
              color="#a9faff"
              transmission={0.95}
              transparent
              opacity={0.34}
              roughness={0.02}
            />
          </mesh>
          <mesh position={[0, 0.68, 0]}>
            <coneGeometry args={[0.32, 0.44, 12]} />
            <meshStandardMaterial
              color={sunsetMode ? '#ffb347' : '#ffff00'}
              emissive={sunsetMode ? '#ffb347' : '#ffff00'}
              emissiveIntensity={1.1}
            />
          </mesh>
          <mesh position={[0, 1.02, 0]}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshBasicMaterial color={sunsetMode ? '#ff6f61' : '#00ffff'} />
          </mesh>
        </group>
      </Hotspot>

      <Hotspot
        color="#8b5cf6"
        glowColor="#bca5ff"
        hint="Open contact links"
        onSelect={onOpenContact}
        position={[0.15, 2.55, 1.75]}
      >
        <group>
          <mesh>
            <icosahedronGeometry args={[0.42, 2]} />
            <meshStandardMaterial
              color="#8b5cf6"
              emissive="#8b5cf6"
              emissiveIntensity={1.5}
              roughness={0.1}
              metalness={0.18}
            />
          </mesh>
          <mesh scale={[1.7, 1.7, 1.7]}>
            <icosahedronGeometry args={[0.42, 2]} />
            <meshBasicMaterial color="#00ffff" transparent opacity={0.08} />
          </mesh>
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
          <planeGeometry args={[0.28, 0.09]} />
          <meshBasicMaterial color="#89fff5" transparent opacity={0.65} />
        </mesh>
        <mesh position={[-0.18, 0.08, 0]} rotation={[0, 0, -Math.PI / 6]}>
          <planeGeometry args={[0.28, 0.09]} />
          <meshBasicMaterial color="#89fff5" transparent opacity={0.65} />
        </mesh>
      </group>

      <FloatingDecor sunsetMode={sunsetMode} />
    </group>
  );
}
