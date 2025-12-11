
import React from 'react';
import { motion } from 'framer-motion';
import { Target, Users, Shield, Heart } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';

export const About = () => {
  return (
    <div className="bg-slate-50 min-h-screen pt-20">
      
      {/* Header */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03]" 
             style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, black 1px, transparent 0)', backgroundSize: '40px 40px' }} 
        />
        <div className="container mx-auto px-6 max-w-5xl text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <span className="inline-block px-4 py-1.5 rounded-full border border-blue-100 bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-widest">Our Mission</span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-slate-950 text-balance leading-[0.9]">
              Bridging the gap between <br className="hidden md:block" /> compassion and action.
            </h1>
            <p className="text-xl md:text-2xl text-slate-500 leading-relaxed max-w-3xl mx-auto font-light">
              <strong className="text-slate-900 font-semibold">GiveHope</strong> was founded on a simple, uncompromising belief: that geography should not dictate destiny, and that every human being deserves access to dignity, safety, and hope.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Target, title: "Precision", text: "We don't do 'spray and pray' aid. We target specific, verified needs identified by local leaders." },
              { icon: Users, title: "Partnership", text: "We are not the heroes. The locals are. We simply provide the fuel for their engines." },
              { icon: Shield, title: "Integrity", text: "Financial transparency isn't an option; it's our product. You track every dollar." },
              { icon: Heart, title: "Dignity", text: "We serve people, not statistics. Every interaction is rooted in respect and shared humanity." }
            ].map((item, idx) => (
              <Card key={idx} className="border-none shadow-xl shadow-slate-200/50 hover:-translate-y-1 transition-transform duration-300">
                <CardContent className="pt-10 pb-8 px-8">
                  <div className="h-14 w-14 bg-white border border-slate-100 shadow-sm rounded-2xl flex items-center justify-center mb-6 text-slate-900">
                    <item.icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-950 mb-4">{item.title}</h3>
                  <p className="text-slate-600 leading-relaxed">
                    {item.text}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* The Story / Mission */}
      <section className="py-32 bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 z-0">
           <img 
             src="https://images.unsplash.com/photo-1536053468241-7649c0d6628c?q=80&w=2000" 
             className="h-full w-full object-cover grayscale opacity-20 mix-blend-overlay" 
             alt="Background" 
           />
           <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-transparent" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-10 border-l-4 border-emerald-500 pl-8">Our Mission</h2>
            <div className="space-y-8 text-xl md:text-2xl text-slate-300 leading-relaxed font-light">
              <p>
                We refuse to accept a world where preventable suffering is ignored because it is inconvenient or far away.
              </p>
              <p>
                We believe that hope is not a passive emotion, but an active force. It builds wells. It bandages wounds. It teaches children. It rebuilds homes.
              </p>
              <p className="text-white font-medium">
                We are not here to build an empire. We are here to build a network of resilience that spans the globe. When you give to GiveHope, you are not just donating; you are deploying.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold tracking-tighter text-slate-900">Leadership Team</h2>
            <p className="text-xl text-slate-500 mt-4 font-light">Stewarding your generosity with experience and care.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {[
              { name: "Dr. Elena Rostova", role: "Executive Director", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&fit=crop" },
              { name: "Marcus Chen", role: "Director of Field Ops", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=800&fit=crop" },
              { name: "Sarah O'Connell", role: "Head of Finance", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=800&fit=crop" }
            ].map((person, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="relative aspect-[3/4] mb-6 overflow-hidden rounded-2xl bg-slate-100">
                  <img 
                    src={person.img} 
                    alt={person.name} 
                    className="w-full h-full object-cover saturate-[0] contrast-[1.1] transition-all duration-500 group-hover:saturate-[0.8] group-hover:scale-105" 
                  />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{person.name}</h3>
                <p className="text-slate-500 font-medium mt-1">{person.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};
