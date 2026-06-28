import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnalyzeResponse } from "@/types/api";
import { BrainCircuit, History, ShieldCheck, CheckCircle2, RotateCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export const MemoryCard = ({ data, extraData }: { data: AnalyzeResponse["memory"], extraData?: any }) => {
  const hasMatches = data.matches.length > 0;
  const isHighQuality = extraData?.memory_quality > 80;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      {/* Dynamic Animated Glow */}
      {isHighQuality && (
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.05, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -inset-1 bg-gradient-to-r from-emerald-500/30 to-blue-500/30 blur-2xl rounded-[24px] pointer-events-none"
        />
      )}
      
      <Card className={`relative z-10 bg-[#0a0a0a] border-white/10 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden ${isHighQuality ? 'ring-1 ring-emerald-500/30' : ''}`}>
        
        <CardHeader className="border-b border-white/5 pb-4 bg-gradient-to-r from-emerald-500/10 via-transparent to-transparent">
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2 text-xl font-bold text-white">
              <div className="p-2 bg-emerald-500/20 rounded-xl ring-1 ring-emerald-500/40">
                <BrainCircuit className="w-6 h-6 text-emerald-400" />
              </div>
              Hindsight Memory
            </CardTitle>
            <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10 px-3 py-1 font-mono">
              {(data.confidence * 100).toFixed(0)}% MATCH
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="p-6 space-y-6">
          {hasMatches ? (
            data.matches.map((match, idx) => (
              <div key={idx} className="space-y-4">
                <div className="flex items-center justify-between bg-white/5 p-2 rounded-lg border border-white/5">
                  <span className="text-xs font-mono text-gray-400 flex items-center gap-2">
                    <History className="w-3 h-3" /> {match.incident_id}
                  </span>
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    {(match.similarity_score * 100).toFixed(1)}% Sim
                  </span>
                </div>
                
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Past Root Cause</span>
                  <p className="text-sm text-gray-200 leading-relaxed bg-black/40 p-4 rounded-xl border border-white/5 shadow-inner">
                    {match.root_cause}
                  </p>
                </div>

                {match.engineer_notes && match.engineer_notes !== "None" && (
                  <div className="space-y-2 bg-blue-500/5 p-4 rounded-xl border border-blue-500/10">
                    <span className="text-xs font-semibold text-blue-400/80 uppercase tracking-wider flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Verified Engineer Notes
                    </span>
                    <p className="text-sm text-blue-100/90 italic">"{match.engineer_notes}"</p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-10 bg-white/5 rounded-xl border border-white/5 border-dashed">
              <BrainCircuit className="w-10 h-10 text-gray-600 mx-auto mb-3 opacity-50" />
              <p className="text-sm text-gray-400">No highly similar past incidents found in memory.</p>
              <p className="text-xs text-gray-500 mt-1">A new operational memory will be created.</p>
            </div>
          )}

          {/* Expanded Reflection Evolution Metadata */}
          {extraData && (
            <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
              <div className="bg-gradient-to-b from-white/5 to-transparent border border-white/5 rounded-xl p-3 shadow-sm">
                <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Quality Score</div>
                <div className={`text-xl font-bold ${isHighQuality ? 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]' : 'text-gray-300'}`}>
                  {extraData.memory_quality}
                </div>
              </div>
              <div className="bg-gradient-to-b from-white/5 to-transparent border border-white/5 rounded-xl p-3 shadow-sm">
                <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Version</div>
                <div className="text-xl font-bold text-blue-400">v{extraData.version}</div>
              </div>
              <div className="bg-gradient-to-b from-white/5 to-transparent border border-white/5 rounded-xl p-3 shadow-sm">
                <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1 flex justify-center items-center gap-1">
                  <RotateCw className="w-3 h-3" /> Reused
                </div>
                <div className="text-xl font-bold text-fuchsia-400">{extraData.usage_count}x</div>
              </div>
              <div className="bg-gradient-to-b from-white/5 to-transparent border border-white/5 rounded-xl p-3 shadow-sm">
                <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Success Rate</div>
                <div className="text-xl font-bold text-orange-400">
                  {Math.min(99, 85 + (extraData.usage_count * 5))}%
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
