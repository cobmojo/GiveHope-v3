
import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, Lock, ShieldCheck, Heart, 
  CreditCard, Calendar, ArrowRight, ArrowLeft, 
  AlertCircle, Info, Sparkles, Loader2, Globe,
  CalendarDays, Clock, ChevronDown, Landmark, Wallet, Building2
} from 'lucide-react';
import { getFieldWorkerById } from '../../lib/mock';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Switch } from '../../components/ui/Switch';
import { Badge } from '../../components/ui/Badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/Avatar';
import { Separator } from '../../components/ui/separator';
import { cn, formatCurrency } from '../../lib/utils';

// --- Types & Constants ---

type Step = 'config' | 'details' | 'payment' | 'success';
type Frequency = 'one-time' | 'monthly';
type PaymentMethod = 'card' | 'ach' | 'wallet';

const PRESET_AMOUNTS = [50, 100, 250, 500];
const STRIPE_FEE_PERCENT = 0.029;
const STRIPE_FEE_FIXED = 0.30;

// --- Helper Functions ---

const formatDatePretty = (dateStr: string) => {
  if (!dateStr) return 'Today';
  const date = new Date(dateStr);
  const today = new Date();
  
  // Reset times for comparison
  date.setHours(0,0,0,0);
  today.setHours(0,0,0,0);
  
  if (date.getTime() === today.getTime()) return 'Today';
  
  return new Intl.DateTimeFormat('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
  }).format(date);
};

// --- Sub-Components ---

const SummaryCard = ({ 
  worker, 
  amount, 
  frequency, 
  coverFees, 
  fees,
  total,
  startDate,
  endDate
}: { 
  worker: any, 
  amount: number, 
  frequency: Frequency, 
  coverFees: boolean, 
  fees: number,
  total: number,
  startDate: string,
  endDate: string | null
}) => {
  const isFutureStart = new Date(startDate).setHours(0,0,0,0) > new Date().setHours(0,0,0,0);
  const dueToday = isFutureStart ? 0 : total;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden sticky top-24">
      <div className="p-6 bg-slate-50/50 border-b border-slate-100">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Donation Summary</h3>
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
            <AvatarImage src={worker?.image} />
            <AvatarFallback>GH</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-xs text-slate-500 font-medium">Supporting</p>
            <p className="font-bold text-slate-900 leading-tight">{worker?.title || 'General Fund'}</p>
          </div>
        </div>
      </div>
      
      <div className="p-6 space-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">Donation Amount</span>
          <span className="font-medium text-slate-900">{formatCurrency(amount)}</span>
        </div>
        
        {coverFees && (
          <div className="flex justify-between text-sm animate-in fade-in slide-in-from-top-1">
            <span className="text-slate-600 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" /> Processing Fees
            </span>
            <span className="font-medium text-slate-600">{formatCurrency(fees)}</span>
          </div>
        )}

        <div className="flex justify-between text-sm items-center">
          <span className="text-slate-600">Frequency</span>
          <Badge variant="outline" className={cn(
            "uppercase text-[10px] tracking-wide",
            frequency === 'monthly' ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-slate-50 text-slate-600"
          )}>
            {frequency}
          </Badge>
        </div>

        {frequency === 'monthly' && (
          <div className="bg-slate-50 rounded-lg p-3 space-y-2 border border-slate-100 text-xs">
             <div className="flex justify-between">
                <span className="text-slate-500">First Gift:</span>
                <span className="font-medium text-slate-900">{formatDatePretty(startDate)}</span>
             </div>
             {endDate ? (
                <div className="flex justify-between">
                  <span className="text-slate-500">Ends:</span>
                  <span className="font-medium text-slate-900">{formatDatePretty(endDate)}</span>
                </div>
             ) : (
                <div className="flex justify-between">
                  <span className="text-slate-500">Duration:</span>
                  <span className="font-medium text-slate-900 flex items-center gap-1">
                    <ArrowRight className="w-3 h-3" /> Ongoing
                  </span>
                </div>
             )}
          </div>
        )}

        <Separator />

        <div className="flex justify-between items-end">
          <span className="font-bold text-slate-900 text-lg">Due Today</span>
          <div className="text-right">
            <span className="font-bold text-2xl text-slate-900 block leading-none">{formatCurrency(dueToday)}</span>
            {isFutureStart && (
               <span className="text-xs text-emerald-600 font-medium block mt-1">
                 Future charge: {formatCurrency(total)}
               </span>
            )}
          </div>
        </div>
      </div>

      <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
        <ShieldCheck className="h-4 w-4 text-emerald-600" />
        <span>Secure 256-bit SSL Encryption</span>
      </div>
    </div>
  );
};

