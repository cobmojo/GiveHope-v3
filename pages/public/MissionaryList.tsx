import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';
import { getFieldWorkers } from '../../lib/mock';

export const MissionaryList = () => {
  const workers = getFieldWorkers();

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Our Missionaries</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workers.map((missionary) => (
          <Card key={missionary.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <div className="h-48 bg-slate-100 relative">
              <img 
                src={missionary.image || `https://picsum.photos/seed/${missionary.id}/400/300`} 
                alt={missionary.title} 
                className="w-full h-full object-cover"
              />
            </div>
            <CardHeader>
              <CardTitle className="text-xl">{missionary.title}</CardTitle>
              <div className="flex items-center text-sm text-muted-foreground gap-1">
                <MapPin className="h-3 w-3" />
                {missionary.location}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{formatCurrency(missionary.raised)}</span>
                    <span className="text-muted-foreground">of {formatCurrency(missionary.goal)}</span>
                  </div>
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary" 
                      style={{ width: `${Math.min(100, (missionary.raised / missionary.goal) * 100)}%` }} 
                    />
                  </div>
                </div>
                <Button className="w-full" asChild>
                  <Link to={`/workers/${missionary.id}`}>View Profile</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};