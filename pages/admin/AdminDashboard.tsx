
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Button } from '../../components/ui/Button';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download, Users, DollarSign, Activity, Globe, MoreHorizontal, Calendar, ArrowUpRight } from 'lucide-react';
import { formatCurrency, cn } from '../../lib/utils';
import { Badge } from '../../components/ui/Badge';

// --- Types ---

interface RevenueBreakdown {
  name: string;
  recurring: number;
  oneTime: number;
  offline: number;
}

interface ActivityLog {
  id: string;
  user: string;
  initials: string;
  action: string;
  amount: number;
  bgColor: string;
  textColor: string;
  time: string;
}

// --- Mock Data ---

const REVENUE_BREAKDOWN_DATA: RevenueBreakdown[] = [
  { name: 'Jan', recurring: 280000, oneTime: 120000, offline: 40000 },
  { name: 'Feb', recurring: 290000, oneTime: 135000, offline: 45000 },
  { name: 'Mar', recurring: 300000, oneTime: 80000, offline: 35000 },
  { name: 'Apr', recurring: 310000, oneTime: 180000, offline: 60000 },
  { name: 'May', recurring: 320000, oneTime: 250000, offline: 80000 },
  { name: 'Jun', recurring: 330000, oneTime: 290000, offline: 85000 },
  { name: 'Jul', recurring: 340000, oneTime: 310000, offline: 90000 },
  { name: 'Aug', recurring: 350000, oneTime: 220000, offline: 75000 },
  { name: 'Sep', recurring: 360000, oneTime: 350000, offline: 95000 },
  { name: 'Oct', recurring: 370000, oneTime: 450000, offline: 110000 },
  { name: 'Nov', recurring: 385000, oneTime: 520000, offline: 150000 },
  { name: 'Dec', recurring: 400000, oneTime: 750000, offline: 220000 },
];

const RECENT_ACTIVITY: ActivityLog[] = [
  { 
    id: 'act-1',
    user: 'Olivia Martin', 
    initials: 'OM', 
    action: 'New monthly donor pledge', 
    amount: 1999.00,
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-700',
    time: '2 min ago'
  },
  { 
    id: 'act-2',
    user: 'Jackson Lee', 
    initials: 'JL', 
    action: 'Campaign donation: Water Project', 
    amount: 39.00,
    bgColor: 'bg-slate-100',
    textColor: 'text-slate-700',
    time: '15 min ago'
  },
  { 
    id: 'act-3',
    user: 'Isabella Nguyen', 
    initials: 'IN', 
    action: 'New monthly donor', 
    amount: 299.00,
    bgColor: 'bg-indigo-100',
    textColor: 'text-indigo-700',
    time: '45 min ago'
  },
  { 
    id: 'act-4',
    user: 'William Kim', 
    initials: 'WK', 
    action: 'One-time gift', 
    amount: 150.00,
    bgColor: 'bg-orange-100',
    textColor: 'text-orange-700',
    time: '2 hours ago'
  },
  { 
    id: 'act-5',
    user: 'Sofia Davis', 
    initials: 'SD', 
    action: 'Recurring donation processed', 
    amount: 50.00,
    bgColor: 'bg-pink-100',
    textColor: 'text-pink-700',
    time: '3 hours ago'
  }
];

const LABELS: Record<string, string> = {
    recurring: "Recurring",
    oneTime: "One-Time",
    offline: "Offline"
};

// Use exact colors from user request if visible, otherwise these are standard
const CHART_COLORS: Record<string, string> = {
    recurring: "#0f172a", // Slate 950 (Darkest)
    oneTime: "#3b82f6",   // Blue 500 (Vibrant)
    offline: "#e2e8f0"    // Slate 200 (Lightest)
};

// --- Custom Chart Components ---

const formatYAxis = (value: number) => {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}m`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}k`;
  return `$${value}`;
};

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const total = payload.reduce((acc: number, curr: any) => acc + curr.value, 0);
        return (
            <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] text-sm min-w-[200px] z-50 animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                    <p className="font-bold text-slate-900">{label} 2024</p>
                    <span className="text-xs text-slate-400 font-medium">Monthly Total</span>
                </div>
                <div className="space-y-2.5">
                    {payload.slice().reverse().map((entry: any, index: number) => {
                        const percent = Math.round((entry.value / total) * 100);
                        return (
                            <div key={index} className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-2">
                                    <div 
                                        className="w-2 h-2 rounded-full ring-2 ring-white shadow-sm" 
                                        style={{ backgroundColor: entry.color }}
                                    />
                                    <span className="text-slate-600 text-xs font-medium">
                                        {LABELS[entry.name] || entry.name}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] text-slate-400 w-6 text-right">{percent}%</span>
                                    <span className="font-semibold text-slate-900 text-xs tabular-nums w-16 text-right">
                                        {formatCurrency(entry.value)}
                                    </span>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="font-bold text-slate-700 text-xs uppercase tracking-wider">Total</span>
                    <span className="font-bold text-emerald-600 text-sm tabular-nums">
                        {formatCurrency(total)}
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
      <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 mt-6">
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center gap-2 group cursor-pointer hover:opacity-80 transition-opacity">
            <div 
                className="w-3 h-3 rounded-full shadow-sm border border-slate-100" 
                style={{ backgroundColor: entry.color }} 
            />
            <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">
                {LABELS[entry.value] || entry.value}
            </span>
          </div>
        ))}
      </div>
    );
};

