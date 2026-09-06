import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Download, Shield, Upload } from 'lucide-react';
import ContentManager from '../components/admin/ContentManager';
import { useToast, ToastContainer } from '../components/ui/use-toast';
import AdminSidebar from '../components/admin/AdminSidebar';
import DashboardOverview from '../components/admin/DashboardOverview';
import AdminAccount from '../components/admin/AdminAccount';
import { DashboardTab, IEvent, INewsItem } from '../types';
import { Logger } from '../lib/logger';
import { cn } from '../lib/utils';
import { brandLogo } from '../branding';
import { api } from '../lib/api';
import { clearAdminSession } from '../lib/session';

const TAB_TITLE: Record<DashboardTab, string> = {
  overview: 'Dashboard',
  events: 'Events',
  announcements: 'Announcements',
  settings: 'Password',
};

const TAB_EYEBROW: Record<DashboardTab, string> = {
  overview: 'Overview',
  events: 'Content · Calendar',
  announcements: 'Content · Comms',
  settings: 'Account · Security',
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const restoreRef = useRef<HTMLInputElement>(null);
  const { toasts, addToast } = useToast();

  useEffect(() => {
    const ttfp = typeof performance !== 'undefined' ? performance.now() : null;
    Logger.info('AdminDashboard mounted', { ttfp });
  }, []);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      clearAdminSession();
      navigate('/login');
    }
  };

  const handleBackup = async () => {
    try {
      const res = await api.exportBackup();
      if (res.status !== 200 || !res.data) {
        addToast(res.error?.message || 'No data to backup', 'error');
        return;
      }
      const blob = new Blob([JSON.stringify(res.data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `kmci_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      addToast('Backup downloaded', 'success');
    } catch (error) {
      Logger.error('Backup failed', { error });
      addToast('Backup failed', 'error');
    }
  };

  const handleRestore = async (file: File) => {
    try {
      const parsed = JSON.parse(await file.text()) as {
        events?: IEvent[];
        announcements?: INewsItem[];
        data?: { events?: IEvent[]; announcements?: INewsItem[] };
      };
      const events = parsed.events || parsed.data?.events;
      const announcements = parsed.announcements || parsed.data?.announcements;
      if (!Array.isArray(events) || !Array.isArray(announcements)) {
        addToast('Backup file must include events and announcements', 'error');
        return;
      }
      const res = await api.restoreBackup({ events, announcements });
      if (res.status === 200) {
        addToast('Backup restored', 'success');
        window.location.reload();
      } else {
        addToast(res.error?.message || 'Restore failed', 'error');
      }
    } catch {
      addToast('Invalid backup file', 'error');
    }
  };

  return (
    <div
      className={cn('min-h-screen flex font-sans overflow-hidden bg-background text-foreground')}
      data-theme="midnight"
    >
      <div className="pointer-events-none absolute inset-0 z-0 bg-mesh-aurora opacity-70" aria-hidden />
      <div className="pointer-events-none absolute inset-0 z-0 grain-overlay" aria-hidden />
      <div
        className="pointer-events-none absolute -top-40 -right-40 z-0 h-[520px] w-[520px] rounded-full blur-3xl"
        style={{ background: 'hsl(var(--accent) / 0.18)' }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-40 -left-40 z-0 h-[520px] w-[520px] rounded-full blur-3xl"
        style={{ background: 'hsl(var(--primary) / 0.15)' }}
        aria-hidden
      />

      <ToastContainer toasts={toasts} />

      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden
        />
      )}

      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        onLogout={handleLogout}
      />

      <main className="relative z-10 flex h-screen flex-1 flex-col overflow-hidden">
        <header className="surface-glass sticky top-0 z-20 flex h-16 flex-shrink-0 items-center justify-between px-sm sm:px-md lg:px-lg border-b border-border/60">
          <div className="flex items-center gap-sm min-w-0">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className={cn(
                'inline-flex h-9 w-9 items-center justify-center rounded-md',
                'text-ink-muted hover:text-primary hover:bg-surface-elevated',
                'press-lift md:hidden',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-transparent'
              )}
              aria-label="Open navigation"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="hidden sm:flex items-center gap-xs">
              <div className="bg-surface/60 backdrop-blur-sm p-1.5 rounded-md border border-border/60 shadow-1">
                <img src={brandLogo} alt="" className="h-6 w-6 rounded object-contain" />
              </div>
              <span className="text-sm font-semibold tracking-wide text-primary/80">Admin Console</span>
            </div>
            <div className="min-w-0 ml-auto sm:ml-0 sm:flex-1 sm:flex sm:items-end sm:gap-2 sm:ml-md sm:flex-col sm:items-start">
              <span className="eyebrow text-[10px] uppercase tracking-[0.18em] text-accent/90 font-semibold">
                {TAB_EYEBROW[activeTab]}
              </span>
              <h2 className="headline font-bold text-primary truncate">{TAB_TITLE[activeTab]}</h2>
            </div>
          </div>

          <div className="flex items-center gap-xs sm:gap-sm">
            <input
              ref={restoreRef}
              type="file"
              accept="application/json"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void handleRestore(file);
                e.target.value = '';
              }}
            />
            <button
              onClick={() => restoreRef.current?.click()}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-pill px-3 py-1.5 text-xs sm:text-sm font-medium',
                'bg-surface/60 text-ink-muted border border-border/60 backdrop-blur-sm',
                'press-lift hover:text-primary hover:border-accent/40',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent'
              )}
              title="Restore backup"
            >
              <Upload className="h-4 w-4" />
              <span className="hidden sm:inline font-semibold">Restore</span>
            </button>
            <button
              onClick={() => void handleBackup()}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-pill px-3 py-1.5 text-xs sm:text-sm font-medium',
                'bg-accent/15 text-accent border border-accent/30 backdrop-blur-sm',
                'press-lift hover:bg-accent/25 shadow-1',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent'
              )}
              title="Backup Data"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline font-semibold">Backup</span>
            </button>
            <div
              className={cn(
                'inline-flex items-center gap-2 rounded-pill border px-3 py-1.5 text-xs sm:text-sm',
                'bg-success/12 text-success-foreground border-success/25'
              )}
              title="System Online"
            >
              <span className="relative inline-flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
              </span>
              <span className="hidden xs:inline font-semibold sm:inline">Online</span>
            </div>
            <button
              onClick={handleLogout}
              className={cn(
                'hidden sm:inline-flex items-center gap-1.5 rounded-pill px-3 py-1.5 text-xs font-medium',
                'bg-surface/60 text-ink-muted border border-border/60 backdrop-blur-sm',
                'press-lift hover:text-primary hover:border-accent/40 hover:bg-surface-elevated',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60'
              )}
              title="Logout"
              aria-label="Logout"
            >
              <Shield className="h-4 w-4" />
              <span className="font-semibold">Logout</span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-sm sm:px-md lg:px-lg py-section">
          {activeTab === 'overview' && <DashboardOverview />}
          {activeTab === 'events' && <ContentManager category="event" title="Events" onNotify={addToast} />}
          {activeTab === 'announcements' && (
            <ContentManager category="announcement" title="Announcements" onNotify={addToast} />
          )}
          {activeTab === 'settings' && <AdminAccount onNotify={addToast} />}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
