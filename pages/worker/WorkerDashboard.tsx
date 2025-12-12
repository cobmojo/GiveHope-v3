
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/Avatar';
import { MOCK_TASKS } from '../../lib/mock';
import { 
  ArrowUpRight, TrendingUp, AlertCircle, Circle, ArrowRight, 
  Users, Activity, CheckCircle2, DollarSign, Calendar, 
  MoreHorizontal, Plus, FileText
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { cn, formatCurrency } from '../../lib/utils';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// --- Mock Data ---

const THIRTEEN_MONTH_DATA = [
    { name: 'Nov 23', recurring: 3200, online: 800, check: 400 },
    { name: 'Dec 23', recurring: 3300, online: 2500, check: 1200 },
    { name: 'Jan 24', recurring: 3400, online: 600, check: 300 },
    { name: 'Feb 24', recurring: 3450, online: 500, check: 300 },
    { name: 'Mar 24', recurring: 3500, online: 900, check: 400 },
    { name: 'Apr 24', recurring: 3550, online: 700, check: 350 },
    { name: 'May 24', recurring: 3600, online: 800, check: 500 },
    { name: 'Jun 24', recurring: 3650, online: 1200, check: 400 },
    { name: 'Jul 24', recurring: 3700, online: 900, check: 300 },
    { name: 'Aug 24', recurring: 3800, online: 1100, check: 600 },
    { name: 'Sep 24', recurring: 3900, online: 1300, check: 500 },
    { name: 'Oct 24', recurring: 4100, online: 1500, check: 800 },
    { name: 'Nov 24', recurring: 4200, online: 1800, check: 1200 },
];

const LABELS: Record<string, string> = {
    recurring: "Recurring",
    online: "One-Time",
    check: "Offline"
};

const ALERTS = [
    { id: 1, text: "3 recurring gifts failed this week", severity: "high" },
    { id: 2, text: "Pledge from Church of Grace is past due", severity: "medium" }
];

const RECENT_POSTS = [
    { id: 1, content: "We are thrilled to announce that the new well in the northern village is fully operational!", time: "2h ago", image: null },
    { id: 2, content: "Please pray for our medical supply shipment held at customs.", time: "1d ago", image: null }
];

// --- Custom Chart Components ---

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const total = payload.reduce((acc: number, curr: any) => acc + curr.value, 0);
        return (
            <div className="bg-white border border-slate-200 p-3 rounded-lg shadow-xl text-sm min-w-[150px] z-50">
                <p className="font-semibold text-slate-900 mb-2 border-b border-slate-100 pb-1">{label}</p>
                <div className="space-y-1.5">
                    {payload.slice().reverse().map((entry: any, index: number) => (
                        <div key={index} className="flex items-center gap-2 justify-between">
                            <div className="flex items-center gap-2">
                                <div 
                                    className="w-2 h-2 rounded-full" 
                                    style={{ backgroundColor: entry.color }}
                                />
                                <span className="text-slate-500 text-xs">
                                    {LABELS[entry.name] || entry.name}
                                </span>
                            </div>
                            <span className="font-medium text-slate-900 text-xs tabular-nums">
                                ${entry.value.toLocaleString()}
                            </span>
                        </div>
                    ))}
                </div>
                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="font-semibold text-slate-900 text-xs">Total</span>
                    <span className="font-bold text-slate-900 text-sm tabular-nums">
                        ${total.toLocaleString()}
                    </span>
                </div>
            </div>
        );
    }
    return null;
};

const CustomLegend = (props: any) => {
    const { payload } = props;
    return (
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-4 pt-4 border-t border-slate-100/50">
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-xs font-medium text-slate-600">
                {LABELS[entry.value] || entry.value}
            </span>
          </div>
        ))}
      </div>
    );
};

const getPriorityColor = (priority: string) => {
    switch(priority) {
        case 'high': return 'bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.4)]';
        case 'medium': return 'bg-amber-500';
        case 'low': return 'bg-blue-400';
        default: return 'bg-slate-300';
    }
};

