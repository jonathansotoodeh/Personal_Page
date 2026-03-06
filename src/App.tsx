import {
  Component,
  type ErrorInfo,
  type ReactNode,
  Suspense,
  lazy,
  useEffect,
  useState,
} from 'react';
import BioOverlay from './components/Overlays/BioOverlay';
import ContactOverlay from './components/Overlays/ContactOverlay';
import MiamiToggle from './components/Overlays/MiamiToggle';
import ProjectsOverlay from './components/Overlays/ProjectsOverlay';
import HUD from './components/UI/HUD';
import LoadingScreen from './components/UI/LoadingScreen';
import { socialLinks } from './content/siteContent';

const Scene = lazy(() => import('./components/Scene'));

type OverlayKey = 'bio' | 'projects' | 'contact' | null;

interface SceneBoundaryProps {
  children: ReactNode;
}

interface SceneBoundaryState {
  hasError: boolean;
}

class SceneBoundary extends Component<SceneBoundaryProps, SceneBoundaryState> {
  public state: SceneBoundaryState = { hasError: false };

  public static getDerivedStateFromError(): SceneBoundaryState {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Scene render failed', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-night px-6 text-center text-white">
          <div className="panel-shell max-w-xl p-8">
            <p className="text-sm uppercase tracking-[0.4em] text-neonPink">
              System Alert
            </p>
            <h1 className="mt-3 font-display text-4xl text-neonCyan">
              The haven failed to boot.
            </h1>
            <p className="mt-4 text-lg text-white/70">
              WebGL is unavailable or the scene crashed. Refresh once, then
              switch to a modern browser if needed.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  const [activeOverlay, setActiveOverlay] = useState<OverlayKey>(null);
  const [sunsetMode, setSunsetMode] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);
  const [showMiamiToast, setShowMiamiToast] = useState(false);
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }

    return (
      window.matchMedia('(max-width: 900px)').matches ||
      window.matchMedia('(pointer: coarse)').matches
    );
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 900px), (pointer: coarse)');
    const handleChange = () => setIsMobile(mediaQuery.matches);
    handleChange();
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (!showMiamiToast) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => setShowMiamiToast(false), 2200);
    return () => window.clearTimeout(timeoutId);
  }, [showMiamiToast]);

  const openOverlay = (overlay: Exclude<OverlayKey, null>) => {
    setActiveOverlay(overlay);
  };

  const toggleSunsetMode = () => {
    setSunsetMode((current) => !current);
    setShowMiamiToast(true);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-night text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,0,170,0.18),_transparent_36%),radial-gradient(circle_at_bottom_right,_rgba(0,255,255,0.12),_transparent_28%)]" />

      <LoadingScreen ready={sceneReady} />

      <SceneBoundary>
        <Suspense fallback={null}>
          <Scene
            autoRotateIdle={activeOverlay === null}
            isMobile={isMobile}
            sunsetMode={sunsetMode}
            onOpenBio={() => openOverlay('bio')}
            onOpenProjects={() => openOverlay('projects')}
            onOpenContact={() => openOverlay('contact')}
            onToggleMiami={toggleSunsetMode}
            onReady={() => setSceneReady(true)}
          />
        </Suspense>
      </SceneBoundary>

      <HUD
        isMobile={isMobile}
        sunsetMode={sunsetMode}
        socialLinks={socialLinks}
        onOpenBio={() => openOverlay('bio')}
        onOpenProjects={() => openOverlay('projects')}
        onOpenContact={() => openOverlay('contact')}
        onToggleMiami={toggleSunsetMode}
      />

      {activeOverlay !== null && (
        <button
          aria-label="Close overlay"
          className="fixed inset-0 z-30 bg-black/55 backdrop-blur-sm"
          onClick={() => setActiveOverlay(null)}
        />
      )}

      <BioOverlay
        open={activeOverlay === 'bio'}
        onClose={() => setActiveOverlay(null)}
      />
      <ProjectsOverlay
        open={activeOverlay === 'projects'}
        onClose={() => setActiveOverlay(null)}
      />
      <ContactOverlay
        open={activeOverlay === 'contact'}
        onClose={() => setActiveOverlay(null)}
      />
      <MiamiToggle open={showMiamiToast} sunsetMode={sunsetMode} />
    </div>
  );
}

export default App;
