"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Bell, Search, User, Zap, LogOut, Settings, ShieldAlert, Check, X, Menu,
  Activity, History, LayoutDashboard, PlusCircle, Archive, BookOpen, Network, BrainCircuit
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { cn } from "@/lib/utils";

const routes = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/?tab=dashboard", color: "text-sky-400" },
  { label: "New Incident", icon: PlusCircle, href: "/?tab=new", color: "text-emerald-400" },
  { label: "Incident History", icon: History, href: "/history", color: "text-violet-400" },
  { label: "Memory Vault", icon: Archive, href: "/?tab=vault", color: "text-amber-400" },
  { label: "Resolution Library", icon: BookOpen, href: "/?tab=resolutions", color: "text-sky-500" },
  { label: "Knowledge Graph", icon: Network, href: "/?tab=graph", color: "text-purple-400" },
  { label: "Predictive Engine", icon: ShieldAlert, href: "/?tab=predictive", color: "text-rose-400" },
  { label: "Analytics", icon: Activity, href: "/analytics", color: "text-pink-400" },
  { label: "Settings", icon: Settings, href: "/settings", color: "text-gray-400" },
];

export const TopNav = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "dashboard";
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [activeEnv, setActiveEnv] = useState<"Production" | "Staging">("Production");
  
  // Profile state synced with Settings page via localStorage
  const [sreProfile, setSreProfile] = useState({
    name: "Alex Rivera",
    title: "On-Call SRE Lead",
    team: "Core Infrastructure",
    role: "Lead Platform Eng",
    status: "Active On-Call"
  });

  useEffect(() => {
    const storedName = localStorage.getItem("sre_name");
    const storedTitle = localStorage.getItem("sre_title");
    const storedTeam = localStorage.getItem("sre_team");
    const storedRole = localStorage.getItem("sre_role");
    const storedStatus = localStorage.getItem("sre_status");

    if (storedName || storedTitle || storedTeam || storedRole || storedStatus) {
      setSreProfile({
        name: storedName || "Alex Rivera",
        title: storedTitle || "On-Call SRE Lead",
        team: storedTeam || "Core Infrastructure",
        role: storedRole || "Lead Platform Eng",
        status: storedStatus || "Active On-Call"
      });
    }
  }, [showProfile]); // Re-fetch from localStorage dynamically when profile card is opened!

  const [notifications, setNotifications] = useState([
    { id: 1, text: "High Risk Alert: auth-worker memory matches previous OOM signature.", time: "2m ago", read: false, tab: "predictive" },
    { id: 2, text: "DB connection pool growth warning on payments-svc.", time: "15m ago", read: false, tab: "predictive" },
    { id: 3, text: "Verification successful for incident inc-8930.", time: "1h ago", read: true, tab: "dashboard" }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotificationClick = (n: any) => {
    setNotifications(prev => prev.map(item => item.id === n.id ? { ...item, read: true } : item));
    setShowNotifications(false);
    router.push(`/?tab=${n.tab}`);
  };

  const handleClearNotifications = (e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications([]);
  };

  return (
    <div className="h-16 flex items-center justify-between border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-md px-4 md:px-6 z-50 sticky top-0">
      
      <div className="flex items-center gap-2 sm:gap-3 flex-1 sm:max-w-md mr-2">
        {/* Mobile Hamburger Trigger */}
        <button 
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="lg:hidden p-2 -ml-2 text-zinc-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors focus:outline-none"
        >
          {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        <div className="flex items-center w-full relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
          <Input 
            placeholder="Search..." 
            className="w-full bg-white/5 border-white/10 pl-9 focus-visible:ring-primary/50 text-sm h-9 rounded-full text-white"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const query = (e.target as HTMLInputElement).value;
                router.push(`/?tab=dashboard&search=${encodeURIComponent(query)}`);
              }
            }}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4 relative">
        {/* Environment Toggle Button */}
        <Badge 
          onClick={() => setActiveEnv(prev => prev === "Production" ? "Staging" : "Production")}
          variant="outline" 
          className="hidden md:flex gap-1 border-primary/30 text-primary bg-primary/10 hover:bg-primary/20 cursor-pointer select-none transition-colors"
        >
          <Zap className="w-3 h-3" />
          {activeEnv} Env
        </Badge>

        {/* Notifications Trigger */}
        <div className="relative">
          <button 
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfile(false);
              setShowMobileMenu(false);
            }}
            className={`p-2 rounded-full transition-colors relative ${
              showNotifications ? "bg-white/10 text-white" : "text-zinc-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-[#0a0a0a] border border-white/10 rounded-xl shadow-2xl p-4 z-50 backdrop-blur-xl space-y-3">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider">Alert Notifications</span>
                {notifications.length > 0 && (
                  <button 
                    onClick={handleClearNotifications}
                    className="text-[10px] text-zinc-500 hover:text-white font-mono"
                  >
                    Clear All
                  </button>
                )}
              </div>
              
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="text-xs text-zinc-500 italic py-4 text-center">No new notifications.</div>
                ) : (
                  notifications.map(n => (
                    <div 
                      key={n.id}
                      onClick={() => handleNotificationClick(n)}
                      className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                        n.read 
                          ? "bg-black/20 border-white/5 text-zinc-400" 
                          : "bg-white/5 border-white/10 text-zinc-200 hover:bg-white/10"
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <span className="font-semibold leading-normal">{n.text}</span>
                        {!n.read && <span className="w-1.5 h-1.5 bg-sky-400 rounded-full shrink-0 mt-1"></span>}
                      </div>
                      <span className="text-[10px] text-zinc-500 font-mono">{n.time}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile User Trigger */}
        <div className="relative">
          <button 
            onClick={() => {
              setShowProfile(!showProfile);
              setShowNotifications(false);
              setShowMobileMenu(false);
            }}
            className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-500 to-fuchsia-400 flex items-center justify-center cursor-pointer ring-2 ring-background border border-white/10 shadow-sm hover:opacity-95 transition-opacity focus:outline-none"
          >
            <User className="w-4 h-4 text-white" />
          </button>

          {/* Profile Dropdown */}
          {showProfile && (
            <div className="absolute right-0 mt-2 w-64 bg-[#0a0a0a] border border-white/10 rounded-xl shadow-2xl p-4 z-50 backdrop-blur-xl space-y-4">
              <div className="flex items-center gap-3 border-b border-white/5 pb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-violet-500 to-fuchsia-400 flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white leading-none">{sreProfile.name}</h4>
                  <span className="text-[10px] text-zinc-500 font-mono block mt-1">{sreProfile.title}</span>
                </div>
              </div>
              
              <div className="space-y-1 font-mono text-[11px] text-zinc-400">
                <div>Team: <span className="text-white">{sreProfile.team}</span></div>
                <div>Role: <span className="text-white">{sreProfile.role}</span></div>
                <div>Status: <span className="text-emerald-400 font-bold">● {sreProfile.status}</span></div>
              </div>

              <div className="border-t border-white/5 pt-2 flex flex-col gap-1">
                <button 
                  onClick={() => {
                    setShowProfile(false);
                    router.push("/settings");
                  }}
                  className="flex items-center gap-2 text-xs text-zinc-300 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors text-left"
                >
                  <Settings className="w-4 h-4" />
                  SRE Settings
                </button>
                <button 
                  onClick={() => {
                    setShowProfile(false);
                    localStorage.removeItem("sre_authenticated");
                    localStorage.removeItem("sre_name");
                    localStorage.removeItem("sre_role");
                    localStorage.removeItem("sre_team");
                    localStorage.removeItem("sre_status");
                    window.location.href = "/";
                  }}
                  className="flex items-center gap-2 text-xs text-rose-400 hover:text-rose-300 p-2 rounded-lg hover:bg-rose-500/10 transition-colors text-left"
                >
                  <LogOut className="w-4 h-4" />
                  End Session
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Sliding Drawer Navigation */}
      {showMobileMenu && (
        <div className="fixed inset-y-0 left-0 w-64 bg-[#0a0a0a] border-r border-white/10 z-50 shadow-2xl p-4 flex flex-col animate-in slide-in-from-left duration-200">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
            <Link 
              href="/?tab=dashboard" 
              onClick={() => setShowMobileMenu(false)}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center border border-violet-400/20">
                <BrainCircuit className="w-4 h-4 text-white" />
              </div>
              <span className="font-extrabold text-white text-lg">RecallOps</span>
            </Link>
            <button 
              onClick={() => setShowMobileMenu(false)}
              className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 space-y-1.5 overflow-y-auto">
            {routes.map((route) => {
              const routeTab = route.href.split("tab=")[1];
              const isActive = routeTab ? (currentTab === routeTab) : false;

              return (
                <Link
                  href={route.href}
                  key={route.href}
                  onClick={() => setShowMobileMenu(false)}
                  className={cn(
                    "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/5 rounded-lg transition-colors items-center gap-3",
                    isActive ? "text-white bg-white/10 border-l-2 border-primary" : "text-zinc-400"
                  )}
                >
                  <route.icon className={cn("w-5 h-5", route.color)} />
                  {route.label}
                </Link>
              );
            })}
          </div>

          <div className="border-t border-white/5 pt-4">
            <div className="flex items-center gap-3 p-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-500 to-fuchsia-400 flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="truncate">
                <span className="text-xs font-bold text-white block truncate leading-none">{sreProfile.name}</span>
                <span className="text-[10px] text-zinc-500 font-mono block mt-1">{sreProfile.status}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
