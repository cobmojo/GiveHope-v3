
import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { ScrollArea } from '../ui/ScrollArea';
import { Avatar, AvatarFallback } from '../ui/Avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/Tooltip';
import { 
  Sparkles, Send, ArrowRight, Minus, User, Minimize2
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

// --- Mock Data for AI Context ---
const MOCK_DONOR_CONTEXT = {
  name: "John Doe",
  email: "john.doe@example.com",
  totalGivenYTD: 12500,
  taxReceiptsAvailable: [2023, 2022, 2021],
  impactSummary: "45,000 Gallons of Clean Water provided, 8 Students funded.",
  recentTransactions: [
    { date: "2024-10-24", amount: 100, recipient: "The Miller Family", type: "Recurring" },
    { date: "2024-09-12", amount: 500, recipient: "Clean Water Initiative", type: "One-Time" }
  ]
};

const SUGGESTED_QUESTIONS = [
  "How much have I given this year?",
  "Where can I find my tax receipt?",
  "Tell me about my impact.",
  "Suggest a new fund to support."
];

interface Message {
  id: string;
  role: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

export const GivingAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 'welcome', 
      role: 'ai', 
      text: "Hi John! I'm your Giving Assistant. I can help with donation details, tax receipts, or finding new ways to make an impact. How can I serve you today?", 
      timestamp: new Date() 
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  // Refs for scrolling and focus
  const scrollViewportRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Robust scrolling logic using layout effect to catch DOM updates immediately
  useLayoutEffect(() => {
    if (scrollViewportRef.current) {
        scrollViewportRef.current.scrollTop = scrollViewportRef.current.scrollHeight;
    }
  }, [messages, isTyping, isOpen]);

  const handleSendMessage = async (text: string = inputValue) => {
    if (!text.trim()) return;

    const newUserMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMsg]);
    setInputValue("");
    setIsTyping(true);

    try {
      const apiKey = process.env.API_KEY;
      if (!apiKey) {
        // Mock Response for Demo
        setTimeout(() => {
          setMessages(prev => [...prev, {
            id: Date.now().toString(),
            role: 'ai',
            text: "I'm running in demo mode. If connected to Gemini, I would analyze your specific giving history to answer that.",
            timestamp: new Date()
          }]);
          setIsTyping(false);
        }, 1200);
        return;
      }

      const ai = new GoogleGenAI({ apiKey });
      const systemPrompt = `
        You are a warm, professional "Giving Assistant" for GiveHope.
        Context: ${JSON.stringify(MOCK_DONOR_CONTEXT)}
        Goal: Answer donor questions concisely using the context.
        Tone: Grateful, transparent.
      `;

      const history = messages.slice(-6).map(m => `${m.role}: ${m.text}`).join('\n');
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `${systemPrompt}\n\nHistory:\n${history}\nUser: ${text}\nAI:`
      });

      const aiText = response.text || "I'm having trouble connecting right now.";

      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'ai',
        text: aiText,
        timestamp: new Date()
      }]);

    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'ai',
        text: "I apologize, but I'm having trouble retrieving that information right now.",
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <TooltipProvider>
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4 font-sans pointer-events-none">
        
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95, transformOrigin: "bottom right" }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="pointer-events-auto w-full max-w-[380px] bg-background border border-border/50 shadow-2xl rounded-2xl overflow-hidden flex flex-col h-[600px] max-h-[80vh] ring-1 ring-black/5"
            >
              {/* Header */}
              <div className="bg-slate-950 p-4 flex items-center justify-between shrink-0 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-950 z-0" />
                <div className="flex items-center gap-3 relative z-10">
                  <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20 shadow-inner backdrop-blur-sm">
                    <Sparkles className="h-5 w-5 text-white fill-white/20" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm leading-tight">Giving Assistant</h3>
                    <div className="flex items-center gap-1.5">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      <span className="text-[10px] text-slate-300 font-medium">Online</span>
                    </div>
                  </div>
                </div>
                
                <div className="relative z-10">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setIsOpen(false)} 
                    className="h-8 w-8 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                  >
                    <Minimize2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Chat Area */}
              <div className="flex-1 overflow-hidden bg-slate-50/50 relative">
                <ScrollArea className="h-full">
                  <div ref={scrollViewportRef} className="flex flex-col gap-4 p-4 min-h-full">
                    <div className="text-center text-[10px] text-muted-foreground uppercase tracking-widest font-semibold py-2 opacity-50">
                      Today
                    </div>
                    
                    {messages.map((msg) => (
                      <motion.div 
                        key={msg.id} 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn(
                          "flex gap-3 max-w-[90%]",
                          msg.role === 'user' ? "self-end flex-row-reverse" : "self-start"
                        )}
                      >
                        <Avatar className={cn(
                          "h-8 w-8 shadow-sm border",
                          msg.role === 'ai' ? "bg-white border-slate-100" : "bg-slate-900 border-slate-900"
                        )}>
                          {msg.role === 'ai' ? (
                            <AvatarFallback className="bg-transparent"><Sparkles className="h-4 w-4 text-blue-600" /></AvatarFallback>
                          ) : (
                            <AvatarFallback className="bg-slate-900 text-white"><User className="h-4 w-4" /></AvatarFallback>
                          )}
                        </Avatar>
                        
                        <div className={cn(
                          "flex flex-col gap-1",
                          msg.role === 'user' ? "items-end" : "items-start"
                        )}>
                          <div className={cn(
                            "px-4 py-2.5 text-sm shadow-sm leading-relaxed",
                            msg.role === 'user' 
                              ? "bg-slate-900 text-white rounded-2xl rounded-tr-sm" 
                              : "bg-white border border-slate-200 text-slate-700 rounded-2xl rounded-tl-sm"
                          )}>
                            {msg.text}
                          </div>
                          <span className="text-[10px] text-slate-400 px-1 font-medium">
                            {msg.timestamp.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                          </span>
                        </div>
                      </motion.div>
                    ))}

                    {isTyping && (
                      <motion.div 
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-3 self-start max-w-[80%]"
                      >
                        <Avatar className="h-8 w-8 bg-white border border-slate-100 shadow-sm">
                          <AvatarFallback className="bg-transparent"><Sparkles className="h-4 w-4 text-blue-600" /></AvatarFallback>
                        </Avatar>
                        <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1.5 h-[42px]">
                          <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                          <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                          <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                        </div>
                      </motion.div>
                    )}
                  </div>
                </ScrollArea>
              </div>

              {/* Suggestions */}
              <div className="bg-background border-t border-border/50 px-4 py-3 overflow-x-auto no-scrollbar flex gap-2 shrink-0">
                {SUGGESTED_QUESTIONS.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(q)}
                    className="flex-shrink-0 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 text-xs font-medium transition-colors border border-transparent hover:border-slate-300"
                  >
                    {q}
                  </button>
                ))}
              </div>

              {/* Input */}
              <div className="p-4 bg-background border-t border-border">
                <div className="relative flex items-center">
                  <Input
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                    placeholder="Ask about your giving..."
                    className="pr-12 h-12 rounded-full border-slate-200 bg-slate-50/50 focus:bg-white transition-all shadow-sm pl-5 text-sm"
                  />
                  <Button 
                    size="icon"
                    onClick={() => handleSendMessage()}
                    disabled={!inputValue.trim() || isTyping}
                    className={cn(
                      "absolute right-1.5 h-9 w-9 rounded-full transition-all shadow-sm",
                      inputValue.trim() ? "bg-slate-900 hover:bg-slate-800 text-white" : "bg-slate-200 text-slate-400 hover:bg-slate-300"
                    )}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Launcher */}
        <AnimatePresence>
          {!isOpen && (
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsOpen(true)}
                  className="pointer-events-auto h-14 w-14 rounded-full bg-slate-900 text-white shadow-xl flex items-center justify-center hover:bg-slate-800 transition-colors group relative"
                >
                  <Sparkles className="h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
                </motion.button>
              </TooltipTrigger>
              <TooltipContent side="left" className="font-medium bg-slate-900 text-white border-slate-800">
                Ask Giving Assistant
              </TooltipContent>
            </Tooltip>
          )}
        </AnimatePresence>
      </div>
    </TooltipProvider>
  );
};
