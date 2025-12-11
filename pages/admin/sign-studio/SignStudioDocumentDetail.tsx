
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, Download, Send, 
  CheckCircle2, Mail, Eye, PenTool, 
  FileText, ShieldCheck, MoreHorizontal, History 
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Avatar, AvatarFallback } from '../../../components/ui/Avatar';
import { cn } from '../../../lib/utils';

export const SignStudioDocumentDetail = () => {
  const { id } = useParams();

  // Mock Data
  const doc = {
    id: id || 'doc_1',
    title: 'Employment Agreement - John Doe',
    status: 'completed',
    created: 'Oct 24, 2024 10:30 AM',
    sender: 'HR Department',
    recipients: [
      { name: 'John Doe', email: 'john@example.com', status: 'signed', signedAt: 'Oct 25, 2024 09:15 AM', role: 'Signer' },
      { name: 'Sarah Smith', email: 'sarah@company.com', status: 'signed', signedAt: 'Oct 25, 2024 11:30 AM', role: 'Countersigner' }
    ],
    auditTrail: [
      { action: 'Document Completed', user: 'System', time: 'Oct 25, 2024 11:30 AM', icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50' },
      { action: 'Signed by Sarah Smith', user: 'Sarah Smith', ip: '192.168.1.1', time: 'Oct 25, 2024 11:30 AM', icon: PenTool, color: 'text-blue-600 bg-blue-50' },
      { action: 'Viewed by Sarah Smith', user: 'Sarah Smith', ip: '192.168.1.1', time: 'Oct 25, 2024 11:28 AM', icon: Eye, color: 'text-amber-600 bg-amber-50' },
      { action: 'Signed by John Doe', user: 'John Doe', ip: '10.0.0.42', time: 'Oct 25, 2024 09:15 AM', icon: PenTool, color: 'text-blue-600 bg-blue-50' },
      { action: 'Viewed by John Doe', user: 'John Doe', ip: '10.0.0.42', time: 'Oct 24, 2024 04:45 PM', icon: Eye, color: 'text-amber-600 bg-amber-50' },
      { action: 'Email Sent to John Doe', user: 'System', time: 'Oct 24, 2024 10:30 AM', icon: Mail, color: 'text-slate-600 bg-slate-100' },
      { action: 'Document Created', user: 'HR Department', time: 'Oct 24, 2024 10:30 AM', icon: FileText, color: 'text-slate-600 bg-slate-100' },
    ]
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="rounded-full">
            <Link to="/mission-control/sign-studio/documents">
              <ArrowLeft className="h-5 w-5 text-slate-500" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900">{doc.title}</h1>
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 gap-1.5 uppercase tracking-wide text-[10px] font-bold px-2">
                <CheckCircle2 className="h-3 w-3" /> Completed
              </Badge>
            </div>
            <p className="text-sm text-slate-500 mt-1">ID: {doc.id} • Created {doc.created}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="bg-white">
            <Download className="mr-2 h-4 w-4" /> Download PDF
          </Button>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-5 w-5 text-slate-500" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content (Preview Placeholder) */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-slate-100/50 border-slate-200 shadow-inner overflow-hidden min-h-[600px] flex items-center justify-center relative group rounded-xl">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] opacity-10" />
             <div className="bg-white shadow-xl w-[80%] h-[90%] rounded-sm border border-slate-200 p-12 flex flex-col gap-8 relative transition-transform duration-500 group-hover:scale-[1.01]">
                {/* Mock Doc Content */}
                <div className="h-8 w-1/3 bg-slate-200 rounded animate-pulse mb-4" />
                <div className="space-y-3">
                   <div className="h-3 w-full bg-slate-100 rounded" />
                   <div className="h-3 w-full bg-slate-100 rounded" />
                   <div className="h-3 w-2/3 bg-slate-100 rounded" />
                </div>
                <div className="space-y-3 pt-8">
                   <div className="h-3 w-full bg-slate-100 rounded" />
                   <div className="h-3 w-full bg-slate-100 rounded" />
                   <div className="h-3 w-full bg-slate-100 rounded" />
                   <div className="h-3 w-1/2 bg-slate-100 rounded" />
                </div>

                <div className="mt-auto flex justify-between items-end pt-12">
                   <div className="space-y-2">
                      <div className="font-script text-3xl text-blue-600 transform -rotate-2 select-none">John Doe</div>
                      <div className="h-px w-48 bg-slate-300" />
                      <div className="text-xs text-slate-400 uppercase tracking-widest">Signed</div>
                   </div>
                   <div className="space-y-2 text-right">
                      <div className="font-script text-3xl text-slate-800 transform -rotate-1 select-none">Sarah Smith</div>
                      <div className="h-px w-48 bg-slate-300" />
                      <div className="text-xs text-slate-400 uppercase tracking-widest">Countersigned</div>
                   </div>
                </div>
                
                {/* Certification Badge */}
                <div className="absolute top-4 right-4 border border-emerald-100 bg-emerald-50/90 text-emerald-800 px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded flex items-center gap-2">
                   <ShieldCheck className="h-3 w-3" /> Certified
                </div>
             </div>
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          
          {/* Recipients */}
          <Card>
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-500">Recipients</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              {doc.recipients.map((recipient, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="relative">
                    <Avatar className="h-9 w-9 border border-slate-100">
                      <AvatarFallback className="bg-slate-100 text-xs font-bold text-slate-600">{recipient.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                       <CheckCircle2 className="h-4 w-4 text-emerald-500 fill-emerald-50" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900">{recipient.name}</p>
                    <p className="text-xs text-slate-500 truncate">{recipient.email}</p>
                    <div className="flex items-center gap-1 mt-1">
                       <Badge variant="secondary" className="text-[9px] px-1.5 h-4 font-normal bg-slate-50 text-slate-500 border-slate-100">{recipient.role}</Badge>
                       <span className="text-[10px] text-slate-400">• {recipient.signedAt}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Audit Trail */}
          <Card>
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                 <History className="h-4 w-4" /> Audit Trail
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 max-h-[400px] overflow-y-auto pr-2 relative">
               <div className="absolute left-6 top-6 bottom-6 w-px bg-slate-200" />
               <div className="space-y-6">
                  {doc.auditTrail.map((log, i) => (
                     <div key={i} className="relative flex gap-4">
                        <div className={cn("h-8 w-8 rounded-full flex items-center justify-center shrink-0 z-10 ring-4 ring-white shadow-sm", log.color)}>
                           <log.icon className="h-4 w-4" />
                        </div>
                        <div className="pt-1">
                           <p className="text-xs font-semibold text-slate-900">{log.action}</p>
                           <div className="flex flex-col text-[10px] text-slate-500 mt-0.5">
                              <span>{log.user} {log.ip ? `(${log.ip})` : ''}</span>
                              <span>{log.time}</span>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-blue-100">
             <CardContent className="p-4 flex gap-3 items-start">
                <ShieldCheck className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                   <h4 className="text-sm font-bold text-blue-900">Legal Validity</h4>
                   <p className="text-xs text-blue-700 mt-1 leading-relaxed">
                      This document is legally binding and compliant with ESIGN and eIDAS regulations.
                   </p>
                </div>
             </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
};
