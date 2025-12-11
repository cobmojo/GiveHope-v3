
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, Plus, MessageSquare, 
  CheckCircle2, Clock, AlertCircle, 
  User, Mail, Send, MoreHorizontal, 
  Tag, Paperclip, Zap, Lock, Globe,
  Inbox, Layout, Phone, MapPin, Hash,
  ChevronDown, X, BookOpen, BarChart3,
  PenTool, Trash2, FileText, ExternalLink,
  ChevronRight, ArrowLeft, Sparkles, Wand2,
  ThumbsUp, ThumbsDown, RefreshCcw, LayoutDashboard, LifeBuoy,
  PenLine, Code, Image as ImageIcon, Upload, Palette, LayoutTemplate
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/Avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/Tabs';
import { Textarea } from '../../components/ui/Textarea';
import { Switch } from '../../components/ui/Switch';
import { RichTextEditor } from '../../components/ui/RichTextEditor';
import { Select } from '../../components/ui/Select';
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel,
  DropdownMenuCheckboxItem
} from '../../components/ui/DropdownMenu';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, 
  DialogDescription, DialogFooter 
} from '../../components/ui/Dialog';
import { cn } from '../../lib/utils';
import { MOCK_TICKETS, MOCK_ARTICLES, SupportTicket, KnowledgeArticle } from '../../lib/mock';

