
import React, { useState, useEffect } from 'react';
import { FieldworkerSidebar } from '../sidebar/FieldworkerSidebar';
import { SidebarProvider, SidebarTrigger, SidebarInset } from '../ui/sidebar';
import { Separator } from '../ui/separator';
import { useLocation, useNavigate } from 'react-router-dom';

// Views
import { WorkerDashboard } from '../../pages/worker/WorkerDashboard';
import { WorkerFeed } from '../../pages/worker/WorkerFeed';
import { WorkerAnalytics } from '../../pages/worker/WorkerAnalytics';
import { WorkerDonors } from '../../pages/worker/WorkerDonors';
import { WorkerGifts } from '../../pages/worker/WorkerGifts';
import { WorkerTasks } from '../../pages/worker/WorkerTasks';
import { WorkerContent } from '../../pages/worker/WorkerContent';
import { WorkerEmailStudio } from '../../pages/worker/WorkerEmailStudio';
import { WorkerSettings } from '../../pages/worker/WorkerSettings';

export const FieldWorkerLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Initialize view from URL or default to dashboard
  const getInitialView = () => {
    const path = location.pathname.split('/').pop();
    // specific check to avoid matching 'worker-dashboard' itself if trailing slash or clean url
    if (path === 'worker-dashboard') return 'dashboard';
    return path || 'dashboard';
  };

  const [currentView, setCurrentView] = useState<string>(getInitialView());

  // Sync state with URL changes (e.g. back button)
  useEffect(() => {
    const path = location.pathname.split('/').pop();
    if (path && path !== 'worker-dashboard') {
      setCurrentView(path);
    } else {
      setCurrentView('dashboard');
    }
  }, [location.pathname]);

  const viewTitles: Record<string, string> = {
    dashboard: 'Dashboard',
    feed: 'My Feed',
    analytics: 'Giving Analytics',
    donors: 'My Donors',
    pledges: 'My Gifts',
    tasks: 'Tasks',
    content: 'Content & Profile',
    email: 'Email Studio',
    settings: 'Settings'
  };

  const renderContent = () => {
      switch(currentView) {
          case 'dashboard': return <WorkerDashboard />;
          case 'feed': return <WorkerFeed />;
          case 'analytics': return <WorkerAnalytics />;
          case 'donors': return <WorkerDonors />;
          case 'pledges': return <WorkerGifts />;
          case 'gifts': return <WorkerGifts />; // Handle alias
          case 'tasks': return <WorkerTasks />;
          case 'content': return <WorkerContent />; 
          case 'email': return <WorkerEmailStudio />;
          case 'email-studio': return <WorkerEmailStudio />; // Handle alias
          case 'settings': return <WorkerSettings />;
          default: return <WorkerDashboard />;
      }
  };

  const handleNavigation = (view: string) => {
    setCurrentView(view);
    navigate(`/worker-dashboard/${view}`);
  };

  return (
    <SidebarProvider>
      <FieldworkerSidebar 
        currentView={currentView}
        onNavigate={handleNavigation}
      />

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white/50 backdrop-blur-sm px-4 sticky top-0 z-20 md:hidden">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h2 className="text-sm font-semibold text-slate-900">
            {viewTitles[currentView] || 'Dashboard'}
          </h2>
        </header>

        <main className="flex-1 p-4 md:p-6 lg:p-8 bg-slate-50/50 min-h-[calc(100vh-4rem)] md:min-h-screen">
          {renderContent()}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};
