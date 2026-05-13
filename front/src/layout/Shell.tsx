import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import BottomNav from './BottomNav';

interface ShellProps {
  title: string;
  children: React.ReactNode;
}

const Shell = ({ title, children }: ShellProps) => {
  const location = useLocation();
  const route = location.pathname;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  useEffect(() => { setDrawerOpen(false); }, [route]);

  const handleInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') setInstallPrompt(null);
  };

  return (
    <div className="min-h-screen flex">
      <Sidebar activeRoute={route} />

      {drawerOpen && (
        <div className="fixed inset-0 z-40 mobile-only">
          <div className="absolute inset-0 bg-black/60" onClick={() => setDrawerOpen(false)} />
          <div className="absolute top-0 bottom-0 left-0">
            <Sidebar activeRoute={route} mobile onClose={() => setDrawerOpen(false)} onNav={() => setDrawerOpen(false)} />
          </div>
        </div>
      )}

      <main className="flex-1 min-w-0 flex flex-col" style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 0px)' }}>
        <Topbar
          title={title}
          onMenu={() => setDrawerOpen(true)}
          installable={!!installPrompt}
          onShowInstall={handleInstall}
        />
        <div className="flex-1 pb-20 md:pb-0">
          {children}
        </div>
      </main>

      <BottomNav activeRoute={route} />
    </div>
  );
};

// Extend Window for beforeinstallprompt
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default Shell;
