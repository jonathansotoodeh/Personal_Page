import { Line, MeshReflectorMaterial } from '@react-three/drei';
import { useMemo } from 'react';

interface RoomProps {
  isMobile: boolean;
  sunsetMode: boolean;
}

export default function Room({ isMobile, sunsetMode }: RoomProps) {
  const horizontalLines = useMemo(() => [1.2, 2.3, 3.4, 4.5, 5.6], []);
  const verticalLines = useMemo(() => [-5.1, -2.7, -0.3, 2.1, 4.5], []);

  return (
    <group position={[0, -1.4, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[16, 16]} />
        <MeshReflectorMaterial
          blur={[420, 90]}
          resolution={1024}
          mixBlur={0.9}
          mixStrength={55}
          roughness={0.18}
          metalness={0.85}
          color={sunsetMode ? '#261326' : '#0c1020'}
          mirror={0.7}
          depthScale={0.8}
          minDepthThreshold={0.8}
          maxDepthThreshold={1.2}
        />
      </mesh>

      <mesh position={[0, 3.2, -5.8]} receiveShadow>
        <boxGeometry args={[16, 8, 0.2]} />
        <meshStandardMaterial
          color={sunsetMode ? '#22111f' : '#0d1122'}
          emissive={sunsetMode ? '#34151a' : '#101f44'}
          emissiveIntensity={0.55}
          metalness={0.2}
          roughness={0.88}
        />
      </mesh>

      <mesh position={[-7.8, 3.2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[11.6, 8, 0.2]} />
        <meshStandardMaterial
          color="#111321"
          emissive={sunsetMode ? '#33181e' : '#15173d'}
          emissiveIntensity={0.6}
          roughness={0.86}
        />
      </mesh>

      <mesh position={[7.8, 3.2, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[11.6, 8, 0.2]} />
        <meshStandardMaterial
          color="#111321"
          emissive={sunsetMode ? '#341f16' : '#15173d'}
          emissiveIntensity={0.58}
          roughness={0.86}
        />
      </mesh>

      <mesh position={[0, 6.8, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[16, 12]} />
        <meshStandardMaterial color="#11111b" roughness={0.88} metalness={0.16} />
      </mesh>

      <mesh position={[0, 3.4, -5.65]}>
        <planeGeometry args={[10.4, 6.1]} />
        <meshPhysicalMaterial
          color="#d6f8ff"
          transparent
          opacity={0.08}
          transmission={0.95}
          roughness={0.04}
          metalness={0}
        />
      </mesh>

      <group position={[0, 3.2, -5.5]}>
        <mesh position={[0, 3.12, 0]}>
          <boxGeometry args={[10.8, 0.12, 0.24]} />
          <meshStandardMaterial color="#10131f" emissive="#00ffff" emissiveIntensity={1.1} />
        </mesh>
        <mesh position={[0, -3.12, 0]}>
          <boxGeometry args={[10.8, 0.12, 0.24]} />
          <meshStandardMaterial color="#10131f" emissive="#ff00aa" emissiveIntensity={0.95} />
        </mesh>
        <mesh position={[-5.28, 0, 0]}>
          <boxGeometry args={[0.12, 6.3, 0.24]} />
          <meshStandardMaterial color="#10131f" emissive="#00ffff" emissiveIntensity={1.05} />
        </mesh>
        <mesh position={[5.28, 0, 0]}>
          <boxGeometry args={[0.12, 6.3, 0.24]} />
          <meshStandardMaterial color="#10131f" emissive="#ff00aa" emissiveIntensity={1.05} />
        </mesh>
      </group>

      {horizontalLines.map((offset) => (
        <Line
          key={`h-${offset}`}
          points={[
            [-7.6, offset, -5.68],
            [-5.3, offset, -5.68],
            [5.3, offset, -5.68],
            [7.6, offset, -5.68],
          ]}
          color={sunsetMode ? '#ffb347' : '#00ffff'}
          lineWidth={0.75}
          transparent
          opacity={0.32}
        />
      ))}

      {verticalLines.map((offset) => (
        <Line
          key={`v-${offset}`}
          points={[
            [offset, 0.15, -5.68],
            [offset, 6.22, -5.68],
          ]}
          color={offset % 2 === 0 ? '#ff00aa' : '#8b5cf6'}
          lineWidth={0.85}
          transparent
          opacity={0.35}
        />
      ))}

      <group position={[-4.8, 0.75, 1.8]}>
        <mesh castShadow position={[0, 0.35, 0]}>
          <boxGeometry args={[3.6, 0.18, 1.8]} />
          <meshStandardMaterial color="#121621" metalness={0.6} roughness={0.32} />
        </mesh>
        <mesh castShadow position={[0, 0.18, 0]}>
          <boxGeometry args={[2.9, 0.18, 1.1]} />
          <meshStandardMaterial color="#ff00aa" emissive="#ff00aa" emissiveIntensity={0.5} />
        </mesh>
        <mesh castShadow position={[-1.4, 0.95, -0.4]}>
          <boxGeometry args={[0.18, 1.1, 0.18]} />
          <meshStandardMaterial color="#111621" />
        </mesh>
        <mesh castShadow position={[1.4, 0.95, -0.4]}>
          <boxGeometry args={[0.18, 1.1, 0.18]} />
          <meshStandardMaterial color="#111621" />
        </mesh>
      </group>

      <group position={[4.85, 2.8, -2.7]} rotation={[0, -Math.PI / 2, 0]}>
        <Line
          points={[
            [-1.2, -1.2, 0],
            [-0.3, 0.8, 0],
            [0.3, 1.3, 0],
            [1.2, -0.3, 0],
          ]}
          color={sunsetMode ? '#ffd166' : '#00ffff'}
          lineWidth={1.1}
        />
        <Line
          points={[
            [-0.35, -1.5, 0],
            [-0.15, 0.3, 0],
            [0.1, 1.45, 0],
          ]}
          color="#ff00aa"
          lineWidth={1.1}
        />
      </group>

      {!isMobile && (
        <mesh position={[0, 0.02, -2.6]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.5, 1.9, 48]} />
          <meshBasicMaterial
            color={sunsetMode ? '#ffb347' : '#00ffff'}
            transparent
            opacity={0.26}
          />
        </mesh>
      )}
    </group>
  );
}