const StepIndicator = ({ currentStep }: { currentStep: Step }) => {
  const steps: Step[] = ['config', 'details', 'payment'];
  const currentIdx = steps.indexOf(currentStep);

  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {steps.map((s, idx) => (
        <div key={s} className="flex items-center">
          <div className={cn(
            "h-2.5 w-2.5 rounded-full transition-all duration-300",
            currentIdx === idx ? "bg-slate-900 w-8" : 
            currentIdx > idx ? "bg-emerald-500" : "bg-slate-200"
          )} />
          {idx < steps.length - 1 && (
            <div className={cn(
              "h-0.5 w-8 mx-2 transition-colors duration-300",
              currentIdx > idx ? "bg-emerald-500" : "bg-slate-100"
            )} />
          )}
        </div>
      ))}
    </div>
  );
};

export const Checkout = () => {
  const [searchParams] = useSearchParams();
  const workerId = searchParams.get('workerId');
  const initialAmount = searchParams.get('amount');
  const worker = workerId ? getFieldWorkerById(workerId) : null;

  // State
  const [step, setStep] = useState<Step>('config');
  const [amount, setAmount] = useState<number>(initialAmount ? Number(initialAmount) : 100);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [frequency, setFrequency] = useState<Frequency>('monthly');
  const [coverFees, setCoverFees] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  
  // Recurring Settings
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [showScheduleConfig, setShowScheduleConfig] = useState(false);
  const [hasEndDate, setHasEndDate] = useState(false);
  const [endDate, setEndDate] = useState<string>("");

  const [donorInfo, setDonorInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });

  // Calculations
  const calculatedFees = useMemo(() => {
    const gross = (amount + STRIPE_FEE_FIXED) / (1 - STRIPE_FEE_PERCENT);
    return gross - amount;
  }, [amount]);

  const total = coverFees ? amount + calculatedFees : amount;

  // Handlers
  const handleAmountSelect = (val: number) => {
    setAmount(val);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    
    // Only allow numbers and one decimal point
    if (val === '' || /^\d*\.?\d{0,2}$/.test(val)) {
      setCustomAmount(val);
      if (val && !isNaN(parseFloat(val))) {
        setAmount(parseFloat(val));
      } else if (val === '') {
        // Fallback to a default or 0 if cleared, but visually keep custom input empty
        // We'll keep amount as 0 to disable next button if needed
        setAmount(0); 
      }
    }
  };

  const handleNext = () => {
    if (step === 'config') setStep('details');
    else if (step === 'details') setStep('payment');
  };

  const handleBack = () => {
    if (step === 'details') setStep('config');
    else if (step === 'payment') setStep('details');
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setStep('success');
    window.scrollTo(0, 0);
  };

  if (!worker && step !== 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h2 className="text-xl font-bold text-slate-900">Campaign Not Found</h2>
          <Link to="/workers" className="text-blue-600 hover:underline mt-2 inline-block">Return to Directory</Link>
        </div>
      </div>
    );
  }

  // --- Success State ---
  if (step === 'success') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white max-w-lg w-full rounded-3xl shadow-xl overflow-hidden text-center"
        >
          <div className="bg-emerald-500 p-10 text-white">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
              <Check className="w-10 h-10 text-white" strokeWidth={3} />
            </div>
            <h1 className="text-3xl font-bold mb-2">Thank You!</h1>
            <p className="text-emerald-100 font-medium text-lg">Your support has been recorded.</p>
          </div>
          
          <div className="p-10 space-y-8">
            <div className="space-y-1">
              <p className="text-slate-500 uppercase tracking-wider text-xs font-bold">Amount Given</p>
              <p className="text-4xl font-bold text-slate-900">{formatCurrency(total)}</p>
              {frequency === 'monthly' && (
                <div className="mt-4 flex flex-col gap-1 items-center">
                  <span className="inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                    Monthly Partner
                  </span>
                  <span className="text-xs text-slate-400">
                    Next gift: {formatDatePretty(new Date(new Date(startDate).setMonth(new Date(startDate).getMonth() + 1)).toISOString())}
                  </span>
                </div>
              )}
            </div>

            <p className="text-slate-600 leading-relaxed">
              A receipt has been sent to <strong>{donorInfo.email}</strong>. 
              Your generosity is making a real difference for {worker?.title || "our mission"}.
            </p>

            <div className="flex flex-col gap-3">
              <Button asChild size="lg" className="w-full bg-slate-900 hover:bg-slate-800 shadow-lg">
                <Link to="/donor-portal">Go to Donor Dashboard</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full">
                <Link to="/">Return Home</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="h-8 w-8 bg-slate-900 text-white rounded-lg flex items-center justify-center font-bold text-sm shadow-sm group-hover:scale-105 transition-transform">GH</div>
            <span className="font-bold text-lg tracking-tight text-slate-900 hidden sm:block">GIVE<span className="font-light opacity-60">HOPE</span></span>
          </Link>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
            <Lock className="w-3 h-3" /> Secure Checkout
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
        
        {step !== 'success' && <StepIndicator currentStep={step} />}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Main Form Area */}
          <div className="lg:col-span-7 space-y-8">
            <AnimatePresence mode="wait">
              
              {/* STEP 1: CONFIGURATION */}
              {step === 'config' && (
                <motion.div 
                  key="config"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Make a Donation</h1>
                    <p className="text-slate-500">Choose your gift amount and frequency.</p>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                    {/* Frequency Toggle */}
                    <div className="flex p-1 bg-slate-100 rounded-xl">
                      <button
                        onClick={() => setFrequency('one-time')}
                        className={cn(
                          "flex-1 py-3 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2",
                          frequency === 'one-time' ? "bg-white text-slate-900 shadow-sm ring-1 ring-black/5" : "text-slate-500 hover:text-slate-700"
                        )}
                      >
                        Give One-Time
                      </button>
                      <button
                        onClick={() => setFrequency('monthly')}
                        className={cn(
                          "flex-1 py-3 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 relative",
                          frequency === 'monthly' ? "bg-white text-blue-600 shadow-sm ring-1 ring-black/5" : "text-slate-500 hover:text-slate-700"
                        )}
                      >
                        <Heart className={cn("w-4 h-4", frequency === 'monthly' ? "fill-blue-600" : "")} /> 
                        Give Monthly
                        {frequency !== 'monthly' && (
                          <span className="absolute -top-3 -right-2 bg-blue-600 text-white text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider animate-bounce">
                            Best Impact
                          </span>
                        )}
                      </button>
                    </div>

                    {/* Amount Grid */}
                    <div className="space-y-3">
                      <Label className="text-slate-700 font-semibold">Select Amount</Label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {PRESET_AMOUNTS.map((val) => (
                          <button
                            key={val}
                            onClick={() => handleAmountSelect(val)}
                            className={cn(
                              "py-4 rounded-xl border-2 font-bold text-lg transition-all duration-200",
                              amount === val && !customAmount
                                ? "border-slate-900 bg-slate-900 text-white shadow-lg scale-[1.02]"
                                : "border-slate-100 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                            )}
                          >
                            ${val}
                          </button>
                        ))}
                      </div>
                      
                      <div className="relative mt-4">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
                        <Input 
                          type="text"
                          inputMode="decimal"
                          placeholder="Enter custom amount"
                          value={customAmount}
                          onChange={handleCustomAmountChange}
                          className={cn(
                            "pl-8 h-14 text-lg font-medium transition-all",
                            customAmount ? "border-slate-900 ring-1 ring-slate-900" : "bg-white"
                          )}
                        />
                      </div>
                    </div>

                    {/* NEW: Monthly Schedule Configuration */}
                    <AnimatePresence>
                      {frequency === 'monthly' && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-4 overflow-hidden"
                        >
                          <div className="bg-blue-50/50 rounded-xl p-5 border border-blue-100">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h4 className="font-bold text-blue-900 text-sm flex items-center gap-2">
                                  <CalendarDays className="w-4 h-4" /> Donation Schedule
                                </h4>
                                <p className="text-xs text-blue-700 mt-1">
                                  Your first gift of <strong>{formatCurrency(total)}</strong> will process 
                                  <strong> {formatDatePretty(startDate)}</strong>.
                                </p>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-7 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                                onClick={() => setShowScheduleConfig(!showScheduleConfig)}
                              >
                                {showScheduleConfig ? 'Done' : 'Change'}
                              </Button>
                            </div>

                            {/* Collapsible Config Area */}
                            <AnimatePresence>
                              {showScheduleConfig && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="space-y-4 pt-2 border-t border-blue-100"
                                >
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Start Date</Label>
                                      <div className="relative">
                                        <Input 
                                          type="date" 
                                          value={startDate}
                                          min={new Date().toISOString().split('T')[0]}
                                          onChange={(e) => setStartDate(e.target.value)}
                                          className="bg-white border-blue-200 focus:border-blue-400 h-10 text-sm"
                                        />
                                        <p className="text-[10px] text-slate-500 mt-1.5 flex items-center gap-1">
                                          <Info className="w-3 h-3" /> Future recurring gifts will occur on this day of the month.
                                        </p>
                                      </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                       <div className="flex items-center justify-between">
                                          <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">End Date</Label>
                                          <div className="flex items-center gap-2">
                                            <Label htmlFor="end-date-toggle" className="text-[10px] text-slate-400 font-normal cursor-pointer">Set limit?</Label>
                                            <Switch 
                                              id="end-date-toggle" 
                                              className="scale-75 origin-right" 
                                              checked={hasEndDate} 
                                              onCheckedChange={(c) => { setHasEndDate(c); if(!c) setEndDate(""); }} 
                                            />
                                          </div>
                                       </div>
                                       {hasEndDate ? (
                                          <Input 
                                            type="date"
                                            value={endDate}
                                            min={startDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                            className="bg-white border-slate-200 h-10 text-sm"
                                          />
                                       ) : (
                                          <div className="h-10 flex items-center px-3 bg-slate-100 rounded-md border border-transparent text-sm text-slate-400 italic">
                                            Ongoing (Recommended)
                                          </div>
                                       )}
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Fee Coverage */}
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex gap-4 items-start cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => setCoverFees(!coverFees)}>
                      <Switch checked={coverFees} onCheckedChange={setCoverFees} className="mt-1 data-[state=checked]:bg-emerald-500" />
                      <div>
                        <p className="font-bold text-slate-900 text-sm">Cover transaction fees</p>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                          Add <strong>{formatCurrency(calculatedFees)}</strong> to your donation to ensure 
                          <span className="font-semibold text-slate-900"> {formatCurrency(amount)} </span> 
                          goes directly to the mission.
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button onClick={handleNext} disabled={amount <= 0} size="lg" className="w-full h-14 text-lg font-bold bg-slate-900 hover:bg-slate-800 shadow-xl rounded-xl">
                    Continue <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
              )}

              {/* STEP 2: DETAILS */}
              {step === 'details' && (
                <motion.div 
                  key="details"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Your Information</h1>
                    <p className="text-slate-500">We need a few details to process your tax receipt.</p>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
                    <div className="grid grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input 
                          id="firstName" 
                          value={donorInfo.firstName}
                          onChange={(e) => setDonorInfo({...donorInfo, firstName: e.target.value})}
                          placeholder="Jane" 
                          className="h-12 bg-slate-50 border-slate-200 focus:bg-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input 
                          id="lastName" 
                          value={donorInfo.lastName}
                          onChange={(e) => setDonorInfo({...donorInfo, lastName: e.target.value})}
                          placeholder="Doe" 
                          className="h-12 bg-slate-50 border-slate-200 focus:bg-white"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email" 
                        type="email"
                        value={donorInfo.email}
                        onChange={(e) => setDonorInfo({...donorInfo, email: e.target.value})}
                        placeholder="jane.doe@example.com" 
                        className="h-12 bg-slate-50 border-slate-200 focus:bg-white"
                      />
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                        <Info className="w-3 h-3" /> Your receipt will be sent here.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button variant="outline" onClick={handleBack} size="lg" className="flex-1 h-14 rounded-xl border-slate-300 text-slate-600 hover:text-slate-900">
                      <ArrowLeft className="mr-2 h-5 w-5" /> Back
                    </Button>
                    <Button 
                      onClick={handleNext} 
                      disabled={!donorInfo.firstName || !donorInfo.lastName || !donorInfo.email} 
                      size="lg" 
                      className="flex-[2] h-14 text-lg font-bold bg-slate-900 hover:bg-slate-800 shadow-xl rounded-xl"
                    >
                      Next: Payment
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: PAYMENT */}
              {step === 'payment' && (
                <motion.div 
                  key="payment"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Payment Details</h1>
                    <p className="text-slate-500">Complete your secure donation.</p>
                  </div>

                  {/* Payment Method Selector */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                    
                    {/* Method Tabs */}
                    <div className="flex p-1 bg-slate-100 rounded-xl">
                      <button
                        onClick={() => setPaymentMethod('card')}
                        className={cn(
                          "flex-1 py-2.5 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2",
                          paymentMethod === 'card' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                        )}
                      >
                        Card
                      </button>
                      <button
                        onClick={() => setPaymentMethod('ach')}
                        className={cn(
                          "flex-1 py-2.5 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 relative",
                          paymentMethod === 'ach' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                        )}
                      >
                        US Bank Transfer
                      </button>
                      <button
                        onClick={() => setPaymentMethod('wallet')}
                        className={cn(
                          "flex-1 py-2.5 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2",
                          paymentMethod === 'wallet' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                        )}
                      >
                        Google Pay
                      </button>
                    </div>

                    <div className="min-h-[280px]">
                      <AnimatePresence mode="wait">
                        
                        {/* --- CREDIT CARD FORM --- */}
                        {paymentMethod === 'card' && (
                          <motion.div 
                            key="card" 
                            initial={{ opacity: 0, y: 10 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-4"
                          >
                            <div className="space-y-2">
                              <Label>Card Information</Label>
                              <div className="border border-slate-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
                                <div className="relative">
                                  <CreditCard className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                                  <Input className="border-none rounded-none h-12 focus-visible:ring-0 pl-10" placeholder="Card number" />
                                </div>
                                <div className="flex border-t border-slate-200">
                                  <Input className="border-none rounded-none h-12 focus-visible:ring-0 px-4 border-r border-slate-200" placeholder="MM / YY" />
                                  <Input className="border-none rounded-none h-12 focus-visible:ring-0 px-4" placeholder="CVC" />
                                </div>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <Label>Cardholder Name</Label>
                              <Input placeholder="Name on card" className="h-12 border-slate-200 bg-slate-50 focus:bg-white" defaultValue={`${donorInfo.firstName} ${donorInfo.lastName}`} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Country</Label>
                                <div className="relative">
                                  <Globe className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                                  <Input defaultValue="United States" className="pl-10 h-12 border-slate-200 bg-slate-50" disabled />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label>Billing Zip</Label>
                                <Input placeholder="12345" className="h-12 border-slate-200 bg-slate-50 focus:bg-white" />
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {/* --- ACH / BANK TRANSFER FORM --- */}
                        {paymentMethod === 'ach' && (
                          <motion.div 
                            key="ach" 
                            initial={{ opacity: 0, y: 10 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-6"
                          >
                            {/* Fee Saver Nudge */}
                            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex gap-3 items-start">
                              <Sparkles className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5 fill-emerald-100" />
                              <div>
                                <h4 className="text-sm font-bold text-emerald-900">Maximize your impact</h4>
                                <p className="text-xs text-emerald-800 leading-relaxed mt-1">
                                  Bank transfers save us ~2.5% in processing fees compared to cards. That means more of your gift goes directly to the field.
                                </p>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <Button 
                                variant="outline" 
                                className="w-full h-16 border-2 border-slate-200 hover:border-slate-800 hover:bg-slate-50 text-slate-700 font-semibold text-lg flex items-center justify-center gap-3 transition-all"
                              >
                                <Landmark className="h-6 w-6" /> Link Bank Account
                              </Button>
                              <p className="text-center text-xs text-slate-400">
                                Securely connect your bank via <span className="font-bold text-slate-500">Stripe Financial Connections</span>.
                              </p>
                            </div>

                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                              <div className="flex gap-3 items-start">
                                <Building2 className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
                                <div className="space-y-1">
                                  <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">ACH Authorization</p>
                                  <p className="text-[10px] text-slate-500 leading-relaxed">
                                    By clicking Pay, you authorize GiveHope to debit the bank account linked above for {formatCurrency(total)} {frequency === 'monthly' ? 'each month' : 'today'}, 
                                    and if necessary, electronically credit your account to correct erroneous debits.
                                  </p>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {/* --- GOOGLE PAY / WALLET FORM --- */}
                        {paymentMethod === 'wallet' && (
                          <motion.div 
                            key="wallet" 
                            initial={{ opacity: 0, y: 10 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            exit={{ opacity: 0, y: -10 }}
                            className="flex flex-col items-center justify-center h-full py-8 space-y-6"
                          >
                            <div className="text-center space-y-2">
                              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Wallet className="h-8 w-8 text-slate-400" />
                              </div>
                              <h3 className="text-lg font-bold text-slate-900">Express Checkout</h3>
                              <p className="text-slate-500 text-sm max-w-xs mx-auto">
                                Use your saved Google Pay payment methods for a faster, secure checkout.
                              </p>
                            </div>

                            <button className="w-full max-w-xs h-12 bg-black text-white rounded-full font-bold flex items-center justify-center gap-2 hover:bg-slate-900 active:scale-95 transition-all shadow-md">
                              <span className="text-lg font-sans">Pay with</span> 
                              <span className="font-bold text-lg flex items-center">
                                <span className="text-blue-400">G</span>
                                <span className="text-red-400">o</span>
                                <span className="text-yellow-400">o</span>
                                <span className="text-blue-400">g</span>
                                <span className="text-green-400">l</span>
                                <span className="text-red-400">e</span>
                                <span className="ml-1.5 text-white">Pay</span>
                              </span>
                            </button>
                            
                            <p className="text-xs text-slate-400">
                              You'll be able to review your order before confirming.
                            </p>
                          </motion.div>
                        )}

                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="flex gap-4">
                    <Button variant="outline" onClick={handleBack} size="lg" className="flex-1 h-14 rounded-xl border-slate-300 text-slate-600 hover:text-slate-900">
                      Back
                    </Button>
                    
                    {/* Pay Button (Hidden for Google Pay as it has its own) */}
                    {paymentMethod !== 'wallet' && (
                      <Button 
                        onClick={handlePayment} 
                        disabled={isProcessing} 
                        size="lg" 
                        className="flex-[2] h-14 text-lg font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all rounded-xl"
                      >
                        {isProcessing ? (
                          <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...</>
                        ) : (
                          <>Pay {formatCurrency(total)}</>
                        )}
                      </Button>
                    )}
                  </div>
                  
                  <p className="text-center text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                    {paymentMethod === 'ach' 
                      ? "ACH payments may take up to 5 business days to clear." 
                      : `By confirming this payment, you authorize GiveHope to charge your account for ${formatCurrency(total)} ${frequency === 'monthly' ? 'on a recurring monthly basis' : 'as a one-time gift'}.`
                    }
                  </p>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-5 hidden lg:block">
            <SummaryCard 
              worker={worker} 
              amount={amount} 
              frequency={frequency} 
              coverFees={coverFees} 
              fees={calculatedFees}
              total={total}
              startDate={startDate}
              endDate={hasEndDate ? endDate : null}
            />
          </div>

        </div>
      </div>
    </div>
  );
};
