
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, MapPin, Filter, ArrowRight, Heart, 
  Globe, TrendingUp, Users, ChevronDown, SlidersHorizontal, X 
} from 'lucide-react';

import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Progress } from '../../components/ui/Progress';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem
} from '../../components/ui/DropdownMenu';
import { QuickGive } from '../../components/feature/QuickGive';
import { getFieldWorkers } from '../../lib/mock';
import { formatCurrency, cn } from '../../lib/utils';

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const }
  }
};

export const WorkerList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [regionFilter, setRegionFilter] = useState<string>('All');

  const workers = getFieldWorkers();

  // Extract unique categories and regions for filters
  const categories = ['All', ...Array.from(new Set(workers.map(w => w.category)))];
  const regions = ['All', ...Array.from(new Set(workers.map(w => w.location.split(', ').pop() || 'Global')))];

  const filteredWorkers = useMemo(() => {
    return workers.filter(worker => {
      const matchesSearch = worker.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            worker.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            worker.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = categoryFilter === 'All' || worker.category === categoryFilter;
      const matchesRegion = regionFilter === 'All' || worker.location.includes(regionFilter);

      return matchesSearch && matchesCategory && matchesRegion;
    });
  }, [searchTerm, categoryFilter, regionFilter, workers]);

  const activeFiltersCount = (categoryFilter !== 'All' ? 1 : 0) + (regionFilter !== 'All' ? 1 : 0);

  const clearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('All');
    setRegionFilter('All');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      
      {/* --- HERO SECTION --- */}
      <section className="relative bg-slate-950 pt-32 pb-48 overflow-hidden isolate">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/40 via-slate-950/60 to-slate-950" />
           <img 
             src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000&auto=format&fit=crop" 
             alt="World Map" 
             className="w-full h-full object-cover grayscale mix-blend-overlay"
           />
        </div>
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-widest backdrop-blur-md">
              <Globe className="w-3.5 h-3.5" /> Global Impact Directory
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white leading-[1.1]">
              Boots on the Ground. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-white to-blue-200">
                Hope in Action.
              </span>
            </h1>
            
            <p className="text-xl text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
              Connect directly with verified partners serving on the frontlines. 
              100% of your program donation goes straight to their field account.
            </p>
          </motion.div>
        </div>
      </section>

      {/* --- SEARCH & FILTER BAR --- */}
      <div className="container mx-auto px-6 -mt-24 relative z-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="bg-white rounded-2xl shadow-2xl shadow-slate-900/10 border border-slate-200/60 p-4 md:p-6 backdrop-blur-xl"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search by name, location, or keyword..." 
                className="w-full h-12 pl-12 pr-4 rounded-xl bg-slate-50 border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-slate-900 placeholder:text-slate-500 outline-none text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filters */}
            <div className="flex gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-12 px-6 rounded-xl border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50 bg-white gap-2 font-medium">
                    <Filter className="h-4 w-4" />
                    {categoryFilter === 'All' ? 'Category' : categoryFilter}
                    <ChevronDown className="h-3 w-3 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Filter by Focus</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {categories.map(cat => (
                    <DropdownMenuCheckboxItem 
                      key={cat} 
                      checked={categoryFilter === cat}
                      onCheckedChange={() => setCategoryFilter(cat)}
                    >
                      {cat}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-12 px-6 rounded-xl border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50 bg-white gap-2 font-medium">
                    <MapPin className="h-4 w-4" />
                    {regionFilter === 'All' ? 'Region' : regionFilter}
                    <ChevronDown className="h-3 w-3 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Filter by Region</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {regions.map(reg => (
                    <DropdownMenuCheckboxItem 
                      key={reg} 
                      checked={regionFilter === reg}
                      onCheckedChange={() => setRegionFilter(reg)}
                    >
                      {reg}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {activeFiltersCount > 0 && (
                <Button 
                  variant="ghost" 
                  onClick={clearFilters}
                  className="h-12 px-4 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <X className="h-5 w-5" />
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* --- CONTENT GRID --- */}
      <div className="container mx-auto px-6 py-20">
        
        {/* Results Count */}
        <div className="flex justify-between items-center mb-8">
          <p className="text-slate-500 font-medium">
            Showing <span className="text-slate-900 font-bold">{filteredWorkers.length}</span> active partners
          </p>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <TrendingUp className="h-4 w-4" /> Sort by: <span className="text-slate-700 font-medium cursor-pointer hover:underline">Relevance</span>
          </div>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence>
            {filteredWorkers.map((worker) => {
              const percentRaised = Math.min(100, Math.round((worker.raised / worker.goal) * 100));
              
              return (
                <motion.div 
                  key={worker.id}
                  variants={itemVariants}
                  layout
                  className="group bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 hover:-translate-y-1 flex flex-col h-full overflow-hidden"
                >
                  {/* Image Header */}
                  <div className="relative h-64 overflow-hidden">
                    <Link to={`/workers/${worker.id}`} className="block h-full w-full">
                      <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors z-10" />
                      <img 
                        src={worker.image} 
                        alt={worker.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </Link>
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 right-4 z-20">
                      <Badge className="bg-white/90 backdrop-blur text-slate-900 font-bold px-3 py-1 shadow-lg hover:bg-white border border-white/50">
                        {worker.category}
                      </Badge>
                    </div>

                    {/* Location Badge */}
                    <div className="absolute bottom-4 left-4 z-20 flex items-center gap-1.5 text-white text-xs font-bold tracking-wide drop-shadow-md">
                      <MapPin className="h-3.5 w-3.5 text-blue-400 fill-blue-400" />
                      {worker.location}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    <Link to={`/workers/${worker.id}`} className="block mb-3">
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {worker.title}
                      </h3>
                    </Link>
                    
                    <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 mb-6 flex-1">
                      {worker.description}
                    </p>

                    {/* Funding Status */}
                    <div className="space-y-3 mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <div className="flex justify-between items-end text-sm">
                        <div className="flex flex-col">
                          <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-0.5">Raised</span>
                          <span className="font-bold text-slate-900">{formatCurrency(worker.raised)}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-slate-900 font-bold text-lg">{percentRaised}%</span>
                        </div>
                      </div>
                      <Progress value={percentRaised} className="h-2 bg-slate-200" />
                      <div className="flex justify-between text-xs text-slate-400 font-medium">
                        <span>Goal: {formatCurrency(worker.goal)}</span>
                        <span className="text-emerald-600 flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" /> Trending
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-3">
                      <QuickGive workerId={worker.id} />
                      
                      <Button 
                        variant="outline" 
                        className="w-full rounded-full border-slate-200 hover:bg-slate-50 hover:text-slate-900 text-slate-500 h-10 text-xs uppercase tracking-widest font-bold"
                        asChild
                      >
                        <Link to={`/workers/${worker.id}`}>
                          View Profile <ArrowRight className="ml-2 h-3 w-3" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredWorkers.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200"
          >
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-slate-100">
              <Search className="h-8 w-8 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No partners found</h3>
            <p className="text-slate-500 max-w-md mx-auto mb-6">
              We couldn't find any field workers matching your criteria. Try adjusting your filters or search terms.
            </p>
            <Button onClick={clearFilters} variant="outline" className="border-slate-300">
              Clear All Filters
            </Button>
          </motion.div>
        )}
      </div>

      {/* --- BOTTOM CTA --- */}
      <section className="bg-white border-t border-slate-100 py-20">
        <div className="container mx-auto px-6 text-center">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-blue-50 text-blue-600 mb-6">
            <Heart className="h-6 w-6 fill-current" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">Can't decide who to support?</h2>
          <p className="text-slate-500 max-w-2xl mx-auto mb-8 text-lg font-light">
            Donate to our <strong>Where Needed Most</strong> fund. We deploy these resources instantly to urgent needs and underfunded partners.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" className="rounded-full px-8 bg-slate-900 hover:bg-slate-800 shadow-xl shadow-slate-900/20" asChild>
              <Link to="/checkout?fund=general">Give to General Fund</Link>
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-8 border-slate-200" asChild>
              <Link to="/our-mission">Learn How We Work</Link>
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
};