export const WorkerDashboard: React.FC = () => {
  const [tasks, setTasks] = useState(MOCK_TASKS);
  const [completing, setCompleting] = useState<string | null>(null);

  const completeTask = (id: string) => {
    setCompleting(id);
    // Wait for the visual "check" animation before removing
    setTimeout(() => {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, status: 'completed' } : t));
        setCompleting(null);
    }, 400); 
  };

  const openTasks = tasks.filter(t => t.status === 'open');

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500 pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
            <p className="text-slate-500 mt-1 text-sm md:text-base">Overview of your ministry support.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
             <Button variant="outline" className="flex-1 md:flex-none bg-white hover:bg-slate-50 border-slate-200 text-slate-700 shadow-sm" asChild>
                <Link to="/worker-dashboard/reports">
                    <FileText className="mr-2 h-4 w-4" /> Report
                </Link>
             </Button>
             <Button className="flex-1 md:flex-none px-6 bg-slate-900 hover:bg-slate-800 text-white shadow-md" asChild>
                <Link to="/worker-dashboard/gifts">
                    <Plus className="mr-2 h-4 w-4" /> Add Donation
                </Link>
             </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN (Main Content) */}
        <div className="lg:col-span-8 space-y-6">
            
            {/* MAIN CHART: Giving Breakdown */}
            <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-100 space-y-0 px-4 md:px-6 bg-slate-50/30">
                    <div>
                        <CardTitle className="text-base font-bold text-slate-900">Giving Breakdown</CardTitle>
                        <CardDescription className="text-xs hidden md:block mt-1">
                            Monthly support by type over the last 13 months.
                        </CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 text-xs text-slate-500 hover:text-slate-900 font-medium" asChild>
                        <Link to="/worker-dashboard/analytics">View Analytics</Link>
                    </Button>
                </CardHeader>
                <CardContent className="pt-6 pl-0 pr-4 md:pr-6 md:pl-2">
                    <div className="h-[300px] md:h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={THIRTEEN_MONTH_DATA} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis 
                                    dataKey="name" 
                                    stroke="#94a3b8" 
                                    fontSize={10} 
                                    tickLine={false} 
                                    axisLine={false} 
                                    dy={10}
                                    minTickGap={20}
                                />
                                <YAxis 
                                    stroke="#94a3b8" 
                                    fontSize={10} 
                                    tickLine={false} 
                                    axisLine={false} 
                                    tickFormatter={(value) => `$${value}`} 
                                    dx={-5}
                                    width={45}
                                />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc', opacity: 0.8 }} />
                                <Legend content={<CustomLegend />} />
                                
                                <Bar dataKey="recurring" stackId="a" fill="#0f172a" radius={[0, 0, 0, 0]} maxBarSize={40} />
                                <Bar dataKey="online" stackId="a" fill="#64748b" radius={[0, 0, 0, 0]} maxBarSize={40} />
                                <Bar dataKey="check" stackId="a" fill="#e2e8f0" radius={[4, 4, 0, 0]} maxBarSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* HERO CARD: Monthly Goal */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="md:col-span-2 bg-slate-950 text-white border-slate-800 shadow-lg relative overflow-hidden group">
                    {/* Abstract background element */}
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-slate-800/50 to-transparent rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl pointer-events-none opacity-60" />
                    
                    <CardContent className="p-6 md:p-8 relative z-10">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h2 className="text-slate-400 font-bold text-xs md:text-sm uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <Activity className="w-4 h-4 text-emerald-500" /> Monthly Support Goal
                                </h2>
                                <div className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-3">
                                    <span className="text-4xl md:text-5xl font-bold tracking-tighter text-white">$4,560</span>
                                    <span className="text-slate-500 text-lg md:text-xl font-medium">/ $6,000</span>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                <Badge variant="outline" className="border-slate-800 text-emerald-400 px-3 py-1 text-xs font-semibold bg-slate-900/50 backdrop-blur-md">
                                    On Track
                                </Badge>
                            </div>
                        </div>

                        <div className="mb-8">
                             <div className="flex justify-between text-xs mb-3 text-slate-400 font-medium">
                                <span className="text-white">76% Funded</span>
                                <span>$1,440 remaining</span>
                             </div>
                             <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-800/50">
                                <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(16,185,129,0.5)]" style={{ width: '76%' }} />
                             </div>
                        </div>

                        <div className="flex flex-wrap gap-y-6 gap-x-12 pt-8 border-t border-slate-800/60">
                            <div className="flex flex-col gap-1 min-w-[100px]">
                                <span className="text-slate-500 text-[10px] uppercase tracking-wider font-bold">New Partners</span>
                                <span className="text-xl font-bold text-white tracking-tight">+12</span>
                            </div>
                            <div className="flex flex-col gap-1 min-w-[100px]">
                                <span className="text-slate-500 text-[10px] uppercase tracking-wider font-bold">Active Donors</span>
                                <span className="text-xl font-bold text-white tracking-tight">142</span>
                            </div>
                             <div className="flex flex-col gap-1 min-w-[100px]">
                                <span className="text-slate-500 text-[10px] uppercase tracking-wider font-bold">MoM Growth</span>
                                <span className="text-xl font-bold text-emerald-400 flex items-center gap-1 tracking-tight">
                                    <TrendingUp size={16} /> 12%
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* SECONDARY METRICS ROW */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
                {[
                    { label: "Given this month", value: "$4,850", trend: "+12%", icon: DollarSign, trendColor: "text-emerald-600 bg-emerald-50 border-emerald-100" },
                    { label: "Last month total", value: "$4,320", trend: null, icon: Calendar, trendColor: "" },
                    { label: "YTD Total", value: "$54.2k", trend: null, icon: Activity, trendColor: "" }
                ].map((metric, i) => (
                    <Card key={i} className="hover:border-slate-300 transition-colors cursor-pointer group bg-white shadow-sm border-slate-200">
                        <CardContent className="p-5">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2.5 bg-slate-50 text-slate-600 rounded-lg border border-slate-100 group-hover:bg-white group-hover:shadow-sm transition-all">
                                    <metric.icon size={18} />
                                </div>
                                {metric.trend && (
                                    <span className={cn("flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full border", metric.trendColor)}>
                                        {metric.trend}
                                    </span>
                                )}
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{metric.value}</h3>
                                <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">{metric.label}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

        </div>

        {/* RIGHT COLUMN (Sidebar) */}
        <div className="lg:col-span-4 space-y-6">
            
            {/* TASKS & ALERTS */}
            <Card className="flex flex-col h-auto border-slate-200 shadow-sm bg-white overflow-hidden">
                <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50 space-y-0 pt-4 px-5">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-bold text-slate-900 uppercase tracking-wider">Tasks & Alerts</CardTitle>
                        <Badge variant="secondary" className="bg-white hover:bg-white text-slate-600 border border-slate-200 text-[10px] shadow-sm">{openTasks.length} Pending</Badge>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="flex flex-col">
                        {/* Alerts Section */}
                        {ALERTS.length > 0 && (
                            <div className="p-4 bg-red-50/50 space-y-3 border-b border-red-100">
                                {ALERTS.map(alert => (
                                    <div key={alert.id} className="flex gap-3 items-start">
                                        <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                                        <p className="text-xs font-semibold text-red-900 leading-snug">{alert.text}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Tasks List */}
                        <div className="divide-y divide-slate-100">
                             <AnimatePresence initial={false} mode='popLayout'>
                                 {openTasks.slice(0, 5).map(task => (
                                    <motion.div 
                                        key={task.id} 
                                        layout
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0, marginTop: 0, marginBottom: 0, padding: 0, overflow: "hidden" }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                        className="group p-4 hover:bg-slate-50 transition-colors flex items-start gap-3 cursor-pointer overflow-hidden"
                                        onClick={() => completeTask(task.id)}
                                    >
                                        <button 
                                            className={cn(
                                                "transition-all duration-300 mt-0.5",
                                                completing === task.id ? "text-emerald-500 scale-110" : "text-slate-300 hover:text-slate-800"
                                            )}
                                        >
                                            {completing === task.id ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                                        </button>
                                        <div className="flex-1 min-w-0">
                                            <p className={cn("text-sm font-semibold transition-colors truncate", completing === task.id ? "text-slate-400 line-through" : "text-slate-700 group-hover:text-slate-900")}>
                                                {task.title}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className={cn("inline-block w-2 h-2 rounded-full", getPriorityColor(task.priority))} />
                                                <span className="text-[10px] text-slate-400 font-medium">Due {new Date(task.dueDate).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                             </AnimatePresence>
                             {openTasks.length === 0 && (
                                <div className="p-6 text-center text-sm text-slate-400 italic">All caught up!</div>
                             )}
                        </div>
                    </div>
                    <div className="p-2 border-t border-slate-100 bg-slate-50/30">
                        <Button variant="ghost" size="sm" className="w-full text-xs text-slate-500 hover:text-slate-900 h-8 justify-between group font-medium" asChild>
                            <Link to="/worker-dashboard/tasks">
                                View All Tasks <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* MINI FEED */}
            <Card className="border-slate-200 shadow-sm bg-white">
                <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0 pt-4 px-5 border-b border-slate-100">
                    <CardTitle className="text-sm font-bold text-slate-900 uppercase tracking-wider">Latest Updates</CardTitle>
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-slate-900" asChild>
                        <Link to="/worker-dashboard/feed">
                            <ArrowUpRight className="h-3.5 w-3.5" />
                        </Link>
                    </Button>
                </CardHeader>
                <CardContent className="space-y-4 pt-4 px-5 pb-5">
                    {RECENT_POSTS.map(post => (
                        <div key={post.id} className="group flex gap-3">
                            <div className="relative shrink-0">
                                <Avatar className="h-8 w-8 border border-slate-200">
                                    <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?fit=facearea&facepad=2&w=256&h=256&q=80" />
                                    <AvatarFallback className="text-[10px] bg-slate-100 text-slate-600 font-bold">MF</AvatarFallback>
                                </Avatar>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="bg-slate-50 rounded-lg rounded-tl-none p-3 border border-slate-100 group-hover:border-slate-200 transition-colors">
                                    <p className="text-xs text-slate-700 line-clamp-2 leading-relaxed">{post.content}</p>
                                </div>
                                <p className="text-[10px] text-slate-400 mt-1 ml-1 font-medium">{post.time}</p>
                            </div>
                        </div>
                    ))}
                    <Button variant="outline" className="w-full text-xs h-9 border-dashed border-slate-300 text-slate-500 hover:text-slate-900 hover:bg-slate-50 hover:border-slate-400 font-medium" asChild>
                        <Link to="/worker-dashboard/feed">Compose Update</Link>
                    </Button>
                </CardContent>
            </Card>

        </div>

      </div>
    </div>
  );
};
