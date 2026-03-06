import { Html, Environment, Lightformer, OrbitControls, Sparkles } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing';
import { lazy, Suspense, useEffect, useMemo, useRef } from 'react';
import type { MutableRefObject } from 'react';
import * as THREE from 'three';

const Room = lazy(() => import('./Room'));
const CitySkyline = lazy(() => import('./CitySkyline'));
const InteractiveObjects = lazy(() => import('./InteractiveObjects'));

export interface SceneProps {
  autoRotateIdle: boolean;
  isMobile: boolean;
  sunsetMode: boolean;
  onOpenBio: () => void;
  onOpenProjects: () => void;
  onOpenContact: () => void;
  onToggleMiami: () => void;
  onReady: () => void;
}

interface SceneContentProps extends Omit<SceneProps, 'onReady'> {
  readyFlag: MutableRefObject<boolean>;
  onReady: () => void;
}

function RainField({ isMobile }: { isMobile: boolean }) {
  const count = isMobile ? 280 : 640;
  const points = useRef<THREE.Points>(null);
  const velocity = useRef<Float32Array>(
    new Float32Array(Array.from({ length: count }, () => 0.09 + Math.random() * 0.07)),
  );

  const positions = useMemo(() => {
    const values = new Float32Array(count * 3);
    for (let index = 0; index < count; index += 1) {
      values[index * 3] = (Math.random() - 0.5) * 32;
      values[index * 3 + 1] = Math.random() * 15 - 1;
      values[index * 3 + 2] = -6 - Math.random() * 26;
    }
    return values;
  }, [count]);

  useFrame((_, delta) => {
    if (!points.current) {
      return;
    }

    const attribute = points.current.geometry.attributes.position as THREE.BufferAttribute;
    for (let index = 0; index < count; index += 1) {
      const yIndex = index * 3 + 1;
      attribute.array[yIndex] -= velocity.current[index] * delta * 24;
      if (attribute.array[yIndex] < -3.2) {
        attribute.array[index * 3] = (Math.random() - 0.5) * 32;
        attribute.array[yIndex] = 11 + Math.random() * 4;
        attribute.array[index * 3 + 2] = -6 - Math.random() * 26;
      }
    }

    attribute.needsUpdate = true;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#8be9ff"
        size={0.045}
        sizeAttenuation
        transparent
        opacity={0.45}
        depthWrite={false}
      />
    </points>
  );
}

function SceneContent({
  autoRotateIdle,
  isMobile,
  sunsetMode,
  onOpenBio,
  onOpenProjects,
  onOpenContact,
  onToggleMiami,
  onReady,
  readyFlag,
}: SceneContentProps) {
  const roomGroup = useRef<THREE.Group>(null);
  useEffect(() => {
    if (readyFlag.current) {
      return;
    }

    readyFlag.current = true;
    const rafId = window.requestAnimationFrame(onReady);
    return () => window.cancelAnimationFrame(rafId);
  }, [onReady, readyFlag]);

  useFrame(({ clock, pointer }, delta) => {
    if (!roomGroup.current) {
      return;
    }

    const targetY = isMobile ? 0 : pointer.x * 0.16;
    const targetX = isMobile ? 0.03 : pointer.y * 0.08;
    roomGroup.current.rotation.y = THREE.MathUtils.lerp(
      roomGroup.current.rotation.y,
      targetY,
      delta * 2.3,
    );
    roomGroup.current.rotation.x = THREE.MathUtils.lerp(
      roomGroup.current.rotation.x,
      targetX,
      delta * 2.1,
    );
    roomGroup.current.position.y = THREE.MathUtils.lerp(
      roomGroup.current.position.y,
      Math.sin(clock.elapsedTime * 0.3) * 0.08,
      delta,
    );
  });

  return (
    <>
      <ambientLight intensity={0.72} color={sunsetMode ? '#ffd0b3' : '#ffffff'} />
      <hemisphereLight
        args={[sunsetMode ? '#ffcc99' : '#66e7ff', '#12081d', sunsetMode ? 1.1 : 0.7]}
      />
      <pointLight
        position={[3.8, 4.5, 2.4]}
        intensity={sunsetMode ? 24 : 18}
        distance={18}
        color="#ff00aa"
      />
      <pointLight
        position={[-3.6, 3.1, -2.5]}
        intensity={sunsetMode ? 18 : 24}
        distance={20}
        color={sunsetMode ? '#ffb347' : '#00ffff'}
      />
      <spotLight
        position={[0, 6.4, 4]}
        angle={0.42}
        penumbra={0.7}
        intensity={sunsetMode ? 36 : 28}
        color={sunsetMode ? '#ffcf7d' : '#6ef5ff'}
        castShadow
      />

      <Environment resolution={128}>
        <Lightformer
          color="#ff00aa"
          intensity={4}
          form="ring"
          position={[0, 4.6, 3]}
          scale={[6, 6, 1]}
        />
        <Lightformer
          color={sunsetMode ? '#ffb347' : '#00ffff'}
          intensity={3}
          position={[-4.5, 2.6, 1]}
          scale={[1, 5, 5]}
        />
        <Lightformer
          color="#8b5cf6"
          intensity={2.2}
          position={[5.2, 2, -4]}
          scale={[1.5, 3, 8]}
        />
      </Environment>

      <Sparkles
        count={isMobile ? 24 : 56}
        scale={[14, 8, 10]}
        size={2.4}
        speed={sunsetMode ? 0.22 : 0.32}
        color={sunsetMode ? '#ffd166' : '#00ffff'}
      />

      <group ref={roomGroup}>
        <Suspense
          fallback={
            <Html center>
              <div className="rounded-full border border-neonCyan/40 bg-black/70 px-5 py-2 text-xs font-semibold uppercase tracking-[0.5em] text-neonCyan">
                Synthesizing scene...
              </div>
            </Html>
          }
        >
          <CitySkyline sunsetMode={sunsetMode} />
          <Room isMobile={isMobile} sunsetMode={sunsetMode} />
          <InteractiveObjects
            sunsetMode={sunsetMode}
            onOpenBio={onOpenBio}
            onOpenProjects={onOpenProjects}
            onOpenContact={onOpenContact}
            onToggleMiami={onToggleMiami}
          />
        </Suspense>
      </group>

      <RainField isMobile={isMobile} />

      <OrbitControls
        enableDamping
        dampingFactor={0.06}
        enablePan={false}
        enableZoom={!isMobile}
        minDistance={isMobile ? 8.5 : 7.2}
        maxDistance={isMobile ? 11.5 : 12.5}
        minPolarAngle={0.9}
        maxPolarAngle={1.55}
        autoRotate={!isMobile && autoRotateIdle}
        autoRotateSpeed={0.3}
      />

      <EffectComposer enableNormalPass={false} multisampling={isMobile ? 0 : 8}>
        <Bloom
          mipmapBlur
          intensity={sunsetMode ? 0.68 : 0.82}
          luminanceThreshold={0.3}
          radius={0.34}
        />
        <Vignette eskil={false} offset={0.12} darkness={0.58} />
      </EffectComposer>
    </>
  );
}

export default function Scene(props: SceneProps) {
  const readyFlag = useRef(false);

  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 2.95, 9.7], fov: props.isMobile ? 60 : 50 }}
        dpr={[1.2, props.isMobile ? 1.6 : 2.2]}
        gl={{
          antialias: !props.isMobile,
          alpha: false,
          powerPreference: 'high-performance',
        }}
        shadows
      >
        <color attach="background" args={[props.sunsetMode ? '#120914' : '#08040f']} />
        <fog attach="fog" args={[props.sunsetMode ? '#120914' : '#08040f', 9, 34]} />
        <SceneContent {...props} readyFlag={readyFlag} />
      </Canvas>
    </div>
  );
}
