
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UploadCloud, UserPlus, FileText, Send, 
  ArrowLeft, ArrowRight, X, Check, 
  PenTool, Calendar, Type, Hash, CheckSquare, 
  Trash2, GripVertical, Mail, ZoomIn, ZoomOut,
  Settings2, Layout, User, AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Label } from '../../../components/ui/Label';
import { Card, CardContent } from '../../../components/ui/Card';
import { Select } from '../../../components/ui/Select';
import { Textarea } from '../../../components/ui/Textarea';
import { Switch } from '../../../components/ui/Switch';
import { Badge } from '../../../components/ui/Badge';
import { cn } from '../../../lib/utils';

// --- Types ---

type Step = 'upload' | 'recipients' | 'prepare' | 'review';

interface Recipient {
  id: string;
  name: string;
  email: string;
  role: 'Signer' | 'CC' | 'Viewer';
  color: string;
}

type FieldType = 'signature' | 'initials' | 'date' | 'text' | 'checkbox';

interface DocField {
  id: string;
  type: FieldType;
  x: number; // Percentage 0-100
  y: number; // Percentage 0-100
  width: number; // Percentage 0-100
  height: number; // Percentage 0-100
  recipientId: string;
  required: boolean;
  label?: string;
}

// --- Constants ---

const FIELD_TYPES = [
  { type: 'signature', label: 'Signature', icon: PenTool },
  { type: 'initials', label: 'Initials', icon: Hash },
  { type: 'date', label: 'Date', icon: Calendar },
  { type: 'text', label: 'Text', icon: Type },
  { type: 'checkbox', label: 'Checkbox', icon: CheckSquare },
] as const;

const RECIPIENT_COLORS = [
  'bg-blue-100 border-blue-300 text-blue-800',
  'bg-emerald-100 border-emerald-300 text-emerald-800',
  'bg-amber-100 border-amber-300 text-amber-800',
  'bg-purple-100 border-purple-300 text-purple-800',
  'bg-rose-100 border-rose-300 text-rose-800',
];

// --- Main Component ---

