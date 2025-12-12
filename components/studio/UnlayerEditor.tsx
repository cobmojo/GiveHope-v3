
import React, { useState, useRef, useEffect } from 'react';
import { 
  Monitor, Smartphone, Tablet, Undo, Redo, 
  Eye, EyeOff, Save, Download, Type, Image as ImageIcon, 
  MousePointer2, Columns, GripVertical, 
  Trash2, Video, Code, Minus, X,
  AlignLeft, AlignCenter, AlignRight,
  Layout,
  UserCheck, Grid, PieChart, QrCode, ListStart, FileDown, BadgeCheck, Users2,
  Copy, Plus, Move, CreditCard, AlertCircle, CheckCircle, Info, Target, Footprints, Calendar, Megaphone, Share2, Quote, User, ChevronDown, LayoutTemplate,
  Wand2, Sparkles, RefreshCcw, Bot, MessageSquarePlus, Palette, Heart, Mail
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/Tabs';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Slider } from '../ui/Slider';
import { Textarea } from '../ui/Textarea';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '../ui/DropdownMenu';
import { cn } from '../../lib/utils';
import { GoogleGenAI } from "@google/genai";

// --- Types ---

type BlockType = 'text' | 'image' | 'button' | 'heading' | 'divider' | 'video' | 'html';

interface Block {
  id: string;
  type: BlockType;
  content: any;
  styles: React.CSSProperties;
}

interface Preset {
  id: string;
  label: string;
  icon: any;
  blocks: Omit<Block, 'id'>[];
}

interface Template {
  id: string;
  name: string;
  description: string;
  blocks: Omit<Block, 'id'>[];
  bodyStyles: React.CSSProperties;
  color: string;
}

interface EditorState {
  blocks: Block[];
  selectedBlockId: string | null;
  bodyStyles: React.CSSProperties & { linkColor?: string };
  device: 'desktop' | 'tablet' | 'mobile';
}

interface DragTarget {
  id: string;
  position: 'top' | 'bottom';
}

// --- Pre-made NGO Blocks (Presets) ---

const PRESETS: Preset[] = [
  {
    id: 'header_logo',
    label: 'Logo Header',
    icon: Layout,
    blocks: [
      { type: 'image', content: { url: 'https://via.placeholder.com/150x50?text=GIVEHOPE', alt: 'Logo' }, styles: { width: '150px', margin: '20px auto', display: 'block' } },
      { type: 'divider', content: {}, styles: { margin: '0', borderTop: '1px solid #e2e8f0', padding: '10px 0' } }
    ]
  },
  {
    id: 'hero',
    label: 'Mission Hero',
    icon: ImageIcon,
    blocks: [
      { type: 'image', content: { url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop', alt: 'Hero Image' }, styles: { width: '100%', borderRadius: '8px', marginBottom: '20px', display: 'block' } },
      { type: 'heading', content: { text: 'Restoring Hope Together' }, styles: { fontSize: '32px', fontWeight: '800', color: '#1e293b', textAlign: 'center', marginBottom: '12px', lineHeight: '1.2' } },
      { type: 'text', content: { text: 'Your partnership enables us to provide clean water, education, and medical relief to those who need it most. Thank you for standing with us.' }, styles: { fontSize: '16px', color: '#475569', textAlign: 'center', lineHeight: '1.6', marginBottom: '24px' } },
      { type: 'button', content: { text: 'Support the Mission', url: '#' }, styles: { backgroundColor: '#2563eb', color: '#ffffff', padding: '14px 28px', borderRadius: '6px', display: 'inline-block', fontWeight: '600', textDecoration: 'none', margin: '0 auto', textAlign: 'center' } }
    ]
  },
  {
    id: 'donation_grid',
    label: 'Donation Tiers',
    icon: CreditCard,
    blocks: [
      { type: 'heading', content: { text: 'Choose Your Impact' }, styles: { textAlign: 'center', fontSize: '20px', fontWeight: 'bold', color: '#1e293b', marginBottom: '5px' } },
      { type: 'text', content: { text: 'Select an amount to give today.' }, styles: { textAlign: 'center', color: '#64748b', fontSize: '14px', marginBottom: '20px' } },
      { type: 'html', content: { html: `
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td width="33%" style="padding: 5px;">
              <a href="#" style="display: block; background: #f1f5f9; color: #0f172a; text-decoration: none; padding: 15px 10px; border-radius: 6px; text-align: center; font-weight: bold; border: 1px solid #cbd5e1;">$50</a>
            </td>
            <td width="33%" style="padding: 5px;">
              <a href="#" style="display: block; background: #2563eb; color: #ffffff; text-decoration: none; padding: 15px 10px; border-radius: 6px; text-align: center; font-weight: bold; border: 1px solid #2563eb;">$100</a>
            </td>
            <td width="33%" style="padding: 5px;">
              <a href="#" style="display: block; background: #f1f5f9; color: #0f172a; text-decoration: none; padding: 15px 10px; border-radius: 6px; text-align: center; font-weight: bold; border: 1px solid #cbd5e1;">$250</a>
            </td>
          </tr>
        </table>
      ` }, styles: { padding: '0 10px 20px' } }
    ]
  },
  {
    id: 'footer',
    label: 'Footer',
    icon: Footprints,
    blocks: [
      { type: 'divider', content: {}, styles: { margin: '30px 0 20px', borderTop: '1px solid #e2e8f0' } },
      { type: 'text', content: { text: 'GiveHope Humanitarian • 123 Mission Way, San Francisco, CA' }, styles: { fontSize: '12px', color: '#94a3b8', textAlign: 'center', marginBottom: '4px' } },
      { type: 'text', content: { text: 'Unsubscribe  |  Privacy Policy' }, styles: { fontSize: '12px', color: '#94a3b8', textAlign: 'center', textDecoration: 'underline' } }
    ]
  },
  {
    id: 'signature',
    label: 'Signature',
    icon: Megaphone,
    blocks: [
      { type: 'html', content: { html: '<table style="margin-top: 20px;"><tr><td style="vertical-align: middle; padding-right: 15px;"><img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop" style="width: 50px; height: 50px; border-radius: 50%; display: block;" /></td><td style="vertical-align: middle;"><p style="margin: 0; font-weight: bold; color: #0f172a; font-size: 16px;">The Miller Family</p><p style="margin: 0; font-size: 13px; color: #64748b;">Field Partners, Thailand</p></td></tr></table>' }, styles: { padding: '10px 0' } }
    ]
  }
];

// --- Templates (Full Layouts) ---

const SAVED_TEMPLATES: Template[] = [
  {
    id: 'newsletter_monthly',
    name: 'The Visionary',
    description: 'Monthly impact newsletter with stats and stories.',
    bodyStyles: { backgroundColor: '#f8fafc', fontFamily: 'Inter, sans-serif', width: '600px', color: '#334155', fontSize: '16px', lineHeight: '1.5' },
    color: 'bg-emerald-50 text-emerald-700',
    blocks: [
        { type: 'image', content: { url: 'https://via.placeholder.com/150x50?text=GIVEHOPE', alt: 'Logo' }, styles: { width: '150px', margin: '20px auto', display: 'block' } },
        { type: 'divider', content: {}, styles: { margin: '0', borderTop: '1px solid #e2e8f0', padding: '10px 0' } },
        { type: 'image', content: { url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop', alt: 'Hero Image' }, styles: { width: '100%', borderRadius: '8px', marginBottom: '20px', display: 'block' } },
        { type: 'heading', content: { text: 'October Vision Update' }, styles: { fontSize: '24px', fontWeight: 'bold', textAlign: 'center', color: '#0f172a', margin: '20px 0 10px' } },
        { type: 'text', content: { text: 'Hi {{first_name}},\n\nThis month has been nothing short of miraculous. Thanks to your support, we broke ground on the new clinic.' }, styles: { fontSize: '16px', color: '#475569', lineHeight: '1.6', padding: '0 20px' } },
        { type: 'divider', content: {}, styles: { margin: '30px 0 20px', borderTop: '1px solid #e2e8f0' } },
        { type: 'text', content: { text: 'GiveHope Humanitarian • 123 Mission Way, San Francisco, CA' }, styles: { fontSize: '12px', color: '#94a3b8', textAlign: 'center', marginBottom: '4px' } }
    ]
  }
];

const INITIAL_BLOCKS: Block[] = [
  { id: 'init_1', type: 'image', content: { url: 'https://via.placeholder.com/150x50?text=GIVEHOPE', alt: 'Logo' }, styles: { width: '150px', margin: '20px auto', display: 'block' } },
  { id: 'init_2', type: 'divider', content: {}, styles: { margin: '0', borderTop: '1px solid #e2e8f0', padding: '10px 0' } },
  { id: 'init_3', type: 'image', content: { url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop', alt: 'Hero Image' }, styles: { width: '100%', borderRadius: '8px', marginBottom: '20px', display: 'block' } },
  { id: 'init_4', type: 'heading', content: { text: 'October Vision Update' }, styles: { fontSize: '24px', fontWeight: 'bold', textAlign: 'center', color: '#0f172a', margin: '20px 0 10px' } },
  { id: 'init_5', type: 'text', content: { text: 'Hi {{first_name}},\n\nThis month has been nothing short of miraculous. Thanks to your support, we broke ground on the new clinic in Northern Thailand. This facility will serve over 2,000 families who previously had to travel 4 hours for basic medical care.\n\nYour generosity is building more than walls; it is building a future of health and hope.' }, styles: { fontSize: '16px', color: '#475569', lineHeight: '1.6', padding: '0 20px', textAlign: 'left' } },
  { id: 'init_6', type: 'button', content: { text: 'View Construction Photos', url: '#' }, styles: { backgroundColor: '#2563eb', color: '#ffffff', padding: '14px 28px', borderRadius: '6px', display: 'inline-block', fontWeight: '600', textDecoration: 'none', margin: '20px auto', textAlign: 'center' } },
  { id: 'init_7', type: 'divider', content: {}, styles: { margin: '30px 0 20px', borderTop: '1px solid #e2e8f0' } },
  { id: 'init_8', type: 'text', content: { text: 'GiveHope Humanitarian • 123 Mission Way, San Francisco, CA' }, styles: { fontSize: '12px', color: '#94a3b8', textAlign: 'center', marginBottom: '4px' } },
  { id: 'init_9', type: 'text', content: { text: 'Unsubscribe  |  Privacy Policy' }, styles: { fontSize: '12px', color: '#94a3b8', textAlign: 'center', textDecoration: 'underline' } }
];

// --- Helper Components ---

const ToolButton = ({ icon: Icon, label, type, onDragStart }: { icon: any, label: string, type: string, onDragStart: (e: React.DragEvent, type: string) => void }) => (
  <div 
    draggable 
    onDragStart={(e) => onDragStart(e, type)}
    className="flex flex-col items-center justify-center gap-2 p-4 bg-white rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 hover:shadow-md cursor-grab active:cursor-grabbing transition-all group h-24"
  >
    <Icon className="h-6 w-6 text-slate-500 group-hover:text-blue-600 transition-colors" />
    <span className="text-[11px] font-medium text-slate-600 group-hover:text-blue-700">{label}</span>
  </div>
);

const PresetButton: React.FC<{ preset: Preset, onDragStart: (e: React.DragEvent, id: string) => void }> = ({ preset, onDragStart }) => (
  <div 
    draggable 
    onDragStart={(e) => onDragStart(e, preset.id)}
    className="flex flex-col items-center justify-center gap-2 p-3 bg-white rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 hover:shadow-md cursor-grab active:cursor-grabbing transition-all group h-24 text-center"
  >
    <preset.icon className="h-6 w-6 text-slate-500 group-hover:text-blue-600 transition-colors" />
    <span className="text-[11px] font-medium text-slate-600 group-hover:text-blue-700 leading-tight">{preset.label}</span>
  </div>
);

const ColorPicker = ({ label, value, onChange }: { label: string, value?: string, onChange: (val: string) => void }) => {
  const [localValue, setLocalValue] = useState(value || '#000000');
  
  useEffect(() => {
      if (value) setLocalValue(value);
  }, [value]);

  const handleChange = (val: string) => {
      setLocalValue(val);
      onChange(val);
  };

  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-slate-600 font-semibold">{label}</Label>
      <div className="flex gap-2 items-center border border-slate-300 p-1.5 rounded-md bg-white shadow-sm hover:border-slate-400 transition-colors">
        <div 
          className="w-6 h-6 rounded border border-slate-200 relative overflow-hidden shrink-0 shadow-sm"
          style={{ backgroundColor: localValue }}
        >
          <input 
            type="color" 
            value={localValue} 
            onChange={(e) => handleChange(e.target.value)}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full p-0 border-0"
            style={{ padding: 0, margin: 0 }}
          />
        </div>
        <input 
          type="text" 
          value={localValue}
          onChange={(e) => handleChange(e.target.value)}
          className="flex-1 text-xs font-mono outline-none uppercase text-slate-900 bg-transparent font-medium h-6"
          style={{ backgroundColor: 'transparent' }}
        />
      </div>
    </div>
  );
};

// --- Main Component ---

export const UnlayerEditor: React.FC<{ mode: 'email' | 'pdf', onSave?: () => void, onExport?: (type: string) => void }> = ({ mode, onSave, onExport }) => {
  const [state, setState] = useState<EditorState>({
    blocks: INITIAL_BLOCKS,
    selectedBlockId: null,
    bodyStyles: { 
      backgroundColor: '#ffffff',
      fontFamily: 'Inter, sans-serif', 
      width: '600px',
      color: '#334155', 
      fontSize: '16px',
      lineHeight: '1.5',
      linkColor: '#2563eb'
    },
    device: 'desktop'
  });

  const [dragTarget, setDragTarget] = useState<DragTarget | null>(null);
  const [isPreview, setIsPreview] = useState(false);
  const [activeTab, setActiveTab] = useState('ai');
  const canvasRef = useRef<HTMLDivElement>(null);

  // --- AI State ---
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [isAiRewriting, setIsAiRewriting] = useState(false);

  // --- AI Actions ---

  const getAIClient = () => {
    try {
      if (!process.env.API_KEY) return null;
      return new GoogleGenAI({ apiKey: process.env.API_KEY });
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  const handleMagicLayout = async () => {
    if (!aiPrompt.trim()) return;
    setIsAiGenerating(true);
    const ai = getAIClient();

    try {
        if (!ai) {
            // Mock for no key
            await new Promise(r => setTimeout(r, 2000));
            // Just load a template as a mock
            const blocksCopy = JSON.parse(JSON.stringify(SAVED_TEMPLATES[0].blocks));
            const newBlocks = blocksCopy.map((b: any) => ({ ...b, id: `block_${Date.now()}_${Math.random()}` }));
            setState(prev => ({ ...prev, blocks: newBlocks, selectedBlockId: null }));
            setIsAiGenerating(false);
            return;
        }

        const prompt = `
            Act as an expert email designer for a humanitarian organization.
            Create a complete email layout JSON based on this user request: "${aiPrompt}"
            
            Return a JSON object with a 'blocks' array. 
            Each block has { type: 'heading'|'text'|'image'|'button'|'divider', content: {...}, styles: {...} }.
            
            Rules:
            1. Use 'heading' for titles (styles: bold, 24px+).
            2. Use 'text' for body (styles: 16px, line-height 1.6).
            3. Use 'button' for calls to action (styles: blue background, white text, padding).
            4. Use 'image' for visuals. Use https://source.unsplash.com/800x400/?keyword for URLs (replace keyword).
            5. Create a cohesive story: Header, Hero Image, Emotional Hook, Solution, Call to Action, Footer.
            6. Return ONLY valid JSON.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });

        const json = JSON.parse(response.text || "{}");
        if (json.blocks && Array.isArray(json.blocks)) {
            const newBlocks = json.blocks.map((b: any) => ({
                ...b,
                id: `ai_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
            }));
            setState(prev => ({ ...prev, blocks: newBlocks, selectedBlockId: null }));
        }

    } catch (e) {
        console.error("AI Layout Error", e);
    } finally {
        setIsAiGenerating(false);
    }
  };

  const handleSmartRewrite = async (tone: 'Professional' | 'Emotional' | 'Urgent' | 'Shorten' | 'Fix Grammar') => {
    if (!state.selectedBlockId) return;
    const block = state.blocks.find(b => b.id === state.selectedBlockId);
    if (!block || !['text', 'heading'].includes(block.type)) return;

    setIsAiRewriting(true);
    const ai = getAIClient();
    const currentText = block.content.text;

    try {
        if (!ai) {
            await new Promise(r => setTimeout(r, 1000));
            updateBlockContent(block.id, 'text', `[AI ${tone}] ${currentText}`);
            setIsAiRewriting(false);
            return;
        }

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Rewrite the following text to be ${tone}. Keep formatting minimal. Text: "${currentText}"`
        });

        const newText = response.text?.trim();
        if (newText) {
            updateBlockContent(block.id, 'text', newText);
        }
    } catch (e) {
        console.error("AI Rewrite Error", e);
    } finally {
        setIsAiRewriting(false);
    }
  };

  const handleImageSuggestion = async () => {
    if (!state.selectedBlockId) return;
    const block = state.blocks.find(b => b.id === state.selectedBlockId);
    if (!block || block.type !== 'image') return;

    setIsAiRewriting(true); // Re-use loading state
    const ai = getAIClient();

    try {
        // Gather context from surrounding text blocks
        const context = state.blocks
            .filter(b => b.type === 'text' || b.type === 'heading')
            .map(b => b.content.text)
            .join(' ')
            .substring(0, 500);

        if (!ai) {
             updateBlockContent(block.id, 'url', 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop');
             setIsAiRewriting(false);
             return;
        }

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Analyze this email context and suggest a single, specific 1-2 word search term for an Unsplash stock photo. Context: "${context}". Return ONLY the keyword.`
        });

        const keyword = response.text?.trim() || "charity";
        // Use Unsplash source API for demo (or a robust search in real app)
        const newUrl = `https://source.unsplash.com/800x600/?${encodeURIComponent(keyword)}`;
        // Note: source.unsplash is deprecated/unreliable in some contexts, but works for mock concepts. 
        // Better mock:
        const mockUrl = `https://via.placeholder.com/800x600?text=${keyword}`;
        
        updateBlockContent(block.id, 'url', mockUrl);
        updateBlockContent(block.id, 'alt', `Image of ${keyword}`);

    } catch (e) {
        console.error(e);
    } finally {
        setIsAiRewriting(false);
    }
  };

  // --- Core Editor Logic ---

  const handleDragStart = (e: React.DragEvent, type: string) => {
    e.dataTransfer.setData('blockType', type);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handlePresetDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('presetId', id);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const loadTemplate = (template: Template) => {
    if (confirm('Loading a template will replace your current content. Continue?')) {
        const blocksCopy = JSON.parse(JSON.stringify(template.blocks));
        const newBlocks = blocksCopy.map((b: any) => ({
            ...b, 
            id: `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        })) as Block[];
        
        setState(prev => ({
            ...prev,
            blocks: newBlocks,
            bodyStyles: { ...prev.bodyStyles, ...template.bodyStyles },
            selectedBlockId: null
        }));
    }
  };

  const insertMergeTag = (tag: string) => {
    if (!state.selectedBlockId) return;
    const block = state.blocks.find(b => b.id === state.selectedBlockId);
    if (!block) return;
    const currentText = block.content.text || '';
    updateBlockContent(block.id, 'text', currentText + ' ' + tag);
  };

  const handleBlockDragOver = (e: React.DragEvent, blockId: string) => {
    if (isPreview) return;
    e.preventDefault();
    e.stopPropagation();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const midY = rect.top + rect.height / 2;
    const position = e.clientY < midY ? 'top' : 'bottom';
    if (!dragTarget || dragTarget.id !== blockId || dragTarget.position !== position) {
      setDragTarget({ id: blockId, position });
    }
  };

  const handleCanvasDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragTarget(null);
    if (isPreview) return;
    const blockType = e.dataTransfer.getData('blockType') as BlockType;
    const presetId = e.dataTransfer.getData('presetId');
    const reorderId = e.dataTransfer.getData('reorderId');
    if (!dragTarget) insertBlock(blockType, presetId, reorderId, state.blocks.length);
  };

  const handleBlockDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (isPreview || !dragTarget) { setDragTarget(null); return; }
    const blockType = e.dataTransfer.getData('blockType') as BlockType;
    const presetId = e.dataTransfer.getData('presetId');
    const reorderId = e.dataTransfer.getData('reorderId');
    const targetIndex = state.blocks.findIndex(b => b.id === targetId);
    const insertIndex = dragTarget.position === 'top' ? targetIndex : targetIndex + 1;
    insertBlock(blockType, presetId, reorderId, insertIndex);
    setDragTarget(null);
  };

  const insertBlock = (blockType: BlockType | '', presetId: string, reorderId: string, index: number) => {
    const newBlocks = [...state.blocks];
    if (reorderId) {
      const currentIndex = newBlocks.findIndex(b => b.id === reorderId);
      if (currentIndex > -1) {
        const [movedBlock] = newBlocks.splice(currentIndex, 1);
        const adjustedIndex = currentIndex < index ? index - 1 : index;
        newBlocks.splice(adjustedIndex, 0, movedBlock);
        setState(prev => ({ ...prev, blocks: newBlocks, selectedBlockId: movedBlock.id }));
      }
    } else if (presetId) {
      const preset = PRESETS.find(p => p.id === presetId);
      if (preset) {
        const blocksToAdd = JSON.parse(JSON.stringify(preset.blocks)).map((b: any) => ({
          ...b,
          id: `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        })) as Block[];
        newBlocks.splice(index, 0, ...blocksToAdd);
        setState(prev => ({ ...prev, blocks: newBlocks, selectedBlockId: blocksToAdd[0].id }));
      }
    } else if (blockType) {
      const newBlock: Block = {
        id: `block_${Date.now()}`,
        type: blockType,
        content: getDefaultContent(blockType),
        styles: getDefaultStyles(blockType)
      };
      newBlocks.splice(index, 0, newBlock);
      setState(prev => ({ ...prev, blocks: newBlocks, selectedBlockId: newBlock.id }));
    }
  };

  const duplicateBlock = (block: Block) => {
    const index = state.blocks.findIndex(b => b.id === block.id);
    const newBlock = { ...block, id: `block_${Date.now()}` }; 
    const newBlocks = [...state.blocks];
    newBlocks.splice(index + 1, 0, newBlock);
    setState(prev => ({ ...prev, blocks: newBlocks, selectedBlockId: newBlock.id }));
  };

  const getDefaultContent = (type: BlockType) => {
    switch(type) {
      case 'text': return { text: 'Type your text here...' };
      case 'heading': return { text: 'Heading' };
      case 'button': return { text: 'Click Me', url: '#' };
      case 'image': return { url: '', alt: 'Image' };
      case 'divider': return {};
      case 'html': return { html: '<div style="padding:10px; text-align:center; color:#888;">Custom HTML</div>' };
      case 'video': return { url: 'https://www.youtube.com/watch?v=xyz' };
      default: return {};
    }
  };

  const getDefaultStyles = (type: BlockType): React.CSSProperties => {
    const base = { padding: '10px' };
    switch(type) {
      case 'heading': return { ...base, textAlign: 'center', color: '#0f172a', fontSize: '24px', fontWeight: 'bold' };
      case 'button': return { ...base, textAlign: 'center', display: 'inline-block', backgroundColor: '#2563eb', color: '#ffffff', padding: '12px 24px', borderRadius: '6px', textDecoration: 'none' };
      case 'image': return { ...base, width: '100%', display: 'block' };
      default: return { ...base };
    }
  };

  const updateBlockContent = (id: string, key: string, value: any) => {
    setState(prev => ({
      ...prev,
      blocks: prev.blocks.map(b => b.id === id ? { ...b, content: { ...b.content, [key]: value } } : b)
    }));
  };

  const updateBlockStyles = (id: string, newStyles: React.CSSProperties) => {
    setState(prev => ({
      ...prev,
      blocks: prev.blocks.map(b => b.id === id ? { ...b, styles: { ...b.styles, ...newStyles } } : b)
    }));
  };

  const deleteBlock = (id: string) => {
    setState(prev => ({
      ...prev,
      blocks: prev.blocks.filter(b => b.id !== id),
      selectedBlockId: null
    }));
  };

  // --- Renderers ---

  const renderBlockPreview = (block: Block) => {
    const isSelected = !isPreview && state.selectedBlockId === block.id;
    
    return (
      <div 
        key={block.id}
        draggable={!isPreview}
        onDragStart={(e) => {
            if (isPreview) { e.preventDefault(); return; }
            e.dataTransfer.setData('reorderId', block.id);
            e.dataTransfer.effectAllowed = 'move';
        }}
        onDragOver={(e) => handleBlockDragOver(e, block.id)}
        onDrop={(e) => handleBlockDrop(e, block.id)}
        onClick={(e) => { 
            if (isPreview) return;
            e.stopPropagation(); 
            setState(prev => ({ ...prev, selectedBlockId: block.id })); 
        }}
        className={cn(
          "relative group/block transition-all",
          !isPreview && "cursor-pointer",
          !isPreview && isSelected ? "ring-2 ring-blue-500 z-10" : "hover:ring-1 hover:ring-blue-300 ring-transparent",
          !isPreview && dragTarget?.id === block.id && dragTarget.position === 'top' && "border-t-4 border-t-blue-500",
          !isPreview && dragTarget?.id === block.id && dragTarget.position === 'bottom' && "border-b-4 border-b-blue-500"
        )}
        style={{ position: 'relative' }}
      >
        <div style={block.styles} className="w-full">
            {block.type === 'text' && (
                <div 
                    contentEditable={!isPreview}
                    suppressContentEditableWarning
                    onBlur={(e) => updateBlockContent(block.id, 'text', e.currentTarget.textContent)}
                    className="outline-none empty:before:content-['Type_text...'] empty:before:text-slate-300"
                    style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontFamily: 'inherit' }}
                >
                    {block.content.text}
                </div>
            )}
            
            {block.type === 'heading' && (
                <h1 
                    contentEditable={!isPreview}
                    suppressContentEditableWarning
                    onBlur={(e) => updateBlockContent(block.id, 'text', e.currentTarget.textContent)}
                    className="outline-none"
                    style={{ margin: 0, fontFamily: 'inherit', fontWeight: 'inherit', fontSize: 'inherit', textAlign: 'inherit' as any }}
                >
                    {block.content.text}
                </h1>
            )}

            {block.type === 'button' && (
                <div style={{ textAlign: block.styles.textAlign as any }}>
                    <a 
                        href={isPreview ? block.content.url : undefined} 
                        onClick={(e) => !isPreview && e.preventDefault()}
                        className="inline-block transition-opacity hover:opacity-90"
                        style={{
                            backgroundColor: (block.styles as any).backgroundColor,
                            color: (block.styles as any).color,
                            padding: (block.styles as any).padding,
                            borderRadius: (block.styles as any).borderRadius,
                            fontWeight: 'bold',
                            textDecoration: 'none',
                            fontFamily: 'inherit'
                        }}
                    >
                        {block.content.text}
                    </a>
                </div>
            )}

            {block.type === 'image' && (
                block.content.url ? (
                    <img 
                        src={block.content.url} 
                        alt={block.content.alt} 
                        style={{ maxWidth: '100%', height: 'auto', display: 'block', margin: '0 auto' }} 
                    />
                ) : (
                    <div className="bg-slate-100 border-2 border-dashed border-slate-300 rounded-lg h-32 flex flex-col items-center justify-center text-slate-400">
                        <ImageIcon className="w-8 h-8 mb-2" />
                        <span className="text-xs font-medium">Click to set image URL</span>
                    </div>
                )
            )}

            {block.type === 'divider' && (
                <hr style={{ borderTop: `2px solid ${(block.styles as any).color || '#e2e8f0'}`, margin: 0 }} />
            )}

            {block.type === 'html' && (
                <div dangerouslySetInnerHTML={{ __html: block.content.html }} />
            )}

            {block.type === 'video' && (
                <div className="bg-slate-900 flex items-center justify-center h-48 rounded relative overflow-hidden group/video">
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                        <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center text-slate-900 shadow-lg group-hover/video:scale-110 transition-transform">
                            <Video className="w-5 h-5 fill-slate-900" />
                        </div>
                    </div>
                    <img src="https://via.placeholder.com/600x300?text=Video+Thumbnail" alt="Video" className="w-full h-full object-cover opacity-50" />
                </div>
            )}
        </div>

        {isSelected && !isPreview && (
          <div className="absolute -right-12 top-0 flex flex-col gap-1 z-50">
            <button 
              className="p-1.5 bg-white border border-slate-200 shadow-sm rounded text-slate-500 hover:text-blue-600 hover:bg-blue-50 cursor-copy"
              onClick={(e) => { e.stopPropagation(); duplicateBlock(block); }}
              title="Duplicate"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button 
              className="p-1.5 bg-white border border-slate-200 shadow-sm rounded text-slate-500 hover:text-red-600 hover:bg-red-50"
              onClick={(e) => { e.stopPropagation(); deleteBlock(block.id); }}
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <div className="cursor-grab active:cursor-grabbing p-1.5 bg-white border border-slate-200 shadow-sm rounded text-slate-400 hover:text-slate-600">
              <Move className="w-4 h-4" />
            </div>
          </div>
        )}
      </div>
    );
  };

  const selectedBlock = state.blocks.find(b => b.id === state.selectedBlockId);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-100 overflow-hidden font-sans">
      
      {/* Top Bar */}
      <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0 shadow-sm z-20">
        <div className="flex items-center gap-4">
           <div className="flex bg-slate-100 rounded-lg p-1 border border-slate-200">
              <button onClick={() => setState(prev => ({ ...prev, device: 'desktop' }))} className={cn("p-2 rounded-md transition-all", state.device === 'desktop' ? "bg-white shadow-sm text-blue-600" : "text-slate-500 hover:text-slate-700")}>
                <Monitor className="h-4 w-4" />
              </button>
              <button onClick={() => setState(prev => ({ ...prev, device: 'tablet' }))} className={cn("p-2 rounded-md transition-all", state.device === 'tablet' ? "bg-white shadow-sm text-blue-600" : "text-slate-500 hover:text-slate-700")}>
                <Tablet className="h-4 w-4" />
              </button>
              <button onClick={() => setState(prev => ({ ...prev, device: 'mobile' }))} className={cn("p-2 rounded-md transition-all", state.device === 'mobile' ? "bg-white shadow-sm text-blue-600" : "text-slate-500 hover:text-slate-700")}>
                <Smartphone className="h-4 w-4" />
              </button>
           </div>
           <div className="w-px h-6 bg-slate-200" />
           <div className="flex gap-1">
              <button className="p-2 text-slate-400 hover:text-slate-700 transition-colors"><Undo className="h-4 w-4" /></button>
              <button className="p-2 text-slate-400 hover:text-slate-700 transition-colors"><Redo className="h-4 w-4" /></button>
           </div>
        </div>

        <div className="flex items-center gap-3">
           <Button variant="ghost" className={cn("text-slate-600 gap-2 h-9 text-xs font-semibold", isPreview ? "bg-blue-100 text-blue-700 hover:bg-blue-200" : "hover:bg-slate-100")} onClick={() => { setIsPreview(!isPreview); if (!isPreview) setState(prev => ({ ...prev, selectedBlockId: null })); }}>
              {isPreview ? <><EyeOff className="h-4 w-4" /> Exit Preview</> : <><Eye className="h-4 w-4" /> Preview</>}
           </Button>
           <Button variant="outline" className="gap-2 h-9 text-xs font-semibold" onClick={onSave}>
              <Save className="h-4 w-4" /> Save Draft
           </Button>
           
           {/* Enhanced Export Dropdown */}
           <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2 h-9 text-xs font-semibold shadow-md">
                  <Download className="h-4 w-4" /> Export <ChevronDown className="h-3 w-3 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onExport && onExport('html')}>
                  Export HTML
                </DropdownMenuItem>
                {mode === 'email' && (
                  <DropdownMenuItem onClick={() => onExport && onExport('mailchimp')}>
                    Export to Mailchimp
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => onExport && onExport('json')}>
                  Export JSON
                </DropdownMenuItem>
                {mode === 'pdf' && (
                   <DropdownMenuItem onClick={() => onExport && onExport('pdf')}>
                    Export PDF
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
           </DropdownMenu>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        
        {/* Canvas Area */}
        <div className="flex-1 overflow-y-auto bg-slate-100 flex justify-center p-8 relative" onClick={() => !isPreview && setState(prev => ({ ...prev, selectedBlockId: null }))}>
           <div ref={canvasRef} className="bg-white shadow-xl transition-all duration-300 min-h-[800px] flex flex-col relative" style={{ width: state.device === 'desktop' ? '100%' : state.device === 'tablet' ? '600px' : '375px', maxWidth: state.bodyStyles.width || '600px', backgroundColor: state.bodyStyles.backgroundColor, fontFamily: state.bodyStyles.fontFamily, color: state.bodyStyles.color, fontSize: state.bodyStyles.fontSize, lineHeight: state.bodyStyles.lineHeight }}>
              <style>{`.unlayer-canvas a { color: ${state.bodyStyles.linkColor || '#2563eb'}; } .unlayer-canvas p { margin-bottom: 1em; }`}</style>
              <div className="flex-1 py-8 px-8 min-h-full unlayer-canvas flex flex-col">
                 {state.blocks.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-300 pointer-events-none p-12 text-center h-full border-2 border-dashed border-slate-200 m-4 rounded-xl">
                       <Layout className="w-12 h-12 mb-2 mx-auto text-slate-200" />
                       <p className="text-sm font-medium text-slate-400">Drag blocks or ask AI to design for you.</p>
                    </div>
                 ) : (
                    state.blocks.map(block => renderBlockPreview(block))
                 )}
              </div>
           </div>
        </div>

        {/* Right Sidebar */}
        {!isPreview && (
            <div className="w-[350px] bg-white border-l border-slate-200 flex flex-col shrink-0 z-20 shadow-xl h-full">
            {selectedBlock ? (
                // --- Properties Panel ---
                <div className="flex flex-col h-full animate-in slide-in-from-right-10 duration-200">
                    <div className="h-12 border-b border-slate-100 flex items-center justify-between px-4 bg-slate-50/50 shrink-0">
                    <span className="font-bold text-sm text-slate-900 capitalize">{selectedBlock.type} Properties</span>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setState(prev => ({ ...prev, selectedBlockId: null }))}>
                        <X className="h-4 w-4 text-slate-500" />
                    </Button>
                    </div>
                    
                    <div className="p-5 space-y-6 overflow-y-auto flex-1 min-h-0">
                    {/* Content Settings */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Content</h4>
                            {/* AI Rewrite Actions for Text/Heading */}
                            {['text', 'heading'].includes(selectedBlock.type) && (
                                <div className="flex gap-1">
                                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0 rounded-full text-indigo-600 hover:bg-indigo-50" onClick={() => handleSmartRewrite('Professional')} title="Make Professional"><Sparkles className="h-3.5 w-3.5" /></Button>
                                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0 rounded-full text-rose-600 hover:bg-rose-50" onClick={() => handleSmartRewrite('Emotional')} title="Make Emotional"><Heart className="h-3.5 w-3.5" /></Button>
                                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0 rounded-full text-amber-600 hover:bg-amber-50" onClick={() => handleSmartRewrite('Shorten')} title="Shorten"><Minus className="h-3.5 w-3.5" /></Button>
                                    {isAiRewriting && <RefreshCcw className="h-3.5 w-3.5 animate-spin text-slate-400 ml-1" />}
                                </div>
                            )}
                            {selectedBlock.type === 'image' && (
                                <Button size="sm" variant="ghost" className="h-6 text-[10px] gap-1 text-indigo-600 bg-indigo-50 hover:bg-indigo-100" onClick={handleImageSuggestion} disabled={isAiRewriting}>
                                    {isAiRewriting ? <RefreshCcw className="h-3 w-3 animate-spin" /> : <Wand2 className="h-3 w-3" />} Suggest
                                </Button>
                            )}
                        </div>
                        
                        {['text', 'heading', 'button'].includes(selectedBlock.type) && (
                            <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                                <Label className="text-xs text-slate-600 font-semibold">Text Content</Label>
                                <div className="flex gap-1">
                                    {['{{first_name}}', '{{email}}'].map(tag => (
                                        <button key={tag} onClick={() => insertMergeTag(tag)} className="text-[9px] bg-slate-100 border border-slate-200 rounded px-1.5 py-0.5 text-slate-500 hover:text-blue-600 hover:border-blue-200 transition-colors">
                                            {tag.replace(/[{}]/g, '')}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            {selectedBlock.type === 'text' ? (
                                <textarea rows={4} className="w-full rounded-md border border-slate-300 bg-white p-2 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none shadow-sm placeholder:text-slate-400" value={selectedBlock.content.text} onChange={(e) => updateBlockContent(selectedBlock.id, 'text', e.target.value)} />
                            ) : (
                                <Input className="bg-white border-slate-300 text-slate-900 shadow-sm" value={selectedBlock.content.text} onChange={(e) => updateBlockContent(selectedBlock.id, 'text', e.target.value)} />
                            )}
                            </div>
                        )}

                        {selectedBlock.type === 'html' && (
                            <div className="space-y-1.5">
                                <Label className="text-xs text-slate-600 font-semibold">HTML Code</Label>
                                <textarea rows={8} className="w-full rounded-md border border-slate-300 bg-white p-2 text-xs font-mono text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none shadow-sm" value={selectedBlock.content.html} onChange={(e) => updateBlockContent(selectedBlock.id, 'html', e.target.value)} />
                            </div>
                        )}

                        {(selectedBlock.type === 'button' || selectedBlock.type === 'image') && (
                            <div className="space-y-1.5">
                            <Label className="text-xs text-slate-600 font-semibold">{selectedBlock.type === 'button' ? 'Link URL' : 'Image URL'}</Label>
                            <Input className="bg-white border-slate-300 text-slate-900 shadow-sm" value={selectedBlock.content.url} onChange={(e) => updateBlockContent(selectedBlock.id, 'url', e.target.value)} placeholder="https://" />
                            </div>
                        )}
                    </div>

                    <div className="h-px bg-slate-100" />

                    {/* Style Settings */}
                    <div className="space-y-4">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Styles</h4>
                        <div className="space-y-3">
                            <Label className="text-xs text-slate-600 font-semibold">Alignment</Label>
                            <div className="flex bg-slate-100 rounded-md p-1 gap-1 border border-slate-200">
                                {['left', 'center', 'right'].map((align) => (
                                <button key={align} onClick={() => updateBlockStyles(selectedBlock.id, { textAlign: align as any })} className={cn("flex-1 py-1 rounded flex items-center justify-center transition-all", selectedBlock.styles.textAlign === align ? "bg-white shadow-sm text-slate-900 font-medium" : "text-slate-500 hover:text-slate-700")}>
                                    {align === 'left' ? <AlignLeft className="w-4 h-4" /> : align === 'center' ? <AlignCenter className="w-4 h-4" /> : <AlignRight className="w-4 h-4" />}
                                </button>
                                ))}
                            </div>
                        </div>
                        {['heading', 'text'].includes(selectedBlock.type) && (
                            <ColorPicker label="Text Color" value={selectedBlock.styles.color as string} onChange={(val) => updateBlockStyles(selectedBlock.id, { color: val })} />
                        )}
                        {selectedBlock.type === 'button' && (
                            <>
                            <ColorPicker label="Background Color" value={(selectedBlock.styles as any).backgroundColor} onChange={(val) => updateBlockStyles(selectedBlock.id, { backgroundColor: val })} />
                            <ColorPicker label="Text Color" value={(selectedBlock.styles as any).color} onChange={(val) => updateBlockStyles(selectedBlock.id, { color: val })} />
                            <div className="space-y-1.5">
                                <Label className="text-xs text-slate-600 font-semibold">Border Radius</Label>
                                <Input className="h-8 text-xs bg-white" value={(selectedBlock.styles as any).borderRadius} onChange={(e) => updateBlockStyles(selectedBlock.id, { borderRadius: e.target.value })} />
                            </div>
                            </>
                        )}
                        <div className="space-y-1.5">
                            <div className="flex justify-between"><Label className="text-xs text-slate-600 font-semibold">Padding</Label><span className="text-xs text-slate-400">{selectedBlock.styles.padding}</span></div>
                            <div className="grid grid-cols-2 gap-2">
                                <Input className="h-8 text-xs bg-white border-slate-300 text-slate-900 shadow-sm" placeholder="Top/Bottom" onChange={(e) => updateBlockStyles(selectedBlock.id, { padding: `${e.target.value} ${selectedBlock.styles.padding?.toString().split(' ')[1] || '0px'}` })} />
                                <Input className="h-8 text-xs bg-white border-slate-300 text-slate-900 shadow-sm" placeholder="Left/Right" onChange={(e) => updateBlockStyles(selectedBlock.id, { padding: `${selectedBlock.styles.padding?.toString().split(' ')[0] || '0px'} ${e.target.value}` })} />
                            </div>
                        </div>
                    </div>
                    </div>
                    <div className="p-4 border-t border-slate-100 bg-slate-50/50 shrink-0">
                    <Button variant="destructive" className="w-full" onClick={() => deleteBlock(selectedBlock.id)}>Delete Block</Button>
                    </div>
                </div>
            ) : (
                // --- Standard Tabs ---
                <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col h-full min-h-0">
                    <div className="px-2 pt-2 border-b border-slate-100 bg-slate-50/50 shrink-0">
                    <TabsList className="w-full grid grid-cols-5 bg-transparent h-12">
                        <TabsTrigger value="ai" className="text-xs font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md h-9 data-[state=active]:text-indigo-600"><Sparkles className="w-4 h-4" /></TabsTrigger>
                        <TabsTrigger value="content" className="text-xs font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md h-9">Tools</TabsTrigger>
                        <TabsTrigger value="blocks" className="text-xs font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md h-9">Blocks</TabsTrigger>
                        <TabsTrigger value="templates" className="text-xs font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md h-9">Layouts</TabsTrigger>
                        <TabsTrigger value="body" className="text-xs font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md h-9">Body</TabsTrigger>
                    </TabsList>
                    </div>

                    <TabsContent value="ai" className="flex-1 overflow-y-auto p-5 m-0 min-h-0 bg-gradient-to-b from-indigo-50/50 to-white">
                        <div className="space-y-6">
                            <div className="text-center space-y-2 mb-6">
                                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto text-indigo-600 mb-2 shadow-sm border border-indigo-200">
                                    <Bot className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900">AI Designer</h3>
                                <p className="text-xs text-slate-500">Describe your campaign and let Gemini build the layout.</p>
                            </div>

                            <div className="space-y-3">
                                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Magic Layout</Label>
                                <Textarea 
                                    placeholder="e.g. A fundraising appeal for clean water in Kenya with a hero image, emotional story, and large donation button."
                                    className="min-h-[100px] resize-none bg-white border-indigo-100 focus:border-indigo-300 focus:ring-indigo-100"
                                    value={aiPrompt}
                                    onChange={(e) => setAiPrompt(e.target.value)}
                                />
                                <Button 
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-md font-semibold"
                                    onClick={handleMagicLayout}
                                    disabled={isAiGenerating || !aiPrompt.trim()}
                                >
                                    {isAiGenerating ? <><RefreshCcw className="mr-2 h-4 w-4 animate-spin" /> Designing...</> : <><Wand2 className="mr-2 h-4 w-4" /> Generate Layout</>}
                                </Button>
                            </div>

                            <div className="h-px bg-indigo-100" />

                            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
                                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                    <MessageSquarePlus className="h-4 w-4 text-emerald-500" /> Smart Refinement
                                </h4>
                                <p className="text-xs text-slate-500 leading-relaxed">
                                    Select any text block on the canvas to see AI writing tools for tone, grammar, and length.
                                </p>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="content" className="flex-1 overflow-y-auto p-4 m-0 min-h-0">
                    <div className="grid grid-cols-2 gap-3">
                        <ToolButton icon={Type} label="Text" type="text" onDragStart={handleDragStart} />
                        <ToolButton icon={ImageIcon} label="Image" type="image" onDragStart={handleDragStart} />
                        <ToolButton icon={MousePointer2} label="Button" type="button" onDragStart={handleDragStart} />
                        <ToolButton icon={Type} label="Heading" type="heading" onDragStart={handleDragStart} />
                        <ToolButton icon={Minus} label="Divider" type="divider" onDragStart={handleDragStart} />
                        <ToolButton icon={Code} label="HTML" type="html" onDragStart={handleDragStart} />
                        <ToolButton icon={Video} label="Video" type="video" onDragStart={handleDragStart} />
                    </div>
                    </TabsContent>

                    <TabsContent value="blocks" className="flex-1 overflow-y-auto p-4 m-0 space-y-4 min-h-0">
                        <div className="grid grid-cols-2 gap-3">
                            {PRESETS.map((preset) => (
                                <PresetButton key={preset.id} preset={preset} onDragStart={handlePresetDragStart} />
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="templates" className="flex-1 overflow-y-auto p-4 m-0 min-h-0">
                        <div className="space-y-4">
                            {SAVED_TEMPLATES.map((tpl) => (
                                <div key={tpl.id} className="group border border-slate-200 rounded-lg overflow-hidden hover:border-blue-300 hover:shadow-md transition-all cursor-pointer bg-white" onClick={() => loadTemplate(tpl)}>
                                    <div className={cn("h-24 relative overflow-hidden flex items-center justify-center", tpl.color || "bg-slate-100")}>
                                        <LayoutTemplate className="w-8 h-8 opacity-50 group-hover:opacity-100 transition-opacity" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                                    </div>
                                    <div className="p-3">
                                        <h4 className="font-bold text-sm text-slate-900 group-hover:text-blue-700 transition-colors">{tpl.name}</h4>
                                        <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">{tpl.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="body" className="flex-1 overflow-y-auto p-6 m-0 space-y-8 min-h-0">
                      <div className="space-y-4">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Dimensions</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                             <Label className="text-xs text-slate-600 font-semibold">Content Width</Label>
                             <span className="text-xs font-mono text-slate-500">{state.bodyStyles.width || '600px'}</span>
                          </div>
                          <Slider defaultValue={[parseInt(state.bodyStyles.width?.toString() || '600')]} max={900} min={320} step={10} onValueChange={(val) => setState(prev => ({ ...prev, bodyStyles: { ...prev.bodyStyles, width: `${val[0]}px` } }))} />
                        </div>
                        <ColorPicker label="Content Background" value={state.bodyStyles.backgroundColor as string} onChange={(val) => setState(prev => ({ ...prev, bodyStyles: { ...prev.bodyStyles, backgroundColor: val } }))} />
                      </div>
                      <div className="h-px bg-slate-100" />
                      <div className="space-y-4">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Typography</h4>
                        <div className="space-y-2">
                            <Label className="text-xs text-slate-600 font-semibold">Font Family</Label>
                            <div className="relative bg-white rounded-md">
                                <select className="w-full h-9 rounded-md border border-slate-300 text-sm pl-3 pr-8 text-slate-900 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none cursor-pointer" value={state.bodyStyles.fontFamily} style={{ backgroundColor: 'white', WebkitAppearance: 'none', appearance: 'none' }} onChange={(e) => setState(prev => ({ ...prev, bodyStyles: { ...prev.bodyStyles, fontFamily: e.target.value } }))}>
                                    <option value="Inter, sans-serif">Inter (Sans-Serif)</option>
                                    <option value="Arial, sans-serif">Arial (Sans-Serif)</option>
                                    <option value="'Times New Roman', serif">Times New Roman (Serif)</option>
                                    <option value="'Georgia', serif">Georgia (Serif)</option>
                                </select>
                                <ChevronDown className="absolute right-2.5 top-2.5 h-4 w-4 text-slate-500 pointer-events-none bg-white" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-2"><Label className="text-xs text-slate-600 font-semibold">Base Size</Label><Input className="h-9 bg-white" value={state.bodyStyles.fontSize} onChange={(e) => setState(prev => ({ ...prev, bodyStyles: { ...prev.bodyStyles, fontSize: e.target.value } }))} /></div>
                           <div className="space-y-2"><Label className="text-xs text-slate-600 font-semibold">Line Height</Label><Input className="h-9 bg-white" value={state.bodyStyles.lineHeight} onChange={(e) => setState(prev => ({ ...prev, bodyStyles: { ...prev.bodyStyles, lineHeight: e.target.value } }))} /></div>
                        </div>
                        <ColorPicker label="Text Color" value={state.bodyStyles.color as string} onChange={(val) => setState(prev => ({ ...prev, bodyStyles: { ...prev.bodyStyles, color: val } }))} />
                      </div>
                      <div className="h-px bg-slate-100" />
                      <div className="space-y-4">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Links</h4>
                        <ColorPicker label="Link Color" value={state.bodyStyles.linkColor as string} onChange={(val) => setState(prev => ({ ...prev, bodyStyles: { ...prev.bodyStyles, linkColor: val } }))} />
                      </div>
                    </TabsContent>
                </Tabs>
            )}
            </div>
        )}

      </div>
    </div>
  );
};
