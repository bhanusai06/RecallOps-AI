// RecallOps AI Incident Hub client application
"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { UploadCard, DemoAnalyzeResponse } from "@/components/dashboard/upload-card";
import { PipelineTimeline } from "@/components/dashboard/pipeline-timeline";
import { MetricsRow } from "@/components/dashboard/metrics-row";
import { AnalysisCard } from "@/components/dashboard/analysis-card";
import { MemoryCard } from "@/components/dashboard/memory-card";
import { RoutingCard } from "@/components/dashboard/routing-card";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, BrainCircuit, ShieldAlert, Sparkles, Network, 
  Archive, BookOpen, AlertTriangle, TrendingUp, CheckCircle, Database 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Lazy load the heavy analytics dashboard for better initial performance
const AnalyticsDashboard = dynamic(
  () => import("@/components/dashboard/analytics-dashboard").then(mod => mod.AnalyticsDashboard),
  { 
    ssr: false, 
    loading: () => <div className="h-96 w-full animate-pulse bg-white/5 rounded-2xl border border-white/10 mt-12 flex items-center justify-center text-gray-500">Loading Analytics...</div> 
  }
);

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="animate-pulse bg-white/5 h-96 w-full rounded-2xl border border-white/10 flex items-center justify-center text-gray-500">Loading Incident Hub...</div>}>
      <DashboardPageContent />
    </Suspense>
  );
}

function DashboardPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentTab = searchParams.get("tab") || "dashboard";

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
    // Switch search query back to dashboard to display results
    router.push("/?tab=dashboard");
  };

  const handleReset = () => {
    setResult(null);
    setPendingResult(null);
    setAnalyzing(false);
    router.push("/?tab=new");
  };

  // -------------------- Tab Renderers --------------------

  // 1. Dashboard tab (upload form or analysis report)
  const renderDashboard = () => {
    if (result) {
      return (
        <motion.div 
          key="result-cards"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ staggerChildren: 0.1, duration: 0.5, type: "spring", damping: 20 }}
          className="space-y-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-2">
            <h1 className="text-3xl font-bold tracking-tight text-white">AI Diagnosis Output</h1>
            <Button 
              onClick={handleReset} 
              variant="outline"
              className="border-white/20 bg-white/5 hover:bg-white/10 text-white transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Analyze Another Log
            </Button>
          </div>

          <MetricsRow data={result} />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <AnalysisCard data={result.analysis} incidentId={result.incident_id} />
            </div>
            <div className="space-y-8">
              <RoutingCard data={result.routing} />
              <MemoryCard data={result.memory} extraData={(result.analysis as any).model_extra || (result.analysis as any).model_metadata} />
            </div>
          </div>

          <AnalyticsDashboard demoHistory={demoHistory} />
        </motion.div>
      );
    }

    return (
      <div className="space-y-8 w-full max-w-5xl mx-auto mt-8">
        <div className="text-center space-y-3 mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight text-white">AI Incident Memory Copilot</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            RecallOps AI is an intelligence system that parses production logs, extracts signatures, queries hindsight memory, and verifies resolutions.
          </p>
        </div>
        <UploadCard onStart={handleAnalysisStart} onComplete={handleAnalysisComplete} />
      </div>
    );
  };

  // 2. Memory Vault tab
  const renderVault = () => {
    const vaultRecords = [
      { id: "mem-0912", category: "OOM", quality: 92, service: "auth-worker", env: "production", reuses: 8, lastActive: "12 mins ago" },
      { id: "mem-0911", category: "DB_TIMEOUT", quality: 88, service: "payments-service", env: "production", reuses: 12, lastActive: "1 hr ago" },
      { id: "mem-0910", category: "AUTH_FAILURE", quality: 78, service: "checkout-ui", env: "production", reuses: 4, lastActive: "1 day ago" },
      { id: "mem-0909", category: "NETWORK_FAILURE", quality: 85, service: "gateway-proxy", env: "production", reuses: 9, lastActive: "3 days ago" },
    ];

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Memory Vault</h1>
          <p className="text-muted-foreground">Historical operational memories indexed in Hindsight Vector Database.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {vaultRecords.map(rec => (
            <div key={rec.id} className="bg-black/60 border border-white/10 rounded-2xl p-6 backdrop-blur-xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-1">
                  <span className="text-xs font-mono text-gray-500">{rec.id}</span>
                  <h4 className="text-lg font-bold text-white uppercase">{rec.category} Incident</h4>
                </div>
                <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {rec.quality}% Quality
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-y-3 text-sm font-mono text-gray-400 mt-4 border-t border-white/5 pt-4">
                <div>Service: <span className="text-white">{rec.service}</span></div>
                <div>Env: <span className="text-white uppercase">{rec.env}</span></div>
                <div>Reuses: <span className="text-fuchsia-400 font-bold">{rec.reuses} times</span></div>
                <div>Active: <span className="text-gray-300">{rec.lastActive}</span></div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    );
  };

  // 3. Resolutions Library tab
  const renderResolutions = () => {
    const resolutions = [
      { category: "OOM", fix: "Horizontal Autoscaler (HPA) scale-up", successRate: 98, recoveryTime: "45s", count: 18 },
      { category: "DB_TIMEOUT", fix: "PgBouncer connection limit scale", successRate: 91, recoveryTime: "110s", count: 24 },
      { category: "AUTH_FAILURE", fix: "Fallback local JWKS public key certificates", successRate: 85, recoveryTime: "75s", count: 8 },
      { category: "CrashLoopBackOff", fix: "ConfigMap secrets hydration delay config", successRate: 94, recoveryTime: "30s", count: 14 }
    ];

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Resolution Library</h1>
          <p className="text-muted-foreground">Proven playbook fixes and recovery metrics across different failure types.</p>
        </div>
        <div className="bg-black/60 border border-white/10 rounded-2xl overflow-hidden shadow-xl backdrop-blur-xl">
          <div className="p-6">
            <h3 className="text-lg font-bold text-white mb-4">Ingested Mitigations Registry</h3>
            <div className="space-y-4">
              {resolutions.map((res, idx) => (
                <div key={idx} className="flex justify-between items-center bg-white/5 border border-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors flex-wrap gap-4">
                  <div className="space-y-1">
                    <Badge className="bg-primary/20 text-primary border border-primary/30 uppercase font-mono text-xs">{res.category}</Badge>
                    <h5 className="text-sm font-bold text-white mt-1">{res.fix}</h5>
                  </div>
                  <div className="flex items-center gap-6 font-mono text-sm">
                    <div className="text-center">
                      <span className="text-[10px] text-gray-500 block">Fix Success Rate</span>
                      <span className="text-emerald-400 font-bold">{res.successRate}%</span>
                    </div>
                    <div className="text-center">
                      <span className="text-[10px] text-gray-500 block">Avg Recovery</span>
                      <span className="text-white">{res.recoveryTime}</span>
                    </div>
                    <div className="text-center">
                      <span className="text-[10px] text-gray-500 block">Count</span>
                      <span className="text-sky-400">{res.count}x</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  // 4. Incident Knowledge Graph tab
  const renderGraph = () => {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Incident Knowledge Graph</h1>
          <p className="text-muted-foreground">Entity relationship map connecting incidents, services, and resolutions.</p>
        </div>
        <div className="bg-[#0b0b0d] border border-white/10 rounded-2xl p-6 min-h-[500px] flex flex-col justify-between backdrop-blur-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.08),transparent_60%)]" />
          
          <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-8">
            {/* SVG custom interactive node graph representing incident dependencies */}
            <svg className="w-full max-w-2xl h-[300px]" viewBox="0 0 600 300">
              {/* Connection lines */}
              <line x1="100" y1="150" x2="250" y2="80" stroke="rgba(255,255,255,0.15)" strokeWidth="2" strokeDasharray="5,5" />
              <line x1="100" y1="150" x2="250" y2="220" stroke="rgba(255,255,255,0.15)" strokeWidth="2" strokeDasharray="5,5" />
              <line x1="250" y1="80" x2="450" y2="80" stroke="rgba(16,185,129,0.3)" strokeWidth="3" />
              <line x1="250" y1="220" x2="450" y2="220" stroke="rgba(59,130,246,0.3)" strokeWidth="3" />
              
              {/* Nodes */}
              {/* Incident Root Node */}
              <circle cx="100" cy="150" r="30" fill="rgba(244,63,94,0.2)" stroke="rgb(244,63,94)" strokeWidth="2" />
              <text x="100" y="155" fill="white" fontSize="10" textAnchor="middle" fontWeight="bold">Outage</text>
              
              {/* Services Nodes */}
              <circle cx="250" cy="80" r="25" fill="rgba(59,130,246,0.2)" stroke="rgb(59,130,246)" strokeWidth="2" />
              <text x="250" y="85" fill="white" fontSize="9" textAnchor="middle">Auth</text>

              <circle cx="250" cy="220" r="25" fill="rgba(59,130,246,0.2)" stroke="rgb(59,130,246)" strokeWidth="2" />
              <text x="250" y="225" fill="white" fontSize="9" textAnchor="middle">Payments</text>

              {/* Fix Nodes */}
              <circle cx="450" cy="80" r="25" fill="rgba(16,185,129,0.2)" stroke="rgb(16,185,129)" strokeWidth="2" />
              <text x="450" y="85" fill="white" fontSize="9" textAnchor="middle">HPA Scale</text>

              <circle cx="450" cy="220" r="25" fill="rgba(16,185,129,0.2)" stroke="rgb(16,185,129)" strokeWidth="2" />
              <text x="450" y="225" fill="white" fontSize="9" textAnchor="middle">PgBouncer</text>
            </svg>
            <span className="text-xs text-gray-500 font-mono mt-4">Knowledge relation path: Outage &rarr; Degradation Services &rarr; Resolution Action Nodes</span>
          </div>

          <div className="border-t border-white/5 pt-4 flex justify-between items-center flex-wrap gap-4 text-xs font-mono text-gray-400 relative z-10">
            <div>Total Nodes: <span className="text-white">42</span></div>
            <div>Success Relationships: <span className="text-emerald-400">92%</span></div>
          </div>
        </div>
      </motion.div>
    );
  };

  // 5. Predictive Engine tab
  const renderPredictive = () => {
    const alerts = [
      { 
        id: "pred-alert-101", 
        title: "Potential OOM Kill Risk", 
        description: "Memory utilization growth in 'auth-worker' service matches 3 historical OOM incidents (Monday OOM template). Maximum heap threshold likely to exceed limits in the next 2 hours.", 
        confidence: 89, 
        service: "auth-worker",
        severity: "High" 
      },
      { 
        id: "pred-alert-102", 
        title: "Active DB Connection Exhaustion Warning", 
        description: "Database connection pool occupancy matches the active migration timeout template seen on Wednesday. Query queues scaling above normal parameters.", 
        confidence: 76, 
        service: "payments-service",
        severity: "Medium" 
      }
    ];

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Predictive Incident Engine</h1>
          <p className="text-muted-foreground">Proactive threat warnings generated from historical incident signatures and repeated anomaly patterns.</p>
        </div>
        <div className="space-y-4">
          {alerts.map(alert => (
            <div key={alert.id} className="bg-black/60 border border-white/10 rounded-2xl p-6 backdrop-blur-xl relative overflow-hidden group">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-rose-500 to-transparent" />
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-rose-500 animate-pulse" />
                  <h4 className="text-lg font-bold text-white">{alert.title}</h4>
                </div>
                <Badge className="bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  {alert.confidence}% Risk Match
                </Badge>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed bg-white/5 border border-white/5 p-4 rounded-xl font-mono">
                {alert.description}
              </p>
              <div className="flex items-center gap-4 text-xs font-mono text-gray-500 mt-4 pt-4 border-t border-white/5">
                <div>Alert ID: <span className="text-gray-300">{alert.id}</span></div>
                <div>Target Service: <span className="text-white">{alert.service}</span></div>
                <div>Severity: <span className="text-rose-400 font-bold uppercase">{alert.severity}</span></div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    );
  };

  // -------------------- Router Switch --------------------

  const renderTabContent = () => {
    switch (currentTab) {
      case "dashboard":
        return renderDashboard();
      case "new":
        return (
          <div className="space-y-8 w-full max-w-5xl mx-auto mt-8">
            <div className="text-center space-y-3 mb-10">
              <h1 className="text-4xl font-extrabold tracking-tight text-white">AI Incident Memory Copilot</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Paste logs or upload application telemetry files to trigger end-to-end classification, mapping, and root cause diagnosis.
              </p>
            </div>
            <UploadCard onStart={handleAnalysisStart} onComplete={handleAnalysisComplete} />
          </div>
        );
      case "vault":
        return renderVault();
      case "resolutions":
        return renderResolutions();
      case "graph":
        return renderGraph();
      case "predictive":
        return renderPredictive();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="space-y-8 pb-20 max-w-[1400px] mx-auto">
      <AnimatePresence mode="wait">
        {analyzing ? (
          <motion.div 
            key="analyzing-timeline"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05, transition: { duration: 0.4 } }}
            className="w-full max-w-3xl mx-auto mt-24"
          >
            <PipelineTimeline demo={pendingResult?.demo} onTimelineComplete={handleTimelineComplete} />
          </motion.div>
        ) : (
          <motion.div 
            key={currentTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            {renderTabContent()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
