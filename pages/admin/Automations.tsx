
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Zap, Play, Plus, X, Save, 
  MoreHorizontal, ArrowRight, Layout, 
  MessageSquare, Mail, Slack, CreditCard, 
  Users, AlertCircle, CheckCircle2, Clock, 
  MousePointer2, Settings, Trash2, 
  Bot, Sparkles, Loader2, Terminal, 
  Database, RefreshCcw, Box, Layers,
  Code2, PauseCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI } from "@google/genai";
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ScrollArea } from '../../components/ui/ScrollArea';
import { Input } from '../../components/ui/Input';
import { cn } from '../../lib/utils';

// --- TYPES ---

type NodeType = 'trigger' | 'action' | 'condition' | 'delay';
type NodeStatus = 'idle' | 'running' | 'success' | 'error';

interface NodeData {
  id: string;
  type: NodeType;
  label: string;
  icon: string; 
  description?: string;
  config: Record<string, any>;
  position: { x: number; y: number };
  status: NodeStatus;
  outputData?: Record<string, any>; // The simulated data this node produces
}

interface Edge {
  id: string;
  source: string;
  target: string;
}

interface Workflow {
  id: string;
  name: string;
  nodes: NodeData[];
  edges: Edge[];
}

interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

// --- CONSTANTS ---

const NODE_CONFIGS: Record<string, { icon: any, color: string, ring: string }> = {
  trigger: { icon: Zap, color: 'bg-amber-100 text-amber-700', ring: 'ring-amber-200' },
  action: { icon: Box, color: 'bg-blue-100 text-blue-700', ring: 'ring-blue-200' },
  condition: { icon: ArrowRight, color: 'bg-purple-100 text-purple-700', ring: 'ring-purple-200' },
  delay: { icon: Clock, color: 'bg-slate-100 text-slate-700', ring: 'ring-slate-200' },
  stripe: { icon: CreditCard, color: 'bg-indigo-100 text-indigo-700', ring: 'ring-indigo-200' },
  slack: { icon: Slack, color: 'bg-rose-100 text-rose-700', ring: 'ring-rose-200' },
  mail: { icon: Mail, color: 'bg-sky-100 text-sky-700', ring: 'ring-sky-200' },
  crm: { icon: Users, color: 'bg-emerald-100 text-emerald-700', ring: 'ring-emerald-200' },
};

const INITIAL_WORKFLOW: Workflow = {
  id: 'wf-1',
  name: 'High Value Donor Alert',
  nodes: [
    { id: 'n1', type: 'trigger', label: 'New Donation', icon: 'stripe', description: 'Source: Stripe API', config: {}, position: { x: 350, y: 50 }, status: 'idle' },
    { id: 'n2', type: 'condition', label: 'Check Amount', icon: 'condition', description: 'Amount > $500', config: { threshold: 500 }, position: { x: 350, y: 200 }, status: 'idle' },
    { id: 'n3', type: 'action', label: 'Slack Team', icon: 'slack', description: 'Channel: #major-donors', config: { channel: '#major-donors' }, position: { x: 200, y: 400 }, status: 'idle' },
    { id: 'n4', type: 'action', label: 'Email Director', icon: 'mail', description: 'Template: vip_alert', config: { recipient: 'director@givehope.org' }, position: { x: 500, y: 400 }, status: 'idle' },
    { id: 'n5', type: 'action', label: 'Update CRM', icon: 'crm', description: 'Add Tag: VIP', config: { tag: 'VIP' }, position: { x: 350, y: 550 }, status: 'idle' }
  ],
  edges: [
    { id: 'e1', source: 'n1', target: 'n2' },
    { id: 'e2', source: 'n2', target: 'n3' }, 
    { id: 'e3', source: 'n2', target: 'n4' },
    { id: 'e4', source: 'n3', target: 'n5' },
    { id: 'e5', source: 'n4', target: 'n5' }
  ]
};

// --- COMPONENTS ---

interface NodeComponentProps {
  data: NodeData;
  isSelected: boolean;
  onMouseDown: (e: React.MouseEvent, id: string) => void;
  onClick: (id: string) => void;
}

