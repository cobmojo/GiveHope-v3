
import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { 
  LayoutDashboard, 
  Users, 
  Heart, 
  Mail, 
  FileText, 
  Settings, 
  Zap, 
  Globe,
  BarChart3,
  PenTool,
  Rocket,
  LifeBuoy,
  Calendar,
  HeartHandshake
} from 'lucide-react';

interface SidebarProps {
  type: 'admin' | 'worker' | 'donor';
}

export const Sidebar: React.FC<SidebarProps> = ({ type }) => {
  const getLinks = () => {
    switch (type) {
      case 'admin':
        return [
          { href: '/mission-control', label: 'Dashboard', icon: LayoutDashboard },
          { href: '/mission-control/web-studio', label: 'Web Studio', icon: Globe },
          { href: '/mission-control/crm', label: 'CRM', icon: Users },
          { href: '/mission-control/contributions', label: 'Contributions Hub', icon: Heart },
          { href: '/mission-control/email-studio', label: 'Email Studio', icon: Mail },
          { href: '/mission-control/pdf-studio', label: 'PDF Studio', icon: FileText },
          { href: '/mission-control/report-studio', label: 'Report Studio', icon: BarChart3 },
          { href: '/mission-control/sign-studio', label: 'Sign Studio', icon: PenTool },
          { href: '/mission-control/mobilize', label: 'Mobilize', icon: Rocket },
          { href: '/mission-control/support-hub', label: 'Support Hub', icon: LifeBuoy },
          { href: '/mission-control/events', label: 'Events & Conferences Hub', icon: Calendar },
          { href: '/mission-control/member-care', label: 'Member Care Dashboard', icon: HeartHandshake },
          { href: '/mission-control/automation', label: 'Automations', icon: Zap },
          { href: '/mission-control/settings', label: 'Settings', icon: Settings },
        ];
      case 'worker':
        return [
          { href: '/worker-dashboard', label: 'Overview', icon: LayoutDashboard },
          { href: '/worker-dashboard/feed', label: 'My Feed', icon: Globe },
          { href: '/worker-dashboard/profile', label: 'My Profile', icon: Users },
          { href: '/worker-dashboard/donations', label: 'My Support', icon: Heart },
          { href: '/worker-dashboard/settings', label: 'Settings', icon: Settings },
        ];
      case 'donor':
        return [
          { href: '/donor-portal', label: 'My Giving', icon: Heart },
          { href: '/donor-portal/history', label: 'History', icon: FileText },
          { href: '/donor-portal/profile', label: 'Profile', icon: Users },
        ];
      default:
        return [];
    }
  };

  const links = getLinks();

  return (
    <aside className="hidden w-64 flex-col border-r bg-card md:flex h-screen sticky top-0">
      <div className="flex h-14 items-center border-b px-4 font-bold text-lg tracking-tight">
        {type === 'admin' && 'Mission Control'}
        {type === 'worker' && 'Field Worker Portal'}
        {type === 'donor' && 'Donor Portal'}
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {links.map((link) => (
            <li key={link.href}>
              <NavLink
                to={link.href}
                end={link.href.split('/').length === 2} // Exact match for root only
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                    isActive ? "bg-secondary text-secondary-foreground" : "text-muted-foreground"
                  )
                }
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="border-t p-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-slate-200 overflow-hidden">
             <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?fit=facearea&facepad=2&w=256&h=256&q=80" alt="Avatar" />
          </div>
          <div className="text-sm">
            <p className="font-medium">User Name</p>
            <p className="text-xs text-muted-foreground capitalize">{type === 'worker' ? 'Field Worker' : type}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
