
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from '../../components/ui/Button';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download, Users, DollarSign, Activity, Globe } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';

// --- Types ---

interface RevenueData {
  name: string;
  amt: number;
}

interface ActivityLog {
  id: string;
  user: string;
  initials: string;
  action: string;
  amount: number;
  bgColor: string;
  textColor: string;
}

// --- Mock Data ---

const REVENUE_DATA: RevenueData[] = [
  { name: 'Jan', amt: 1250000 },
  { name: 'Feb', amt: 1420000 },
  { name: 'Mar', amt: 1180000 },
  { name: 'Apr', amt: 1678000 },
  { name: 'May', amt: 1989000 },
  { name: 'Jun', amt: 2139000 },
  { name: 'Jul', amt: 2249000 },
  { name: 'Aug', amt: 1980000 },
  { name: 'Sep', amt: 2420000 },
  { name: 'Oct', amt: 2810000 },
  { name: 'Nov', amt: 3240000 },
  { name: 'Dec', amt: 4150000 },
];

const RECENT_ACTIVITY: ActivityLog[] = [
  { 
    id: 'act-1',
    user: 'Olivia Martin', 
    initials: 'OM', 
    action: 'New monthly donor pledge', 
    amount: 1999.00,
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-700'
  },
  { 
    id: 'act-2',
    user: 'Jackson Lee', 
    initials: 'JL', 
    action: 'Campaign donation: Water Project', 
    amount: 39.00,
    bgColor: 'bg-slate-100',
    textColor: 'text-slate-700'
  },
  { 
    id: 'act-3',
    user: 'Isabella Nguyen', 
    initials: 'IN', 
    action: 'New monthly donor', 
    amount: 299.00,
    bgColor: 'bg-indigo-100',
    textColor: 'text-indigo-700'
  },
  { 
    id: 'act-4',
    user: 'William Kim', 
    initials: 'WK', 
    action: 'One-time gift', 
    amount: 150.00,
    bgColor: 'bg-orange-100',
    textColor: 'text-orange-700'
  },
  { 
    id: 'act-5',
    user: 'Sofia Davis', 
    initials: 'SD', 
    action: 'Recurring donation processed', 
    amount: 50.00,
    bgColor: 'bg-pink-100',
    textColor: 'text-pink-700'
  }
];

export const AdminDashboard: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
           <h2 className="text-3xl font-bold tracking-tight text-slate-900">Mission Control</h2>
           <p className="text-muted-foreground">Global overview of organization performance and impact.</p>
        </div>
        <div className="flex gap-2">
             <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4"/> Export Report
            </Button>
            <Button variant="secondary" asChild size="sm">
                <Link to="/">
                    <ArrowLeft className="mr-2 h-4 w-4"/> Back to Site
                </Link>
            </Button>
        </div>
      </div>
      
      {/* Top Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Revenue (YTD)</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">$26,450,231</div>
            <p className="text-xs text-green-600 font-medium mt-1">+24.1% from last year</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Active Donors</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">42,350</div>
            <p className="text-xs text-green-600 font-medium mt-1">+1,240 this month</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Field Workers</CardTitle>
            <Globe className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">1,203</div>
            <p className="text-xs text-slate-500 mt-1">Deployed in 64 countries</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Active Now</CardTitle>
            <Activity className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">842</div>
            <p className="text-xs text-slate-500 mt-1">Users online</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        {/* Main Chart */}
        <Card className="col-span-4 shadow-sm">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={REVENUE_DATA}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                  <Tooltip 
                     cursor={{fill: 'transparent'}} 
                     contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                     formatter={(value: number) => [`${formatCurrency(value)}`, 'Revenue']}
                  />
                  <Bar dataKey="amt" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-slate-900" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Activity Feed */}
        <Card className="col-span-3 shadow-sm">
          <CardHeader>
            <CardTitle>Live Activity Feed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {RECENT_ACTIVITY.map((activity) => (
                <div key={activity.id} className="flex items-center">
                   <div className={`h-9 w-9 rounded-full flex items-center justify-center font-bold mr-4 ${activity.bgColor} ${activity.textColor}`}>
                      {activity.initials}
                   </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{activity.user}</p>
                    <p className="text-sm text-muted-foreground">{activity.action}</p>
                  </div>
                  <div className="ml-auto font-medium text-green-600">+{formatCurrency(activity.amount)}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
