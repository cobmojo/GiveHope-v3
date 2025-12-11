import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "../ui/Dialog";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { Textarea } from "../ui/Textarea";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { stripePromise } from "../../lib/stripe";
import { api } from "../../lib/api";
import { Check, Heart, Loader2, ShieldCheck, ArrowRight, ArrowLeft, Calendar, CreditCard, Lock } from "lucide-react";
import { cn, formatCurrency } from "../../lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface DonateModalProps {
  missionaryId: string;
  missionaryName: string;
  trigger?: React.ReactNode;
}

type DonationFrequency = "one-time" | "monthly";

const PRESET_AMOUNTS = [50, 100, 250, 500];

// Animation variants for smooth step transitions
const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 30 : -30,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 30 : -30,
    opacity: 0,
  }),
};

// Inner form component
const DonationFormContent = ({ 
  missionaryId, 
  missionaryName, 
  onSuccess,
  onClose
}: { 
  missionaryId: string; 
  missionaryName: string;
  onSuccess: () => void;
  onClose: () => void;
}) => {
  const stripe = useStripe();
  const elements = useElements();

  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(0); // for animation direction

  // Form State
  const [amount, setAmount] = useState<number | null>(100);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [frequency, setFrequency] = useState<DonationFrequency>("one-time");
  
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [donorNote, setDonorNote] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getFinalAmount = () => {
    if (amount) return amount;
    const custom = parseFloat(customAmount);
    return !isNaN(custom) && custom > 0 ? custom : null;
  };

  const nextStep = () => {
    setError(null);
    if (step === 1) {
      const finalAmount = getFinalAmount();
      if (!finalAmount || finalAmount <= 0) {
        setError("Please enter a valid donation amount.");
        return;
      }
    } else if (step === 2) {
      if (!donorName.trim() || !donorEmail.trim()) {
        setError("Please provide your name and email.");
        return;
      }
      if (!/^\S+@\S+\.\S+$/.test(donorEmail)) {
        setError("Please enter a valid email address.");
        return;
      }
    }
    setDirection(1);
    setStep(s => s + 1);
  };

  const prevStep = () => {
    setDirection(-1);
    setStep(s => s - 1);
  };

  const handleDonate = async () => {
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    try {
      const finalAmount = getFinalAmount();
      if (!finalAmount) throw new Error("Invalid amount");

      // 1. Create Payment Intent
      const intentData = {
        amount: Math.round(finalAmount * 100), // cents
        currency: "usd",
        name: donorName,
        email: donorEmail,
        note: donorNote,
        missionaryId,
        frequency
      };

      const { id: intentId } = await api.donations.createIntent(intentData);

      // 2. Mock Confirm Card Payment
      // In a real implementation: await stripe.confirmCardPayment(clientSecret, ...)
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) throw new Error("Card element not found");
      
      // Simulate processing time by checking element validity
      // In production, we would use the clientSecret here
      
      // 3. Confirm & Record
      await api.donations.confirm({
        paymentIntentId: intentId,
        ...intentData
      });
      
      onSuccess();

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // --- Step Components ---

  const Step1Amount = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label className="text-base font-semibold text-slate-900">How much would you like to give?</Label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {PRESET_AMOUNTS.map((preset) => (
            <button
              key={preset}
              onClick={() => { setAmount(preset); setCustomAmount(""); setError(null); }}
              className={cn(
                "h-12 rounded-lg border text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1",
                amount === preset 
                  ? "border-primary bg-primary text-primary-foreground shadow-md transform scale-[1.02]" 
                  : "border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-700"
              )}
            >
              ${preset}
            </button>
          ))}
        </div>
        <div className="relative mt-2">
          <span className="absolute left-3 top-2.5 text-slate-400 font-medium">$</span>
          <Input
            type="number"
            placeholder="Enter custom amount"
            className={cn(
              "pl-7 h-11 text-base transition-all bg-white", 
              !amount && customAmount ? "border-primary ring-1 ring-primary bg-primary/5" : ""
            )}
            value={customAmount}
            onChange={(e) => {
              setCustomAmount(e.target.value);
              setAmount(null);
              setError(null);
            }}
          />
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium text-slate-700">Frequency</Label>
        <div className="grid grid-cols-2 gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setFrequency("one-time")}
            className={cn(
              "py-2 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2",
              frequency === "one-time" 
                ? "bg-white text-slate-900 shadow-sm ring-1 ring-black/5" 
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
            )}
          >
            <CreditCard className="h-4 w-4" /> One-Time
          </button>
          <button
            onClick={() => setFrequency("monthly")}
            className={cn(
              "py-2 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2",
              frequency === "monthly" 
                ? "bg-white text-primary shadow-sm ring-1 ring-black/5" 
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
            )}
          >
            <Calendar className="h-4 w-4" /> Monthly
          </button>
        </div>
        {frequency === 'monthly' && (
          <div className="flex items-center justify-center gap-1.5 text-xs text-primary font-medium animate-in fade-in slide-in-from-top-1 bg-primary/5 py-2 rounded-md">
            <Heart className="h-3 w-3 fill-primary" /> Monthly gifts create sustainable impact!
          </div>
        )}
      </div>
    </div>
  );

  const Step2Details = () => (
    <div className="space-y-5">
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input 
            id="name" 
            placeholder="e.g. Jane Doe" 
            value={donorName}
            className="h-11 bg-white"
            autoFocus
            onChange={(e) => { setDonorName(e.target.value); setError(null); }}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="e.g. jane@example.com" 
            value={donorEmail}
            className="h-11 bg-white"
            onChange={(e) => { setDonorEmail(e.target.value); setError(null); }}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="note">Message (Optional)</Label>
          <Textarea 
            id="note" 
            placeholder="Leave a note of encouragement..." 
            className="resize-none min-h-[100px] text-sm bg-white"
            value={donorNote}
            onChange={(e) => setDonorNote(e.target.value)}
          />
        </div>
      </div>
    </div>
  );

  const Step3Payment = () => (
    <div className="space-y-6">
      <div className="bg-slate-50/80 p-5 rounded-xl border border-slate-200 space-y-1">
        <div className="flex justify-between items-baseline">
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Total Gift</p>
          <div className="text-right">
            <span className="text-2xl font-bold text-slate-900 tracking-tight">
              {formatCurrency(getFinalAmount() || 0)}
            </span>
            {frequency === 'monthly' && <span className="text-sm font-medium text-slate-500 ml-1">/ mo</span>}
          </div>
        </div>
        <div className="flex justify-between items-center text-xs text-slate-500 pt-3 mt-3 border-t border-slate-200/60">
          <span>To</span>
          <span className="font-medium text-slate-700">{missionaryName}</span>
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-sm font-medium text-slate-700">Card Information</Label>
        <div className="p-4 border border-slate-200 rounded-lg bg-white shadow-sm focus-within:ring-2 focus-within:ring-primary focus-within:border-primary transition-all">
          <CardElement options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#1e293b',
                fontFamily: '"Inter", sans-serif',
                '::placeholder': { color: '#94a3b8' },
                iconColor: '#64748b',
              },
              invalid: { color: '#ef4444', iconColor: '#ef4444' },
            },
            hidePostalCode: true
          }} />
        </div>
        <div className="flex items-center justify-center gap-2 text-[11px] text-muted-foreground bg-slate-50 py-2 rounded-md border border-slate-100">
          <Lock className="h-3 w-3" />
          <span>Secure SSL Encryption by <strong>Stripe</strong></span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="flex justify-center gap-2 mb-6">
        {[1, 2, 3].map(i => (
          <div 
            key={i} 
            className={cn(
              "h-1.5 rounded-full transition-all duration-300", 
              step >= i ? "w-8 bg-primary" : "w-2 bg-slate-200"
            )} 
          />
        ))}
      </div>

      <div className="min-h-[340px] py-1 relative overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={step}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-full"
          >
            {step === 1 && <Step1Amount />}
            {step === 2 && <Step2Details />}
            {step === 3 && <Step3Payment />}
          </motion.div>
        </AnimatePresence>
      </div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-100 flex items-start gap-2"
        >
          <span className="font-bold shrink-0">Error:</span> {error}
        </motion.div>
      )}

      <DialogFooter className="flex flex-col sm:flex-row gap-3 sm:justify-between pt-4 border-t border-slate-100 mt-2 bg-background z-10 relative">
        {step > 1 ? (
          <Button type="button" variant="ghost" onClick={prevStep} disabled={loading} className="w-full sm:w-auto order-2 sm:order-1 text-slate-500 hover:text-slate-900">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        ) : (
          <Button type="button" variant="ghost" onClick={onClose} className="w-full sm:w-auto order-2 sm:order-1 text-slate-500 hover:text-slate-900">
             Cancel
          </Button>
        )}

        <Button 
          type="button" 
          onClick={step === 3 ? handleDonate : nextStep} 
          disabled={loading}
          className={cn(
            "w-full sm:w-auto order-1 sm:order-2 font-semibold shadow-md transition-all min-w-[120px]",
            step === 3 ? "bg-slate-900 hover:bg-slate-800" : "bg-primary hover:bg-primary/90"
          )}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
            </>
          ) : step === 3 ? (
            <>Pay {formatCurrency(getFinalAmount() || 0)} <Heart className="ml-2 h-4 w-4 fill-red-400 text-red-400" /></>
          ) : (
            <>Next Step <ArrowRight className="ml-2 h-4 w-4" /></>
          )}
        </Button>
      </DialogFooter>
    </>
  );
};

