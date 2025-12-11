


import React from 'react';
import { Button } from '../../components/ui/Button';
import { Link } from 'react-router-dom';
import { ArrowRight, Activity, Users, Globe, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

// Animations
const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

export const Home = () => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      
      {/* --- HERO SECTION --- */}
      <section className="relative h-[100svh] min-h-[700px] flex items-center justify-center overflow-hidden bg-slate-950 text-white">
        {/* Background Image with Cinematic Filter */}
        <div className="absolute inset-0 z-0 select-none">
          <img 
            src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop" 
            alt="Humanitarian Aid" 
            className="w-full h-full object-cover opacity-70 saturate-[0.8] contrast-[1.1]"
          />
          {/* Complex Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 to-transparent" />
        </div>

        <div className="container mx-auto px-6 relative z-10 pt-20">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] as const }}
            className="max-w-5xl space-y-10"
          >
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-xs font-bold tracking-widest uppercase text-white/90">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Response Teams Active: 14 Countries
            </div>
            
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter leading-[0.9] text-balance">
              Hope is a verb. <br/>
              <span className="text-white/40">We put it to work.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-300 max-w-2xl leading-relaxed text-balance font-light">
              We deploy resources to the world's most fractured regions. No red tape. No delays. Just uncompromising aid where it's needed most.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-5 pt-8">
              <Button size="lg" className="bg-white text-slate-950 hover:bg-slate-200 border-none h-16 px-10 text-lg font-bold rounded-full shadow-[0_0_40px_rgba(255,255,255,0.2)] transition-all hover:scale-105" asChild>
                <Link to="/workers">Give Now</Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-white/20 text-white hover:bg-white/10 h-16 px-10 text-lg font-medium rounded-full backdrop-blur-sm transition-all" asChild>
                <Link to="/our-mission">Our Mission</Link>
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/30 flex flex-col items-center gap-3 text-[10px] font-bold tracking-[0.2em] uppercase"
        >
          Scroll
          <div className="w-px h-16 bg-gradient-to-b from-white/0 via-white/30 to-white/0" />
        </motion.div>
      </section>

      {/* --- MISSION SECTION --- */}
      <section className="py-32 bg-white relative">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div {...fadeInUp} className="space-y-10">
              <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-slate-950 leading-[0.95]">
                We don't just send aid. <br/>
                <span className="text-slate-300">We build bridges.</span>
              </h2>
              <div className="space-y-6 text-xl text-slate-600 leading-relaxed font-light">
                <p>
                  In a world of increasing crisis, traditional charity models are too slow. <span className="text-slate-900 font-medium">GiveHope</span> operates on a direct-support model. We identify verified field partners embedded in local communities and route 100% of program donations directly to their hands.
                </p>
                <p>
                  From war-torn cities to drought-stricken villages, we are the logistical backbone for those doing the hard work of restoration.
                </p>
              </div>
              <div className="pt-6">
                <Link to="/our-mission" className="group inline-flex items-center text-sm font-bold text-slate-900 uppercase tracking-widest">
                  <span className="border-b border-slate-950 pb-1 group-hover:border-blue-600 group-hover:text-blue-600 transition-colors">Read Our Mission</span>
                  <ArrowRight className="ml-3 h-4 w-4 group-hover:translate-x-1 transition-transform group-hover:text-blue-600" />
                </Link>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 40 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] as const }}
              className="relative lg:ml-auto"
            >
              <div className="relative z-10 aspect-[4/5] w-full max-w-md rounded-2xl overflow-hidden bg-slate-100 shadow-2xl">
                 <img 
                   src="https://images.unsplash.com/photo-1594708767771-a7502209ff51?q=80&w=2000&auto=format&fit=crop" 
                   alt="Field Work" 
                   className="w-full h-full object-cover saturate-[0.8] contrast-[1.1] transition-transform duration-[2s] hover:scale-105"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
                 
                 <div className="absolute bottom-0 left-0 p-8 text-white">
                    <p className="text-sm font-bold uppercase tracking-widest text-white/60 mb-2">Location</p>
                    <p className="text-2xl font-bold tracking-tight">Bekaa Valley, Lebanon</p>
                 </div>
              </div>
              
              {/* Decorative Element */}
              <div className="absolute -bottom-10 -left-10 w-full h-full border border-slate-200 rounded-2xl -z-10 hidden md:block" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- IMPACT STATS (BENTO) --- */}
      <section className="py-32 bg-slate-950 text-white relative overflow-hidden">
        {/* Subtle pattern */}
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6">
            <div className="space-y-4">
              <span className="text-emerald-400 font-bold tracking-widest uppercase text-sm">Our Impact</span>
              <h2 className="text-5xl md:text-6xl font-bold tracking-tighter">By The Numbers</h2>
            </div>
            <p className="text-slate-400 max-w-md text-lg leading-relaxed">
              Transparency isn't just a buzzword. It's our product. We track every dollar from donation to deployment.
            </p>
          </div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {/* Stat 1 */}
            <motion.div variants={fadeInUp} className="group bg-slate-900/50 border border-white/5 p-10 rounded-3xl hover:bg-slate-800/50 transition-colors hover:border-white/10">
              <Activity className="h-10 w-10 text-emerald-500 mb-8" />
              <div className="text-7xl font-bold mb-4 tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-white/50">$26M+</div>
              <div className="text-xl text-white font-medium mb-2">Deployed in Aid</div>
              <p className="text-slate-500 leading-relaxed">
                Direct funding to critical infrastructure, medical supplies, and food security in the last fiscal year.
              </p>
            </motion.div>

            {/* Stat 2 */}
            <motion.div variants={fadeInUp} className="group bg-slate-900/50 border border-white/5 p-10 rounded-3xl hover:bg-slate-800/50 transition-colors hover:border-white/10">
              <Users className="h-10 w-10 text-blue-500 mb-8" />
              <div className="text-7xl font-bold mb-4 tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-white/50">42k</div>
              <div className="text-xl text-white font-medium mb-2">Monthly Partners</div>
              <p className="text-slate-500 leading-relaxed">
                A global community of sustainers keeping the lights on for our partners every single month.
              </p>
            </motion.div>

            {/* Stat 3 */}
            <motion.div variants={fadeInUp} className="group bg-slate-900/50 border border-white/5 p-10 rounded-3xl hover:bg-slate-800/50 transition-colors hover:border-white/10">
              <Globe className="h-10 w-10 text-purple-500 mb-8" />
              <div className="text-7xl font-bold mb-4 tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-white/50">64</div>
              <div className="text-xl text-white font-medium mb-2">Active Countries</div>
              <p className="text-slate-500 leading-relaxed">
                From Southeast Asia to the Horn of Africa, we are boots-on-the-ground where the need is greatest.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* --- FEATURED WORK --- */}
      <section className="py-32 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-16">
            <div>
              <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">The Frontlines</span>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-slate-900 mt-4">Current Priorities</h2>
            </div>
            <Link to="/workers" className="hidden md:flex items-center text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors uppercase tracking-widest">
              View All Deployments <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                title: "Clean Water Initiative", 
                loc: "Ghana, West Africa", 
                img: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=2000",
                raised: "89%"
              },
              { 
                title: "Refugee Crisis Response", 
                loc: "Lesbos, Greece", 
                img: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=2000",
                raised: "64%"
              },
              { 
                title: "Rural Education Access", 
                loc: "Chiang Mai, Thailand", 
                img: "https://images.unsplash.com/photo-1595053826286-2e59efd9ff18?q=80&w=2000",
                raised: "92%"
              }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="group cursor-pointer"
              >
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-6 bg-slate-200">
                  <img 
                    src={item.img} 
                    alt={item.title} 
                    className="w-full h-full object-cover saturate-[0.8] contrast-[1.1] transition-transform duration-700 group-hover:scale-105" 
                  />
                  <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-transparent transition-colors duration-500" />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-xs font-bold px-3 py-1.5 rounded-full shadow-lg border border-white/50">
                    {item.raised} Funded
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <Globe className="h-3 w-3" /> {item.loc}
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{item.title}</h3>
                  <div className="flex items-center text-sm font-medium text-blue-600 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    Support this Project <ChevronRight className="h-4 w-4 ml-1" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-16 text-center md:hidden">
            <Button variant="outline" className="w-full h-14 rounded-full border-slate-300 text-slate-900 font-bold" asChild>
              <Link to="/workers">View All Deployments</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* --- CTA --- */}
      <section className="py-40 bg-slate-950 relative overflow-hidden text-center flex flex-col items-center justify-center">
         {/* Abstract background shapes */}
         <div className="absolute top-0 left-0 w-full h-full opacity-[0.15] pointer-events-none blur-3xl">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600 rounded-full" />
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-600 rounded-full" />
         </div>
         
         <div className="container mx-auto px-6 relative z-10 max-w-4xl">
           <h2 className="text-5xl md:text-8xl font-bold text-white tracking-tighter mb-8 leading-[0.9]">
             Be the response.
           </h2>
           <p className="text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto mb-12 text-balance font-light leading-relaxed">
             The world doesn't need more pity. It needs action. Join the movement of people refusing to look away.
           </p>
           <Button className="h-16 px-12 rounded-full bg-white text-slate-950 hover:bg-slate-200 text-lg font-bold shadow-[0_0_50px_rgba(255,255,255,0.15)] transition-all hover:scale-105 hover:shadow-[0_0_60px_rgba(255,255,255,0.25)]" asChild>
             <Link to="/workers">Start Giving Today</Link>
           </Button>
         </div>
      </section>
    </div>
  );
};
