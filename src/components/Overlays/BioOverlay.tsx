import gsap from 'gsap';
import { useEffect, useRef } from 'react';
import { profile, profileHighlights } from '../../content/siteContent';

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
            <h2 className="mt-3 font-display text-3xl md:text-4xl">{profile.name}</h2>
          </div>
          <button className="hud-chip" onClick={onClose}>
            Close
          </button>
        </div>

        <p className="mt-6 text-lg leading-relaxed text-white/80">
          {profile.bio}
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4 md:col-span-2">
            <p className="hud-label text-neonPink">Focus</p>
            <p className="mt-3 text-base text-white/75">{profile.focus}</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4 md:col-span-2">
            <p className="hud-label text-neonYellow">Current Scope</p>
            <p className="mt-3 text-base text-white/75">{profile.summary}</p>
          </div>
          {profileHighlights.map((item, index) => (
            <div
              key={item.title}
              className={`rounded-3xl border border-white/10 bg-white/5 p-4 ${
                index >= 2 ? 'md:col-span-2' : ''
              }`}
            >
              <p className={`hud-label ${index % 2 === 0 ? 'text-neonCyan' : 'text-neonPink'}`}>
                {item.title}
              </p>
              <p className="mt-3 text-base text-white/75">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
