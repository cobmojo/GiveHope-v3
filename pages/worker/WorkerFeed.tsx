
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/Avatar';
import { Switch } from '../../components/ui/Switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../components/ui/Dialog';
import { DropdownMenu, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuContent } from '../../components/ui/DropdownMenu';
import { 
  Image as ImageIcon, Heart, MessageCircle, MoreHorizontal, 
  Globe, Lock, Share2, Trash2, X, Check, Users, Sparkles, Pin,
  ExternalLink, ChevronDown, Smile, Send,
  Bold, Italic, Underline, Heading1, Heading2, Quote, List, ListOrdered, Link as LinkIcon,
  LucideIcon, Briefcase, Zap, Loader2
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { GoogleGenAI } from "@google/genai";
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Textarea } from '../../components/ui/Textarea';
import { Select } from '../../components/ui/Select';

// --- Types ---
interface Comment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  date: string;
}

interface Post {
  id: number;
  type: 'Update' | 'Prayer Request' | 'Story' | 'Newsletter';
  content: string; // HTML-like string
  imageUrl?: string;
  visibility: 'Public Feed' | 'Partners Only';
  likes: number;
  prayers: number;
  comments: Comment[];
  date: string;
  author: string;
  avatar: string;
  isPinned?: boolean;
  liked?: boolean;
  prayed?: boolean;
}

interface FollowerRequest {
  id: string;
  name: string;
  email: string;
  avatar: string;
  date: string;
}

interface Follower {
  id: string;
  name: string;
  avatar: string;
}

interface ToolbarBtnProps {
  active?: boolean;
  onClick: () => void;
  icon: LucideIcon;
  title: string;
}

// --- Images (High Quality Sources) ---
const IMAGES = {
  // Main User: The Miller Family (Reliable Avatar)
  MILLER_AVATAR: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?fit=facearea&facepad=2&w=256&h=256&q=80",
  
  // Post Content
  WATER_PROJECT: "https://images.unsplash.com/photo-1536053468241-7649c0d6628c?w=1200&auto=format&fit=crop&q=80", // Hands with water
  RAINY_WINDOW: "https://images.unsplash.com/photo-1515549832467-8783363e19b6?w=1200&auto=format&fit=crop&q=80", // Moody rain
  COMMUNITY_STORY: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&auto=format&fit=crop&q=80", // Kids/Charity

  // Supporter Avatars
  AVATARS: [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?fit=facearea&facepad=2&w=256&h=256&q=80", // Woman 1
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?fit=facearea&facepad=2&w=256&h=256&q=80", // Man 1
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?fit=facearea&facepad=2&w=256&h=256&q=80", // Woman 2
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?fit=facearea&facepad=2&w=256&h=256&q=80", // Man 2
    "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?fit=facearea&facepad=2&w=256&h=256&q=80", // Woman 3
  ]
};

