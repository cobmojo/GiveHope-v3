
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';

interface WorkerSettingsData {
  address1: string;
  address2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  alternateEmail: string;
  preferredMessaging: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
}

const INITIAL_DATA: WorkerSettingsData = {
  address1: "",
  address2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "",
  phone: "",
  alternateEmail: "",
  preferredMessaging: "WhatsApp",
  emergencyContactName: "",
  emergencyContactPhone: ""
};

export const WorkerSettings: React.FC = () => {
  const [formData, setFormData] = useState<WorkerSettingsData>(INITIAL_DATA);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    // Simulate Fetch
    setFormData({
      address1: "123 Mission Lane",
      address2: "",
      city: "Chiang Mai",
      state: "CM",
      postalCode: "50200",
      country: "Thailand",
      phone: "+66 81 234 5678",
      alternateEmail: "miller.personal@gmail.com",
      preferredMessaging: "WhatsApp",
      emergencyContactName: "John Doe Sr.",
      emergencyContactPhone: "+1 555 0199"
    });
  }, []);

  const handleChange = (field: keyof WorkerSettingsData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setSaving(true);
    setMessage(null);
    setTimeout(() => {
        setSaving(false);
        setMessage("Settings updated successfully.");
        setTimeout(() => setMessage(null), 3000);
    }, 1000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-500">
      <h1 className="text-2xl font-bold tracking-tight">Profile Settings</h1>
      
      <Card>
        <CardHeader>
            <CardTitle className="text-base">Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Primary Address</label>
                    <Input placeholder="Line 1" value={formData.address1} onChange={e => handleChange("address1", e.target.value)} />
                    <Input placeholder="Line 2" value={formData.address2} onChange={e => handleChange("address2", e.target.value)} />
                </div>
                 <div className="space-y-2">
                    <label className="text-sm font-medium">Location Details</label>
                    <div className="flex gap-2">
                         <Input placeholder="City" value={formData.city} onChange={e => handleChange("city", e.target.value)} />
                         <Input placeholder="State/Prov" className="w-24" value={formData.state} onChange={e => handleChange("state", e.target.value)} />
                    </div>
                     <div className="flex gap-2">
                         <Input placeholder="Zip/Postal" value={formData.postalCode} onChange={e => handleChange("postalCode", e.target.value)} />
                         <Input placeholder="Country" value={formData.country} onChange={e => handleChange("country", e.target.value)} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Phone Number</label>
                    <Input type="tel" value={formData.phone} onChange={e => handleChange("phone", e.target.value)} />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Alternate Email</label>
                    <Input type="email" value={formData.alternateEmail} onChange={e => handleChange("alternateEmail", e.target.value)} />
                </div>
            </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle className="text-base">Preferences & Emergency</CardTitle>
        </CardHeader>
         <CardContent className="space-y-4">
             <div className="space-y-2">
                <label className="text-sm font-medium">Preferred Messaging App</label>
                <Select
                    value={formData.preferredMessaging} 
                    onChange={(e) => handleChange("preferredMessaging", e.target.value)} 
                >
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Signal">Signal</option>
                    <option value="Telegram">Telegram</option>
                    <option value="iMessage">iMessage</option>
                </Select>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Emergency Contact Name</label>
                    <Input value={formData.emergencyContactName} onChange={e => handleChange("emergencyContactName", e.target.value)} />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Emergency Contact Phone</label>
                    <Input type="tel" value={formData.emergencyContactPhone} onChange={e => handleChange("emergencyContactPhone", e.target.value)} />
                </div>
            </div>
         </CardContent>
      </Card>

       <div className="flex items-center gap-4">
            <Button onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save Settings"}
            </Button>
            {message && <span className="text-green-600 text-sm font-medium animate-in fade-in slide-in-from-left-2">{message}</span>}
       </div>
    </div>
  );
};