export const SignStudioNewDocument = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('upload');
  
  // Data State
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const [recipients, setRecipients] = useState<Recipient[]>([
    { id: '1', name: '', email: '', role: 'Signer', color: RECIPIENT_COLORS[0] }
  ]);
  
  const [fields, setFields] = useState<DocField[]>([]);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  
  // Prepare View State
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [activeRecipientId, setActiveRecipientId] = useState<string>('1');
  const [zoom, setZoom] = useState(100);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [dragStartInfo, setDragStartInfo] = useState<{ id: string; offsetX: number; offsetY: number; width: number; height: number } | null>(null);

  // Generate Preview URL
  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  // Ensure active recipient is valid
  useEffect(() => {
    if (!recipients.find(r => r.id === activeRecipientId) && recipients.length > 0) {
      setActiveRecipientId(recipients[0].id);
    }
  }, [recipients, activeRecipientId]);

  // Keyboard delete support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedFieldId && step === 'prepare') {
        setFields(prev => prev.filter(f => f.id !== selectedFieldId));
        setSelectedFieldId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedFieldId, step]);

  // --- Step Navigation ---

  const steps: Step[] = ['upload', 'recipients', 'prepare', 'review'];
  const currentStepIdx = steps.indexOf(step);

  const canProceed = () => {
    if (step === 'upload') return !!file;
    if (step === 'recipients') return recipients.length > 0 && recipients.every(r => r.name && r.email);
    if (step === 'prepare') return fields.length > 0;
    return true;
  };

  const handleNext = () => {
    if (currentStepIdx < steps.length - 1) {
      setStep(steps[currentStepIdx + 1]);
    } else {
      handleSend();
    }
  };

  const handleBack = () => {
    if (currentStepIdx > 0) {
      setStep(steps[currentStepIdx - 1]);
    } else {
      navigate('/mission-control/sign-studio/documents');
    }
  };

  const handleSend = () => {
    setIsSending(true);
    // Simulate API call
    console.log('Sending Document:', { file, recipients, fields, emailSubject, emailMessage });
    setTimeout(() => {
      setIsSending(false);
      navigate('/mission-control/sign-studio/documents');
    }, 1500);
  };

  // --- Render Steps ---

  const renderUpload = () => (
    <div className="max-w-xl mx-auto mt-12 animate-in fade-in slide-in-from-bottom-4 duration-500 px-4">
      <div className="text-center space-y-4 mb-8">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto text-blue-600 shadow-sm border border-blue-100">
          <UploadCloud className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Upload Document</h2>
        <p className="text-slate-500">Drag and drop your PDF here to get started.</p>
      </div>

      <div 
        className="border-2 border-dashed border-slate-300 rounded-2xl p-12 text-center hover:bg-slate-50 hover:border-blue-400 transition-all cursor-pointer relative group bg-white shadow-sm"
        onClick={() => document.getElementById('file-upload')?.click()}
      >
        <input 
          id="file-upload" 
          type="file" 
          accept=".pdf,.doc,.docx" 
          className="hidden" 
          onChange={(e) => {
            if (e.target.files?.[0]) {
              setFile(e.target.files[0]);
              setEmailSubject(`Signature Request: ${e.target.files[0].name}`);
            }
          }}
        />
        {file ? (
          <div className="flex flex-col items-center gap-4 animate-in zoom-in-95 duration-300">
            <div className="bg-blue-100 p-4 rounded-xl text-blue-600 ring-4 ring-blue-50">
                <FileText className="w-10 h-10" />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-lg">{file.name}</p>
              <p className="text-sm text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            <Button variant="outline" size="sm" className="mt-2" onClick={(e) => { e.stopPropagation(); setFile(null); }}>
              Change File
            </Button>
          </div>
        ) : (
          <div className="space-y-4 pointer-events-none">
            <Button variant="secondary" className="group-hover:bg-white group-hover:shadow-md transition-all">Select File</Button>
            <p className="text-xs text-slate-400 font-medium">PDF, DOCX up to 10MB</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderRecipients = () => {
    const addRecipient = () => {
      setRecipients([...recipients, { 
        id: Date.now().toString(), 
        name: '', 
        email: '', 
        role: 'Signer',
        color: RECIPIENT_COLORS[recipients.length % RECIPIENT_COLORS.length]
      }]);
    };

    const removeRecipient = (id: string) => {
      setRecipients(recipients.filter(r => r.id !== id));
    };

    const updateRecipient = (id: string, field: keyof Recipient, value: string) => {
      setRecipients(recipients.map(r => r.id === id ? { ...r, [field]: value } : r));
    };

    return (
      <div className="max-w-3xl mx-auto mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500 px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Add Recipients</h2>
          <p className="text-slate-500">Who needs to sign or view this document?</p>
        </div>

        <Card>
          <CardContent className="p-6 space-y-4">
            {recipients.map((recipient, idx) => (
              <div key={recipient.id} className="flex gap-4 items-start group animate-in fade-in slide-in-from-bottom-2">
                <div className="pt-3 cursor-grab text-slate-300 hover:text-slate-500">
                  <GripVertical className="w-5 h-5" />
                </div>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                  <div className="md:col-span-4 space-y-1.5">
                    <Label className="text-xs text-slate-500 font-medium uppercase tracking-wider">Name</Label>
                    <div className="relative">
                        <div className={cn("absolute left-0 top-0 bottom-0 w-1.5 rounded-l-md z-10", recipient.color.replace('border', 'bg').split(' ')[0])} />
                        <Input 
                        value={recipient.name}
                        onChange={(e) => updateRecipient(recipient.id, 'name', e.target.value)}
                        placeholder="Full Name"
                        className="pl-4"
                        />
                    </div>
                  </div>
                  <div className="md:col-span-5 space-y-1.5">
                    <Label className="text-xs text-slate-500 font-medium uppercase tracking-wider">Email</Label>
                    <Input 
                      value={recipient.email}
                      onChange={(e) => updateRecipient(recipient.id, 'email', e.target.value)}
                      placeholder="email@example.com"
                    />
                  </div>
                  <div className="md:col-span-3 space-y-1.5">
                    <Label className="text-xs text-slate-500 font-medium uppercase tracking-wider">Role</Label>
                    <div className="flex gap-2">
                      <Select 
                        value={recipient.role}
                        onChange={(e) => updateRecipient(recipient.id, 'role', e.target.value as any)}
                        className="flex-1"
                      >
                        <option value="Signer">Signer</option>
                        <option value="CC">CC (View)</option>
                      </Select>
                      {recipients.length > 1 && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-slate-400 hover:text-red-500 shrink-0"
                          onClick={() => removeRecipient(recipient.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            <Button variant="outline" onClick={addRecipient} className="w-full border-dashed border-slate-300 text-slate-600 mt-2 hover:border-slate-400 hover:bg-slate-50 hover:text-slate-900">
              <UserPlus className="w-4 h-4 mr-2" /> Add Another Recipient
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderPrepare = () => {
    // --- Prepare Logic ---
    
    // Global mouse handler for smooth dragging
    useEffect(() => {
      if (!dragStartInfo) return;

      const handleMouseMove = (e: MouseEvent) => {
        if (!canvasRef.current) return;
        const rect = canvasRef.current.getBoundingClientRect();
        
        // Calculate position relative to where we grabbed the element
        let relativeX = e.clientX - rect.left - dragStartInfo.offsetX;
        let relativeY = e.clientY - rect.top - dragStartInfo.offsetY;

        const fieldWidthPx = (dragStartInfo.width / 100) * rect.width;
        const fieldHeightPx = (dragStartInfo.height / 100) * rect.height;

        // Constrain to canvas bounds
        relativeX = Math.max(0, Math.min(relativeX, rect.width - fieldWidthPx));
        relativeY = Math.max(0, Math.min(relativeY, rect.height - fieldHeightPx));

        // Convert back to percentage
        const newX = (relativeX / rect.width) * 100;
        const newY = (relativeY / rect.height) * 100;

        setFields(prev => prev.map(f => f.id === dragStartInfo.id ? { ...f, x: newX, y: newY } : f));
      };

      const handleMouseUp = () => setDragStartInfo(null);

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }, [dragStartInfo]);

    const handleFieldMouseDown = (e: React.MouseEvent, field: DocField) => {
      e.stopPropagation();
      e.preventDefault(); // Prevent default drag behavior
      setSelectedFieldId(field.id);
      
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

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      const type = e.dataTransfer.getData('fieldType') as DocField['type'];
      if (!type || !canvasRef.current) return;

      const rect = canvasRef.current.getBoundingClientRect();
      // Drop location relative to canvas
      const relativeX = e.clientX - rect.left;
      const relativeY = e.clientY - rect.top;

      // Default sizes
      const defaultW = type === 'checkbox' ? 5 : 20;
      const defaultH = type === 'checkbox' ? 3 : 5;
      
      const wPx = (defaultW / 100) * rect.width;
      const hPx = (defaultH / 100) * rect.height;

      // Center drop
      let xPx = relativeX - (wPx / 2);
      let yPx = relativeY - (hPx / 2);

      // Constraint
      xPx = Math.max(0, Math.min(xPx, rect.width - wPx));
      yPx = Math.max(0, Math.min(yPx, rect.height - hPx));

      const newField: DocField = {
        id: `field_${Date.now()}`,
        type,
        x: (xPx / rect.width) * 100,
        y: (yPx / rect.height) * 100,
        width: defaultW,
        height: defaultH,
        recipientId: activeRecipientId,
        required: true,
        label: type === 'text' ? 'Text Field' : type === 'checkbox' ? 'Checkbox' : undefined
      };

      setFields([...fields, newField]);
      setSelectedFieldId(newField.id);
    };

    const deleteField = (id: string) => {
      setFields(fields.filter(f => f.id !== id));
      if (selectedFieldId === id) setSelectedFieldId(null);
    };

    const updateField = (id: string, updates: Partial<DocField>) => {
      setFields(fields.map(f => f.id === id ? { ...f, ...updates } : f));
    };

    const selectedField = fields.find(f => f.id === selectedFieldId);

    return (
      <div className="flex flex-1 h-full overflow-hidden bg-slate-100 relative">
        
        {/* Left Sidebar: Fields */}
        <div className="w-64 bg-white border-r border-slate-200 flex flex-col z-10 shrink-0 shadow-sm">
          <div className="p-4 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Assign Fields To</h3>
            <div className="space-y-2">
              {recipients.map(r => (
                <div 
                  key={r.id} 
                  onClick={() => setActiveRecipientId(r.id)}
                  className={cn(
                    "flex items-center gap-2 p-2 rounded-md border text-sm font-medium cursor-pointer transition-all",
                    activeRecipientId === r.id 
                      ? "bg-slate-900 text-white border-slate-900 shadow-md" 
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                  )}
                >
                  <div className={cn("w-2.5 h-2.5 rounded-full shrink-0", activeRecipientId === r.id ? "bg-white" : r.color.replace('border', 'bg').split(' ')[0])} />
                  <span className="truncate">{r.name || r.email || 'Recipient'}</span>
                  {activeRecipientId === r.id && <Check className="ml-auto w-3 h-3" />}
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Tools</h3>
            <div className="grid gap-2">
              {FIELD_TYPES.map(type => (
                <div 
                  key={type.type}
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData('fieldType', type.type)}
                  className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-all cursor-grab active:cursor-grabbing bg-white shadow-sm group"
                >
                  <div className="p-1.5 bg-slate-100 rounded group-hover:bg-white group-hover:text-blue-600 transition-colors text-slate-500">
                    <type.icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium text-slate-700 group-hover:text-blue-700">{type.label}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100 text-center">
               <Layout className="w-8 h-8 text-blue-300 mx-auto mb-2" />
               <p className="text-xs text-blue-700 font-medium">Drag fields onto the document.</p>
            </div>
          </div>
        </div>

        {/* Center: Canvas */}
        <div className="flex-1 overflow-auto p-8 flex justify-center relative bg-slate-200/50">
          
          {/* Zoom Controls */}
          <div className="absolute top-4 right-4 flex items-center gap-1 bg-white p-1 rounded-lg shadow-md border border-slate-200 z-20">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setZoom(z => Math.max(50, z - 10))}><ZoomOut className="w-4 h-4" /></Button>
            <span className="text-xs font-medium w-12 text-center">{zoom}%</span>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setZoom(z => Math.min(150, z + 10))}><ZoomIn className="w-4 h-4" /></Button>
          </div>

          <div 
            ref={canvasRef}
            className="bg-white shadow-2xl transition-all duration-200 ease-out relative ring-1 ring-slate-300 select-none"
            style={{ 
              width: `${595 * (zoom / 100)}px`, 
              height: `${842 * (zoom / 100)}px`,
              minHeight: `${842 * (zoom / 100)}px`,
              minWidth: `${595 * (zoom / 100)}px`
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => setSelectedFieldId(null)}
          >
            {/* Document Preview */}
            {previewUrl ? (
                <div className="absolute inset-0 z-0">
                    <iframe 
                        src={`${previewUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`} 
                        className="w-full h-full border-none overflow-hidden" 
                        title="Document Preview"
                        scrolling="no"
                    />
                    {/* Transparent overlay to ensure drag events are captured by parent div, not iframe */}
                    <div className="absolute inset-0 bg-transparent z-10" />
                </div>
            ) : (
                <div className="absolute inset-0 p-16 flex flex-col gap-8 opacity-10 pointer-events-none select-none">
                    <div className="h-10 w-1/3 bg-slate-900 rounded mb-8" />
                    <div className="space-y-6">
                        {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="h-4 w-full bg-slate-400 rounded" />)}
                    </div>
                    <div className="mt-auto pt-12 flex justify-between">
                        <div className="h-px w-1/3 bg-slate-900" />
                        <div className="h-px w-1/3 bg-slate-900" />
                    </div>
                </div>
            )}

            {/* Rendered Fields */}
            {fields.map(field => {
              const recipient = recipients.find(r => r.id === field.recipientId);
              const isSelected = selectedFieldId === field.id;
              const FieldIcon = FIELD_TYPES.find(t => t.type === field.type)?.icon || PenTool;
              
              // Colors
              const baseColor = recipient?.color || 'bg-slate-100 border-slate-400';
              const bgColor = baseColor.replace('border', 'bg').split(' ')[0].replace('500', '100');
              const borderColor = baseColor.split(' ')[1];
              const textColor = baseColor.replace('border', 'text').split(' ')[1].replace('600', '800');

              return (
                <div
                  key={field.id}
                  onMouseDown={(e) => handleFieldMouseDown(e, field)}
                  className={cn(
                    "absolute border-2 rounded flex items-center justify-center text-xs font-bold uppercase tracking-wider cursor-grab active:cursor-grabbing select-none transition-all z-20",
                    bgColor,
                    borderColor,
                    textColor,
                    isSelected ? "ring-2 ring-blue-500 ring-offset-2 shadow-xl z-50 scale-105" : "opacity-90 hover:opacity-100 hover:shadow-md"
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

        {/* Right Sidebar: Properties */}
        {selectedField ? (
          <div className="w-72 bg-white border-l border-slate-200 flex flex-col z-10 shrink-0 shadow-xl animate-in slide-in-from-right-10 duration-200">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                 <Settings2 className="h-4 w-4 text-slate-500" /> Field Settings
              </h3>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setSelectedFieldId(null)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="p-4 space-y-6 flex-1 overflow-y-auto">
              <div className="space-y-3">
                <Label>Assigned To</Label>
                <Select 
                  value={selectedField.recipientId} 
                  onChange={(e) => updateField(selectedField.id, { recipientId: e.target.value })}
                  className="w-full"
                >
                  {recipients.map(r => (
                    <option key={r.id} value={r.id}>{r.name || r.email || 'Recipient'}</option>
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
          </div>
        ) : (
            <div className="w-16 bg-white border-l border-slate-200 flex flex-col items-center py-4 gap-4 z-10 shrink-0">
               <div className="w-full h-px bg-slate-100" />
            </div>
        )}
      </div>
    );
  };

  const renderReview = () => (
    <div className="max-w-3xl mx-auto mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500 px-4">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Review & Send</h2>
        <p className="text-slate-500">Double check everything before sending.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 shadow-sm border-slate-200">
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <Label className="text-slate-700 font-semibold">Email Subject</Label>
              <Input 
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                placeholder="Please sign: Document Name"
                className="font-medium"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-700 font-semibold">Email Message</Label>
              <Textarea 
                value={emailMessage}
                onChange={(e) => setEmailMessage(e.target.value)}
                placeholder="Enter a message to all recipients..."
                className="min-h-[150px] resize-none"
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
            <Card className="shadow-sm border-slate-200 bg-slate-50/50">
            <CardContent className="p-5">
                <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">Summary</h3>
                <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                    <span className="text-slate-500">Document</span>
                    <span className="font-medium text-slate-900 truncate max-w-[120px]" title={file?.name}>{file?.name}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-slate-500">Recipients</span>
                    <span className="font-medium text-slate-900">{recipients.length}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-slate-500">Fields Placed</span>
                    <span className="font-medium text-slate-900">{fields.length}</span>
                </div>
                </div>
            </CardContent>
            </Card>
            
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <p className="text-xs text-blue-800 leading-relaxed">
                    Recipients will receive an email with a secure link to sign. You will be notified when they view and sign the document.
                </p>
            </div>
        </div>
      </div>
      
      <div className="mt-8">
        <h4 className="text-sm font-bold text-slate-900 mb-4 px-1">Recipient Status</h4>
        <div className="space-y-2">
            {recipients.map(r => {
                const fieldCount = fields.filter(f => f.recipientId === r.id).length;
                return (
                    <div key={r.id} className="flex items-center justify-between text-sm bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className={cn("w-3 h-3 rounded-full shadow-sm ring-1 ring-slate-100", r.color.replace('border', 'bg').split(' ')[0])} />
                            <div>
                                <span className="font-bold text-slate-800 block leading-none">{r.name}</span>
                                <span className="text-slate-400 text-xs">{r.email}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200 font-medium">
                                {r.role}
                            </Badge>
                            {fieldCount === 0 && r.role === 'Signer' ? (
                                <Badge variant="destructive" className="gap-1"><AlertCircle className="w-3 h-3" /> No Fields</Badge>
                            ) : (
                                <span className="text-xs text-slate-500 font-medium bg-slate-100 px-2 py-1 rounded-full">{fieldCount} Fields</span>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] -m-4 md:-m-8 bg-slate-50">
      
      {/* Top Bar */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-20 shadow-sm">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/mission-control/sign-studio/documents')} className="rounded-full hover:bg-slate-100">
            <X className="h-5 w-5 text-slate-500" />
          </Button>
          <div className="h-6 w-px bg-slate-200" />
          <h1 className="font-bold text-slate-900 text-lg tracking-tight">New Document</h1>
        </div>

        {/* Stepper */}
        <div className="hidden md:flex items-center gap-2">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center">
              <div className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-all shadow-sm",
                currentStepIdx > i ? "bg-emerald-500 text-white" : 
                currentStepIdx === i ? "bg-slate-900 text-white scale-110" : "bg-white border border-slate-200 text-slate-400"
              )}>
                {currentStepIdx > i ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <span className={cn(
                "ml-2 text-sm font-medium capitalize transition-colors",
                currentStepIdx === i ? "text-slate-900" : "text-slate-400"
              )}>
                {s}
              </span>
              {i < steps.length - 1 && (
                <div className={cn("w-12 h-px mx-4 transition-colors", currentStepIdx > i ? "bg-emerald-500" : "bg-slate-200")} />
              )}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={handleBack} disabled={currentStepIdx === 0} className="text-slate-500 hover:text-slate-900">
            Back
          </Button>
          <Button 
            onClick={handleNext} 
            disabled={!canProceed() || isSending}
            className={cn("min-w-[120px] shadow-md font-semibold transition-all", step === 'review' ? "bg-blue-600 hover:bg-blue-700 hover:shadow-lg" : "bg-slate-900 hover:bg-slate-800")}
          >
            {step === 'review' ? (
                isSending ? 'Sending...' : <><Send className="w-4 h-4 mr-2" /> Send</>
            ) : (
                <><span className="mr-2">Next Step</span> <ArrowRight className="w-4 h-4" /></>
            )}
          </Button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden bg-slate-50/50 flex flex-col relative">
        {step === 'upload' && renderUpload()}
        {step === 'recipients' && renderRecipients()}
        {step === 'prepare' && renderPrepare()}
        {step === 'review' && renderReview()}
      </div>

    </div>
  );
};
