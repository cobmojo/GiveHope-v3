
import React from 'react';
import { UnlayerEditor } from '../../components/studio/UnlayerEditor';

export const PDFStudio = () => {
  const handleSave = () => {
    alert("PDF template saved successfully.");
  };

  const handleExport = (type: string) => {
    switch(type) {
        case 'html':
            alert("Exporting raw HTML...");
            break;
        case 'json':
            alert("Downloading template JSON...");
            break;
        case 'pdf':
            alert("Rendering high-quality PDF...");
            break;
        default:
            console.log("Unknown export type");
    }
  };

  return (
    <UnlayerEditor mode="pdf" onSave={handleSave} onExport={handleExport} />
  );
};
