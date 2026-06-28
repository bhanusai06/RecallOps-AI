"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, CircleDashed, FileText, BrainCircuit, Network, Sparkles, Database, Edit3, Check } from "lucide-react";
import { DemoIncident } from "@/lib/demo-data";

// Expanded to 7 stages
const baseSteps = [
  { id: 1, title: "Log Parser", icon: FileText, desc: "Extracting stack traces and metadata" },
  { id: 2, title: "Memory Search", icon: BrainCircuit, desc: "Querying Hindsight vector database" },
  { id: 3, title: "Prompt Builder", icon: Edit3, desc: "Constructing execution context" },
  { id: 4, title: "Cascadeflow Routing", icon: Network, desc: "Dynamic model selection & budget evaluation" },
  { id: 5, title: "Reflection Engine", icon: Sparkles, desc: "Grading generated playbook quality" },
  { id: 6, title: "Memory Update", icon: Database, desc: "Storing optimized playbook" },
  { id: 7, title: "Analysis Complete", icon: Check, desc: "Results ready for review" }
];

interface PipelineTimelineProps {
  demo?: DemoIncident;
  onTimelineComplete?: () => void;
}

// Typing effect component for the narrator
const TypingNarrator = ({ text }: { text: string }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    setDisplayedText("");
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.substring(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(interval);
    }, 20); // typing speed
    return () => clearInterval(interval);
  }, [text]);

  return (
    <span className="font-mono text-sm text-primary inline-block min-h-[20px]">
      {displayedText}
      <motion.span 
        animate={{ opacity: [1, 0] }} 
        transition={{ repeat: Infinity, duration: 0.8 }}
        className="inline-block w-2 h-4 bg-primary ml-1 align-middle"
      />
    </span>
  );
};

export const PipelineTimeline = ({ demo, onTimelineComplete }: PipelineTimelineProps) => {
  const [activeStep, setActiveStep] = useState(1);
  const totalSteps = baseSteps.length;

  useEffect(() => {
    // Artificial timeline progression
    const speed = demo ? 1200 : 800; // slightly faster since there are 7 stages now
    
    const timer = setInterval(() => {
      setActiveStep((prev) => {
        if (prev < totalSteps) {
          return prev + 1;
        } else {
          clearInterval(timer);
          if (onTimelineComplete) setTimeout(onTimelineComplete, 500);
          return prev;
        }
      });
    }, speed);
    
    return () => clearInterval(timer);
  }, [demo, totalSteps, onTimelineComplete]);

  // Map the demo's 7 narrative steps to the current step
  const currentNarrative = demo 
    ? demo.narrativeSteps[Math.min(activeStep - 1, demo.narrativeSteps.length - 1)]
    : `Processing stage ${activeStep}...`;

  return (
    <div className="bg-[#0a0a0a] border border-white/10 p-8 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>
      
      <h3 className="text-xl font-semibold text-white mb-6 text-center flex items-center justify-center gap-2">
        <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
        Processing Incident
      </h3>
      
      {/* Floating AI Narrator Panel */}
      <div className="mb-10 p-5 bg-[#111] border border-white/5 rounded-xl shadow-inner relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
        <div className="flex items-start">
          <BrainCircuit className="w-5 h-5 text-primary mr-3 mt-0.5 opacity-80" />
          <div className="flex-1">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-semibold">AI Orchestrator</p>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <TypingNarrator text={currentNarrative} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
      
      <div className="space-y-7 relative ml-2">
        {/* Vertical Line Background */}
        <div className="absolute left-6 top-6 bottom-6 w-[2px] bg-white/5 z-0"></div>
        
        {/* Animated Progress Line */}
        <motion.div 
          className="absolute left-6 top-6 w-[2px] bg-gradient-to-b from-primary to-violet-500 z-0 shadow-[0_0_10px_rgba(var(--primary),0.8)]"
          initial={{ height: 0 }}
          animate={{ height: `${((activeStep - 1) / (totalSteps - 1)) * 100}%` }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />

        {baseSteps.map((step) => {
          const isActive = activeStep === step.id;
          const isPast = activeStep > step.id;
          
          return (
            <div key={step.id} className="flex items-start relative z-10 group">
              <div className="w-12 h-12 flex items-center justify-center mr-5 bg-[#0a0a0a] rounded-full shrink-0">
                {isPast ? (
                  <motion.div 
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center ring-1 ring-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                  </motion.div>
                ) : isActive ? (
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    className="w-9 h-9 rounded-full bg-primary/20 text-primary flex items-center justify-center ring-2 ring-primary shadow-[0_0_20px_rgba(var(--primary),0.6)]"
                  >
                    <step.icon className="w-4 h-4 animate-pulse" />
                  </motion.div>
                ) : (
                  <div className="w-9 h-9 rounded-full bg-white/5 text-gray-600 flex items-center justify-center ring-1 ring-white/5 group-hover:ring-white/20 transition-all">
                    <CircleDashed className="w-4 h-4" />
                  </div>
                )}
              </div>
              <div className="pt-2 flex-1">
                <h4 className={`text-base font-medium transition-colors ${isActive ? "text-white" : isPast ? "text-gray-300" : "text-gray-600"}`}>
                  {step.title}
                </h4>
                <p className={`text-sm mt-1 transition-colors ${isActive ? "text-primary/80" : isPast ? "text-gray-500" : "text-gray-700"}`}>
                  {step.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
