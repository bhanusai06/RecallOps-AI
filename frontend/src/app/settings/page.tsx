"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Key, Save, Network, UserCog, Check, Database, Trash2 } from "lucide-react";

export default function SettingsPage() {
  // SRE profile states
  const [name, setName] = useState("Alex Rivera");
  const [title, setTitle] = useState("On-Call SRE Lead");
  const [team, setTeam] = useState("Core Infrastructure");
  const [role, setRole] = useState("Lead Platform Eng");
  const [status, setStatus] = useState("Active On-Call");
  const [savedSuccess, setSavedSuccess] = useState(false);

  // API states
  const [hindsightKey, setHindsightKey] = useState("hk_live_8392jf02jf0293jf02");
  const [cascadeflowKey, setCascadeflowKey] = useState("cf_prod_9948274jfk20dkfj");
  const [openaiKey, setOpenaiKey] = useState("");
  const [routingThreshold, setRoutingThreshold] = useState("85");

  useEffect(() => {
    // Load SRE config from local storage if available
    const storedName = localStorage.getItem("sre_name");
    const storedTitle = localStorage.getItem("sre_title");
    const storedTeam = localStorage.getItem("sre_team");
    const storedRole = localStorage.getItem("sre_role");
    const storedStatus = localStorage.getItem("sre_status");

    if (storedName) setName(storedName);
    if (storedTitle) setTitle(storedTitle);
    if (storedTeam) setTeam(storedTeam);
    if (storedRole) setRole(storedRole);
    if (storedStatus) setStatus(storedStatus);

    // Load API keys
    const hk = localStorage.getItem("hindsight_key");
    const cf = localStorage.getItem("cascadeflow_key");
    const oa = localStorage.getItem("openai_key");
    const rt = localStorage.getItem("routing_threshold");

    if (hk) setHindsightKey(hk);
    if (cf) setCascadeflowKey(cf);
    if (oa) setOpenaiKey(oa);
    if (rt) setRoutingThreshold(rt);
  }, []);

  const handleSave = () => {
    // Save to local storage for top-nav profile sync
    localStorage.setItem("sre_name", name);
    localStorage.setItem("sre_title", title);
    localStorage.setItem("sre_team", team);
    localStorage.setItem("sre_role", role);
    localStorage.setItem("sre_status", status);

    localStorage.setItem("hindsight_key", hindsightKey);
    localStorage.setItem("cascadeflow_key", cascadeflowKey);
    localStorage.setItem("openai_key", openaiKey);
    localStorage.setItem("routing_threshold", routingThreshold);

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Platform Settings</h1>
        <p className="text-muted-foreground">Configure SRE profile metadata, AI integrations, and Hindsight routing rules.</p>
      </div>

      <div className="space-y-6">
        {/* SRE Profile Configuration (Required by User) */}
        <Card className="bg-[#0a0a0a]/80 border-white/10 backdrop-blur-xl shadow-xl">
          <CardHeader className="border-b border-white/5">
            <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
              <UserCog className="w-5 h-5 text-violet-400" />
              SRE On-Call Profile
            </CardTitle>
            <CardDescription>Update your SRE title, team details, and active on-call status.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="sre-name" className="text-gray-300">Full Name</Label>
                <Input 
                  id="sre-name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  className="bg-black/50 border-white/10 text-white" 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="sre-title" className="text-gray-300">On-Call Title</Label>
                <Input 
                  id="sre-title" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  className="bg-black/50 border-white/10 text-white" 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="sre-team" className="text-gray-300">Engineering Team</Label>
                <Input 
                  id="sre-team" 
                  value={team} 
                  onChange={(e) => setTeam(e.target.value)} 
                  className="bg-black/50 border-white/10 text-white" 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="sre-role" className="text-gray-300">Platform Role</Label>
                <Input 
                  id="sre-role" 
                  value={role} 
                  onChange={(e) => setRole(e.target.value)} 
                  className="bg-black/50 border-white/10 text-white" 
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="sre-status" className="text-gray-300">Active On-Call Status</Label>
              <select
                id="sre-status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="bg-black/50 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-primary/50"
              >
                <option value="Active On-Call">● Active On-Call</option>
                <option value="Backup On-Call">● Backup On-Call</option>
                <option value="Offline">● Offline</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* API Keys */}
        <Card className="bg-[#0a0a0a]/80 border-white/10 backdrop-blur-xl shadow-xl">
          <CardHeader className="border-b border-white/5">
            <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
              <Key className="w-5 h-5 text-amber-500" />
              API Integrations
            </CardTitle>
            <CardDescription>Manage credentials for external AI services.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="hindsight-key" className="text-gray-300">Hindsight Memory API Key</Label>
              <Input 
                id="hindsight-key" 
                type="password" 
                value={hindsightKey} 
                onChange={(e) => setHindsightKey(e.target.value)} 
                className="bg-black/50 border-white/10 text-white font-mono" 
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cascadeflow-key" className="text-gray-300">cascadeflow Routing API Key</Label>
              <Input 
                id="cascadeflow-key" 
                type="password" 
                value={cascadeflowKey} 
                onChange={(e) => setCascadeflowKey(e.target.value)} 
                className="bg-black/50 border-white/10 text-white font-mono" 
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="openai-key" className="text-gray-300">OpenAI API Key (Fallback)</Label>
              <Input 
                id="openai-key" 
                type="password" 
                value={openaiKey} 
                placeholder="sk-..." 
                onChange={(e) => setOpenaiKey(e.target.value)} 
                className="bg-black/50 border-white/10 text-white font-mono" 
              />
            </div>
          </CardContent>
        </Card>

        {/* Routing Thresholds */}
        <Card className="bg-[#0a0a0a]/80 border-white/10 backdrop-blur-xl shadow-xl">
          <CardHeader className="border-b border-white/5">
            <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
              <Network className="w-5 h-5 text-blue-500" />
              Model Routing Rules
            </CardTitle>
            <CardDescription>Configure when to use premium vs. cost-effective models.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="confidence-threshold" className="text-gray-300">Memory Confidence Threshold for Cheap Route (%)</Label>
              <Input 
                id="confidence-threshold" 
                type="number" 
                value={routingThreshold} 
                onChange={(e) => setRoutingThreshold(e.target.value)} 
                className="bg-black/50 border-white/10 text-white" 
              />
              <p className="text-xs text-muted-foreground">If Hindsight returns a memory match with &ge; {routingThreshold}% confidence, Gemini Flash will be used instead of GPT-4.</p>
            </div>
          </CardContent>
        </Card>

        {/* Database Management */}
        <Card className="bg-[#0a0a0a]/80 border-white/10 backdrop-blur-xl shadow-xl border-rose-500/20">
          <CardHeader className="border-b border-white/5">
            <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-rose-500" />
              Database Management
            </CardTitle>
            <CardDescription>Reset or clear SQLite incident history data.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div className="space-y-1">
                <span className="text-sm font-semibold text-white block">Truncate Incidents Table</span>
                <span className="text-xs text-muted-foreground block">This deletes all logged outages, resolution playbooks, and causal graphs. This action is irreversible.</span>
              </div>
              <Button 
                onClick={async () => {
                  if (confirm("Are you sure you want to delete all historical incidents and resolutions?")) {
                    try {
                      await axios.delete("http://localhost:8000/api/v1/incidents");
                      alert("Database cleared successfully.");
                    } catch (e) {
                      console.error("Failed to clear database:", e);
                      alert("Clear action failed. Confirm backend is online.");
                    }
                  }
                }}
                className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs h-9"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Wipe Incident History
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end items-center gap-4">
          {savedSuccess && (
            <span className="text-emerald-400 text-xs font-mono flex items-center gap-1">
              <Check className="w-4 h-4" /> Configuration saved successfully.
            </span>
          )}
          <Button 
            onClick={handleSave}
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_rgba(var(--primary),0.3)] font-bold"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Configuration
          </Button>
        </div>
      </div>
    </div>
  );
}
