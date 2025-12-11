
import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { 
  LayoutDashboard, 
  History, 
  Settings, 
  CreditCard, 
  Rss, 
  LogOut, 
  Menu, 
  X, 
  ChevronDown,
  Bell,
  Heart,
  Wallet
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/Avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '../ui/DropdownMenu';
import { motion, AnimatePresence } from 'framer-motion';
import { GivingAssistant } from '../feature/GivingAssistant';
import { DonorQuickGive } from '../feature/DonorQuickGive';

export const DonorLayout: React.FC = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const tabs = [
    { name: 'Dashboard', href: '/donor-portal', icon: LayoutDashboard, exact: true },
    { name: 'My Feed', href: '/donor-portal/feed', icon: Rss },
    { name: 'Wallet', href: '/donor-portal/wallet', icon: Wallet },
    { name: 'History', href: '/donor-portal/history', icon: History },
    { name: 'Pledges', href: '/donor-portal/recurring', icon: CreditCard },
    { name: 'Settings', href: '/donor-portal/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900 relative">
      
      {/* --- HEADER --- */}
      <header 
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
          isScrolled 
            ? "bg-white/90 backdrop-blur-xl border-slate-200/80 shadow-[0_2px_20px_rgba(0,0,0,0.04)] py-2" 
            : "bg-white border-transparent py-4"
        )}
      >
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-14">
             
             {/* LEFT: Logo */}
             <div className="flex items-center gap-8">
                 <Link to="/" className="flex items-center gap-2 group relative z-50">
                    <div className="h-9 w-9 bg-slate-950 text-white rounded-lg flex items-center justify-center font-bold text-lg tracking-tighter shadow-sm group-hover:scale-105 transition-transform duration-300">
                        GH
                    </div>
                    <span className="font-bold text-xl tracking-tight text-slate-950 hidden md:block">
                      GIVE<span className="font-light opacity-60">HOPE</span>
                    </span>
                 </Link>

                 {/* DESKTOP NAV */}
                 <nav className="hidden md:flex items-center gap-1">
                    {tabs.map((tab) => {
                      const isActive = tab.exact 
                        ? location.pathname === tab.href 
                        : location.pathname.startsWith(tab.href);
                        
                      return (
                        <Link
                          key={tab.name}
                          to={tab.href}
                          className={cn(
                            "relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2",
                            isActive
                              ? "text-slate-950 bg-slate-100"
                              : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                          )}
                        >
                          {isActive && (
                            <motion.span 
                              layoutId="activeTab"
                              className="absolute inset-0 bg-white shadow-sm border border-slate-200/60 rounded-full"
                              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                              style={{ zIndex: -1 }}
                            />
                          )}
                          <tab.icon className={cn("h-4 w-4", isActive ? "text-blue-600" : "opacity-70")} />
                          {tab.name}
                        </Link>
                      );
                    })}
                 </nav>
             </div>

             {/* RIGHT: Actions & Profile */}
             <div className="flex items-center gap-3 md:gap-4">
                 
                 {/* Quick Give (Desktop) */}
                 <div className="hidden md:block">
                   <DonorQuickGive />
                 </div>

                 {/* Notifications */}
                 <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-full hover:bg-slate-100">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full border-2 border-white"></span>
                 </button>

                 {/* User Dropdown */}
                 <div className="relative z-50">
                   <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full hover:bg-slate-50 transition-colors focus:outline-none group border border-transparent hover:border-slate-100">
                            <div className="hidden md:flex flex-col items-end text-right">
                                <span className="text-sm font-bold text-slate-900 leading-none">John Doe</span>
                                <span className="text-[10px] font-medium text-slate-500">Donor Partner</span>
                            </div>
                            <Avatar className="h-9 w-9 border-2 border-white shadow-sm ring-1 ring-slate-100 group-hover:ring-slate-200 transition-all">
                                <AvatarFallback className="bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700 font-bold text-xs">JD</AvatarFallback>
                            </Avatar>
                            <ChevronDown className="h-3 w-3 text-slate-400 hidden md:block" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56 p-2" sideOffset={8}>
                          <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                              <p className="text-sm font-medium leading-none">John Doe</p>
                              <p className="text-xs leading-none text-muted-foreground">john.doe@example.com</p>
                            </div>
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link to="/donor-portal/settings" className="cursor-pointer">
                              <Settings className="mr-2 h-4 w-4" /> Account Settings
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link to="/donor-portal/history" className="cursor-pointer">
                              <History className="mr-2 h-4 w-4" /> Billing History
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600 focus:text-red-600 cursor-pointer">
                            <LogOut className="mr-2 h-4 w-4" /> Log out
                          </DropdownMenuItem>
                      </DropdownMenuContent>
                   </DropdownMenu>
                 </div>

                 {/* Mobile Menu Toggle */}
                 <button 
                    className="md:hidden p-2 text-slate-600"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                 >
                    {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                 </button>
             </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-b border-slate-100 overflow-hidden"
            >
              <div className="container mx-auto px-4 py-4 space-y-2">
                {tabs.map((tab) => {
                   const isActive = tab.exact 
                   ? location.pathname === tab.href 
                   : location.pathname.startsWith(tab.href);

                   return (
                    <Link
                      key={tab.name}
                      to={tab.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                        isActive
                          ? "bg-slate-100 text-slate-900"
                          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                      )}
                    >
                      <tab.icon className={cn("h-5 w-5", isActive ? "text-blue-600" : "text-slate-400")} />
                      {tab.name}
                    </Link>
                   )
                })}
                <div className="pt-4 mt-4 border-t border-slate-100">
                   <div className="mb-4">
                      <DonorQuickGive />
                   </div>
                   <Button className="w-full justify-center bg-slate-900 text-white" asChild>
                      <Link to="/workers">Browse All Workers</Link>
                   </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* --- MAIN CONTENT --- */}
      <div className="pt-24 pb-12 container mx-auto px-4 md:px-8 max-w-7xl min-h-[calc(100vh-5rem)]">
        <Outlet />
      </div>

      {/* --- GLOBAL GIVING ASSISTANT --- */}
      <GivingAssistant />

    </div>
  );
};
