
import React, { useState, useMemo } from 'react';
import { 
  CheckCircle2, Plus, Search, MoreHorizontal, Phone, Mail, 
  Users, Calendar, Trash2, Edit2, Clock,
  RefreshCw, Send, X, CornerUpRight, Briefcase,
  AlertCircle, ArrowUpRight, Filter, SortAsc, Circle, CheckSquare
} from 'lucide-react';

// UI Components
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Tabs, TabsList, TabsTrigger } from '../../components/ui/Tabs';
import { Checkbox } from '../../components/ui/Checkbox';
import { Textarea } from '../../components/ui/Textarea';
import { Select } from '../../components/ui/Select';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/Avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../../components/ui/Dialog';
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel, DropdownMenuCheckboxItem 
} from '../../components/ui/DropdownMenu';
import { motion, AnimatePresence } from 'framer-motion';

// Data & Types
import { MOCK_TASKS, MOCK_DONORS } from '../../lib/mock';
import { Task } from '../../lib/types';
import { cn } from '../../lib/utils';

// --- Utility Functions ---

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
  
  // Check if within next 7 days
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);
  if (date < nextWeek && date > today) {
      return new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date);
  }

  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
};

const getRelativeDateGroup = (dateStr: string) => {
  const date = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);

  if (d < today) return 'Overdue';
  if (d.getTime() === today.getTime()) return 'Today';
  
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  if (d.getTime() === tomorrow.getTime()) return 'Tomorrow';
  
  return 'Upcoming';
};

const getPriorityColor = (priority: Task['priority']) => {
  switch (priority) {
    case 'high': return 'text-red-700 bg-red-50 border-red-200/60';
    case 'medium': return 'text-amber-700 bg-amber-50 border-amber-200/60';
    case 'low': return 'text-slate-600 bg-slate-100 border-slate-200/60';
    default: return 'text-slate-600 bg-slate-100';
  }
};

const getTypeIcon = (type: Task['type']) => {
  switch (type) {
    case 'call': return <Phone className="h-3.5 w-3.5" />;
    case 'email': return <Mail className="h-3.5 w-3.5" />;
    case 'meeting': return <Users className="h-3.5 w-3.5" />;
    case 'todo': return <CheckSquare className="h-3.5 w-3.5" />;
    default: return <Briefcase className="h-3.5 w-3.5" />;
  }
};

