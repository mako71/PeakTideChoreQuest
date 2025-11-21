import { Link, useLocation } from "wouter";
import { Mountain, Compass, Map, Settings, User, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function Navigation() {
  const [location] = useLocation();

  const navItems = [
    { icon: Compass, label: "Dashboard", path: "/" },
    { icon: Map, label: "Quests", path: "/quests" },
    { icon: Mountain, label: "Profile", path: "/profile" },
    { icon: Settings, label: "Gear", path: "/settings" },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 bg-sidebar text-sidebar-foreground border-r border-sidebar-border p-4 z-50">
        <div className="flex items-center gap-3 px-2 mb-8 mt-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <Mountain className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl tracking-tight leading-none">Basecamp</h1>
            <p className="text-xs text-sidebar-foreground/60 font-tech uppercase tracking-wider">Household Ops</p>
          </div>
        </div>

        <nav className="space-y-2 flex-1">
          {navItems.map((item) => (
            <Link key={item.path} href={item.path}>
              <div className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 group",
                location === item.path 
                  ? "bg-sidebar-primary text-white shadow-md shadow-primary/10" 
                  : "hover:bg-sidebar-accent text-sidebar-foreground/80 hover:text-white"
              )}>
                <item.icon className={cn("w-5 h-5", location === item.path ? "text-white" : "text-sidebar-foreground/60 group-hover:text-white")} />
                <span className="font-medium text-sm">{item.label}</span>
              </div>
            </Link>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-sidebar-border">
           <div className="bg-sidebar-accent/50 rounded-xl p-4 mb-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 opacity-10">
                <Mountain className="w-16 h-16" />
              </div>
              <p className="text-xs font-bold text-sidebar-foreground/60 mb-1 uppercase">Current Season</p>
              <h3 className="font-display font-bold text-lg mb-2">Winter Summit</h3>
              <div className="w-full bg-sidebar-border h-1.5 rounded-full overflow-hidden">
                <div className="bg-accent h-full w-[65%]" />
              </div>
              <p className="text-[10px] text-right mt-1 text-sidebar-foreground/50">12 Days Left</p>
           </div>
           
           <Button className="w-full bg-accent hover:bg-accent/90 text-white font-bold shadow-lg shadow-accent/20">
             <PlusCircle className="w-4 h-4 mr-2" />
             New Quest
           </Button>
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-sidebar border-t border-sidebar-border z-50 pb-safe">
        <div className="flex justify-around items-center p-2">
          {navItems.map((item) => (
            <Link key={item.path} href={item.path}>
              <div className={cn(
                "flex flex-col items-center justify-center p-2 rounded-lg min-w-[64px] gap-1 transition-colors",
                location === item.path ? "text-primary" : "text-muted-foreground"
              )}>
                <item.icon className={cn("w-6 h-6", location === item.path && "fill-current/20")} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
