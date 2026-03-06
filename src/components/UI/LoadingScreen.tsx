import gsap from 'gsap';
import { useEffect, useRef, useState } from 'react';

interface LoadingScreenProps {
  ready: boolean;
}

export default function LoadingScreen({ ready }: LoadingScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(8);

  useEffect(() => {
    if (!visible) {
      return undefined;
    }

    if (!ready) {
      const intervalId = window.setInterval(() => {
        setProgress((value) => Math.min(value + Math.random() * 8, 82));
      }, 150);

      return () => window.clearInterval(intervalId);
    }

    const state = { value: progress };
    gsap.to(state, {
      value: 100,
      duration: 0.6,
      ease: 'power2.out',
      onUpdate: () => setProgress(state.value),
    });

    if (containerRef.current) {
      gsap.to(containerRef.current, {
        autoAlpha: 0,
        duration: 0.8,
        delay: 0.95,
        ease: 'power2.out',
        onComplete: () => setVisible(false),
      });
    }

    return undefined;
  }, [progress, ready, visible]);

  if (!visible) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(255,0,170,0.24),_transparent_34%),linear-gradient(180deg,_rgba(8,4,15,1)_0%,_rgba(11,8,25,1)_100%)] px-6"
    >
      <div className="w-full max-w-xl text-center">
        <p className="hud-label text-neonPink">Initializing Cyber Headquarters</p>
        <h2 className="mt-4 font-display text-4xl text-neonCyan md:text-6xl">
          Booting neon skyline
        </h2>
        <div className="mt-8 overflow-hidden rounded-full border border-white/15 bg-white/5">
          <div
            className="h-3 rounded-full bg-[linear-gradient(90deg,_#ff00aa,_#00ffff,_#ffff00)] shadow-neon transition-[width] duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-4 font-body text-sm uppercase tracking-[0.35em] text-white/65">
          {Math.round(progress)}% loaded
        </p>
      </div>
    </div>
  );
}
