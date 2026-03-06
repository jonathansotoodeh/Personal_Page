import gsap from 'gsap';
import { useEffect, useRef } from 'react';
import { profile, projects } from '../../content/siteContent';

interface ProjectsOverlayProps {
  open: boolean;
  onClose: () => void;
}

export default function ProjectsOverlay({ open, onClose }: ProjectsOverlayProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || !panelRef.current) {
      return;
    }

    gsap.fromTo(
      panelRef.current,
      { autoAlpha: 0, x: 50 },
      { autoAlpha: 1, x: 0, duration: 0.55, ease: 'power3.out' },
    );
  }, [open]);

  if (!open) {
    return null;
  }

  return (
    <aside className="fixed inset-y-0 right-0 z-40 flex w-full max-w-2xl items-center justify-end p-4 md:p-8">
      <div ref={panelRef} className="panel-shell w-full p-6 md:p-8">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="hud-label text-neonPink">Projects</p>
            <h2 className="mt-3 font-display text-3xl md:text-4xl">
              Build log from headquarters
            </h2>
            <p className="mt-3 text-sm uppercase tracking-[0.3em] text-white/55">
              {profile.githubRepos} public repository currently visible on GitHub
            </p>
          </div>
          <button className="hud-chip" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="mt-8 grid gap-4">
          {projects.map((project) => (
            <a
              key={project.title}
              className="rounded-3xl border border-white/10 bg-white/5 p-5 transition hover:-translate-y-1 hover:border-neonCyan/50 hover:bg-white/10"
              href={project.href}
              rel="noreferrer"
              target="_blank"
            >
              <div className="flex items-center justify-between gap-4">
                <h3 className="font-display text-xl text-white">{project.title}</h3>
                <span className="hud-label text-neonCyan">{project.linkLabel}</span>
              </div>
              <p className="mt-3 text-base leading-relaxed text-white/75">
                {project.description}
              </p>
              <p className="mt-4 text-sm uppercase tracking-[0.3em] text-neonYellow/80">
                {project.stack}
              </p>
            </a>
          ))}
        </div>
      </div>
    </aside>
  );
}