// --- Constants ---
const AGENTS = [
  { id: 'me', name: 'Me', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?fit=facearea&facepad=2&w=256&h=256&q=80' },
  { id: 'sarah', name: 'Sarah Smith', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?fit=facearea&facepad=2&w=256&h=256&q=80' },
  { id: 'mark', name: 'Mark Miller', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?fit=facearea&facepad=2&w=256&h=256&q=80' },
  { id: 'dev', name: 'Dev Team', avatar: '' }
];

const MACROS = [
  { label: "👋 Greeting", text: "<p>Hi there,</p><p>Thanks for reaching out! We're looking into this issue right now.</p>" },
  { label: "📷 Request Screenshot", text: "<p>Could you please provide a <strong>screenshot</strong> of the error you're seeing? This will help us diagnose the issue faster.</p>" },
  { label: "✅ Resolution", text: "<p>We've resolved the issue. Please clear your cache and try again. Let us know if it persists!</p>" },
  { label: "🙏 Prayer Support", text: "<p>We are standing with you in prayer regarding this situation. Please keep us updated.</p>" }
];

// --- Types ---
type ViewMode = 'inbox' | 'kb' | 'reports';
type ComposerMode = 'public' | 'private';

interface SignatureConfig {
  name: string;
  role: string;
  phone: string;
  email: string;
  website: string;
  tagline: string;
  layout: 'Horizontal' | 'Vertical' | 'Minimal' | 'Compact';
  color: string;
}

// --- Sub-Components ---

const PriorityBadge = ({ priority }: { priority: string }) => {
  const styles: Record<string, string> = {
    'Urgent': 'bg-red-100 text-red-700 border-red-200',
    'High': 'bg-orange-100 text-orange-800 border-orange-200',
    'Medium': 'bg-blue-100 text-blue-700 border-blue-200',
    'Low': 'bg-slate-100 text-slate-700 border-slate-200',
  };
  return (
    <Badge variant="outline" className={cn("font-semibold border px-2 py-0.5 text-[10px] uppercase tracking-wider", styles[priority] || styles['Low'])}>
      {priority}
    </Badge>
  );
};

// --- INBOX VIEW ---

const InboxView = () => {
  // State
  const [tickets, setTickets] = useState<SupportTicket[]>(MOCK_TICKETS);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(MOCK_TICKETS[0]?.id || null);
  const [filterStatus, setFilterStatus] = useState<'All' | 'Mine' | 'Unassigned'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Composer State
  const [composerMode, setComposerMode] = useState<ComposerMode>('public');
  const [replyText, setReplyText] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  // Signature State
  const [signatureHtml, setSignatureHtml] = useState(`<div style="font-family: sans-serif; color: #334155; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
  <p style="font-weight: bold; margin: 0; color: #0f172a;">Agent Name</p>
  <p style="font-size: 12px; margin: 2px 0 0; color: #64748b;">Mission Control Support</p>
</div>`);
  const [isSignatureEnabled, setIsSignatureEnabled] = useState(true);
  const [isSignatureDialogOpen, setIsSignatureDialogOpen] = useState(false);
  const [editorMode, setEditorMode] = useState<'visual' | 'code'>('visual');
  const [activeSigTab, setActiveSigTab] = useState('editor');
  
  // AI Signature Generator State
  const [sigConfig, setSigConfig] = useState<SignatureConfig>({
    name: 'Sarah Smith',
    role: 'Senior Support Agent',
    phone: '+1 (555) 123-4567',
    email: 'support@givehope.org',
    website: 'www.givehope.org',
    tagline: 'Empowering missions worldwide.',
    layout: 'Horizontal',
    color: '#2563eb'
  });
  const [sigLogo, setSigLogo] = useState<string | null>(null);
  const [isGeneratingSig, setIsGeneratingSig] = useState(false);

  // Dialogs
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [newTicketSubject, setNewTicketSubject] = useState('');

  // AI State
  const [aiSummary, setAiSummary] = useState<string>('');
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [isGeneratingReply, setIsGeneratingReply] = useState(false);
  const [isGeneratingTags, setIsGeneratingTags] = useState(false);
  const [sentiment, setSentiment] = useState<'Positive' | 'Neutral' | 'Negative' | null>(null);

  const selectedTicket = useMemo(() => tickets.find(t => t.id === selectedTicketId), [tickets, selectedTicketId]);

  // Scroll to bottom on new message
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedTicket?.messages]);

  // Auto-fill signature when switching to public mode
  useEffect(() => {
    if (composerMode === 'public' && isSignatureEnabled && !replyText.includes(signatureHtml)) {
        // Append if not empty and not already there
        if (!replyText) {
            setReplyText(`<p><br></p>${signatureHtml}`);
        }
    }
  }, [composerMode, isSignatureEnabled]); 

  // Initialize Gemini Client
  const getAIClient = () => {
    try {
      if (!process.env.API_KEY) {
        console.warn("API_KEY not found in environment.");
        return null;
      }
      return new GoogleGenAI({ apiKey: process.env.API_KEY });
    } catch (e) {
      console.error("Failed to init AI client", e);
      return null;
    }
  };

  // Reset AI state when ticket changes
  useEffect(() => {
    setAiSummary('');
    setSentiment(null);
    // Reset reply text with signature if applicable
    if (composerMode === 'public' && isSignatureEnabled) {
        setReplyText(`<p><br></p>${signatureHtml}`);
    } else {
        setReplyText('');
    }
    
    // Auto-analyze sentiment on load if ticket is selected
    if (selectedTicketId) {
        handleAISentiment(selectedTicketId);
    }
  }, [selectedTicketId]);

  // --- AI Actions ---

  const handleAISummarize = async () => {
    if (!selectedTicket) return;
    setIsGeneratingSummary(true);
    const ai = getAIClient();
    
    try {
      if (ai) {
        const conversation = selectedTicket.messages.map(m => `${m.sender}: ${m.text}`).join('\n');
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `Summarize this support ticket conversation in 3 concise bullet points. Focus on the core issue, actions taken, and current status.\n\nConversation:\n${conversation}`,
        });
        setAiSummary(response.text || "Could not generate summary.");
      } else {
        // Fallback for demo without key
        await new Promise(r => setTimeout(r, 1500));
        setAiSummary("• User reported payment failure on Visa card ending in 4242.\n• Agent confirmed 'Do Not Honor' error from bank.\n• Waiting for user to contact their bank or try a new card.");
      }
    } catch (e) {
      console.error(e);
      setAiSummary("Error generating summary.");
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const handleAIDraft = async (tone: 'Professional' | 'Empathetic' | 'Concise') => {
    if (!selectedTicket) return;
    setIsGeneratingReply(true);
    const ai = getAIClient();

    try {
      if (ai) {
        const conversation = selectedTicket.messages.map(m => `${m.sender}: ${m.text}`).join('\n');
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `Draft a ${tone.toLowerCase()} response for the support agent to the following conversation. Do not include subject lines or placeholders like [Your Name]. Format as HTML paragraphs. Just the message body.\n\nConversation:\n${conversation}`,
        });
        const draft = response.text?.trim() || "";
        // Append signature if enabled
        setReplyText(isSignatureEnabled ? `${draft}${signatureHtml}` : draft);
      } else {
        // Fallback
        await new Promise(r => setTimeout(r, 1000));
        const drafts = {
          Professional: "<p>Hello,</p><p>Thank you for providing that information. I have reviewed the logs and can confirm the error code. Please contact your bank to authorize the transaction, or try a different payment method.</p><p>Best regards,</p>",
          Empathetic: "<p>Hi there,</p><p>I completely understand how frustrating payment issues can be! 😟 I've looked into it, and it seems your bank declined the transaction. Could you please give them a quick call? We want to get this sorted for you as soon as possible!</p>",
          Concise: "<p>Hi, the error is 'Do Not Honor'. Please contact your bank or use a different card. Thanks.</p>"
        };
        const draft = drafts[tone];
        setReplyText(isSignatureEnabled ? `${draft}${signatureHtml}` : draft);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingReply(false);
    }
  };

  const handleGenerateSignature = async () => {
    setIsGeneratingSig(true);
    const ai = getAIClient();
    try {
        if (ai) {
            let prompt = `Create a sophisticated, professional, pixel-perfect HTML email signature using the following details.
            
            Name: ${sigConfig.name}
            Role: ${sigConfig.role}
            Phone: ${sigConfig.phone}
            Email: ${sigConfig.email}
            Website: ${sigConfig.website}
            Tagline: ${sigConfig.tagline}
            Preferred Layout: ${sigConfig.layout} (Use best practices for this layout)
            Brand Primary Color: ${sigConfig.color}
            
            Requirements:
            - Use inline CSS for ALL styling (crucial for email client compatibility).
            - Use a modern sans-serif font stack (Inter, Helvetica, Arial).
            - Layout: Use a table-based layout or flex-like structure using table cells for max compatibility.
            - The design should be clean, modern, and trustworthy.
            - Return ONLY the raw HTML code starting with <div or <table. Do not wrap in markdown block symbols.
            `;

            const parts: any[] = [{ text: prompt }];
            
            if (sigLogo) {
                // If logo exists, pass it to the model to analyze colors/style or just to confirm inclusion
                // Strip the data:image... prefix for the API
                const base64Data = sigLogo.split(',')[1];
                const mimeType = sigLogo.split(';')[0].split(':')[1];
                
                parts.push({
                    inlineData: {
                        data: base64Data,
                        mimeType: mimeType
                    }
                });
                
                // Add instructions to use the data URI in the img src for this demo
                parts.push({ text: `IMPORTANT: Use this EXACT data URI for the logo image source in the HTML: ${sigLogo}`});
            } else {
               parts.push({ text: `Do not include an image tag as no logo was provided.`});
            }

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: { parts }
            });

            const html = response.text?.replace(/```html/g, '').replace(/```/g, '').trim();
            if (html) {
                setSignatureHtml(html);
                setActiveSigTab('editor');
                setEditorMode('visual');
            }
        }
    } catch (e) {
        console.error("Sig Gen Error", e);
    } finally {
        setIsGeneratingSig(false);
    }
  };

  const handleAIAutoTag = async () => {
    if (!selectedTicket) return;
    setIsGeneratingTags(true);
    const ai = getAIClient();

    try {
      if (ai) {
        const content = selectedTicket.subject + "\n" + selectedTicket.messages[0]?.text;
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `Analyze this support ticket and suggest 3 short, relevant tags (e.g., 'billing', 'urgent', 'bug'). Return ONLY a comma-separated list of tags.\n\nTicket:\n${content}`,
        });
        const tags = response.text?.split(',').map(t => t.trim()) || [];
        if (tags.length > 0) {
          const newTags = Array.from(new Set([...selectedTicket.tags, ...tags]));
          updateTicketProperty(selectedTicket.id, 'tags', newTags);
        }
      } else {
        // Fallback
        await new Promise(r => setTimeout(r, 1000));
        const newTags = Array.from(new Set([...selectedTicket.tags, "payment-error", "stripe-decline"]));
        updateTicketProperty(selectedTicket.id, 'tags', newTags);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingTags(false);
    }
  };

  const handleAISentiment = async (ticketId: string) => {
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket) return;
    
    const ai = getAIClient();
    try {
        if (ai) {
            const lastMessage = ticket.messages.filter(m => m.sender !== 'Me' && m.sender !== 'System').pop()?.text || ticket.subject;
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `Analyze the sentiment of this customer message. Return ONLY one word: "Positive", "Neutral", or "Negative".\n\nMessage: "${lastMessage}"`
            });
            const sentimentText = response.text?.trim();
            if (['Positive', 'Neutral', 'Negative'].includes(sentimentText || '')) {
                setSentiment(sentimentText as any);
            } else {
                setSentiment('Neutral');
            }
        } else {
            // Mock result based on content keywords just for demo feel
            const text = ticket.messages[ticket.messages.length - 1]?.text.toLowerCase() || "";
            if (text.includes('thanks') || text.includes('great')) setSentiment('Positive');
            else if (text.includes('error') || text.includes('fail') || text.includes('upset')) setSentiment('Negative');
            else setSentiment('Neutral');
        }
    } catch (e) {
        console.error(e);
    }
  }

  // --- Core Logic ---

  const filteredTickets = tickets.filter(t => {
    const matchesSearch = 
      t.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
      t.requestor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = 
      filterStatus === 'All' ? true :
      filterStatus === 'Mine' ? t.assignedTo === 'Me' :
      filterStatus === 'Unassigned' ? !t.assignedTo || t.assignedTo === 'Unassigned' : true;

    return matchesSearch && matchesFilter;
  });

  const handleSendMessage = () => {
    if (!selectedTicket || !replyText.trim()) return;

    // strip HTML for preview in the simple message bubble, or render it. 
    // For this mock, we'll keep it simple and just show text content if note, or full HTML if message.
    const newMessage = {
      id: `msg-${Date.now()}`,
      sender: 'Me',
      senderAvatar: AGENTS[0].avatar,
      text: replyText,
      timestamp: 'Just now',
      type: composerMode === 'private' ? 'note' : 'message'
    } as const;

    const updatedTicket = {
      ...selectedTicket,
      messages: [...selectedTicket.messages, newMessage],
      lastUpdate: 'Just now',
      status: (composerMode === 'public' && selectedTicket.status === 'Open') ? 'Pending' : selectedTicket.status
    } as SupportTicket;

    setTickets(prev => prev.map(t => t.id === selectedTicket.id ? updatedTicket : t));
    
    // Reset Composer with signature logic
    if (composerMode === 'public' && isSignatureEnabled) {
        setReplyText(`<p><br></p>${signatureHtml}`);
    } else {
        setReplyText('');
    }
  };

  const updateTicketProperty = (id: string, property: keyof SupportTicket, value: any) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, [property]: value } : t));
  };

  const handleCreateTicket = () => {
    const newTicket: SupportTicket = {
      id: `TIC-${Math.floor(Math.random() * 10000)}`,
      subject: newTicketSubject || "New Support Request",
      status: 'Open',
      priority: 'Medium',
      type: 'Email',
      requestor: 'New User',
      requestorEmail: 'user@example.com',
      date: new Date().toISOString(),
      lastUpdate: 'Just now',
      category: 'General',
      tags: [],
      messages: [],
      requestorHistory: []
    };
    setTickets([newTicket, ...tickets]);
    setSelectedTicketId(newTicket.id);
    setIsNewTicketOpen(false);
    setNewTicketSubject('');
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setSigLogo(reader.result as string);
        };
        reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="flex h-full w-full bg-white">
      
      {/* 1. LIST PANE */}
      <div className={cn(
        "w-full md:w-80 lg:w-96 border-r border-slate-200 bg-slate-50 flex flex-col shrink-0 transition-all duration-300",
        selectedTicketId ? "hidden md:flex" : "flex"
      )}>
        {/* Header */}
        <div className="p-4 border-b border-slate-200 bg-white space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-lg text-slate-900 tracking-tight">Inbox</h2>
            <Button size="icon" className="h-8 w-8 rounded-full shadow-sm bg-slate-900 hover:bg-slate-800" onClick={() => setIsNewTicketOpen(true)}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search tickets..." 
              className="pl-9 h-10 bg-slate-50 border-slate-200 focus:bg-white transition-all shadow-sm rounded-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Tabs value={filterStatus} onValueChange={(v) => setFilterStatus(v as any)} className="w-full">
            <TabsList className="w-full grid grid-cols-3 h-9 p-1 bg-slate-100 rounded-lg">
              <TabsTrigger value="Mine" className="text-xs font-medium rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">Mine</TabsTrigger>
              <TabsTrigger value="Unassigned" className="text-xs font-medium rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">Unassigned</TabsTrigger>
              <TabsTrigger value="All" className="text-xs font-medium rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">All</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin scrollbar-thumb-slate-200">
          {filteredTickets.map(ticket => (
            <div 
              key={ticket.id}
              onClick={() => setSelectedTicketId(ticket.id)}
              className={cn(
                "p-3.5 rounded-xl cursor-pointer border transition-all duration-200 group relative select-none",
                selectedTicketId === ticket.id 
                  ? "bg-white border-blue-200 shadow-md ring-1 ring-blue-50 z-10" 
                  : "bg-transparent border-transparent hover:bg-white hover:border-slate-200 hover:shadow-sm"
              )}
            >
              <div className="flex justify-between items-start mb-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  <div className={cn(
                    "w-2 h-2 rounded-full shrink-0",
                    ticket.status === 'Open' ? "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" :
                    ticket.status === 'Pending' ? "bg-amber-500" :
                    ticket.status === 'Resolved' ? "bg-emerald-500" : "bg-slate-300"
                  )} />
                  <span className={cn(
                    "text-sm font-bold truncate transition-colors",
                    selectedTicketId === ticket.id ? "text-blue-900" : "text-slate-700"
                  )}>
                    {ticket.requestor}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 shrink-0 font-medium">{ticket.lastUpdate}</span>
              </div>
              
              <h4 className={cn(
                "text-sm font-medium mb-2 line-clamp-2 leading-relaxed", 
                selectedTicketId === ticket.id ? "text-slate-900" : "text-slate-600"
              )}>
                {ticket.subject}
              </h4>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {ticket.type === 'Email' ? <Mail className="h-3.5 w-3.5 text-slate-400" /> : <MessageSquare className="h-3.5 w-3.5 text-slate-400" />}
                  <Badge variant="secondary" className="text-[10px] h-5 px-1.5 bg-slate-100 text-slate-500 border-slate-200 font-medium">
                    {ticket.id}
                  </Badge>
                </div>
                {['High', 'Urgent'].includes(ticket.priority) && (
                   <AlertCircle className="h-4 w-4 text-red-500 fill-red-50" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. CONVERSATION PANE */}
      {selectedTicket ? (
        <div className="flex-1 flex flex-col min-w-0 bg-white relative h-full">
          {/* Header */}
          <div className="h-16 border-b border-slate-100 flex items-center justify-between px-6 shrink-0 bg-white z-10 shadow-sm">
            <div className="flex items-center gap-3 min-w-0">
              <Button variant="ghost" size="icon" className="md:hidden -ml-2" onClick={() => setSelectedTicketId(null)}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="min-w-0">
                <h2 className="text-lg font-bold text-slate-900 truncate flex items-center gap-2">
                  {selectedTicket.subject}
                </h2>
                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {selectedTicket.type}</span>
                  <span className="text-slate-300">•</span>
                  <span>{new Date(selectedTicket.date).toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className={cn(
                    "gap-2 border-dashed font-semibold shadow-sm transition-all",
                    selectedTicket.status === 'Open' ? "text-blue-600 bg-blue-50 border-blue-200 hover:bg-blue-100" :
                    selectedTicket.status === 'Pending' ? "text-amber-600 bg-amber-50 border-amber-200 hover:bg-amber-100" :
                    selectedTicket.status === 'Resolved' ? "text-emerald-600 bg-emerald-50 border-emerald-200 hover:bg-emerald-100" : "text-slate-600"
                  )}>
                    {selectedTicket.status} <ChevronDown className="h-3 w-3 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {['Open', 'Pending', 'Resolved', 'Closed'].map(s => (
                    <DropdownMenuItem key={s} onClick={() => updateTicketProperty(selectedTicket.id, 'status', s)}>
                      {s}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-slate-50/50 scrollbar-thin scrollbar-thumb-slate-200">
            {selectedTicket.messages.map((msg) => {
              const isMe = msg.sender === 'Me' || msg.sender === 'System'; 
              const isNote = msg.type === 'note';
              
              return (
                <div key={msg.id} className={cn("flex gap-4 max-w-3xl group animate-in fade-in slide-in-from-bottom-2 duration-300", isMe ? "ml-auto flex-row-reverse" : "")}>
                  <Avatar className="h-10 w-10 mt-1 border border-slate-200 bg-white shadow-sm shrink-0">
                    <AvatarImage src={msg.senderAvatar || (isMe ? AGENTS[0].avatar : selectedTicket.requestorAvatar)} />
                    <AvatarFallback className={cn("text-xs font-bold", isNote ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-700")}>
                      {msg.sender[0]}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className={cn("flex flex-col gap-1 min-w-[200px]", isMe ? "items-end" : "items-start")}>
                    <div className="flex items-center gap-2 opacity-100">
                      <span className="text-xs font-bold text-slate-700">{msg.sender}</span>
                      <span className="text-[10px] text-slate-400 font-medium">{msg.timestamp}</span>
                      {isNote && (
                        <span className="flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-wider text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">
                          <Lock className="h-2 w-2" /> Private Note
                        </span>
                      )}
                    </div>
                    
                    <div className={cn(
                      "px-5 py-3.5 rounded-2xl text-[15px] leading-relaxed shadow-sm whitespace-pre-wrap relative max-w-2xl overflow-hidden",
                      isNote 
                        ? "bg-amber-50 border border-amber-100 text-slate-800" 
                        : isMe 
                          ? "bg-blue-600 text-white rounded-tr-sm" 
                          : "bg-white border border-slate-200 text-slate-800 rounded-tl-sm"
                    )}>
                      {isMe && !isNote ? (
                          <div dangerouslySetInnerHTML={{ __html: msg.text }} className="prose prose-sm prose-invert max-w-none" />
                      ) : (
                          msg.text
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>

          {/* Composer */}
          <div className={cn(
            "p-4 border-t transition-colors duration-300 shrink-0",
            composerMode === 'private' ? "bg-amber-50/50 border-amber-200" : "bg-white border-slate-200"
          )}>
            <div className="max-w-4xl mx-auto flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex bg-slate-100 p-1 rounded-lg gap-1">
                  <button 
                    onClick={() => setComposerMode('public')}
                    className={cn(
                      "px-4 py-1.5 text-xs font-bold rounded-md transition-all",
                      composerMode === 'public' ? "bg-white text-slate-900 shadow-sm ring-1 ring-black/5" : "text-slate-500 hover:text-slate-900"
                    )}
                  >
                    Public Reply
                  </button>
                  <button 
                    onClick={() => setComposerMode('private')}
                    className={cn(
                      "px-4 py-1.5 text-xs font-bold rounded-md transition-all flex items-center gap-1.5",
                      composerMode === 'private' ? "bg-amber-100 text-amber-900 shadow-sm ring-1 ring-amber-200" : "text-slate-500 hover:text-slate-900"
                    )}
                  >
                    <Lock className="h-3 w-3" /> Internal Note
                  </button>
                </div>

                <div className="flex items-center gap-2">
                    {/* Signature Settings */}
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className={cn(
                            "h-8 text-xs gap-1.5 text-slate-500 hover:text-slate-900", 
                            isSignatureEnabled && "text-blue-600 bg-blue-50/50 hover:bg-blue-100"
                        )}
                        onClick={() => setIsSignatureDialogOpen(true)}
                        title="Configure Signature"
                    >
                        <PenLine className="h-3.5 w-3.5" /> Signature
                    </Button>

                    {/* AI Magic Reply */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-8 text-xs gap-1.5 text-purple-600 border-purple-200 hover:bg-purple-50 hover:text-purple-700 shadow-sm font-semibold"
                                disabled={isGeneratingReply}
                            >
                                {isGeneratingReply ? <RefreshCcw className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
                                AI Magic Draft
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel className="text-purple-600 text-xs font-bold uppercase tracking-wider">Choose Tone</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleAIDraft('Professional')}>Professional</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAIDraft('Empathetic')}>Empathetic</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAIDraft('Concise')}>Concise</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 text-xs gap-1 text-slate-500 hover:text-blue-600">
                            <Zap className="h-3.5 w-3.5" /> Macro
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            {MACROS.map((m, i) => (
                            <DropdownMenuItem key={i} onClick={() => setReplyText(prev => prev + (prev ? '<br>' : '') + m.text)}>
                                {m.label}
                            </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
              </div>

              <div className={cn(
                "relative rounded-xl border shadow-sm overflow-hidden transition-all focus-within:ring-2 focus-within:ring-offset-1 bg-white",
                composerMode === 'private' 
                  ? "border-amber-200 focus-within:ring-amber-200" 
                  : "border-slate-300 focus-within:ring-blue-100 focus-within:border-blue-400"
              )}>
                {composerMode === 'private' ? (
                    <Textarea 
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      onKeyDown={(e) => (e.metaKey || e.ctrlKey) && e.key === 'Enter' && handleSendMessage()}
                      placeholder="Write an internal note for the team..."
                      className="min-h-[120px] border-none focus-visible:ring-0 resize-none p-4 text-base leading-relaxed bg-amber-50/20"
                    />
                ) : (
                    <RichTextEditor 
                        value={replyText}
                        onChange={setReplyText}
                        placeholder="Type your reply..."
                        className="border-none shadow-none min-h-[120px] rounded-none focus-within:ring-0"
                    />
                )}
                
                <div className="flex items-center justify-between px-3 py-2 bg-slate-50/50 border-t border-slate-100">
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] text-slate-400 hidden sm:inline-block font-medium">Cmd + Enter to send</span>
                    <Button 
                      onClick={handleSendMessage} 
                      disabled={!replyText.trim()}
                      className={cn(
                        "gap-2 transition-colors shadow-md h-9 px-5 font-semibold",
                        composerMode === 'private' ? "bg-amber-500 hover:bg-amber-600 text-white" : "bg-blue-600 hover:bg-blue-700"
                      )}
                    >
                      {composerMode === 'private' ? 'Add Note' : 'Send Reply'} <Send className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 text-slate-400">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-slate-100">
            <Inbox className="h-10 w-10 text-slate-300" />
          </div>
          <h3 className="text-lg font-bold text-slate-700">No Ticket Selected</h3>
          <p className="max-w-xs text-center text-sm mt-2 font-medium">Select a ticket from the inbox to view details and start chatting.</p>
        </div>
      )}

      {/* 3. CONTEXT PANE */}
      {selectedTicket && (
        <div className="w-80 border-l border-slate-200 bg-white shrink-0 hidden xl:flex flex-col h-full overflow-y-auto scrollbar-thin">
          <div className="p-6 space-y-8">
            
            {/* Customer Info */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between">
                  Customer Context
                  {sentiment && (
                      <Badge 
                        variant="secondary" 
                        className={cn(
                            "h-5 px-1.5 text-[10px] border-0",
                            sentiment === 'Positive' ? "bg-green-100 text-green-700" :
                            sentiment === 'Negative' ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-600"
                        )}
                      >
                          {sentiment === 'Positive' && <ThumbsUp className="h-3 w-3 mr-1" />}
                          {sentiment === 'Negative' && <ThumbsDown className="h-3 w-3 mr-1" />}
                          {sentiment}
                      </Badge>
                  )}
              </h3>
              <div className="flex items-start gap-4">
                <Avatar className="h-14 w-14 border-2 border-white shadow-md">
                  <AvatarImage src={selectedTicket.requestorAvatar} />
                  <AvatarFallback className="bg-slate-900 text-white text-lg font-bold">{selectedTicket.requestor[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-bold text-slate-900 text-lg leading-tight">{selectedTicket.requestor}</h4>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1 font-medium">
                    <MapPin className="h-3 w-3" /> {selectedTicket.requestorLocation || 'Unknown'}
                  </div>
                </div>
              </div>
              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-3 text-sm group cursor-pointer p-2 -mx-2 hover:bg-slate-50 rounded-md transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                    <Mail className="h-4 w-4" />
                  </div>
                  <span className="text-slate-600 group-hover:text-blue-700 truncate font-medium">{selectedTicket.requestorEmail}</span>
                </div>
                <div className="flex items-center gap-3 text-sm group cursor-pointer p-2 -mx-2 hover:bg-slate-50 rounded-md transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
                    <Phone className="h-4 w-4" />
                  </div>
                  <span className="text-slate-600 group-hover:text-emerald-700 font-medium">+1 (555) 000-0000</span>
                </div>
              </div>
            </div>

            <div className="h-px bg-slate-100" />

            {/* AI Summary Card */}
            <div className="rounded-xl border border-purple-100 bg-purple-50/50 p-4 space-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-purple-700">
                        <Wand2 className="h-4 w-4" />
                        <span className="text-xs font-bold uppercase tracking-widest">AI Summary</span>
                    </div>
                    {aiSummary ? (
                        <button onClick={handleAISummarize} className="text-purple-400 hover:text-purple-600 transition-colors" title="Regenerate">
                            <RefreshCcw className={cn("h-3.5 w-3.5", isGeneratingSummary && "animate-spin")} />
                        </button>
                    ) : (
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 text-[10px] bg-white text-purple-700 border border-purple-200 hover:bg-purple-100 shadow-sm"
                            onClick={handleAISummarize}
                            disabled={isGeneratingSummary}
                        >
                            {isGeneratingSummary ? "Generating..." : "Generate"}
                        </Button>
                    )}
                </div>
                {aiSummary && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap font-medium"
                    >
                        {aiSummary}
                    </motion.div>
                )}
            </div>

            <div className="h-px bg-slate-100" />

            {/* Ticket Info */}
            <div className="space-y-6">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Ticket Properties</h3>
              
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500">Assignee</label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center justify-between w-full p-2.5 bg-white border border-slate-200 rounded-lg hover:border-slate-300 transition-all shadow-sm group">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-5 w-5">
                            <AvatarImage src={AGENTS.find(a => a.name === selectedTicket.assignedTo || a.id === selectedTicket.assignedTo)?.avatar} />
                            <AvatarFallback className="text-[9px] bg-slate-900 text-white font-bold">U</AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium text-slate-700">{selectedTicket.assignedTo || 'Unassigned'}</span>
                        </div>
                        <ChevronDown className="h-3 w-3 text-slate-400 group-hover:text-slate-600" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-64" align="start">
                      <DropdownMenuLabel>Select Agent</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {AGENTS.map(agent => (
                        <DropdownMenuItem key={agent.id} onClick={() => updateTicketProperty(selectedTicket.id, 'assignedTo', agent.name)}>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={agent.avatar} />
                              <AvatarFallback className="text-[10px]">{agent.name[0]}</AvatarFallback>
                            </Avatar>
                            <span>{agent.name}</span>
                          </div>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500">Priority</label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center justify-between w-full p-2.5 bg-white border border-slate-200 rounded-lg hover:border-slate-300 transition-all shadow-sm group">
                        <PriorityBadge priority={selectedTicket.priority} />
                        <ChevronDown className="h-3 w-3 text-slate-400 group-hover:text-slate-600" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-64" align="start">
                      {['Low', 'Medium', 'High', 'Urgent'].map(p => (
                        <DropdownMenuItem key={p} onClick={() => updateTicketProperty(selectedTicket.id, 'priority', p)}>
                          <PriorityBadge priority={p} />
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-slate-500">Tags</label>
                    <button 
                        onClick={handleAIAutoTag} 
                        className={cn(
                            "text-[10px] flex items-center gap-1 text-purple-600 hover:text-purple-700 transition-colors font-bold uppercase tracking-wide",
                            isGeneratingTags && "opacity-50 cursor-not-allowed"
                        )}
                        disabled={isGeneratingTags}
                    >
                        <Sparkles className="h-3 w-3" />
                        {isGeneratingTags ? "AI Analyzing..." : "Auto-tag"}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 p-3 bg-slate-50 rounded-lg border border-slate-100 min-h-[60px]">
                    {selectedTicket.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="bg-white border-slate-200 text-slate-600 font-medium hover:bg-red-50 hover:text-red-600 hover:border-red-200 cursor-pointer transition-colors group pl-2.5 pr-1.5 h-6">
                        {tag}
                        <X className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Badge>
                    ))}
                    <button className="text-[10px] bg-white border border-dashed border-slate-300 text-slate-500 px-2.5 py-1 rounded-full hover:border-slate-400 hover:text-slate-700 transition-colors font-medium">
                      + Add
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-px bg-slate-100" />

            {/* Interaction History */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Previous Interactions</h3>
              <div className="relative border-l border-slate-200 ml-1.5 space-y-6">
                {(selectedTicket.requestorHistory || []).map((item, idx) => (
                  <div key={idx} className="relative pl-6">
                    <div className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-white border-2 border-slate-300 ring-4 ring-white" />
                    <p className="text-sm font-bold text-slate-800">{item.action}</p>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">{item.date}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* New Ticket Modal */}
      <Dialog open={isNewTicketOpen} onOpenChange={setIsNewTicketOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Ticket</DialogTitle>
            <DialogDescription>Manually log a request or email from a customer.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Subject</label>
              <Input value={newTicketSubject} onChange={(e) => setNewTicketSubject(e.target.value)} placeholder="Brief summary of the issue" autoFocus />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Requestor Email</label>
                <Input placeholder="customer@example.com" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Input placeholder="General" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewTicketOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateTicket} disabled={!newTicketSubject} className="bg-slate-900 text-white">Create Ticket</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Signature Settings Modal */}
      <Dialog open={isSignatureDialogOpen} onOpenChange={setIsSignatureDialogOpen}>
        <DialogContent className="sm:max-w-[800px] h-[85vh] flex flex-col p-0 overflow-hidden">
            <DialogHeader className="p-6 pb-2 border-b bg-slate-50/50 shrink-0">
                <div className="flex items-center justify-between">
                    <DialogTitle>Email Signature</DialogTitle>
                    <div className="flex items-center gap-2">
                        <label htmlFor="sig-mode" className="text-sm font-medium leading-none text-slate-600">
                            Enable
                        </label>
                        <Switch 
                            id="sig-mode"
                            checked={isSignatureEnabled}
                            onCheckedChange={setIsSignatureEnabled}
                        />
                    </div>
                </div>
                <DialogDescription>
                    Configure the HTML signature appended to your public replies.
                </DialogDescription>
            </DialogHeader>
            
            <div className="flex-1 overflow-hidden flex flex-col bg-white">
                <Tabs value={activeSigTab} onValueChange={setActiveSigTab} className="flex-1 flex flex-col">
                    <div className="px-6 pt-4">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="editor" className="gap-2"><Code className="h-4 w-4" /> Editor</TabsTrigger>
                            <TabsTrigger value="ai" className="gap-2"><Sparkles className="h-4 w-4 text-purple-500" /> AI Generator</TabsTrigger>
                        </TabsList>
                    </div>

                    {/* TAB 1: EDITOR */}
                    <TabsContent value="editor" className="flex-1 p-6 space-y-4 flex flex-col mt-0 overflow-y-auto">
                        <div className="flex justify-end mb-2">
                            <div className="bg-slate-100 p-1 rounded-md flex">
                                <button 
                                    onClick={() => setEditorMode('visual')}
                                    className={cn(
                                        "text-xs px-3 py-1 rounded-sm transition-all",
                                        editorMode === 'visual' ? "bg-white shadow-sm text-slate-900 font-medium" : "text-slate-500 hover:text-slate-900"
                                    )}
                                >
                                    Visual
                                </button>
                                <button 
                                    onClick={() => setEditorMode('code')}
                                    className={cn(
                                        "text-xs px-3 py-1 rounded-sm transition-all",
                                        editorMode === 'code' ? "bg-white shadow-sm text-slate-900 font-medium" : "text-slate-500 hover:text-slate-900"
                                    )}
                                >
                                    HTML Code
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 flex flex-col space-y-2">
                            {editorMode === 'code' ? (
                                <Textarea 
                                    value={signatureHtml}
                                    onChange={(e) => setSignatureHtml(e.target.value)}
                                    className="flex-1 min-h-[150px] font-mono text-xs bg-slate-50 border-slate-200 resize-none p-4"
                                    placeholder="<div>Your HTML signature here...</div>"
                                />
                            ) : (
                                <RichTextEditor 
                                    value={signatureHtml}
                                    onChange={setSignatureHtml}
                                    className="flex-1 min-h-[200px]"
                                    placeholder="Design your signature..."
                                />
                            )}
                        </div>
                        <div className="h-px bg-slate-100" />
                        <div className="space-y-2 shrink-0">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Live Preview</label>
                            <div className="border border-slate-200 rounded-lg p-6 bg-white shadow-sm min-h-[120px]">
                                <div dangerouslySetInnerHTML={{ __html: signatureHtml }} />
                            </div>
                        </div>
                    </TabsContent>

                    {/* TAB 2: AI GENERATOR */}
                    <TabsContent value="ai" className="flex-1 p-6 space-y-6 mt-0 overflow-y-auto">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Full Name</label>
                                <Input value={sigConfig.name} onChange={(e) => setSigConfig({...sigConfig, name: e.target.value})} placeholder="e.g. Jane Doe" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Job Title</label>
                                <Input value={sigConfig.role} onChange={(e) => setSigConfig({...sigConfig, role: e.target.value})} placeholder="e.g. Support Lead" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Email</label>
                                <Input value={sigConfig.email} onChange={(e) => setSigConfig({...sigConfig, email: e.target.value})} placeholder="email@company.com" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Phone</label>
                                <Input value={sigConfig.phone} onChange={(e) => setSigConfig({...sigConfig, phone: e.target.value})} placeholder="+1 (555) ..." />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Website</label>
                                <Input value={sigConfig.website} onChange={(e) => setSigConfig({...sigConfig, website: e.target.value})} placeholder="www.company.com" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Tagline / Disclaimer</label>
                                <Input value={sigConfig.tagline} onChange={(e) => setSigConfig({...sigConfig, tagline: e.target.value})} placeholder="Optional text..." />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2"><LayoutTemplate className="h-3.5 w-3.5" /> Layout Style</label>
                                <Select value={sigConfig.layout} onChange={(e) => setSigConfig({...sigConfig, layout: e.target.value as any})} className="h-10">
                                    <option value="Horizontal">Horizontal (Standard)</option>
                                    <option value="Vertical">Vertical (Stacked)</option>
                                    <option value="Minimal">Minimalist</option>
                                    <option value="Compact">Compact</option>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2"><Palette className="h-3.5 w-3.5" /> Brand Color</label>
                                <div className="flex gap-2 items-center">
                                    <input 
                                        type="color" 
                                        value={sigConfig.color} 
                                        onChange={(e) => setSigConfig({...sigConfig, color: e.target.value})}
                                        className="h-10 w-12 rounded cursor-pointer border border-slate-200 p-1 bg-white"
                                    />
                                    <Input value={sigConfig.color} onChange={(e) => setSigConfig({...sigConfig, color: e.target.value})} className="font-mono" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Logo Image</label>
                            <div className="flex items-center gap-4">
                                <div className="h-16 w-16 bg-slate-100 rounded-lg border border-slate-200 border-dashed flex items-center justify-center overflow-hidden shrink-0">
                                    {sigLogo ? <img src={sigLogo} alt="Logo" className="w-full h-full object-cover" /> : <ImageIcon className="h-6 w-6 text-slate-300" />}
                                </div>
                                <div className="flex-1">
                                    <Input type="file" accept="image/*" onChange={handleLogoUpload} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100" />
                                    <p className="text-[10px] text-slate-500 mt-1">Upload a small logo (PNG/JPG). This will be used by Gemini to design your signature.</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-purple-50 border border-purple-100 rounded-lg p-4 flex gap-3 items-start">
                            <Sparkles className="h-5 w-5 text-purple-600 shrink-0 mt-0.5" />
                            <div className="space-y-1">
                                <h4 className="text-sm font-bold text-purple-900">AI Design Generation</h4>
                                <p className="text-xs text-purple-700 leading-relaxed">
                                    Gemini will generate a professional HTML layout using your details and logo. It will use inline CSS for maximum email client compatibility.
                                </p>
                            </div>
                        </div>

                        <Button 
                            onClick={handleGenerateSignature} 
                            disabled={isGeneratingSig} 
                            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-md"
                        >
                            {isGeneratingSig ? (
                                <><RefreshCcw className="mr-2 h-4 w-4 animate-spin" /> Designing...</>
                            ) : (
                                <><Wand2 className="mr-2 h-4 w-4" /> Generate Signature</>
                            )}
                        </Button>
                    </TabsContent>
                </Tabs>
            </div>
            
            <DialogFooter className="p-4 border-t bg-slate-50/50 shrink-0">
                <Button variant="outline" onClick={() => setIsSignatureDialogOpen(false)}>Close</Button>
                <Button onClick={() => setIsSignatureDialogOpen(false)} className="bg-slate-900 text-white">Save Changes</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// --- KNOWLEDGE BASE VIEW ---

const KnowledgeBaseView = () => {
  const [articles] = useState<KnowledgeArticle[]>(MOCK_ARTICLES);
  const [search, setSearch] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeArticle | null>(null);

  const filteredArticles = articles.filter(a => 
    a.title.toLowerCase().includes(search.toLowerCase()) || 
    a.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-full w-full bg-slate-50/50">
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-8">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Knowledge Base</h1>
              <p className="text-slate-500 mt-2 text-lg">Manage help articles and internal documentation.</p>
            </div>
            <Button className="bg-slate-900 shadow-md font-semibold">
              <Plus className="mr-2 h-4 w-4" /> New Article
            </Button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
            <Input 
              placeholder="Search articles..." 
              className="pl-12 h-12 text-lg bg-white border-slate-200 shadow-sm rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map(article => (
              <Card 
                key={article.id} 
                className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-slate-200 hover:border-blue-200 overflow-hidden bg-white"
                onClick={() => setSelectedArticle(article)}
              >
                <div className="h-1.5 w-full bg-slate-100 group-hover:bg-blue-500 transition-colors" />
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <Badge variant="secondary" className="bg-slate-50 text-slate-600 font-semibold border border-slate-100">
                      {article.category}
                    </Badge>
                    <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-full">
                      <Globe className="h-3 w-3" /> Public
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 mb-2 group-hover:text-blue-700 transition-colors leading-tight">
                      {article.title}
                    </h3>
                    <p className="text-sm text-slate-500 line-clamp-3 leading-relaxed">
                      {article.excerpt}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-slate-50 flex justify-between items-center text-xs text-slate-400 font-medium">
                    <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" /> {article.views} views</span>
                    <span>{article.readTime}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Article Preview Sheet/Modal */}
      <Dialog open={!!selectedArticle} onOpenChange={() => setSelectedArticle(null)}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto p-0 gap-0">
          <DialogHeader className="p-8 pb-4 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-2 mb-3">
              <Badge className="bg-blue-100 text-blue-700 border-blue-200">{selectedArticle?.category}</Badge>
              <span className="text-sm text-slate-500 font-medium flex items-center gap-1"><Clock className="h-3 w-3" /> {selectedArticle?.readTime}</span>
            </div>
            <DialogTitle className="text-3xl font-bold text-slate-900 leading-tight">{selectedArticle?.title}</DialogTitle>
          </DialogHeader>
          <div className="p-8 prose prose-slate max-w-none">
            <div dangerouslySetInnerHTML={{ __html: selectedArticle?.content || '' }} />
          </div>
          <DialogFooter className="p-6 border-t border-slate-100 bg-slate-50/30 flex justify-between items-center w-full">
            <Button variant="ghost" onClick={() => setSelectedArticle(null)} className="text-slate-500">Close</Button>
            <div className="flex gap-2">
                <Button variant="outline" className="gap-2"><ExternalLink className="h-4 w-4" /> View Public</Button>
                <Button className="bg-slate-900 gap-2"><PenTool className="h-4 w-4" /> Edit Article</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// --- REPORTS VIEW (Placeholder) ---
const ReportsView = () => (
  <div className="flex flex-col items-center justify-center h-full bg-slate-50 text-slate-400 p-8">
    <div className="max-w-md text-center space-y-6">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm border border-slate-200">
            <BarChart3 className="h-10 w-10 text-slate-300" />
        </div>
        <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Analytics Dashboard</h2>
            <p className="text-slate-500 leading-relaxed">
                Detailed reporting on ticket volume, response times, and CSAT scores is coming in the next update.
            </p>
        </div>
        <Button disabled variant="outline">View Sample Report</Button>
    </div>
  </div>
);

// --- MAIN WRAPPER ---

export const SupportHub = () => {
  const [currentView, setCurrentView] = useState<ViewMode>('inbox');

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] -m-4 md:-m-8 bg-slate-50 overflow-hidden relative">
      {/* Top Navigation Bar */}
      <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 z-20 shadow-sm">
        <div className="flex items-center gap-6">
           <div className="flex items-center gap-2 text-slate-900 font-bold text-lg tracking-tight">
              <LifeBuoy className="h-6 w-6 text-blue-600" />
              <span>Support Hub</span>
           </div>
           
           <div className="h-6 w-px bg-slate-200" />

           <Tabs value={currentView} onValueChange={(v) => setCurrentView(v as ViewMode)} className="w-auto">
              <TabsList className="bg-slate-100 h-9 p-1">
                <TabsTrigger value="inbox" className="text-xs px-4 h-7 font-medium">Inbox</TabsTrigger>
                <TabsTrigger value="kb" className="text-xs px-4 h-7 font-medium">Knowledge Base</TabsTrigger>
                <TabsTrigger value="reports" className="text-xs px-4 h-7 font-medium">Reports</TabsTrigger>
              </TabsList>
           </Tabs>
        </div>

        <div className="flex items-center gap-2">
           <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100 text-xs font-semibold shadow-sm">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </div>
              All Systems Operational
           </div>
        </div>
      </header>
      
      <main className="flex-1 overflow-hidden relative bg-white">
        <AnimatePresence mode='wait'>
          {currentView === 'inbox' && (
            <motion.div 
              key="inbox"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full w-full"
            >
              <InboxView />
            </motion.div>
          )}
          
          {currentView === 'kb' && (
            <motion.div 
              key="kb"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full w-full"
            >
              <KnowledgeBaseView />
            </motion.div>
          )}

          {currentView === 'reports' && (
            <motion.div 
              key="reports"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full w-full"
            >
              <ReportsView />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};
