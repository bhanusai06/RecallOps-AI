"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AnalyzeResponse } from "@/types/api";
import { Activity, Clock, Coins, Database, Target } from "lucide-react";
import { motion, useSpring, useTransform } from "framer-motion";

// Helper component to animate numbers
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

export const MetricsRow = ({ data }: { data: AnalyzeResponse }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      <Card className="bg-black/40 border-white/5 backdrop-blur-md hover:bg-black/60 transition-colors shadow-lg">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500 ring-1 ring-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.2)]">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Latency</p>
            <p className="text-lg font-semibold text-white">
              <AnimatedNumber value={data.pipeline.total_ms} suffix="ms" />
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-black/40 border-white/5 backdrop-blur-md hover:bg-black/60 transition-colors shadow-lg">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500 ring-1 ring-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Memory</p>
            <p className="text-lg font-semibold text-white">
              <AnimatedNumber value={data.memory.matches.length} suffix=" Hits" />
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-black/40 border-white/5 backdrop-blur-md hover:bg-black/60 transition-colors shadow-lg">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500 ring-1 ring-purple-500/20 shadow-[0_0_10px_rgba(168,85,247,0.2)]">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Est. Cost</p>
            <p className="text-lg font-semibold text-white">
              <AnimatedNumber value={data.routing.estimated_cost} prefix="$" decimals={3} />
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-black/40 border-white/5 backdrop-blur-md hover:bg-black/60 transition-colors shadow-lg">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500 ring-1 ring-orange-500/20 shadow-[0_0_10px_rgba(249,115,22,0.2)]">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Confidence</p>
            <p className="text-lg font-semibold text-white">
              <AnimatedNumber value={data.analysis.confidence * 100} suffix="%" decimals={0} />
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-black/40 border-white/5 backdrop-blur-md hover:bg-black/60 transition-colors shadow-lg">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="p-2 bg-rose-500/10 rounded-lg text-rose-500 ring-1 ring-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.2)]">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Risk</p>
            <p className="text-lg font-semibold text-white">{data.analysis.risk}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
