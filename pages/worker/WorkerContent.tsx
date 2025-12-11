
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Link } from 'react-router-dom';
import { ArrowRight, Layers } from 'lucide-react';
import { RichTextEditor } from '../../components/ui/RichTextEditor';

interface ContentData {
  bio: string;
  profileImageUrl: string;
  coverImageUrl: string;
  socials: { [key: string]: string };
}

export const WorkerContent: React.FC = () => {
  const [data, setData] = useState<ContentData>({
    bio: "",
    profileImageUrl: "",
    coverImageUrl: "",
    socials: {}
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Previews
  const [profilePreview, setProfilePreview] = useState<string>("");
  const [coverPreview, setCoverPreview] = useState<string>("");

  useEffect(() => {
    // Simulate Fetch
    setTimeout(() => {
        const initialData = {
            bio: "<p>We are the Miller family, serving in Northern Thailand since 2018. Our passion is to see rural communities transformed through education and sustainable development. We partner with local schools to provide English language training and after-school programs.</p>",
            // Updated to high quality family portrait (Reliable Unsplash ID)
            profileImageUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?fit=facearea&facepad=2&w=400&h=400&q=80",
            // Updated to relevant landscape/location shot
            coverImageUrl: "https://images.unsplash.com/photo-1528181304800-259b08848526?q=80&w=2070",
            socials: {
                facebook: "https://facebook.com/millerfamily",
                instagram: "https://instagram.com/millermission",
                youtube: "",
                twitter: ""
            }
        };
        setData(initialData);
        setProfilePreview(initialData.profileImageUrl);
        setCoverPreview(initialData.coverImageUrl);
        setLoading(false);
    }, 500);
  }, []);

  const handleImageChange = (file: File | null, type: "profile" | "cover") => {
    if (file) {
      const url = URL.createObjectURL(file);
      if (type === "profile") setProfilePreview(url);
      if (type === "cover") setCoverPreview(url);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    // Simulate API call
    setTimeout(() => {
        setSaving(false);
        setMessage("Changes saved successfully!");
        setTimeout(() => setMessage(null), 3000);
    }, 1000);
  };

  if (loading) return <div className="p-8">Loading content editor...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="text-2xl font-bold tracking-tight">My Giving Page</h1>
            <p className="text-muted-foreground">Manage your public profile content, story, and social links.</p>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="outline" asChild size="sm">
                <Link to="/worker-dashboard/pages">
                    <Layers className="mr-2 h-4 w-4" /> Manage All Pages
                </Link>
            </Button>
            <Button asChild size="sm" variant="secondary">
                <a href="/workers/1" target="_blank" rel="noreferrer">
                    View Live Page <ArrowRight className="ml-2 h-4 w-4" />
                </a>
            </Button>
        </div>
      </div>
      
      {message && <div className="bg-green-50 text-green-600 px-4 py-2 rounded-md border border-green-200 text-sm font-medium">{message}</div>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Images</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Cover */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Cover Image</label>
                        <div className="relative h-40 w-full bg-slate-100 rounded-lg overflow-hidden border">
                            {coverPreview && <img src={coverPreview} alt="Cover" className="w-full h-full object-cover" />}
                        </div>
                        <div className="mt-2">
                             <input type="file" accept="image/*" onChange={(e) => handleImageChange(e.target.files?.[0] || null, "cover")} className="text-sm text-muted-foreground" />
                        </div>
                    </div>

                    {/* Profile */}
                    <div className="flex items-center gap-6">
                        <div className="relative h-24 w-24 bg-slate-100 rounded-full overflow-hidden border">
                             {profilePreview && <img src={profilePreview} alt="Profile" className="w-full h-full object-cover" />}
                        </div>
                        <div className="flex-1">
                             <label className="block text-sm font-medium mb-1">Profile Photo</label>
                             <input type="file" accept="image/*" onChange={(e) => handleImageChange(e.target.files?.[0] || null, "profile")} className="text-sm text-muted-foreground" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Bio & Story</CardTitle>
                </CardHeader>
                <CardContent>
                    <RichTextEditor 
                        value={data.bio}
                        onChange={(val) => setData({...data, bio: val})}
                        className="min-h-[300px]"
                    />
                </CardContent>
            </Card>
        </div>

        <div className="space-y-6">
             <Card>
                <CardHeader>
                    <CardTitle className="text-base">Social Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div>
                        <label className="text-xs font-medium text-muted-foreground">Facebook</label>
                        <Input 
                            value={data.socials.facebook || ""} 
                            onChange={(e) => setData({...data, socials: {...data.socials, facebook: e.target.value}})}
                            placeholder="https://facebook.com/..." 
                        />
                    </div>
                    <div>
                        <label className="text-xs font-medium text-muted-foreground">Instagram</label>
                        <Input 
                            value={data.socials.instagram || ""} 
                            onChange={(e) => setData({...data, socials: {...data.socials, instagram: e.target.value}})}
                            placeholder="https://instagram.com/..." 
                        />
                    </div>
                     <div>
                        <label className="text-xs font-medium text-muted-foreground">Twitter / X</label>
                        <Input 
                            value={data.socials.twitter || ""} 
                            onChange={(e) => setData({...data, socials: {...data.socials, twitter: e.target.value}})}
                            placeholder="https://twitter.com/..." 
                        />
                    </div>
                     <div>
                        <label className="text-xs font-medium text-muted-foreground">YouTube</label>
                        <Input 
                            value={data.socials.youtube || ""} 
                            onChange={(e) => setData({...data, socials: {...data.socials, youtube: e.target.value}})}
                            placeholder="https://youtube.com/..." 
                        />
                    </div>
                </CardContent>
            </Card>

            <Button onClick={handleSave} disabled={saving} className="w-full h-10" >
                {saving ? "Saving..." : "Save Changes"}
            </Button>
        </div>
      </div>
    </div>
  );
};