// --- Sub-Components ---

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onReschedule: (id: string, days: number) => void;
  onFollowUp: (task: Task) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ 
  task, 
  onToggle, 
  onEdit, 
  onDelete, 
  onReschedule, 
  onFollowUp 
}) => {
  const donor = MOCK_DONORS.find(d => d.id === task.donorId);
  const isCompleted = task.status === 'completed';
  const isOverdue = getRelativeDateGroup(task.dueDate) === 'Overdue' && !isCompleted;

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, marginTop: 0, overflow: 'hidden' }}
      transition={{ duration: 0.2 }}
      className={cn(
        "group flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-white border-b border-slate-100 last:border-0 hover:bg-slate-50/80 transition-colors relative",
        isCompleted && "bg-slate-50/40"
      )}
    >
      {/* Selection / Status Toggle */}
      <button 
        onClick={() => onToggle(task.id)}
        className={cn(
            "mt-1 sm:mt-0 flex-shrink-0 h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400",
            isCompleted 
                ? "bg-emerald-500 border-emerald-500 text-white" 
                : isOverdue 
                    ? "border-red-300 hover:border-red-400 bg-white"
                    : "border-slate-300 hover:border-emerald-400 bg-white"
        )}
      >
        {isCompleted && <CheckCircle2 className="h-4 w-4" />}
        {!isCompleted && isOverdue && <AlertCircle className="h-3.5 w-3.5 text-red-500" />}
      </button>

      {/* Main Content */}
      <div className="flex-1 min-w-0 space-y-1.5 w-full">
        <div className="flex items-center gap-2 flex-wrap">
           <span className={cn(
              "font-semibold text-base text-slate-900 leading-tight cursor-pointer hover:text-primary transition-colors",
              isCompleted && "line-through text-slate-400"
           )} onClick={() => onEdit(task)}>
             {task.title}
           </span>
           {!isCompleted && (
               <Badge variant="outline" className={cn("text-[10px] px-2 py-0 h-5 font-semibold uppercase tracking-wider border", getPriorityColor(task.priority))}>
                 {task.priority}
               </Badge>
           )}
        </div>
        
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
           {/* Task Type */}
           <div className="flex items-center gap-1.5 text-xs font-medium bg-slate-100 px-2 py-0.5 rounded-md text-slate-600">
              {getTypeIcon(task.type)}
              <span className="capitalize">{task.type}</span>
           </div>
           
           {/* Associated Donor */}
           {donor && (
                <div 
                    className="flex items-center gap-1.5 text-xs text-slate-600 font-medium hover:text-blue-600 cursor-pointer transition-colors bg-white border border-slate-200 px-2 py-0.5 rounded-full shadow-sm hover:shadow-md"
                    onClick={(e) => { e.stopPropagation(); /* Navigate to donor */ }}
                >
                   <Avatar className="h-4 w-4">
                      <AvatarImage src={donor.avatar} />
                      <AvatarFallback className="text-[8px] bg-blue-100 text-blue-700">{donor.name[0]}</AvatarFallback>
                   </Avatar>
                   {donor.name}
                </div>
           )}

           {/* Description Preview */}
           {task.description && (
                <span className="text-xs text-slate-400 truncate max-w-[200px] hidden md:inline-block border-l border-slate-200 pl-3">
                   {task.description}
                </span>
           )}
        </div>
      </div>

      {/* Right Side: Date & Actions */}
      <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 pl-0 sm:pl-4 mt-2 sm:mt-0">
         
         {/* Due Date */}
         <div className={cn(
            "flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-md transition-colors",
            isOverdue ? "text-red-700 bg-red-50" : 
            isCompleted ? "text-slate-400" : "text-slate-600 bg-slate-100/50"
         )}>
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(task.dueDate)}
         </div>

         {/* Quick Actions Group */}
         <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
            {!isCompleted && (
                <>
                    <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50" title="Reschedule">
                            <Clock className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Reschedule to...</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onReschedule(task.id, 1)}>Tomorrow</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onReschedule(task.id, 3)}>in 3 Days</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onReschedule(task.id, 7)}>Next Week</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onReschedule(task.id, 14)}>2 Weeks</DropdownMenuItem>
                    </DropdownMenuContent>
                    </DropdownMenu>

                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
                        onClick={() => onFollowUp(task)}
                        title="Quick Follow Up"
                    >
                        <CornerUpRight className="h-4 w-4" />
                    </Button>
                </>
            )}

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900 hover:bg-slate-100">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => onEdit(task)}>
                    <Edit2 className="mr-2 h-4 w-4" /> Edit Details
                </DropdownMenuItem>
                {isCompleted ? (
                    <DropdownMenuItem onClick={() => onToggle(task.id)}>
                        <RefreshCw className="mr-2 h-4 w-4" /> Mark Incomplete
                    </DropdownMenuItem>
                ) : (
                    <DropdownMenuItem onClick={() => onToggle(task.id)}>
                        <CheckCircle2 className="mr-2 h-4 w-4" /> Mark Complete
                    </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onDelete(task.id)} className="text-red-600 focus:text-red-600">
                    <Trash2 className="mr-2 h-4 w-4" /> Delete Task
                </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
         </div>
      </div>
    </motion.div>
  );
};

// --- Main Component ---

