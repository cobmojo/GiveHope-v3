import React from 'react';
import { Sidebar } from './Sidebar';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { LogOut } from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
  type: 'admin' | 'worker' | 'donor';
}

export const AppShell: React.FC<AppShellProps> = ({ children, type }) => {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar type={type} />
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            {/* Mobile menu trigger could go here */}
            <h1 className="text-sm font-semibold md:hidden">
              {type === 'admin' ? 'Mission Control' : 'Portal'}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {type === 'worker' && (
              <Button variant="outline" size="sm" asChild>
                <Link to="/workers/1" target="_blank">View Public Profile</Link>
              </Button>
            )}
             {type === 'admin' && (
              <Button variant="outline" size="sm" asChild>
                <Link to="/" target="_blank">View Site</Link>
              </Button>
            )}
            <Button variant="ghost" size="icon" title="Logout">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </header>
        <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          {children}
        </main>
      </div>
    </div>
  );
};