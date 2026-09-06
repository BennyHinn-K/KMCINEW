import React from 'react';
import {
  LayoutDashboard,
  Calendar,
  Megaphone,
  LogOut,
  KeyRound,
  X,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { DashboardTab } from '../../types';
import { brandLogo } from '../../branding';

interface AdminSidebarProps {
  activeTab: DashboardTab;
  setActiveTab: (tab: DashboardTab) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onLogout: () => void;
}

interface NavItemProps {
  tab: DashboardTab;
  activeTab: DashboardTab;
  setActiveTab: (t: DashboardTab) => void;
  setIsOpen: (o: boolean) => void;
  icon: React.ElementType;
  label: string;
  hint?: string;
}

const NavItem: React.FC<NavItemProps> = ({
  tab,
  activeTab,
  setActiveTab,
  setIsOpen,
  icon: Icon,
  label,
  hint,
}) => {
  const isActive = activeTab === tab;
  return (
    <button
      type="button"
      onClick={() => {
        setActiveTab(tab);
        setIsOpen(false);
      }}
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        'group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 mb-0.5',
        'text-sm font-medium overflow-hidden',
        'transition-[color,background-color,border-color] duration-normal ease-emphasis',
        'press-lift',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(222_42%_9%)]',
        isActive
          ? 'text-accent bg-accent/15 shadow-1 border-l-[3px] border-accent pl-2.5'
          : 'text-ink-muted hover:bg-surface-elevated hover:text-primary border-l-[3px] border-transparent pl-2.5'
      )}
    >
      <Icon className={cn('h-5 w-5 flex-shrink-0', isActive ? 'text-accent' : 'text-ink-subtle group-hover:text-accent/80 transition-colors duration-normal')} />
      <div className="flex flex-col items-start min-w-0 flex-1">
        <span className="truncate leading-tight">{label}</span>
        {hint && <span className="truncate text-[11px] text-ink-subtle/80 leading-tight mt-0.5">{hint}</span>}
      </div>
      {isActive && (
        <span className="ml-0.5 inline-flex h-2 w-2 rounded-full bg-accent shadow-[0_0_0_3px_hsl(var(--accent)/0.15)]" aria-hidden />
      )}
    </button>
  );
};

const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="mb-2 mt-1 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-subtle/80">
    {children}
  </p>
);

const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpen,
  setIsOpen,
  onLogout,
}) => {
  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-50 w-72 flex h-full flex-col flex-shrink-0',
        'bg-surface/95 backdrop-blur-md border-r border-border/60 shadow-1',
        'transform transition-transform duration-normal ease-emphasis',
        'md:static md:translate-x-0',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}
    >
      <div className="flex flex-shrink-0 items-center justify-between gap-2 border-b border-border/60 p-md">
        <div className="flex items-center gap-xs min-w-0">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-surface-elevated border border-border/60 shadow-1 overflow-hidden">
            <img
              src={brandLogo}
              alt="KMCI logo"
              className="h-7 w-7 rounded object-contain"
            />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="headline font-bold tracking-tight text-primary truncate leading-tight">KMCI Admin</span>
            <span className="text-[11px] font-medium uppercase tracking-widest text-accent/85 leading-tight">CMS</span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          aria-label="Close sidebar"
          className={cn(
            'inline-flex h-9 w-9 items-center justify-center rounded-md md:hidden',
            'text-ink-muted hover:text-primary hover:bg-surface-elevated',
            'press-lift',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(222_42%_9%)]'
          )}
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-xs space-y-md">
        <div>
          <SectionLabel>Main</SectionLabel>
          <div className="space-y-0.5">
            <NavItem
              tab="overview"
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              setIsOpen={setIsOpen}
              icon={LayoutDashboard}
              label="Dashboard"
              hint="Overview & activity"
            />
          </div>
        </div>

        <div>
          <SectionLabel>Content</SectionLabel>
          <div className="space-y-0.5">
            <NavItem
              tab="events"
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              setIsOpen={setIsOpen}
              icon={Calendar}
              label="Events"
              hint="Add or remove gatherings"
            />
            <NavItem
              tab="announcements"
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              setIsOpen={setIsOpen}
              icon={Megaphone}
              label="Announcements"
              hint="Add or remove notices"
            />
          </div>
        </div>

        <div>
          <SectionLabel>Account</SectionLabel>
          <div className="space-y-0.5">
            <NavItem
              tab="settings"
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              setIsOpen={setIsOpen}
              icon={KeyRound}
              label="Password"
              hint="Change admin password"
            />
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 border-t border-border/60 p-xs">
        <button
          type="button"
          onClick={onLogout}
          className={cn(
            'group flex w-full items-center gap-3 rounded-lg px-3 py-2.5',
            'text-sm font-medium',
            'text-destructive/90 hover:bg-destructive/10 hover:text-destructive',
            'transition-colors duration-normal ease-standard',
            'press-lift',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-destructive focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(222_42%_9%)]'
          )}
        >
          <LogOut className="h-5 w-5 flex-shrink-0 text-destructive/80 group-hover:text-destructive" />
          <div className="flex flex-col items-start min-w-0 flex-1">
            <span className="leading-tight font-semibold">Logout</span>
            <span className="text-[11px] text-destructive/70 leading-tight mt-0.5">End admin session</span>
          </div>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