export const DonateModal: React.FC<DonateModalProps> = ({ missionaryId, missionaryName, trigger }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleOpen = () => {
    setSuccess(false);
    setIsOpen(true);
  };

  const handleClose = () => setIsOpen(false);

  // Trigger rendering logic to handle complex components or simple buttons
  const triggerElement = trigger ? (
    React.isValidElement(trigger) ? (
      React.cloneElement(trigger as React.ReactElement<any>, {
        onClick: (e: React.MouseEvent) => {
          const { onClick } = (trigger as React.ReactElement<any>).props;
          if (onClick) onClick(e);
          handleOpen();
        }
      })
    ) : (
      <span onClick={handleOpen} className="cursor-pointer">{trigger}</span>
    )
  ) : (
    <Button onClick={handleOpen} size="lg" className="shadow-lg">Donate Now</Button>
  );

  return (
    <>
      {triggerElement}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px] p-6 gap-0 overflow-hidden transition-all duration-200">
          {!success ? (
            <>
              <DialogHeader className="mb-4">
                <DialogTitle className="text-xl font-bold flex items-center gap-2">
                  Support {missionaryName}
                </DialogTitle>
                <DialogDescription>
                  Your generosity empowers this mission.
                </DialogDescription>
              </DialogHeader>
              <Elements stripe={stripePromise}>
                <DonationFormContent 
                  missionaryId={missionaryId} 
                  missionaryName={missionaryName}
                  onSuccess={() => setSuccess(true)}
                  onClose={handleClose}
                />
              </Elements>
            </>
          ) : (
            <div className="py-12 flex flex-col items-center text-center animate-in zoom-in-95 duration-500 ease-out">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-25" />
                <div className="relative h-24 w-24 bg-green-50 rounded-full flex items-center justify-center border-2 border-green-100 shadow-sm">
                  <Check className="h-12 w-12 text-green-600" strokeWidth={3} />
                </div>
              </div>
              
              <h2 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">Thank You!</h2>
              <p className="text-slate-600 max-w-[280px] mx-auto mb-8 leading-relaxed">
                Your gift to <span className="font-semibold text-slate-900">{missionaryName}</span> has been successfully processed.
              </p>
              
              <div className="flex flex-col gap-3 w-full max-w-xs">
                <Button onClick={handleClose} className="w-full bg-slate-900 hover:bg-slate-800 h-11 font-semibold text-base shadow-md">
                  Done
                </Button>
                <Button variant="outline" className="w-full border-slate-200 text-slate-600 hover:bg-slate-50">
                  View Receipt
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};