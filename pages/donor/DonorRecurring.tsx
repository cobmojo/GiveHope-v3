
import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/Avatar';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Slider } from '../../components/ui/Slider'; // Assuming simple slider or using input
import { 
  CreditCard, Calendar, CheckCircle2, 
  MoreVertical, Edit2, PauseCircle, XCircle, ArrowRight, Activity,
  TrendingUp, AlertCircle, History, ChevronRight, ChevronLeft,
  Wallet, ShieldCheck, Heart, Sparkles, Loader2, PlayCircle, Lock,
  X
} from 'lucide-react';
import { formatCurrency, cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from "../../components/ui/Dialog";
import { ScrollArea } from '../../components/ui/ScrollArea';
import { Select } from '../../components/ui/Select';

// --- Mock Data & Types ---

interface PaymentMethod {
  id: string;
  name: string;
  last4: string;
  type: 'card' | 'bank';
  brand: string;
}

interface HistoryItem {
  id: string;
  date: string;
  amount: number;
  status: 'Succeeded' | 'Failed';
}

interface Subscription {
  id: string;
  recipient: string;
  avatar: string;
  initials?: string;
  amount: number;
  frequency: 'Monthly' | 'Weekly' | 'Annually';
  nextDate: string; // ISO string
  paymentMethodId: string;
  status: 'Active' | 'Paused' | 'Processing';
  lifetimeGiven: number;
  startedDate: string;
  category: string;
  history: HistoryItem[];
}

const PAYMENT_METHODS: PaymentMethod[] = [
  { id: 'pm_1', name: 'Visa', last4: '4242', type: 'card', brand: 'visa' },
  { id: 'pm_2', name: 'Chase Bank', last4: '9921', type: 'bank', brand: 'bank' },
];

const INITIAL_SUBSCRIPTIONS: Subscription[] = [
  {
    id: 'sub_1',
    recipient: 'The Miller Family',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?fit=facearea&facepad=2&w=256&h=256&q=80',
    amount: 100,
    frequency: 'Monthly',
    nextDate: '2024-11-01',
    paymentMethodId: 'pm_1',
    status: 'Active',
    lifetimeGiven: 1200,
    startedDate: 'Nov 2023',
    category: 'Missionary Support',
    history: [
      { id: 'h1', date: '2024-10-01', amount: 100, status: 'Succeeded' },
      { id: 'h2', date: '2024-09-01', amount: 100, status: 'Succeeded' },
      { id: 'h3', date: '2024-08-01', amount: 100, status: 'Succeeded' },
    ]
  },
  {
    id: 'sub_2',
    recipient: 'Clean Water Initiative',
    avatar: '',
    initials: 'CW',
    amount: 50,
    frequency: 'Monthly',
    nextDate: '2024-11-15',
    paymentMethodId: 'pm_2',
    status: 'Active',
    lifetimeGiven: 350,
    startedDate: 'Apr 2024',
    category: 'Project Fund',
    history: [
      { id: 'h4', date: '2024-10-15', amount: 50, status: 'Succeeded' },
      { id: 'h5', date: '2024-09-15', amount: 50, status: 'Succeeded' },
    ]
  },
  {
    id: 'sub_3',
    recipient: 'Refugee Crisis Fund',
    avatar: '',
    initials: 'RC',
    amount: 25,
    frequency: 'Monthly',
    nextDate: '2024-11-20',
    paymentMethodId: 'pm_1',
    status: 'Paused',
    lifetimeGiven: 75,
    startedDate: 'Aug 2024',
    category: 'Emergency Relief',
    history: [
      { id: 'h6', date: '2024-08-20', amount: 25, status: 'Succeeded' },
    ]
  }
];

// --- Sub Components ---

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    Active: "bg-emerald-100 text-emerald-800 border-emerald-200",
    Paused: "bg-amber-100 text-amber-800 border-amber-200",
    Processing: "bg-blue-100 text-blue-800 border-blue-200",
    Cancelled: "bg-slate-100 text-slate-600 border-slate-200"
  };
  
  const icons: Record<string, React.ReactNode> = {
    Active: <Activity className="w-3 h-3 mr-1" />,
    Paused: <PauseCircle className="w-3 h-3 mr-1" />,
    Processing: <Loader2 className="w-3 h-3 mr-1 animate-spin" />,
    Cancelled: <XCircle className="w-3 h-3 mr-1" />
  };

  return (
    <Badge variant="outline" className={cn("px-2 py-0.5 text-xs font-semibold border transition-colors duration-300", styles[status] || styles.Cancelled)}>
      {icons[status]} {status}
    </Badge>
  );
};