export const AdminDashboard: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
           <h2 className="text-3xl font-bold tracking-tight text-slate-900">Mission Control</h2>
           <p className="text-slate-500 mt-1">Global overview of organization performance and impact.</p>
        </div>
        <div className="flex gap-2">
             <Button variant="outline" size="sm" className="bg-white border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50 shadow-sm">
                <Calendar className="mr-2 h-4 w-4 text-slate-400"/> Last 12 Months
            </Button>
             <Button variant="outline" size="sm" className="bg-white border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50 shadow-sm">
                <Download className="mr-2 h-4 w-4 text-slate-400"/> Export Report
            </Button>
            <Button variant="secondary" asChild size="sm" className="bg-slate-100 text-slate-900 hover:bg-slate-200">
                <Link to="/">
                    <ArrowLeft className="mr-2 h-4 w-4"/> Back to Site
                </Link>
            </Button>
        </div>
      </div>
      
      {/* Top Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm border-slate-200 bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Revenue (YTD)</CardTitle>
            <div className="p-2 bg-emerald-50 rounded-lg">
                <DollarSign className="h-4 w-4 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">$26,450,231</div>
            <div className="flex items-center gap-1 mt-1">
                <Badge variant="success" className="bg-emerald-50 text-emerald-700 border-emerald-200 px-1.5 py-0 text-[10px]">+24.1%</Badge>
                <span className="text-xs text-slate-400">from last year</span>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-slate-200 bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Active Donors</CardTitle>
            <div className="p-2 bg-blue-50 rounded-lg">
                <Users className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">42,350</div>
            <div className="flex items-center gap-1 mt-1">
                <Badge variant="success" className="bg-emerald-50 text-emerald-700 border-emerald-200 px-1.5 py-0 text-[10px]">+1,240</Badge>
                <span className="text-xs text-slate-400">this month</span>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-slate-200 bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Field Workers</CardTitle>
            <div className="p-2 bg-indigo-50 rounded-lg">
                <Globe className="h-4 w-4 text-indigo-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">1,203</div>
            <p className="text-xs text-slate-500 mt-1">Deployed in 64 countries</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-slate-200 bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Active Now</CardTitle>
            <div className="p-2 bg-amber-50 rounded-lg">
                <Activity className="h-4 w-4 text-amber-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">842</div>
            <p className="text-xs text-slate-500 mt-1">Users online</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        
        {/* Main Chart */}
        <Card className="col-span-4 shadow-sm border-slate-200 bg-white overflow-hidden flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 bg-slate-50/30 pb-4">
            <div>
                <CardTitle className="text-base font-bold text-slate-900">Revenue Breakdown</CardTitle>
                <CardDescription className="text-xs text-slate-500 mt-1">Monthly revenue by source (Recurring, One-Time, Offline)</CardDescription>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900">
                <MoreHorizontal className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="pl-2 pt-8 pr-8 pb-6 flex-1">
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={REVENUE_BREAKDOWN_DATA} margin={{ top: 0, right: 0, left: 0, bottom: 0 }} barSize={32}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#94a3b8" 
                    fontSize={11} 
                    tickLine={false} 
                    axisLine={false} 
                    dy={12}
                  />
                  <YAxis 
                    stroke="#94a3b8" 
                    fontSize={11} 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={formatYAxis} 
                    dx={-10}
                    width={40}
                  />
                  <Tooltip 
                     cursor={{fill: '#f8fafc', opacity: 0.8}} 
                     content={<CustomTooltip />}
                  />
                  <Legend content={<CustomLegend />} />
                  
                  {/* Stacked Bars */}
                  <Bar dataKey="recurring" stackId="a" fill={CHART_COLORS.recurring} radius={[0, 0, 0, 0]} />
                  <Bar dataKey="oneTime" stackId="a" fill={CHART_COLORS.oneTime} radius={[0, 0, 0, 0]} />
                  <Bar dataKey="offline" stackId="a" fill={CHART_COLORS.offline} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Activity Feed */}
        <Card className="col-span-3 shadow-sm border-slate-200 bg-white flex flex-col h-full">
          <CardHeader className="border-b border-slate-100 bg-slate-50/30 pb-4">
            <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold text-slate-900">Live Activity Feed</CardTitle>
                <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Real-time</span>
                </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-0 overflow-auto max-h-[400px]">
            <div className="divide-y divide-slate-100">
              {RECENT_ACTIVITY.map((activity) => (
                <div key={activity.id} className="flex items-start p-4 hover:bg-slate-50 transition-colors group cursor-default">
                   <div className={cn("h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs mr-3 shrink-0 transition-transform group-hover:scale-105", activity.bgColor, activity.textColor)}>
                      {activity.initials}
                   </div>
                  <div className="space-y-0.5 min-w-0 flex-1">
                    <div className="flex justify-between">
                        <p className="text-xs font-bold text-slate-900 truncate">{activity.user}</p>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap">{activity.time}</span>
                    </div>
                    <p className="text-xs text-slate-500 truncate">{activity.action}</p>
                  </div>
                  <div className="ml-3 font-bold text-xs text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-100 whitespace-nowrap self-start">
                    +{formatCurrency(activity.amount)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <div className="p-3 border-t border-slate-100 bg-slate-50/30 text-center">
             <Button variant="ghost" size="sm" className="text-xs text-slate-500 hover:text-slate-900 w-full h-8 group">
                View All Activity <ArrowUpRight className="ml-1 h-3 w-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
             </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
