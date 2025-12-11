import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ExternalLink, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Page {
  id: string;
  title: string;
  url: string;
  editUrl?: string;
}

export const WorkerPages: React.FC = () => {
  const [pages, setPages] = useState<Page[]>([]);

  useEffect(() => {
    // Simulate fetch
    setPages([
      { id: "page1", title: "Miller Family Support Page", url: "/workers/1", editUrl: undefined },
      { id: "page2", title: "Thailand Education Project", url: "/workers/project-1", editUrl: "https://wordpress.org" }
    ]);
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
         <h1 className="text-2xl font-bold tracking-tight">My Giving Pages</h1>
         <Button>Create New Page</Button>
      </div>
      
      <div className="grid gap-4">
        {pages.map(page => (
          <Card key={page.id} className="overflow-hidden">
             <CardContent className="p-0 flex flex-col sm:flex-row">
                <div className="w-full sm:w-32 bg-slate-100 flex items-center justify-center p-4">
                    <span className="text-2xl">📄</span>
                </div>
                <div className="p-6 flex-1 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h3 className="font-semibold text-lg">{page.title}</h3>
                        <a href={page.url} target="_blank" rel="noreferrer" className="text-sm text-muted-foreground hover:underline flex items-center gap-1">
                            {page.url} <ExternalLink className="h-3 w-3" />
                        </a>
                    </div>
                    <div className="flex gap-2">
                         <Button variant="outline" size="sm" asChild>
                            <a href={page.url} target="_blank" rel="noreferrer">View</a>
                        </Button>
                        {page.editUrl ? (
                             <Button size="sm" asChild>
                                <a href={page.editUrl} target="_blank" rel="noreferrer"> <Edit className="mr-2 h-3 w-3" /> Edit in CMS</a>
                             </Button>
                        ) : (
                             <Button size="sm" asChild>
                                <Link to={`/worker-dashboard/content`}> <Edit className="mr-2 h-3 w-3" /> Edit Content</Link>
                             </Button>
                        )}
                    </div>
                </div>
             </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
