import gsap from 'gsap';
import { useEffect, useRef } from 'react';
import { contactItems } from '../../content/siteContent';

interface ContactOverlayProps {
  open: boolean;
  onClose: () => void;
}

export default function ContactOverlay({ open, onClose }: ContactOverlayProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || !panelRef.current) {
      return;
    }

    gsap.fromTo(
      panelRef.current,
      { autoAlpha: 0, y: 48 },
      { autoAlpha: 1, y: 0, duration: 0.55, ease: 'power3.out' },
    );
  }, [open]);

  if (!open) {
    return null;
  }

  return (
    <aside className="fixed inset-x-0 bottom-0 z-40 p-4 md:p-8">
      <div ref={panelRef} className="panel-shell mx-auto w-full max-w-4xl p-6 md:p-8">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="hud-label text-neonYellow">Contact</p>
            <h2 className="mt-3 font-display text-3xl md:text-4xl">
              Broadcast across the grid
            </h2>
          </div>
          <button className="hud-chip" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {contactItems.map((link) =>
            link.href ? (
            <a
              key={link.label}
              className="rounded-3xl border border-white/10 bg-white/5 p-5 transition hover:border-neonPink/50 hover:bg-white/10"
              href={link.href}
              rel="noreferrer"
              target="_blank"
            >
              <span className={`font-display text-xl ${link.tone}`}>{link.label}</span>
            </a>
            ) : (
            <div
              key={link.label}
              className="rounded-3xl border border-white/10 bg-white/5 p-5"
            >
              <span className={`font-display text-xl ${link.tone}`}>{link.label}</span>
            </div>
            ),
          )}
        </div>
      </div>
    </aside>
  );
}
