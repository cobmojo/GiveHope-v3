
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Badge } from '../../components/ui/Badge';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter 
} from '../../components/ui/Dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/Tabs';
import { 
  CreditCard, Plus, Trash2, 
  AlertCircle, ArrowRightLeft,
  MoreHorizontal, Wallet, 
  Landmark, Sparkles, X, Check,
  Lock, ShieldCheck, Wifi, Edit2, MapPin, ArrowDown,
  Calendar, Building2, User
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn, formatCurrency } from '../../lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/DropdownMenu";

// --- Types & Mock Data ---

interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank';
  brand: 'visa' | 'mastercard' | 'amex' | 'discover' | 'bank';
  last4: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
  holderName?: string;
  bankName?: string; // For ACH
  color?: string; // Optional custom gradient class
  billingAddress: Address;
}

interface Pledge {
  id: string;
  name: string;
  amount: number;
  frequency: string;
  paymentMethodId: string;
  avatar?: string;
}

const MOCK_ADDRESS: Address = {
  street: '123 Mission Way',
  city: 'San Francisco',
  state: 'CA',
  zip: '94105',
  country: 'US'
};

const MOCK_METHODS: PaymentMethod[] = [
  { 
    id: 'pm_1', 
    type: 'card', 
    brand: 'visa', 
    last4: '4242', 
    expiryMonth: 12, 
    expiryYear: 2026, 
    isDefault: true, 
    holderName: 'JOHN DOE', 
    color: 'from-slate-900 to-slate-800',
    billingAddress: MOCK_ADDRESS
  },
  { 
    id: 'pm_2', 
    type: 'bank', 
    brand: 'bank', 
    last4: '6789', 
    isDefault: false, 
    holderName: 'JOHN DOE', 
    bankName: 'Chase Checking',
    color: 'from-emerald-600 to-teal-800',
    billingAddress: { ...MOCK_ADDRESS, street: '456 Market St' }
  },
];