// --- Worker Comment Section Component ---
const WorkerCommentSection = ({ post, onAddComment }: { post: Post, onAddComment: (id: number, text: string) => void }) => {
  const [text, setText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async (tone: 'Professional' | 'Empathetic' | 'Concise') => {
    setIsGenerating(true);
    try {
      const apiKey = process.env.API_KEY;
      if (!apiKey) {
        // Fallback for demo without key
        await new Promise(r => setTimeout(r, 1000));
        if (tone === 'Professional') setText("Thank you for your support. It means a lot to our team and the community.");
        else if (tone === 'Empathetic') setText("We are so grateful for your prayers and kind words during this time.");
        else setText("Thanks for the update!");
        return;
      }

      const ai = new GoogleGenAI({ apiKey });
      const cleanContent = post.content.replace(/<[^>]+>/g, '');
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Draft a short (1-2 sentences) ${tone.toLowerCase()} reply to this update from a field worker's perspective. Context: "${cleanContent}"`,
      });
      setText(response.text?.trim() || "");
    } catch (e) {
      console.error("AI Generation Error", e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = () => {
    if (text.trim()) {
      onAddComment(post.id, text);
      setText('');
    }
  };

  return (
    <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 space-y-4">
      {/* Comments List */}
      {post.comments.length > 0 && (
        <div className="space-y-4 mb-4">
          {post.comments.map(comment => (
            <div key={comment.id} className="flex gap-3 group">
              <Avatar className="h-8 w-8 ring-2 ring-white">
                <AvatarImage src={comment.avatar} />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="bg-white px-3 py-2 rounded-2xl rounded-tl-none border border-slate-200/60 shadow-sm text-sm inline-block">
                  <div className="flex items-baseline gap-2 mb-0.5">
                    <span className="font-semibold text-slate-900 text-xs">{comment.author}</span>
                    <span className="text-[10px] text-slate-400">{comment.date}</span>
                  </div>
                  <p className="text-slate-700 leading-normal text-xs">{comment.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* AI Tone Selectors */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        <button 
            onClick={() => handleGenerate('Professional')}
            disabled={isGenerating}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors whitespace-nowrap shadow-sm disabled:opacity-50"
        >
            <Briefcase className="h-3 w-3 text-blue-500" />
            Professional
        </button>
        <button 
            onClick={() => handleGenerate('Empathetic')}
            disabled={isGenerating}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors whitespace-nowrap shadow-sm disabled:opacity-50"
        >
            <Heart className="h-3 w-3 text-rose-500" />
            Empathetic
        </button>
        <button 
            onClick={() => handleGenerate('Concise')}
            disabled={isGenerating}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors whitespace-nowrap shadow-sm disabled:opacity-50"
        >
            <Zap className="h-3 w-3 text-amber-500" />
            Concise
        </button>
        {isGenerating && <Loader2 className="h-4 w-4 animate-spin text-slate-400 ml-2" />}
      </div>

      {/* Input */}
      <div className="relative group">
        <Input 
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="Write a reply..." 
          className="w-full bg-white border border-slate-200 rounded-full pl-4 pr-10 py-2 h-10 text-sm focus:outline-none focus:ring-1 focus:ring-slate-300 shadow-sm" 
        />
        <button 
          onClick={handleSubmit}
          disabled={!text.trim()}
          className="absolute right-1 top-1 p-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-100 disabled:text-slate-300 rounded-full text-white transition-all w-8 h-8 flex items-center justify-center"
        >
          <Send className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};

export const WorkerFeed: React.FC = () => {
  // --- State ---
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      type: 'Update',
      content: "<p>We are thrilled to announce that the new well in the northern village is fully operational! Over 500 families now have access to clean, safe drinking water. Thank you to everyone who donated to the 'Water for Life' campaign. The joy on their faces today was absolutely priceless. 💧💙</p>",
      imageUrl: IMAGES.WATER_PROJECT,
      visibility: 'Public Feed',
      likes: 245,
      prayers: 89,
      comments: [
        { id: 'c1', author: 'Sarah Jenkins', avatar: IMAGES.AVATARS[0], content: 'This is amazing news! Praise God! 🙌', date: '1h ago' },
        { id: 'c2', author: 'David Wilson', avatar: IMAGES.AVATARS[1], content: 'So glad to see our contributions making a real difference.', date: '45m ago' }
      ],
      date: "2 hours ago",
      author: "The Miller Family",
      avatar: IMAGES.MILLER_AVATAR,
      isPinned: true,
      liked: true
    },
    {
      id: 2,
      type: 'Prayer Request',
      content: "<p><strong>Urgent Prayer Request:</strong> Please pray for the monsoon season here. Heavy rains have caused some flooding in the lower districts where we work. Our team is safe, but many families we serve are struggling to keep their homes dry. 🙏</p>",
      imageUrl: IMAGES.RAINY_WINDOW,
      visibility: 'Partners Only',
      likes: 89,
      prayers: 156,
      comments: [],
      date: "3 days ago",
      author: "The Miller Family",
      avatar: IMAGES.MILLER_AVATAR
    },
    {
      id: 3,
      type: 'Story',
      content: "<p>Today we met Ananya. She walks 5 miles every day to attend our after-school program. Her dedication to learning English is inspiring. She told us, 'I want to be a doctor so I can help my village.' With your support, we can provide her the books she needs. 📚</p>",
      imageUrl: IMAGES.COMMUNITY_STORY,
      visibility: 'Public Feed',
      likes: 120,
      prayers: 45,
      comments: [
        { id: 'c3', author: 'Emily Davis', avatar: IMAGES.AVATARS[2], content: 'Ananya is a star! ⭐ Sent a small gift for books.', date: '1d ago' }
      ],
      date: "5 days ago",
      author: "The Miller Family",
      avatar: IMAGES.MILLER_AVATAR
    }
  ]);

  const [requests, setRequests] = useState<FollowerRequest[]>([
    { id: 'r1', name: 'Robert Fox', email: 'robert.fox@example.com', avatar: IMAGES.AVATARS[3], date: '2d ago' },
    { id: 'r2', name: 'Arlene McCoy', email: 'arlene.mccoy@example.com', avatar: IMAGES.AVATARS[2], date: '1d ago' },
  ]);

  const [followers] = useState<Follower[]>([
    { id: 'f1', name: 'Jane Cooper', avatar: IMAGES.AVATARS[0] },
    { id: 'f2', name: 'Wade Warren', avatar: IMAGES.AVATARS[1] },
    { id: 'f3', name: 'Esther Howard', avatar: IMAGES.AVATARS[2] },
    { id: 'f4', name: 'Cameron Williamson', avatar: IMAGES.AVATARS[3] },
    { id: 'f5', name: 'Brooklyn Simmons', avatar: IMAGES.AVATARS[4] },
  ]);

  const [settings, setSettings] = useState({
    publicFeed: true,
    allowComments: true
  });

  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);

  // Composer State
  const [activeFormats, setActiveFormats] = useState<string[]>([]);
  const [newContent, setNewContent] = useState("");
  const [newImage, setNewImage] = useState<string | null>(null);
  const [postType, setPostType] = useState<Post['type']>('Update');
  const [visibility, setVisibility] = useState<Post['visibility']>('Public Feed');
  const [isFocused, setIsFocused] = useState(false);
  
  // AI Drafting State
  const [isMagicDraftOpen, setIsMagicDraftOpen] = useState(false);
  const [draftPrompt, setDraftPrompt] = useState("");
  const [draftTone, setDraftTone] = useState("Inspiring");
  const [isDrafting, setIsDrafting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  // --- Rich Text Logic ---
  const updateActiveFormats = useCallback(() => {
    if (typeof document === 'undefined') return;
    
    const formats: string[] = [];
    const queryState = (cmd: string) => document.queryCommandState(cmd);
    const queryValue = (cmd: string) => document.queryCommandValue(cmd);

    if (queryState('bold')) formats.push('bold');
    if (queryState('italic')) formats.push('italic');
    if (queryState('underline')) formats.push('underline');
    if (queryState('insertUnorderedList')) formats.push('ul');
    if (queryState('insertOrderedList')) formats.push('ol');
    
    const block = queryValue('formatBlock');
    if (block && block.toLowerCase() === 'h1') formats.push('h1');
    if (block && block.toLowerCase() === 'h2') formats.push('h2');
    if (block && block.toLowerCase() === 'blockquote') formats.push('blockquote');

    setActiveFormats(formats);
  }, []);

  useEffect(() => {
    const handleSelection = () => {
        if (document.activeElement === editorRef.current || editorRef.current?.contains(document.activeElement)) {
            updateActiveFormats();
        }
    };
    document.addEventListener('selectionchange', handleSelection);
    return () => document.removeEventListener('selectionchange', handleSelection);
  }, [updateActiveFormats]);

  const exec = (command: string, val: string | undefined = undefined) => {
    document.execCommand(command, false, val);
    editorRef.current?.focus();
    updateActiveFormats();
    handleInput();
  };

  const handleInput = () => {
    if (editorRef.current) {
        setNewContent(editorRef.current.innerHTML);
    }
  };

  const handleMagicDraft = async () => {
    if (!draftPrompt) return;
    setIsDrafting(true);
    
    try {
        const apiKey = process.env.API_KEY;
        if (!apiKey) {
            await new Promise(r => setTimeout(r, 1500));
            const mock = `<p>We visited the village today and distributed <strong>50 mosquito nets</strong>. The joy in their eyes was unforgettable!</p><p>Thank you for making this possible.</p>`;
            if (editorRef.current) editorRef.current.innerHTML = mock;
            setNewContent(mock);
            setIsMagicDraftOpen(false);
            setIsDrafting(false);
            return;
        }

        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Draft a short social media update for a humanitarian field worker. 
            Topic: ${draftPrompt}
            Tone: ${draftTone}
            Format: HTML paragraphs, use <strong> for emphasis. Max 3 sentences.`
        });

        const html = response.text?.trim() || "";
        if (editorRef.current) editorRef.current.innerHTML = html;
        setNewContent(html);
        setIsMagicDraftOpen(false);
    } catch (e) {
        console.error(e);
    } finally {
        setIsDrafting(false);
    }
  };

  // --- Handlers ---

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      if (newImage) URL.revokeObjectURL(newImage);
      setNewImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleCreatePost = () => {
    // Check if empty (strip tags)
    const stripped = newContent.replace(/<[^>]*>?/gm, '').trim();
    if (!stripped && !newImage) return;

    const newPost: Post = {
      id: Date.now(),
      type: postType,
      content: newContent,
      imageUrl: newImage || undefined,
      visibility,
      likes: 0,
      prayers: 0,
      comments: [],
      date: "Just now",
      author: "The Miller Family",
      avatar: IMAGES.MILLER_AVATAR
    };

    setPosts([newPost, ...posts]);
    setNewContent("");
    if (editorRef.current) editorRef.current.innerHTML = "";
    setNewImage(null);
  };

  const handleReaction = (id: number, type: 'like' | 'prayer') => {
    setPosts(posts.map(p => {
      if (p.id !== id) return p;
      if (type === 'like') return { ...p, likes: p.liked ? p.likes - 1 : p.likes + 1, liked: !p.liked };
      if (type === 'prayer') return { ...p, prayers: p.prayed ? p.prayers - 1 : p.prayers + 1, prayed: !p.prayed };
      return p;
    }));
  };

  const handleAddComment = (postId: number, text: string) => {
    const newComment: Comment = {
      id: `c_${Date.now()}`,
      author: 'The Miller Family',
      avatar: IMAGES.MILLER_AVATAR,
      content: text,
      date: 'Just now'
    };
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p));
  };

  const handleRequest = (id: string, action: 'approve' | 'ignore') => {
    setRequests(requests.filter(r => r.id !== id));
  };

  const handleDeletePost = (id: number) => {
    if (confirm("Are you sure you want to delete this post?")) {
      setPosts(posts.filter(p => p.id !== id));
    }
  };

  const handlePinPost = (id: number) => {
     setPosts(posts.map(p => {
         if (p.id === id) return { ...p, isPinned: !p.isPinned };
         return p;
     }));
  }

  const postTypes: Post['type'][] = ['Update', 'Prayer Request', 'Story', 'Newsletter'];

  // Helper for toolbar buttons
  const ToolbarBtn = ({ active, onClick, icon: Icon, title }: ToolbarBtnProps) => (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      className={cn(
        "p-2 rounded-lg transition-all duration-200 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100",
        active && "bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700"
      )}
      title={title}
    >
      <Icon className="w-4 h-4" />
    </button>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">My Feed</h1>
          <p className="text-muted-foreground">Share your journey and connect with your supporters.</p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsRequestDialogOpen(true)} className="bg-white">
                <Users className="mr-2 h-4 w-4" />
                Requests
                {requests.length > 0 && <Badge variant="secondary" className="ml-2 h-5 min-w-[1.25rem] px-1 justify-center rounded-full bg-blue-100 text-blue-700">{requests.length}</Badge>}
            </Button>
            <Button size="sm" className="shadow-md">
                <Share2 className="mr-2 h-4 w-4" /> Share Feed Link
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Feed Column */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* CUSTOM COMPOSER CARD - REDESIGNED */}
          <div className={cn(
            "bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-all duration-300",
            isFocused ? "shadow-md border-slate-300 ring-1 ring-slate-100" : ""
          )}>
            <div className="p-6 space-y-6">
                
                {/* 1. Type Selectors (Pills) */}
                <div className="flex flex-wrap gap-2 justify-between">
                    <div className="flex gap-2">
                        {postTypes.map((type) => (
                            <button
                                key={type}
                                onClick={() => setPostType(type)}
                                className={cn(
                                    "px-5 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 border",
                                    postType === type 
                                        ? "bg-primary text-primary-foreground border-primary shadow-sm" 
                                        : "bg-white text-slate-500 border-slate-200 border-dashed hover:border-slate-300 hover:text-slate-700 hover:bg-slate-50 hover:border-solid"
                                )}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                    <Button 
                        size="sm" 
                        variant="outline" 
                        className="rounded-full text-purple-600 border-purple-200 hover:bg-purple-50 hover:text-purple-700 gap-1.5 font-semibold"
                        onClick={() => setIsMagicDraftOpen(true)}
                    >
                        <Sparkles className="h-3.5 w-3.5" /> Magic Draft
                    </Button>
                </div>

                {/* 2. Avatar & Input */}
                <div className="flex gap-5">
                    <Avatar className="h-12 w-12 border border-slate-100 mt-1 shrink-0">
                        <AvatarImage src={IMAGES.MILLER_AVATAR} />
                        <AvatarFallback>MF</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 relative min-w-0">
                        {(!newContent || newContent === '<br>') && (
                            <div className="absolute top-0 left-0 text-slate-400 text-lg pointer-events-none select-none font-normal truncate w-full">
                                Share your latest ministry update...
                            </div>
                        )}
                        <div
                            ref={editorRef}
                            contentEditable
                            onInput={handleInput}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            className="outline-none text-lg text-slate-700 min-h-[80px] leading-relaxed prose prose-slate max-w-none prose-p:my-1 prose-headings:font-bold prose-headings:text-slate-900 prose-blockquote:border-l-4 prose-blockquote:border-slate-200 prose-blockquote:pl-4 prose-blockquote:italic prose-ul:list-disc prose-ol:list-decimal"
                        />
                        {newImage && (
                            <div className="relative mt-4 rounded-xl overflow-hidden border border-slate-100 shadow-sm inline-block group max-w-full">
                                <img src={newImage} alt="Preview" className="max-h-[300px] w-auto object-cover" />
                                <button 
                                    onClick={() => setNewImage(null)}
                                    className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1.5 transition-colors opacity-0 group-hover:opacity-100"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 3. Bottom Toolbar */}
            <div className="bg-slate-50/50 border-t border-slate-100 p-3 px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                
                {/* Formatting Tools */}
                <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-hide">
                    {/* Group 1: Typography */}
                    <div className="flex gap-0.5">
                        <ToolbarBtn active={activeFormats.includes('bold')} onClick={() => exec('bold')} icon={Bold} title="Bold" />
                        <ToolbarBtn active={activeFormats.includes('italic')} onClick={() => exec('italic')} icon={Italic} title="Italic" />
                        <ToolbarBtn active={activeFormats.includes('underline')} onClick={() => exec('underline')} icon={Underline} title="Underline" />
                    </div>
                    
                    <div className="w-px h-5 bg-slate-200 mx-3 shrink-0" />
                    
                    {/* Group 2: Headers/Quote */}
                    <div className="flex gap-0.5">
                        <ToolbarBtn active={activeFormats.includes('h1')} onClick={() => exec('formatBlock', 'H1')} icon={Heading1} title="Heading 1" />
                        <ToolbarBtn active={activeFormats.includes('h2')} onClick={() => exec('formatBlock', 'H2')} icon={Heading2} title="Heading 2" />
                        <ToolbarBtn active={activeFormats.includes('blockquote')} onClick={() => exec('formatBlock', 'BLOCKQUOTE')} icon={Quote} title="Quote" />
                    </div>

                    <div className="w-px h-5 bg-slate-200 mx-3 shrink-0" />

                    {/* Group 3: Lists */}
                    <div className="flex gap-0.5">
                        <ToolbarBtn active={activeFormats.includes('ul')} onClick={() => exec('insertUnorderedList')} icon={List} title="Bullet List" />
                        <ToolbarBtn active={activeFormats.includes('ol')} onClick={() => exec('insertOrderedList')} icon={ListOrdered} title="Numbered List" />
                    </div>

                    <div className="w-px h-5 bg-slate-200 mx-3 shrink-0" />

                    {/* Group 4: Media */}
                    <div className="flex gap-0.5">
                        <ToolbarBtn onClick={() => {}} icon={LinkIcon} title="Add Link (Coming Soon)" />
                        <ToolbarBtn onClick={() => fileInputRef.current?.click()} icon={ImageIcon} title="Add Image" />
                    </div>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleFileSelect}
                   />
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end shrink-0">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors px-2 py-1 rounded-md hover:bg-slate-200/50 whitespace-nowrap">
                                {visibility === 'Public Feed' ? <Globe className="h-4 w-4 shrink-0" /> : <Lock className="h-4 w-4 shrink-0" />}
                                {visibility}
                                <ChevronDown className="h-3 w-3 opacity-50 shrink-0" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setVisibility('Public Feed')}>
                                <Globe className="mr-2 h-4 w-4" /> Public Feed
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setVisibility('Partners Only')}>
                                <Lock className="mr-2 h-4 w-4" /> Partners Only
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Button 
                        onClick={handleCreatePost} 
                        disabled={(!newContent || newContent === '<br>') && !newImage}
                        className="rounded-full font-bold px-8 h-10 shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:shadow-none"
                    >
                        Publish <Send className="ml-2 h-3 w-3" />
                    </Button>
                </div>
            </div>
          </div>

          {/* Feed Filter Tabs */}
          <div className="flex items-center gap-6 border-b border-slate-200 pb-1 mx-2">
             <button className="text-sm font-semibold text-slate-900 border-b-2 border-slate-900 pb-3 px-1">Published</button>
             <button className="text-sm font-medium text-slate-500 hover:text-slate-800 pb-3 px-1 transition-colors">Scheduled</button>
             <button className="text-sm font-medium text-slate-500 hover:text-slate-800 pb-3 px-1 transition-colors">Drafts</button>
          </div>

          {/* Posts List */}
          <div className="space-y-6">
            {posts.map(post => (
               <div key={post.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
                  <div className="p-6 pb-4 space-y-4">
                     {/* Post Header */}
                     <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                           <Avatar className="h-10 w-10 border border-slate-100 shadow-sm">
                              <AvatarImage src={post.avatar} />
                              <AvatarFallback>MF</AvatarFallback>
                           </Avatar>
                           <div>
                              <div className="flex items-center gap-2">
                                 <h3 className="font-semibold text-slate-900 text-sm">{post.author}</h3>
                                 {post.isPinned && (
                                     <div className="flex items-center gap-1 text-[10px] font-semibold text-sky-700 bg-sky-50 border border-sky-100 px-2 py-0.5 rounded-full">
                                         <Pin className="h-3 w-3 fill-current" /> Pinned
                                     </div>
                                 )}
                              </div>
                              <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                                 <span>{post.date}</span>
                                 <span>•</span>
                                 <span className={cn(
                                     "font-medium",
                                     post.type === 'Prayer Request' ? 'text-amber-600' :
                                     post.type === 'Newsletter' ? 'text-purple-600' :
                                     'text-slate-600'
                                 )}>{post.type}</span>
                                 <span>•</span>
                                 <div className="flex items-center gap-1" title={post.visibility}>
                                    {post.visibility === 'Public Feed' ? <Globe className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                                 </div>
                              </div>
                           </div>
                        </div>
                        
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                             <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900 hover:bg-slate-50">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                             <DropdownMenuItem onClick={() => handlePinPost(post.id)}>
                                 <Pin className="h-4 w-4 mr-2" /> {post.isPinned ? 'Unpin Post' : 'Pin to Top'}
                             </DropdownMenuItem>
                             <DropdownMenuItem onClick={() => {}}>
                                 <ExternalLink className="h-4 w-4 mr-2" /> Open in new tab
                             </DropdownMenuItem>
                             <DropdownMenuSeparator />
                             <DropdownMenuItem onClick={() => handleDeletePost(post.id)} className="text-red-600 focus:text-red-600">
                                 <Trash2 className="h-4 w-4 mr-2" /> Delete Post
                             </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                     </div>

                     {/* Content */}
                     <div className="text-slate-800 leading-relaxed text-[15px] space-y-4">
                        <div 
                            className="prose prose-sm prose-slate max-w-none prose-p:my-1 text-slate-700"
                            dangerouslySetInnerHTML={{ 
                                __html: post.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/_(.*?)_/g, '<em>$1</em>') 
                            }} 
                        />
                        {post.imageUrl && (
                           <div className="rounded-lg overflow-hidden border border-slate-100 bg-slate-50 shadow-sm">
                               <img src={post.imageUrl} alt="Post attachment" className="w-full max-h-[500px] object-cover" loading="lazy" />
                           </div>
                        )}
                     </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="bg-white px-6 py-3 flex items-center justify-between border-t border-slate-100">
                     <div className="flex items-center gap-6">
                        <button 
                           onClick={() => handleReaction(post.id, 'like')}
                           className={cn(
                               "flex items-center gap-2 text-sm transition-all duration-200 group", 
                               post.liked ? "text-red-500 font-medium" : "text-slate-500 hover:text-red-600"
                           )}
                        >
                           <div className={cn("p-1.5 rounded-full group-hover:bg-red-50 transition-colors", post.liked && "bg-red-50")}>
                                <Heart className={cn("h-4 w-4", post.liked && "fill-current")} />
                           </div>
                           <span className="text-xs font-medium">{post.likes}</span>
                        </button>
                        <button 
                           onClick={() => handleReaction(post.id, 'prayer')}
                           className={cn(
                               "flex items-center gap-2 text-sm transition-all duration-200 group", 
                               post.prayed ? "text-blue-600 font-medium" : "text-slate-500 hover:text-blue-600"
                           )}
                        >
                            <div className={cn("p-1.5 rounded-full group-hover:bg-blue-50 transition-colors", post.prayed && "bg-blue-50")}>
                                <Sparkles className={cn("h-4 w-4", post.prayed && "fill-current")} />
                            </div>
                           <span className="text-xs font-medium">{post.prayers} Prayers</span>
                        </button>
                        <button className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors group">
                            <div className="p-1.5 rounded-full group-hover:bg-slate-100 transition-colors">
                                <MessageCircle className="h-4 w-4" />
                            </div>
                           <span className="text-xs font-medium">{post.comments.length}</span>
                        </button>
                     </div>
                     <Button variant="ghost" size="sm" className="text-slate-500 h-8 hover:bg-slate-50 hover:text-slate-900">
                        <Share2 className="h-3.5 w-3.5 mr-2" /> Share
                     </Button>
                  </div>

                  {/* Comment Section with AI */}
                  <WorkerCommentSection post={post} onAddComment={handleAddComment} />
               </div>
            ))}
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
           
           {/* Requests Card */}
           <Card className="shadow-sm border-slate-200 overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                 <h3 className="font-semibold text-sm text-slate-900">Follower Requests</h3>
                 {requests.length > 0 && <Badge variant="secondary" className="rounded-full px-2 bg-blue-100 text-blue-700 hover:bg-blue-100">{requests.length}</Badge>}
              </div>
              <div className="p-4 space-y-4">
                 {requests.length === 0 ? (
                    <div className="text-center py-6">
                        <div className="h-10 w-10 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-2 text-slate-300">
                            <Check className="h-5 w-5" />
                        </div>
                        <p className="text-sm text-muted-foreground">All caught up!</p>
                    </div>
                 ) : (
                    requests.slice(0, 3).map(req => (
                       <div key={req.id} className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-3">
                             <Avatar className="h-9 w-9 border border-slate-100">
                                <AvatarImage src={req.avatar} />
                                <AvatarFallback>{req.name[0]}</AvatarFallback>
                             </Avatar>
                             <div className="space-y-0.5">
                                <div className="text-sm font-medium leading-none text-slate-900">{req.name}</div>
                                <div className="text-xs text-slate-500">{req.date}</div>
                             </div>
                          </div>
                          <div className="flex gap-1">
                             <Button size="icon" variant="ghost" className="h-7 w-7 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-full" onClick={() => handleRequest(req.id, 'approve')} title="Approve">
                                <Check className="h-3.5 w-3.5" />
                             </Button>
                             <Button size="icon" variant="ghost" className="h-7 w-7 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full" onClick={() => handleRequest(req.id, 'ignore')} title="Ignore">
                                <X className="h-3.5 w-3.5" />
                             </Button>
                          </div>
                       </div>
                    ))
                 )}
                 {requests.length > 3 && (
                     <Button variant="ghost" className="w-full text-xs text-muted-foreground hover:text-slate-900" size="sm" onClick={() => setIsRequestDialogOpen(true)}>
                        View {requests.length - 3} more
                     </Button>
                 )}
              </div>
           </Card>

           {/* Active Followers */}
           <Card className="shadow-sm border-slate-200 overflow-hidden">
              <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                 <h3 className="font-semibold text-sm text-slate-900">Your Community</h3>
                 <p className="text-xs text-slate-500 mt-0.5">1,204 people receive your updates</p>
              </div>
              <div className="p-4">
                 <div className="flex -space-x-2 overflow-hidden mb-4 p-1">
                    {followers.map(f => (
                       <Avatar key={f.id} className="inline-block h-8 w-8 ring-2 ring-white cursor-pointer hover:z-10 transition-transform hover:scale-105" title={f.name}>
                          <AvatarImage src={f.avatar} />
                          <AvatarFallback>{f.name[0]}</AvatarFallback>
                       </Avatar>
                    ))}
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-slate-100 text-[10px] font-bold text-slate-500 ring-2 ring-white">
                       +1k
                    </div>
                 </div>
                 <Button variant="outline" className="w-full text-xs h-8 bg-white" size="sm">View Subscriber List</Button>
              </div>
           </Card>

           {/* Feed Settings */}
           <Card className="shadow-sm border-slate-200 overflow-hidden">
              <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                 <h3 className="font-semibold text-sm text-slate-900">Feed Settings</h3>
              </div>
              <div className="p-4 space-y-4">
                 <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                       <div className="text-sm font-medium text-slate-900">Public Feed</div>
                       <div className="text-xs text-slate-500">Visible to non-donors</div>
                    </div>
                    <Switch 
                       checked={settings.publicFeed} 
                       onCheckedChange={(checked) => setSettings({...settings, publicFeed: checked})} 
                    />
                 </div>
                 <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                       <div className="text-sm font-medium text-slate-900">Allow Comments</div>
                       <div className="text-xs text-slate-500">Supporters can reply</div>
                    </div>
                    <Switch 
                       checked={settings.allowComments} 
                       onCheckedChange={(checked) => setSettings({...settings, allowComments: checked})} 
                    />
                 </div>
              </div>
           </Card>

           <div className="text-xs text-center text-slate-400">
               <p>© 2024 Unified Mission Control</p>
               <div className="flex justify-center gap-2 mt-1">
                   <a href="#" className="hover:underline hover:text-slate-600">Privacy</a> • <a href="#" className="hover:underline hover:text-slate-600">Terms</a>
               </div>
           </div>

        </div>
      </div>

      {/* Magic Draft Dialog */}
      <Dialog open={isMagicDraftOpen} onOpenChange={setIsMagicDraftOpen}>
         <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-purple-700">
                    <Sparkles className="h-5 w-5" /> Magic Draft
                </DialogTitle>
                <DialogDescription>
                    Turn rough notes into a polished update.
                </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
                <div className="space-y-2">
                    <Label>What do you want to share?</Label>
                    <Textarea 
                        placeholder="e.g. Visited the school today. Distributed 50 backpacks. Kids were so happy. Need prayer for weather."
                        className="min-h-[100px]"
                        value={draftPrompt}
                        onChange={(e) => setDraftPrompt(e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label>Tone</Label>
                    <Select value={draftTone} onChange={(e) => setDraftTone(e.target.value)}>
                        <option value="Inspiring">Inspiring</option>
                        <option value="Urgent">Urgent</option>
                        <option value="Grateful">Grateful</option>
                        <option value="Informative">Informative</option>
                    </Select>
                </div>
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => setIsMagicDraftOpen(false)}>Cancel</Button>
                <Button onClick={handleMagicDraft} disabled={!draftPrompt || isDrafting} className="bg-purple-600 hover:bg-purple-700 text-white">
                    {isDrafting ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
                    {isDrafting ? 'Drafting...' : 'Generate Post'}
                </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>

      {/* View All Requests Dialog */}
      <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
          <DialogContent>
              <DialogHeader>
                  <DialogTitle>Follower Requests</DialogTitle>
                  <DialogDescription>
                      People asking to follow your private updates.
                  </DialogDescription>
              </DialogHeader>
              <div className="max-h-[300px] overflow-y-auto space-y-4 pr-2">
                 {requests.length === 0 ? <p className="text-center text-sm text-muted-foreground py-4">No pending requests.</p> : 
                    requests.map(req => (
                        <div key={req.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors">
                            <div className="flex items-center gap-3">
                                <Avatar>
                                    <AvatarImage src={req.avatar} />
                                    <AvatarFallback>{req.name[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-sm font-medium">{req.name}</p>
                                    <p className="text-xs text-muted-foreground">{req.email}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button size="sm" onClick={() => handleRequest(req.id, 'approve')} className="h-8 bg-blue-600 hover:bg-blue-700">Confirm</Button>
                                <Button size="sm" variant="outline" onClick={() => handleRequest(req.id, 'ignore')} className="h-8">Delete</Button>
                            </div>
                        </div>
                    ))
                 }
              </div>
          </DialogContent>
      </Dialog>
    </div>
  );
};
