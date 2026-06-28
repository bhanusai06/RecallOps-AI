"use client";

import React, { useState, useEffect } from "react";
import { 
  BrainCircuit, Key, Lock, User, Terminal, ChevronRight, ShieldCheck, 
  ShieldAlert, Activity, LayoutDashboard, Settings, PlusCircle, Network, LogIn, Check, Info, X, UserPlus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

// Default seed users for immediate demonstration
const DEFAULT_USERS = [
  { username: "alex", name: "Alex Rivera", role: "Lead Platform Eng", team: "Core Infrastructure", password: "admin" },
  { username: "jordan", name: "Jordan Lee", role: "SecOps Specialist", team: "Security Operations", password: "admin" },
  { username: "taylor", name: "Taylor Smith", role: "Cloud Infrastructure Eng", team: "Site Reliability", password: "admin" },
];

export const AuthGate = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [activeForm, setActiveForm] = useState<"signin" | "signup">("signin");
  
  // Sign In inputs
  const [signInUser, setSignInUser] = useState("");
  const [signInPass, setSignInPass] = useState("");

  // Sign Up / Registration inputs
  const [regName, setRegName] = useState("");
  const [regUser, setRegUser] = useState("");
  const [regRole, setRegRole] = useState("Site Reliability Eng");
  const [regTeam, setRegTeam] = useState("Core Platform");
  const [regPass, setRegPass] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const authStatus = localStorage.getItem("sre_authenticated");
    setIsAuthenticated(authStatus === "true");

    // Seed default users if none exist in localStorage
    if (!localStorage.getItem("sre_registered_users")) {
      localStorage.setItem("sre_registered_users", JSON.stringify(DEFAULT_USERS));
    }
  }, []);

  const getRegisteredUsers = () => {
    try {
      const data = localStorage.getItem("sre_registered_users");
      if (!data) return DEFAULT_USERS;
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        return parsed.filter((u: any) => u && typeof u.username === "string");
      }
      return DEFAULT_USERS;
    } catch (err) {
      console.error("Failed to parse SRE user database, resetting:", err);
      return DEFAULT_USERS;
    }
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const users = getRegisteredUsers();
    const cleanSignInName = signInUser.trim().toLowerCase();
    const match = users.find(
      (u: any) => u && typeof u.username === "string" && (
        u.username.toLowerCase() === cleanSignInName || 
        u.name.toLowerCase() === cleanSignInName
      )
    );

    if (!match) {
      setError("User profile not found. Register a new account first!");
      return;
    }

    if (signInPass !== match.password) {
      setError("Incorrect password.");
      return;
    }

    // Save session credentials
    localStorage.setItem("sre_authenticated", "true");
    localStorage.setItem("sre_name", match.name);
    localStorage.setItem("sre_role", match.role);
    localStorage.setItem("sre_team", match.team);
    localStorage.setItem("sre_status", "Active On-Call");

    setIsAuthenticated(true);
    setShowLoginModal(false);
    window.location.reload();
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const cleanName = regName.trim();
    const cleanUser = regUser.trim().toLowerCase();
    const cleanPass = regPass.trim();

    if (!cleanName || !cleanUser || !cleanPass) {
      setError("Please fill in all required fields.");
      return;
    }

    // Password validation
    const hasLowerCase = /[a-z]/.test(cleanPass);
    const hasUpperCase = /[A-Z]/.test(cleanPass);
    const hasNumber = /\d/.test(cleanPass);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(cleanPass);

    if (!hasLowerCase || !hasUpperCase || !hasNumber || !hasSpecialChar) {
      setError("Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character (e.g., @, #, $, *).");
      return;
    }

    const users = getRegisteredUsers();
    const exists = users.some((u: any) => u && typeof u.username === "string" && u.username.toLowerCase() === cleanUser);

    if (exists) {
      setError(`The username "${cleanUser}" is already taken. Please choose a different username, or go to the Sign In tab if you already have an account.`);
      return;
    }

    const newUser = {
      username: cleanUser,
      name: cleanName,
      role: regRole.trim() || "Site Reliability Eng",
      team: regTeam.trim() || "Core Platform",
      password: cleanPass,
    };

    const updatedUsers = [...users, newUser];
    localStorage.setItem("sre_registered_users", JSON.stringify(updatedUsers));

    setSuccess("Account registered! Signing you in...");

    // Auto log in after registration
    localStorage.setItem("sre_authenticated", "true");
    localStorage.setItem("sre_name", newUser.name);
    localStorage.setItem("sre_role", newUser.role);
    localStorage.setItem("sre_team", newUser.team);
    localStorage.setItem("sre_status", "Active On-Call");

    setTimeout(() => {
      setIsAuthenticated(true);
      setShowLoginModal(false);
      window.location.reload();
    }, 1500);
  };

  if (isAuthenticated === null) {
    return (
      <div className="h-screen w-screen bg-[#020202] flex items-center justify-center">
        <BrainCircuit className="w-12 h-12 text-violet-500 animate-pulse" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen w-screen bg-[#020202] text-white flex flex-col relative overflow-x-hidden">
      
      {/* Background Decorative Blur Gradients */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] rounded-full bg-fuchsia-600/10 blur-[120px] pointer-events-none" />

      {/* Public Navbar Header */}
      <header className="h-16 flex items-center justify-between border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-md px-6 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 border border-violet-400/40">
            <BrainCircuit className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-0.5">
              <span className="text-xl font-black tracking-tight text-white">Recall</span>
              <span className="text-xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Ops</span>
            </div>
            <span className="text-[8px] uppercase font-mono text-zinc-500 tracking-[0.2em] font-semibold -mt-0.5">Incident Engine</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/5 text-xs">
            ● System Public Dashboard
          </Badge>
          <Button 
            onClick={() => {
              setActiveForm("signin");
              setShowLoginModal(true);
            }}
            className="bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs h-9 px-4 shadow-[0_0_15px_rgba(124,58,237,0.4)]"
          >
            <LogIn className="w-4 h-4 mr-2" />
            SRE Terminal Login
          </Button>
        </div>
      </header>

      {/* Main Public Landing Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 space-y-8 z-10">
        
        {/* Banner Announcement */}
        <div className="bg-gradient-to-r from-violet-950/30 via-[#0a0a0a] to-[#0a0a0a] border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2 max-w-2xl">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
              AI Incident Memory Terminal
            </h1>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Authenticate to access live telemetry feeds, upload Kubernetes cluster logs, visualize interactive outage timelines, and generate SRE playbooks.
            </p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline"
              onClick={() => {
                setActiveForm("signup");
                setShowLoginModal(true);
              }}
              className="border-white/10 hover:bg-white/5 text-white font-extrabold px-5 h-11 text-xs"
            >
              <UserPlus className="w-4 h-4 mr-2" /> Create Account
            </Button>
            <Button 
              onClick={() => {
                setActiveForm("signin");
                setShowLoginModal(true);
              }}
              className="bg-white hover:bg-zinc-200 text-black font-extrabold px-6 h-11 text-xs"
            >
              Access Terminal <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>

        {/* Public Mock Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Side: Mock outline of SRE terminal options */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Locked Upload Card Preview */}
            <Card className="bg-[#0a0a0a]/50 border-white/5 opacity-80 relative overflow-hidden">
              <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-3 z-20 backdrop-blur-[2px]">
                <Lock className="w-8 h-8 text-violet-400 animate-bounce" />
                <span className="text-sm font-bold text-white uppercase tracking-wider">Authentication Required</span>
                <Button 
                  variant="outline" 
                  onClick={() => setShowLoginModal(true)}
                  className="border-white/20 bg-white/5 hover:bg-white/10 text-white text-xs h-8"
                >
                  Unlock Log Parser
                </Button>
              </div>
              <CardHeader>
                <CardTitle className="text-sm uppercase tracking-wider text-zinc-400">Ingest Incident Logs</CardTitle>
              </CardHeader>
              <CardContent className="h-40 bg-zinc-950/20"></CardContent>
            </Card>

            {/* Public Statistics Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-[#0a0a0a]/80 border-white/10 p-5 space-y-2">
                <span className="text-zinc-500 text-[10px] uppercase font-mono block">Memory Hit Rate</span>
                <span className="text-2xl font-black text-white block">82.4%</span>
                <span className="text-xs text-zinc-400 block">Hindsight memory matching accuracy</span>
              </Card>
              <Card className="bg-[#0a0a0a]/80 border-white/10 p-5 space-y-2">
                <span className="text-zinc-500 text-[10px] uppercase font-mono block">Average MTTR</span>
                <span className="text-2xl font-black text-white block">47 seconds</span>
                <span className="text-xs text-zinc-400 block">Mean Time to Outage Resolution</span>
              </Card>
              <Card className="bg-[#0a0a0a]/80 border-white/10 p-5 space-y-2">
                <span className="text-zinc-500 text-[10px] uppercase font-mono block">Saved Cloud Cost</span>
                <span className="text-2xl font-black text-white block">$1,480 / mo</span>
                <span className="text-xs text-zinc-400 block">By routing matches to cheaper models</span>
              </Card>
            </div>

            {/* Platform Capabilities Overview */}
            <div className="bg-[#0a0a0a]/80 border border-white/10 rounded-2xl p-6 space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Info className="w-5 h-5 text-violet-400" />
                RecallOps AI Platform Overview
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-zinc-400">
                <div className="space-y-1">
                  <span className="font-semibold text-white block">Incident Classification Layer</span>
                  <p className="text-xs">Classifies outage logs automatically (OOM, DB_TIMEOUT, CrashLoopBackOff) with exit codes, limiting false-positive retrieval matches.</p>
                </div>
                <div className="space-y-1">
                  <span className="font-semibold text-white block">Weighted Memory Retrieval</span>
                  <p className="text-xs">Weights vector embeddings, status indicators, and signatures for extremely precise incident similarity scoring.</p>
                </div>
                <div className="space-y-1">
                  <span className="font-semibold text-white block">Causal RCA Graph & Timelines</span>
                  <p className="text-xs">Provides animated SVG causal maps and step-by-step outage playbacks so SREs can visualize incident timelines.</p>
                </div>
                <div className="space-y-1">
                  <span className="font-semibold text-white block">Verification Loop</span>
                  <p className="text-xs">Integrates a human-in-the-loop validation form to save corrected root causes and recovery metrics back into memory.</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Side: Locked Incident Feed Panel */}
          <div className="space-y-6">
            
            {/* Locked Telemetry Feed */}
            <div className="bg-[#0b0b0d] border border-white/10 rounded-2xl p-5 relative overflow-hidden h-[400px]">
              <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-2 z-20 backdrop-blur-[2px] text-center p-4">
                <Lock className="w-7 h-7 text-rose-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider block">Telemetry Access Locked</span>
                <span className="text-[10px] text-zinc-500 block max-w-[180px]">Authenticate as SRE on-call lead to view live production streams.</span>
              </div>
              <h4 className="text-sm font-bold text-white mb-3 uppercase tracking-wider flex items-center gap-1.5 opacity-45">
                <Activity className="w-4 h-4 text-emerald-400" /> Live Telemetry Feed
              </h4>
            </div>

          </div>

        </div>

      </main>

      {/* Public Footer */}
      <footer className="border-t border-white/5 py-6 text-center text-xs text-zinc-600 bg-black z-10 mt-12">
        &copy; 2026 RecallOps AI Platforms, Inc. All rights reserved. Secure SRE Incident Intelligence.
      </footer>

      {/* SRE Gate Login & Registration Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="w-full max-w-md animate-in zoom-in-95 duration-200 relative">
            
            {/* Close Button */}
            <button 
              onClick={() => {
                setShowLoginModal(false);
                setError("");
                setSuccess("");
              }}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 hover:bg-white/5 rounded-lg transition-colors z-50"
            >
              <X className="w-5 h-5" />
            </button>

            <Card className="bg-[#0a0a0a] border-white/10 shadow-2xl p-4 md:p-6 w-full">
              <CardHeader className="space-y-1 pb-4">
                <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                  <Lock className="w-5 h-5 text-violet-400" />
                  SRE Gateway Portal
                </CardTitle>
                <div className="flex border-b border-white/5 mt-3">
                  <button
                    onClick={() => {
                      setActiveForm("signin");
                      setError("");
                      setSuccess("");
                    }}
                    className={`flex-1 text-center py-2 text-xs font-bold transition-all border-b-2 ${
                      activeForm === "signin" ? "border-violet-500 text-white" : "border-transparent text-zinc-500 hover:text-white"
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      setActiveForm("signup");
                      setError("");
                      setSuccess("");
                    }}
                    className={`flex-1 text-center py-2 text-xs font-bold transition-all border-b-2 ${
                      activeForm === "signup" ? "border-violet-500 text-white" : "border-transparent text-zinc-500 hover:text-white"
                    }`}
                  >
                    Create Account
                  </button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                
                {/* 1. SIGN IN FORM */}
                {activeForm === "signin" && (
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signin-user" className="text-zinc-300 text-xs">Username / Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                        <Input
                          id="signin-user"
                          placeholder="e.g. alex"
                          value={signInUser}
                          onChange={(e) => setSignInUser(e.target.value)}
                          className="bg-black/50 border-white/10 text-white pl-9 text-xs"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signin-pass" className="text-zinc-300 text-xs">Password</Label>
                      <div className="relative">
                        <Key className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                        <Input
                          id="signin-pass"
                          type="password"
                          placeholder="Password"
                          value={signInPass}
                          onChange={(e) => setSignInPass(e.target.value)}
                          className="bg-black/50 border-white/10 text-white pl-9 text-xs font-mono"
                          required
                        />
                      </div>
                    </div>

                    {error && (
                      <div className="text-rose-400 text-xs font-mono border border-rose-500/20 bg-rose-500/5 p-2.5 rounded-lg">
                        {error}
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowLoginModal(false)}
                        className="flex-1 border-white/10 text-zinc-400 hover:text-white hover:bg-white/5 font-semibold text-xs"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 bg-violet-600 hover:bg-violet-500 text-white font-bold shadow-[0_0_20px_rgba(124,58,237,0.3)] text-xs"
                      >
                        Sign In
                      </Button>
                    </div>
                  </form>
                )}

                {/* 2. SIGN UP / REGISTRATION FORM */}
                {activeForm === "signup" && (
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="reg-name" className="text-zinc-300 text-xs">Full Name *</Label>
                      <Input
                        id="reg-name"
                        placeholder="e.g. Alex Rivera"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        className="bg-black/50 border-white/10 text-white text-xs"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reg-user" className="text-zinc-300 text-xs">Username *</Label>
                      <Input
                        id="reg-user"
                        placeholder="e.g. alex"
                        value={regUser}
                        onChange={(e) => setRegUser(e.target.value)}
                        className="bg-black/50 border-white/10 text-white text-xs font-mono"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="reg-role" className="text-zinc-300 text-xs">Title / Role</Label>
                        <Input
                          id="reg-role"
                          value={regRole}
                          onChange={(e) => setRegRole(e.target.value)}
                          className="bg-black/50 border-white/10 text-white text-xs"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="reg-team" className="text-zinc-300 text-xs">Team</Label>
                        <Input
                          id="reg-team"
                          value={regTeam}
                          onChange={(e) => setRegTeam(e.target.value)}
                          className="bg-black/50 border-white/10 text-white text-xs"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reg-pass" className="text-zinc-300 text-xs">Create Password *</Label>
                      <Input
                        id="reg-pass"
                        type="password"
                        placeholder="Create Password"
                        value={regPass}
                        onChange={(e) => setRegPass(e.target.value)}
                        className="bg-black/50 border-white/10 text-white text-xs font-mono"
                        required
                      />
                    </div>

                    {error && (
                      <div className="text-rose-400 text-xs font-mono border border-rose-500/20 bg-rose-500/5 p-2.5 rounded-lg">
                        {error}
                      </div>
                    )}

                    {success && (
                      <div className="text-emerald-400 text-xs font-mono border border-emerald-500/20 bg-emerald-500/5 p-2.5 rounded-lg flex items-center gap-1.5">
                        <Check className="w-4 h-4" /> {success}
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowLoginModal(false)}
                        className="flex-1 border-white/10 text-zinc-400 hover:text-white hover:bg-white/5 font-semibold text-xs"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 bg-violet-600 hover:bg-violet-500 text-white font-bold shadow-[0_0_20px_rgba(124,58,237,0.3)] text-xs"
                      >
                        Register
                      </Button>
                    </div>
                  </form>
                )}

              </CardContent>
              <div className="border-t border-white/5 p-4 text-center">
                <button
                  onClick={() => {
                    localStorage.removeItem("sre_registered_users");
                    localStorage.removeItem("sre_authenticated");
                    alert("Local user registry has been cleared! The page will now reload.");
                    window.location.reload();
                  }}
                  className="text-[10px] text-zinc-500 hover:text-rose-400 font-mono transition-colors underline decoration-dotted underline-offset-4"
                >
                  Developer: Reset Accounts Registry
                </button>
              </div>
            </Card>

          </div>
        </div>
      )}

    </div>
  );
};
