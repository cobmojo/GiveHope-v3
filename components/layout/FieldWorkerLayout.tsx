
import React, { useState } from 'react';
import { FieldworkerSidebar } from '../sidebar/FieldworkerSidebar';
import { SidebarProvider, SidebarTrigger, SidebarInset } from '../ui/sidebar';
import { Separator } from '../ui/separator';

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
  const [currentView, setCurrentView] = useState<string>('dashboard');

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
          case 'tasks': return <WorkerTasks />;
          case 'content': return <WorkerContent />; 
          case 'email': return <WorkerEmailStudio />;
          case 'settings': return <WorkerSettings />;
          default: return <div className="p-8 text-center text-muted-foreground">Module coming soon...</div>;
      }
  };

  return (
    <SidebarProvider>
      <FieldworkerSidebar 
        currentView={currentView}
        onNavigate={(view) => setCurrentView(view)}
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
