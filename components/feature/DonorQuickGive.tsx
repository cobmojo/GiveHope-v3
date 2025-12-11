import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Dialog, 
  DialogContent, 
  DialogTrigger,
  DialogTitle,
  DialogDescription,
  DialogHeader
} from '../ui/Dialog';
import { Button } from '../ui/Button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/Avatar';
import { Heart, Search, ArrowRight, History, Sparkles, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn, formatCurrency } from '../../lib/utils';

// --- Types ---
interface Recipient {
  id: string;
  name: string;
  category: string;
  avatar: string;
  lastGiftDate: string;
  lastGiftAmount: number;
  frequency: string;
}

// --- Mock Data ---
const RECENT_RECIPIENTS: Recipient[] = [
  { 
    id: '1', 
    name: 'The Miller Family', 
    category: 'Missionary', 
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?fit=facearea&facepad=2&w=256&h=256&q=80',
    lastGiftDate: '2 days ago',
    lastGiftAmount: 100,
    frequency: 'Monthly'
  },
  { 
    id: '6', 
    name: 'Clean Water Initiative', 
    category: 'Project', 
    avatar: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=200&auto=format&fit=crop',
    lastGiftDate: '1 week ago',
    lastGiftAmount: 50,
    frequency: 'One-Time'
  },
  { 
    id: '2', 
    name: 'Dr. Sarah Smith', 
    category: 'Medical', 
    avatar: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?fit=facearea&facepad=2&w=256&h=256&q=80',
    lastGiftDate: '1 month ago',
    lastGiftAmount: 200,
    frequency: 'Monthly'
  },
];

// --- Components ---

const QuickGiveRow: React.FC<{ 
  recipient: Recipient; 
  onGive: (id: string, amount: number) => void;
  index: number;
}> = ({ recipient, onGive, index }) => {
  const [amount, setAmount] = useState<string>(recipient.lastGiftAmount.toString());
  const [isFocused, setIsFocused] = useState(false);

  const handleGive = () => {
    const val = parseFloat(amount);
    if (val > 0) {
      onGive(recipient.id, val);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleGive();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 + 0.1, duration: 0.3 }}
      className={cn(
        "group flex items-center justify-between p-3 rounded-2xl border transition-all duration-300",
        isFocused 
          ? "bg-slate-50 border-slate-200 shadow-sm" 
          : "bg-white border-transparent hover:border-slate-100 hover:bg-slate-50/50"
      )}
    >
      {/* Recipient Info */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="relative shrink-0">
          <Avatar className="h-12 w-12 border-2 border-white shadow-sm ring-1 ring-slate-100">
            <AvatarImage src={recipient.avatar} className="object-cover" />
            <AvatarFallback className="bg-slate-100 text-slate-600 font-bold text-xs">{recipient.name[0]}</AvatarFallback>
          </Avatar>
          {/* Recent Indicator */}
          <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm border border-slate-100">
             <div className="bg-emerald-100 p-0.5 rounded-full">
               <History className="h-2.5 w-2.5 text-emerald-600" />
             </div>
          </div>
        </div>
        
        <div className="flex-1 min-w-0 space-y-0.5">
          <h4 className="font-semibold text-slate-900 text-sm truncate leading-tight">{recipient.name}</h4>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="font-medium text-slate-500">{recipient.category}</span>
            <span className="w-0.5 h-0.5 rounded-full bg-slate-300" />
            <span className="truncate">Last: {formatCurrency(recipient.lastGiftAmount)}</span>
          </div>
        </div>
      </div>

      {/* Input Action Area */}
      <div className="flex items-center gap-2 pl-4">
        <div className={cn(
          "relative flex items-center h-10 transition-all duration-300 ease-out rounded-full border",
          isFocused 
            ? "w-28 bg-white border-primary ring-2 ring-primary/20 shadow-sm" 
            : "w-24 bg-slate-100 border-transparent hover:bg-slate-200/70"
        )}>
          <span className={cn(
            "absolute left-3 text-sm font-semibold pointer-events-none transition-colors",
            isFocused ? "text-primary" : "text-muted-foreground"
          )}>$</span>
          
          <input 
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            className="w-full h-full bg-transparent border-none outline-none text-right pr-4 pl-6 text-sm font-bold text-slate-900 placeholder:text-muted-foreground/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            placeholder="0"
          />
        </div>

        <Button 
          size="icon"
          onClick={handleGive}
          className={cn(
            "h-10 w-10 rounded-full shadow-sm transition-all duration-300",
            (isFocused || parseFloat(amount) > 0)
                ? "bg-slate-900 hover:bg-slate-800 text-white hover:scale-105" 
                : "bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600"
          )}
        >
          <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
        </Button>
      </div>
    </motion.div>
  );
};

export const DonorQuickGive = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleGive = (workerId: string, amount: number) => {
    setOpen(false);
    navigate(`/checkout?workerId=${workerId}&amount=${amount}`);
  };

  const handleFindNew = () => {
    setOpen(false);
    navigate('/workers');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          className="bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 shadow-sm h-10 px-5 rounded-full font-bold group transition-all hover:shadow-md hover:border-slate-300"
        >
          <Heart className="mr-2 h-4 w-4 fill-rose-500 text-rose-500 group-hover:scale-110 transition-transform duration-300" /> 
          Quick Give
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[440px] p-0 gap-0 overflow-hidden border border-slate-200 shadow-2xl rounded-3xl bg-background outline-none">
        
        {/* Header */}
        <div className="p-6 pb-2 border-b border-slate-100/50">
          <DialogHeader className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-amber-50 rounded-full flex items-center justify-center border border-amber-100">
                  <Sparkles className="h-5 w-5 text-amber-500 fill-amber-500" />
                </div>
                <div>
                  <DialogTitle className="text-lg font-bold text-slate-900 leading-tight">Give Again</DialogTitle>
                  <p className="text-xs text-muted-foreground font-medium">Quickly repeat a past donation</p>
                </div>
              </div>
              <div className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200/60">
                  {RECENT_RECIPIENTS.length} Active
              </div>
            </div>
            <DialogDescription className="sr-only">
              Choose a recipient to quickly send a new donation.
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* List Content */}
        <div className="p-2 bg-slate-50/30">
          <div className="space-y-1 max-h-[50vh] overflow-y-auto scrollbar-hide p-1">
            {RECENT_RECIPIENTS.map((recipient, idx) => (
              <QuickGiveRow 
                key={recipient.id} 
                index={idx}
                recipient={recipient} 
                onGive={handleGive} 
              />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-slate-100">
            <div 
              onClick={handleFindNew}
              className="bg-slate-50 p-4 rounded-2xl border border-slate-100 cursor-pointer hover:border-slate-300 hover:bg-slate-100 transition-all duration-300 group flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-blue-600 group-hover:border-blue-200 transition-colors shadow-sm">
                    <Search className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors">Find a new cause</p>
                    <p className="text-xs text-muted-foreground">Browse field workers & projects</p>
                  </div>
              </div>
              <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
            </div>
        </div>

      </DialogContent>
    </Dialog>
  );
};
