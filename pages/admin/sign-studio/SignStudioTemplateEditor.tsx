
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, ZoomIn, ZoomOut, 
  Type, PenTool, Calendar, CheckSquare, 
  Hash, Trash2, Settings2,
  LayoutTemplate, Save, UploadCloud, FileText, X, AlertCircle,
  ShieldCheck, BrainCircuit, CheckCircle2, AlertTriangle
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Switch } from '../../../components/ui/Switch';
import { Label } from '../../../components/ui/Label';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { cn } from '../../../lib/utils';
import { GoogleGenAI } from "@google/genai";
import { motion, AnimatePresence } from 'framer-motion';

// --- Types ---

type FieldType = 'signature' | 'initials' | 'date' | 'text' | 'checkbox';

interface TemplateField {
  id: string;
  type: FieldType;
  x: number; // Percentage 0-100
  y: number; // Percentage 0-100
  width: number; // Percentage 0-100
  height: number; // Percentage 0-100
  recipientId: string;
  required: boolean;
  label?: string;
  placeholder?: string;
}

interface RecipientRole {
  id: string;
  name: string;
  color: string;
}

interface AuditResult {
    score: number;
    issues: string[];
    suggestions: string[];
    status: 'High Risk' | 'Medium Risk' | 'Secure';
}

// --- Constants ---

const FIELD_TYPES = [
  { type: 'signature', label: 'Signature', icon: PenTool },
  { type: 'initials', label: 'Initials', icon: Hash },
  { type: 'date', label: 'Date Signed', icon: Calendar },
  { type: 'text', label: 'Textbox', icon: Type },
  { type: 'checkbox', label: 'Checkbox', icon: CheckSquare },
] as const;

const ROLE_COLORS = [
  'bg-blue-100 border-blue-300 text-blue-800',
  'bg-emerald-100 border-emerald-300 text-emerald-800',
  'bg-amber-100 border-amber-300 text-amber-800',
  'bg-purple-100 border-purple-300 text-purple-800',
  'bg-rose-100 border-rose-300 text-rose-800',
];

// --- Main Component ---

