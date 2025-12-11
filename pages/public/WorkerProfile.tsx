
import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { getFieldWorkerById } from '../../lib/mock';
import { formatCurrency } from '../../lib/utils';
import { Button } from '../../components/ui/Button';
import { MapPin, ArrowLeft, Share2, ShieldCheck, Heart } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';

export const WorkerProfile = () => {
  const { id } = useParams<{ id: string }>();
  const worker = id ? getFieldWorkerById(id) : undefined;

  if (!worker) {
    return <Navigate to="/workers" replace />;
  }

  const percentRaised = Math.min(100, Math.round((worker.raised / worker.goal) * 100));

  return (
    <div className="min-h-screen bg-background pb-20 pt-20">
      {/* Back Nav */}
      <div className="bg-slate-50 border-b">
        <div className="container mx-auto px-4 py-4">
            <Link to="/workers" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1">
                <ArrowLeft className="h-4 w-4" /> Back to Field Workers
            </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
                <div className="rounded-xl overflow-hidden shadow-sm border bg-card">
                    <img src={worker.image} alt={worker.title} className="w-full h-[400px] object-cover" />
                </div>
                
                <div className="space-y-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                             <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold">{worker.category}</span>
                             <span className="flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3"/> {worker.location}</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{worker.title}</h1>
                        <div className="prose prose-slate max-w-none text-muted-foreground">
                            <p className="text-lg leading-relaxed">{worker.description}</p>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                            </p>
                            <h3 className="text-xl font-semibold text-foreground mt-6 mb-2">Our Mission in {worker.location.split(',')[1] || 'the field'}</h3>
                            <p>
                                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
                                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sidebar Sticky */}
            <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-6">
                    <Card className="border-2 border-primary/5 shadow-lg overflow-hidden relative">
                        <div className="bg-primary/5 p-4 border-b border-primary/10 flex items-center justify-between">
                            <span className="text-sm font-semibold text-primary">Partner With Us</span>
                            <Heart className="h-4 w-4 text-primary fill-primary/20" />
                        </div>
                        <CardContent className="p-6 space-y-6">
                            <div className="space-y-2">
                                <h3 className="font-bold text-xl">{worker.title}</h3>
                                <p className="text-sm text-muted-foreground">Help them reach their goal and continue their work.</p>
                            </div>

                            <div className="space-y-2 pt-2">
                                <div className="flex justify-between items-end">
                                    <span className="text-3xl font-bold text-slate-900">{formatCurrency(worker.raised)}</span>
                                    <span className="text-sm font-medium text-muted-foreground mb-1">of {formatCurrency(worker.goal)}</span>
                                </div>
                                <div className="h-3 w-full bg-secondary rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-primary transition-all duration-1000" 
                                        style={{ width: `${percentRaised}%` }} 
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground text-right">{percentRaised}% funded</p>
                            </div>

                            <div className="grid gap-3">
                                <Button size="lg" className="w-full text-base font-semibold shadow-md bg-primary hover:bg-primary/90 transition-all hover:scale-[1.02]" asChild>
                                  <Link to={`/checkout?workerId=${worker.id}`}>Donate Now</Link>
                                </Button>
                                <Button variant="outline" className="w-full flex items-center gap-2">
                                    <Share2 className="h-4 w-4" /> Share this profile
                                </Button>
                            </div>

                            <div className="flex items-center gap-2 justify-center pt-2 border-t mt-4">
                                <ShieldCheck className="h-4 w-4 text-green-600" />
                                <span className="text-xs text-muted-foreground">Secure SSL Encryption via Stripe</span>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <h4 className="font-semibold text-blue-900 text-sm mb-1">Tax Deductible</h4>
                        <p className="text-xs text-blue-700">
                            GiveHope is a 501(c)(3) organization. Your donation is tax-deductible to the extent allowed by law.
                        </p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
