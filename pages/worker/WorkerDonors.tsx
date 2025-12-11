
import React, { useState, useMemo } from 'react';
import { 
  Search, Filter, Mail, Phone, MapPin, X, Calendar, 
  ArrowLeft, MoreHorizontal, Download, Plus, User, 
  History, Check, Copy, ArrowUpRight,
  Pencil, Trash2, Heart, MessageSquare, Briefcase, 
  Clock, CheckCircle2, AlertCircle, Send, Star, ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, formatDistanceToNow } from 'date-fns';

// UI Components
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/Tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/Avatar';
import { Separator } from '../../components/ui/separator';
import { Textarea } from '../../components/ui/Textarea';
import { ScrollArea } from '../../components/ui/ScrollArea';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger, 
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem
} from '../../components/ui/DropdownMenu';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription 
} from '../../components/ui/Dialog';
import { cn, formatCurrency } from '../../lib/utils';

// --- Types & Mock Data ---

type ActivityType = 'gift' | 'note' | 'call' | 'email' | 'meeting' | 'task';

interface Activity {
  id: string;
  type: ActivityType;
  date: string;
  title: string;
  description?: string;
  amount?: number;
  status?: string;
  user?: string;
}

interface Donor {
  id: string;
  name: string;
  initials: string;
  type: "Individual" | "Organization" | "Church";
  status: "Active" | "Lapsed" | "New" | "At Risk";
  totalGiven: number;
  lastGiftDate: string;
  lastGiftAmount: number;
  frequency: "Monthly" | "One-Time" | "Annually" | "Irregular";
  email: string;
  phone: string;
  avatar?: string;
  location: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  joinedDate: string;
  tags: string[];
  activities: Activity[];
}

const generateActivities = (donorId: string): Activity[] => {
  return [
    { id: `act-${donorId}-1`, type: 'gift', date: '2023-10-24T10:00:00', title: 'Donation Received', amount: 200, status: 'Succeeded' },
    { id: `act-${donorId}-2`, type: 'note', date: '2023-10-15T14:30:00', title: 'Coffee Meeting', description: 'Met to discuss the new building project. Very interested in supporting the roof construction.', user: 'Me' },
    { id: `act-${donorId}-3`, type: 'email', date: '2023-10-01T09:15:00', title: 'Sent Quarterly Update', description: 'Q3 Impact Report sent via Mailchimp.' },
    { id: `act-${donorId}-4`, type: 'gift', date: '2023-09-24T10:00:00', title: 'Donation Received', amount: 200, status: 'Succeeded' },
    { id: `act-${donorId}-5`, type: 'call', date: '2023-09-10T16:00:00', title: 'Phone Call', description: 'Left a voicemail thanking them for the extra support last month.' },
  ];
};

