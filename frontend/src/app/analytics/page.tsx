"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, Cell, PieChart, Pie } from 'recharts';

const latencyData = [
  { time: '00:00', ms: 1400 },
  { time: '04:00', ms: 1200 },
  { time: '08:00', ms: 2100 },
  { time: '12:00', ms: 3500 },
  { time: '16:00', ms: 1800 },
  { time: '20:00', ms: 1300 },
  { time: '24:00', ms: 1500 },
];

const modelUsage = [
  { name: 'Gemini Flash', count: 450, color: '#3b82f6' },
  { name: 'GPT-4 Turbo', count: 120, color: '#a855f7' },
  { name: 'Claude 3 Opus', count: 50, color: '#f97316' },
];

const memoryHits = [
  { name: 'Hindsight Hit', value: 82, color: '#10b981' },
  { name: 'Miss (Cold Start)', value: 18, color: '#ef4444' },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Platform Analytics</h1>
          <p className="text-muted-foreground">Monitor AI performance, memory retrieval rates, and pipeline cost optimization.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Memory Hit Rate */}
        <Card className="bg-[#0a0a0a]/80 border-white/10 backdrop-blur-xl shadow-xl">
          <CardHeader className="border-b border-white/5">
            <CardTitle className="text-lg font-bold text-white">Memory Hit Rate</CardTitle>
          </CardHeader>
          <CardContent className="p-6 h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={memoryHits}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {memoryHits.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#000', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Model Routing Distribution */}
        <Card className="bg-[#0a0a0a]/80 border-white/10 backdrop-blur-xl shadow-xl lg:col-span-2">
          <CardHeader className="border-b border-white/5">
            <CardTitle className="text-lg font-bold text-white">cascadeflow Model Routing</CardTitle>
          </CardHeader>
          <CardContent className="p-6 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={modelUsage} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                <XAxis type="number" stroke="#666" />
                <YAxis dataKey="name" type="category" stroke="#999" width={100} />
                <Tooltip 
                  cursor={{fill: 'rgba(255,255,255,0.05)'}}
                  contentStyle={{ backgroundColor: '#000', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {modelUsage.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pipeline Latency Trend */}
        <Card className="bg-[#0a0a0a]/80 border-white/10 backdrop-blur-xl shadow-xl lg:col-span-3">
          <CardHeader className="border-b border-white/5">
            <CardTitle className="text-lg font-bold text-white">Average Pipeline Latency (24h)</CardTitle>
          </CardHeader>
          <CardContent className="p-6 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={latencyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="time" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#000', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                />
                <Line type="monotone" dataKey="ms" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: "#000", strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
