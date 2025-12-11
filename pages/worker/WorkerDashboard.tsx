
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/Tabs';
import { Progress } from '../../components/ui/Progress';
import { DonationsLineChart } from '../../components/dashboard/DonationsLineChart';
import { DonationsPieChart } from '../../components/dashboard/DonationsPieChart';
import { Link } from 'react-router-dom';
import { ArrowUpRight, TrendingUp, DollarSign, Users, AlertCircle, Calendar, Target, Wallet } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';
import { motion } from 'framer-motion';

// Mock Data Types
interface DashboardData {
  goalAmount: number;
  currentRaised: number;
  fundBalance: number;
  monthlyDonations: { month: string; total: number }[];
  donationsByFund: { name: string; value: number }[];
  recentDonors: { name: string; lastGift: string; amount: number }[];
  atRiskDonors: { name: string; issue: string }[];
  tasks: { id: string; message: string; actionLabel: string }[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export const WorkerDashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    // Simulate API fetch
    const mockData: DashboardData = {
      goalAmount: 85000,
      currentRaised: 72450,
      fundBalance: 18240,
      monthlyDonations: [
        { month: "Jan", total: 5800 },
        { month: "Feb", total: 6100 },
        { month: "Mar", total: 5900 },
        { month: "Apr", total: 6400 },
        { month: "May", total: 6200 },
        { month: "Jun", total: 7100 },
        { month: "Jul", total: 6800 },
        { month: "Aug", total: 8600 },
        { month: "Sep", total: 8200 },
        { month: "Oct", total: 9100 },
        { month: "Nov", total: 11800 },
        { month: "Dec", total: 14200 }
      ],
      donationsByFund: [
        { name: "General Ministry", value: 45000 },
        { name: "Building Project", value: 20000 },
        { name: "Emergency Relief", value: 7450 }
      ],
      recentDonors: [
        { name: "Sarah Jenkins", lastGift: "Today, 9:41 AM", amount: 250 },
        { name: "Mike & Carol Brady", lastGift: "Yesterday", amount: 100 },
        { name: "First Baptist Church", lastGift: "Nov 12, 2023", amount: 2000 },
        { name: "Anonymous", lastGift: "Nov 10, 2023", amount: 50 }
      ],
      atRiskDonors: [
        { name: "Robert Downey", issue: "Credit card expiring (12/23)" },
        { name: "Emily Blunt", issue: "Missed last 2 recurring gifts" }
      ],
      tasks: [
        { id: "t1", message: "Send personalized video to First Baptist Church", actionLabel: "Record Video" },
        { id: "t2", message: "Write quarterly update for 'Building Project' donors", actionLabel: "Draft Email" },
        { id: "t3", message: "Review year-end giving strategy", actionLabel: "View Analytics" }
      ]
    };
    setData(mockData);
  }, []);

  if (!data) return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading dashboard...</div>;

  const supportPercent = data.goalAmount > 0 ? Math.round((data.currentRaised / data.goalAmount) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
         <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
            <p className="text-muted-foreground">Overview of your mission support and activity.</p>
         </div>
         <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" className="hidden sm:flex bg-white" asChild>
                <Link to="/worker-dashboard/reports"><Calendar className="mr-2 h-4 w-4"/> Reports</Link>
            </Button>
            <Button asChild className="shadow-md">
                <Link to="/worker-dashboard/feed">New Feed Update</Link>
            </Button>
         </div>
      </div>

      {/* Tabs Layout */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px] bg-white border border-slate-200">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* OVERVIEW TAB */}
        <TabsContent value="overview" className="space-y-6 focus-visible:outline-none">
          
          {/* Top Metrics Cards - Premium Style */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <motion.div variants={itemVariants}>
              <Card className="border-slate-200 shadow-sm bg-white overflow-hidden relative group hover:shadow-md transition-shadow duration-300">
                <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                  <Target className="h-24 w-24 -rotate-12 text-slate-900" />
                </div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                  <CardTitle className="text-sm font-medium text-slate-600">Yearly Support Raised</CardTitle>
                  <DollarSign className="h-4 w-4 text-slate-400" />
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="text-3xl font-bold text-slate-900">{formatCurrency(data.currentRaised)}</div>
                  <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-xs font-medium text-slate-500">
                          <span>Progress to Goal ({formatCurrency(data.goalAmount)})</span>
                          <span className="text-slate-900">{supportPercent}%</span>
                      </div>
                      <Progress value={supportPercent} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="border-slate-200 shadow-sm bg-white overflow-hidden relative group hover:shadow-md transition-shadow duration-300">
                <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                  <Wallet className="h-24 w-24 -rotate-12 text-green-600" />
                </div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                  <CardTitle className="text-sm font-medium text-slate-600">Fund Balance</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="text-3xl font-bold text-slate-900">{formatCurrency(data.fundBalance)}</div>
                  <p className="text-xs text-muted-foreground mt-2 font-medium">Available for immediate use</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="border-slate-200 shadow-sm bg-white overflow-hidden relative group hover:shadow-md transition-shadow duration-300">
                 <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                  <Users className="h-24 w-24 -rotate-12 text-blue-600" />
                </div>
                 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                  <CardTitle className="text-sm font-medium text-slate-600">Active Partners</CardTitle>
                  <Users className="h-4 w-4 text-slate-400" />
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="text-3xl font-bold text-slate-900">142</div>
                  <p className="text-xs text-green-600 mt-2 font-medium flex items-center">
                      <ArrowUpRight className="h-3 w-3 mr-1" /> 12% increase from last month
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-7 gap-6">
            {/* Main Chart Section */}
            <Card className="col-span-1 md:col-span-4 shadow-sm border-slate-200">
               <CardHeader>
                  <CardTitle>Donation Trends</CardTitle>
                  <CardDescription>Monthly giving performance over the last 12 months</CardDescription>
               </CardHeader>
               <CardContent className="pl-0">
                  <DonationsLineChart data={data.monthlyDonations} />
               </CardContent>
            </Card>

            {/* Sidebar Cards (Tasks & Recent) */}
            <div className="col-span-1 md:col-span-3 space-y-6">
               <Card className="shadow-sm border-l-4 border-l-primary border-t border-r border-b border-slate-200">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                     <CardTitle className="text-base">Priority Tasks</CardTitle>
                     <Link to="/worker-dashboard/tasks" className="text-xs font-medium text-primary hover:underline">View All</Link>
                  </CardHeader>
                  <CardContent>
                      <div className="space-y-4">
                        {data.tasks.map(task => (
                            <div key={task.id} className="flex flex-col space-y-1.5 bg-slate-50 p-3 rounded-md border border-slate-100 hover:border-slate-200 transition-colors">
                                <span className="text-sm font-medium text-slate-800 leading-tight">{task.message}</span>
                                <Button variant="link" className="p-0 h-auto text-xs justify-start text-primary font-semibold" asChild>
                                  <Link to="/worker-dashboard/email-studio">{task.actionLabel} <ArrowUpRight className="ml-1 h-3 w-3" /></Link>
                                </Button>
                            </div>
                        ))}
                         {data.tasks.length === 0 && <span className="text-sm text-muted-foreground">No tasks today!</span>}
                      </div>
                  </CardContent>
               </Card>

               <Card className="shadow-sm border-slate-200">
                  <CardHeader>
                     <CardTitle className="text-base">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                     <div className="space-y-5">
                        {data.recentDonors.map((donor, idx) => (
                           <div key={idx} className="flex items-center justify-between group">
                              <div className="flex items-center gap-3">
                                 <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-600 border border-slate-200 group-hover:border-slate-300 transition-colors">
                                    {donor.name.charAt(0)}
                                 </div>
                                 <div className="space-y-0.5">
                                    <div className="text-sm font-semibold text-slate-900 leading-none">{donor.name}</div>
                                    <div className="text-xs text-muted-foreground">{donor.lastGift}</div>
                                 </div>
                              </div>
                              <div className="text-sm font-bold text-green-700 bg-green-50 px-2 py-1 rounded-md border border-green-100">
                                 +{formatCurrency(donor.amount)}
                              </div>
                           </div>
                        ))}
                     </div>
                  </CardContent>
               </Card>
            </div>
          </div>
        </TabsContent>

        {/* ANALYTICS TAB */}
        <TabsContent value="analytics" className="space-y-6 focus-visible:outline-none">
           <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4 shadow-sm border-slate-200">
                 <CardHeader>
                    <CardTitle>Detailed Performance</CardTitle>
                    <CardDescription>Year-to-date donation analysis</CardDescription>
                 </CardHeader>
                 <CardContent>
                    <DonationsLineChart data={data.monthlyDonations} />
                 </CardContent>
              </Card>

              <Card className="col-span-3 shadow-sm border-slate-200">
                 <CardHeader>
                    <CardTitle>Funding Sources</CardTitle>
                    <CardDescription>Distribution by designation</CardDescription>
                 </CardHeader>
                 <CardContent>
                    <DonationsPieChart data={data.donationsByFund} />
                 </CardContent>
              </Card>
           </div>
           
           {/* At Risk Donors */}
           {data.atRiskDonors.length > 0 && (
             <Card className="border-l-4 border-l-red-500 shadow-sm bg-red-50/10 border-t border-r border-b border-slate-200">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-red-500" />
                        <CardTitle>Needs Attention</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-3">
                        {data.atRiskDonors.map((donor, idx) => (
                            <li key={idx} className="flex justify-between items-center bg-white p-3 rounded-md border border-slate-200 shadow-sm">
                                <div>
                                    <span className="font-semibold text-sm text-slate-900">{donor.name}</span>
                                    <span className="text-xs text-red-600 font-medium ml-2">• {donor.issue}</span>
                                </div>
                                <Button size="sm" variant="destructive" className="h-7 text-xs px-3">Resolve</Button>
                            </li>
                        ))}
                    </ul>
                </CardContent>
             </Card>
           )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
