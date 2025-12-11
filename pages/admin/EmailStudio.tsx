
import React from 'react';
import { UnlayerEditor } from '../../components/studio/UnlayerEditor';

export const EmailStudio = () => {
  const handleSave = () => {
    alert("Email template saved successfully.");
  };

  const handleExport = () => {
    alert("Exporting HTML...");
  };

  return (
    <UnlayerEditor mode="email" onSave={handleSave} onExport={handleExport} />
  );
};
