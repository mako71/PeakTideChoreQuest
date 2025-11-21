import { USERS } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Medal, Crown } from "lucide-react";
import { cn } from "@/lib/utils";

export function Leaderboard() {
  const sortedUsers = [...USERS].sort((a, b) => b.xp - a.xp);

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader className="pb-2 px-0">
        <CardTitle className="text-lg font-bold flex items-center gap-2 uppercase tracking-wider font-display">
          <Trophy className="w-5 h-5 text-accent" />
          Summit Ranking
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0 space-y-4">
        {sortedUsers.map((user, index) => (
          <div 
            key={user.id}
            className={cn(
              "relative flex items-center gap-4 p-3 rounded-xl border transition-all hover:bg-accent/5",
              index === 0 ? "bg-gradient-to-r from-accent/10 to-transparent border-accent/50" : "bg-card border-border"
            )}
          >
            {/* Rank Badge */}
            <div className={cn(
              "flex items-center justify-center w-8 h-8 rounded-full font-tech font-bold text-sm border-2",
              index === 0 ? "bg-accent text-white border-accent" : 
              index === 1 ? "bg-muted text-foreground border-muted-foreground" :
              index === 2 ? "bg-orange-900/20 text-orange-700 border-orange-700/30 dark:text-orange-400" : "bg-transparent border-transparent text-muted-foreground"
            )}>
              {index === 0 ? <Crown className="w-4 h-4" /> : index + 1}
            </div>

            {/* Avatar */}
            <div className="relative">
              <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-background" />
              <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-0.5">
                <div className={cn("w-3 h-3 rounded-full border-2 border-background", 
                  user.streak > 3 ? "bg-green-500" : "bg-gray-300"
                )} />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline">
                <h4 className="font-bold truncate">{user.name}</h4>
                <span className="font-tech font-bold text-sm text-primary">{user.xp} XP</span>
              </div>
              <div className="flex justify-between items-center text-xs text-muted-foreground mt-0.5">
                <span>Lvl {user.level} • {user.title}</span>
                <span className="flex items-center gap-1 text-orange-500 font-medium">
                   <span className="inline-block w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                   {user.streak} day streak
                </span>
              </div>
              
              {/* XP Bar */}
              <div className="mt-2 h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-secondary rounded-full" 
                  style={{ width: `${(user.xp % 1000) / 10}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
