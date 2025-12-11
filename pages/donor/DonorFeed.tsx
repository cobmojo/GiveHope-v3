
import React, { useState, useMemo } from 'react';
import { 
  Heart, MessageCircle, MoreHorizontal, 
  Share2, Bookmark, Globe, Sparkles, Send,
  Repeat, ImageOff, Wand2, Link as LinkIcon,
  Facebook, Twitter, Linkedin, Mail, Check,
  BookmarkCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel 
} from '../../components/ui/DropdownMenu';
import { cn } from '../../lib/utils';
import { GoogleGenAI } from "@google/genai";

// --- Types ---
type ContentType = 'Update' | 'Prayer' | 'Story' | 'Video';
type FilterType = 'All' | 'Saved' | ContentType;

interface Comment {
  id: string;
  author: string;
  authorTitle?: string;
  avatar: string;
  text: string;
  time: string;
  likes: number;
}

interface Post {
  id: number;
  workerId: string;
  workerName: string;
  workerTitle: string;
  workerAvatar: string;
  location: string;
  time: string;
  readTime?: string;
  type: ContentType;
  title?: string;
  content: string; // HTML allowed
  images?: string[];
  likes: number;
  prayers: number;
  comments: Comment[];
  liked?: boolean;
  prayed?: boolean;
  saved?: boolean;
}

