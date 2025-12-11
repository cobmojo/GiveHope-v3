
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';

// Utilities
import ScrollToTop from './components/utils/ScrollToTop';

// Layouts
import { PublicLayout } from './components/layout/PublicLayout';
import { AppShell } from './components/layout/AppShell';
import { FieldWorkerLayout } from './components/layout/FieldWorkerLayout';
import { DonorLayout } from './components/layout/DonorLayout';

// Public Pages
import { Home } from './pages/public/Home';
import { About } from './pages/public/About';
import { Financials } from './pages/public/Financials';
import { WaysToGive } from './pages/public/WaysToGive';
import { FAQ } from './pages/public/FAQ';
import { WorkerList } from './pages/public/WorkerList';
import { WorkerProfile } from './pages/public/WorkerProfile';
import { Checkout } from './pages/public/Checkout';
import { SignStudioPublicSigning } from './pages/public/SignStudioPublicSigning';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { SupportHub } from './pages/admin/SupportHub';
import { SignStudioDocuments } from './pages/admin/sign-studio/SignStudioDocuments';
import { SignStudioNewDocument } from './pages/admin/sign-studio/SignStudioNewDocument';
import { SignStudioTemplates } from './pages/admin/sign-studio/SignStudioTemplates';
import { SignStudioTemplateEditor } from './pages/admin/sign-studio/SignStudioTemplateEditor';
import { SignStudioDocumentDetail } from './pages/admin/sign-studio/SignStudioDocumentDetail';

// Donor Pages
import { DonorDashboard } from './pages/donor/DonorDashboard';
import { DonorFeed } from './pages/donor/DonorFeed';
import { DonorHistory } from './pages/donor/DonorHistory';
import { DonorRecurring } from './pages/donor/DonorRecurring';
import { DonorSettings } from './pages/donor/DonorSettings';
import { DonorWallet } from './pages/donor/DonorWallet';

// Worker Pages
import { WorkerDashboard } from './pages/worker/WorkerDashboard';
import { WorkerAnalytics } from './pages/worker/WorkerAnalytics';
import { WorkerFeed } from './pages/worker/WorkerFeed';
import { WorkerDonors } from './pages/worker/WorkerDonors';
import { WorkerGifts } from './pages/worker/WorkerGifts';
import { WorkerTasks } from './pages/worker/WorkerTasks';
import { WorkerPages } from './pages/worker/WorkerPages';
import { WorkerContent } from './pages/worker/WorkerContent';
import { WorkerSettings } from './pages/worker/WorkerSettings';
import { WorkerEmailStudio } from './pages/worker/WorkerEmailStudio';

// Placeholder for missing modules
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
      <span className="text-2xl">🚧</span>
    </div>
    <h1 className="text-2xl font-bold text-slate-900 mb-2">{title}</h1>
    <p className="text-slate-500 max-w-md mx-auto">
      This module is currently under development. Check back later for updates.
    </p>
  </div>
);

const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        
        {/* --- STANDALONE ROUTES (No Layout) --- */}
        {/* Document Signing Ceremony */}
        <Route path="/sign/doc/:token" element={<SignStudioPublicSigning />} />
        <Route path="/sign-studio/sign/:token" element={<Navigate to="/sign/doc/:token" replace />} />

        {/* --- PUBLIC WEBSITE --- */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/our-mission" element={<About />} />
          <Route path="/financials" element={<Financials />} />
          <Route path="/ways-to-give" element={<WaysToGive />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/workers" element={<WorkerList />} />
          <Route path="/workers/:id" element={<WorkerProfile />} />
          <Route path="/checkout" element={<Checkout />} />
        </Route>

        {/* --- DONOR PORTAL --- */}
        <Route path="/donor-portal" element={<DonorLayout />}>
          <Route index element={<DonorDashboard />} />
          <Route path="feed" element={<DonorFeed />} />
          <Route path="wallet" element={<DonorWallet />} />
          <Route path="history" element={<DonorHistory />} />
          <Route path="recurring" element={<DonorRecurring />} />
          <Route path="settings" element={<DonorSettings />} />
          <Route path="profile" element={<Navigate to="settings" replace />} />
        </Route>

        {/* --- MISSION CONTROL (ADMIN) --- */}
        <Route path="/mission-control" element={<AppShell type="admin"><Outlet /></AppShell>}>
          <Route index element={<AdminDashboard />} />
          
          {/* Sign Studio Module */}
          <Route path="sign-studio">
            <Route index element={<SignStudioDocuments />} />
            <Route path="documents" element={<SignStudioDocuments />} />
            <Route path="documents/:id" element={<SignStudioDocumentDetail />} />
            <Route path="new" element={<SignStudioNewDocument />} />
            <Route path="templates" element={<SignStudioTemplates />} />
            <Route path="templates/new" element={<SignStudioTemplateEditor />} />
            <Route path="templates/:id/edit" element={<SignStudioTemplateEditor />} />
          </Route>

          {/* Support Hub Module */}
          <Route path="support-hub" element={<SupportHub />} />

          {/* Future Modules */}
          <Route path="web-studio" element={<PlaceholderPage title="Web Studio" />} />
          <Route path="crm" element={<PlaceholderPage title="CRM" />} />
          <Route path="contributions" element={<PlaceholderPage title="Contributions Hub" />} />
          <Route path="email-studio" element={<PlaceholderPage title="Email Studio" />} />
          <Route path="pdf-studio" element={<PlaceholderPage title="PDF Studio" />} />
          <Route path="report-studio" element={<PlaceholderPage title="Report Studio" />} />
          <Route path="mobilize" element={<PlaceholderPage title="Mobilize" />} />
          <Route path="events" element={<PlaceholderPage title="Events & Conferences" />} />
          <Route path="member-care" element={<PlaceholderPage title="Member Care" />} />
          <Route path="automation" element={<PlaceholderPage title="Automations" />} />
          <Route path="settings" element={<PlaceholderPage title="Settings" />} />
        </Route>

        {/* --- FIELD WORKER DASHBOARD --- */}
        <Route path="/worker-dashboard" element={<FieldWorkerLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<WorkerDashboard />} />
          <Route path="feed" element={<WorkerFeed />} />
          <Route path="analytics" element={<WorkerAnalytics />} />
          <Route path="donors" element={<WorkerDonors />} />
          <Route path="gifts" element={<WorkerGifts />} />
          <Route path="tasks" element={<WorkerTasks />} />
          <Route path="content" element={<WorkerContent />} />
          <Route path="pages" element={<WorkerPages />} />
          <Route path="email-studio" element={<WorkerEmailStudio />} />
          <Route path="settings" element={<WorkerSettings />} />
          
          {/* Worker Redirects */}
          <Route path="profile" element={<Navigate to="content" replace />} />
          <Route path="pledges" element={<Navigate to="gifts" replace />} />
          <Route path="reports" element={<Navigate to="analytics" replace />} />
        </Route>

        {/* --- 404 FALLBACK --- */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