const NodeComponent: React.FC<NodeComponentProps> = ({ 
  data, 
  isSelected, 
  onMouseDown,
  onClick
}) => {
  const config = NODE_CONFIGS[data.icon] || NODE_CONFIGS[data.type] || NODE_CONFIGS.action;
  const Icon = config.icon;
  
  return (
    <div
      className={cn(
        "absolute w-64 rounded-2xl border-2 bg-white transition-all duration-200 group z-10",
        isSelected ? `border-slate-900 shadow-xl scale-105 z-20` : "border-slate-200 shadow-md hover:border-slate-300",
        data.status === 'running' && "ring-4 ring-blue-500/20 border-blue-500",
        data.status === 'success' && "border-emerald-500 ring-4 ring-emerald-500/20",
        data.status === 'error' && "border-red-500"
      )}
      style={{ 
        transform: `translate(${data.position.x}px, ${data.position.y}px)`,
        cursor: 'grab'
      }}
      onMouseDown={(e) => onMouseDown(e, data.id)}
      onClick={(e) => { e.stopPropagation(); onClick(data.id); }}
    >
      {/* Input Port */}
      {data.type !== 'trigger' && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-4 border-slate-300 rounded-full z-[-1]" />
      )}

      <div className="p-3 flex items-start gap-3">
        <div className={cn("p-2.5 rounded-xl shrink-0 transition-colors", config.color)}>
          {data.status === 'running' ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Icon className="w-5 h-5" />
          )}
        </div>
        <div className="flex-1 min-w-0 pt-0.5">
          <div className="flex justify-between items-center mb-0.5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{data.type}</span>
            {data.status === 'success' && <CheckCircle2 className="w-3 h-3 text-emerald-500" />}
          </div>
          <h3 className="text-sm font-bold text-slate-900 truncate">{data.label}</h3>
          <p className="text-xs text-slate-500 truncate">{data.description}</p>
        </div>
      </div>

      {/* Live Data Preview Overlay */}
      {data.status === 'success' && data.outputData && isSelected && (
        <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-full left-0 right-0 mt-2 bg-slate-900 text-slate-200 p-3 rounded-xl text-[10px] font-mono shadow-xl z-50 pointer-events-none"
        >
            <div className="text-emerald-400 font-bold mb-1 flex items-center gap-1">
                <Database className="w-3 h-3" /> Output Payload
            </div>
            <pre className="overflow-hidden text-ellipsis">
                {JSON.stringify(data.outputData, null, 2).substring(0, 150)}...
            </pre>
        </motion.div>
      )}

      {/* Output Port */}
      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-4 border-slate-300 rounded-full z-[-1]" />
    </div>
  );
};

// SVG Connection Layer
const Connections = ({ edges, nodes, activeEdges }: { edges: Edge[], nodes: NodeData[], activeEdges: string[] }) => {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
      <defs>
        <marker id="arrow" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
          <path d="M0,0 L0,10 L10,5 z" fill="#cbd5e1" />
        </marker>
        <linearGradient id="gradient-flow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
      {edges.map(edge => {
        const source = nodes.find(n => n.id === edge.source);
        const target = nodes.find(n => n.id === edge.target);
        if (!source || !target) return null;

        const startX = source.position.x + 128; // Center of 256px width
        const startY = source.position.y + 80; // Bottom of node
        const endX = target.position.x + 128;
        const endY = target.position.y; // Top of node

        const controlY = Math.abs(endY - startY) / 2;
        const path = `M ${startX} ${startY} C ${startX} ${startY + controlY}, ${endX} ${endY - controlY}, ${endX} ${endY}`;
        const isActive = activeEdges.includes(edge.id);

        return (
          <g key={edge.id}>
            <path
              d={path}
              fill="none"
              stroke={isActive ? "url(#gradient-flow)" : "#cbd5e1"}
              strokeWidth={isActive ? 3 : 2}
              strokeDasharray={isActive ? "10,5" : "0"}
              className="transition-all duration-300"
            />
            {isActive && (
               <circle r="4" fill="#3b82f6">
                  <animateMotion dur="1.5s" repeatCount="indefinite" path={path} />
               </circle>
            )}
          </g>
        );
      })}
    </svg>
  );
};

// --- MAIN PAGE ---