// --- Mock Data ---
const MOCK_POSTS: Post[] = [
  {
    id: 1,
    workerId: 'w1',
    workerName: 'The Miller Family',
    workerTitle: 'Education & Development',
    workerAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?fit=facearea&facepad=2&w=256&h=256&q=80',
    location: 'Chiang Mai, Thailand',
    time: '2 hours ago',
    readTime: '3 min read',
    type: 'Update',
    title: 'Clean Water Flowing in Northern Village',
    content: `
      <p>We are absolutely thrilled to announce that the new well in the northern village is fully operational! Over <strong>500 families</strong> now have access to clean, safe drinking water.</p>
      <p>This changes everything for this community. No more 5-mile walks for water in the scorching heat. Children can attend school on time, and waterborne diseases will drop significantly.</p>
      <blockquote>"Water is life. You have given us our future back." — Village Elder</blockquote>
      <p>Thank you to everyone who donated to the <em>Water for Life</em> campaign. This victory belongs to you as much as it belongs to them.</p>
    `,
    images: [
      "https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=1931&auto=format&fit=crop"
    ],
    likes: 42,
    prayers: 12,
    comments: [
      { id: 'c1', author: 'Jane Doe', avatar: '', text: 'This is incredible news! So happy for them. 🙌', time: '1h ago', likes: 4 },
      { id: 'c2', author: 'Robert Fox', authorTitle: 'Monthly Partner', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=60', text: 'Praise God! Worth every penny.', time: '30m ago', likes: 2 }
    ],
    saved: true
  },
  {
    id: 2,
    workerId: 'w2',
    workerName: 'Dr. Sarah Smith',
    workerTitle: 'Medical Mission',
    workerAvatar: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?fit=facearea&facepad=2&w=256&h=256&q=80',
    location: 'Nairobi, Kenya',
    time: 'Yesterday',
    readTime: '1 min read',
    type: 'Prayer',
    title: 'Urgent: Customs Delay',
    content: `
      <p>Please pray for our medical supply shipment. It has been held up at customs for 3 days now.</p>
      <p>We are running low on essential antibiotics and insulin. We have provided all requested documentation, but the process is stalled. We are trusting for a breakthrough tomorrow morning.</p>
    `,
    likes: 15,
    prayers: 89,
    comments: [],
    prayed: true
  },
  {
    id: 3,
    workerId: 'w1',
    workerName: 'The Miller Family',
    workerTitle: 'Education & Development',
    workerAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?fit=facearea&facepad=2&w=256&h=256&q=80',
    location: 'Chiang Mai, Thailand',
    time: '3 days ago',
    readTime: '4 min read',
    type: 'Story',
    title: 'Dreaming Big: Meet Aroon',
    content: `
      <p>Meet Aroon. He's 8 years old and just attended his first English class today. Before our center opened, he spent his days collecting recyclables to help his family.</p>
      <p>He told us his dream is to become a <strong>pilot</strong> so he can see the world. When asked why, he said:</p>
      <p><em>"I want to see if the clouds look different in other places."</em></p>
      <p>With your support, we're helping kids like Aroon stay in school and dream big dreams. We provided him with a uniform, books, and a hot meal today.</p>
    `,
    images: [
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&auto=format&fit=crop&q=80"
    ],
    likes: 124,
    prayers: 5,
    comments: [
      { id: 'c2', author: 'John Doe', avatar: '', text: 'Go Aroon! We are cheering for you.', time: '2d ago', likes: 1 },
      { id: 'c3', author: 'Mary Johnson', avatar: '', text: 'That smile says it all.', time: '2d ago', likes: 0 }
    ]
  }
];

// --- Components ---

const FeedFilter = ({ 
  current, 
  onChange 
}: { 
  current: FilterType; 
  onChange: (val: FilterType) => void; 
}) => {
  const filters: FilterType[] = ['All', 'Update', 'Prayer', 'Story', 'Video', 'Saved'];
  
  return (
    <div className="sticky top-[56px] z-30 bg-slate-50/90 backdrop-blur-xl border-b border-slate-200/50 py-4 mb-8 transition-all">
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar px-1 max-w-2xl mx-auto">
        {filters.map((type) => (
          <button
            key={type}
            onClick={() => onChange(type)}
            className={cn(
              "px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 border select-none whitespace-nowrap flex items-center gap-2",
              current === type
                ? "bg-slate-900 text-white border-slate-900 shadow-lg hover:shadow-xl transform scale-[1.02]"
                : "bg-white text-slate-600 border-slate-200/60 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 shadow-sm"
            )}
          >
            {type === 'Saved' && <BookmarkCheck className={cn("w-3.5 h-3.5", current === type ? "text-white" : "text-slate-400")} />}
            {type}
          </button>
        ))}
      </div>
    </div>
  );
};

const PostActions = ({ 
  post, 
  onLike, 
  onPray,
  onSave,
  onToggleComments 
}: { 
  post: Post; 
  onLike: () => void; 
  onPray: () => void; 
  onSave: () => void;
  onToggleComments: () => void; 
}) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = `https://givehope.app/posts/${post.id}`; // Mock URL
  const shareText = `Check out this update from ${post.workerName} on GiveHope!`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title || 'Update from GiveHope',
        text: shareText,
        url: shareUrl,
      }).catch(console.error);
    }
  };

  return (
    <div className="flex items-center justify-between py-2 mt-8">
      <div className="flex items-center gap-2">
        <motion.button 
          whileTap={{ scale: 0.85 }}
          onClick={onLike}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-200 group hover:bg-slate-50",
            post.liked ? "text-rose-600" : "text-slate-500 hover:text-slate-900"
          )}
        >
          <Heart className={cn("h-6 w-6 transition-all", post.liked ? "fill-current scale-110" : "group-hover:scale-110")} strokeWidth={post.liked ? 0 : 1.5} />
          <span className="text-sm font-semibold">{post.likes}</span>
        </motion.button>

        <motion.button 
          whileTap={{ scale: 0.85 }}
          onClick={onPray}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-200 group hover:bg-slate-50",
            post.prayed ? "text-indigo-600" : "text-slate-500 hover:text-slate-900"
          )}
        >
          <Sparkles className={cn("h-6 w-6 transition-all", post.prayed ? "fill-current scale-110" : "group-hover:scale-110")} strokeWidth={1.5} />
          <span className="text-sm font-semibold">{post.prayers}</span>
        </motion.button>

        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={onToggleComments}
          className="flex items-center gap-2 px-3 py-2 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all group"
        >
          <MessageCircle className="h-6 w-6 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
          <span className="text-sm font-semibold">{post.comments.length}</span>
        </motion.button>
      </div>

      <div className="flex items-center gap-1">
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={onSave}
          className={cn(
            "p-2.5 rounded-full transition-colors",
            post.saved ? "text-blue-600 bg-blue-50" : "text-slate-400 hover:text-slate-900 hover:bg-slate-100"
          )}
          title={post.saved ? "Remove from bookmarks" : "Save this post"}
        >
          <Bookmark className={cn("h-5 w-5 transition-all", post.saved ? "fill-current scale-110" : "")} strokeWidth={1.5} />
        </motion.button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <motion.button 
              whileTap={{ scale: 0.9 }}
              className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors"
            >
              <Share2 className="h-5 w-5" strokeWidth={1.5} />
            </motion.button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Share Update</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {typeof navigator !== 'undefined' && navigator.share && (
               <DropdownMenuItem onClick={handleNativeShare}>
                 <Share2 className="mr-2 h-4 w-4" /> Share via...
               </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={handleCopyLink}>
              {copied ? <Check className="mr-2 h-4 w-4 text-green-600" /> : <LinkIcon className="mr-2 h-4 w-4" />}
              {copied ? "Copied!" : "Copy Link"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank')}>
              <Facebook className="mr-2 h-4 w-4 text-blue-600" /> Facebook
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank')}>
              <Twitter className="mr-2 h-4 w-4 text-sky-500" /> X / Twitter
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank')}>
              <Linkedin className="mr-2 h-4 w-4 text-blue-700" /> LinkedIn
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => window.open(`mailto:?subject=${encodeURIComponent(post.title || 'Update from GiveHope')}&body=${encodeURIComponent(shareText + '\n\n' + shareUrl)}`)}>
              <Mail className="mr-2 h-4 w-4" /> Email
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

const CommentsSection = ({ 
  postContext,
  comments, 
  onAddComment 
}: { 
  postContext: string;
  comments: Comment[]; 
  onAddComment: (text: string) => void; 
}) => {
  const [text, setText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = () => {
    if (text.trim()) {
      onAddComment(text);
      setText('');
    }
  };

  const handleAIGenerate = async (tone: 'Encouraging' | 'Prayer' | 'Celebratory') => {
    setIsGenerating(true);
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      // Fallback
      if (tone === 'Celebratory') setText("This is fantastic news! So happy to see this progress. 🎉");
      else if (tone === 'Prayer') setText("Praying for a breakthrough! 🙏");
      else setText("Keep up the great work! We are with you.");
      setIsGenerating(false);
      return;
    }

    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Draft a short (1 sentence) ${tone.toLowerCase()} comment for a donor to leave on this field update. Context: "${postContext}"`,
      });
      setText(response.text?.trim() || "");
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="bg-slate-50/50 rounded-2xl p-6 mt-4 border border-slate-100/50"
    >
      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Discussion ({comments.length})</h4>
      
      <div className="space-y-6 mb-8">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-4">
            <Avatar className="h-9 w-9 border border-white shadow-sm">
              <AvatarImage src={comment.avatar} />
              <AvatarFallback className="bg-white text-slate-700 text-xs font-bold border border-slate-100">{comment.author[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900">{comment.author}</span>
                  {comment.authorTitle && (
                    <Badge variant="secondary" className="text-[10px] h-4 px-1.5 bg-slate-200/50 text-slate-600 font-medium">
                      {comment.authorTitle}
                    </Badge>
                  )}
                </div>
                <span className="text-xs text-slate-400 font-medium">{comment.time}</span>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed font-normal">{comment.text}</p>
              <button className="text-xs font-semibold text-slate-400 hover:text-slate-900 transition-colors">
                Reply
              </button>
            </div>
          </div>
        ))}
        {comments.length === 0 && (
          <p className="text-sm text-slate-400 italic text-center py-4">No comments yet. Start the conversation.</p>
        )}
      </div>

      {/* Smart Compose */}
      <div className="flex gap-2 mb-3 overflow-x-auto no-scrollbar">
        <button 
            onClick={() => handleAIGenerate('Celebratory')}
            disabled={isGenerating}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors whitespace-nowrap shadow-sm"
        >
            <Sparkles className="h-3 w-3 text-amber-500" />
            {isGenerating ? 'Thinking...' : 'Celebrate'}
        </button>
        <button 
            onClick={() => handleAIGenerate('Prayer')}
            disabled={isGenerating}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors whitespace-nowrap shadow-sm"
        >
            <Heart className="h-3 w-3 text-rose-500" />
            {isGenerating ? 'Thinking...' : 'Pray'}
        </button>
        <button 
            onClick={() => handleAIGenerate('Encouraging')}
            disabled={isGenerating}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors whitespace-nowrap shadow-sm"
        >
            <Wand2 className="h-3 w-3 text-blue-500" />
            {isGenerating ? 'Thinking...' : 'Encourage'}
        </button>
      </div>

      <div className="flex gap-3 items-center">
        <Avatar className="h-9 w-9 border border-slate-200 hidden sm:block">
          <AvatarFallback className="bg-slate-900 text-white text-xs font-bold">ME</AvatarFallback>
        </Avatar>
        <div className="relative flex-1 group">
          <Input 
            placeholder="Write a supportive comment..." 
            className="pr-12 bg-white border-slate-200/80 focus:border-slate-300 focus:ring-4 focus:ring-slate-100 rounded-full h-12 transition-all shadow-sm pl-5"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
          <button 
            onClick={handleSubmit}
            disabled={!text.trim()}
            className="absolute right-1.5 top-1.5 p-2 text-white bg-slate-900 hover:bg-slate-800 rounded-full disabled:opacity-0 disabled:scale-90 transition-all shadow-sm w-9 h-9 flex items-center justify-center"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const PostCard: React.FC<{ 
  post: Post; 
  onLike: (id: number) => void; 
  onPray: (id: number) => void; 
  onSave: (id: number) => void;
  onAddComment: (id: number, text: string) => void; 
}> = ({ 
  post, 
  onLike, 
  onPray, 
  onSave,
  onAddComment 
}) => {
  const [showComments, setShowComments] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Extract text content for AI context (stripping HTML)
  const plainTextContext = post.content.replace(/<[^>]+>/g, '');

  return (
    <motion.article 
      layout
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 overflow-hidden hover:shadow-md transition-shadow duration-300"
    >
      {/* Meta Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="relative group cursor-pointer">
            <Avatar className="h-10 w-10 border border-slate-100 shadow-sm transition-transform group-hover:scale-105">
              <AvatarImage src={post.workerAvatar} />
              <AvatarFallback className="bg-slate-100 font-bold text-slate-600">{post.workerName[0]}</AvatarFallback>
            </Avatar>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 text-sm leading-none cursor-pointer hover:underline decoration-2 decoration-slate-200 underline-offset-4">{post.workerName}</h3>
              <button className="text-xs font-medium text-emerald-600 hover:text-emerald-700 transition-colors">Follow</button>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1 font-medium">
              <span className="text-slate-400">{post.readTime || '3 min read'}</span>
              <span className="text-slate-300">•</span>
              <span>{post.time}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
           <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-slate-300 hover:text-slate-600 hover:bg-transparent -mr-2">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem>Mute Updates</DropdownMenuItem>
              <DropdownMenuItem>Report</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Copy Link</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {post.title && (
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">{post.title}</h2>
        )}
        
        {/* Images - Edge to Edge look but contained */}
        {post.images && post.images.length > 0 && !imageError && (
          <div className="rounded-2xl overflow-hidden shadow-sm border border-slate-100 bg-slate-50">
            <img 
              src={post.images[0]} 
              alt="Post content" 
              className="w-full h-auto object-cover max-h-[600px]" 
              loading="lazy"
              onError={() => setImageError(true)}
            />
          </div>
        )}
        
        {/* Fallback if image errors */}
        {imageError && (
           <div className="rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 h-32 flex items-center justify-center text-slate-400">
              <div className="flex flex-col items-center gap-2">
                 <ImageOff className="h-6 w-6" />
                 <span className="text-xs">Image unavailable</span>
              </div>
           </div>
        )}

        <div 
          className="prose prose-slate prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-p:leading-relaxed prose-p:text-slate-600 prose-blockquote:border-l-4 prose-blockquote:border-slate-900 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:font-medium prose-blockquote:text-slate-800 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>

      {/* Footer */}
      <PostActions 
        post={post} 
        onLike={() => onLike(post.id)}
        onPray={() => onPray(post.id)}
        onSave={() => onSave(post.id)}
        onToggleComments={() => setShowComments(!showComments)}
      />

      <AnimatePresence>
        {showComments && (
          <CommentsSection 
            postContext={plainTextContext}
            comments={post.comments} 
            onAddComment={(text) => onAddComment(post.id, text)} 
          />
        )}
      </AnimatePresence>
    </motion.article>
  );
};

export const DonorFeed = () => {
  const [filter, setFilter] = useState<FilterType>('All');
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);

  // --- Filter Logic ---
  const filteredPosts = useMemo(() => {
    if (filter === 'All') return posts;
    if (filter === 'Saved') return posts.filter(p => p.saved);
    return posts.filter(p => p.type === filter);
  }, [posts, filter]);

  // --- Handlers ---
  const handleLike = (id: number) => {
    setPosts(prev => prev.map(p => 
      p.id === id ? { ...p, likes: p.liked ? p.likes - 1 : p.likes + 1, liked: !p.liked } : p
    ));
  };

  const handlePray = (id: number) => {
    setPosts(prev => prev.map(p => 
      p.id === id ? { ...p, prayers: p.prayed ? p.prayers - 1 : p.prayers + 1, prayed: !p.prayed } : p
    ));
  };

  const handleSave = (id: number) => {
    setPosts(prev => prev.map(p => 
      p.id === id ? { ...p, saved: !p.saved } : p
    ));
  };

  const handleAddComment = (id: number, text: string) => {
    const newComment: Comment = {
      id: `new_${Date.now()}`,
      author: 'You',
      avatar: '',
      text,
      time: 'Just now',
      likes: 0
    };
    setPosts(prev => prev.map(p => 
      p.id === id ? { ...p, comments: [...p.comments, newComment] } : p
    ));
  };

  return (
    <div className="max-w-2xl mx-auto pb-20">
      
      {/* Hero Header */}
      <div className="px-1 mb-8 pt-8 text-center sm:text-left">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-slate-900 mb-4">
          Your Feed
        </h1>
        <p className="text-xl text-slate-500 font-light leading-relaxed max-w-lg">
          Field stories, urgent needs, and joyful updates from the partners you empower.
        </p>
      </div>

      {/* Filter Tabs */}
      <FeedFilter current={filter} onChange={setFilter} />

      {/* Feed Stream */}
      <div className="space-y-6">
        <AnimatePresence mode='popLayout'>
          {filteredPosts.map((post) => (
            <PostCard 
              key={post.id} 
              post={post}
              onLike={handleLike}
              onPray={handlePray}
              onSave={handleSave}
              onAddComment={handleAddComment}
            />
          ))}
        </AnimatePresence>
        
        {filteredPosts.length === 0 && (
          <div className="py-32 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-50 text-slate-300 mb-6">
              {filter === 'Saved' ? (
                <BookmarkCheck className="h-10 w-10" />
              ) : (
                <Sparkles className="h-10 w-10" />
              )}
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No posts found</h3>
            <p className="text-slate-500 max-w-xs mx-auto">
              {filter === 'Saved' 
                ? "You haven't bookmarked any updates yet. Tap the bookmark icon on any post to save it here."
                : "Try changing the filter or check back later for new stories."
              }
            </p>
            {filter === 'Saved' && (
              <Button variant="link" onClick={() => setFilter('All')} className="mt-2">
                Browse All Updates
              </Button>
            )}
          </div>
        )}
      </div>

      {/* End of Feed Indicator */}
      {filteredPosts.length > 0 && (
        <div className="flex flex-col items-center py-20 space-y-4 opacity-40 hover:opacity-100 transition-opacity">
          <div className="flex gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
             <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
             <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
          </div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest pt-2">You're all caught up</p>
        </div>
      )}
    </div>
  );
};
