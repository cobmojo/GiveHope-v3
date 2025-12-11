
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, Search, MoreVertical, Copy, 
  ArrowLeft, FileSignature
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';

const TEMPLATES = [
  { id: 'tmp_1', title: 'Standard NDA', category: 'Legal', uses: 142, lastUsed: '2 days ago' },
  { id: 'tmp_2', title: 'Offer Letter', category: 'HR', uses: 89, lastUsed: '1 week ago' },
  { id: 'tmp_3', title: 'Volunteer Waiver', category: 'Operations', uses: 356, lastUsed: '4 hours ago' },
  { id: 'tmp_4', title: 'Grant Agreement', category: 'Finance', uses: 24, lastUsed: '1 month ago' },
  { id: 'tmp_5', title: 'Media Release Form', category: 'Marketing', uses: 120, lastUsed: '3 days ago' },
];

export const SignStudioTemplates = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link to="/mission-control/sign-studio" className="text-slate-400 hover:text-slate-600 transition-colors">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Templates</h1>
          </div>
          <p className="text-slate-500 text-sm ml-6">Create and manage reusable document templates.</p>
        </div>
        <Button className="bg-slate-900 text-white hover:bg-slate-800 shadow-md" asChild>
          <Link to="/mission-control/sign-studio/templates/new">
            <Plus className="mr-2 h-4 w-4" /> Create Template
          </Link>
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
        <Input 
          placeholder="Search templates..." 
          className="pl-9 bg-white border-slate-200"
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {TEMPLATES.map((template) => (
          <Card key={template.id} className="group hover:shadow-lg transition-all duration-300 border-slate-200 hover:border-blue-200 cursor-pointer overflow-hidden bg-white">
            <Link to={`/mission-control/sign-studio/templates/${template.id}/edit`} className="block">
              <div className="aspect-[3/4] bg-slate-50 border-b border-slate-100 relative overflow-hidden group-hover:bg-slate-100/50 transition-colors flex items-center justify-center">
                <div className="w-3/4 h-5/6 bg-white shadow-sm border border-slate-200 rounded-sm flex flex-col p-4 items-center justify-center gap-2 opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500">
                   <div className="w-full h-2 bg-slate-100 rounded-full" />
                   <div className="w-full h-2 bg-slate-100 rounded-full" />
                   <div className="w-2/3 h-2 bg-slate-100 rounded-full mr-auto" />
                   <div className="mt-auto w-full pt-4 border-t border-slate-100">
                      <div className="w-1/2 h-8 border border-dashed border-blue-300 bg-blue-50 rounded flex items-center justify-center text-[8px] text-blue-400 uppercase font-bold tracking-wider gap-1">
                         <FileSignature className="h-3 w-3" /> Sign
                      </div>
                   </div>
                </div>
                
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                   <Button size="sm" className="bg-white text-slate-900 hover:bg-slate-50 shadow-md border border-slate-200 pointer-events-none">
                      Edit Template
                   </Button>
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="secondary" className="text-[10px] uppercase tracking-wider font-semibold">{template.category}</Badge>
                  <button className="text-slate-400 hover:text-slate-700" onClick={(e) => e.preventDefault()}>
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
                <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-1">{template.title}</h3>
                <div className="flex items-center justify-between text-xs text-slate-500 mt-3">
                  <span className="flex items-center gap-1"><Copy className="h-3 w-3" /> {template.uses} uses</span>
                  <span>{template.lastUsed}</span>
                </div>
              </div>
            </Link>
          </Card>
        ))}
        
        {/* New Template Card */}
        <Link to="/mission-control/sign-studio/templates/new" className="border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-4 text-slate-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50/30 transition-all aspect-[3/4] sm:aspect-auto sm:min-h-[300px] bg-slate-50/50">
           <div className="h-14 w-14 rounded-full bg-white border border-slate-200 flex items-center justify-center group-hover:shadow-md transition-all">
              <Plus className="h-6 w-6" />
           </div>
           <span className="font-medium text-sm">Create New Template</span>
        </Link>
      </div>
    </div>
  );
};
