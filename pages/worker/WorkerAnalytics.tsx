
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { Progress } from '../../components/ui/Progress';
import { formatCurrency } from '../../lib/utils';
import { ArrowUpRight, ArrowDownRight, TrendingUp, DollarSign, Users, Repeat, Target, Activity, Sparkles, Loader2, FileText } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { motion, AnimatePresence } from 'framer-motion';

// --- Mock Data ---

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

const engagementData = [
  { month: 'Jun', new: 12, retained: 140, lapsed: 5 },
  { month: 'Jul', new: 15, retained: 138, lapsed: 8 },
  { month: 'Aug', new: 22, retained: 145, lapsed: 4 },
  { month: 'Sep', new: 18, retained: 155, lapsed: 6 },
  { month: 'Oct', new: 25, retained: 160, lapsed: 3 },
  { month: 'Nov', new: 30, retained: 175, lapsed: 5 },
];

const campaignData = [
  { name: 'Clean Water Initiative', raised: 12500, goal: 15000, donors: 84, daysLeft: 12 },
  { name: 'Back to School Drive', raised: 3200, goal: 5000, donors: 45, daysLeft: 20 },
  { name: 'Emergency Relief Fund', raised: 8900, goal: 8000, donors: 120, daysLeft: 0 }, // Goal met
  { name: 'General Support', raised: 45000, goal: 60000, donors: 310, daysLeft: 45 },
];

const COLORS = ['#2563eb', '#94a3b8']; // Blue-600, Slate-400

export const WorkerAnalytics: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [report, setReport] = useState<string | null>(null);

  const generateReport = async () => {
    setIsGenerating(true);
    setReport(null);

    try {
        const apiKey = process.env.API_KEY;
        if (!apiKey) {
            // Fallback for demo
            await new Promise(r => setTimeout(r, 2000));
            setReport(`
### 📊 Performance Summary
*   **Strong Recovery:** After a dip in February, revenue has shown a consistent upward trend, peaking in December at $8,400.
*   **Donor Retention:** Retention rates are healthy, with a steady increase in retained donors from June (140) to November (175).
*   **Action Item:** The "Back to School Drive" is lagging behind goal. Consider sending a targeted update to the 45 donors who supported it to close the gap.
            `);
            setIsGenerating(false);
            return;
        }

        const ai = new GoogleGenAI({ apiKey });
        const context = {
            donations: donationData,
            engagement: engagementData,
            campaigns: campaignData
        };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `You are a data analyst for a non-profit. Analyze this JSON data: ${JSON.stringify(context)}.
            Provide a brief 3-bullet point "Performance Insight Report" for the field worker.
            1. Identify the most positive trend.
            2. Identify one area needing attention (e.g., a campaign falling behind or a dip).
            3. Suggest one specific action.
            Format as Markdown. Keep it encouraging.`
        });

        setReport(response.text || "Unable to generate report.");
    } catch (e) {
        console.error(e);
        setReport("Error generating report. Please try again.");
    } finally {
        setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
         <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Analytics & Reports</h1>
            <div className="text-sm text-muted-foreground">Data for last 12 months</div>
         </div>
         <Button 
            onClick={generateReport} 
            disabled={isGenerating}
            className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all hover:scale-[1.02]"
         >
            {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            {isGenerating ? 'Analyzing...' : 'Generate Insights'}
         </Button>
      </div>

      <AnimatePresence>
        {report && (
            <motion.div 
                initial={{ opacity: 0, height: 0, y: -20 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
            >
                <Card className="border-indigo-100 bg-indigo-50/50 shadow-sm relative">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base text-indigo-900 flex items-center gap-2">
                            <FileText className="h-4 w-4" /> AI Performance Report
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="prose prose-sm prose-indigo max-w-none text-slate-700 leading-relaxed">
                            <div dangerouslySetInnerHTML={{ __html: report.replace(/\n/g, '<br/>') }} />
                        </div>
                    </CardContent>
                    <div className="absolute top-4 right-4">
                        <Button variant="ghost" size="icon" onClick={() => setReport(null)} className="h-6 w-6 text-indigo-400 hover:text-indigo-700 hover:bg-indigo-100 rounded-full">
                            <ArrowDownRight className="h-4 w-4 rotate-45" /> {/* Using as Close icon substitute since X isn't imported */}
                        </Button>
                    </div>
                </Card>
            </motion.div>
        )}
      </AnimatePresence>

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
            <Activity className="h-24 w-24 -rotate-12 text-indigo-600" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-slate-600">Retention Rate</CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-2xl font-bold text-slate-900">88.4%</div>
            <p className="text-xs text-slate-500 flex items-center mt-1">
               <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
               +1.2% from last quarter
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

      {/* Row 2: Trends & Campaigns */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        
        {/* Main Trend Chart */}
        <Card className="col-span-4 border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Donation Trends</CardTitle>
            <CardDescription>Monthly giving volume over time</CardDescription>
          </CardHeader>
          <CardContent className="pl-0">
            <div className="h-[320px] w-full">
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

        {/* Campaign Performance */}
        <Card className="col-span-3 border-slate-200 shadow-sm flex flex-col">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-slate-500" /> Campaign Goals
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto">
                <div className="space-y-6 mt-2">
                    {campaignData.map((campaign, idx) => {
                        const percent = Math.min(100, Math.round((campaign.raised / campaign.goal) * 100));
                        return (
                            <div key={idx} className="space-y-2">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-semibold text-sm text-slate-900">{campaign.name}</p>
                                        <p className="text-xs text-slate-500">{campaign.donors} donors • {campaign.daysLeft > 0 ? `${campaign.daysLeft} days left` : 'Completed'}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-sm text-slate-900">{percent}%</p>
                                        <p className="text-xs text-slate-500">{formatCurrency(campaign.raised)} of {formatCurrency(campaign.goal)}</p>
                                    </div>
                                </div>
                                <Progress value={percent} className="h-2" />
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
      </div>

      {/* Row 3: Engagement & Breakdown */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        
        {/* Donor Engagement Chart */}
        <Card className="col-span-4 border-slate-200 shadow-sm">
            <CardHeader>
                <CardTitle>Donor Engagement</CardTitle>
                <CardDescription>New vs. Retained vs. Lapsed donors (6 Month)</CardDescription>
            </CardHeader>
            <CardContent className="pl-0">
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={engagementData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} stroke="#64748b" />
                            <YAxis fontSize={12} tickLine={false} axisLine={false} stroke="#64748b" />
                            <Tooltip 
                                cursor={{fill: '#f1f5f9'}}
                                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} 
                            />
                            <Legend wrapperStyle={{ paddingTop: '20px' }} />
                            <Bar dataKey="retained" name="Retained" stackId="a" fill="#10b981" barSize={32} />
                            <Bar dataKey="new" name="New" stackId="a" fill="#3b82f6" barSize={32} />
                            <Bar dataKey="lapsed" name="Lapsed" stackId="a" fill="#cbd5e1" barSize={32} radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>

        {/* Giving Type Pie Chart */}
        <Card className="col-span-3 border-slate-200 shadow-sm">
            <CardHeader>
                <CardTitle>Giving Type</CardTitle>
                <CardDescription>Revenue distribution</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[250px] w-full flex flex-col items-center justify-center">
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
                     <div className="text-sm text-center text-slate-500 px-4 mt-2">
                        Recurring donations provide stability, accounting for <strong>45%</strong> of volume.
                     </div>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
};