export const Automations = () => {
  const [workflow, setWorkflow] = useState<Workflow>(INITIAL_WORKFLOW);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isAiOpen, setIsAiOpen] = useState(true);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'ai', text: "I'm Gemini, your workflow architect. Describe a process, and I'll build it.", timestamp: new Date() }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [activeEdges, setActiveEdges] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [executionLogs, setExecutionLogs] = useState<string[]>([]);

  // Dragging State
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // --- NODE DRAGGING ---
  
  const handleMouseDownNode = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setDraggingNodeId(id);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (draggingNodeId) {
        setWorkflow(prev => ({
            ...prev,
            nodes: prev.nodes.map(n => {
                if (n.id === draggingNodeId) {
                    return { ...n, position: { x: n.position.x + e.movementX / zoom, y: n.position.y + e.movementY / zoom } };
                }
                return n;
            })
        }));
    } else if (e.buttons === 1 && canvasRef.current && e.target === canvasRef.current) {
        // Pan Canvas
        setPan(p => ({ x: p.x + e.movementX, y: p.y + e.movementY }));
    }
  }, [draggingNodeId, zoom]);

  const handleMouseUp = () => {
    setDraggingNodeId(null);
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // --- GEMINI AI ---

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    const text = chatInput;
    setChatInput('');
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', text, timestamp: new Date() }]);
    setIsTyping(true);

    try {
        const apiKey = process.env.API_KEY;
        if (!apiKey) {
            await new Promise(r => setTimeout(r, 1500));
            setMessages(prev => [...prev, { id: Date.now().toString(), role: 'ai', text: "I'm in demo mode. Try 'Add a text message action after Slack' or 'Run test'.", timestamp: new Date() }]);
            setIsTyping(false);
            return;
        }

        const ai = new GoogleGenAI({ apiKey });
        const systemPrompt = `
            You are a Workflow Architect. Modifying this JSON graph:
            ${JSON.stringify(workflow)}
            
            User request: "${text}"
            
            Return a JSON object with:
            1. 'message': text response
            2. 'workflow': the FULL updated workflow JSON (optional, only if changed)
            
            Rules:
            - Auto-calculate node positions (x,y) to keep it tree-like.
            - Use valid node types: trigger, action, condition, delay.
            - Icons: zap, mail, slack, credit-card, users, arrow-right, clock.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: systemPrompt,
            config: { responseMimeType: "application/json" }
        });

        const data = JSON.parse(response.text || "{}");
        
        if (data.workflow) {
            setWorkflow(data.workflow);
        }
        
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'ai', text: data.message || "Updated workflow.", timestamp: new Date() }]);

    } catch (e) {
        console.error(e);
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'ai', text: "Error connecting to architect.", timestamp: new Date() }]);
    } finally {
        setIsTyping(false);
    }
  };

  // --- SIMULATION ENGINE ---

  const runSimulation = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setExecutionLogs([]);
    setActiveEdges([]);
    
    // Reset nodes
    setWorkflow(prev => ({
        ...prev,
        nodes: prev.nodes.map(n => ({ ...n, status: 'idle', outputData: undefined }))
    }));

    const addLog = (text: string) => setExecutionLogs(prev => [...prev, `[${new Date().toLocaleTimeString().split(' ')[0]}] ${text}`]);
    addLog("Initializing runtime environment...");
    
    await new Promise(r => setTimeout(r, 800));

    // Simple BFS simulation
    const queue = [workflow.nodes[0]];
    const visited = new Set<string>();

    // Mock initial payload with explicit type to allow dynamic properties
    let payload: Record<string, any> = {
        event: 'charge.succeeded',
        amount: 1250,
        currency: 'usd',
        donor: { email: 'alice@example.com', name: 'Alice', id: 'cus_123' }
    };

    while (queue.length > 0) {
        const currentNode = queue.shift();
        if (!currentNode || visited.has(currentNode.id)) continue;
        visited.add(currentNode.id);

        // 1. Set Running
        setWorkflow(prev => ({
            ...prev,
            nodes: prev.nodes.map(n => n.id === currentNode.id ? { ...n, status: 'running' } : n)
        }));
        addLog(`Executing Node: ${currentNode.label}...`);
        
        // 2. Simulate Processing Delay & Data Transformation
        await new Promise(r => setTimeout(r, 1200));
        
        // Transform Payload based on node type
        if (currentNode.type === 'condition') {
            payload = { ...payload, checkPassed: true };
            addLog(`Condition evaluated: True (Amount > 500)`);
        } else if (currentNode.type === 'action') {
            payload = { ...payload, actionResult: 'success', timestamp: Date.now() };
            addLog(`Action executed successfully.`);
        }

        // 3. Set Success & Payload
        setWorkflow(prev => ({
            ...prev,
            nodes: prev.nodes.map(n => n.id === currentNode.id ? { ...n, status: 'success', outputData: { ...payload } } : n)
        }));

        // 4. Activate Edges & Queue Next
        const outgoingEdges = workflow.edges.filter(e => e.source === currentNode.id);
        const edgeIds = outgoingEdges.map(e => e.id);
        
        if (edgeIds.length > 0) {
            setActiveEdges(prev => [...prev, ...edgeIds]);
            // Wait for particle animation travel time
            await new Promise(r => setTimeout(r, 1000));
            
            outgoingEdges.forEach(edge => {
                const nextNode = workflow.nodes.find(n => n.id === edge.target);
                if (nextNode) queue.push(nextNode);
            });
        }
    }

    addLog("Workflow run completed.");
    setIsRunning(false);
    setTimeout(() => setActiveEdges([]), 2000);
  };

  const selectedNode = workflow.nodes.find(n => n.id === selectedNodeId);

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] -m-4 md:-m-8 bg-slate-50 font-sans overflow-hidden">
      
      {/* HEADER */}
      <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-30 shadow-sm">
        <div className="flex items-center gap-3">
            <div className="bg-slate-900 p-1.5 rounded-lg text-white">
                <Zap className="w-4 h-4" />
            </div>
            <h1 className="font-bold text-slate-900 flex items-center gap-2">
                {workflow.name}
                <Badge variant="outline" className="font-normal text-slate-500 bg-slate-50">Draft</Badge>
            </h1>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="bg-white" onClick={() => setWorkflow(INITIAL_WORKFLOW)}>
                <RefreshCcw className="mr-2 h-3.5 w-3.5" /> Reset
            </Button>
            <Button 
                onClick={runSimulation}
                disabled={isRunning}
                className={cn("shadow-md transition-all font-semibold", isRunning ? "bg-slate-100 text-slate-400" : "bg-emerald-600 hover:bg-emerald-700 text-white")}
            >
                {isRunning ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4 fill-current" />}
                {isRunning ? "Running..." : "Run Test"}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setIsAiOpen(!isAiOpen)} className={cn(isAiOpen && "bg-slate-100")}>
                <Layout className="h-5 w-5 text-slate-600" />
            </Button>
        </div>
      </header>

      {/* WORKSPACE */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* CANVAS */}
        <div 
            ref={canvasRef}
            className="flex-1 bg-slate-50 relative overflow-hidden cursor-grab active:cursor-grabbing"
            style={{ 
                backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', 
                backgroundSize: `${24 * zoom}px ${24 * zoom}px`,
                backgroundPosition: `${pan.x}px ${pan.y}px`
            }}
            onClick={() => setSelectedNodeId(null)}
        >
            <div 
                style={{ 
                    transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, 
                    transformOrigin: '0 0',
                    width: '100%', 
                    height: '100%' 
                }}
            >
                <Connections edges={workflow.edges} nodes={workflow.nodes} activeEdges={activeEdges} />
                {workflow.nodes.map(node => (
                    <NodeComponent 
                        key={node.id} 
                        data={node} 
                        isSelected={selectedNodeId === node.id}
                        onMouseDown={handleMouseDownNode}
                        onClick={setSelectedNodeId}
                    />
                ))}
            </div>

            {/* LIVE LOGS OVERLAY */}
            <AnimatePresence>
                {executionLogs.length > 0 && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="absolute bottom-6 left-6 w-96 bg-slate-900/90 backdrop-blur-md rounded-xl shadow-2xl border border-slate-800 text-slate-300 font-mono text-xs overflow-hidden flex flex-col max-h-64 pointer-events-auto"
                    >
                        <div className="flex items-center justify-between px-4 py-2 border-b border-slate-700 bg-slate-950/50">
                            <span className="flex items-center gap-2 font-bold text-emerald-400"><Terminal className="w-3 h-3" /> System Console</span>
                            <button onClick={() => setExecutionLogs([])}><X className="w-3 h-3 hover:text-white" /></button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-1.5">
                            {executionLogs.map((log, i) => (
                                <div key={i}>{log}</div>
                            ))}
                            <div ref={node => node?.scrollIntoView({ behavior: 'smooth' })} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

        {/* SIDEBAR */}
        <AnimatePresence>
            {isAiOpen && (
                <motion.div 
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 400, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    className="border-l border-slate-200 bg-white shadow-xl z-20 flex flex-col"
                >
                    {/* Mode Toggle Header */}
                    <div className="h-12 border-b border-slate-100 flex items-center justify-between px-4 bg-slate-50/50">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                            {selectedNode ? 'Node Inspector' : 'Gemini Architect'}
                        </span>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsAiOpen(false)}>
                            <X className="w-4 h-4" />
                        </Button>
                    </div>

                    {selectedNode ? (
                        /* INSPECTOR MODE */
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase">Label</label>
                                    <Input 
                                        value={selectedNode.label} 
                                        onChange={(e) => {
                                            setWorkflow(prev => ({
                                                ...prev,
                                                nodes: prev.nodes.map(n => n.id === selectedNode.id ? { ...n, label: e.target.value } : n)
                                            }))
                                        }}
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase">Description</label>
                                    <Input 
                                        value={selectedNode.description} 
                                        onChange={(e) => {
                                            setWorkflow(prev => ({
                                                ...prev,
                                                nodes: prev.nodes.map(n => n.id === selectedNode.id ? { ...n, description: e.target.value } : n)
                                            }))
                                        }}
                                        className="mt-1"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-bold text-slate-500 uppercase">Configuration</label>
                                <div className="bg-slate-50 rounded-lg border border-slate-200 p-4 space-y-3">
                                    {Object.entries(selectedNode.config).map(([k, v]) => (
                                        <div key={k}>
                                            <span className="text-xs text-slate-500 font-mono block mb-1">{k}</span>
                                            <Input defaultValue={v} className="h-8 bg-white" />
                                        </div>
                                    ))}
                                    {Object.keys(selectedNode.config).length === 0 && (
                                        <p className="text-xs text-slate-400 italic">No configuration options.</p>
                                    )}
                                </div>
                            </div>

                            <Button 
                                variant="destructive" 
                                className="w-full mt-4"
                                onClick={() => {
                                    setWorkflow(prev => ({
                                        ...prev,
                                        nodes: prev.nodes.filter(n => n.id !== selectedNode.id),
                                        edges: prev.edges.filter(e => e.source !== selectedNode.id && e.target !== selectedNode.id)
                                    }));
                                    setSelectedNodeId(null);
                                }}
                            >
                                <Trash2 className="mr-2 h-4 w-4" /> Delete Node
                            </Button>
                        </div>
                    ) : (
                        /* CHAT MODE */
                        <div className="flex flex-col h-full">
                            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30">
                                {messages.map(msg => (
                                    <div key={msg.id} className={cn("flex gap-3", msg.role === 'user' ? "flex-row-reverse" : "")}>
                                        <div className={cn(
                                            "w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm border",
                                            msg.role === 'ai' ? "bg-white border-indigo-100" : "bg-slate-900 border-slate-900 text-white"
                                        )}>
                                            {msg.role === 'ai' ? <Sparkles className="w-4 h-4 text-indigo-600" /> : <div className="text-[10px] font-bold">YOU</div>}
                                        </div>
                                        <div className={cn(
                                            "p-3 rounded-2xl text-sm shadow-sm max-w-[85%]",
                                            msg.role === 'ai' ? "bg-white border border-slate-100 text-slate-600" : "bg-indigo-600 text-white"
                                        )}>
                                            {msg.text}
                                        </div>
                                    </div>
                                ))}
                                <div ref={chatEndRef} />
                            </div>
                            <div className="p-4 bg-white border-t border-slate-100">
                                <div className="relative">
                                    <Input 
                                        placeholder="Ask Gemini to change the workflow..." 
                                        className="pr-10 h-11 shadow-sm bg-slate-50 focus:bg-white transition-all"
                                        value={chatInput}
                                        onChange={(e) => setChatInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                        disabled={isTyping}
                                    />
                                    <button 
                                        onClick={handleSendMessage}
                                        disabled={!chatInput.trim() || isTyping}
                                        className="absolute right-1 top-1 w-9 h-9 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center transition-colors disabled:opacity-50"
                                    >
                                        {isTyping ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                                    </button>
                                </div>
                                <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar pb-1">
                                    {['Add delay after trigger', 'Send Slack on failure', 'Optimize logic'].map(txt => (
                                        <button 
                                            key={txt} 
                                            onClick={() => setChatInput(txt)}
                                            className="whitespace-nowrap px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-medium transition-colors"
                                        >
                                            {txt}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>

      </div>
    </div>
  );
};