const DONORS_DATA: Donor[] = [
  { 
    id: "1", 
    name: "Alice Johnson", 
    initials: "AJ",
    type: "Individual", 
    status: "Active", 
    totalGiven: 12400, 
    lastGiftDate: "2024-10-24", 
    lastGiftAmount: 200,
    frequency: "Monthly",
    email: "alice.j@example.com", 
    phone: "+1 (555) 123-4567",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?fit=facearea&facepad=2&w=256&h=256&q=80",
    location: "Denver, CO",
    address: { street: "123 Maple Avenue", city: "Denver", state: "CO", zip: "80203", country: "USA" },
    joinedDate: "2019-03-15",
    tags: ["Youth Ministry", "Monthly Partner"],
    activities: generateActivities("1")
  },
  { 
    id: "2", 
    name: "Grace Community Church", 
    initials: "GC",
    type: "Church", 
    status: "Active", 
    totalGiven: 45000, 
    lastGiftDate: "2024-10-15", 
    lastGiftAmount: 1500,
    frequency: "Monthly",
    email: "missions@grace-community.org", 
    phone: "+1 (555) 987-6543",
    location: "Colorado Springs, CO",
    address: { street: "4500 Church Street", city: "Colorado Springs", state: "CO", zip: "80903", country: "USA" },
    joinedDate: "2015-01-10",
    tags: ["Church Partner", "Major Donor"],
    activities: [
       { id: 'act-2-1', type: 'gift', date: '2024-10-15T08:00:00', title: 'Monthly Support', amount: 1500, status: 'Succeeded' },
       { id: 'act-2-2', type: 'meeting', date: '2024-09-20T11:00:00', title: 'Zoom with Missions Committee', description: 'Presented the annual vision. They approved the budget increase for 2025.' },
    ]
  },
  { 
    id: "3", 
    name: "Robert Smith", 
    initials: "RS",
    type: "Individual", 
    status: "Lapsed", 
    totalGiven: 500, 
    lastGiftDate: "2024-04-10", 
    lastGiftAmount: 100,
    frequency: "Irregular",
    email: "bob.smith@example.com", 
    phone: "+1 (555) 456-7890",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?fit=facearea&facepad=2&w=256&h=256&q=80",
    location: "Boulder, CO",
    address: { street: "789 Oak Lane", city: "Boulder", state: "CO", zip: "80302", country: "USA" },
    joinedDate: "2023-11-01",
    tags: ["Needs Follow-up"],
    activities: [
        { id: 'act-3-1', type: 'gift', date: '2024-04-10T10:00:00', title: 'Donation', amount: 100, status: 'Succeeded' },
        { id: 'act-3-2', type: 'task', date: '2024-11-01T09:00:00', title: 'Call to Reconnect', description: 'Donor has lapsed. Call to check in.', status: 'Pending' }
    ]
  },
  {
    id: "6",
    name: "Tom Clark",
    initials: "TC",
    type: "Individual", 
    status: "At Risk",
    totalGiven: 1200, 
    lastGiftDate: "2024-09-10",
    lastGiftAmount: 100,
    frequency: "Monthly",
    email: "tom.c@example.com", 
    phone: "+1 (555) 333-4444",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=facearea&facepad=2&w=256&h=256&q=80",
    location: "Lakewood, CO",
    address: { street: "888 Birch Dr", city: "Lakewood", state: "CO", zip: "80226", country: "USA" },
    joinedDate: "2022-01-20",
    tags: ["Card Failed", "Urgent"],
    activities: [
        { id: 'act-6-1', type: 'gift', date: '2024-09-10T10:00:00', title: 'Donation Failed', amount: 100, status: 'Failed' },
        { id: 'act-6-2', type: 'task', date: '2024-10-01T09:00:00', title: 'Update Payment Info', description: 'Card expired. Need to call.' }
    ]
  }
];

// --- Helper Functions ---

const getStatusColor = (status: Donor['status']) => {
  switch(status) {
    case 'Active': return "bg-emerald-500";
    case 'Lapsed': return "bg-slate-400";
    case 'New': return "bg-blue-500";
    case 'At Risk': return "bg-amber-500";
    default: return "bg-slate-500";
  }
};

const getStatusBadge = (status: Donor['status']) => {
  const styles: Record<Donor['status'], string> = {
    Active: "bg-emerald-100 text-emerald-700 border-emerald-200",
    Lapsed: "bg-slate-100 text-slate-600 border-slate-200",
    New: "bg-blue-50 text-blue-700 border-blue-200",
    "At Risk": "bg-amber-50 text-amber-700 border-amber-200",
  }
  return (
    <Badge variant="outline" className={`font-semibold border px-2.5 py-0.5 text-[11px] uppercase tracking-wider ${styles[status]}`}>
      {status}
    </Badge>
  );
};

const getActivityIcon = (type: ActivityType) => {
    switch(type) {
        case 'gift': return <Heart className="h-4 w-4 text-white" />;
        case 'call': return <Phone className="h-4 w-4 text-white" />;
        case 'email': return <Mail className="h-4 w-4 text-white" />;
        case 'note': return <MessageSquare className="h-4 w-4 text-white" />;
        case 'meeting': return <Briefcase className="h-4 w-4 text-white" />;
        case 'task': return <CheckCircle2 className="h-4 w-4 text-white" />;
        default: return <Clock className="h-4 w-4 text-white" />;
    }
}

