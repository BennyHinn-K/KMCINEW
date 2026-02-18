import React from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  Megaphone, 
  LogOut, 
  Radio,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { DashboardTab } from '@/types';
import { brandLogo } from '@/branding';

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
}

const NavItem: React.FC<NavItemProps> = ({ 
  tab, 
  activeTab, 
  setActiveTab, 
  setIsOpen, 
  icon: Icon, 
  label 
}) => (
  <button
    onClick={() => {
      setActiveTab(tab);
      setIsOpen(false);
    }}
    className={cn(
      "w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors mb-1",
      activeTab === tab 
        ? "bg-amber-500 text-white shadow-md" 
        : "text-gray-400 hover:bg-slate-800 hover:text-white"
    )}
  >
    <Icon className="w-5 h-5" />
    <span className="font-medium">{label}</span>
  </button>
);

const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpen,
  setIsOpen,
  onLogout
}) => {
  return (
    <aside className={cn(
      "fixed md:static inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-200 ease-in-out md:translate-x-0 flex flex-col h-full shadow-xl",
      isOpen ? "translate-x-0" : "-translate-x-full"
    )}>
      <div className="p-6 border-b border-slate-800 flex justify-between items-center flex-shrink-0">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/10 border border-white/10 overflow-hidden">
            <img
              src={brandLogo}
              alt="KMCI logo"
              className="w-8 h-8 object-contain"
            />
          </div>
          <span className="text-xl font-bold tracking-tight">KMCI Admin</span>
        </div>
        <button onClick={() => setIsOpen(false)} className="md:hidden text-gray-400">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="p-4 flex-1 overflow-y-auto">
        <div className="mb-8">
          <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Main Menu</p>
          <NavItem tab="overview" activeTab={activeTab} setActiveTab={setActiveTab} setIsOpen={setIsOpen} icon={LayoutDashboard} label="Dashboard" />
          <NavItem tab="live" activeTab={activeTab} setActiveTab={setActiveTab} setIsOpen={setIsOpen} icon={Radio} label="Live Studio" />
        </div>

        <div className="mb-8">
          <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Content Management</p>
          <NavItem tab="events" activeTab={activeTab} setActiveTab={setActiveTab} setIsOpen={setIsOpen} icon={Calendar} label="Events" />
          <NavItem tab="announcements" activeTab={activeTab} setActiveTab={setActiveTab} setIsOpen={setIsOpen} icon={Megaphone} label="Announcements" />
        </div>
      </div>

      <div className="p-4 border-t border-slate-800 flex-shrink-0">
        <button 
          onClick={onLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
