"use client";

import { Bell, Search, User, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export const TopNav = () => {
  return (
    <div className="h-16 flex items-center justify-between border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-md px-6 z-50 sticky top-0">
      <div className="flex items-center w-full max-w-md relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search incident memory..." 
          className="w-full bg-white/5 border-white/10 pl-9 focus-visible:ring-primary/50 text-sm h-9 rounded-full"
        />
      </div>
      <div className="flex items-center gap-4">
        <Badge variant="outline" className="hidden md:flex gap-1 border-primary/30 text-primary bg-primary/10 hover:bg-primary/20 cursor-default">
          <Zap className="w-3 h-3" />
          Production Env
        </Badge>
        <button className="relative p-2 text-muted-foreground hover:text-white hover:bg-white/10 rounded-full transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>
        </button>
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-500 to-orange-300 flex items-center justify-center cursor-pointer ring-2 ring-background border border-white/10 shadow-sm">
          <User className="w-4 h-4 text-white" />
        </div>
      </div>
    </div>
  );
};
