import React from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export const WorkerEmailStudio: React.FC = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-6">
      <div className="h-24 w-24 bg-slate-100 rounded-full flex items-center justify-center">
        <span className="text-4xl">📧</span>
      </div>
      <div className="max-w-md space-y-2">
        <h1 className="text-2xl font-bold">Email Studio</h1>
        <p className="text-muted-foreground">
            Compose newsletters and thank-you notes to your supporters using our drag-and-drop editor.
        </p>
      </div>
      <Card className="max-w-2xl w-full border-dashed">
        <CardContent className="p-12 flex flex-col items-center gap-4">
            <div className="text-sm text-muted-foreground font-mono">Editor Integration Placeholder</div>
            <Button variant="outline">Launch Unlayer Editor</Button>
        </CardContent>
      </Card>
    </div>
  );
};