export const WorkerTasks = () => {
  // --- State ---
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [showCompleted, setShowCompleted] = useState(false);
  const [sortBy, setSortBy] = useState<'date' | 'priority'>('date');
  
  // Create/Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Partial<Task>>({});
  
  // Email Modal State
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailDraft, setEmailDraft] = useState({ to: '', subject: '', body: '' });
  const [sendingEmail, setSendingEmail] = useState(false);

  // --- Derived Data ---
  const filteredTasks = useMemo(() => {
    let filtered = tasks;

    // 1. Filter by Completion
    if (!showCompleted) filtered = filtered.filter(t => t.status === 'open');

    // 2. Filter by Tab (Type)
    if (activeTab !== 'all') {
       filtered = filtered.filter(t => t.type === activeTab.slice(0, -1)); // 'calls' -> 'call'
    }

    // 3. Filter by Search
    if (searchQuery) {
       const lowerQ = searchQuery.toLowerCase();
       filtered = filtered.filter(t => t.title.toLowerCase().includes(lowerQ) || t.description?.toLowerCase().includes(lowerQ));
    }

    // 4. Sort
    filtered.sort((a, b) => {
        if (sortBy === 'priority') {
            const pMap = { high: 1, medium: 2, low: 3 };
            return (pMap[a.priority] || 3) - (pMap[b.priority] || 3);
        }
        // Default Date Sort
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });

    return filtered;
  }, [tasks, activeTab, showCompleted, searchQuery, sortBy]);

  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return {
       overdue: tasks.filter(t => t.status === 'open' && t.dueDate < today).length,
       dueToday: tasks.filter(t => t.status === 'open' && t.dueDate === today).length,
       open: tasks.filter(t => t.status === 'open').length
    };
  }, [tasks]);

  const groupedTasks = useMemo(() => {
    // If sorting by priority, we don't group by date to avoid confusion
    if (sortBy === 'priority') return { 'All Tasks': filteredTasks };

    const groups: Record<string, Task[]> = { 'Overdue': [], 'Today': [], 'Tomorrow': [], 'Upcoming': [] };
    
    filteredTasks.forEach(task => {
       if (task.status === 'completed') {
          if (!groups['Completed']) groups['Completed'] = [];
          groups['Completed'].push(task);
       } else {
          const group = getRelativeDateGroup(task.dueDate);
          if (groups[group]) groups[group].push(task);
          else groups['Upcoming'].push(task);
       }
    });
    
    // Cleanup empty groups
    Object.keys(groups).forEach(key => {
        if (groups[key].length === 0) delete groups[key];
    });
    
    return groups;
  }, [filteredTasks, sortBy]);

  // --- Actions ---

  const handleToggleStatus = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: t.status === 'open' ? 'completed' : 'open' } : t));
  };

  const handleDelete = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const handleReschedule = (id: string, days: number) => {
     setTasks(prev => prev.map(t => {
        if (t.id === id) {
           const d = new Date();
           d.setDate(d.getDate() + days);
           return { ...t, dueDate: d.toISOString().split('T')[0] };
        }
        return t;
     }));
  };

  const openModal = (task?: Task) => {
     if (task) {
        setEditingTask({ ...task });
     } else {
        setEditingTask({
           title: '',
           type: 'todo',
           priority: 'medium',
           status: 'open',
           dueDate: new Date().toISOString().split('T')[0],
           description: ''
        });
     }
     setIsModalOpen(true);
  };

  const openEmailModal = (task: Task) => {
    const donor = MOCK_DONORS.find(d => d.id === task.donorId);
    setEmailDraft({
        to: donor ? donor.email : '',
        subject: `Follow up: ${task.title}`,
        body: `Hi ${donor ? donor.name.split(' ')[0] : 'there'},\n\nJust wanted to check in regarding...`
    });
    setIsEmailModalOpen(true);
  };

  const handleSendEmail = () => {
    setSendingEmail(true);
    setTimeout(() => {
        setSendingEmail(false);
        setIsEmailModalOpen(false);
        // Could auto-complete the task here if desired
    }, 1000);
  };

  const saveTask = () => {
     if (!editingTask.title) return;
     
     if (editingTask.id) {
        setTasks(prev => prev.map(t => t.id === editingTask.id ? { ...t, ...editingTask } as Task : t));
     } else {
        const newTask = {
           ...editingTask,
           id: `task-${Date.now()}`,
           createdAt: new Date().toISOString(),
           status: 'open'
        } as Task;
        setTasks(prev => [...prev, newTask]);
     }
     setIsModalOpen(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20 animate-in fade-in duration-500">
      
      {/* --- Page Header --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
         <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Tasks & Reminders</h1>
            <p className="text-slate-500 mt-1">Manage your outreach, follow-ups, and daily to-dos.</p>
         </div>
         <div className="flex gap-2 w-full md:w-auto">
            <Button onClick={() => openModal()} className="shadow-md bg-primary text-primary-foreground hover:bg-primary/90 w-full md:w-auto">
                <Plus className="mr-2 h-4 w-4" /> Create Task
            </Button>
         </div>
      </div>

      {/* --- Stats Cards --- */}
      <div className="grid grid-cols-3 gap-4">
         <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center justify-between group hover:border-red-200 transition-colors">
            <div>
               <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Overdue</p>
               <p className={cn("text-2xl font-bold mt-1", stats.overdue > 0 ? "text-red-600" : "text-slate-900")}>{stats.overdue}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-red-50 flex items-center justify-center text-red-600 group-hover:bg-red-100 transition-colors">
               <AlertCircle className="h-5 w-5" />
            </div>
         </div>
         <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center justify-between group hover:border-amber-200 transition-colors">
            <div>
               <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Due Today</p>
               <p className="text-2xl font-bold text-slate-900 mt-1">{stats.dueToday}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 group-hover:bg-amber-100 transition-colors">
               <Clock className="h-5 w-5" />
            </div>
         </div>
         <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center justify-between group hover:border-blue-200 transition-colors">
            <div>
               <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Open</p>
               <p className="text-2xl font-bold text-slate-900 mt-1">{stats.open}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-100 transition-colors">
               <Briefcase className="h-5 w-5" />
            </div>
         </div>
      </div>

      {/* --- Main Task Board --- */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
         
         {/* Toolbar */}
         <div className="p-4 border-b border-slate-100 flex flex-col lg:flex-row justify-between items-center gap-4 bg-white sticky top-0 z-20">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full lg:w-auto">
                <TabsList className="bg-slate-100/80 p-1 rounded-lg w-full lg:w-auto h-10 grid grid-cols-4 lg:flex">
                    <TabsTrigger value="all" className="text-xs font-medium rounded-md px-4 flex items-center gap-2">
                        <Briefcase className="h-3.5 w-3.5" /> All
                    </TabsTrigger>
                    <TabsTrigger value="calls" className="text-xs font-medium rounded-md px-4 flex items-center gap-2">
                        <Phone className="h-3.5 w-3.5" /> Calls
                    </TabsTrigger>
                    <TabsTrigger value="emails" className="text-xs font-medium rounded-md px-4 flex items-center gap-2">
                        <Mail className="h-3.5 w-3.5" /> Emails
                    </TabsTrigger>
                    <TabsTrigger value="todos" className="text-xs font-medium rounded-md px-4 flex items-center gap-2">
                        <CheckSquare className="h-3.5 w-3.5" /> To-Dos
                    </TabsTrigger>
                </TabsList>
            </Tabs>

            <div className="flex items-center gap-2 w-full lg:w-auto">
               <div className="relative flex-1 lg:w-64">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input 
                     placeholder="Search tasks..." 
                     className="pl-9 h-10 bg-white border-slate-200 focus:bg-slate-50 transition-colors" 
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                  />
               </div>
               
               <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                     <Button variant="outline" className="h-10 w-10 p-0 lg:w-auto lg:px-3 gap-2 bg-white border-slate-200 text-slate-600">
                        <Filter className="h-4 w-4" />
                        <span className="hidden lg:inline">View</span>
                     </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                     <DropdownMenuLabel>Filter & Sort</DropdownMenuLabel>
                     <DropdownMenuSeparator />
                     <DropdownMenuCheckboxItem 
                        checked={showCompleted} 
                        onCheckedChange={(c) => setShowCompleted(!!c)}
                     >
                        Show Completed
                     </DropdownMenuCheckboxItem>
                     <DropdownMenuSeparator />
                     <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Sort By</DropdownMenuLabel>
                     <DropdownMenuItem onClick={() => setSortBy('date')} className="justify-between">
                        Due Date {sortBy === 'date' && <CheckCircle2 className="h-3 w-3" />}
                     </DropdownMenuItem>
                     <DropdownMenuItem onClick={() => setSortBy('priority')} className="justify-between">
                        Priority {sortBy === 'priority' && <CheckCircle2 className="h-3 w-3" />}
                     </DropdownMenuItem>
                  </DropdownMenuContent>
               </DropdownMenu>
            </div>
         </div>

         {/* Task List */}
         <div className="flex-1 overflow-y-auto bg-slate-50/30">
            {filteredTasks.length === 0 ? (
               <div className="h-full flex flex-col items-center justify-center p-12 text-center text-muted-foreground space-y-4 min-h-[400px]">
                  <div className="h-20 w-20 bg-slate-100 rounded-full flex items-center justify-center mb-2 animate-in zoom-in-50 duration-500">
                     <CheckCircle2 className="h-10 w-10 text-slate-300" />
                  </div>
                  <div>
                     <p className="font-bold text-lg text-slate-900">All caught up!</p>
                     <p className="text-sm max-w-xs mx-auto">No tasks found. Create a new one to get started or adjust your filters.</p>
                  </div>
                  <Button variant="outline" onClick={() => { setSearchQuery(''); setActiveTab('all'); setShowCompleted(false); }}>
                    Reset Filters
                  </Button>
               </div>
            ) : (
               <div className="pb-8">
                   {Object.keys(groupedTasks).map(group => {
                      const tasksInGroup = groupedTasks[group];
                      return (
                         <div key={group} className="relative">
                            <div className={cn(
                               "sticky top-0 z-10 px-4 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center justify-between border-b border-slate-100 backdrop-blur-md shadow-sm",
                               group === 'Overdue' ? "text-red-700 bg-red-50/90 border-red-100" : 
                               group === 'Today' ? "text-amber-700 bg-amber-50/90 border-amber-100" : 
                               "text-slate-600 bg-slate-100/80"
                            )}>
                               <div className="flex items-center gap-2">
                                  {group === 'Overdue' && <AlertCircle className="h-3.5 w-3.5" />}
                                  {group === 'Today' && <Clock className="h-3.5 w-3.5" />}
                                  {group}
                               </div>
                               <Badge variant="secondary" className="bg-white/60 text-current border-transparent h-5 min-w-[1.25rem] justify-center px-1.5">{tasksInGroup.length}</Badge>
                            </div>
                            <AnimatePresence initial={false}>
                               {tasksInGroup.map(task => (
                                  <TaskItem 
                                     key={task.id} 
                                     task={task} 
                                     onToggle={handleToggleStatus}
                                     onEdit={(t) => openModal(t)}
                                     onDelete={handleDelete}
                                     onReschedule={handleReschedule}
                                     onFollowUp={(t) => openEmailModal(t)}
                                  />
                               ))}
                            </AnimatePresence>
                         </div>
                      );
                   })}
               </div>
            )}
         </div>
      </div>

      {/* --- Task Create/Edit Modal --- */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
         <DialogContent className="sm:max-w-[550px] gap-0 p-0 overflow-hidden">
            <DialogHeader className="px-6 py-5 border-b bg-slate-50/50">
               <DialogTitle className="flex items-center gap-2 text-xl">
                  <Briefcase className="h-5 w-5 text-slate-500" />
                  {editingTask.id ? 'Edit Task' : 'Create New Task'}
               </DialogTitle>
               <DialogDescription>
                  Stay organized by tracking your interactions and to-dos.
               </DialogDescription>
            </DialogHeader>
            
            <div className="p-6 space-y-6">
               <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-900">What needs to be done?</label>
                  <Input 
                     placeholder="e.g. Call Alice about the annual gala" 
                     value={editingTask.title || ''}
                     onChange={(e) => setEditingTask(prev => ({ ...prev, title: e.target.value }))}
                     autoFocus
                     className="font-medium h-11 text-base"
                  />
               </div>

               <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-2">
                     <label className="text-sm font-medium text-slate-700">Type</label>
                     <Select 
                        value={editingTask.type || 'todo'} 
                        onChange={(e) => setEditingTask(prev => ({ ...prev, type: e.target.value as Task['type'] }))}
                        className="h-10"
                     >
                        <option value="todo">To-Do</option>
                        <option value="call">Call</option>
                        <option value="email">Email</option>
                        <option value="meeting">Meeting</option>
                     </Select>
                  </div>
                  <div className="space-y-2">
                     <label className="text-sm font-medium text-slate-700">Priority</label>
                     <Select 
                        value={editingTask.priority || 'medium'} 
                        onChange={(e) => setEditingTask(prev => ({ ...prev, priority: e.target.value as Task['priority'] }))}
                        className="h-10"
                     >
                        <option value="high">High Priority</option>
                        <option value="medium">Medium Priority</option>
                        <option value="low">Low Priority</option>
                     </Select>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-2">
                     <label className="text-sm font-medium text-slate-700">Due Date</label>
                     <Input 
                        type="date"
                        value={editingTask.dueDate ? editingTask.dueDate.split('T')[0] : ''}
                        onChange={(e) => setEditingTask(prev => ({ ...prev, dueDate: e.target.value }))}
                        className="h-10"
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-sm font-medium text-slate-700">Linked Partner</label>
                     <Select 
                        value={editingTask.donorId || ''} 
                        onChange={(e) => setEditingTask(prev => ({ ...prev, donorId: e.target.value }))}
                        className="h-10"
                     >
                        <option value="">-- No Link --</option>
                        {MOCK_DONORS.map(d => (
                           <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                     </Select>
                  </div>
               </div>

               <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Additional Notes</label>
                  <Textarea 
                     placeholder="Add any extra details, context, or next steps..." 
                     className="min-h-[100px] resize-none bg-slate-50 border-slate-200"
                     value={editingTask.description || ''}
                     onChange={(e) => setEditingTask(prev => ({ ...prev, description: e.target.value }))}
                  />
               </div>
            </div>

            <DialogFooter className="px-6 py-4 border-t bg-slate-50/50">
               <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
               <Button onClick={saveTask} disabled={!editingTask.title} className="shadow-sm bg-primary hover:bg-primary/90">
                  {editingTask.id ? 'Save Changes' : 'Create Task'}
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>

      {/* --- Email Compose Modal --- */}
      <Dialog open={isEmailModalOpen} onOpenChange={setIsEmailModalOpen}>
         <DialogContent className="sm:max-w-[600px] gap-0 p-0 overflow-hidden shadow-2xl border-slate-200">
            <DialogHeader className="px-6 py-4 border-b bg-slate-50/80 backdrop-blur-sm">
               <DialogTitle className="flex items-center gap-2">
                  <div className="p-1.5 bg-blue-100 rounded-md">
                    <Mail className="h-4 w-4 text-blue-600" />
                  </div>
                  Compose Message
               </DialogTitle>
            </DialogHeader>
            <div className="p-6 space-y-4">
               <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Recipient</label>
                  <Input 
                    value={emailDraft.to} 
                    onChange={(e) => setEmailDraft({...emailDraft, to: e.target.value})} 
                    className="bg-white border-slate-200 h-10"
                    placeholder="recipient@example.com" 
                  />
               </div>
               <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Subject</label>
                  <Input 
                    value={emailDraft.subject} 
                    onChange={(e) => setEmailDraft({...emailDraft, subject: e.target.value})} 
                    className="bg-white border-slate-200 font-medium h-10"
                    placeholder="Subject line..." 
                  />
               </div>
               <div className="space-y-2 pt-2">
                  <Textarea 
                     value={emailDraft.body} 
                     onChange={(e) => setEmailDraft({...emailDraft, body: e.target.value})} 
                     className="min-h-[250px] p-4 text-base leading-relaxed border-slate-200 focus:border-blue-400 focus:ring-blue-100" 
                     placeholder="Write your message here..."
                  />
               </div>
            </div>
            <DialogFooter className="px-6 py-4 border-t bg-slate-50/50 flex justify-between items-center">
               <Button variant="ghost" onClick={() => setIsEmailModalOpen(false)} className="text-slate-500">Discard</Button>
               <Button onClick={handleSendEmail} disabled={sendingEmail || !emailDraft.to} className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-md">
                  {sendingEmail ? 'Sending...' : <><Send className="h-4 w-4" /> Send Email</>}
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
    </div>
  );
};
