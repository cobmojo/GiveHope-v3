
import React, { useState } from 'react';
import { 
  User, Bell, Shield, Mail, Phone, MapPin, LogOut, 
  Camera, Check, Loader2, Lock, Smartphone, 
  ChevronRight, Eye, EyeOff, Laptop, History,
  Receipt, Heart, Globe, AlertTriangle, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Switch } from '../../components/ui/Switch';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/Avatar';
import { Separator } from '../../components/ui/separator';
import { Badge } from '../../components/ui/Badge';
import { ScrollArea } from '../../components/ui/ScrollArea';
import { cn } from '../../lib/utils';

// --- Types ---
type TabId = 'profile' | 'notifications' | 'security';

interface SettingTab {
  id: TabId;
  label: string;
  icon: React.ElementType;
}

const TABS: SettingTab[] = [
  { id: 'profile', label: 'My Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
];

// --- Helper Components ---

const PasswordInput = ({ 
  id, 
  label, 
  value, 
  onChange, 
  placeholder 
}: { 
  id: string, 
  label: string, 
  value: string, 
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, 
  placeholder?: string 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-slate-700 font-medium">{label}</Label>
      <div className="relative group">
        <Input 
          id={id} 
          type={isVisible ? "text" : "password"} 
          value={value} 
          onChange={onChange}
          className="pr-10 bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all duration-200" 
          placeholder={placeholder} 
        />
        <button
          type="button"
          onClick={() => setIsVisible(!isVisible)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
        >
          {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
};

// --- Tabs ---

const ProfileTab = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    }, 1500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      {/* Avatar Section */}
      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
          <CardTitle className="text-lg">Public Avatar</CardTitle>
          <CardDescription>Displayed on your profile and interactions.</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative group">
              <Avatar className="h-20 w-20 border-4 border-white shadow-md ring-1 ring-slate-100">
                <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?fit=facearea&facepad=2&w=256&h=256&q=80" />
                <AvatarFallback className="bg-slate-900 text-white text-2xl">JD</AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera className="text-white h-6 w-6" />
              </div>
            </div>
            <div className="flex flex-col gap-3 text-center sm:text-left">
              <div>
                <h4 className="font-medium text-slate-900">Profile Photo</h4>
                <p className="text-xs text-slate-500 mt-1">JPG, GIF or PNG. Max 2MB.</p>
              </div>
              <div className="flex gap-3 justify-center sm:justify-start">
                <Button variant="outline" size="sm" className="bg-white h-8 text-xs border-slate-200 shadow-sm hover:bg-slate-50">
                  Upload New
                </Button>
                <Button variant="ghost" size="sm" className="text-red-600 h-8 text-xs hover:text-red-700 hover:bg-red-50">
                  Remove
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Info Form */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
          <CardTitle className="text-lg">Personal Information</CardTitle>
          <CardDescription>Update your identity and contact details.</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-slate-700">First Name</Label>
              <Input id="firstName" defaultValue="John" className="bg-white border-slate-200 focus:border-blue-300 transition-all h-10" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-slate-700">Last Name</Label>
              <Input id="lastName" defaultValue="Doe" className="bg-white border-slate-200 focus:border-blue-300 transition-all h-10" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input id="email" type="email" defaultValue="john.doe@example.com" className="pl-9 bg-white border-slate-200 focus:border-blue-300 transition-all h-10" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-slate-700">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" className="pl-9 bg-white border-slate-200 focus:border-blue-300 transition-all h-10" />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="address" className="text-slate-700">Street Address</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input id="address" defaultValue="123 Mission Way" className="pl-9 bg-white border-slate-200 focus:border-blue-300 transition-all h-10" />
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
              <div className="space-y-2">
                <Label htmlFor="city" className="text-slate-700">City</Label>
                <Input id="city" defaultValue="San Francisco" className="bg-white border-slate-200 h-10" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state" className="text-slate-700">State</Label>
                <Input id="state" defaultValue="CA" className="bg-white border-slate-200 h-10" />
              </div>
              <div className="space-y-2 col-span-2 md:col-span-1">
                <Label htmlFor="zip" className="text-slate-700">Postal Code</Label>
                <Input id="zip" defaultValue="94105" className="bg-white border-slate-200 h-10" />
              </div>
            </div>
          </div>

        </CardContent>
        <CardFooter className="bg-slate-50/50 border-t border-slate-100 p-4 flex flex-col-reverse sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-400 hidden sm:block">Last updated: 3 days ago</p>
          <div className="flex gap-3 w-full sm:w-auto">
            <Button variant="ghost" className="text-slate-500 hover:text-slate-900 w-full sm:w-auto h-9">Cancel</Button>
            <Button onClick={handleSave} disabled={loading} className={cn("min-w-[120px] transition-all w-full sm:w-auto h-9", success ? "bg-emerald-600 hover:bg-emerald-700" : "bg-slate-900 hover:bg-slate-800")}>
              {loading ? <Loader2 className="mr-2 h-3 w-3 animate-spin" /> : success ? <Check className="mr-2 h-3 w-3" /> : null}
              {loading ? "Saving..." : success ? "Saved" : "Save Changes"}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

const NotificationsTab = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [preferences, setPreferences] = useState({
    receipts: true,
    monthlyStatement: true,
    fieldUpdates: true,
    videoStories: true,
    newsletters: false,
    emergencyAppeals: true,
    smsAlerts: false
  });

  const handleToggle = (key: keyof typeof preferences) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
    if (success) setSuccess(false);
  };

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2500);
    }, 1200);
  };

  const categories = [
    {
      title: "Billing & Receipts",
      icon: Receipt,
      color: "text-blue-600 bg-blue-50",
      items: [
        { key: 'receipts', label: "Instant Donation Receipts", desc: "Email receipt after every donation." },
        { key: 'monthlyStatement', label: "Monthly Statements", desc: "Consolidated summary sent on the 1st." }
      ]
    },
    {
      title: "Impact Updates",
      icon: Heart,
      color: "text-rose-600 bg-rose-50",
      items: [
        { key: 'fieldUpdates', label: "Field Partner Updates", desc: "Stories directly from the workers you support.", recommended: true },
        { key: 'videoStories', label: "Video Stories", desc: "Links to video messages and reports." }
      ]
    },
    {
      title: "Organization",
      icon: Globe,
      color: "text-emerald-600 bg-emerald-50",
      items: [
        { key: 'newsletters', label: "Quarterly Newsletter", desc: "High-level vision and stats." },
        { key: 'emergencyAppeals', label: "Emergency Appeals", desc: "Notifications about urgent crises." }
      ]
    }
  ];

  return (
    <Card className="border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
        <div className="flex items-center justify-between">
            <div className="space-y-1">
                <CardTitle className="text-lg">Notification Preferences</CardTitle>
                <CardDescription>Customize how you want to hear from us.</CardDescription>
            </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="divide-y divide-slate-100">
            {categories.map((category, idx) => (
                <div key={idx} className="p-6 md:p-8 hover:bg-slate-50/30 transition-colors">
                    <div className="flex flex-col md:flex-row md:gap-12 gap-6">
                        <div className="md:w-48 shrink-0 flex items-start gap-3">
                            <div className={cn("p-2 rounded-lg shrink-0", category.color)}>
                                <category.icon className="h-4 w-4" />
                            </div>
                            <h3 className="text-sm font-bold text-slate-900 mt-1.5">{category.title}</h3>
                        </div>

                        <div className="flex-1 space-y-6">
                            {category.items.map((item: any) => (
                                <div key={item.key} className="flex items-start justify-between gap-4">
                                    <div className="space-y-0.5">
                                        <div className="flex items-center gap-2">
                                            <Label htmlFor={item.key} className="text-sm font-medium text-slate-900 cursor-pointer">{item.label}</Label>
                                            {item.recommended && (
                                                <Badge variant="secondary" className="bg-amber-50 text-amber-700 border-amber-100 text-[9px] h-4 px-1 font-bold uppercase tracking-wider">
                                                    Recommended
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-xs text-slate-500 leading-relaxed max-w-md">
                                            {item.desc}
                                        </p>
                                    </div>
                                    <Switch 
                                        id={item.key}
                                        checked={(preferences as any)[item.key]} 
                                        onCheckedChange={() => handleToggle(item.key)}
                                        className="data-[state=checked]:bg-slate-900 mt-1"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </CardContent>
      
      <CardFooter className="bg-slate-50/50 border-t border-slate-100 p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-xs text-slate-400 italic flex items-center gap-2 text-center sm:text-left">
            <AlertTriangle className="h-3 w-3" />
            System alerts cannot be disabled.
        </p>
        <Button 
            onClick={handleSave} 
            disabled={loading || success} 
            className={cn(
                "min-w-[140px] shadow-sm transition-all duration-300 font-semibold h-9 w-full sm:w-auto", 
                success ? "bg-emerald-600 hover:bg-emerald-700" : "bg-slate-900 hover:bg-slate-800"
            )}
        >
            {loading ? <Loader2 className="mr-2 h-3 w-3 animate-spin" /> : success ? <Check className="mr-2 h-3 w-3" /> : null}
            {loading ? "Saving..." : success ? "Changes Saved" : "Save Preferences"}
        </Button>
      </CardFooter>
    </Card>
  );
};

const SecurityTab = () => {
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Password Strength Logic
  const getStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[!@#$%^&*]/.test(pass)) score++;
    if (/[A-Z]/.test(pass)) score++;
    return score;
  };

  const strengthScore = getStrength(passwords.new);
  const strengthColor = strengthScore < 2 ? 'bg-red-500' : strengthScore < 4 ? 'bg-amber-500' : 'bg-emerald-500';
  const widthPercent = Math.min((strengthScore / 4) * 100, 100);

  const handleUpdate = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
      setPasswords({ current: '', new: '', confirm: '' });
    }, 1500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6 max-w-4xl"
    >
      
      {/* 1. Login & Password Card */}
      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="space-y-1">
              <CardTitle className="text-lg flex items-center gap-2">
                <Lock className="h-4 w-4 text-slate-400" /> Login & Password
              </CardTitle>
              <CardDescription>Manage your password to keep your account secure.</CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-6 md:p-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            {/* Left Col: Current Password */}
            <div className="space-y-6">
              <PasswordInput 
                id="current" 
                label="Current Password" 
                value={passwords.current}
                onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                placeholder="Enter current password"
              />
              
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                <div className="flex gap-3">
                  <div className="p-1.5 bg-white rounded shadow-sm text-blue-600 h-fit">
                    <History className="h-3 w-3" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-blue-900">Forgot your password?</h4>
                    <Button variant="link" className="text-blue-700 font-bold p-0 h-auto text-xs hover:text-blue-900">
                      Reset via Email
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Col: New Password */}
            <div className="space-y-5">
              <PasswordInput 
                id="new" 
                label="New Password" 
                value={passwords.new}
                onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                placeholder="Enter new password"
              />
              
              {/* Strength Meter */}
              <div className="space-y-1.5">
                <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${widthPercent}%` }}
                    className={cn("h-full transition-colors duration-500 ease-out", strengthColor)}
                  />
                </div>
                <div className="flex justify-between">
                    <span className="text-[10px] text-slate-400">Strength</span>
                    <span className="text-[10px] font-bold text-slate-600">{strengthScore >= 4 ? "Strong" : strengthScore >= 2 ? "Medium" : "Weak"}</span>
                </div>
              </div>

              <PasswordInput 
                id="confirm" 
                label="Confirm New Password" 
                value={passwords.confirm}
                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                placeholder="Confirm new password"
              />
            </div>
          </div>

        </CardContent>
        <CardFooter className="bg-slate-50/50 border-t border-slate-100 p-4 flex justify-end">
          <Button 
            onClick={handleUpdate} 
            disabled={loading || strengthScore < 3 || passwords.new !== passwords.confirm} 
            className={cn("min-w-[140px] h-9 shadow-sm transition-all w-full sm:w-auto", success ? "bg-emerald-600 hover:bg-emerald-700" : "bg-slate-900 hover:bg-slate-800")}
          >
            {loading ? <Loader2 className="mr-2 h-3 w-3 animate-spin" /> : success ? <Check className="mr-2 h-3 w-3" /> : null}
            {loading ? "Updating..." : success ? "Password Updated" : "Update Password"}
          </Button>
        </CardFooter>
      </Card>

      {/* 2. Additional Security */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-slate-200 shadow-sm flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="h-4 w-4 text-emerald-600" /> Two-Factor Authentication
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Secure your account by requiring a verification code when signing in.
            </p>
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-xs font-semibold text-slate-700">Status</span>
              <Badge variant="outline" className="text-slate-500">Disabled</Badge>
            </div>
          </CardContent>
          <CardFooter className="pt-0 pb-4">
             <Button variant="outline" className="w-full text-xs h-8">Configure 2FA</Button>
          </CardFooter>
        </Card>

        <Card className="border-slate-200 shadow-sm flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Laptop className="h-4 w-4 text-blue-600" /> Active Sessions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 flex-1">
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-slate-100 rounded text-slate-500">
                <Laptop className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-900">Macbook Pro</p>
                <p className="text-[10px] text-slate-500">San Francisco • Active now</p>
              </div>
              <div className="h-2 w-2 bg-green-500 rounded-full" />
            </div>
          </CardContent>
          <CardFooter className="pt-0 pb-4">
             <Button variant="ghost" className="w-full text-xs h-8 text-red-600 hover:text-red-700 hover:bg-red-50">Sign out other devices</Button>
          </CardFooter>
        </Card>
      </div>
    </motion.div>
  );
};

export const DonorSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('profile');

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20 pt-4">
      
      {/* Header */}
      <div className="space-y-1.5 px-1">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Settings</h1>
        <p className="text-slate-500 text-lg">Manage your profile and preferences.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Responsive Sidebar Nav */}
        <div className="w-full lg:w-64 shrink-0 lg:sticky lg:top-24 h-fit z-10">
          <ScrollArea className="w-full whitespace-nowrap lg:whitespace-normal" orientation="horizontal">
            <div className="flex lg:flex-col gap-2 p-1 bg-white rounded-xl border border-slate-200 shadow-sm">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 relative overflow-hidden group min-w-[140px] lg:w-full",
                    activeTab === tab.id 
                      ? "bg-slate-900 text-white shadow-md" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <tab.icon className={cn("h-4 w-4 relative z-10", activeTab === tab.id ? "text-slate-300" : "text-slate-400 group-hover:text-slate-600")} />
                  <span className="relative z-10">{tab.label}</span>
                  {activeTab === tab.id && (
                    <ChevronRight className="h-3 w-3 ml-auto opacity-50 hidden lg:block relative z-10" />
                  )}
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'profile' && <ProfileTab />}
              {activeTab === 'notifications' && <NotificationsTab />}
              {activeTab === 'security' && <SecurityTab />}
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};
