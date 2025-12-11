
import React, { useState, useRef } from 'react';
import { 
  Eye, Upload, MapPin, Globe, Mail, Phone, 
  Facebook, Instagram, Twitter, Linkedin, Youtube, Github, 
  Smartphone, Monitor, Image as ImageIcon, Plus, 
  ExternalLink, Edit2, CheckCircle2, Loader2, Target,
  Trash2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/Tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { RichTextEditor } from '../../components/ui/RichTextEditor';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../components/ui/Dialog';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { cn } from '../../lib/utils';

// --- Types ---

interface ProjectPage {
  id: string;
  title: string;
  slug: string;
  status: 'Public' | 'Draft' | 'Private';
  goal: string;
  description: string;
}

interface SocialLink {
  key: string;
  label: string;
  icon: any;
  color: string;
  placeholder: string;
}

// --- Constants ---

const INITIAL_PROJECTS: ProjectPage[] = [
  { 
    id: '1', 
    title: 'Vehicle Fund', 
    slug: 'vehicle-2024', 
    status: 'Public', 
    goal: '12000', 
    description: 'Help us purchase a reliable 4x4 vehicle to reach remote villages in the mountains during the rainy season.' 
  },
  { 
    id: '2', 
    title: 'Fall Outreach Event', 
    slug: 'outreach-fall', 
    status: 'Draft', 
    goal: '2500', 
    description: 'Funding for the community harvest festival and youth rally in November.' 
  }
];

const SOCIAL_PLATFORMS: SocialLink[] = [
  { key: 'facebook', label: 'Facebook', icon: Facebook, color: '#1877F2', placeholder: 'facebook.com/your-page' },
  { key: 'instagram', label: 'Instagram', icon: Instagram, color: '#E4405F', placeholder: 'instagram.com/your-handle' },
  { key: 'twitter', label: 'X (Twitter)', icon: Twitter, color: '#000000', placeholder: 'x.com/your-handle' },
  { key: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: '#0A66C2', placeholder: 'linkedin.com/in/your-profile' },
  { key: 'youtube', label: 'YouTube', icon: Youtube, color: '#FF0000', placeholder: 'youtube.com/@your-channel' },
  { key: 'github', label: 'GitHub', icon: Github, color: '#333333', placeholder: 'github.com/your-username' },
];

// --- Preview Component ---

const PreviewContent = ({ mode, coverImage, profileImage, contactInfo, socialUrls, projects, basicInfo }: any) => {
  return (
    <div className="bg-white min-h-full font-sans text-slate-900 pb-10">
       {/* Cover */}
       <div className={cn("bg-slate-100 w-full relative overflow-hidden shrink-0 group", mode === 'mobile' ? "h-40" : "h-64")}>
           {coverImage ? (
               <img 
                   src={coverImage} 
                   className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                   alt="Cover"
               />
           ) : (
               <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-300">
                    <ImageIcon className="h-12 w-12 opacity-50" />
               </div>
           )}
           
           {/* Desktop nav simulation */}
           {mode === 'desktop' && (
               <div className="absolute top-0 left-0 w-full px-8 py-6 flex justify-between items-center z-10 bg-gradient-to-b from-black/60 to-transparent text-white">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center border border-white/20">
                            <span className="font-bold text-lg">M</span>
                        </div>
                        <span className="font-bold text-lg tracking-tight">MissionControl</span>
                    </div>
                    <div className="flex items-center gap-8 text-sm font-medium tracking-wide">
                        <span className="opacity-90 hover:opacity-100 cursor-pointer">About</span>
                        <span className="opacity-90 hover:opacity-100 cursor-pointer">Stories</span>
                        <span className="bg-white text-black px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg hover:bg-slate-100 transition-colors cursor-pointer">Donate</span>
                    </div>
               </div>
           )}
       </div>

       {/* Profile Section */}
       <div className={cn("relative", mode === 'mobile' ? "px-6 -mt-12" : "max-w-5xl mx-auto px-8 -mt-20")}>
            {/* Profile Image with Ring */}
            <div className={cn("relative rounded-full border-[6px] border-white bg-white overflow-hidden shadow-xl z-20", mode === 'mobile' ? "h-24 w-24 mx-auto" : "h-40 w-40")}>
                    <img src={profileImage} className="h-full w-full object-cover" alt="Profile" />
            </div>
            
            <div className={cn("space-y-6 z-10 relative", mode === 'mobile' ? "pt-4 text-center" : "pt-6 flex flex-col items-start")}>
                <div className={cn("w-full", mode === 'desktop' && "flex justify-between items-start")}>
                    <div className="space-y-1">
                        <h3 className={cn("font-extrabold tracking-tight text-slate-900", mode === 'mobile' ? "text-2xl" : "text-4xl")}>{basicInfo.displayName || "Display Name"}</h3>
                        <div className={cn("flex items-center gap-2 text-slate-500 font-medium", mode === 'mobile' ? "justify-center text-sm" : "text-base")}>
                            <MapPin className="h-4 w-4" /> <span>{basicInfo.location || "Location"}</span>
                        </div>
                        {basicInfo.tagline && (
                            <p className={cn("text-blue-600 font-medium", mode === 'mobile' ? "text-sm mt-1" : "text-lg mt-2")}>{basicInfo.tagline}</p>
                        )}
                    </div>
                    {mode === 'desktop' && (
                         <Button size="lg" className="rounded-full bg-slate-900 text-white shadow-xl hover:bg-slate-800 px-8 h-12 text-sm font-bold uppercase tracking-wide">Give Support</Button>
                    )}
                </div>

                <div 
                    className={cn("text-slate-600 leading-relaxed font-light [&_p]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5", mode === 'mobile' ? "text-sm px-2 text-left" : "text-lg max-w-3xl")}
                    dangerouslySetInnerHTML={{ __html: basicInfo.bio }}
                />
                
                {/* Social Icons & Contact */}
                <div className={cn("flex flex-wrap gap-3", mode === 'mobile' && "justify-center")}>
                     {/* Contact Buttons */}
                     {contactInfo.website && (
                        <a href={contactInfo.website} target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 shadow-sm border border-slate-200 hover:bg-slate-100 transition-colors">
                            <Globe className="h-4 w-4" />
                        </a>
                     )}
                     {contactInfo.email && (
                        <a href={`mailto:${contactInfo.email}`} className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 shadow-sm border border-slate-200 hover:bg-slate-100 transition-colors">
                            <Mail className="h-4 w-4" />
                        </a>
                     )}
                     {contactInfo.phone && (
                        <a href={`tel:${contactInfo.phone}`} className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 shadow-sm border border-slate-200 hover:bg-slate-100 transition-colors">
                            <Phone className="h-4 w-4" />
                        </a>
                     )}

                    {SOCIAL_PLATFORMS.map(platform => {
                        const url = socialUrls[platform.key];
                        if (!url) return null;
                        return (
                            <a key={platform.key} href={url} target="_blank" rel="noopener noreferrer" className="group/icon">
                                <div 
                                    className="h-10 w-10 rounded-full flex items-center justify-center shadow-sm text-white transition-transform hover:scale-110"
                                    style={{ backgroundColor: platform.color }}
                                >
                                    <platform.icon className="h-4 w-4" />
                                </div>
                            </a>
                        )
                    })}
                </div>

                {mode === 'mobile' && (
                    <div className="w-full pt-4 pb-2 sticky bottom-4 z-30 px-2">
                         <Button className="w-full rounded-full bg-slate-900 text-white h-12 shadow-xl text-sm font-bold uppercase tracking-wide hover:bg-slate-800">Give Support</Button>
                    </div>
                )}
                
                {/* Projects Grid */}
                {projects.filter((p: any) => p.status === 'Public').length > 0 && (
                    <div className={cn("w-full pt-8", mode === 'desktop' ? "grid grid-cols-2 gap-6" : "space-y-4 px-2")}>
                        {mode === 'mobile' && <div className="flex items-center gap-4 py-2"><div className="h-px bg-slate-200 flex-1"></div><span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Campaigns</span><div className="h-px bg-slate-200 flex-1"></div></div>}
                        
                        {projects.filter((p: any) => p.status === 'Public').map((p: any) => (
                            <div key={p.id} className="group cursor-pointer rounded-2xl bg-white shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                <div className={cn("bg-slate-100 relative overflow-hidden", mode === 'mobile' ? "h-32" : "h-48")}>
                                    <div className="absolute inset-0 bg-slate-200 flex items-center justify-center text-slate-300">
                                        <ImageIcon className="h-10 w-10" />
                                    </div>
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                                </div>
                                <div className="p-5 space-y-3">
                                    <div>
                                        <h4 className="font-bold text-lg text-slate-900 leading-tight">{p.title}</h4>
                                        <p className="text-sm text-slate-500 mt-1 line-clamp-2">{p.description || "Support this specific cause..."}</p>
                                    </div>
                                    <div className="pt-2 flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <div className="h-1.5 w-24 bg-slate-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-blue-600 w-2/3 rounded-full" />
                                            </div>
                                            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">$8,200 raised</span>
                                        </div>
                                        <span className="text-xs font-bold text-blue-600 group-hover:underline">Donate &rarr;</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
       </div>
    </div>
  )
}

// --- Main Page Component ---

export const WorkerContent = () => {
  // --- State ---
  const [previewMode, setPreviewMode] = useState<'mobile' | 'desktop'>('mobile');
  
  // Data State
  const [basicInfo, setBasicInfo] = useState({
    displayName: "The Miller Family",
    location: "Chiang Mai, Thailand",
    tagline: "Serving communities in Northern Thailand",
    bio: "<p>We have been serving the Northern Thailand community for over 5 years, bringing hope and resources to families in need through our various outreach programs. Our focus is on education, clean water, and community development.</p>"
  });

  const [contactInfo, setContactInfo] = useState({
    email: "miller.family@givehope.org",
    website: "www.miller-mission.org",
    phone: ""
  });

  const [socialUrls, setSocialUrls] = useState<Record<string, string>>({
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    twitter: "",
    linkedin: "",
    youtube: "",
    github: ""
  });

  const [projects, setProjects] = useState<ProjectPage[]>(INITIAL_PROJECTS);
  
  // Images
  const [profileImage, setProfileImage] = useState<string>("https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?fit=facearea&facepad=2&w=400&h=400&q=80");
  const [coverImage, setCoverImage] = useState<string | null>("https://images.unsplash.com/photo-1528181304800-259b08848526?q=80&w=2070");
  
  // UI State
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingType, setUploadingType] = useState<'profile' | 'cover' | null>(null);
  
  // Project Dialog
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectPage | null>(null);

  // Refs
  const profileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  // --- Handlers ---

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'cover') => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadingType(type);
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (type === 'profile') setProfileImage(url);
      else setCoverImage(url);
      
      setUploadingType(null);
      e.target.value = ''; // Reset input
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      // In real app, toast success here
    }, 1000);
  };

  // Project Handlers
  const handleAddProject = () => {
    setEditingProject({
        id: '',
        title: '',
        slug: '',
        status: 'Draft',
        goal: '',
        description: ''
    });
    setIsProjectDialogOpen(true);
  };

  const handleEditProject = (project: ProjectPage) => {
    setEditingProject({...project});
    setIsProjectDialogOpen(true);
  };

  const handleSaveProject = () => {
    if (!editingProject) return;
    
    if (!editingProject.title) return;

    if (!editingProject.id) {
        // Create New
        const newProject: ProjectPage = { 
            ...editingProject, 
            id: Math.random().toString(36).substr(2, 9),
            slug: editingProject.slug || editingProject.title.toLowerCase().replace(/ /g, '-') 
        };
        setProjects([...projects, newProject]);
    } else {
        // Update Existing
        setProjects(projects.map(p => p.id === editingProject.id ? editingProject : p));
    }
    setIsProjectDialogOpen(false);
  };

  const handleDeleteProject = (id: string) => {
    setProjects(projects.filter(p => p.id !== id));
    setIsProjectDialogOpen(false);
  };

  return (
    <div className="h-full overflow-hidden flex flex-col animate-in fade-in duration-500">
      
      {/* Hidden File Inputs */}
      <input type="file" ref={profileInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'profile')} />
      <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'cover')} />

      {/* Main Container */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50/50">
        <div className="max-w-[1600px] mx-auto space-y-8">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">Content & Profile</h1>
              <p className="text-slate-500 mt-1">Manage your public presence and giving pages.</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="h-9 bg-white">
                <Eye className="h-4 w-4 mr-2" /> Live Site
              </Button>
              <Button onClick={handleSave} disabled={isSaving} className="h-9 shadow-md bg-slate-900 text-white hover:bg-slate-800 min-w-[120px]">
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
              </Button>
            </div>
          </div>

          <Tabs defaultValue="profile" className="space-y-8">
            <TabsList className="bg-slate-200/50 h-11 p-1 inline-flex w-auto rounded-lg">
              <TabsTrigger value="profile" className="px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm">Personal Profile</TabsTrigger>
              <TabsTrigger value="projects" className="px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm">Project Pages</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="mt-0 outline-none">
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                
                {/* LEFT COLUMN: EDITING FORMS */}
                <div className="xl:col-span-7 2xl:col-span-8 space-y-8">
                  
                  {/* Basic Info */}
                  <Card>
                    <CardHeader className="pb-4 border-b border-slate-100">
                      <CardTitle>Basic Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label>Display Name</Label>
                          <Input 
                            value={basicInfo.displayName} 
                            onChange={(e) => setBasicInfo({...basicInfo, displayName: e.target.value})}
                            className="bg-white" 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Location</Label>
                          <Input 
                            value={basicInfo.location}
                            onChange={(e) => setBasicInfo({...basicInfo, location: e.target.value})}
                            className="bg-white" 
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Tagline</Label>
                        <Input 
                          value={basicInfo.tagline}
                          onChange={(e) => setBasicInfo({...basicInfo, tagline: e.target.value})}
                          className="bg-white" 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Bio</Label>
                        <RichTextEditor 
                          value={basicInfo.bio} 
                          onChange={(val) => setBasicInfo({...basicInfo, bio: val})} 
                          className="min-h-[200px]"
                        />
                        <p className="text-xs text-slate-400 text-right">Rich text formatting supported</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Imagery */}
                  <Card>
                    <CardHeader className="pb-4 border-b border-slate-100">
                      <CardTitle>Imagery</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                      <div className="flex items-start gap-6">
                        <div className="relative h-24 w-24 shrink-0">
                          <Avatar className="h-24 w-24 border-2 border-slate-200">
                            <AvatarImage src={profileImage} className={uploadingType === 'profile' ? "opacity-50 blur-[1px]" : ""} />
                            <AvatarFallback>MF</AvatarFallback>
                          </Avatar>
                          {uploadingType === 'profile' && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-full">
                              <Loader2 className="h-6 w-6 text-slate-900 animate-spin" />
                            </div>
                          )}
                        </div>
                        <div className="space-y-2 flex-1">
                          <h4 className="font-medium text-sm text-slate-900">Profile Photo</h4>
                          <p className="text-xs text-slate-500">Recommended 400x400px. JPG or PNG.</p>
                          <Button variant="outline" size="sm" onClick={() => profileInputRef.current?.click()} disabled={!!uploadingType}>
                            <Upload className="h-4 w-4 mr-2" /> Upload New
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label>Cover Image</Label>
                        <div 
                          className="h-40 bg-slate-50 rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-slate-200 hover:border-blue-400 hover:bg-slate-100 transition-all cursor-pointer group relative overflow-hidden"
                          onClick={() => !uploadingType && coverInputRef.current?.click()}
                        >
                          {uploadingType === 'cover' && (
                            <div className="absolute inset-0 bg-white/50 z-20 flex items-center justify-center backdrop-blur-sm">
                              <div className="flex flex-col items-center gap-2">
                                <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                                <span className="text-sm font-medium">Uploading...</span>
                              </div>
                            </div>
                          )}
                          {coverImage ? (
                            <>
                              <img src={coverImage} className="w-full h-full object-cover" alt="Cover" />
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-white font-medium flex items-center gap-2"><Edit2 className="h-4 w-4" /> Change Cover</span>
                              </div>
                            </>
                          ) : (
                            <>
                              <ImageIcon className="h-8 w-8 text-slate-400 mb-2 group-hover:text-blue-500 transition-colors" />
                              <span className="text-sm font-medium text-slate-500 group-hover:text-slate-900">Click to upload cover</span>
                              <span className="text-xs text-slate-400">1200x400px recommended</span>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Contact Info */}
                  <Card>
                    <CardHeader className="pb-4 border-b border-slate-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>Public Contact Details</CardTitle>
                          <CardDescription className="mt-1">Add contact methods for donors to reach you directly.</CardDescription>
                        </div>
                        <Badge variant="secondary" className="font-normal text-xs bg-slate-100 text-slate-500 border-slate-200">Optional Section</Badge>
                      </div>
                      <div className="mt-2 p-2 bg-slate-50 border border-blue-100 rounded-md text-xs text-slate-500 flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-blue-500" />
                        <span>Fields left blank will be automatically hidden from your public profile.</span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="flex justify-between items-center">
                            Contact Email <span className="text-[10px] font-normal text-slate-400 uppercase">Optional</span>
                          </Label>
                          <div className="flex items-center gap-3 group">
                            <div className="h-10 w-10 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center text-slate-500 group-focus-within:border-blue-300 group-focus-within:text-blue-600 transition-colors shrink-0">
                              <Mail className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <Input 
                                placeholder="contact@example.com" 
                                className="bg-white" 
                                value={contactInfo.email}
                                onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="flex justify-between items-center">
                            Personal Website <span className="text-[10px] font-normal text-slate-400 uppercase">Optional</span>
                          </Label>
                          <div className="flex items-center gap-3 group">
                            <div className="h-10 w-10 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center text-slate-500 group-focus-within:border-blue-300 group-focus-within:text-blue-600 transition-colors shrink-0">
                              <Globe className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <Input 
                                placeholder="https://yourwebsite.com" 
                                className="bg-white" 
                                value={contactInfo.website}
                                onChange={(e) => setContactInfo({...contactInfo, website: e.target.value})}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 max-w-md">
                        <Label className="flex justify-between items-center">
                          Phone Number <span className="text-[10px] font-normal text-slate-400 uppercase">Optional</span>
                        </Label>
                        <div className="flex gap-3 group">
                          <div className="w-[80px] shrink-0">
                             <Select defaultValue="US">
                                <option value="US">US +1</option>
                                <option value="TH">TH +66</option>
                             </Select>
                          </div>
                          <div className="flex-1 relative">
                            <div className="absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center text-slate-400 group-focus-within:text-blue-600 transition-colors pointer-events-none">
                              <Phone className="h-4 w-4" />
                            </div>
                            <Input 
                              placeholder="(555) 123-4567" 
                              className="bg-white pl-10 h-10" 
                              value={contactInfo.phone}
                              onChange={(e) => setContactInfo({...contactInfo, phone: e.target.value})}
                            />
                          </div>
                        </div>
                        <p className="text-[11px] text-slate-400">Only provide if you welcome calls/texts. Leave empty to hide.</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Social Links */}
                  <Card>
                    <CardHeader className="pb-4 border-b border-slate-100">
                      <div className="flex items-center justify-between">
                        <CardTitle>Social Links</CardTitle>
                        <Badge variant="outline" className="font-normal text-xs text-slate-500">Optional</Badge>
                      </div>
                      <CardDescription>
                        Connect your social platforms. Icons will only appear on your page for the networks you add below.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {SOCIAL_PLATFORMS.map((platform) => {
                          const value = socialUrls[platform.key];
                          const isActive = value?.length > 0;
                          return (
                            <div key={platform.key} className="relative group">
                              <div className="absolute left-3 top-2.5 z-10">
                                <platform.icon 
                                  className={cn(
                                    "h-5 w-5 transition-all duration-300", 
                                    isActive ? "opacity-100" : "opacity-40 grayscale group-hover:opacity-70 group-hover:grayscale-0"
                                  )} 
                                  style={isActive ? { color: platform.color } : {}}
                                />
                              </div>
                              <div className="absolute left-10 top-2.5 bottom-2.5 w-px bg-slate-200"></div>
                              <Input 
                                placeholder={platform.placeholder} 
                                className={cn(
                                  "pl-12 transition-all duration-300",
                                  isActive ? "bg-white ring-1 ring-offset-0" : "bg-slate-50/50 hover:bg-slate-50 focus:bg-white"
                                )}
                                style={isActive ? { borderColor: platform.color, boxShadow: `0 0 0 1px ${platform.color} inset` } : {}}
                                value={value}
                                onChange={(e) => setSocialUrls({...socialUrls, [platform.key]: e.target.value})}
                              />
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* RIGHT COLUMN: PREVIEW */}
                <div className="hidden xl:block xl:col-span-5 2xl:col-span-4">
                  <div className="sticky top-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium text-slate-500 uppercase tracking-wider">Live Preview</Label>
                      <div className="flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200">
                        <button onClick={() => setPreviewMode('mobile')} className={cn("p-1.5 rounded-md transition-all", previewMode === 'mobile' ? "bg-white shadow-sm text-blue-600" : "text-slate-500 hover:text-slate-900")} title="Mobile Preview">
                          <Smartphone className="h-4 w-4" />
                        </button>
                        <button onClick={() => setPreviewMode('desktop')} className={cn("p-1.5 rounded-md transition-all", previewMode === 'desktop' ? "bg-white shadow-sm text-blue-600" : "text-slate-500 hover:text-slate-900")} title="Desktop Preview">
                          <Monitor className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Preview Container */}
                    <div className="flex justify-center">
                      {previewMode === 'mobile' ? (
                        /* Mobile Frame */
                        <div className="w-[300px] h-[610px] mx-auto border-[4px] border-[#2c2c2c] rounded-[44px] bg-[#121212] shadow-2xl relative overflow-hidden select-none ring-1 ring-black/10 transition-all duration-500">
                          <div className="w-full h-full bg-white rounded-[38px] overflow-hidden relative flex flex-col">
                            {/* Dynamic Island */}
                            <div className="absolute top-0 left-0 right-0 h-8 z-50 pointer-events-none flex justify-center pt-2">
                              <div className="bg-black h-[22px] w-[90px] rounded-full flex items-center justify-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#1a1a1a] ml-12 opacity-80" />
                              </div>
                            </div>
                            {/* Content */}
                            <div className="flex-1 w-full overflow-y-auto scrollbar-hide bg-white relative">
                              <PreviewContent 
                                mode='mobile'
                                coverImage={coverImage}
                                profileImage={profileImage}
                                contactInfo={contactInfo}
                                socialUrls={socialUrls}
                                projects={projects}
                                basicInfo={basicInfo}
                              />
                            </div>
                            {/* Home Indicator */}
                            <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-28 h-1 bg-black/20 rounded-full z-50 pointer-events-none" />
                          </div>
                        </div>
                      ) : (
                        /* Desktop Frame */
                        <div className="w-full relative shadow-2xl rounded-lg border border-slate-200 bg-white overflow-hidden">
                          <div className="h-9 bg-slate-100 border-b flex items-center px-4 gap-2">
                            <div className="flex gap-1.5">
                              <div className="w-3 h-3 rounded-full bg-[#FF5F57] border border-[#E0443E]" />
                              <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]" />
                              <div className="w-3 h-3 rounded-full bg-[#28C840] border border-[#1AAB29]" />
                            </div>
                            <div className="flex-1 flex justify-center px-4">
                              <div className="h-6 w-full max-w-sm bg-white rounded-md border shadow-sm flex items-center justify-center text-[10px] text-slate-400 font-mono">
                                missioncontrol.io/the-miller-family
                              </div>
                            </div>
                          </div>
                          <div className="relative w-full aspect-[16/10] bg-slate-50 overflow-hidden group/monitor">
                            <div className="absolute top-0 left-0 origin-top-left w-[1280px] h-[800px]" style={{ transform: 'scale(0.39)' }}>
                              <PreviewContent 
                                mode='desktop'
                                coverImage={coverImage}
                                profileImage={profileImage}
                                contactInfo={contactInfo}
                                socialUrls={socialUrls}
                                projects={projects}
                                basicInfo={basicInfo}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="projects" className="mt-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-4">
                  <div>
                    <CardTitle>Project Pages</CardTitle>
                    <CardDescription>Manage designated giving pages listed on your profile.</CardDescription>
                  </div>
                  <Button onClick={handleAddProject} className="bg-slate-900 text-white shadow-md">
                    <Plus className="h-4 w-4 mr-2" /> Create Page
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {projects.length === 0 ? (
                      <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                        <ImageIcon className="h-10 w-10 mx-auto mb-3 text-slate-300" />
                        <p className="text-slate-500">No project pages created yet.</p>
                      </div>
                    ) : (
                      projects.map(project => (
                        <div key={project.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-slate-200 rounded-xl bg-white hover:border-blue-200 transition-all group gap-4 shadow-sm">
                          <div className="flex gap-4 items-center">
                            <div className="h-12 w-12 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors shrink-0">
                              <Target className="h-6 w-6" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="font-semibold text-slate-900 truncate">{project.title}</p>
                                <Badge 
                                  variant="secondary"
                                  className={cn(
                                    "font-normal text-[10px] h-5 px-1.5",
                                    project.status === 'Public' ? "bg-green-100 text-green-700 border-green-200" : "bg-slate-100 text-slate-600 border-slate-200"
                                  )}
                                >
                                  {project.status}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                                <span className="font-mono bg-slate-50 px-1.5 rounded border border-slate-100">/{project.slug}</span>
                                <span>•</span>
                                <span>Goal: ${project.goal}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2 self-end sm:self-auto">
                            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-900">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="gap-2 bg-white" onClick={() => handleEditProject(project)}>
                              <Edit2 className="h-3.5 w-3.5" /> Edit
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Project Edit Dialog */}
          <Dialog open={isProjectDialogOpen} onOpenChange={setIsProjectDialogOpen}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>{editingProject?.id ? 'Edit Project Page' : 'Create New Project Page'}</DialogTitle>
                <DialogDescription>
                  These pages appear on your main profile and allow donors to give to specific funds.
                </DialogDescription>
              </DialogHeader>
              
              {editingProject && (
                <div className="space-y-6 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Page Title</Label>
                      <Input 
                        value={editingProject.title} 
                        onChange={(e) => setEditingProject({...editingProject, title: e.target.value, slug: editingProject.id ? editingProject.slug : e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-')})}
                        placeholder="e.g. Vehicle Fund" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>URL Slug</Label>
                      <div className="flex items-center">
                        <span className="bg-slate-100 px-3 h-10 flex items-center border border-r-0 border-slate-300 rounded-l-md text-xs text-slate-500">/</span>
                        <Input 
                          value={editingProject.slug} 
                          onChange={(e) => setEditingProject({...editingProject, slug: e.target.value})}
                          className="rounded-l-none" 
                          placeholder="vehicle-fund" 
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Fundraising Goal ($)</Label>
                      <Input 
                        type="number" 
                        value={editingProject.goal}
                        onChange={(e) => setEditingProject({...editingProject, goal: e.target.value})}
                        placeholder="5000" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select 
                        value={editingProject.status} 
                        onChange={(e) => setEditingProject({...editingProject, status: e.target.value as any})}
                      >
                        <option value="Draft">Draft</option>
                        <option value="Public">Public</option>
                        <option value="Private">Private</option>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Short Description</Label>
                    <Textarea 
                      value={editingProject.description}
                      onChange={(e) => setEditingProject({...editingProject, description: e.target.value})}
                      placeholder="Explain what this fund is for..."
                      className="h-24 resize-none"
                    />
                  </div>

                  <div className="rounded-lg bg-slate-50 p-6 border border-dashed border-slate-300 flex flex-col items-center justify-center text-center">
                    <ImageIcon className="h-8 w-8 text-slate-300 mb-2" />
                    <p className="text-sm font-medium text-slate-700">Project Cover Image</p>
                    <p className="text-xs text-slate-500 mb-3">Upload a specific image for this campaign card.</p>
                    <Button variant="outline" size="sm" className="h-8 bg-white">Upload Image</Button>
                  </div>
                </div>
              )}

              <DialogFooter className="flex justify-between items-center sm:justify-between">
                {editingProject?.id ? (
                  <Button variant="ghost" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDeleteProject(editingProject.id)}>
                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                  </Button>
                ) : <div></div>}
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setIsProjectDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleSaveProject} className="bg-slate-900 text-white">Save Page</Button>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>

        </div>
      </div>
    </div>
  );
};
