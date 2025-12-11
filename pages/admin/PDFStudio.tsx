
import React from 'react';
import { UnlayerEditor } from '../../components/studio/UnlayerEditor';

export const PDFStudio = () => {
  const handleSave = () => {
    alert("PDF template saved successfully.");
  };

  const handleExport = () => {
    alert("Generating PDF...");
  };

  return (
    <UnlayerEditor mode="pdf" onSave={handleSave} onExport={handleExport} />
  );
};
