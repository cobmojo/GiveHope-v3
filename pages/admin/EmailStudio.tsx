
import React from 'react';
import { UnlayerEditor } from '../../components/studio/UnlayerEditor';

export const EmailStudio = () => {
  const handleSave = () => {
    alert("Email template saved successfully.");
  };

  const handleExport = (type: string) => {
    switch(type) {
        case 'html':
            alert("Exporting HTML package...");
            break;
        case 'mailchimp':
            alert("Connecting to Mailchimp API...");
            break;
        case 'json':
            alert("Downloading template JSON...");
            break;
        case 'pdf':
            alert("Generating PDF preview...");
            break;
        default:
            console.log("Unknown export type");
    }
  };

  return (
    <UnlayerEditor mode="email" onSave={handleSave} onExport={handleExport} />
  );
};
