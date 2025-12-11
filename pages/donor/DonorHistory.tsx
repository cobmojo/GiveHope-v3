
import React, { useState, useMemo } from 'react';
import { 
  Download, Search, Filter, Calendar, FileText, 
  ChevronDown, CheckCircle2, ArrowUpRight, DollarSign, TrendingUp,
  MoreHorizontal, DownloadCloud, ExternalLink, SlidersHorizontal,
  XCircle, Clock
} from 'lucide-react';
import { formatCurrency, cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription 
} from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem
} from "../../components/ui/DropdownMenu";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "../../components/ui/Table";
import { Select } from "../../components/ui/Select";
import { ResponsiveContainer, BarChart, Bar, Tooltip as RechartsTooltip, XAxis, Cell, CartesianGrid } from 'recharts';

// --- Types ---

interface Transaction {
  id: string;
  date: string; // ISO string
  amount: number;
  recipient: string;
  recipientAvatar?: string;
  category: string;
  type: 'Recurring' | 'One-Time';
  method: string;
  last4: string;
  status: 'Succeeded' | 'Processing' | 'Failed';
  receiptUrl: string;
}

// --- Mock Data ---

const TRANSACTIONS: Transaction[] = [
  { id: 'TX-10492', date: '2024-10-24T10:30:00', amount: 100.00, recipient: 'The Miller Family', category: 'Missionary', type: 'Recurring', method: 'Visa', last4: '4242', status: 'Succeeded', receiptUrl: '#' },
  { id: 'TX-10491', date: '2024-09-24T10:30:00', amount: 100.00, recipient: 'The Miller Family', category: 'Missionary', type: 'Recurring', method: 'Visa', last4: '4242', status: 'Succeeded', receiptUrl: '#' },
  { id: 'TX-10355', date: '2024-09-12T14:15:00', amount: 500.00, recipient: 'Clean Water Initiative', category: 'Project', type: 'One-Time', method: 'Mastercard', last4: '8821', status: 'Succeeded', receiptUrl: '#' },
  { id: 'TX-10290', date: '2024-08-24T10:30:00', amount: 100.00, recipient: 'The Miller Family', category: 'Missionary', type: 'Recurring', method: 'Visa', last4: '4242', status: 'Succeeded', receiptUrl: '#' },
  { id: 'TX-10210', date: '2024-07-24T10:30:00', amount: 100.00, recipient: 'The Miller Family', category: 'Missionary', type: 'Recurring', method: 'Visa', last4: '4242', status: 'Succeeded', receiptUrl: '#' },
  { id: 'TX-10150', date: '2024-06-15T09:00:00', amount: 250.00, recipient: 'Refugee Crisis Fund', category: 'Emergency', type: 'One-Time', method: 'Bank', last4: '9921', status: 'Processing', receiptUrl: '#' },
  { id: 'TX-9982', date: '2024-05-24T10:30:00', amount: 100.00, recipient: 'The Miller Family', category: 'Missionary', type: 'Recurring', method: 'Visa', last4: '4242', status: 'Failed', receiptUrl: '#' },
  { id: 'TX-9840', date: '2024-04-10T16:20:00', amount: 1000.00, recipient: 'Building Fund', category: 'Capital', type: 'One-Time', method: 'Check', last4: '1024', status: 'Succeeded', receiptUrl: '#' },
];

const MONTHLY_DATA = [
  { month: 'May', amount: 100 },
  { month: 'Jun', amount: 350 },
  { month: 'Jul', amount: 100 },
  { month: 'Aug', amount: 100 },
  { month: 'Sep', amount: 600 },
  { month: 'Oct', amount: 100 },
];

// --- Helpers ---

const getStatusColor = (status: Transaction['status']) => {
  switch (status) {
    case 'Succeeded': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'Processing': return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'Failed': return 'bg-red-50 text-red-700 border-red-200';
    default: return 'bg-slate-50 text-slate-700 border-slate-200';
  }
};

const getStatusIcon = (status: Transaction['status']) => {
  switch (status) {
    case 'Succeeded': return <CheckCircle2 className="w-3.5 h-3.5" />;
    case 'Processing': return <Clock className="w-3.5 h-3.5" />;
    case 'Failed': return <XCircle className="w-3.5 h-3.5" />;
    default: return null;
  }
};

// --- Main Component ---