const MOCK_PLEDGES: Pledge[] = [
  { id: 'sub_1', name: 'The Miller Family', amount: 100, frequency: 'Monthly', paymentMethodId: 'pm_1', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?fit=facearea&facepad=2&w=64&h=64&q=80' },
  { id: 'sub_2', name: 'Clean Water Initiative', amount: 50, frequency: 'Monthly', paymentMethodId: 'pm_1', avatar: '' },
  { id: 'sub_3', name: 'General Fund', amount: 25, frequency: 'Monthly', paymentMethodId: 'pm_2', avatar: '' },
];

// --- Visual Components ---

const VisualCard = ({ method, pledgeCount }: { method: PaymentMethod, pledgeCount: number }) => {
  const isBank = method.type === 'bank';
  
  const getBgStyle = () => {
    if (isBank) return "bg-gradient-to-br from-emerald-600 to-teal-800 text-white border-transparent";
    if (method.color) return `bg-gradient-to-br ${method.color} text-white border-transparent`;
    return "bg-gradient-to-br from-gray-700 to-gray-900 text-white border-transparent";
  };

  return (
    <div className={cn(
      "relative rounded-2xl p-6 aspect-[1.586/1] flex flex-col justify-between overflow-hidden shadow-2xl transition-transform duration-500 border select-none group-hover:scale-[1.02]", 
      getBgStyle()
    )}>
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
      <div className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-gradient-to-br from-white/20 to-transparent rotate-45 pointer-events-none" />

      <div className="flex justify-between items-start z-10">
        {isBank ? (
           <div className="flex items-center gap-2">
             <div className="bg-white/20 p-1.5 rounded-md backdrop-blur-sm border border-white/10">
                <Landmark className="h-5 w-5 text-white" />
             </div>
             <span className="font-bold text-xs tracking-wider uppercase opacity-90">ACH Direct Debit</span>
           </div>
        ) : (
           <div className="w-12 h-9 rounded-md bg-gradient-to-br from-yellow-200 to-yellow-400/80 shadow-inner flex items-center justify-between px-1.5 relative overflow-hidden border border-yellow-500/20">
             <div className="w-full h-[1px] bg-yellow-600/20 absolute top-1/2 -translate-y-1/2" />
             <div className="w-[1px] h-full bg-yellow-600/20 absolute left-1/2 -translate-x-1/2" />
             <Wifi className="h-4 w-4 text-yellow-700/40 rotate-90" />
           </div>
        )}
        <span className="font-bold text-lg italic opacity-90 uppercase tracking-widest drop-shadow-md">
          {method.brand === 'bank' ? 'BANK' : method.brand}
        </span>
      </div>

      <div className="z-10 space-y-4">
        <div className="flex gap-3 items-center pl-1">
           {isBank ? (
             <span className="text-lg tracking-widest font-mono opacity-80">ACCOUNT</span>
           ) : (
             <>
               <span className="text-xl tracking-widest font-mono opacity-60">••••</span>
               <span className="text-xl tracking-widest font-mono opacity-60">••••</span>
               <span className="text-xl tracking-widest font-mono opacity-60">••••</span>
             </>
           )}
           <span className="font-mono text-xl tracking-widest font-medium drop-shadow-sm">{method.last4}</span>
        </div>

        <div className="flex justify-between items-end">
           <div className="space-y-0.5">
              <p className="text-[8px] uppercase tracking-wider opacity-60 font-bold">{isBank ? 'Account Name' : 'Card Holder'}</p>
              <p className="text-sm font-medium tracking-wider uppercase truncate max-w-[150px] drop-shadow-sm">
                {isBank ? (method.bankName || 'Checking') : (method.holderName || 'John Doe')}
              </p>
           </div>
           {!isBank && method.expiryMonth && (
             <div className="space-y-0.5 text-right">
                <p className="text-[8px] uppercase tracking-wider opacity-60 font-bold">Expires</p>
                <p className="text-sm font-medium tracking-widest drop-shadow-sm">
                  {method.expiryMonth.toString().padStart(2, '0')}/{method.expiryYear?.toString().slice(-2)}
                </p>
             </div>
           )}
        </div>
      </div>
      
      {pledgeCount > 0 && (
        <div className="absolute top-6 right-1/2 translate-x-1/2 bg-black/20 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-bold border border-white/10 flex items-center gap-1.5 shadow-lg text-white/90">
           <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
           {pledgeCount} ACTIVE
        </div>
      )}
    </div>
  );
};

const SelectionList = ({ 
  methods, 
  selectedId, 
  onSelect 
}: { 
  methods: PaymentMethod[], 
  selectedId: string, 
  onSelect: (id: string) => void 
}) => {
  return (
    <div className="space-y-3">
      {methods.map(method => {
        const isSelected = selectedId === method.id;
        return (
          <motion.div
            key={method.id}
            layout
            onClick={() => onSelect(method.id)}
            className={cn(
              "relative flex items-center gap-4 p-4 rounded-xl border transition-all overflow-hidden group cursor-pointer",
              isSelected 
                ? "border-blue-600 bg-blue-50/50 shadow-sm ring-1 ring-blue-600" 
                : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
            )}
          >
            <div className={cn(
              "w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors",
              isSelected ? "border-blue-600 bg-blue-600 text-white" : "border-slate-300 bg-white group-hover:border-slate-400"
            )}>
              {isSelected && <Check className="w-3 h-3" strokeWidth={3} />}
            </div>

            <div className="h-10 w-14 bg-white border border-slate-200 rounded-md flex items-center justify-center shrink-0 shadow-sm">
              {method.type === 'card' ? (
                <CreditCard className="h-5 w-5 text-slate-700" />
              ) : (
                <Landmark className="h-5 w-5 text-emerald-600" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-bold text-sm text-slate-900">
                  {method.type === 'bank' ? (method.bankName || 'Bank Account') : method.brand.toUpperCase()}
                </p>
                {method.isDefault && <Badge variant="secondary" className="text-[9px] px-1.5 h-4 bg-slate-100 border-slate-200">Default</Badge>}
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {method.type === 'bank' ? 'Checking' : 'Ending'} •••• {method.last4}
                {method.expiryMonth && <span className="ml-2 opacity-50 border-l border-slate-300 pl-2">Exp {method.expiryMonth}/{method.expiryYear?.toString().slice(-2)}</span>}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

// --- Main Page Component ---

export const DonorWallet: React.FC = () => {
  const [methods, setMethods] = useState<PaymentMethod[]>(MOCK_METHODS);
  const [pledges, setPledges] = useState<Pledge[]>(MOCK_PLEDGES);
  
  const [isMethodModalOpen, setIsMethodModalOpen] = useState(false);
  const [isMovePledgesOpen, setIsMovePledgesOpen] = useState(false);
  const [isSwapPledgeOpen, setIsSwapPledgeOpen] = useState(false);
  const [showACHNudge, setShowACHNudge] = useState(true);
  
  const [methodToDelete, setMethodToDelete] = useState<string | null>(null);
  const [targetMethodId, setTargetMethodId] = useState<string>('');
  const [pledgeToSwap, setPledgeToSwap] = useState<Pledge | null>(null);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);
  const [activeTab, setActiveTab] = useState<'card' | 'bank'>('card');
  
  const initialFormState = {
    number: '', expiry: '', cvc: '', name: '', routing: '', account: '',
    address: { street: '', city: '', state: '', zip: '', country: 'US' }
  };
  const [formData, setFormData] = useState(initialFormState);

  const openAddModal = () => {
    setEditingMethod(null);
    setFormData(initialFormState);
    setActiveTab('card');
    setIsMethodModalOpen(true);
  };

  const openEditModal = (method: PaymentMethod) => {
    setEditingMethod(method);
    setActiveTab(method.type);
    setFormData({
      number: `•••• •••• •••• ${method.last4}`,
      expiry: method.type === 'card' ? `${method.expiryMonth?.toString().padStart(2, '0')}/${method.expiryYear?.toString().slice(-2)}` : '',
      cvc: '•••',
      name: method.holderName || '',
      routing: method.type === 'bank' ? '•••••••••' : '',
      account: method.type === 'bank' ? `••••••••${method.last4}` : '',
      address: method.billingAddress
    });
    setIsMethodModalOpen(true);
  };

  const handleSaveMethod = () => {
    if (editingMethod) {
      setMethods(prev => prev.map(m => m.id === editingMethod.id ? {
        ...m,
        holderName: formData.name.toUpperCase(),
        expiryMonth: (formData.expiry && formData.expiry.length === 5) ? parseInt(formData.expiry.split('/')[0]) : m.expiryMonth,
        expiryYear: (formData.expiry && formData.expiry.length === 5) ? 2000 + parseInt(formData.expiry.split('/')[1]) : m.expiryYear,
        billingAddress: formData.address
      } : m));
    } else {
      const isBank = activeTab === 'bank';
      const last4 = isBank ? formData.account.slice(-4) : formData.number.replace(/\s/g, '').slice(-4);
      const newMethod: PaymentMethod = {
        id: `pm_${Date.now()}`,
        type: activeTab,
        brand: isBank ? 'bank' : (formData.number.startsWith('5') ? 'mastercard' : 'visa'),
        last4: last4 || '1234',
        expiryMonth: isBank ? undefined : 12,
        expiryYear: isBank ? undefined : 2028,
        holderName: formData.name.toUpperCase() || 'JOHN DOE',
        isDefault: methods.length === 0,
        bankName: isBank ? 'Chase Checking' : undefined,
        color: isBank ? undefined : (formData.number.startsWith('5') ? 'from-indigo-600 to-purple-700' : 'from-slate-900 to-slate-800'),
        billingAddress: formData.address
      };
      setMethods([...methods, newMethod]);
    }
    setIsMethodModalOpen(false);
  };

  const handleSetDefault = (id: string) => {
    setMethods(methods.map(m => ({ ...m, isDefault: m.id === id })));
  };

  const handleDeleteRequest = (id: string) => {
    const attachedPledges = pledges.filter(p => p.paymentMethodId === id);
    if (attachedPledges.length > 0) {
      setMethodToDelete(id);
      setTargetMethodId('');
      setIsMovePledgesOpen(true);
    } else {
      setMethods(methods.filter(m => m.id !== id));
    }
  };

  const executeMoveAndDelete = () => {
    if (!methodToDelete || !targetMethodId) return;
    setPledges(pledges.map(p => 
      p.paymentMethodId === methodToDelete ? { ...p, paymentMethodId: targetMethodId } : p
    ));
    setMethods(methods.filter(m => m.id !== methodToDelete));
    setIsMovePledgesOpen(false);
    setMethodToDelete(null);
  };

  const handleSwapClick = (pledge: Pledge) => {
    setPledgeToSwap(pledge);
    setTargetMethodId('');
    setIsSwapPledgeOpen(true);
  };

  const executeSwapPledge = () => {
    if (!pledgeToSwap || !targetMethodId) return;
    setPledges(pledges.map(p => 
        p.id === pledgeToSwap.id ? { ...p, paymentMethodId: targetMethodId } : p
    ));
    setIsSwapPledgeOpen(false);
    setPledgeToSwap(null);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-24">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-1">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">Wallet</h1>
          <p className="text-slate-500 mt-2 text-lg">Manage your payment methods and subscriptions securely.</p>
        </div>
        <Button onClick={openAddModal} className="bg-slate-900 hover:bg-slate-800 text-white shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all h-12 px-6 font-bold rounded-full">
           <Plus className="mr-2 h-5 w-5" /> Add Payment Method
        </Button>
      </div>

      <AnimatePresence>
        {showACHNudge && (
          <motion.div 
            initial={{ opacity: 0, height: 0, scale: 0.95 }}
            animate={{ opacity: 1, height: 'auto', scale: 1 }}
            exit={{ opacity: 0, height: 0, scale: 0.95 }}
            className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-3xl p-6 relative overflow-hidden shadow-sm group"
          >
             <div className="absolute top-4 right-4 z-20">
                <button onClick={() => setShowACHNudge(false)} className="p-1 rounded-full bg-white/50 hover:bg-white text-emerald-700 transition-colors"><X className="h-4 w-4" /></button>
             </div>
             <div className="flex gap-5 items-start relative z-10">
                <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-md shrink-0 border border-emerald-50 group-hover:scale-110 transition-transform duration-500">
                   <Landmark className="h-6 w-6" />
                </div>
                <div>
                   <h3 className="font-bold text-emerald-950 text-lg">Maximize your impact with ACH</h3>
                   <p className="text-emerald-800/80 mt-2 max-w-2xl text-sm leading-relaxed">
                      Credit card processing fees cost nonprofits ~2.5% per donation. Switching to a direct bank transfer (ACH) lowers this to nearly zero, meaning <strong>more of your gift goes directly to the field.</strong>
                   </p>
                   <Button variant="link" onClick={() => { openAddModal(); setActiveTab('bank'); }} className="p-0 h-auto text-emerald-700 font-bold mt-3 text-sm hover:text-emerald-900 flex items-center gap-1 group/btn">
                      Add Bank Account <ArrowRightLeft className="ml-1 h-3 w-3 group-hover/btn:translate-x-1 transition-transform" />
                   </Button>
                </div>
             </div>
             <div className="absolute -bottom-12 -right-12 opacity-[0.08] pointer-events-none">
                <Sparkles className="h-64 w-64 text-emerald-900" />
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-8">
         {methods.length === 0 && (
            <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
               <div className="h-20 w-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <Wallet className="h-10 w-10 text-slate-300" />
               </div>
               <h3 className="text-xl font-bold text-slate-900 mb-2">No payment methods yet</h3>
               <p className="text-slate-500 mb-6">Add a card or bank account to start giving.</p>
               <Button variant="outline" onClick={openAddModal}>Add Method</Button>
            </div>
         )}

         <AnimatePresence mode='popLayout'>
            {methods.map((method, idx) => {
               const attachedPledges = pledges.filter(p => p.paymentMethodId === method.id);
               return (
                  <motion.div 
                     layout
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, scale: 0.95 }}
                     transition={{ duration: 0.4, delay: idx * 0.1 }}
                     key={method.id}
                     className="group bg-white rounded-[2rem] border border-slate-200 p-2 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden"
                  >
                     <div className="flex flex-col lg:flex-row gap-8 p-6 lg:p-8">
                        <div className="w-full lg:w-[340px] shrink-0 self-start">
                           <VisualCard method={method} pledgeCount={attachedPledges.length} />
                        </div>

                        <div className="flex-1 flex flex-col min-w-0">
                           <div className="flex items-start justify-between mb-6">
                              <div>
                                 <div className="flex items-center gap-3 mb-1.5">
                                    <h3 className="text-2xl font-bold text-slate-900 capitalize tracking-tight">
                                       {method.bankName || `${method.brand} •••• ${method.last4}`}
                                    </h3>
                                    {method.isDefault && (
                                       <Badge className="bg-blue-50 text-blue-700 border-blue-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider hover:bg-blue-50 shadow-sm">
                                          Default
                                       </Badge>
                                    )}
                                 </div>
                                 <p className="text-slate-500 font-medium">
                                    {method.type === 'bank' ? 'Direct Debit (ACH)' : `Expires ${method.expiryMonth}/${method.expiryYear}`}
                                 </p>
                              </div>
                              
                              <DropdownMenu>
                                 <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full">
                                       <MoreHorizontal className="h-5 w-5" />
                                    </Button>
                                 </DropdownMenuTrigger>
                                 <DropdownMenuContent align="end" className="w-56 p-2 rounded-xl">
                                    <DropdownMenuLabel className="text-xs text-slate-400 uppercase tracking-wider font-bold px-2 py-1.5">Manage Method</DropdownMenuLabel>
                                    <DropdownMenuSeparator className="my-1" />
                                    {!method.isDefault && (
                                       <DropdownMenuItem onClick={() => handleSetDefault(method.id)} className="rounded-lg cursor-pointer font-medium">Set as Default</DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem onClick={() => openEditModal(method)} className="rounded-lg cursor-pointer font-medium">
                                       <Edit2 className="mr-2 h-4 w-4" /> Edit Details
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className="my-1" />
                                    <DropdownMenuItem onClick={() => handleDeleteRequest(method.id)} className="text-red-600 focus:text-red-600 focus:bg-red-50 rounded-lg cursor-pointer font-medium group">
                                       <Trash2 className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" /> Remove
                                    </DropdownMenuItem>
                                 </DropdownMenuContent>
                              </DropdownMenu>
                           </div>

                           <div className="mb-6 flex gap-3 items-start">
                              <div className="p-1.5 bg-slate-50 rounded-md text-slate-400 mt-0.5">
                                <MapPin className="h-4 w-4" />
                              </div>
                              <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Billing Address</p>
                                <p className="text-sm font-medium text-slate-700 leading-snug">
                                  {method.billingAddress.street}<br/>
                                  {method.billingAddress.city}, {method.billingAddress.state} {method.billingAddress.zip}
                                </p>
                              </div>
                           </div>

                           <div className="mt-auto pt-6 border-t border-slate-100">
                              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                 Connected Impact <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[10px] min-w-[20px] text-center">{attachedPledges.length}</span>
                              </p>
                              
                              {attachedPledges.length > 0 ? (
                                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {attachedPledges.map(pledge => (
                                       <div key={pledge.id} className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50/80 border border-slate-100 hover:border-slate-300 hover:bg-white transition-all group/pledge cursor-default shadow-sm hover:shadow-md">
                                          {pledge.avatar ? (
                                             <img src={pledge.avatar} alt="" className="h-10 w-10 rounded-full object-cover bg-white ring-2 ring-white shadow-sm" />
                                          ) : (
                                             <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-slate-400 text-xs font-bold ring-2 ring-white shadow-sm">GH</div>
                                          )}
                                          <div className="flex-1 min-w-0">
                                             <p className="text-sm font-bold text-slate-900 truncate">{pledge.name}</p>
                                             <p className="text-xs text-slate-500 font-medium">{formatCurrency(pledge.amount)} / {pledge.frequency}</p>
                                          </div>
                                          <div className="opacity-0 group-hover/pledge:opacity-100 transition-opacity">
                                             <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full" 
                                                title="Move Pledge"
                                                onClick={() => handleSwapClick(pledge)}
                                             >
                                                <ArrowRightLeft className="h-4 w-4" />
                                             </Button>
                                          </div>
                                       </div>
                                    ))}
                                 </div>
                              ) : (
                                 <div className="flex items-center gap-3 text-sm text-slate-500 italic bg-slate-50/50 p-4 rounded-xl border border-dashed border-slate-200">
                                    <div className="p-2 bg-white rounded-full shadow-sm"><Wallet className="h-4 w-4 text-slate-400" /></div>
                                    No active pledges linked to this method.
                                 </div>
                              )}
                           </div>
                        </div>
                     </div>
                  </motion.div>
               );
            })}
         </AnimatePresence>
      </div>

      {/* --- ADD/EDIT METHOD MODAL --- */}
      <Dialog open={isMethodModalOpen} onOpenChange={setIsMethodModalOpen}>
         <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden gap-0 rounded-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader className="p-8 pb-4 bg-white border-b border-slate-100 sticky top-0 z-10">
               <DialogTitle className="text-2xl font-bold tracking-tight">
                  {editingMethod ? `Edit ${editingMethod.type === 'card' ? 'Credit Card' : 'Bank Account'}` : 'Add Payment Method'}
               </DialogTitle>
               <DialogDescription className="text-base">
                  {editingMethod ? 'Update details and billing address below.' : 'Securely add a new card or bank account.'}
               </DialogDescription>
            </DialogHeader>
            
            <div className="p-8 bg-slate-50/50">
               {!editingMethod ? (
                  <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
                     <TabsList className="grid w-full grid-cols-2 mb-8 bg-white p-1 rounded-xl shadow-sm border border-slate-200 h-12">
                        <TabsTrigger value="card" className="rounded-lg font-bold data-[state=active]:bg-slate-900 data-[state=active]:text-white transition-all">Credit Card</TabsTrigger>
                        <TabsTrigger value="bank" className="rounded-lg font-bold data-[state=active]:bg-slate-900 data-[state=active]:text-white transition-all">Bank Account</TabsTrigger>
                     </TabsList>

                     <TabsContent value="card" className="space-y-6 mt-0 focus-visible:outline-none">
                        <CardForm formData={formData} setFormData={setFormData} isEditing={!!editingMethod} />
                     </TabsContent>

                     <TabsContent value="bank" className="space-y-6 mt-0 animate-in fade-in slide-in-from-right-4 duration-300 focus-visible:outline-none">
                        <BankForm formData={formData} setFormData={setFormData} isEditing={!!editingMethod} />
                     </TabsContent>
                  </Tabs>
               ) : (
                  <div className="space-y-6">
                     {activeTab === 'card' ? (
                        <CardForm formData={formData} setFormData={setFormData} isEditing={true} />
                     ) : (
                        <BankForm formData={formData} setFormData={setFormData} isEditing={true} />
                     )}
                  </div>
               )}
            </div>

            <DialogFooter className="p-6 bg-white border-t border-slate-100 flex flex-col sm:flex-row gap-3 sticky bottom-0 z-10">
               <Button variant="ghost" onClick={() => setIsMethodModalOpen(false)} className="h-12 font-medium">Cancel</Button>
               <Button onClick={handleSaveMethod} className="bg-slate-900 hover:bg-slate-800 text-white shadow-lg h-12 px-8 font-bold rounded-xl transition-transform active:scale-95">
                  {editingMethod ? 'Update Method' : 'Save Payment Method'}
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>

      {/* --- SWAP PLEDGE MODAL --- */}
      <Dialog open={isSwapPledgeOpen} onOpenChange={setIsSwapPledgeOpen}>
         <DialogContent className="sm:max-w-[500px] border-none shadow-2xl rounded-3xl overflow-hidden p-0 gap-0">
            <DialogHeader className="p-8 pb-6 bg-slate-50 border-b border-slate-100">
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <ArrowRightLeft className="h-6 w-6 text-blue-600" />
                </div>
                <DialogTitle className="text-xl font-bold text-slate-900 text-center">Move Pledge</DialogTitle>
                <DialogDescription className="pt-2 text-slate-600 text-center">
                    Select a new payment method for this active pledge.
                </DialogDescription>
            </DialogHeader>

            <div className="p-8 space-y-8 bg-white min-h-[300px] max-h-[60vh] overflow-y-auto">
                <div className="flex flex-col items-center gap-4">
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 w-full">
                        {pledgeToSwap?.avatar ? (
                            <img src={pledgeToSwap.avatar} alt="" className="h-12 w-12 rounded-full object-cover ring-2 ring-white shadow-sm" />
                        ) : (
                            <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-sm">GH</div>
                        )}
                        <div className="flex-1">
                            <p className="font-bold text-slate-900">{pledgeToSwap?.name}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                                <Badge variant="secondary" className="px-1.5 py-0 text-[10px] font-bold uppercase tracking-wider">{pledgeToSwap?.frequency}</Badge>
                                <span className="text-sm font-medium text-slate-600">{formatCurrency(pledgeToSwap?.amount)}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="text-slate-300">
                        <ArrowDown className="h-6 w-6 animate-bounce" />
                    </div>
                </div>

                <div className="space-y-4">
                    <Label className="text-sm font-bold text-slate-900 uppercase tracking-wider ml-1">Move To</Label>
                    {methods.filter(m => m.id !== pledgeToSwap?.paymentMethodId).length > 0 ? (
                        <SelectionList 
                            methods={methods.filter(m => m.id !== pledgeToSwap?.paymentMethodId)}
                            selectedId={targetMethodId}
                            onSelect={setTargetMethodId}
                        />
                    ) : (
                        <div className="p-6 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center space-y-3">
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                                <Wallet className="h-5 w-5 text-slate-400" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-900">No other payment methods</p>
                                <p className="text-xs text-slate-500 mt-1">Add a new card or bank account to move this pledge.</p>
                            </div>
                            <Button size="sm" variant="outline" onClick={() => { setIsSwapPledgeOpen(false); openAddModal(); }}>
                                + Add Method
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            <DialogFooter className="p-6 bg-slate-50 border-t border-slate-100 flex justify-between">
                <Button variant="ghost" onClick={() => setIsSwapPledgeOpen(false)}>Cancel</Button>
                <Button 
                    onClick={executeSwapPledge} 
                    disabled={!targetMethodId}
                    className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg h-11 px-6 font-bold rounded-xl"
                >
                    Confirm Move
                </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>

      {/* --- BULK MOVE MODAL --- */}
      <Dialog open={isMovePledgesOpen} onOpenChange={setIsMovePledgesOpen}>
         <DialogContent className="sm:max-w-[500px] border-none shadow-2xl rounded-3xl overflow-hidden p-0 gap-0">
            <DialogHeader className="p-8 pb-6 bg-amber-50 border-b border-amber-100">
               <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mb-4 shadow-sm border border-amber-200 mx-auto">
                  <AlertCircle className="h-7 w-7 text-amber-600" />
               </div>
               <DialogTitle className="text-2xl font-bold text-amber-950 text-center">Active Pledges Detected</DialogTitle>
               <DialogDescription className="pt-2 text-base text-amber-800/80 leading-relaxed text-center">
                  You are removing a payment method that funds <strong>{pledges.filter(p => p.paymentMethodId === methodToDelete).length} active missions</strong>.
                  Please select a new payment method to ensure uninterrupted support.
               </DialogDescription>
            </DialogHeader>

            <div className="p-8 space-y-8 bg-white min-h-[300px] max-h-[60vh] overflow-y-auto">
               <div className="space-y-3">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Pledges to Transfer</p>
                  <ul className="space-y-2">
                     {pledges.filter(p => p.paymentMethodId === methodToDelete).map(p => (
                        <li key={p.id} className="text-sm flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100">
                           <div className="flex items-center gap-3">
                              {p.avatar ? (
                                 <img src={p.avatar} className="w-8 h-8 rounded-full bg-white border border-slate-200" alt="" />
                              ) : (
                                 <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-xs font-bold">GH</div>
                              )}
                              <span className="font-bold text-slate-900">{p.name}</span>
                           </div>
                           <span className="font-mono font-medium text-slate-600 text-xs">{formatCurrency(p.amount)}</span>
                        </li>
                     ))}
                  </ul>
               </div>

               <div className="flex justify-center text-slate-300">
                   <ArrowDown className="h-6 w-6 animate-bounce" />
               </div>

               <div className="space-y-4">
                  <Label className="text-slate-700 font-bold uppercase tracking-widest text-xs ml-1">Move All To</Label>
                  {methods.filter(m => m.id !== methodToDelete).length > 0 ? (
                      <SelectionList 
                          methods={methods.filter(m => m.id !== methodToDelete)}
                          selectedId={targetMethodId}
                          onSelect={setTargetMethodId}
                      />
                  ) : (
                      <div className="p-4 bg-red-50 text-red-800 rounded-xl border border-red-100 text-sm flex gap-3 items-start">
                          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                          <div>
                              <p className="font-bold">No Backup Method</p>
                              <p className="mt-1">You must add another payment method before you can remove this one.</p>
                          </div>
                      </div>
                  )}
               </div>
            </div>

            <DialogFooter className="p-6 bg-slate-50 border-t border-slate-100 flex justify-between">
               <Button variant="ghost" onClick={() => setIsMovePledgesOpen(false)} className="text-slate-500 hover:text-slate-900">Cancel</Button>
               <Button 
                  onClick={executeMoveAndDelete} 
                  disabled={!targetMethodId}
                  className="bg-slate-900 hover:bg-slate-800 text-white shadow-lg h-11 px-6 font-bold rounded-xl"
               >
                  Transfer & Delete
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>

    </div>
  );
};

// --- Reusable Address Form ---

const AddressForm = ({ address, onChange }: { address: Address, onChange: (newAddr: Address) => void }) => {
  const handleChange = (field: keyof Address, value: string) => {
    onChange({ ...address, [field]: value });
  };

  return (
    <div className="space-y-3 pt-4 border-t border-slate-100">
      <div className="flex items-center gap-2 mb-1">
        <MapPin className="h-4 w-4 text-slate-400" />
        <Label className="text-slate-700 font-semibold">Billing Address</Label>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Input 
          placeholder="Street Address" 
          value={address.street} 
          onChange={(e) => handleChange('street', e.target.value)}
          className="md:col-span-2 bg-white border-slate-200 h-11 shadow-sm" 
        />
        <Input 
          placeholder="City" 
          value={address.city} 
          onChange={(e) => handleChange('city', e.target.value)}
          className="bg-white border-slate-200 h-11 shadow-sm"
        />
        <div className="flex gap-2">
          <Input 
            placeholder="State" 
            value={address.state} 
            onChange={(e) => handleChange('state', e.target.value)}
            className="bg-white border-slate-200 h-11 shadow-sm"
          />
          <Input 
            placeholder="Zip" 
            value={address.zip} 
            onChange={(e) => handleChange('zip', e.target.value)}
            className="bg-white border-slate-200 h-11 shadow-sm"
          />
        </div>
      </div>
    </div>
  );
};

// --- Sub-Form Components ---

const CardForm = ({ formData, setFormData, isEditing }: any) => (
  <>
    <div className="space-y-2">
        <Label className="text-slate-700 font-semibold">Card Number</Label>
        <div className="relative group">
            <CreditCard className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            <Input 
                placeholder="0000 0000 0000 0000" 
                className={cn(
                    "pl-12 h-12 bg-white border-slate-200 shadow-sm transition-all focus:ring-2 focus:ring-blue-100 focus:border-blue-300 font-mono text-lg",
                    isEditing && "bg-slate-100 text-slate-500 border-slate-100 cursor-not-allowed"
                )}
                value={formData.number}
                onChange={(e) => setFormData({...formData, number: e.target.value})}
                disabled={isEditing}
            />
            {isEditing && <Lock className="absolute right-4 top-3.5 h-4 w-4 text-slate-400" />}
        </div>
    </div>
    <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
            <Label className="text-slate-700 font-semibold">Expiration</Label>
            <div className="relative">
                <Calendar className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                <Input 
                    placeholder="MM/YY" 
                    className="h-12 pl-9 bg-white border-slate-200 shadow-sm text-center font-mono text-lg"
                    value={formData.expiry} 
                    onChange={(e) => setFormData({...formData, expiry: e.target.value})} 
                />
            </div>
        </div>
        <div className="space-y-2">
            <Label className="text-slate-700 font-semibold">CVC</Label>
            <Input 
                placeholder="123" 
                className="h-12 bg-white border-slate-200 shadow-sm text-center font-mono text-lg"
                value={formData.cvc} 
                onChange={(e) => setFormData({...formData, cvc: e.target.value})} 
            />
        </div>
    </div>
    <div className="space-y-2">
        <Label className="text-slate-700 font-semibold">Cardholder Name</Label>
        <div className="relative">
            <User className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
            <Input 
                placeholder="JOHN DOE" 
                className="h-12 pl-12 bg-white border-slate-200 shadow-sm font-medium uppercase placeholder:normal-case"
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
            />
        </div>
    </div>
    
    <AddressForm 
      address={formData.address} 
      onChange={(newAddr) => setFormData({ ...formData, address: newAddr })} 
    />

    <div className="flex items-center justify-center gap-2 text-xs text-slate-500 bg-white py-3 rounded-xl border border-slate-200 mt-4 shadow-sm">
        <Lock className="h-3.5 w-3.5 text-emerald-500" />
        <span className="font-medium">256-bit SSL Encrypted Connection</span>
    </div>
  </>
);

const BankForm = ({ formData, setFormData, isEditing }: any) => (
  <>
    <div className="bg-emerald-50 text-emerald-800 text-sm p-4 rounded-xl flex items-start gap-3 border border-emerald-100 shadow-sm">
        <Sparkles className="h-5 w-5 shrink-0 mt-0.5 text-emerald-600 fill-emerald-200" />
        <span className="leading-relaxed font-medium"><strong>Pro Tip:</strong> Bank transfers save us ~2.5% in fees. That means more of your gift goes directly to the field!</span>
    </div>
    
    <div className="space-y-5">
        <div className="space-y-2">
            <Label htmlFor="routing" className="text-slate-700 font-semibold">Routing Number</Label>
            <div className="relative group">
                <Landmark className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-slate-600 transition-colors" />
                <Input 
                    id="routing"
                    placeholder="9 Digit Routing Number" 
                    className={cn(
                        "pl-12 h-12 bg-white border-slate-200 shadow-sm font-mono text-lg transition-all",
                        isEditing && "bg-slate-100 text-slate-500 border-slate-100 cursor-not-allowed"
                    )}
                    value={formData.routing} 
                    onChange={(e) => setFormData({...formData, routing: e.target.value})} 
                    maxLength={9}
                    disabled={isEditing}
                />
            </div>
        </div>
        
        <div className="space-y-2">
            <Label htmlFor="account" className="text-slate-700 font-semibold">Account Number</Label>
            <div className="relative group">
                <Building2 className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-slate-600 transition-colors" />
                <Input 
                    id="account"
                    type={isEditing ? "text" : "password"}
                    placeholder="Account Number" 
                    className={cn(
                        "pl-12 h-12 bg-white border-slate-200 shadow-sm font-mono text-lg transition-all",
                        isEditing && "bg-slate-100 text-slate-500 border-slate-100 cursor-not-allowed"
                    )}
                    value={formData.account} 
                    onChange={(e) => setFormData({...formData, account: e.target.value})} 
                    disabled={isEditing}
                />
            </div>
        </div>

        <div className="space-y-2">
            <Label htmlFor="holder" className="text-slate-700 font-semibold">Account Holder Name</Label>
            <div className="relative group">
                <User className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                <Input 
                    id="holder"
                    placeholder="JOHN DOE" 
                    className="h-12 pl-12 bg-white border-slate-200 shadow-sm font-medium uppercase placeholder:normal-case" 
                    value={formData.name} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})} 
                />
            </div>
        </div>

        <AddressForm 
          address={formData.address} 
          onChange={(newAddr) => setFormData({ ...formData, address: newAddr })} 
        />
    </div>

    <div className="flex items-center justify-center gap-2 text-xs text-slate-500 bg-white py-3 rounded-xl border border-slate-200 mt-4 shadow-sm">
        <ShieldCheck className="h-4 w-4 text-emerald-500" />
        <span className="font-medium">Bank details are encrypted and stored securely via <strong>Stripe</strong>.</span>
    </div>
  </>
);
