"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Filter, AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const MOCK_HISTORY = [
  { id: "inc-8931", date: "2026-06-27 14:32:01", service: "payment-api", env: "production", severity: "Critical", status: "Resolved", root_cause: "Connection pool exhausted" },
  { id: "inc-8930", date: "2026-06-27 12:15:22", service: "auth-worker", env: "staging", severity: "Medium", status: "Resolved", root_cause: "JWKS token validation fail" },
  { id: "inc-8929", date: "2026-06-26 23:45:10", service: "checkout-ui", env: "production", severity: "High", status: "Reviewing", root_cause: "Vite client assets hash mismatch" },
  { id: "inc-8928", date: "2026-06-26 18:02:44", service: "notification-svc", env: "production", severity: "Low", status: "Resolved", root_cause: "SMTP gateway timeout" },
];

export default function HistoryPage() {
  const [incidents, setIncidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/v1/incidents");
        if (res.data && res.data.length > 0) {
          // Map to local layout
          const mapped = res.data.map((inc: any) => ({
            id: inc.id.substring(0, 8),
            date: inc.created_at.replace("T", " ").substring(0, 19),
            service: inc.signature?.affected_service || "unknown",
            env: inc.environment || "production",
            severity: inc.severity || "Critical",
            status: inc.verification_status === "Verified" ? "Resolved" : "Reviewing",
            root_cause: inc.root_cause || "Analyzing"
          }));
          setIncidents(mapped);
        } else {
          setIncidents(MOCK_HISTORY);
        }
      } catch (err) {
        console.error("Failed to load real incidents, falling back to mock history:", err);
        setIncidents(MOCK_HISTORY);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const filteredIncidents = incidents.filter(inc => 
    inc.id.toLowerCase().includes(search.toLowerCase()) ||
    inc.service.toLowerCase().includes(search.toLowerCase()) ||
    inc.root_cause.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Incident History</h1>
          <p className="text-muted-foreground">Review past AI analyses, root causes, and generated playbooks.</p>
        </div>
      </div>

      <div className="bg-[#0a0a0a]/80 border border-white/10 rounded-2xl shadow-xl backdrop-blur-xl overflow-hidden p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by ID, service, or root cause..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border-white/10 pl-9 focus-visible:ring-primary/50"
            />
          </div>
          <Button variant="outline" className="border-white/10 bg-black/50 hover:bg-white/10">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>

        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <RefreshCw className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="rounded-xl border border-white/10 overflow-hidden bg-black/40">
            <Table>
              <TableHeader className="bg-white/5 hover:bg-white/5">
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="text-gray-400">Incident ID</TableHead>
                  <TableHead className="text-gray-400">Date</TableHead>
                  <TableHead className="text-gray-400">Service</TableHead>
                  <TableHead className="text-gray-400">Root Cause</TableHead>
                  <TableHead className="text-gray-400">Severity</TableHead>
                  <TableHead className="text-gray-400 text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredIncidents.map((incident) => (
                  <TableRow key={incident.id} className="border-white/10 hover:bg-white/5 cursor-pointer transition-colors group">
                    <TableCell className="font-mono text-sm text-gray-300 group-hover:text-primary transition-colors">
                      {incident.id}
                    </TableCell>
                    <TableCell className="text-gray-400 text-sm">{incident.date}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-gray-300 text-sm">
                        <div className={`w-2 h-2 rounded-full ${incident.env === 'production' ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                        {incident.service}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300 text-sm font-medium">{incident.root_cause}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`
                        ${incident.severity?.toLowerCase() === 'critical' ? 'border-rose-500/30 text-rose-400 bg-rose-500/10' : ''}
                        ${incident.severity?.toLowerCase() === 'high' ? 'border-orange-500/30 text-orange-400 bg-orange-500/10' : ''}
                        ${incident.severity?.toLowerCase() === 'medium' ? 'border-amber-500/30 text-amber-400 bg-amber-500/10' : ''}
                        ${incident.severity?.toLowerCase() === 'low' ? 'border-blue-500/30 text-blue-400 bg-blue-500/10' : ''}
                      `}>
                        {incident.severity}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant={incident.status === 'Resolved' ? 'default' : 'secondary'} className={incident.status === 'Resolved' ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30' : ''}>
                        {incident.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