// --- Main Page ---

export const DonorRecurring: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(INITIAL_SUBSCRIPTIONS);
  const [selectedSub, setSelectedSub] = useState<Subscription | null>(null);
  
  // Computed Metrics
  const totalMonthly = subscriptions
    .filter(s => s.status === 'Active')
    .reduce((acc, curr) => acc + curr.amount, 0);
    
  const nextGift = subscriptions
    .filter(s => s.status === 'Active')
    .sort((a, b) => new Date(a.nextDate).getTime() - new Date(b.nextDate).getTime())[0];

  const handleUpdateSubscription = (updated: Subscription) => {
    setSubscriptions(prev => prev.map(s => s.id === updated.id ? updated : s));
    setSelectedSub(null); // Close modal on save
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-700 pb-20">
      
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-slate-200/60 pb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Your Pledges</h1>
          <p className="text-slate-500 mt-2 text-lg font-light max-w-2xl">
            You are currently empowering <span className="font-semibold text-slate-900">{subscriptions.filter(s => s.status === 'Active').length} missions</span> with predictable, sustaining support.
          </p>
        </div>
        
        {/* Quick Stats */}
        <div className="flex gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm min-w-[160px]">
             <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">
                <Calendar className="w-3.5 h-3.5" /> Monthly Total
             </div>
             <div className="text-2xl font-bold text-slate-900">{formatCurrency(totalMonthly)}</div>
          </div>
          <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 shadow-sm min-w-[160px] hidden sm:block">
             <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" /> Lifetime Impact
             </div>
             <div className="text-2xl font-bold text-emerald-900">
               {formatCurrency(subscriptions.reduce((acc, s) => acc + s.lifetimeGiven, 0))}
             </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-6">
        <AnimatePresence>
          {subscriptions.map((sub, idx) => {
            const daysUntil = Math.ceil((new Date(sub.nextDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
            
            return (
              <motion.div 
                key={sub.id} 
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => setSelectedSub(sub)}
                className="group bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 cursor-pointer overflow-hidden relative"
              >
                {/* Active Indicator Bar */}
                <div className={cn(
                  "absolute top-0 left-0 bottom-0 w-1.5 transition-colors",
                  sub.status === 'Active' ? "bg-emerald-500" : "bg-slate-300"
                )} />

                <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 md:items-center">
                  
                  {/* Left: Identity */}
                  <div className="flex items-center gap-5 flex-1">
                    <Avatar className="h-16 w-16 border-4 border-white shadow-lg rounded-2xl bg-slate-50">
                        <AvatarImage src={sub.avatar} />
                        <AvatarFallback className="text-lg font-bold text-slate-500 bg-slate-100 rounded-2xl">{sub.initials || sub.recipient[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-bold text-xl text-slate-900">{sub.recipient}</h3>
                            <StatusBadge status={sub.status} />
                        </div>
                        <p className="text-sm text-slate-500 font-medium">{sub.category}</p>
                    </div>
                  </div>

                  {/* Middle: Details */}
                  <div className="flex items-center gap-8 md:px-8 md:border-l md:border-r border-slate-100">
                     <div>
                        <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">Amount</p>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold text-slate-900">{formatCurrency(sub.amount)}</span>
                            <span className="text-xs text-slate-500 font-medium">/ mo</span>
                        </div>
                     </div>
                     <div>
                        <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">Next Gift</p>
                        {sub.status === 'Active' ? (
                           <div>
                              <span className="text-sm font-semibold text-slate-900 block">
                                {new Date(sub.nextDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </span>
                              <span className={cn("text-[10px] font-bold", daysUntil <= 3 ? "text-amber-600" : "text-emerald-600")}>
                                {daysUntil === 0 ? 'Today' : `in ${daysUntil} days`}
                              </span>
                           </div>
                        ) : (
                           <span className="text-sm font-medium text-slate-400">--</span>
                        )}
                     </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center justify-between md:justify-end gap-4 min-w-[140px]">
                     <div className="text-right hidden md:block">
                        <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">Total Impact</p>
                        <p className="text-sm font-bold text-slate-900">{formatCurrency(sub.lifetimeGiven)}</p>
                     </div>
                     <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-colors duration-300 shadow-sm">
                        <Edit2 className="w-4 h-4" />
                     </div>
                  </div>

                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* THE PLEDGE EDITOR DIALOG */}
      <ManagePledgeDialog 
        subscription={selectedSub} 
        open={!!selectedSub} 
        onOpenChange={(open) => !open && setSelectedSub(null)}
        onUpdate={handleUpdateSubscription}
      />

    </div>
  );
};

// --- Pledge Editor Component ---

type EditorView = 'HOME' | 'AMOUNT' | 'METHOD' | 'SCHEDULE' | 'HISTORY';

const ManagePledgeDialog = ({ 
  subscription, 
  open, 
  onOpenChange,
  onUpdate
}: { 
  subscription: Subscription | null, 
  open: boolean, 
  onOpenChange: (open: boolean) => void,
  onUpdate: (sub: Subscription) => void
}) => {
  const [view, setView] = useState<EditorView>('HOME');
  const [loading, setLoading] = useState(false);
  
  // Local state for editing
  const [newAmount, setNewAmount] = useState(0);
  const [selectedMethod, setSelectedMethod] = useState('');
  const [newDate, setNewDate] = useState('');

  // Reset state when dialog opens
  useEffect(() => {
    if (subscription) {
      setView('HOME');
      setNewAmount(subscription.amount);
      setSelectedMethod(subscription.paymentMethodId);
      setNewDate(subscription.nextDate);
    }
  }, [subscription, open]);

  if (!subscription) return null;

  const handleSaveAmount = async () => {
    setLoading(true);
    // Simulate API
    await new Promise(r => setTimeout(r, 800));
    onUpdate({ ...subscription, amount: newAmount });
    setLoading(false);
  };

  const handleSaveMethod = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    onUpdate({ ...subscription, paymentMethodId: selectedMethod });
    setLoading(false);
  };

  const handlePause = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    onUpdate({ ...subscription, status: subscription.status === 'Active' ? 'Paused' : 'Active' });
    setLoading(false);
  };

  // --- Views ---

  const HomeView = () => (
    <div className="space-y-6">
       {/* Hero Status */}
       <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex flex-col items-center text-center space-y-2">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Current Pledge</p>
          <div className="flex items-baseline justify-center gap-1">
             <span className="text-4xl font-bold text-slate-900 tracking-tight">{formatCurrency(subscription.amount)}</span>
             <span className="text-lg font-medium text-slate-500">/ mo</span>
          </div>
          <div className="flex items-center gap-2 mt-2">
             <Badge variant="secondary" className="bg-white shadow-sm border-slate-200 text-slate-600">
                Next: {new Date(subscription.nextDate).toLocaleDateString()}
             </Badge>
             {subscription.status === 'Paused' && <Badge variant="destructive">Paused</Badge>}
          </div>
       </div>

       {/* Actions Grid */}
       <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="h-auto py-4 flex flex-col gap-2 bg-white hover:bg-slate-50 border-slate-200" onClick={() => setView('AMOUNT')}>
             <TrendingUp className="h-6 w-6 text-emerald-600" />
             <span className="text-xs font-semibold">Change Amount</span>
          </Button>
          <Button variant="outline" className="h-auto py-4 flex flex-col gap-2 bg-white hover:bg-slate-50 border-slate-200" onClick={() => setView('METHOD')}>
             <CreditCard className="h-6 w-6 text-blue-600" />
             <span className="text-xs font-semibold">Payment Method</span>
          </Button>
          <Button variant="outline" className="h-auto py-4 flex flex-col gap-2 bg-white hover:bg-slate-50 border-slate-200" onClick={() => setView('HISTORY')}>
             <History className="h-6 w-6 text-purple-600" />
             <span className="text-xs font-semibold">View History</span>
          </Button>
          <Button variant="outline" className="h-auto py-4 flex flex-col gap-2 bg-white hover:bg-slate-50 border-slate-200" onClick={handlePause} disabled={loading}>
             {loading ? <Loader2 className="h-6 w-6 animate-spin text-slate-400" /> : 
                subscription.status === 'Active' ? <PauseCircle className="h-6 w-6 text-amber-600" /> : <PlayCircle className="h-6 w-6 text-emerald-600" />
             }
             <span className="text-xs font-semibold">{subscription.status === 'Active' ? 'Pause Pledge' : 'Resume Pledge'}</span>
          </Button>
       </div>

       <div className="pt-2">
          <Button variant="ghost" className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 h-10 text-sm">
             Cancel Subscription
          </Button>
       </div>
    </div>
  );

  const AmountView = () => (
    <div className="space-y-8 py-4">
       <div className="text-center space-y-6">
          <div className="space-y-2">
             <Label className="text-sm font-medium text-slate-500 uppercase tracking-wider">New Monthly Amount</Label>
             <div className="relative flex items-center justify-center">
                <span className="text-4xl font-bold text-slate-300 absolute left-8 md:left-16 top-1/2 -translate-y-1/2">$</span>
                <Input 
                   type="number" 
                   value={newAmount} 
                   onChange={(e) => setNewAmount(Number(e.target.value))}
                   className="text-center text-5xl font-bold h-24 border-none shadow-none focus-visible:ring-0 p-0 bg-transparent"
                />
             </div>
          </div>
          
          <div className="flex justify-center gap-2">
             {[50, 100, 200, 500].map(amt => (
                <button 
                   key={amt}
                   onClick={() => setNewAmount(amt)}
                   className={cn(
                      "px-4 py-2 rounded-full text-sm font-semibold border transition-all",
                      newAmount === amt 
                         ? "bg-slate-900 text-white border-slate-900" 
                         : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                   )}
                >
                   ${amt}
                </button>
             ))}
          </div>
       </div>

       {/* Impact Projection */}
       <div className="bg-indigo-50 rounded-xl p-5 border border-indigo-100 flex items-start gap-4">
          <div className="p-2 bg-indigo-100 rounded-full text-indigo-600 shrink-0">
             <Sparkles className="h-5 w-5" />
          </div>
          <div>
             <h4 className="font-bold text-indigo-900 text-sm">Projected Annual Impact</h4>
             <p className="text-xs text-indigo-700 mt-1 leading-relaxed">
                By updating your pledge to <strong>{formatCurrency(newAmount)}/mo</strong>, you will contribute <strong>{formatCurrency(newAmount * 12)}</strong> over the next year to support {subscription.recipient}.
             </p>
          </div>
       </div>

       <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={() => setView('HOME')}>Cancel</Button>
          <Button className="flex-1 bg-slate-900" onClick={handleSaveAmount} disabled={loading || newAmount <= 0}>
             {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
             Update Pledge
          </Button>
       </div>
    </div>
  );

  const MethodView = () => (
     <div className="space-y-6 py-2">
        <div className="space-y-4">
           {PAYMENT_METHODS.map(method => (
              <div 
                 key={method.id}
                 onClick={() => setSelectedMethod(method.id)}
                 className={cn(
                    "flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all relative",
                    selectedMethod === method.id 
                       ? "border-blue-600 bg-blue-50/50" 
                       : "border-slate-100 hover:border-slate-200 bg-white"
                 )}
              >
                 <div className="h-10 w-14 bg-white border border-slate-200 rounded-md flex items-center justify-center shrink-0">
                    {method.type === 'card' ? <CreditCard className="h-5 w-5 text-slate-600" /> : <Wallet className="h-5 w-5 text-slate-600" />}
                 </div>
                 <div className="flex-1">
                    <p className="font-bold text-sm text-slate-900">{method.name} •••• {method.last4}</p>
                    <p className="text-xs text-slate-500 capitalize">{method.brand} {method.type}</p>
                 </div>
                 {selectedMethod === method.id && (
                    <div className="h-6 w-6 bg-blue-600 rounded-full flex items-center justify-center text-white">
                       <CheckCircle2 className="h-4 w-4" />
                    </div>
                 )}
              </div>
           ))}
           
           <Button variant="ghost" className="w-full border border-dashed border-slate-300 text-slate-500 hover:text-slate-900 hover:border-slate-400 h-12">
              + Add New Payment Method
           </Button>
        </div>

        <div className="flex gap-3 pt-4">
          <Button variant="outline" className="flex-1" onClick={() => setView('HOME')}>Cancel</Button>
          <Button className="flex-1 bg-slate-900" onClick={handleSaveMethod} disabled={loading}>
             {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
             Confirm Change
          </Button>
       </div>
     </div>
  );

  const HistoryView = () => (
     <div className="space-y-6">
        <ScrollArea className="h-[300px] pr-4">
           <div className="space-y-4">
              {subscription.history.map(item => (
                 <div key={item.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                       <div className={cn(
                          "h-8 w-8 rounded-full flex items-center justify-center",
                          item.status === 'Succeeded' ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"
                       )}>
                          {item.status === 'Succeeded' ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                       </div>
                       <div>
                          <p className="text-sm font-bold text-slate-900">{formatCurrency(item.amount)}</p>
                          <p className="text-xs text-slate-500">{new Date(item.date).toLocaleDateString()}</p>
                       </div>
                    </div>
                    <Badge variant="outline" className="text-[10px]">{item.status}</Badge>
                 </div>
              ))}
           </div>
        </ScrollArea>
        <Button variant="outline" className="w-full" onClick={() => setView('HOME')}>
           Back to Overview
        </Button>
     </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] p-0 gap-0 overflow-hidden shadow-2xl border-slate-200">
         {/* Dialog Header with Dynamic Context */}
         <div className="bg-slate-50/80 backdrop-blur-sm border-b border-slate-100 p-6 pb-4">
            <div className="flex items-center gap-4 mb-2">
               <Button variant="ghost" size="icon" className="h-8 w-8 -ml-2 rounded-full" onClick={() => view === 'HOME' ? onOpenChange(false) : setView('HOME')}>
                  {view === 'HOME' ? <X className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
               </Button>
               <div className="flex-1 text-center pr-6">
                  <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
                     {view === 'HOME' ? 'Manage Pledge' : view === 'AMOUNT' ? 'Update Amount' : view === 'METHOD' ? 'Payment Method' : 'History'}
                  </h3>
               </div>
            </div>
            <div className="flex items-center gap-3 justify-center">
               <Avatar className="h-8 w-8 border border-white shadow-sm">
                  <AvatarImage src={subscription.avatar} />
                  <AvatarFallback>{subscription.initials}</AvatarFallback>
               </Avatar>
               <span className="text-sm font-medium text-slate-600">{subscription.recipient}</span>
            </div>
         </div>

         {/* Animated Content Area */}
         <div className="p-6 bg-white min-h-[400px]">
            <AnimatePresence mode="wait">
               <motion.div
                  key={view}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
               >
                  {view === 'HOME' && <HomeView />}
                  {view === 'AMOUNT' && <AmountView />}
                  {view === 'METHOD' && <MethodView />}
                  {view === 'HISTORY' && <HistoryView />}
               </motion.div>
            </AnimatePresence>
         </div>
         
         {view === 'HOME' && (
            <div className="bg-slate-50 p-3 text-center border-t border-slate-100">
               <p className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
                  <ShieldCheck className="h-3 w-3" /> Secure SSL Encryption
               </p>
            </div>
         )}
      </DialogContent>
    </Dialog>
  );
};
