import { Line, MeshReflectorMaterial } from '@react-three/drei';

interface RoomProps {
  isMobile: boolean;
  sunsetMode: boolean;
}

export default function Room({ isMobile, sunsetMode }: RoomProps) {
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

      <mesh position={[0, 3.4, -5.65]}>
        <boxGeometry args={[10.4, 6.1, 0.08]} />
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

      <group position={[0, 0.95, -4.95]}>
        <mesh position={[-4.15, 0, 0]} castShadow>
          <boxGeometry args={[0.22, 2.4, 0.22]} />
          <meshStandardMaterial color="#111722" emissive="#00ffff" emissiveIntensity={0.35} />
        </mesh>
        <mesh position={[0, 0.38, 0]} castShadow>
          <boxGeometry args={[8.2, 0.2, 0.22]} />
          <meshStandardMaterial color="#121821" emissive="#5d2e70" emissiveIntensity={0.2} />
        </mesh>
        <mesh position={[4.15, 0, 0]} castShadow>
          <boxGeometry args={[0.22, 2.4, 0.22]} />
          <meshStandardMaterial color="#111722" emissive="#ff00aa" emissiveIntensity={0.35} />
        </mesh>
      </group>

      <group position={[3.9, 0.74, 2.2]}>
        <mesh castShadow position={[0, 0.08, 0]}>
          <cylinderGeometry args={[0.34, 0.34, 0.12, 24]} />
          <meshStandardMaterial
            color="#141923"
            emissive={sunsetMode ? '#3a1b14' : '#0d1f29'}
            emissiveIntensity={0.45}
            metalness={0.7}
            roughness={0.22}
          />
        </mesh>
        <mesh castShadow position={[0, 0.92, 0]}>
          <cylinderGeometry args={[0.08, 0.1, 1.55, 16]} />
          <meshStandardMaterial color="#111620" metalness={0.55} roughness={0.28} />
        </mesh>
        <mesh castShadow position={[0, 1.62, 0]}>
          <sphereGeometry args={[0.28, 18, 18]} />
          <meshStandardMaterial
            color={sunsetMode ? '#ffb347' : '#00ffff'}
            emissive={sunsetMode ? '#ffb347' : '#00ffff'}
            emissiveIntensity={1.2}
            roughness={0.1}
          />
        </mesh>
      </group>

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
