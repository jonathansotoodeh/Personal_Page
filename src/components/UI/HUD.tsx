import gsap from 'gsap';
import { useEffect, useRef } from 'react';
import { profile } from '../../content/siteContent';

interface SocialLink {
  label: string;
  href: string;
}

interface HUDProps {
  isMobile: boolean;
  sunsetMode: boolean;
  socialLinks: SocialLink[];
  onOpenBio: () => void;
  onOpenProjects: () => void;
  onOpenContact: () => void;
  onToggleMiami: () => void;
}

export default function HUD({
  isMobile,
  sunsetMode,
  socialLinks,
  onOpenBio,
  onOpenProjects,
  onOpenContact,
  onToggleMiami,
}: HUDProps) {
  const headerRef = useRef<HTMLDivElement>(null);
  const socialsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        { autoAlpha: 0, y: -18 },
        { autoAlpha: 1, y: 0, duration: 0.75, ease: 'power3.out', delay: 0.3 },
      );
    }

    if (socialsRef.current) {
      gsap.fromTo(
        socialsRef.current.children,
        { autoAlpha: 0, y: 14 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.55,
          ease: 'power3.out',
          delay: 0.65,
          stagger: 0.08,
        },
      );
    }
  }, []);

  return (
    <>
      <div ref={headerRef} className="pointer-events-none fixed inset-x-0 top-0 z-20 p-4 md:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="pointer-events-auto panel-shell max-w-md p-4 md:p-5">
            <p className="hud-label text-neonCyan">jonathan</p>
            <h1 className="mt-3 max-w-[16rem] font-display uppercase text-white md:max-w-[18rem]">
              <span className="block text-[clamp(1.2rem,2.6vw,1.9rem)] leading-[0.92] tracking-[0.08em]">
                Jonathan&apos;s
              </span>
              <span className="block text-[clamp(1.35rem,2.9vw,2rem)] leading-[0.92] tracking-[0.08em]">
                Neon
              </span>
              <span className="block text-[clamp(1.35rem,2.9vw,2rem)] leading-[0.92] tracking-[0.08em]">
                Cyber
              </span>
              <span className="block text-[clamp(1rem,2.2vw,1.45rem)] leading-[0.94] tracking-[0.06em]">
                Headquarters
              </span>
            </h1>
            <p className="mt-3 max-w-md text-sm text-white/75 md:text-base">
              {profile.name} leads internal AI innovation at Kaseya within
              strategic finance and brings an operator, founder, and MBA lens to
              the work.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <button className="hud-chip" onClick={onOpenBio}>
                About
              </button>
              <button className="hud-chip" onClick={onOpenProjects}>
                Projects
              </button>
              <button className="hud-chip" onClick={onOpenContact}>
                Contact
              </button>
              <button
                className={`hud-chip ${sunsetMode ? 'border-neonYellow/50 text-neonYellow' : ''}`}
                onClick={onToggleMiami}
              >
                Miami Mode
              </button>
            </div>
          </div>

          {!isMobile && (
            <div className="pointer-events-none hidden rounded-full border border-white/10 bg-black/40 px-4 py-2 text-right text-xs uppercase tracking-[0.35em] text-white/50 backdrop-blur-xl lg:block">
              Click objects in the room
              <br />
              Drag to orbit
            </div>
          )}
        </div>
      </div>

      <div
        ref={socialsRef}
        className="pointer-events-auto fixed bottom-4 right-4 z-20 flex flex-wrap justify-end gap-2 md:bottom-6 md:right-6"
      >
        {socialLinks.map((link) => (
          <a
            key={link.label}
            className="hud-chip"
            href={link.href}
            rel="noreferrer"
            target={link.href.startsWith('mailto:') ? undefined : '_blank'}
          >
            {link.label}
          </a>
        ))}
      </div>
    </>
  );
}