export const DonorHistory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [yearFilter, setYearFilter] = useState('2024');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Filter Logic
  const filteredTransactions = useMemo(() => {
    return TRANSACTIONS.filter(t => {
      const matchesSearch = t.recipient.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            t.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesYear = new Date(t.date).getFullYear().toString() === yearFilter;
      const matchesType = typeFilter === 'All' || t.type === typeFilter;
      const matchesStatus = statusFilter === 'All' || t.status === statusFilter;

      return matchesSearch && matchesYear && matchesType && matchesStatus;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [searchTerm, yearFilter, typeFilter, statusFilter]);

  // Aggregates
  const totalGiven = useMemo(() => filteredTransactions.reduce((sum, t) => t.status === 'Succeeded' ? sum + t.amount : sum, 0), [filteredTransactions]);
  const receiptCount = useMemo(() => filteredTransactions.filter(t => t.status === 'Succeeded').length, [filteredTransactions]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Giving History</h1>
          <p className="text-slate-500 mt-2 text-lg">Your complete record of impact and tax-deductible contributions.</p>
        </div>
        <div className="flex flex-wrap gap-3">
           <div className="relative w-[120px]">
              <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-slate-500 z-10 pointer-events-none" />
              <Select 
                value={yearFilter} 
                onChange={(e) => setYearFilter(e.target.value)}
                className="pl-9 bg-white border-slate-200 shadow-sm"
              >
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
              </Select>
           </div>

           <Button className="bg-slate-900 hover:bg-slate-800 text-white shadow-md font-semibold">
             <DownloadCloud className="mr-2 h-4 w-4" /> Download Statement
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         
         {/* Stats Column */}
         <div className="lg:col-span-1 space-y-6">
            
            {/* Main Impact Card */}
            <Card className="bg-slate-950 text-white border-none shadow-2xl overflow-hidden relative group">
               <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-950 z-0" />
               <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity duration-700">
                  <TrendingUp className="w-40 h-40 text-emerald-400" />
               </div>
               
               <CardContent className="p-8 relative z-10">
                  <div className="flex items-center justify-between mb-6">
                     <span className="text-xs font-bold uppercase tracking-wider text-slate-400 bg-white/5 px-2 py-1 rounded">Total Giving {yearFilter}</span>
                     <DollarSign className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div className="text-5xl font-bold tracking-tight mb-2">
                    {formatCurrency(totalGiven)}
                  </div>
                  <p className="text-sm text-slate-400 mb-8">
                    100% Tax Deductible
                  </p>

                  <div className="h-24 w-full">
                     <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={MONTHLY_DATA}>
                           <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                              {MONTHLY_DATA.map((entry, index) => (
                                 <Cell 
                                    key={`cell-${index}`} 
                                    fill={entry.amount > 300 ? '#10b981' : 'rgba(255,255,255,0.2)'} 
                                    className="transition-all duration-300 hover:opacity-80"
                                 />
                              ))}
                           </Bar>
                           <RechartsTooltip 
                              cursor={{fill: 'rgba(255,255,255,0.05)'}}
                              contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                              itemStyle={{ color: '#fff' }}
                              formatter={(value: number) => [formatCurrency(value), 'Given']}
                           />
                        </BarChart>
                     </ResponsiveContainer>
                  </div>
               </CardContent>
            </Card>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
                <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-5 flex flex-col items-center text-center justify-center h-full">
                        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                            <FileText className="h-5 w-5" />
                        </div>
                        <div className="text-2xl font-bold text-slate-900">{receiptCount}</div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mt-1">Receipts</p>
                    </CardContent>
                </Card>
                <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-5 flex flex-col items-center text-center justify-center h-full">
                        <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
                            <CheckCircle2 className="h-5 w-5" />
                        </div>
                        <div className="text-2xl font-bold text-slate-900">{filteredTransactions.length}</div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mt-1">Total Gifts</p>
                    </CardContent>
                </Card>
            </div>
         </div>

         {/* Transactions List Column */}
         <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* Filters Toolbar */}
            <div className="flex flex-col sm:flex-row gap-4">
               <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input 
                     placeholder="Search recipient or transaction ID..." 
                     className="pl-9 bg-white border-slate-200 h-10 shadow-sm focus:ring-2 focus:ring-slate-100"
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                  />
               </div>
               
               <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
                  <DropdownMenu>
                     <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="h-10 border-slate-200 bg-white text-slate-700 shadow-sm">
                           <SlidersHorizontal className="mr-2 h-4 w-4" /> Type
                           {typeFilter !== 'All' && <Badge variant="secondary" className="ml-2 h-5 px-1.5">{typeFilter}</Badge>}
                        </Button>
                     </DropdownMenuTrigger>
                     <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuCheckboxItem checked={typeFilter === 'All'} onCheckedChange={() => setTypeFilter('All')}>All Types</DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem checked={typeFilter === 'Recurring'} onCheckedChange={() => setTypeFilter('Recurring')}>Recurring</DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem checked={typeFilter === 'One-Time'} onCheckedChange={() => setTypeFilter('One-Time')}>One-Time</DropdownMenuCheckboxItem>
                     </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu>
                     <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="h-10 border-slate-200 bg-white text-slate-700 shadow-sm">
                           Status
                           {statusFilter !== 'All' && <Badge variant="secondary" className="ml-2 h-5 px-1.5">{statusFilter}</Badge>}
                        </Button>
                     </DropdownMenuTrigger>
                     <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuCheckboxItem checked={statusFilter === 'All'} onCheckedChange={() => setStatusFilter('All')}>All Statuses</DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem checked={statusFilter === 'Succeeded'} onCheckedChange={() => setStatusFilter('Succeeded')}>Succeeded</DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem checked={statusFilter === 'Processing'} onCheckedChange={() => setStatusFilter('Processing')}>Processing</DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem checked={statusFilter === 'Failed'} onCheckedChange={() => setStatusFilter('Failed')}>Failed</DropdownMenuCheckboxItem>
                     </DropdownMenuContent>
                  </DropdownMenu>
               </div>
            </div>

            {/* List View */}
            <Card className="border-slate-200 shadow-sm overflow-hidden flex-1 flex flex-col">
               
               {/* Desktop Table Header */}
               <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <div className="col-span-2">Date</div>
                  <div className="col-span-4">Recipient</div>
                  <div className="col-span-2">Amount</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-2 text-right">Receipt</div>
               </div>

               {/* Transactions */}
               <div className="flex-1 overflow-y-auto min-h-[400px]">
                  {filteredTransactions.length === 0 ? (
                     <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                           <Search className="h-8 w-8 text-slate-300" />
                        </div>
                        <p className="font-medium text-slate-900">No transactions found</p>
                        <p className="text-sm">Try adjusting your filters or search terms.</p>
                     </div>
                  ) : (
                     <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="divide-y divide-slate-100"
                     >
                        {filteredTransactions.map((tx) => (
                           <motion.div 
                              key={tx.id} 
                              variants={itemVariants}
                              className="group bg-white hover:bg-slate-50 transition-colors p-4 md:p-0 md:h-16 md:grid md:grid-cols-12 md:gap-4 md:items-center relative"
                           >
                              {/* Mobile Layout */}
                              <div className="flex justify-between md:hidden mb-2">
                                 <span className="text-xs text-slate-500 font-medium">{new Date(tx.date).toLocaleDateString()}</span>
                                 <Badge variant="outline" className={cn("text-[10px] h-5", getStatusColor(tx.status))}>
                                    {getStatusIcon(tx.status)}
                                    <span className="ml-1">{tx.status}</span>
                                 </Badge>
                              </div>
                              
                              {/* Date (Desktop) */}
                              <div className="hidden md:block col-span-2 px-4 text-sm font-medium text-slate-600">
                                 {new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </div>

                              {/* Recipient */}
                              <div className="md:col-span-4 md:px-0 mb-2 md:mb-0">
                                 <div className="flex items-center gap-3">
                                    <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs border border-slate-200">
                                       {tx.recipient[0]}
                                    </div>
                                    <div>
                                       <div className="text-sm font-bold text-slate-900 leading-none mb-1">{tx.recipient}</div>
                                       <div className="text-xs text-slate-500 flex items-center gap-1.5">
                                          <span className="bg-slate-100 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wide">{tx.type}</span>
                                          <span className="text-slate-300">•</span>
                                          <span>{tx.method} ••{tx.last4}</span>
                                       </div>
                                    </div>
                                 </div>
                              </div>

                              {/* Amount */}
                              <div className="flex justify-between items-center md:block md:col-span-2 md:px-0">
                                 <span className="text-sm text-slate-500 md:hidden">Amount</span>
                                 <span className="text-sm font-bold text-slate-900">{formatCurrency(tx.amount)}</span>
                              </div>

                              {/* Status (Desktop) */}
                              <div className="hidden md:flex col-span-2 items-center">
                                 <Badge variant="outline" className={cn("pl-1.5 pr-2.5 h-6 gap-1.5 font-medium", getStatusColor(tx.status))}>
                                    {getStatusIcon(tx.status)} {tx.status}
                                 </Badge>
                              </div>

                              {/* Actions */}
                              <div className="md:col-span-2 flex justify-end md:px-4 mt-3 md:mt-0 border-t md:border-none pt-3 md:pt-0 gap-2">
                                 {tx.status === 'Succeeded' && (
                                    <Button variant="ghost" size="sm" className="h-8 text-xs font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-200/50">
                                       <DownloadCloud className="w-3.5 h-3.5 mr-1.5" /> Receipt
                                    </Button>
                                 )}
                                 <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                       <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900">
                                          <MoreHorizontal className="w-4 h-4" />
                                       </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                       <DropdownMenuItem>View Details</DropdownMenuItem>
                                       <DropdownMenuItem>Manage Recurring</DropdownMenuItem>
                                       <DropdownMenuSeparator />
                                       <DropdownMenuItem><ExternalLink className="w-3 h-3 mr-2" /> Open Statement</DropdownMenuItem>
                                    </DropdownMenuContent>
                                 </DropdownMenu>
                              </div>
                           </motion.div>
                        ))}
                     </motion.div>
                  )}
               </div>
            </Card>
         </div>
      </div>
    </div>
  );
};
