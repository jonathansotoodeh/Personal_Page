import gsap from 'gsap';
import { useEffect, useRef } from 'react';

interface BioOverlayProps {
  open: boolean;
  onClose: () => void;
}

export default function BioOverlay({ open, onClose }: BioOverlayProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || !panelRef.current) {
      return;
    }

    gsap.fromTo(
      panelRef.current,
      { autoAlpha: 0, x: -40 },
      { autoAlpha: 1, x: 0, duration: 0.55, ease: 'power3.out' },
    );
  }, [open]);

  if (!open) {
    return null;
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-full max-w-xl items-center p-4 md:p-8">
      <div ref={panelRef} className="panel-shell w-full p-6 md:p-8">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="hud-label text-neonCyan">Identity</p>
            <h2 className="mt-3 font-display text-3xl md:text-4xl">jay</h2>
          </div>
          <button className="hud-chip" onClick={onClose}>
            Close
          </button>
        </div>

        <p className="mt-6 text-lg leading-relaxed text-white/80">
          jay, Miami-based developer passionate about web, 3D, and creative
          coding. Building immersive experiences.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
            <p className="hud-label text-neonPink">Focus</p>
            <p className="mt-3 text-base text-white/75">
              High-touch interfaces, cinematic product storytelling, creative
              frontends, and performant interaction design.
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
            <p className="hud-label text-neonYellow">Base</p>
            <p className="mt-3 text-base text-white/75">
              Miami nights, ocean glow, neon grids, synth textures, and motion
              systems that feel tactile instead of ornamental.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
