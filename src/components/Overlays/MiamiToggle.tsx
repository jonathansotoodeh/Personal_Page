import gsap from 'gsap';
import { useEffect, useRef } from 'react';

interface MiamiToggleProps {
  open: boolean;
  sunsetMode: boolean;
}

export default function MiamiToggle({ open, sunsetMode }: MiamiToggleProps) {
  const toastRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || !toastRef.current) {
      return;
    }

    gsap.fromTo(
      toastRef.current,
      { autoAlpha: 0, y: -18, scale: 0.96 },
      { autoAlpha: 1, y: 0, scale: 1, duration: 0.35, ease: 'power2.out' },
    );
  }, [open]);

  if (!open) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 top-6 z-50 flex justify-center px-4">
      <div
        ref={toastRef}
        className="rounded-full border border-white/15 bg-black/70 px-5 py-3 text-center shadow-neon backdrop-blur-xl"
      >
        <p className="hud-label text-neonYellow">Miami Toggle</p>
        <p className="mt-1 font-display text-sm text-white">
          {sunsetMode ? 'Sunset heat engaged' : 'Neon night restored'}
        </p>
      </div>
    </div>
  );
}
