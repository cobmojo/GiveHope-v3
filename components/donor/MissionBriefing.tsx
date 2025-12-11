
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { GoogleGenAI } from "@google/genai";

interface WorkerFeed {
  id: string;
  name: string;
  updates: string[];
}

interface MissionBriefingProps {
  feeds: Record<string, WorkerFeed>;
  activeSupport: string[];
}

export const MissionBriefing: React.FC<MissionBriefingProps> = ({ feeds, activeSupport }) => {
  const [briefing, setBriefing] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBriefing = async () => {
      try {
        const feedContext = activeSupport.map(key => {
            const w = feeds[key];
            return w ? `Worker: ${w.name}\nUpdates:\n${w.updates.join('\n')}` : "";
        }).join('\n\n');

        const prompt = `
            The donor supports these workers:
            ${feedContext}
            
            Task: Write a 1-2 sentence status report for the donor.
            Tone: Earnest, factual, trustworthy. 
            Constraints: NO superlatives (amazing, incredible, etc). NO exclamation marks. Just the facts of what has been accomplished recently.
            Example: "The Miller Family completed the community well in Northern Thailand, while Dr. Sarah Smith's mobile clinic treated 120 patients this week."
        `;

        const apiKey = process.env.API_KEY;
        
        if (!apiKey) {
            // Graceful fallback for development/demo without key
            await new Promise(resolve => setTimeout(resolve, 800));
            setBriefing("The Miller Family completed the community well in Northern Thailand, serving 500 families.");
            return;
        }

        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });

        setBriefing(response.text?.trim() || "Field partners are actively deploying resources in Thailand and Kenya.");
      } catch (e: any) {
        // Graceful degradation for rate limits (429) or other API errors
        const errorStr = JSON.stringify(e);
        if (errorStr.includes('429') || errorStr.includes('RESOURCE_EXHAUSTED')) {
            console.warn("Gemini API Rate Limit hit. Using fallback briefing.");
            setBriefing("The Miller Family completed the community well in Northern Thailand, while Dr. Sarah Smith's mobile clinic treated 120 patients this week.");
        } else {
            console.error("AI Briefing Error:", e);
            setBriefing("Updates are currently syncing from the field.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBriefing();
  }, [feeds, activeSupport]);

  return (
    <div className="relative group overflow-hidden rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-indigo-100 shadow-sm transition-all hover:shadow-md">
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5">
            <div className="bg-white p-2.5 rounded-lg shrink-0 shadow-sm border border-indigo-100/50">
                <Sparkles className="h-5 w-5 text-indigo-600 fill-indigo-100 animate-pulse" />
            </div>
            <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-indigo-900 uppercase tracking-widest flex items-center gap-2">
                      Mission Briefing <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    </h3>
                    <span className="text-[10px] text-slate-400 font-medium">Synced today</span>
                </div>
                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="h-5 w-3/4 bg-slate-200/50 rounded animate-pulse mt-1" 
                        />
                    ) : (
                        <motion.p 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
                            className="text-sm text-slate-700 leading-relaxed font-medium"
                        >
                            {briefing}
                        </motion.p>
                    )}
                </AnimatePresence>
            </div>
            <div className="hidden sm:block h-8 w-px bg-indigo-200/50 mx-2" />
            <Button variant="ghost" className="shrink-0 text-indigo-700 hover:text-indigo-900 hover:bg-white/60 font-semibold gap-1 group/btn" asChild>
                <Link to="/donor-portal/feed">
                   Full Story <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                </Link>
            </Button>
        </div>
        {/* Mobile Link Overlay */}
        <Link to="/donor-portal/feed" className="absolute inset-0 sm:hidden z-10" aria-label="Read full story" />
    </div>
  );
};
