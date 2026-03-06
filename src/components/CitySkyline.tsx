import { Line, Sparkles } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

interface CitySkylineProps {
  sunsetMode: boolean;
}

interface BuildingSpec {
  color: string;
  depth: number;
  height: number;
  position: [number, number, number];
  width: number;
}

interface DroneSpec {
  basePosition: [number, number, number];
  color: string;
  speed: number;
  travel: number;
}

function DroneTraffic({ sunsetMode }: CitySkylineProps) {
  const drones = useMemo<DroneSpec[]>(
    () => [
      { basePosition: [-9, 2.4, -11], color: '#00ffff', speed: 0.35, travel: 5.5 },
      { basePosition: [4, 3.2, -14], color: '#ff00aa', speed: 0.28, travel: 6.2 },
      { basePosition: [10, 1.6, -12], color: '#ffff00', speed: 0.44, travel: 4.5 },
    ],
    [],
  );

  const group = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!group.current) {
      return;
    }

    group.current.children.forEach((child, index) => {
      const drone = drones[index];
      child.position.x =
        drone.basePosition[0] +
        Math.sin(clock.elapsedTime * drone.speed + index) * drone.travel;
      child.position.y =
        drone.basePosition[1] +
        Math.cos(clock.elapsedTime * (drone.speed + 0.1) + index) * 0.25;
    });
  });

  return (
    <group ref={group}>
      {drones.map((drone) => (
        <group
          key={`${drone.basePosition.join('-')}`}
          position={drone.basePosition}
        >
          <mesh>
            <sphereGeometry args={[0.08, 14, 14]} />
            <meshBasicMaterial
              color={sunsetMode && drone.color === '#00ffff' ? '#ffb347' : drone.color}
            />
          </mesh>
          <mesh scale={[1.8, 0.22, 0.22]}>
            <sphereGeometry args={[0.08, 12, 12]} />
            <meshBasicMaterial
              color={drone.color}
              transparent
              opacity={0.35}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export default function CitySkyline({ sunsetMode }: CitySkylineProps) {
  const buildings = useMemo<BuildingSpec[]>(() => {
    return Array.from({ length: 72 }, (_, index) => {
      const width = 0.8 + Math.random() * 1.4;
      const depth = 0.8 + Math.random() * 1.2;
      const height = 1.2 + Math.random() * 5.7;
      const x = -24 + index * 0.68 + (Math.random() - 0.5) * 0.9;
      const z = -18 - Math.random() * 7;
      const hueShift = index % 3;

      return {
        width,
        depth,
        height,
        position: [x, height / 2 - 1.2, z],
        color:
          hueShift === 0
            ? '#251039'
            : hueShift === 1
              ? '#1a1f45'
              : '#101d31',
      };
    });
  }, []);

  const instancedRef = useRef<THREE.InstancedMesh>(null);

  useLayoutEffect(() => {
    if (!instancedRef.current) {
      return;
    }

    const dummy = new THREE.Object3D();
    buildings.forEach((building, index) => {
      dummy.position.set(...building.position);
      dummy.scale.set(building.width, building.height, building.depth);
      dummy.updateMatrix();
      instancedRef.current?.setMatrixAt(index, dummy.matrix);
      instancedRef.current?.setColorAt(index, new THREE.Color(building.color));
    });

    instancedRef.current.instanceMatrix.needsUpdate = true;
    if (instancedRef.current.instanceColor) {
      instancedRef.current.instanceColor.needsUpdate = true;
    }
  }, [buildings]);

  return (
    <group position={[0, 0.25, 0]}>
      <mesh position={[0, 5.2, -24]}>
        <boxGeometry args={[46, 20, 0.25]} />
        <meshBasicMaterial
          color={sunsetMode ? '#281131' : '#12081d'}
          transparent
          opacity={0.96}
        />
      </mesh>

      <mesh position={[0, 5.2, -23.5]}>
        <sphereGeometry args={[4.8, 48, 48, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshBasicMaterial
          color={sunsetMode ? '#ff9a62' : '#ff4fd8'}
          transparent
          opacity={0.42}
        />
      </mesh>

      <mesh position={[0, -1.55, -18.8]} rotation={[-Math.PI / 2, 0, 0]}>
        <boxGeometry args={[52, 24, 0.08]} />
        <meshStandardMaterial
          color={sunsetMode ? '#1b0f18' : '#050712'}
          emissive={sunsetMode ? '#120916' : '#09111b'}
          emissiveIntensity={0.3}
          roughness={0.9}
        />
      </mesh>

      <instancedMesh ref={instancedRef} args={[undefined, undefined, buildings.length]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          vertexColors
          metalness={0.32}
          roughness={0.3}
          emissive={sunsetMode ? '#ff6f61' : '#00b0ff'}
          emissiveIntensity={0.12}
        />
      </instancedMesh>

      {[-16, -8, 0, 8, 16].map((x) => (
        <Line
          key={x}
          points={[
            [x, -1.4, -18.3],
            [x, 7.4, -24],
          ]}
          color={sunsetMode ? '#ffb347' : '#00ffff'}
          lineWidth={0.6}
          transparent
          opacity={0.18}
        />
      ))}

      {[-13, -4, 5, 14].map((x, index) => (
        <group key={`palm-${x}`} position={[x, -1.1, -15.4 - index]}>
          <mesh position={[0, 1.3, 0]}>
            <cylinderGeometry args={[0.06, 0.12, 2.7, 8]} />
            <meshStandardMaterial color="#120f14" emissive="#241527" emissiveIntensity={0.18} />
          </mesh>
          <Line
            points={[
              [0, 2.45, 0],
              [-0.85, 2.8, 0],
              [-1.45, 2.35, 0],
            ]}
            color="#101219"
            lineWidth={1}
          />
          <Line
            points={[
              [0, 2.45, 0],
              [0.85, 2.8, 0],
              [1.45, 2.35, 0],
            ]}
            color="#101219"
            lineWidth={1}
          />
          <Line
            points={[
              [0, 2.45, 0],
              [0, 3.1, 0],
              [0.2, 3.5, 0],
            ]}
            color="#101219"
            lineWidth={1}
          />
        </group>
      ))}

      <Sparkles
        count={36}
        scale={[26, 9, 8]}
        position={[0, 1.8, -15]}
        size={2}
        speed={0.1}
        color={sunsetMode ? '#ffd166' : '#ff7be5'}
      />

      <DroneTraffic sunsetMode={sunsetMode} />
    </group>
  );
}
