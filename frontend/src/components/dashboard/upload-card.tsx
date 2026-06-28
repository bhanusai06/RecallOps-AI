"use client";

import { useState } from "react";
import { UploadCloud, Zap, CalendarDays, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { analyzeIncidentLog } from "@/lib/api/incident";
import { AnalyzeResponse } from "@/types/api";
import { demoIncidents, DemoIncident } from "@/lib/demo-data";
import { motion, AnimatePresence } from "framer-motion";

export interface DemoAnalyzeResponse extends AnalyzeResponse {
  demo?: DemoIncident;
}

interface UploadCardProps {
  onStart: () => void;
  onComplete: (data: DemoAnalyzeResponse) => void;
}

export const UploadCard = ({ onStart, onComplete }: UploadCardProps) => {
  const [logContent, setLogContent] = useState("");
  const [isHovering, setIsHovering] = useState(false);
  const [errorState, setErrorState] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!logContent.trim()) return;
    
    setErrorState(null);
    onStart();
    try {
      const result = await analyzeIncidentLog({
        log: logContent,
        environment: "production",
        service: "unknown",
      });
      onComplete(result);
    } catch (error) {
      console.error(error);
      setErrorState("Backend unavailable. Running Demo Mode.");
      
      // Explicitly wait to show the error state briefly before falling back
      setTimeout(() => {
        onComplete(demoIncidents["1"].response);
      }, 1500);
    }
  };

  const handleDemo = (demoId: string) => {
    setErrorState(null);
    const demo = demoIncidents[demoId];
    setLogContent(demo.logText);
    onStart();
    
    setTimeout(() => {
      const res = { ...demo.response, demo: demo };
      onComplete(res);
    }, 500);
  };

  return (
    <Card className="border-white/10 bg-[#0a0a0a] backdrop-blur-xl shadow-2xl overflow-hidden relative">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-primary to-orange-400 opacity-80" />
      
      <CardContent className="p-8">
        <div className="flex flex-col items-center justify-center text-center mb-8">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4 ring-1 ring-white/10 shadow-[0_0_30px_rgba(var(--primary),0.15)]"
          >
            <UploadCloud className="w-8 h-8 text-primary" />
          </motion.div>
          <h2 className="text-2xl font-semibold text-white mb-2">RecallOps AI Memory</h2>
          <p className="text-muted-foreground max-w-md">Upload a production log to trigger AI root cause analysis, or run the guided interactive demonstration.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 w-full max-w-3xl">
            <button 
              onClick={() => handleDemo("1")}
              className="flex flex-col items-start p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-violet-500/10 hover:border-violet-500/30 transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
              aria-label="Run Day 1 Demo: New Unknown Incident"
            >
              <div className="flex items-center text-violet-400 font-medium mb-1 group-hover:text-violet-300">
                <CalendarDays className="w-4 h-4 mr-2" />
                Monday
              </div>
              <span className="text-sm text-gray-400 group-hover:text-gray-200">New Unknown Incident</span>
            </button>
            
            <button 
              onClick={() => handleDemo("2")}
              className="flex flex-col items-start p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-fuchsia-500/10 hover:border-fuchsia-500/30 transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500"
              aria-label="Run Day 2 Demo: Similar Production Issue"
            >
              <div className="flex items-center text-fuchsia-400 font-medium mb-1 group-hover:text-fuchsia-300">
                <CalendarDays className="w-4 h-4 mr-2" />
                Tuesday
              </div>
              <span className="text-sm text-gray-400 group-hover:text-gray-200">Similar Production Issue</span>
            </button>
            
            <button 
              onClick={() => handleDemo("3")}
              className="flex flex-col items-start p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-orange-500/10 hover:border-orange-500/30 transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
              aria-label="Run Day 3 Demo: Known Incident"
            >
              <div className="flex items-center text-orange-400 font-medium mb-1 group-hover:text-orange-300">
                <CalendarDays className="w-4 h-4 mr-2" />
                Wednesday
              </div>
              <span className="text-sm text-gray-400 group-hover:text-gray-200">Known Incident Cache Hit</span>
            </button>
          </div>
        </div>

        <div className="relative mt-4 group">
          <motion.div 
            animate={{ 
              boxShadow: isHovering ? "0 0 0 1px rgba(var(--primary), 0.5)" : "0 0 0 1px rgba(255,255,255, 0.1)" 
            }}
            className="rounded-xl overflow-hidden transition-all duration-300 relative"
          >
            <textarea
              className="w-full h-40 bg-black/40 p-5 text-sm text-gray-300 font-mono outline-none resize-none placeholder:text-gray-600 transition-colors"
              placeholder="Paste raw application logs, stack traces, or Datadog output here..."
              value={logContent}
              onChange={(e) => setLogContent(e.target.value)}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              onFocus={() => setIsHovering(true)}
              onBlur={() => setIsHovering(false)}
              aria-label="Incident Log Input"
            />
            
            {/* Elegant Error Toast Inside the Textarea Area */}
            <AnimatePresence>
              {errorState && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-500/20 text-red-400 border border-red-500/30 px-4 py-2 rounded-lg text-sm flex items-center shadow-lg backdrop-blur-md"
                  role="alert"
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  {errorState}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="absolute bottom-4 right-4 flex gap-2">
              <Button 
                onClick={handleAnalyze} 
                disabled={!logContent.trim()}
                className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-md focus-visible:ring-2 focus-visible:ring-primary transition-colors"
                aria-label="Analyze Log"
              >
                <Zap className="w-4 h-4 mr-2" />
                Analyze Log
              </Button>
            </div>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
};
