import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnalysisInfo } from "@/types/api";
import { AlertTriangle, BookOpen, CheckCircle, Flame, ServerCrash } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const AnalysisCard = ({ data }: { data: AnalysisInfo }) => {
  return (
    <Card className="bg-black/60 border-white/10 backdrop-blur-xl shadow-2xl h-full flex flex-col">
      <CardHeader className="border-b border-white/5 pb-4">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2 text-xl font-bold text-white">
            <SparklesIcon className="w-5 h-5 text-primary" />
            AI Root Cause Analysis
          </CardTitle>
          <Badge variant={data.severity === "Critical" ? "destructive" : "secondary"} className="uppercase tracking-wider font-semibold">
            {data.severity} SEVERITY
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6 flex-1 flex flex-col gap-6">
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-rose-400 font-medium text-sm tracking-wide uppercase">
            <ServerCrash className="w-4 h-4" />
            Root Cause
          </div>
          <p className="text-white text-lg font-medium leading-relaxed bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl">
            {data.root_cause}
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary font-medium text-sm tracking-wide uppercase">
            <BookOpen className="w-4 h-4" />
            Resolution Playbook
          </div>
          <div className="bg-black/40 border border-white/10 p-5 rounded-xl">
            <p className="text-gray-300 font-mono text-sm leading-relaxed whitespace-pre-wrap">
              {data.playbook}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-auto">
          <div className="space-y-2 bg-white/5 border border-white/5 p-4 rounded-xl">
            <div className="flex items-center gap-2 text-emerald-400 font-medium text-sm tracking-wide uppercase">
              <CheckCircle className="w-4 h-4" />
              Recommendation
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">{data.recommendation}</p>
          </div>
          
          <div className="space-y-2 bg-white/5 border border-white/5 p-4 rounded-xl">
            <div className="flex items-center gap-2 text-orange-400 font-medium text-sm tracking-wide uppercase">
              <Flame className="w-4 h-4" />
              Blast Radius Summary
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">{data.summary}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const SparklesIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
  </svg>
);
