"use client";

import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnalyzeResponse } from "@/types/api";
import { Network, Zap, DollarSign, Clock, FastForward } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion, useSpring, useTransform } from "framer-motion";

const AnimatedNumber = ({ value, prefix = "", suffix = "", decimals = 0 }: { value: number, prefix?: string, suffix?: string, decimals?: number }) => {
  const springValue = useSpring(0, { bounce: 0, duration: 1500 });
  
  useEffect(() => {
    springValue.set(value);
  }, [value, springValue]);

  const displayValue = useTransform(springValue, (current) => {
    return `${prefix}${current.toFixed(decimals)}${suffix}`;
  });

  return <motion.span>{displayValue}</motion.span>;
};

export const RoutingCard = ({ data }: { data: AnalyzeResponse["routing"] }) => {
  const isCacheHit = data.selected_model === "cache-hit" || data.estimated_cost === 0;
  const isPremium = !isCacheHit && (data.selected_model.includes("gpt-4") || data.selected_model.includes("claude-3"));

  return (
    <Card className="bg-black/60 border-white/10 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] flex flex-col relative overflow-hidden">
      <CardHeader className="border-b border-white/5 pb-4 bg-gradient-to-r from-blue-500/10 to-transparent">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2 text-lg font-bold text-blue-400">
            <div className="p-2 bg-blue-500/20 rounded-xl ring-1 ring-blue-500/40">
              <Network className="w-5 h-5 text-blue-400" />
            </div>
            Model Routing
          </CardTitle>
          <Badge 
            variant="outline" 
            className={`px-3 py-1 font-mono tracking-wider shadow-sm ${
              isCacheHit ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10" :
              isPremium ? "border-purple-500/30 text-purple-400 bg-purple-500/10" : 
              "border-blue-500/30 text-blue-400 bg-blue-500/10"
            }`}
          >
            {isCacheHit ? "CACHE HIT" : isPremium ? "PREMIUM ROUTE" : "CHEAP ROUTE"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-5">
        
        <div className="space-y-1.5">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Selected Model</span>
          <div className={`flex items-center gap-2 text-white font-mono p-3 rounded-xl border w-fit shadow-inner ${
            isCacheHit ? "bg-emerald-500/10 border-emerald-500/20" : "bg-white/5 border-white/10"
          }`}>
            {isCacheHit ? <FastForward className="w-4 h-4 text-emerald-400" /> : <Zap className="w-4 h-4 text-amber-400" />}
            {data.selected_model}
          </div>
        </div>

        <div className="space-y-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Cascadeflow Reason</span>
          <p className="text-sm text-gray-300 bg-black/40 p-4 rounded-xl border border-white/5 shadow-inner">
            {data.reason}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
              <DollarSign className="w-3 h-3" /> Est. Cost
            </span>
            <p className={`text-xl font-bold ${isCacheHit ? "text-emerald-400" : "text-white"}`}>
              <AnimatedNumber value={data.estimated_cost} prefix="$" decimals={3} />
            </p>
          </div>
          <div className="space-y-1">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
              <Clock className="w-3 h-3" /> Est. Latency
            </span>
            <p className="text-xl font-bold text-white">
              <AnimatedNumber value={data.estimated_latency} suffix="s" decimals={2} />
            </p>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};
