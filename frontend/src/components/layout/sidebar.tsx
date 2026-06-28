"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  Activity, History, LayoutDashboard, Settings, BrainCircuit, 
  PlusCircle, Archive, BookOpen, Network, ShieldAlert 
} from "lucide-react";

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/?tab=dashboard",
    color: "text-sky-400",
  },
  {
    label: "New Incident",
    icon: PlusCircle,
    href: "/?tab=new",
    color: "text-emerald-400",
  },
  {
    label: "Incident History",
    icon: History,
    href: "/history",
    color: "text-violet-400",
  },
  {
    label: "Memory Vault",
    icon: Archive,
    href: "/?tab=vault",
    color: "text-amber-400",
  },
  {
    label: "Resolution Library",
    icon: BookOpen,
    href: "/?tab=resolutions",
    color: "text-sky-500",
  },
  {
    label: "Knowledge Graph",
    icon: Network,
    href: "/?tab=graph",
    color: "text-purple-400",
  },
  {
    label: "Predictive Engine",
    icon: ShieldAlert,
    href: "/?tab=predictive",
    color: "text-rose-400",
  },
  {
    label: "Analytics",
    icon: Activity,
    href: "/analytics",
    color: "text-pink-400",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/settings",
    color: "text-gray-400",
  },
];

export const Sidebar = () => {
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "dashboard";

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-[#0a0a0a] border-r border-white/5 w-64 text-white shrink-0">
      <div className="px-3 py-2 flex-1">
        <Link href="/?tab=dashboard" className="flex items-center gap-3 pl-3 mb-10 hover:opacity-90 transition-opacity">
          <div className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-tr from-primary/30 to-violet-500/30 border border-primary/45 shadow-[0_0_20px_rgba(var(--primary),0.3)] group overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(var(--primary),0.2),transparent_70%)] animate-pulse" />
            <svg className="w-6 h-6 text-primary relative z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.467 5.99 5.99 0 0 0-1.925 3.546 5.974 5.974 0 0 1-2.133-1A3.75 3.75 0 0 0 12 18Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18V9.75M12 9.75a3.75 3.75 0 1 1-6 0 3.75 3.75 0 0 1 6 0ZM12 9.75a3.75 3.75 0 1 0 6 0 3.75 3.75 0 0 0-6 0Z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="text-xl font-black tracking-tight text-white">Recall</span>
              <span className="text-xl font-medium tracking-wide text-primary">Ops</span>
            </div>
            <span className="text-[9px] uppercase font-mono text-gray-500 tracking-widest font-semibold -mt-1">Incident Engine</span>
          </div>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => {
            // Check active status
            const routeTab = route.href.split("tab=")[1];
            const isActive = routeTab ? (currentTab === routeTab) : false;

            return (
              <Link
                href={route.href}
                key={route.href}
                className={cn(
                  "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200",
                  isActive ? "text-white bg-white/10 shadow-sm border-l-2 border-primary" : "text-zinc-400"
                )}
              >
                <div className="flex items-center flex-1">
                  <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                  {route.label}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};
