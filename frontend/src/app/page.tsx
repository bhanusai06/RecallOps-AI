"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { UploadCard, DemoAnalyzeResponse } from "@/components/dashboard/upload-card";
import { PipelineTimeline } from "@/components/dashboard/pipeline-timeline";
import { MetricsRow } from "@/components/dashboard/metrics-row";
import { AnalysisCard } from "@/components/dashboard/analysis-card";
import { MemoryCard } from "@/components/dashboard/memory-card";
import { RoutingCard } from "@/components/dashboard/routing-card";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

// Lazy load the heavy analytics dashboard for better initial performance
const AnalyticsDashboard = dynamic(
  () => import("@/components/dashboard/analytics-dashboard").then(mod => mod.AnalyticsDashboard),
  { 
    ssr: false, 
    loading: () => <div className="h-96 w-full animate-pulse bg-white/5 rounded-2xl border border-white/10 mt-12 flex items-center justify-center text-gray-500">Loading Analytics...</div> 
  }
);

export default function DashboardPage() {
  const [analyzing, setAnalyzing] = useState(false);
  const [pendingResult, setPendingResult] = useState<DemoAnalyzeResponse | null>(null);
  const [result, setResult] = useState<DemoAnalyzeResponse | null>(null);
  const [demoHistory, setDemoHistory] = useState<string[]>([]);

  const handleAnalysisStart = () => {
    setAnalyzing(true);
    setResult(null);
    setPendingResult(null);
  };

  const handleAnalysisComplete = (data: DemoAnalyzeResponse) => {
    setPendingResult(data);
  };

  const handleTimelineComplete = () => {
    if (pendingResult) {
      setResult(pendingResult);
      if (pendingResult.demo) {
        setDemoHistory(prev => [...prev, pendingResult.demo!.id]);
      }
    }
    setAnalyzing(false);
  };

  const handleReset = () => {
    setResult(null);
    setPendingResult(null);
    setAnalyzing(false);
  };

  return (
    <div className="space-y-8 pb-20 max-w-[1400px] mx-auto">
      <AnimatePresence mode="wait">
        {!result && !analyzing && (
          <motion.div
            key="header-upload"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
            className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-10"
          >
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-white mb-3">Incident Analysis Hub</h1>
              <p className="text-lg text-muted-foreground">The AI system that learns from every outage to resolve issues instantly.</p>
            </div>
          </motion.div>
        )}

        {result && !analyzing && (
          <motion.div
            key="header-result"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6"
          >
            <h1 className="text-3xl font-bold tracking-tight text-white">Analysis Results</h1>
            <Button 
              onClick={handleReset} 
              variant="outline"
              className="border-white/20 bg-white/5 hover:bg-white/10 text-white transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Analyze Another Log
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!analyzing && !result && (
          <motion.div 
            key="upload-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.3 } }}
            className="w-full max-w-5xl mx-auto mt-8"
          >
            <UploadCard onStart={handleAnalysisStart} onComplete={handleAnalysisComplete} />
            
            {demoHistory.length === 0 && (
              <div className="mt-12 text-center text-sm text-gray-500 max-w-lg mx-auto">
                <p>No incidents processed yet. Upload a production log or run the interactive demo to start building the AI's operational memory.</p>
              </div>
            )}
          </motion.div>
        )}

        {analyzing && (
          <motion.div 
            key="analyzing-timeline"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05, transition: { duration: 0.4 } }}
            className="w-full max-w-3xl mx-auto mt-24"
          >
            <PipelineTimeline demo={pendingResult?.demo} onTimelineComplete={handleTimelineComplete} />
          </motion.div>
        )}

        {result && (
          <motion.div 
            key="result-cards"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ staggerChildren: 0.1, duration: 0.5, type: "spring", damping: 20 }}
            className="space-y-8"
          >
            <MetricsRow data={result} />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <AnalysisCard data={result.analysis} incidentId={result.incident_id} />
              </div>
              <div className="space-y-8">
                <RoutingCard data={result.routing} />
                {/* @ts-ignore */}
                <MemoryCard data={result.memory} extraData={result.analysis.model_extra} />
              </div>
            </div>

            {/* Lazy Loaded Demo Analytics Dashboard */}
            <AnalyticsDashboard demoHistory={demoHistory} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

