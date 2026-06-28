"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Key, Save, BrainCircuit, Network } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Platform Settings</h1>
        <p className="text-muted-foreground">Configure AI integrations, routing thresholds, and Hindsight memory access.</p>
      </div>

      <div className="space-y-6">
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
              <Input id="hindsight-key" type="password" defaultValue="hk_live_8392jf02jf0293jf02" className="bg-black/50 border-white/10 text-white font-mono" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cascadeflow-key" className="text-gray-300">cascadeflow Routing API Key</Label>
              <Input id="cascadeflow-key" type="password" defaultValue="cf_prod_9948274jfk20dkfj" className="bg-black/50 border-white/10 text-white font-mono" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="openai-key" className="text-gray-300">OpenAI API Key (Fallback)</Label>
              <Input id="openai-key" type="password" placeholder="sk-..." className="bg-black/50 border-white/10 text-white font-mono" />
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
              <Input id="confidence-threshold" type="number" defaultValue="85" className="bg-black/50 border-white/10 text-white" />
              <p className="text-xs text-muted-foreground">If Hindsight returns a memory match with &ge; 85% confidence, Gemini Flash will be used instead of GPT-4.</p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_rgba(var(--primary),0.3)]">
            <Save className="w-4 h-4 mr-2" />
            Save Configuration
          </Button>
        </div>
      </div>
    </div>
  );
}
