
import React from 'react';
import { UnlayerEditor } from '../../components/studio/UnlayerEditor';

export const WorkerEmailStudio: React.FC = () => {
  const handleSave = () => {
    // In a real app, this would save to the worker's draft endpoint
    alert("Draft saved to your workspace.");
  };

  const handleExport = () => {
    alert("Exporting template...");
  };

  return (
    <div className="h-[calc(100vh-4rem)] -m-4 md:-m-6 lg:-m-8">
      <UnlayerEditor mode="email" onSave={handleSave} onExport={handleExport} />
    </div>
  );
};
