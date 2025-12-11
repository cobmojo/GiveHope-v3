
import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Menu, X, ChevronRight, Globe, ShieldCheck, HeartHandshake, ArrowUpRight, LayoutDashboard, Briefcase } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export const PublicLayout: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Define routes that have a dark hero section where transparent header works
  const isDarkHeroPage = ['/', '/workers', '/ways-to-give'].includes(location.pathname);
  
  // Determine if header should be transparent based on route and scroll state
  const isTransparent = isDarkHeroPage && !scrolled && !isMenuOpen;

  return (
    <div className="flex min-h-screen flex-col font-sans bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white">
      
      {/* --- HEADER --- */}
      <header 
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
          !isTransparent 
            ? "bg-white/80 backdrop-blur-xl border-b border-slate-200/50 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.03)]" 
            : "bg-transparent py-6 text-white"
        )}
      >
        <div className="container mx-auto px-6 md:px-8 flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group z-50 relative">
            <div className={cn(
              "h-8 w-8 flex items-center justify-center font-bold text-lg tracking-tighter transition-all duration-300",
              isTransparent ? "bg-white text-slate-950" : "bg-slate-950 text-white"
            )}>
              GH
            </div>
            <span className={cn(
              "font-bold text-xl tracking-tight transition-colors duration-300",
              isTransparent ? "text-white" : "text-slate-950"
            )}>
              GIVE<span className="font-light opacity-80">HOPE</span>
            </span>
          </Link>
          
          {/* Desktop Nav */}
          <nav className={cn(
            "hidden md:flex items-center gap-8 text-sm font-medium transition-colors duration-300",
            isTransparent ? "text-white/90" : "text-slate-600"
          )}>
            {['Our Mission', 'Workers', 'Financials', 'Ways to Give'].map((item) => (
              <Link 
                key={item}
                to={`/${item.toLowerCase().replace(/ /g, '-')}`} 
                className={cn(
                  "relative hover:text-blue-500 transition-colors py-2 group",
                  isTransparent ? "hover:text-white" : "hover:text-slate-900"
                )}
              >
                {item}
                <span className={cn(
                  "absolute bottom-0 left-0 w-full h-px transform scale-x-0 transition-transform duration-300 origin-right group-hover:scale-x-100 group-hover:origin-left",
                  isTransparent ? "bg-white" : "bg-slate-900"
                )} />
              </Link>
            ))}
            <div className={cn("h-4 w-px opacity-20", isTransparent ? "bg-white" : "bg-slate-900")} />
            <Link to="/donor-portal" className="hover:text-blue-500 transition-colors">Log In</Link>
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Button 
              asChild 
              className={cn(
                "rounded-full px-6 font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-0.5",
                isTransparent 
                  ? "bg-white text-slate-950 hover:bg-slate-100 border-none" 
                  : "bg-slate-950 text-white hover:bg-slate-800"
              )}
            >
              <Link to="/workers">
                Give Now <ChevronRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </div>

          {/* Mobile Toggle */}
          <button 
            className={cn("md:hidden p-2 z-50 relative focus:outline-none transition-colors", isTransparent ? "text-white" : "text-slate-950")} 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="absolute top-0 left-0 w-full h-screen bg-white z-40 flex flex-col pt-24 px-6 pb-6"
            >
              <nav className="flex flex-col space-y-6 text-3xl font-light tracking-tighter text-slate-950">
                <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
                <Link to="/our-mission" onClick={() => setIsMenuOpen(false)}>Our Mission</Link>
                <Link to="/workers" onClick={() => setIsMenuOpen(false)}>Field Workers</Link>
                <Link to="/financials" onClick={() => setIsMenuOpen(false)}>Financials</Link>
                <Link to="/ways-to-give" onClick={() => setIsMenuOpen(false)}>Ways to Give</Link>
                <Link to="/faq" onClick={() => setIsMenuOpen(false)}>FAQ</Link>
              </nav>
              <div className="mt-auto space-y-4">
                <Button asChild className="w-full h-14 text-lg rounded-full bg-slate-950 text-white">
                  <Link to="/workers" onClick={() => setIsMenuOpen(false)}>Give Now</Link>
                </Button>
                <div className="flex justify-between text-sm text-slate-500 pt-4 border-t border-slate-100">
                   <Link to="/donor-portal" onClick={() => setIsMenuOpen(false)}>Donor Login</Link>
                   <Link to="/worker-dashboard" onClick={() => setIsMenuOpen(false)}>Worker Portal</Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      
      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 relative">
        <Outlet />
      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-slate-950 text-white pt-24 pb-12 overflow-hidden relative">
        {/* Background Texture */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} 
        />

        <div className="container mx-auto px-6 md:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">
            
            {/* Brand Column - Large */}
            <div className="md:col-span-4 flex flex-col">
              <Link to="/" className="flex items-center gap-3 text-white mb-6">
                <div className="h-10 w-10 bg-white text-slate-950 flex items-center justify-center font-bold text-lg rounded-sm">GH</div>
                <span className="font-bold text-2xl tracking-tighter">GIVE<span className="font-light opacity-70">HOPE</span></span>
              </Link>
              <p className="text-lg leading-relaxed text-slate-400 font-light max-w-sm mb-6">
                Bridging the gap between compassionate resources and the world's most critical needs. Uncompromising hope for a fractured world.
              </p>
              <div className="flex items-center gap-6">
                <Globe className="h-6 w-6 text-slate-500 hover:text-white transition-colors cursor-pointer" />
                <ShieldCheck className="h-6 w-6 text-slate-500 hover:text-white transition-colors cursor-pointer" />
                <HeartHandshake className="h-6 w-6 text-slate-500 hover:text-white transition-colors cursor-pointer" />
              </div>

              {/* Distinctive Portal Buttons */}
              <div className="mt-auto pt-8">
                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-3">Team Access</p>
                <div className="flex flex-wrap gap-3">
                    <Button asChild variant="outline" size="sm" className="bg-slate-900/50 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 hover:border-slate-700 transition-all h-9 text-xs font-medium justify-start pl-3 pr-4">
                        <Link to="/mission-control">
                            <LayoutDashboard className="mr-2 h-3.5 w-3.5 text-blue-500" /> Mission Control
                        </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm" className="bg-slate-900/50 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 hover:border-slate-700 transition-all h-9 text-xs font-medium justify-start pl-3 pr-4">
                        <Link to="/worker-dashboard">
                            <Briefcase className="mr-2 h-3.5 w-3.5 text-emerald-500" /> Field Partner
                        </Link>
                    </Button>
                </div>
              </div>
            </div>

            {/* Links Columns */}
            <div className="md:col-span-2">
              <h4 className="font-semibold text-white mb-8 tracking-wider text-sm uppercase opacity-50">Organization</h4>
              <ul className="space-y-4 text-sm font-medium text-slate-400">
                <li><Link to="/our-mission" className="hover:text-white transition-colors">Our Mission</Link></li>
                <li><Link to="/financials" className="hover:text-white transition-colors">Financial Integrity</Link></li>
                <li><Link to="/our-mission" className="hover:text-white transition-colors">Leadership</Link></li>
                <li><Link to="/workers" className="hover:text-white transition-colors">Our Field Partners</Link></li>
              </ul>
            </div>

            <div className="md:col-span-2">
              <h4 className="font-semibold text-white mb-8 tracking-wider text-sm uppercase opacity-50">Support</h4>
              <ul className="space-y-4 text-sm font-medium text-slate-400">
                <li><Link to="/ways-to-give" className="hover:text-white transition-colors">Ways to Give</Link></li>
                <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
                <li><Link to="/donor-portal" className="hover:text-white transition-colors">Donor Portal</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact Support</Link></li>
              </ul>
            </div>

            {/* Newsletter Column */}
            <div className="md:col-span-4 bg-white/5 rounded-2xl p-6 border border-white/10">
              <h4 className="font-bold text-white text-xl mb-2">Join the Movement</h4>
              <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                Receive field updates, impact reports, and urgent needs directly to your inbox. No spam, just impact.
              </p>
              <div className="flex flex-col gap-3">
                <input 
                  type="email" 
                  placeholder="email@address.com" 
                  className="bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all w-full placeholder:text-slate-600"
                />
                <Button size="lg" className="w-full bg-white text-slate-950 hover:bg-slate-200 font-bold">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-12 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-slate-500 font-medium tracking-wide">
            <p>© 2024 GiveHope Humanitarian. 501(c)(3) Nonprofit.</p>
            <div className="flex gap-8">
              <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link to="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link>
            </div>
          </div>

          {/* Huge Watermark */}
          <div className="absolute bottom-0 left-0 right-0 overflow-hidden pointer-events-none opacity-[0.03] select-none">
            <h1 className="text-[15vw] font-black text-center leading-[0.8] tracking-tighter text-white whitespace-nowrap">
              GIVE HOPE
            </h1>
          </div>
        </div>
      </footer>
    </div>
  );
};
