
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { formatCurrency } from '../../lib/utils';
import { Link } from 'react-router-dom';
import { 
  Heart, Rss, ArrowRight, Activity, Map,
  CreditCard, FileText, UserCog, TrendingUp, ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';

// Component Imports
import { MissionBriefing } from '../../components/donor/MissionBriefing';
import { ImpactTile } from '../../components/donor/ImpactTile';
import { DashboardSkeleton, Greeting, QuickActionCard } from '../../components/donor/DashboardUI';

// Data Imports
import { RECENT_UPDATES, WORKER_FEEDS } from '../../lib/donor-mock';

export const DonorDashboard: React.FC = () => {
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  useEffect(() => {
    // Simulate loading essential data
    const timer = setTimeout(() => {
      setIsPageLoaded(true);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  if (!isPageLoaded) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 pt-4">
      
      {/* 1. Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6"
      >
         <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-1">
              <Greeting />, John.
            </h1>
            <p className="text-slate-500 font-medium text-lg">Thank you for your partnership.</p>
         </div>
         <div className="flex gap-3 w-full md:w-auto">
           <Button variant="outline" className="flex-1 md:flex-none h-10 rounded-full border-slate-200 text-slate-700 font-semibold bg-white hover:bg-slate-50" asChild>
              <Link to="/donor-portal/history"><FileText className="mr-2 h-4 w-4"/> Tax Receipt</Link>
           </Button>
           <Button className="flex-1 md:flex-none h-10 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-semibold shadow-md" asChild>
              <Link to="/workers">Give Support</Link>
           </Button>
         </div>
      </motion.div>

      {/* 2. Intelligence Layer (AI Briefing) */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <MissionBriefing 
            feeds={WORKER_FEEDS} 
            activeSupport={['miller', 'smith']} 
        />
      </motion.div>

      {/* 3. Quick Actions Grid */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickActionCard 
            icon={CreditCard} 
            label="Payment Methods" 
            href="/donor-portal/wallet" 
            colorClass="text-blue-600" 
            bgClass="bg-blue-50" 
          />
          <QuickActionCard 
            icon={TrendingUp} 
            label="Manage Pledges" 
            href="/donor-portal/recurring" 
            colorClass="text-emerald-600" 
            bgClass="bg-emerald-50" 
          />
          <QuickActionCard 
            icon={FileText} 
            label="Tax Documents" 
            href="/donor-portal/history" 
            colorClass="text-purple-600" 
            bgClass="bg-purple-50" 
          />
          <QuickActionCard 
            icon={UserCog} 
            label="Profile Settings" 
            href="/donor-portal/settings" 
            colorClass="text-orange-600" 
            bgClass="bg-orange-50" 
          />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* 4. Main Content Area */}
        <div className="lg:col-span-8 space-y-8">
            
            {/* Impact Grid (Mixed Data & AI) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Tile 1: Hard Financial Data */}
                <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="h-full"
                >
                    <ImpactTile 
                        title="Total Given YTD" 
                        value={formatCurrency(12500)} 
                        icon={Heart} 
                        colorClass="text-rose-600" 
                        bgClass="bg-rose-50" 
                    />
                </motion.div>

                {/* Tile 2: AI Generated from 'miller' feed context */}
                <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    className="h-full"
                >
                    <ImpactTile 
                        title="Community Focus" 
                        value={undefined} // Force AI mode
                        icon={Map} 
                        colorClass="text-emerald-600" 
                        bgClass="bg-emerald-50"
                        contextKeys={['miller']} 
                        feeds={WORKER_FEEDS}
                    />
                </motion.div>

                {/* Tile 3: AI Generated from 'smith' feed context */}
                <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                    className="h-full"
                >
                    <ImpactTile 
                        title="Health Activity" 
                        value={undefined} // Force AI mode
                        icon={Activity} 
                        colorClass="text-blue-600" 
                        bgClass="bg-blue-50"
                        contextKeys={['smith']} 
                        feeds={WORKER_FEEDS}
                    />
                </motion.div>
            </div>

            {/* Featured Visual Story */}
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}
                className="relative overflow-hidden rounded-3xl bg-slate-900 text-white shadow-xl min-h-[320px] flex flex-col justify-end group cursor-pointer"
            >
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent opacity-90" />
                
                <div className="relative z-10 p-8 space-y-4">
                    <Badge className="bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-md">Featured Story</Badge>
                    <h2 className="text-3xl font-bold tracking-tight text-balance">The school year begins in Chiang Mai.</h2>
                    <p className="text-slate-300 max-w-xl text-lg leading-relaxed line-clamp-2">
                        Thanks to monthly partners, 50 children received uniforms and books this week. See the full photo gallery from the first day of class.
                    </p>
                    <div className="pt-2">
                        <Link to="/donor-portal/feed" className="inline-flex items-center text-sm font-bold text-white hover:text-blue-200 transition-colors">
                            Read Update <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </motion.div>

        </div>

        {/* 5. Sidebar */}
        <div className="lg:col-span-4 space-y-6">
           
           {/* Feed Widget */}
           <Card className="border-slate-200 shadow-sm h-full flex flex-col overflow-hidden bg-white">
              <CardHeader className="pb-3 border-b border-slate-100">
                 <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
                        <Rss className="h-4 w-4 text-slate-400" /> Recent Updates
                    </CardTitle>
                    <Link to="/donor-portal/feed" className="text-xs font-bold text-blue-600 hover:underline">View All</Link>
                 </div>
              </CardHeader>
              <CardContent className="p-0 flex-1">
                 <div className="divide-y divide-slate-100">
                    {RECENT_UPDATES.map(update => (
                       <Link to="/donor-portal/feed" key={update.id} className="flex gap-3 p-4 hover:bg-slate-50 transition-colors group">
                          <div className="shrink-0">
                             {update.image ? (
                               <img src={update.image} alt="" className="h-9 w-9 rounded-full object-cover ring-1 ring-slate-100" />
                             ) : (
                               <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-xs">
                                  {update.avatar}
                               </div>
                             )}
                          </div>
                          <div className="flex-1 min-w-0">
                             <div className="flex justify-between items-baseline mb-0.5">
                                <span className="text-sm font-semibold text-slate-900 truncate">{update.author}</span>
                                <span className="text-[10px] text-slate-400 whitespace-nowrap">{update.time}</span>
                             </div>
                             <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{update.title}</p>
                          </div>
                          <ChevronRight className="h-4 w-4 text-slate-300 self-center opacity-0 group-hover:opacity-100 transition-opacity" />
                       </Link>
                    ))}
                 </div>
              </CardContent>
              <div className="p-3 bg-slate-50 text-center border-t border-slate-100">
                 <p className="text-[10px] text-slate-400">Updates directly from the field</p>
              </div>
           </Card>

        </div>
      </div>

      <div className="pt-12 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center text-xs text-slate-400 gap-4 font-medium">
         <p>© 2024 GiveHope Humanitarian.</p>
         <div className="flex gap-6">
            <a href="#" className="hover:text-slate-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-600 transition-colors">Terms</a>
            <a href="#" className="hover:text-slate-600 transition-colors">Support</a>
         </div>
      </div>
    </div>
  );
};
