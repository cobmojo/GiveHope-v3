
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { formatCurrency } from '../../lib/utils';
import { ArrowUpRight, ArrowDownRight, TrendingUp, DollarSign, Users, Repeat } from 'lucide-react';

const donationData = [
  { month: 'Jan', amount: 2400 },
  { month: 'Feb', amount: 1398 },
  { month: 'Mar', amount: 9800 },
  { month: 'Apr', amount: 3908 },
  { month: 'May', amount: 4800 },
  { month: 'Jun', amount: 3800 },
  { month: 'Jul', amount: 4300 },
  { month: 'Aug', amount: 5300 },
  { month: 'Sep', amount: 4800 },
  { month: 'Oct', amount: 6100 },
  { month: 'Nov', amount: 7200 },
  { month: 'Dec', amount: 8400 },
];

const donorTypeData = [
  { name: 'Recurring', value: 45 },
  { name: 'One-Time', value: 55 },
];

const COLORS = ['#2563eb', '#94a3b8']; // Blue-600, Slate-400

export const WorkerAnalytics: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
         <h1 className="text-2xl font-bold tracking-tight text-slate-900">Analytics & Reports</h1>
         <div className="text-sm text-muted-foreground">Data for last 12 months</div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow duration-300">
          <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
            <DollarSign className="h-24 w-24 -rotate-12 text-slate-900" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-slate-600">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-2xl font-bold text-slate-900">{formatCurrency(62206)}</div>
            <p className="text-xs text-slate-500 flex items-center mt-1">
              <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
              +20.1% from last year
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow duration-300">
          <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
            <TrendingUp className="h-24 w-24 -rotate-12 text-blue-600" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-slate-600">Average Gift</CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-2xl font-bold text-slate-900">{formatCurrency(145)}</div>
            <p className="text-xs text-slate-500 flex items-center mt-1">
              <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
               +4% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow duration-300">
          <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
            <Users className="h-24 w-24 -rotate-12 text-indigo-600" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-slate-600">New Donors</CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-2xl font-bold text-slate-900">+12</div>
            <p className="text-xs text-slate-500 flex items-center mt-1">
               <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
               -2 from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow duration-300">
          <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
            <Repeat className="h-24 w-24 -rotate-12 text-amber-500" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-slate-600">Recurring Rate</CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-2xl font-bold text-slate-900">45%</div>
            <p className="text-xs text-slate-500 mt-1">
              of total volume
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Main Trend Chart */}
        <Card className="col-span-4 border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Donation Trends</CardTitle>
          </CardHeader>
          <CardContent className="pl-0">
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={donationData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} stroke="#64748b" />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} stroke="#64748b" />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <Tooltip 
                     contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                     formatter={(value: number) => [formatCurrency(value), 'Amount']}
                  />
                  <Area type="monotone" dataKey="amount" stroke="#2563eb" fillOpacity={1} fill="url(#colorAmt)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Breakdown Chart */}
        <Card className="col-span-3 border-slate-200 shadow-sm">
            <CardHeader>
                <CardTitle>Giving Type</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full flex flex-col items-center justify-center">
                     <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={donorTypeData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {donorTypeData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                            <Legend verticalAlign="bottom" height={36}/>
                        </PieChart>
                     </ResponsiveContainer>
                     <div className="text-sm text-center text-slate-500 mt-4 px-4">
                        Recurring donations provide stability, while one-time gifts often spike during campaigns.
                     </div>
                </div>
            </CardContent>
        </Card>
      </div>
      
      {/* Additional Stats / Table Area */}
      <Card className="border-slate-200 shadow-sm">
          <CardHeader>
              <CardTitle>Top Performing Months</CardTitle>
          </CardHeader>
          <CardContent>
              <div className="space-y-4">
                  {donationData.sort((a,b) => b.amount - a.amount).slice(0, 3).map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                          <div className="flex items-center gap-4">
                              <div className="h-10 w-10 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                                  {idx + 1}
                              </div>
                              <div>
                                  <div className="font-semibold text-slate-900">{item.month}</div>
                                  <div className="text-xs text-slate-500">High volume period</div>
                              </div>
                          </div>
                          <div className="font-bold text-lg text-slate-900">{formatCurrency(item.amount)}</div>
                      </div>
                  ))}
              </div>
          </CardContent>
      </Card>
    </div>
  );
};
