
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FileText, Plus, Search, Filter, MoreHorizontal, 
  Clock, CheckCircle2, XCircle, PenTool, Layout, ChevronDown
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Card, CardContent } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Tabs, TabsList, TabsTrigger } from '../../../components/ui/Tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../../components/ui/DropdownMenu';
import { Avatar, AvatarFallback } from '../../../components/ui/Avatar';
import { cn } from '../../../lib/utils';

// Mock Data
const MOCK_DOCUMENTS = [
  { id: 'doc_1', title: 'Employment Agreement - John Doe', recipient: 'John Doe', email: 'john@example.com', status: 'completed', date: '2 hours ago' },
  { id: 'doc_2', title: 'Vendor NDA - Acme Corp', recipient: 'Sarah Smith', email: 'sarah@acme.com', status: 'sent', date: '1 day ago' },
  { id: 'doc_3', title: 'Partnership MOU', recipient: 'Robert Fox', email: 'robert@partner.org', status: 'draft', date: '3 days ago' },
  { id: 'doc_4', title: 'Volunteer Waiver 2024', recipient: 'Emily Davis', email: 'emily@volunteer.org', status: 'viewed', date: '5 days ago' },
  { id: 'doc_5', title: 'Contractor Agreement', recipient: 'Michael Brown', email: 'mike@contractor.io', status: 'sent', date: '1 week ago' },
];

const StatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case 'completed':
      return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 gap-1"><CheckCircle2 className="w-3 h-3" /> Signed</Badge>;
    case 'sent':
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 gap-1"><Clock className="w-3 h-3" /> Sent</Badge>;
    case 'viewed':
      return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 gap-1"><Clock className="w-3 h-3" /> Viewed</Badge>;
    case 'draft':
      return <Badge variant="outline" className="bg-slate-100 text-slate-600 border-slate-200 gap-1"><FileText className="w-3 h-3" /> Draft</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

export const SignStudioDocuments = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  const filteredDocs = MOCK_DOCUMENTS.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.recipient.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || 
                          (filter === 'active' && ['sent', 'viewed'].includes(doc.status)) ||
                          (filter === 'completed' && doc.status === 'completed') ||
                          (filter === 'drafts' && doc.status === 'draft');
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <PenTool className="h-8 w-8 text-blue-600" /> Sign Studio
          </h1>
          <p className="text-slate-500 mt-1">Manage e-signatures, templates, and document workflows.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild className="bg-white">
            <Link to="/mission-control/sign-studio/templates">
              <Layout className="mr-2 h-4 w-4" /> Templates
            </Link>
          </Button>
          <Button className="bg-slate-900 text-white hover:bg-slate-800 shadow-md" asChild>
            <Link to="/mission-control/sign-studio/new">
              <Plus className="mr-2 h-4 w-4" /> New Document
            </Link>
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
        <Tabs value={filter} onValueChange={setFilter} className="w-full sm:w-auto">
          <TabsList className="bg-slate-100 h-10">
            <TabsTrigger value="all">All Documents</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="drafts">Drafts</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search documents..." 
              className="pl-9 h-10 border-slate-200 bg-transparent focus:bg-white transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="ghost" size="icon" className="text-slate-500">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Document List */}
      <div className="grid gap-3">
        {filteredDocs.map((doc) => (
          <motion.div 
            key={doc.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="group"
          >
            <Card className="hover:shadow-md transition-all duration-200 border-slate-200 hover:border-blue-200 group-hover:-translate-y-0.5">
              <CardContent className="p-4 flex items-center gap-4">
                <div className={cn(
                  "h-12 w-12 rounded-lg flex items-center justify-center shrink-0 border",
                  doc.status === 'completed' ? "bg-emerald-50 border-emerald-100 text-emerald-600" : "bg-slate-50 border-slate-100 text-slate-500"
                )}>
                  <FileText className="h-6 w-6" />
                </div>
                
                <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                  <div className="md:col-span-2">
                    <Link to={`/mission-control/sign-studio/documents/${doc.id}`} className="block">
                      <h3 className="font-semibold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                        {doc.title}
                      </h3>
                    </Link>
                    <p className="text-xs text-slate-500 mt-0.5">Created {doc.date}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6 border border-slate-200">
                      <AvatarFallback className="text-[10px] bg-slate-100 text-slate-600">
                        {doc.recipient[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-medium text-slate-700 truncate">{doc.recipient}</span>
                      <span className="text-[10px] text-slate-400 truncate">{doc.email}</span>
                    </div>
                  </div>

                  <div className="flex justify-between md:justify-end items-center gap-4">
                    <StatusBadge status={doc.status} />
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link to={`/mission-control/sign-studio/documents/${doc.id}`}>View Details</Link>
                        </DropdownMenuItem>
                        {doc.status !== 'completed' && (
                          <DropdownMenuItem>Send Reminder</DropdownMenuItem>
                        )}
                        <DropdownMenuItem>Download PDF</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Void Document</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
        {filteredDocs.length === 0 && (
          <div className="text-center py-12 text-slate-500 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-slate-300" />
            </div>
            <p className="font-medium text-slate-900">No documents found</p>
            <p className="text-sm text-slate-500">Try adjusting your filters or create a new document.</p>
          </div>
        )}
      </div>
    </div>
  );
};
