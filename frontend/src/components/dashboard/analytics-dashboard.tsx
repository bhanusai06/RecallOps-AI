"use client";

import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, BarChart3, PieChart, TrendingUp, TrendingDown, Target, BrainCircuit } from "lucide-react";
import { motion, useSpring, useTransform } from "framer-motion";

const AnimatedNumber = ({ value, prefix = "", suffix = "", decimals = 0 }: { value: number, prefix?: string, suffix?: string, decimals?: number }) => {
  const springValue = useSpring(0, { bounce: 0, duration: 2000 });
  
  useEffect(() => {
    springValue.set(value);
  }, [value, springValue]);

  const displayValue = useTransform(springValue, (current) => {
    return `${prefix}${current.toFixed(decimals)}${suffix}`;
  });

  return <motion.span>{displayValue}</motion.span>;
};

export const AnalyticsDashboard = ({ demoHistory }: { demoHistory: string[] }) => {
  // Derive stats based on the length of demoHistory to simulate live growth
  const numIncidents = demoHistory.length;
  
  const avgQuality = numIncidents === 0 ? 0 : numIncidents === 1 ? 62 : numIncidents === 2 ? 71 : 79;
  const avgResolutionTime = numIncidents === 0 ? 0 : numIncidents === 1 ? 3200 : numIncidents === 2 ? 2000 : 1300;
  const costSaved = numIncidents === 0 ? 0 : numIncidents === 1 ? 0 : numIncidents === 2 ? 0.044 : 0.089;
  const reuseRate = numIncidents === 0 ? 0 : numIncidents === 1 ? 0 : numIncidents === 2 ? 50 : 66;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
      className="mt-12 mb-20 space-y-6"
    >
      <motion.h2 variants={itemVariants} className="text-2xl font-bold text-white mb-6 flex items-center">
        <TrendingUp className="w-6 h-6 mr-3 text-primary" />
        Platform Analytics & ROI
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1 */}
        <motion.div variants={itemVariants}>
          <Card className="bg-black/40 border-white/10 backdrop-blur-md h-full hover:bg-black/60 transition-colors shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                Avg Memory Quality
                <BrainCircuit className="w-4 h-4 text-emerald-400" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">
                <AnimatedNumber value={avgQuality} /> <span className="text-base text-gray-500 font-normal">/ 100</span>
              </div>
              <p className="text-xs text-emerald-400 mt-1 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" /> +{numIncidents > 1 ? 12 : 0}% vs last week
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Metric 2 */}
        <motion.div variants={itemVariants}>
          <Card className="bg-black/40 border-white/10 backdrop-blur-md h-full hover:bg-black/60 transition-colors shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                Avg LLM Resolution Time
                <BarChart3 className="w-4 h-4 text-blue-400" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">
                <AnimatedNumber value={avgResolutionTime / 1000} decimals={1} suffix="s" />
              </div>
              <p className="text-xs text-blue-400 mt-1 flex items-center">
                <TrendingDown className="w-3 h-3 mr-1" /> -{numIncidents > 1 ? 40 : 0}% vs last week
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Metric 3 */}
        <motion.div variants={itemVariants}>
          <Card className="bg-black/40 border-white/10 backdrop-blur-md h-full hover:bg-black/60 transition-colors shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                Cascade Cost Saved
                <PieChart className="w-4 h-4 text-orange-400" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">
                <AnimatedNumber value={costSaved} prefix="$" decimals={3} />
              </div>
              <p className="text-xs text-orange-400 mt-1 flex items-center">
                By reusing memory & models
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Metric 4 */}
        <motion.div variants={itemVariants}>
          <Card className="bg-black/40 border-white/10 backdrop-blur-md h-full hover:bg-black/60 transition-colors shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                Memory Reuse Rate
                <Target className="w-4 h-4 text-fuchsia-400" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">
                <AnimatedNumber value={reuseRate} suffix="%" />
              </div>
              <p className="text-xs text-fuchsia-400 mt-1 flex items-center">
                Incidents resolved via Hindsight
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <motion.div variants={itemVariants}>
          <Card className="bg-black/40 border-white/10 backdrop-blur-md hover:bg-black/60 transition-colors shadow-lg">
            <CardHeader>
              <CardTitle className="text-base text-gray-200 flex items-center">
                <LineChart className="w-4 h-4 mr-2 text-primary" />
                Knowledge Growth
              </CardTitle>
            </CardHeader>
            <CardContent className="h-48 flex items-end justify-between px-6 pb-2 gap-2">
              {/* Animated Bar Chart */}
              {[20, 35, 30, 45, 62, 71, 79, 94].slice(0, 4 + numIncidents).map((val, i) => (
                <motion.div 
                  key={i} 
                  initial={{ height: 0 }}
                  whileInView={{ height: `${val}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: i * 0.1, type: "spring" }}
                  className="w-full bg-primary/20 rounded-t-sm relative group hover:bg-primary/40 transition-colors" 
                >
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity">{val}</div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Card className="bg-black/40 border-white/10 backdrop-blur-md hover:bg-black/60 transition-colors shadow-lg">
            <CardHeader>
              <CardTitle className="text-base text-gray-200 flex items-center">
                <PieChart className="w-4 h-4 mr-2 text-emerald-400" />
                Model Usage Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="h-48 flex items-center justify-center gap-12">
              <motion.div 
                initial={{ rotate: -90, scale: 0.8, opacity: 0 }}
                whileInView={{ rotate: 45, scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, type: "spring", bounce: 0.3 }}
                className="w-32 h-32 rounded-full border-[16px] border-emerald-500/80 border-r-fuchsia-500/80 border-b-fuchsia-500/80 relative"
              >
                <div className="absolute inset-0 flex items-center justify-center -rotate-45">
                  <span className="text-xl font-bold text-white">{numIncidents}</span>
                </div>
              </motion.div>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-300">
                  <div className="w-3 h-3 bg-emerald-500 mr-2 rounded-sm shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                  Premium (GPT-4)
                </div>
                <div className="flex items-center text-sm text-gray-300">
                  <div className="w-3 h-3 bg-fuchsia-500 mr-2 rounded-sm shadow-[0_0_8px_rgba(217,70,239,0.5)]"></div>
                  Cheap (Gemini)
                </div>
                <div className="flex items-center text-sm text-gray-300">
                  <div className="w-3 h-3 bg-white/20 mr-2 rounded-sm"></div>
                  Cache Hit
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}