export const SignStudioTemplateEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isNew = !id || id === 'new';
  
  // Workflow State
  const [step, setStep] = useState<'upload' | 'editor'>(isNew ? 'upload' : 'editor');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Editor Data State
  const [docTitle, setDocTitle] = useState('Untitled Template');
  const [roles, setRoles] = useState<RecipientRole[]>([
    { id: 'signer1', name: 'Signer 1', color: ROLE_COLORS[0] },
    { id: 'sender', name: 'Sender', color: ROLE_COLORS[1] },
  ]);
  const [fields, setFields] = useState<TemplateField[]>([]);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // AI Audit State
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const [showAuditPanel, setShowAuditPanel] = useState(false);

  // Dragging State
  const [dragStartInfo, setDragStartInfo] = useState<{ 
    id: string; 
    width: number; 
    height: number; 
    offsetX: number; 
    offsetY: number; 
  } | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const canvasRef = useRef<HTMLDivElement>(null);

  // --- Effects ---

  // Handle File Preview
  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setDocTitle(file.name.replace(/\.[^/.]+$/, ""));
      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  // Handle Drag Move (Global Listener for smoothness)
  useEffect(() => {
    if (!dragStartInfo) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!canvasRef.current) return;

      const rect = canvasRef.current.getBoundingClientRect();
      const canvasWidthPx = rect.width; 
      const canvasHeightPx = rect.height;

      // Calculate position relative to the canvas, adjusting for where the user grabbed the element
      let relativeX = e.clientX - rect.left - dragStartInfo.offsetX;
      let relativeY = e.clientY - rect.top - dragStartInfo.offsetY;

      // Convert field width/height from % to px for boundary checking
      const fieldWidthPx = (dragStartInfo.width / 100) * canvasWidthPx;
      const fieldHeightPx = (dragStartInfo.height / 100) * canvasHeightPx;

      // Constrain within canvas boundaries
      relativeX = Math.max(0, Math.min(relativeX, canvasWidthPx - fieldWidthPx));
      relativeY = Math.max(0, Math.min(relativeY, canvasHeightPx - fieldHeightPx));

      // Convert back to percentages
      const newXPercent = (relativeX / canvasWidthPx) * 100;
      const newYPercent = (relativeY / canvasHeightPx) * 100;

      setFields(prev => prev.map(f => 
        f.id === dragStartInfo.id ? { ...f, x: newXPercent, y: newYPercent } : f
      ));
    };

    const handleMouseUp = () => setDragStartInfo(null);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragStartInfo]); 

  // --- Handlers ---

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleFieldMouseDown = (e: React.MouseEvent, field: TemplateField) => {
    e.stopPropagation(); 
    e.preventDefault();  
    setSelectedFieldId(field.id);
    
    // Calculate offset from the top-left of the field element to the mouse pointer
    // This ensures the field doesn't "snap" to the center of the mouse when we start dragging
    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    
    setDragStartInfo({
      id: field.id,
      width: field.width,
      height: field.height,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top
    });
  };

  const handleDragStartFromSidebar = (e: React.DragEvent, type: FieldType) => {
    e.dataTransfer.setData('fieldType', type);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleCanvasDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleCanvasDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDragOver(false);
  };

  const handleCanvasDragOver = (e: React.DragEvent) => {
    e.preventDefault(); 
    e.dataTransfer.dropEffect = 'copy';
    if (!isDragOver) setIsDragOver(true);
  };

  const handleCanvasDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const type = e.dataTransfer.getData('fieldType') as FieldType;
    if (!type || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const relativeX = e.clientX - rect.left;
    const relativeY = e.clientY - rect.top;

    // Define default sizes in percentage
    const defaultWidth = type === 'checkbox' ? 5 : 20;
    const defaultHeight = type === 'checkbox' ? 3 : 5;

    // Calculate pixel dimensions for centering
    const fieldWidthPx = (defaultWidth / 100) * rect.width;
    const fieldHeightPx = (defaultHeight / 100) * rect.height;

    // Center the new field on the mouse pointer
    let xPx = relativeX - (fieldWidthPx / 2);
    let yPx = relativeY - (fieldHeightPx / 2);

    // Boundary constraints
    xPx = Math.max(0, Math.min(xPx, rect.width - fieldWidthPx));
    yPx = Math.max(0, Math.min(yPx, rect.height - fieldHeightPx));

    const newField: TemplateField = {
      id: `field_${Date.now()}`,
      type,
      x: (xPx / rect.width) * 100,
      y: (yPx / rect.height) * 100,
      width: defaultWidth,
      height: defaultHeight,
      recipientId: roles[0].id,
      required: true,
      label: type === 'text' ? 'Text Field' : undefined
    };

    setFields(prev => [...prev, newField]);
    setSelectedFieldId(newField.id);
  };

  const handleAddRole = () => {
    const newRole = {
      id: `role_${Date.now()}`,
      name: `Signer ${roles.length + 1}`,
      color: ROLE_COLORS[roles.length % ROLE_COLORS.length]
    };
    setRoles([...roles, newRole]);
  };

  const updateField = (id: string, updates: Partial<TemplateField>) => {
    setFields(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const deleteField = (id: string) => {
    setFields(prev => prev.filter(f => f.id !== id));
    if (selectedFieldId === id) setSelectedFieldId(null);
  };

  const runAiAudit = async () => {
    setIsAuditing(true);
    setShowAuditPanel(true);
    setAuditResult(null);

    try {
        const apiKey = process.env.API_KEY;
        if (!apiKey) {
            // Mock Fallback
            await new Promise(r => setTimeout(r, 2000));
            setAuditResult({
                score: 75,
                status: 'Medium Risk',
                issues: ['Missing Date field for Signer 2', 'Title is generic'],
                suggestions: ['Add a mandatory date field next to the second signature block', 'Rename template to reflect document type (e.g. NDA)']
            });
            setIsAuditing(false);
            return;
        }

        const ai = new GoogleGenAI({ apiKey });
        const context = {
            title: docTitle,
            roles: roles.map(r => r.name),
            fields: fields.map(f => ({ type: f.type, required: f.required, assignedTo: roles.find(r => r.id === f.recipientId)?.name }))
        };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Audit this document template JSON: ${JSON.stringify(context)}.
            Identify potential legal risks or structural issues (e.g. missing dates, unbalanced roles).
            Return JSON:
            {
                "score": number (0-100),
                "status": "High Risk" | "Medium Risk" | "Secure",
                "issues": string[],
                "suggestions": string[]
            }`
        });

        const text = response.text?.replace(/```json/g, '').replace(/```/g, '').trim();
        if (text) {
            setAuditResult(JSON.parse(text));
        }
    } catch (e) {
        console.error("AI Audit Error", e);
        setError("Failed to run audit.");
    } finally {
        setIsAuditing(false);
    }
  };

  const handleSave = () => {
    setError(null);

    // Validation
    if (!docTitle.trim()) {
      setError("Template title is required.");
      return;
    }

    if (fields.length === 0) {
      setError("Add at least one field to the template.");
      return;
    }

    for (const field of fields) {
      // Validate Role Assignment
      const roleExists = roles.find(r => r.id === field.recipientId);
      if (!field.recipientId || !roleExists) {
        setError("All fields must be assigned to a valid role.");
        setSelectedFieldId(field.id);
        return;
      }

      // Validate Text Fields Label
      if (field.type === 'text' && (!field.label || !field.label.trim())) {
        setError("Text fields require a descriptive label.");
        setSelectedFieldId(field.id);
        return;
      }
    }

    setIsSaving(true);
    // Simulate save
    setTimeout(() => {
      setIsSaving(false);
      navigate('/mission-control/sign-studio/templates');
    }, 1000);
  };

  const selectedField = fields.find(f => f.id === selectedFieldId);

  // --- Render Steps ---

  const renderUpload = () => (
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-50">
      <div className="max-w-xl w-full">
        <div className="text-center space-y-4 mb-8">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto text-blue-600 shadow-sm border border-slate-100">
            <LayoutTemplate className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Create New Template</h2>
          <p className="text-slate-500">Upload a PDF to start building your reusable template.</p>
        </div>

        <div 
          className="bg-white border-2 border-dashed border-slate-300 rounded-2xl p-12 text-center hover:border-blue-400 hover:bg-blue-50/50 transition-all cursor-pointer group shadow-sm"
          onClick={() => document.getElementById('template-upload')?.click()}
        >
          <input 
            id="template-upload" 
            type="file" 
            accept=".pdf" 
            className="hidden" 
            onChange={handleFileUpload}
          />
          {file ? (
            <div className="flex flex-col items-center gap-4 animate-in zoom-in-95 duration-300">
              <div className="bg-blue-100 p-4 rounded-xl text-blue-600">
                  <FileText className="w-10 h-10" />
              </div>
              <div>
                <p className="font-bold text-slate-900 text-lg">{file.name}</p>
                <p className="text-sm text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" onClick={(e) => { e.stopPropagation(); setFile(null); }}>
                  Change File
                </Button>
                <Button onClick={(e) => { e.stopPropagation(); setStep('editor'); }}>
                  Continue to Editor
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 pointer-events-none">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400 group-hover:text-blue-500 transition-colors">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700">Click to upload or drag and drop</p>
                <p className="text-xs text-slate-500 mt-1">PDF files only, up to 10MB</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderEditor = () => (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] -m-4 md:-m-8 bg-slate-50 overflow-hidden">
      
      {/* Top Bar */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-20 shadow-sm">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/mission-control/sign-studio/templates')}>
            <ArrowLeft className="h-5 w-5 text-slate-500" />
          </Button>
          <div className="flex items-center gap-2">
            <LayoutTemplate className="h-5 w-5 text-blue-600" />
            <Input 
              value={docTitle} 
              onChange={(e) => setDocTitle(e.target.value)}
              className="border-transparent hover:border-slate-200 focus:border-blue-500 font-bold text-lg h-9 px-2 w-64 transition-all bg-transparent focus:bg-white"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-3 py-1.5 rounded-full border border-red-100 animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="h-4 w-4" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2 border-purple-200 text-purple-700 bg-purple-50 hover:bg-purple-100"
            onClick={runAiAudit}
          >
            <BrainCircuit className="h-4 w-4" /> AI Audit
          </Button>

          <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setZoom(z => Math.max(50, z - 10))}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-xs font-medium w-12 text-center">{zoom}%</span>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setZoom(z => Math.min(150, z + 10))}>
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
          <Button onClick={handleSave} disabled={isSaving} className="bg-slate-900 text-white min-w-[120px] shadow-md">
            {isSaving ? <span className="animate-pulse">Saving...</span> : <><Save className="mr-2 h-4 w-4" /> Save Template</>}
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Left Sidebar: Toolbox */}
        <div className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 z-10 select-none">
          <div className="p-4 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Roles</h3>
            <div className="space-y-2">
              {roles.map(r => (
                <div key={r.id} className="flex items-center gap-2 p-2 rounded-md bg-slate-50 border border-slate-200 text-sm font-medium">
                  <div className={cn("w-3 h-3 rounded-full", r.color.replace('border', 'bg').split(' ')[0].replace('100', '500'))} />
                  <span className="truncate flex-1">{r.name}</span>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={handleAddRole} className="w-full text-xs h-8 border-dashed mt-2">
                + Add Role
              </Button>
            </div>
          </div>

          <div className="p-4 flex-1 overflow-y-auto">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Fields</h3>
            <div className="grid gap-3">
              {FIELD_TYPES.map(tool => (
                <div
                  key={tool.type}
                  draggable
                  onDragStart={(e) => handleDragStartFromSidebar(e, tool.type as FieldType)}
                  className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-all text-left group bg-white shadow-sm cursor-grab active:cursor-grabbing"
                >
                  <div className="p-2 bg-slate-100 rounded-md text-slate-600 group-hover:bg-white group-hover:text-blue-600 transition-colors">
                    <tool.icon className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium text-slate-700 group-hover:text-blue-700">{tool.label}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100 text-center">
               <LayoutTemplate className="w-8 h-8 text-blue-300 mx-auto mb-2" />
               <p className="text-xs text-blue-700 font-medium">Drag fields onto the document to place them.</p>
            </div>
          </div>
        </div>

        {/* Center: Canvas */}
        <div className="flex-1 bg-slate-100 overflow-auto p-8 flex justify-center relative">
          
          <div 
            ref={canvasRef}
            className={cn(
              "bg-white shadow-2xl transition-all duration-200 ease-out relative ring-1 ring-slate-300 select-none origin-top",
              (isDragOver || dragStartInfo) && "ring-2 ring-blue-500 bg-blue-50/30"
            )}
            style={{ 
              width: `${595 * (zoom / 100)}px`, 
              height: `${842 * (zoom / 100)}px`,
              minWidth: `${595 * (zoom / 100)}px`, 
              minHeight: `${842 * (zoom / 100)}px` 
            }}
            onClick={() => setSelectedFieldId(null)}
            onDragOver={handleCanvasDragOver}
            onDragEnter={handleCanvasDragEnter}
            onDragLeave={handleCanvasDragLeave}
            onDrop={handleCanvasDrop}
          >
            {/* Document Preview */}
            {previewUrl ? (
                <div className="absolute inset-0 z-0">
                    <iframe 
                        src={`${previewUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`} 
                        className="w-full h-full border-none overflow-hidden pointer-events-none" 
                        title="Template Preview"
                    />
                    {/* Transparent overlay to ensure drag events are captured by parent div, not iframe */}
                    <div className="absolute inset-0 bg-transparent z-10" />
                </div>
            ) : (
                <div className="absolute inset-0 p-12 flex flex-col gap-8 opacity-20 pointer-events-none select-none">
                   {/* Placeholder for when no file - should ideally be covered by upload step */}
                   <div className="h-8 w-1/3 bg-slate-900 rounded" />
                   <div className="space-y-4">
                      {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="h-2 w-full bg-slate-900 rounded" />)}
                   </div>
                </div>
            )}

            {/* Rendered Fields */}
            {fields.map(field => {
              const role = roles.find(r => r.id === field.recipientId);
              const isSelected = selectedFieldId === field.id;
              
              const baseColor = role?.color || 'bg-slate-100 border-slate-400';
              const bgColor = baseColor.replace('border', 'bg').split(' ')[0].replace('500', '100');
              const borderColor = baseColor.split(' ')[1];
              const textColor = baseColor.replace('border', 'text').split(' ')[1].replace('600', '800');

              const FieldIcon = FIELD_TYPES.find(t => t.type === field.type)?.icon || PenTool;

              return (
                <div
                  key={field.id}
                  onMouseDown={(e) => handleFieldMouseDown(e, field)}
                  className={cn(
                    "absolute border-2 rounded flex items-center justify-center text-xs font-bold uppercase tracking-wider cursor-grab active:cursor-grabbing shadow-sm transition-all select-none z-20",
                    bgColor,
                    borderColor,
                    textColor,
                    isSelected ? "ring-2 ring-blue-500 ring-offset-2 z-50 shadow-xl" : "opacity-90 hover:opacity-100 hover:shadow-md"
                  )}
                  style={{
                    left: `${field.x}%`,
                    top: `${field.y}%`,
                    width: `${field.width}%`,
                    height: `${field.height}%`
                  }}
                >
                  <div className="flex flex-col items-center gap-1 pointer-events-none">
                    <FieldIcon className="h-4 w-4 opacity-50" />
                    <span className="hidden sm:inline text-[10px]">{field.label || field.type}</span>
                    {field.required && <span className="absolute top-0 right-1 text-red-500 text-lg leading-none">*</span>}
                  </div>
                  
                  {isSelected && (
                    <button 
                      className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1 shadow-sm hover:scale-110 transition-transform z-50 pointer-events-auto"
                      onMouseDown={(e) => { e.stopPropagation(); deleteField(field.id); }}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Sidebar: AI Audit OR Properties */}
        <div className="w-80 bg-white border-l border-slate-200 flex flex-col shrink-0 z-10 shadow-xl relative">
            <AnimatePresence mode='wait'>
                {showAuditPanel ? (
                    <motion.div 
                        key="audit"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex flex-col h-full bg-slate-50"
                    >
                        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white shadow-sm">
                            <h3 className="font-bold text-sm text-purple-900 flex items-center gap-2">
                                <ShieldCheck className="h-4 w-4 text-purple-600" /> Clause Guardian
                            </h3>
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setShowAuditPanel(false)}>
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                        
                        <div className="p-6 overflow-y-auto flex-1 space-y-6">
                            {isAuditing ? (
                                <div className="flex flex-col items-center justify-center h-40 gap-4 text-purple-600">
                                    <BrainCircuit className="h-8 w-8 animate-pulse" />
                                    <p className="text-sm font-medium">Analyzing Document Structure...</p>
                                </div>
                            ) : auditResult ? (
                                <>
                                    <div className="text-center space-y-2">
                                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white border-4 border-slate-100 shadow-sm relative">
                                            <span className={cn("text-2xl font-bold", auditResult.score > 80 ? "text-emerald-600" : auditResult.score > 50 ? "text-amber-500" : "text-red-500")}>
                                                {auditResult.score}
                                            </span>
                                        </div>
                                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Security Score</p>
                                        <Badge variant="outline" className={cn("mt-1", auditResult.score > 80 ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200")}>
                                            {auditResult.status}
                                        </Badge>
                                    </div>

                                    {auditResult.issues.length > 0 && (
                                        <div className="space-y-3">
                                            <h4 className="text-xs font-bold text-red-700 uppercase tracking-wider flex items-center gap-2">
                                                <AlertTriangle className="h-3 w-3" /> Critical Issues
                                            </h4>
                                            {auditResult.issues.map((issue, i) => (
                                                <div key={i} className="bg-red-50 p-3 rounded-lg border border-red-100 text-xs text-red-800 leading-relaxed">
                                                    {issue}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {auditResult.suggestions.length > 0 && (
                                        <div className="space-y-3">
                                            <h4 className="text-xs font-bold text-blue-700 uppercase tracking-wider flex items-center gap-2">
                                                <CheckCircle2 className="h-3 w-3" /> Suggestions
                                            </h4>
                                            {auditResult.suggestions.map((sugg, i) => (
                                                <div key={i} className="bg-blue-50 p-3 rounded-lg border border-blue-100 text-xs text-blue-800 leading-relaxed">
                                                    {sugg}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </>
                            ) : null}
                        </div>
                    </motion.div>
                ) : selectedField ? (
                    <motion.div 
                        key="props"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col h-full bg-white"
                    >
                        {/* Field Properties UI (Existing Code) */}
                        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                        <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                            <Settings2 className="h-4 w-4 text-slate-500" /> Field Properties
                        </h3>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setSelectedFieldId(null)}>
                            <X className="w-4 h-4" />
                        </Button>
                        </div>
                        
                        <div className="p-4 space-y-6 flex-1 overflow-y-auto">
                        <div className="space-y-3">
                            <Label>Assigned Role</Label>
                            <Select 
                            value={selectedField.recipientId} 
                            onChange={(e) => updateField(selectedField.id, { recipientId: e.target.value })}
                            className="w-full"
                            >
                            {roles.map(r => (
                                <option key={r.id} value={r.id}>{r.name}</option>
                            ))}
                            </Select>
                        </div>

                        <div className="flex items-center justify-between p-3 border rounded-lg bg-slate-50">
                            <Label className="cursor-pointer text-sm font-medium" htmlFor="req-switch">Required</Label>
                            <Switch 
                            id="req-switch"
                            checked={selectedField.required} 
                            onCheckedChange={(c) => updateField(selectedField.id, { required: c })} 
                            />
                        </div>

                        {['text', 'checkbox'].includes(selectedField.type) && (
                            <div className="space-y-3">
                            <Label>Field Label</Label>
                            <Input 
                                value={selectedField.label || ''} 
                                onChange={(e) => updateField(selectedField.id, { label: e.target.value })} 
                                placeholder="Enter label..."
                            />
                            </div>
                        )}

                        <div className="space-y-3 pt-2 border-t border-slate-100">
                            <Label className="text-xs text-slate-500 uppercase font-bold">Dimensions</Label>
                            <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <span className="text-[10px] text-slate-400">Width %</span>
                                <Input 
                                type="number" 
                                value={Math.round(selectedField.width)} 
                                onChange={(e) => updateField(selectedField.id, { width: Number(e.target.value) })}
                                />
                            </div>
                            <div className="space-y-1">
                                <span className="text-[10px] text-slate-400">Height %</span>
                                <Input 
                                type="number" 
                                value={Math.round(selectedField.height)} 
                                onChange={(e) => updateField(selectedField.id, { height: Number(e.target.value) })}
                                />
                            </div>
                            </div>
                        </div>

                        <div className="pt-6 mt-auto">
                            <Button variant="outline" className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200" onClick={() => deleteField(selectedField.id)}>
                            <Trash2 className="w-4 h-4 mr-2" /> Delete Field
                            </Button>
                        </div>
                        </div>
                    </motion.div>
                ) : (
                    <div className="flex flex-col h-full items-center justify-center text-slate-400 p-8 text-center space-y-4">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                            <LayoutTemplate className="h-8 w-8 text-slate-300" />
                        </div>
                        <p className="text-sm">Select a field to edit properties or run an Audit.</p>
                    </div>
                )}
            </AnimatePresence>
        </div>
      </div>
    </div>
  );

  return step === 'upload' ? renderUpload() : renderEditor();
};
