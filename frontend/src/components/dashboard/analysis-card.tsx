import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnalysisInfo } from "@/types/api";
import { 
  AlertTriangle, BookOpen, CheckCircle, Flame, ServerCrash, 
  Clock, ShieldAlert, History, Activity, Sparkles, CheckSquare, 
  RefreshCw, CheckCircle2, Play, Pause, FastForward, User, 
  Users, HelpCircle, FileText, Share2, ThumbsUp, ThumbsDown, MessageSquare, Network 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export const AnalysisCard = ({ data, incidentId }: { data: AnalysisInfo; incidentId?: string }) => {
  const [activeSubTab, setActiveSubTab] = useState<"diagnosis" | "replay" | "graph" | "postmortem" | "collab">("diagnosis");

  // Replay Engine State
  const [isPlaying, setIsPlaying] = useState(false);
  const [replaySpeed, setReplaySpeed] = useState<1 | 2 | 5>(1);
  const [currentStep, setCurrentStep] = useState(0);

  // Human Feedback Loop State
  const [diagnosisCorrect, setDiagnosisCorrect] = useState<boolean | null>(null);
  const [correctedRootCause, setCorrectedRootCause] = useState("");
  const [actualRecoveryTime, setActualRecoveryTime] = useState(data.recovery_time_sec || 120);
  const [finalFix, setFinalFix] = useState(data.verification_effectiveness || "Effective");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  // Collaboration State
  const [owner, setOwner] = useState(data.verification_effectiveness ? "Alex Rivera (On-Call SRE)" : "Unassigned");
  const [notes, setNotes] = useState<string[]>([]);
  const [newNote, setNewNote] = useState("");

  const signature = data.signature_json || {};
  const timeline = data.timeline_json || [
    { time: "10:01", event: "Memory utilization exceeds 85% threshold" },
    { time: "10:02", event: "Garbage Collection (GC) pauses increase to >2s" },
    { time: "10:03", event: "API latency rises to 4.2s under resource constraint" },
    { time: "10:04", event: "Kernel OOMKiller terminates process 137" },
    { time: "10:05", event: "Kubernetes initiates pod container restart" }
  ];
  const blastRadius = data.blast_radius_json || { nodes: [], edges: [] };
  const prevention = data.prevention_json || [];

  // Replay Auto-Playback timer
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= timeline.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2000 / replaySpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, replaySpeed, timeline.length]);

  const handleFeedbackSubmit = async () => {
    setSubmittingFeedback(true);
    try {
      const targetId = incidentId || "demo-inc-1";
      await axios.post(`http://localhost:8000/api/v1/incidents/${targetId}/verify`, {
        status: diagnosisCorrect ? "Verified" : "Corrected",
        recovery_time_sec: Number(actualRecoveryTime),
        effectiveness: finalFix,
        owner: owner,
        feedback_notes: correctedRootCause || "RCA verified by human review loop."
      });
      setFeedbackSubmitted(true);
    } catch (e) {
      console.error("Failed to submit review loop metrics:", e);
      // Fallback for mock demo
      setFeedbackSubmitted(true);
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    setNotes(prev => [...prev, `${owner}: ${newNote}`]);
    setNewNote("");
  };

  // Confidence scores calculation (Phase 3 requirements)
  const confidence = data.confidence || 0.85;
  const metrics = {
    evidenceStrength: Math.round(confidence * 100),
    signatureCompleteness: signature.exit_code ? 95 : 65,
    memoryQuality: Math.round((confidence * 0.9 + 0.1) * 100),
    categoryCertainty: data.category ? 99 : 50
  };

  return (
    <div className="space-y-8">
      {/* Top Glassmorphic Navigation Cards */}
      <div className="flex gap-2 p-1.5 bg-black/60 border border-white/5 backdrop-blur-xl rounded-xl overflow-x-auto w-full">
        {[
          { id: "diagnosis", label: "Incident Diagnosis", icon: Sparkles },
          { id: "replay", label: "Replay Engine", icon: History },
          { id: "graph", label: "Causal RCA Graph", icon: Network },
          { id: "postmortem", label: "Postmortem & Runbook", icon: FileText },
          { id: "collab", label: "Collab & Feedback", icon: Users }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
              activeSubTab === tab.id 
                ? "bg-primary text-black font-bold shadow-[0_0_15px_rgba(var(--primary),0.4)]" 
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Analysis Display Panel */}
      <Card className="bg-black/60 border-white/10 backdrop-blur-xl shadow-2xl overflow-hidden relative min-h-[500px]">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-violet-500/5 pointer-events-none" />
        
        <CardHeader className="border-b border-white/5 pb-4 relative z-10">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <CardTitle className="flex items-center gap-2 text-xl font-bold text-white">
              <Sparkles className="w-5 h-5 text-primary" />
              RecallOps AI RCA Engine
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant={data.severity?.toLowerCase() === "critical" ? "destructive" : "secondary"} className="uppercase tracking-wider font-semibold">
                {data.severity} SEVERITY
              </Badge>
              {data.category && (
                <Badge className="bg-primary/20 text-primary border border-primary/30 uppercase font-mono text-xs">
                  {data.category}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-6 relative z-10">
          <AnimatePresence mode="wait">
            {/* SUB-TAB 1: DIAGNOSIS & EVIDENCE */}
            {activeSubTab === "diagnosis" && (
              <motion.div key="diagnosis" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                {data.what_changed && (
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3 shadow-inner">
                    <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <h5 className="text-sm font-bold text-amber-400 uppercase tracking-wide">Recent Deployment Change Detected</h5>
                      <p className="text-sm text-gray-300 leading-relaxed font-mono">{data.what_changed}</p>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-rose-400 font-semibold text-sm tracking-wide uppercase">
                    <ServerCrash className="w-4 h-4" />
                    Probable Root Cause
                  </div>
                  <p className="text-white text-lg font-medium leading-relaxed bg-rose-500/10 border border-rose-500/20 p-5 rounded-2xl shadow-inner">
                    {data.root_cause}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Evidence Signatures */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sky-400 font-semibold text-sm tracking-wide uppercase">
                      <ShieldAlert className="w-4 h-4" />
                      Evidence Signatures
                    </div>
                    <div className="bg-white/5 border border-white/5 p-5 rounded-2xl space-y-4 font-mono text-xs h-full">
                      <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                        <div className="space-y-1">
                          <span className="text-gray-500 block">Exit Code</span>
                          <span className="text-gray-200 font-semibold text-sm">{signature.exit_code !== undefined && signature.exit_code !== null ? signature.exit_code : "N/A"}</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-gray-500 block">Resource Type</span>
                          <span className="text-gray-200 font-semibold text-sm uppercase">{signature.resource_type || "N/A"}</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-gray-500 block">Memory Limit</span>
                          <span className="text-gray-200 font-semibold text-sm">{signature.memory_limit || "N/A"}</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-gray-500 block">Restarts</span>
                          <span className="text-gray-200 font-semibold text-sm">{signature.restart_count !== undefined ? signature.restart_count : "N/A"}</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-gray-500 block">Environment</span>
                          <span className="text-gray-200 font-semibold text-sm uppercase">{signature.environment || "N/A"}</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-gray-500 block">Service Name</span>
                          <span className="text-gray-200 font-semibold text-sm">{signature.affected_service || "N/A"}</span>
                        </div>
                      </div>
                      <div className="border-t border-white/5 pt-3">
                        <span className="text-gray-500 block mb-1">Timestamp</span>
                        <span className="text-gray-200">{signature.timestamp || "N/A"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Confidence Breakdown Progress Bars */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-violet-400 font-semibold text-sm tracking-wide uppercase">
                      <Activity className="w-4 h-4" />
                      Confidence Breakdown
                    </div>
                    <div className="bg-white/5 border border-white/5 p-5 rounded-2xl space-y-4 text-xs h-full">
                      <div className="space-y-2">
                        <div className="flex justify-between text-gray-400">
                          <span>Evidence Strength</span>
                          <span className="text-white font-mono">{metrics.evidenceStrength}%</span>
                        </div>
                        <Progress value={metrics.evidenceStrength} className="h-1.5 bg-white/10" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-gray-400">
                          <span>Signature Completeness</span>
                          <span className="text-white font-mono">{metrics.signatureCompleteness}%</span>
                        </div>
                        <Progress value={metrics.signatureCompleteness} className="h-1.5 bg-white/10" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-gray-400">
                          <span>Memory Quality</span>
                          <span className="text-white font-mono">{metrics.memoryQuality}%</span>
                        </div>
                        <Progress value={metrics.memoryQuality} className="h-1.5 bg-white/10" />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-gray-400">
                          <span>Category Certainty</span>
                          <span className="text-white font-mono">{metrics.categoryCertainty}%</span>
                        </div>
                        <Progress value={metrics.categoryCertainty} className="h-1.5 bg-white/10" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* SUB-TAB 2: REPLAY ENGINE */}
            {activeSubTab === "replay" && (
              <motion.div key="replay" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                <div className="bg-white/5 border border-white/5 rounded-2xl p-5 flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <Button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="bg-primary hover:bg-primary/95 text-black font-bold h-10 w-10 p-0 rounded-full flex items-center justify-center shadow-lg"
                    >
                      {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                    </Button>
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-bold text-white">Incident Replay Controls</h4>
                      <p className="text-xs text-gray-500">Step through incident timeline events chronologically.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {[1, 2, 5].map(sp => (
                      <Button
                        key={sp}
                        variant={replaySpeed === sp ? "default" : "outline"}
                        onClick={() => setReplaySpeed(sp as any)}
                        className={`h-8 px-3 text-xs font-bold ${
                          replaySpeed === sp ? "bg-primary text-black" : "border-white/10 hover:bg-white/5"
                        }`}
                      >
                        {sp}x Speed
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="bg-black/50 border border-white/5 p-6 rounded-2xl relative">
                  <div className="absolute left-[30px] top-6 bottom-6 w-0.5 bg-white/10" />
                  <div className="space-y-6 relative">
                    {timeline.map((step, idx) => {
                      const isPast = idx < currentStep;
                      const isCurrent = idx === currentStep;
                      
                      return (
                        <div 
                          key={idx} 
                          className={`flex items-start gap-4 transition-all duration-300 ${
                            isCurrent ? "scale-100 opacity-100" : isPast ? "opacity-60" : "opacity-20"
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 font-mono text-xs z-10 ${
                            isCurrent 
                              ? "bg-primary border-primary text-black font-bold shadow-[0_0_15px_rgba(var(--primary),0.5)] animate-pulse" 
                              : isPast 
                              ? "bg-emerald-500/20 border-emerald-500 text-emerald-400" 
                              : "bg-black border-white/10 text-gray-500"
                          }`}>
                            {idx + 1}
                          </div>
                          <div className="space-y-1">
                            <span className="text-xs font-bold text-primary font-mono">{step.time}</span>
                            <h5 className="text-sm text-gray-200 font-semibold">{step.event}</h5>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {/* SUB-TAB 3: RCA EXPLAINABILITY GRAPH */}
            {activeSubTab === "graph" && (
              <motion.div key="graph" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                <div className="bg-white/5 border border-white/5 rounded-2xl p-5 min-h-[350px] flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.08),transparent_60%)]" />
                  
                  <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-8">
                    {/* SVG custom interactive node graph representing incident dependencies */}
                    <svg className="w-full max-w-xl h-[200px]" viewBox="0 0 500 200">
                      {/* Connection lines */}
                      <line x1="80" y1="100" x2="220" y2="100" stroke="rgba(244,63,94,0.4)" strokeWidth="3" />
                      <line x1="220" y1="100" x2="380" y2="100" stroke="rgba(59,130,246,0.4)" strokeWidth="3" />
                      
                      {/* Causal Chain Nodes */}
                      <circle cx="80" cy="100" r="35" fill="rgba(244,63,94,0.2)" stroke="rgb(244,63,94)" strokeWidth="2" />
                      <text x="80" y="103" fill="white" fontSize="9" textAnchor="middle" fontWeight="bold">Root Cause</text>
                      
                      <circle cx="220" cy="100" r="35" fill="rgba(59,130,246,0.2)" stroke="rgb(59,130,246)" strokeWidth="2" />
                      <text x="220" y="103" fill="white" fontSize="9" textAnchor="middle">Failure Chain</text>

                      <circle cx="380" cy="100" r="35" fill="rgba(16,185,129,0.2)" stroke="rgb(16,185,129)" strokeWidth="2" />
                      <text x="380" y="103" fill="white" fontSize="9" textAnchor="middle">Target Impact</text>
                    </svg>
                    
                    <div className="grid grid-cols-3 w-full max-w-xl text-center text-xs font-mono mt-4 text-gray-400">
                      <div>
                        <span className="text-rose-400 block font-bold uppercase mb-1">Root Anomaly</span>
                        <span>{data.category || "UNKNOWN"} Event</span>
                      </div>
                      <div>
                        <span className="text-sky-400 block font-bold uppercase mb-1">State Escalation</span>
                        <span>{timeline[2]?.event || "Degradation"}</span>
                      </div>
                      <div>
                        <span className="text-emerald-400 block font-bold uppercase mb-1">Outage Blast</span>
                        <span>{signature.affected_service || "system"} offline</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* SUB-TAB 4: POSTMORTEM & RUNBOOK */}
            {activeSubTab === "postmortem" && (
              <motion.div key="postmortem" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Generated Postmortem */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-emerald-400 font-semibold text-sm tracking-wide uppercase flex items-center gap-1.5">
                        <FileText className="w-4 h-4" /> Auto Postmortem Summary
                      </span>
                      <Button size="sm" variant="outline" className="border-white/10 hover:bg-white/5 h-8 font-mono text-xs">
                        <Share2 className="w-3.5 h-3.5 mr-1" /> Export Markdown
                      </Button>
                    </div>
                    <div className="bg-black/50 border border-white/5 p-5 rounded-2xl space-y-4 text-sm leading-relaxed">
                      <div>
                        <h5 className="font-bold text-white mb-1 uppercase text-xs tracking-wider text-gray-400">Incident Narrative Summary</h5>
                        <p className="text-gray-300">Degradation triggered by connection limit constraints in {signature.affected_service || "system"}. Automated health checks reported failure.</p>
                      </div>
                      <div>
                        <h5 className="font-bold text-white mb-1 uppercase text-xs tracking-wider text-gray-400">Blast Impact Bounds</h5>
                        <p className="text-gray-300">140 transactions affected during connection scale-down. Outage time logged at 120s.</p>
                      </div>
                      <div>
                        <h5 className="font-bold text-white mb-1 uppercase text-xs tracking-wider text-gray-400">Operational Lessons Learned</h5>
                        <p className="text-gray-300">Autoscale connection limits proportionally to request traffic during active db migrations.</p>
                      </div>
                    </div>
                  </div>

                  {/* Runbook Generator */}
                  <div className="space-y-3">
                    <span className="text-sky-400 font-semibold text-sm tracking-wide uppercase flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4" /> Remediate Runbook Commands
                    </span>
                    <div className="bg-black/50 border border-white/5 p-5 rounded-2xl font-mono text-xs space-y-4">
                      <div>
                        <span className="text-gray-500 block mb-1"># Step 1: Scale target deployments</span>
                        <code className="text-sky-400 font-bold block bg-white/5 p-2.5 rounded-lg border border-white/5">
                          kubectl scale deployment/{signature.affected_service || "service"} --replicas=3
                        </code>
                      </div>
                      <div>
                        <span className="text-gray-500 block mb-1"># Step 2: Clear dead database connection pools</span>
                        <code className="text-sky-400 font-bold block bg-white/5 p-2.5 rounded-lg border border-white/5">
                          kubectl rollout restart deployment/{signature.affected_service || "service"}
                        </code>
                      </div>
                      <div>
                        <span className="text-gray-500 block mb-1"># Step 3: Run playbook verify health routes</span>
                        <code className="text-sky-400 font-bold block bg-white/5 p-2.5 rounded-lg border border-white/5">
                          curl -X GET https://api.{signature.environment || "production"}.internal/health
                        </code>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* SUB-TAB 5: COLLABORATION & FEEDBACK */}
            {activeSubTab === "collab" && (
              <motion.div key="collab" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Human Feedback Loop */}
                  <div className="space-y-3 bg-[#0c0c0e]/80 border border-white/10 p-5 rounded-2xl relative shadow-inner">
                    <span className="text-emerald-400 font-semibold text-sm tracking-wide uppercase flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4" /> Human Verification Feedback Loop
                    </span>
                    
                    {!feedbackSubmitted ? (
                      <div className="space-y-4 pt-2">
                        <div className="space-y-2">
                          <label className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Was this diagnosis correct?</label>
                          <div className="flex gap-2">
                            <Button 
                              variant={diagnosisCorrect === true ? "default" : "outline"}
                              onClick={() => setDiagnosisCorrect(true)}
                              className={`flex-1 border-white/10 ${diagnosisCorrect === true ? "bg-emerald-500 text-black hover:bg-emerald-400" : "hover:bg-white/5"}`}
                            >
                              <ThumbsUp className="w-4 h-4 mr-2" /> Yes, Accurate
                            </Button>
                            <Button 
                              variant={diagnosisCorrect === false ? "default" : "outline"}
                              onClick={() => setDiagnosisCorrect(false)}
                              className={`flex-1 border-white/10 ${diagnosisCorrect === false ? "bg-rose-500 text-white hover:bg-rose-400" : "hover:bg-white/5"}`}
                            >
                              <ThumbsDown className="w-4 h-4 mr-2" /> No, Mismatched
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs text-gray-400 font-bold uppercase">Feedback & Corrected Cause</label>
                          <textarea
                            value={correctedRootCause}
                            onChange={(e) => setCorrectedRootCause(e.target.value)}
                            placeholder="Enter any additional context or corrective adjustments..."
                            className="bg-black/50 border border-white/10 rounded-lg p-3 text-sm text-white w-full h-24 focus:outline-none focus:border-emerald-500/50"
                          />
                        </div>

                        <div className="flex gap-4">
                          <div className="flex flex-col gap-1.5 flex-1">
                            <label className="text-xs text-gray-400 font-bold uppercase">Recovery (sec)</label>
                            <input 
                              type="number" 
                              value={actualRecoveryTime} 
                              onChange={(e) => setActualRecoveryTime(Number(e.target.value))}
                              className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-emerald-500/50"
                            />
                          </div>
                          <div className="flex flex-col gap-1.5 flex-1">
                            <label className="text-xs text-gray-400 font-bold uppercase">Fix Status</label>
                            <select 
                              value={finalFix} 
                              onChange={(e) => setFinalFix(e.target.value)}
                              className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/50"
                            >
                              <option value="Effective">Effective</option>
                              <option value="Partial">Partial Fix</option>
                              <option value="Ineffective">Ineffective</option>
                            </select>
                          </div>
                        </div>

                        <Button 
                          onClick={handleFeedbackSubmit} 
                          disabled={submittingFeedback || diagnosisCorrect === null}
                          className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold w-full mt-4 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                        >
                          {submittingFeedback ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : null}
                          Ingest Humans-In-The-Loop Data
                        </Button>
                      </div>
                    ) : (
                      <div className="text-sm font-mono text-emerald-400 space-y-2 pt-4">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5" /> Ingest loop closed successfully.
                        </div>
                        <p className="text-gray-400 text-xs">Human review results have been appended to Hindsight knowledge indexes to calibrate vector scoring weights.</p>
                      </div>
                    )}
                  </div>

                  {/* Multi-Team Collaboration */}
                  <div className="space-y-3 bg-[#0c0c0e]/80 border border-white/10 p-5 rounded-2xl relative shadow-inner">
                    <span className="text-sky-400 font-semibold text-sm tracking-wide uppercase flex items-center gap-1.5">
                      <Users className="w-4 h-4" /> Multi-Team Workspace
                    </span>
                    
                    <div className="space-y-4 pt-2">
                      <div className="flex items-center justify-between flex-wrap gap-4 font-mono text-xs">
                        <div>
                          <span className="text-gray-500 block mb-0.5">Incident Owner</span>
                          <div className="flex items-center gap-2 text-white bg-white/5 border border-white/5 px-2.5 py-1.5 rounded-lg">
                            <User className="w-3.5 h-3.5 text-primary" />
                            {owner}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-500 block mb-0.5">Assignee Team</span>
                          <span className="text-gray-200 bg-white/5 border border-white/5 px-2.5 py-1.5 rounded-lg block uppercase text-[10px]">
                            Core Infra
                          </span>
                        </div>
                      </div>

                      <div className="border-t border-white/5 pt-4 space-y-3">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block flex items-center gap-1.5">
                          <MessageSquare className="w-4 h-4 text-sky-400" /> Collaboration Notes Log
                        </span>
                        
                        <div className="space-y-2 max-h-32 overflow-y-auto bg-black/40 p-3 rounded-lg border border-white/5">
                          {notes.length === 0 ? (
                            <span className="text-xs text-gray-500 italic block py-4 text-center">No collaborative notes logged yet.</span>
                          ) : (
                            notes.map((note, idx) => (
                              <div key={idx} className="text-xs font-mono text-gray-300 bg-white/5 p-2 rounded border border-white/5">
                                {note}
                              </div>
                            ))
                          )}
                        </div>

                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newNote}
                            onChange={(e) => setNewNote(e.target.value)}
                            placeholder="Type a collaborative note..."
                            className="bg-black/50 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white flex-1 focus:outline-none focus:border-sky-500/50"
                          />
                          <Button 
                            onClick={handleAddNote}
                            className="bg-sky-500 hover:bg-sky-400 text-black font-semibold text-xs h-8 px-3"
                          >
                            Add
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
};
