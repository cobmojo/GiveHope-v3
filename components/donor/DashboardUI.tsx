
import React from 'react';
import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

export const DashboardSkeleton = () => (
  <div className="space-y-8 w-full max-w-7xl mx-auto pt-4">
    <div className="flex justify-between items-end">
        <div className="space-y-2">
            <div className="h-8 w-48 bg-slate-200 rounded-md animate-pulse" />
            <div className="h-4 w-32 bg-slate-100 rounded-md animate-pulse" />
        </div>
        <div className="h-10 w-32 bg-slate-200 rounded-full animate-pulse" />
    </div>
    <div className="h-24 w-full bg-slate-100 rounded-xl border border-slate-200 animate-pulse" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map(i => (
        <div key={i} className="h-40 bg-white rounded-2xl border border-slate-100 animate-pulse" />
      ))}
    </div>
  </div>
);

export const Greeting = () => {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  return <span className="animate-in fade-in duration-700">{greeting}</span>;
};

interface QuickActionCardProps {
  icon: LucideIcon;
  label: string;
  href: string;
  colorClass: string;
  bgClass: string;
}

export const QuickActionCard = ({ icon: Icon, label, href, colorClass, bgClass }: QuickActionCardProps) => (
  <Link to={href} className="group block">
    <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center gap-3 transition-all duration-300 hover:shadow-md hover:border-slate-300 hover:-translate-y-1 h-full">
      <div className={cn("w-12 h-12 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110", bgClass, colorClass)}>
        <Icon className="h-6 w-6" />
      </div>
      <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900 text-center leading-tight">
        {label}
      </span>
    </div>
  </Link>
);