const getActivityBg = (type: ActivityType) => {
    switch(type) {
        case 'gift': return 'bg-rose-500';
        case 'call': return 'bg-blue-500';
        case 'email': return 'bg-purple-500';
        case 'note': return 'bg-slate-500';
        case 'meeting': return 'bg-emerald-500';
        case 'task': return 'bg-amber-500';
        default: return 'bg-slate-400';
    }
}

// --- Main Component ---

export const WorkerDonors = () => {
  const [selectedDonorId, setSelectedDonorId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [sortOption, setSortOption] = useState<'Recent' | 'Amount' | 'Name'>('Recent');
  const [activeTab, setActiveTab] = useState('timeline');
  const [noteInput, setNoteInput] = useState('');
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);

  // Filter Logic
  const filteredDonors = useMemo(() => {
    let result = DONORS_DATA.filter(donor => {
      const matchesSearch = donor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            donor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            donor.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || donor.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    result.sort((a, b) => {
      if (sortOption === 'Recent') {
        return new Date(b.lastGiftDate).getTime() - new Date(a.lastGiftDate).getTime();
      } else if (sortOption === 'Amount') {
        return b.totalGiven - a.totalGiven;
      } else {
        return a.name.localeCompare(b.name);
      }
    });

    return result;
  }, [searchTerm, statusFilter, sortOption]);

  const selectedDonor = useMemo(() => 
    DONORS_DATA.find(d => d.id === selectedDonorId), 
  [selectedDonorId]);

  // Actions
  const handleAddNote = () => {
      console.log(`Adding note to donor ${selectedDonorId}: ${noteInput}`);
      setNoteInput('');
      setIsNoteDialogOpen(false);
  }

  const handleCopy = (text: string) => {
      navigator.clipboard.writeText(text);
  }

  return (
    <div className="flex h-[calc(100vh-5rem)] w-full bg-slate-50/50 animate-in fade-in duration-300 relative overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
      
      {/* --- LEFT PANEL: Donor List --- */}
      <div 
        className={cn(
          "flex flex-col h-full border-r border-slate-200 bg-white w-full lg:w-[400px] xl:w-[450px] transition-all duration-300 absolute lg:relative z-10",
          selectedDonorId ? "-translate-x-full lg:translate-x-0" : "translate-x-0"
        )}
      >
        {/* List Header */}
        <div className="p-4 border-b border-slate-100 space-y-4 shrink-0 bg-white z-20">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold tracking-tight text-slate-900">Partners</h2>
              <p className="text-xs text-slate-500 font-medium">{filteredDonors.length} contacts</p>
            </div>
            <div className="flex gap-1">
               <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                     <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-slate-900">
                        <Filter className="h-4 w-4" />
                     </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                     <DropdownMenuLabel>Filter Status</DropdownMenuLabel>
                     <DropdownMenuSeparator />
                     {['All', 'Active', 'New', 'Lapsed', 'At Risk'].map(s => (
                        <DropdownMenuCheckboxItem 
                           key={s} 
                           checked={statusFilter === s}
                           onCheckedChange={() => setStatusFilter(s)}
                        >
                           {s}
                        </DropdownMenuCheckboxItem>
                     ))}
                  </DropdownMenuContent>
               </DropdownMenu>
               <Button size="icon" className="h-8 w-8 bg-slate-900 hover:bg-slate-800 shadow-sm">
                  <Plus className="h-4 w-4" />
               </Button>
            </div>
          </div>
          <div className="relative group">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            <Input 
              placeholder="Search partners..." 
              className="pl-9 bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-200 transition-all shadow-sm h-10" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Scrollable List */}
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {filteredDonors.length === 0 ? (
               <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                  <Search className="h-8 w-8 mb-2 opacity-20" />
                  <p className="text-sm">No partners found</p>
               </div>
            ) : (
               filteredDonors.map((donor) => (
               <motion.div 
                  key={donor.id}
                  layoutId={`donor-card-${donor.id}`}
                  onClick={() => setSelectedDonorId(donor.id)}
                  className={cn(
                     "group flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border relative overflow-hidden",
                     selectedDonorId === donor.id 
                     ? "bg-blue-50/60 border-blue-200 shadow-sm" 
                     : "bg-white border-transparent hover:bg-slate-50 hover:border-slate-200"
                  )}
               >
                  {selectedDonorId === donor.id && <motion.div layoutId="selection-bar" className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600" />}
                  
                  <div className="relative shrink-0">
                     <Avatar className={cn("h-12 w-12 border-2 transition-all", selectedDonorId === donor.id ? "border-blue-200" : "border-white shadow-sm")}>
                     <AvatarImage src={donor.avatar} />
                     <AvatarFallback className="bg-slate-100 text-slate-600 font-bold text-xs">
                        {donor.initials}
                     </AvatarFallback>
                     </Avatar>
                     <div className={cn("absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white ring-1 ring-black/5", getStatusColor(donor.status))} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                     <div className="flex items-center justify-between mb-0.5">
                     <span className={cn("font-bold text-sm truncate transition-colors", selectedDonorId === donor.id ? "text-blue-900" : "text-slate-900")}>
                        {donor.name}
                     </span>
                     <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">
                        {formatDistanceToNow(new Date(donor.lastGiftDate), { addSuffix: true })}
                     </span>
                     </div>
                     <div className="flex items-center justify-between">
                     <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <span className="truncate max-w-[140px]">{donor.location}</span>
                     </div>
                     <div className="text-xs font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded-md">
                        {formatCurrency(donor.lastGiftAmount)}
                     </div>
                     </div>
                  </div>
               </motion.div>
               ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* --- RIGHT PANEL: Donor Details --- */}
      <div 
        className={cn(
          "flex-1 flex flex-col bg-white h-full overflow-hidden absolute inset-0 lg:relative z-20 lg:z-0 transition-transform duration-300",
          selectedDonorId ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        )}
      >
        {selectedDonor ? (
          <div className="flex flex-col h-full bg-slate-50/30">
            {/* Sticky Header */}
            <div className="shrink-0 h-16 border-b border-slate-100 flex items-center justify-between px-4 md:px-6 bg-white/80 backdrop-blur-md sticky top-0 z-30">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" className="lg:hidden h-8 w-8 -ml-2 text-slate-500" onClick={() => setSelectedDonorId(null)}>
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div className="flex items-center gap-3">
                   <h2 className="text-lg font-bold text-slate-900 truncate hidden sm:block">{selectedDonor.name}</h2>
                   {getStatusBadge(selectedDonor.status)}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="hidden sm:flex h-9 text-xs font-semibold gap-2 border-slate-200 shadow-sm hover:bg-slate-50" onClick={() => setIsNoteDialogOpen(true)}>
                  <Pencil className="h-3.5 w-3.5" /> Note
                </Button>
                <Button variant="outline" size="sm" className="hidden sm:flex h-9 text-xs font-semibold gap-2 border-slate-200 shadow-sm hover:bg-slate-50">
                  <Phone className="h-3.5 w-3.5" /> Call
                </Button>
                <Button size="sm" className="h-9 text-xs font-semibold gap-2 bg-slate-900 text-white shadow-md hover:bg-slate-800">
                  <Mail className="h-3.5 w-3.5" /> Email
                </Button>
                <Separator orientation="vertical" className="h-6 mx-1" />
                <DropdownMenu>
                   <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-500 hover:text-slate-900">
                         <MoreHorizontal className="h-5 w-5" />
                      </Button>
                   </DropdownMenuTrigger>
                   <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Manage Partner</DropdownMenuLabel>
                      <DropdownMenuItem>Edit Contact Info</DropdownMenuItem>
                      <DropdownMenuItem>Manage Tags</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600 focus:text-red-600">
                         <Trash2 className="mr-2 h-4 w-4" /> Archive Partner
                      </DropdownMenuItem>
                   </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Scrollable Content */}
            <ScrollArea className="flex-1">
              <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8">
                
                {/* Hero Profile Section */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col md:flex-row gap-8 items-start"
                >
                   {/* Avatar & Quick Info */}
                   <div className="flex items-center gap-6 min-w-[300px]">
                      <Avatar className="h-24 w-24 border-4 border-white shadow-lg rounded-2xl bg-white">
                         <AvatarImage src={selectedDonor.avatar} />
                         <AvatarFallback className="text-2xl font-bold bg-slate-100 text-slate-500">
                            {selectedDonor.initials}
                         </AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                         <h1 className="text-2xl font-bold text-slate-900">{selectedDonor.name}</h1>
                         <div className="flex items-center gap-1.5 text-sm text-slate-500">
                            <MapPin className="h-3.5 w-3.5" /> {selectedDonor.location}
                         </div>
                         <div className="flex flex-wrap gap-2 mt-2">
                            {selectedDonor.tags.map(tag => (
                               <span key={tag} className="px-2 py-0.5 bg-white border border-slate-200 rounded-md text-[10px] font-semibold text-slate-600 shadow-sm uppercase tracking-wide">
                                  {tag}
                               </span>
                            ))}
                         </div>
                      </div>
                   </div>

                   {/* Stats Grid */}
                   <div className="flex-1 w-full grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Card className="border-none shadow-sm bg-white/60 hover:bg-white transition-colors">
                         <CardContent className="p-4 space-y-1">
                            <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Lifetime</p>
                            <p className="text-xl font-bold text-slate-900">{formatCurrency(selectedDonor.totalGiven)}</p>
                         </CardContent>
                      </Card>
                      <Card className="border-none shadow-sm bg-white/60 hover:bg-white transition-colors">
                         <CardContent className="p-4 space-y-1">
                            <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Last Gift</p>
                            <div className="flex items-center gap-1.5">
                               <p className="text-xl font-bold text-slate-900">{formatCurrency(selectedDonor.lastGiftAmount)}</p>
                               {new Date(selectedDonor.lastGiftDate) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) && (
                                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" title="Recent Gift" />
                               )}
                            </div>
                         </CardContent>
                      </Card>
                      <Card className="border-none shadow-sm bg-white/60 hover:bg-white transition-colors">
                         <CardContent className="p-4 space-y-1">
                            <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Frequency</p>
                            <div className="flex items-center gap-1">
                               <ArrowUpRight className="h-3 w-3 text-emerald-600" />
                               <p className="text-sm font-bold text-slate-900">{selectedDonor.frequency}</p>
                            </div>
                         </CardContent>
                      </Card>
                      <Card className="border-none shadow-sm bg-white/60 hover:bg-white transition-colors">
                         <CardContent className="p-4 space-y-1">
                            <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Partner Since</p>
                            <p className="text-sm font-bold text-slate-900">{new Date(selectedDonor.joinedDate).getFullYear()}</p>
                         </CardContent>
                      </Card>
                   </div>
                </motion.div>

                {/* Main Content Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <div className="border-b border-slate-200">
                     <TabsList className="bg-transparent h-auto p-0 gap-6">
                        {['Timeline', 'Contact Info', 'Giving History'].map(tab => (
                           <TabsTrigger 
                              key={tab} 
                              value={tab.toLowerCase().replace(' ', '-')}
                              className="bg-transparent border-b-2 border-transparent data-[state=active]:border-slate-900 data-[state=active]:shadow-none rounded-none px-1 py-3 text-sm font-medium text-slate-500 data-[state=active]:text-slate-900 transition-all hover:text-slate-700"
                           >
                              {tab}
                           </TabsTrigger>
                        ))}
                     </TabsList>
                  </div>

                  <div className="pt-6">
                     {/* TAB: TIMELINE */}
                     <TabsContent value="timeline" className="space-y-6 mt-0 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        {/* Quick Action Input */}
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex gap-4 transition-all focus-within:ring-2 focus-within:ring-slate-100">
                           <Avatar className="h-9 w-9 hidden md:block">
                              <AvatarFallback className="bg-slate-900 text-white text-xs">ME</AvatarFallback>
                           </Avatar>
                           <div className="flex-1 space-y-3">
                              <Textarea 
                                 placeholder="Log a call, meeting notes, or task..." 
                                 className="min-h-[60px] border-none bg-slate-50 focus:bg-white focus:ring-0 resize-none text-sm p-3 rounded-lg transition-colors placeholder:text-slate-400"
                              />
                              <div className="flex justify-between items-center">
                                 <div className="flex gap-2">
                                    <Button variant="ghost" size="sm" className="h-8 text-xs text-slate-500 hover:text-slate-900 hover:bg-slate-100 gap-1.5">
                                       <Phone className="h-3.5 w-3.5" /> Log Call
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-8 text-xs text-slate-500 hover:text-slate-900 hover:bg-slate-100 gap-1.5">
                                       <Check className="h-3.5 w-3.5" /> Create Task
                                    </Button>
                                 </div>
                                 <Button size="sm" className="h-8 text-xs bg-slate-900 text-white hover:bg-slate-800 shadow-sm">
                                    Post Activity <Send className="h-3 w-3 ml-1.5" />
                                 </Button>
                              </div>
                           </div>
                        </div>

                        {/* Activity Stream */}
                        <div className="space-y-8 pl-4 border-l-2 border-slate-200 ml-4 relative pb-10">
                           {selectedDonor.activities.map((activity) => (
                              <div key={activity.id} className="relative pl-8 group">
                                 <div className={cn(
                                    "absolute -left-[41px] top-0 h-8 w-8 rounded-full border-4 border-slate-50 flex items-center justify-center shadow-sm z-10 transition-transform group-hover:scale-110",
                                    getActivityBg(activity.type)
                                 )}>
                                    {getActivityIcon(activity.type)}
                                 </div>
                                 
                                 <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-1 bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="space-y-1">
                                       <div className="flex items-center gap-2">
                                          <span className="text-sm font-bold text-slate-900">{activity.title}</span>
                                          {activity.amount && (
                                             <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-100 font-bold px-1.5 h-5">
                                                {formatCurrency(activity.amount)}
                                             </Badge>
                                          )}
                                       </div>
                                       {activity.description && (
                                          <p className="text-sm text-slate-600 leading-relaxed max-w-xl">{activity.description}</p>
                                       )}
                                    </div>
                                    <span className="text-xs text-slate-400 font-medium whitespace-nowrap">
                                       {format(new Date(activity.date), "MMM d, h:mm a")}
                                    </span>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </TabsContent>

                     {/* TAB: CONTACT */}
                     <TabsContent value="contact-info" className="mt-0 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <Card className="shadow-sm border-slate-200">
                              <CardHeader className="pb-3 border-b border-slate-100">
                                 <CardTitle className="text-sm font-semibold">Contact Methods</CardTitle>
                              </CardHeader>
                              <CardContent className="pt-4 space-y-4">
                                 <div className="flex items-center justify-between group">
                                    <div className="flex items-center gap-3">
                                       <div className="h-8 w-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                                          <Mail className="h-4 w-4" />
                                       </div>
                                       <div>
                                          <p className="text-xs text-slate-500 font-medium">Email</p>
                                          <p className="text-sm font-medium text-slate-900">{selectedDonor.email}</p>
                                       </div>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50" onClick={() => handleCopy(selectedDonor.email)}>
                                       <Copy className="h-3.5 w-3.5" />
                                    </Button>
                                 </div>
                                 <div className="flex items-center justify-between group">
                                    <div className="flex items-center gap-3">
                                       <div className="h-8 w-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                          <Phone className="h-4 w-4" />
                                       </div>
                                       <div>
                                          <p className="text-xs text-slate-500 font-medium">Phone</p>
                                          <p className="text-sm font-medium text-slate-900">{selectedDonor.phone}</p>
                                       </div>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50" onClick={() => handleCopy(selectedDonor.phone)}>
                                       <Copy className="h-3.5 w-3.5" />
                                    </Button>
                                 </div>
                              </CardContent>
                           </Card>

                           <Card className="shadow-sm border-slate-200">
                              <CardHeader className="pb-3 border-b border-slate-100">
                                 <CardTitle className="text-sm font-semibold">Address</CardTitle>
                              </CardHeader>
                              <CardContent className="pt-4 space-y-4">
                                 <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-3">
                                       <div className="h-8 w-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                                          <MapPin className="h-4 w-4" />
                                       </div>
                                       <div>
                                          <p className="text-sm font-medium text-slate-900">{selectedDonor.address.street}</p>
                                          <p className="text-sm text-slate-600">
                                             {selectedDonor.address.city}, {selectedDonor.address.state} {selectedDonor.address.zip}
                                          </p>
                                          <p className="text-xs text-slate-400 mt-1 uppercase font-bold">{selectedDonor.address.country}</p>
                                       </div>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900 hover:bg-slate-100">
                                       <ExternalLink className="h-3.5 w-3.5" />
                                    </Button>
                                 </div>
                              </CardContent>
                           </Card>
                        </div>
                     </TabsContent>

                     {/* TAB: HISTORY */}
                     <TabsContent value="giving-history" className="mt-0 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <Card className="shadow-sm border-slate-200 overflow-hidden">
                           <div className="p-0">
                              <table className="w-full text-sm text-left">
                                 <thead className="text-xs text-slate-500 uppercase bg-slate-50/50 border-b border-slate-100">
                                    <tr>
                                       <th className="px-6 py-3 font-semibold">Date</th>
                                       <th className="px-6 py-3 font-semibold">Type</th>
                                       <th className="px-6 py-3 font-semibold">Amount</th>
                                       <th className="px-6 py-3 font-semibold">Status</th>
                                       <th className="px-6 py-3 font-semibold text-right">Receipt</th>
                                    </tr>
                                 </thead>
                                 <tbody className="divide-y divide-slate-100">
                                    {selectedDonor.activities.filter(a => a.type === 'gift').map((gift) => (
                                       <tr key={gift.id} className="hover:bg-slate-50/50 transition-colors">
                                          <td className="px-6 py-4 font-medium text-slate-900">
                                             {format(new Date(gift.date), "MMM d, yyyy")}
                                          </td>
                                          <td className="px-6 py-4 text-slate-500">
                                             Online Gift
                                          </td>
                                          <td className="px-6 py-4 font-bold text-slate-900">
                                             {formatCurrency(gift.amount || 0)}
                                          </td>
                                          <td className="px-6 py-4">
                                             <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold">
                                                {gift.status}
                                             </Badge>
                                          </td>
                                          <td className="px-6 py-4 text-right">
                                             <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-slate-100 rounded-full">
                                                <Download className="h-4 w-4 text-slate-400 hover:text-slate-900" />
                                             </Button>
                                          </td>
                                       </tr>
                                    ))}
                                 </tbody>
                              </table>
                              {selectedDonor.activities.filter(a => a.type === 'gift').length === 0 && (
                                 <div className="p-12 text-center text-slate-400">
                                    <div className="h-12 w-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                       <History className="h-6 w-6 text-slate-300" />
                                    </div>
                                    <p>No giving history available.</p>
                                 </div>
                              )}
                           </div>
                        </Card>
                     </TabsContent>
                  </div>
                </Tabs>
              </div>
            </ScrollArea>
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center h-full text-center p-8 animate-in fade-in zoom-in-95 duration-500 bg-slate-50/30">
            <div className="w-24 h-24 bg-white border-2 border-slate-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
               <User className="h-10 w-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Select a Partner</h3>
            <p className="text-slate-500 max-w-sm mx-auto mb-8 leading-relaxed">
               Select a donor from the list to view their full profile, interaction timeline, and giving history.
            </p>
            <Button className="shadow-md bg-slate-900 text-white hover:bg-slate-800 px-6 h-11">
               <Plus className="mr-2 h-4 w-4" /> Add New Partner
            </Button>
          </div>
        )}
      </div>

      {/* Note Dialog */}
      <Dialog open={isNoteDialogOpen} onOpenChange={setIsNoteDialogOpen}>
         <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
               <DialogTitle>Add Note</DialogTitle>
               <DialogDescription>Add a private note to {selectedDonor?.name}'s timeline.</DialogDescription>
            </DialogHeader>
            <div className="py-4">
               <Textarea 
                  value={noteInput} 
                  onChange={(e) => setNoteInput(e.target.value)} 
                  placeholder="Type your note here..." 
                  className="min-h-[150px] resize-none"
               />
            </div>
            <DialogFooter>
               <Button variant="outline" onClick={() => setIsNoteDialogOpen(false)}>Cancel</Button>
               <Button onClick={handleAddNote} className="bg-slate-900 text-white">Save Note</Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>

    </div>
  );
};
