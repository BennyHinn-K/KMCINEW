import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Download } from 'lucide-react';
import LiveStudio from '../components/admin/LiveStudio';
import ContentManager from '../components/admin/ContentManager';
import { useToast, ToastContainer } from '../components/ui/use-toast';
import AdminSidebar from '../components/admin/AdminSidebar';
import DashboardOverview from '../components/admin/DashboardOverview';
import { DashboardTab, ChartDataPoint } from '../types';

// Mock Analytics Data
const CHART_DATA: ChartDataPoint[] = [
  { name: 'Mon', visitors: 400, views: 240 },
  { name: 'Tue', visitors: 300, views: 139 },
  { name: 'Wed', visitors: 200, views: 980 },
  { name: 'Thu', visitors: 278, views: 390 },
  { name: 'Fri', visitors: 189, views: 480 },
  { name: 'Sat', visitors: 239, views: 380 },
  { name: 'Sun', visitors: 349, views: 430 },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { toasts, addToast } = useToast();

  useEffect(() => {
    Logger.info('AdminDashboard mounted');
  }, []);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('kmci_admin_session');
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex font-sans overflow-hidden">
      <ToastContainer toasts={toasts} />
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <AdminSidebar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-gray-50">
        {/* Top Header */}
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6 z-10 flex-shrink-0">
          <div className="flex items-center">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden mr-4 text-gray-600"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold text-gray-800 capitalize">{activeTab}</h2>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBackup}
              className="flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1 rounded-full transition-colors"
              title="Backup Data"
            >
              <Download className="w-4 h-4" />
              <span className="text-sm font-medium hidden sm:inline">Backup</span>
            </button>
            <div className="flex items-center space-x-2 bg-green-50 px-3 py-1 rounded-full border border-green-100">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-700">System Online</span>
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          
          {activeTab === 'overview' && (
            <DashboardOverview chartData={CHART_DATA} />
          )}

          {activeTab === 'live' && (
            <LiveStudio onNotify={addToast} />
          )}

          {activeTab === 'sermons' && (
            <ContentManager category="sermon" title="Sermons" onNotify={addToast} />
          )}

          {activeTab === 'events' && (
            <ContentManager category="event" title="Events" onNotify={addToast} />
          )}

          {activeTab === 'announcements' && (
            <ContentManager category="announcement" title="Announcements" onNotify={addToast} />
          )}

        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
