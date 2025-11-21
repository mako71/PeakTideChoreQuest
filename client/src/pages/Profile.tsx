import { Navigation } from "@/components/layout/Navigation";
import { ACHIEVEMENTS } from "@/lib/data";
import { Trophy, Flame, Star, Target, TrendingUp, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useMembers } from "@/lib/members-context";
import { useAuth } from "@/lib/auth-context";
import generatedMap from "@assets/generated_images/topographic_map_pattern_texture.png";

export default function Profile() {
  const { members } = useMembers();
  const { user } = useAuth();
  // Get current user's member profile
  const CURRENT_USER = members.find(m => m.userId === user?.id) || members[0] || { name: "Ranger", level: 1, xp: 0, streak: 0, title: "Adventurer", avatar: "" };
  // Calculate rank based on XP - only when we have valid data
  const rank = members.length > 0 && CURRENT_USER.xp !== undefined ? members.filter(m => m.xp > CURRENT_USER.xp).length + 1 : 1;
  
  const nextLevelXp = CURRENT_USER.level * 1000;
  const currentLevelXp = (CURRENT_USER.level - 1) * 1000;
  const xpToNextLevel = nextLevelXp - (CURRENT_USER.xp || 0);
  const levelProgress = ((CURRENT_USER.xp || 0 - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100;

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <Navigation />
      
      <main className="flex-1 md:ml-64 pb-20 md:pb-0 relative">
        <div 
          className="fixed inset-0 opacity-[0.03] pointer-events-none z-0 bg-repeat" 
          style={{ backgroundImage: `url(${generatedMap})`, backgroundSize: '400px' }}
        />
        
        <div className="relative z-10 max-w-4xl mx-auto p-4 md:p-8 space-y-8">
          
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 text-white shadow-lg">
            <div className="flex items-start gap-6 flex-col md:flex-row">
              <div className="flex-shrink-0">
                <img 
                  src={CURRENT_USER.avatar} 
                  alt={CURRENT_USER.name}
                  className="w-24 h-24 rounded-full border-4 border-white object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-4xl font-display font-bold">{CURRENT_USER.name}</h1>
                  <Badge className="bg-accent text-accent-foreground text-sm font-bold">LVL {CURRENT_USER.level}</Badge>
                </div>
                <p className="text-white/80 mb-4 font-medium italic">{CURRENT_USER.title}</p>
                <div className="flex gap-6">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5" />
                    <span className="font-tech font-bold text-lg">#{rank}</span>
                    <span className="text-sm opacity-90">Rank</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-orange-300" />
                    <span className="font-tech font-bold text-lg">{CURRENT_USER.streak || 0}</span>
                    <span className="text-sm opacity-90">Day Streak</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Stats */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* XP & Level Progress */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-primary" />
                    Experience & Progression
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Current Level XP</span>
                      <span className="font-tech font-bold text-primary">{CURRENT_USER.xp.toLocaleString()} XP</span>
                    </div>
                    <Progress value={levelProgress} indicatorClassName="bg-gradient-to-r from-primary to-secondary" />
                    <p className="text-xs text-muted-foreground mt-2">{xpToNextLevel.toLocaleString()} XP to next level</p>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
                      <p className="text-2xl font-bold text-primary">{CURRENT_USER.level}</p>
                      <p className="text-xs text-muted-foreground mt-1">Current Level</p>
                    </div>
                    <div className="bg-secondary/10 rounded-lg p-4 border border-secondary/20">
                      <p className="text-2xl font-bold text-secondary">{CURRENT_USER.xp}</p>
                      <p className="text-xs text-muted-foreground mt-1">Total XP</p>
                    </div>
                    <div className="bg-accent/10 rounded-lg p-4 border border-accent/20">
                      <p className="text-2xl font-bold text-accent">{levelProgress.toFixed(0)}%</p>
                      <p className="text-xs text-muted-foreground mt-1">To Next Level</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Achievements */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-accent" />
                    Achievements Unlocked
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {ACHIEVEMENTS.map((achievement) => {
                      const Icon = achievement.icon;
                      return (
                        <div key={achievement.id} className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg border border-border">
                          <div className="flex-shrink-0 w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                            <Icon className="w-6 h-6 text-accent" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold">{achievement.title}</h4>
                            <p className="text-sm text-muted-foreground">{achievement.description}</p>
                          </div>
                          <Badge variant="outline" className="border-accent text-accent">New</Badge>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Stats Overview */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Your Stats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: "Quests Completed", value: "42", icon: "✅" },
                      { label: "Current Streak", value: `${CURRENT_USER.streak} days`, icon: "🔥" },
                      { label: "Total Badges", value: "8", icon: "🏅" },
                      { label: "Rank", value: `#${CURRENT_USER.rank}`, icon: "👑" },
                    ].map((stat, i) => (
                      <div key={i} className="p-4 bg-muted/30 rounded-lg border border-border">
                        <p className="text-2xl font-bold mb-1">{stat.value}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <span>{stat.icon}</span>
                          {stat.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Next Level Prediction */}
              <Card className="border-border bg-gradient-to-br from-sidebar to-sidebar/80 text-white">
                <CardHeader>
                  <CardTitle className="text-lg">Level Up Soon!</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sidebar-foreground/80 text-sm mb-3">
                      Complete just <span className="font-bold text-accent">{Math.ceil(xpToNextLevel / 150)}</span> more high-value quests to reach <span className="font-bold">Level {CURRENT_USER.level + 1}</span>
                    </p>
                    <div className="bg-sidebar-border/30 rounded-lg p-3 text-sm">
                      <p className="text-sidebar-foreground/60">Next reward: <span className="text-primary font-bold">Tier 2 Badge</span></p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-base">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { action: "Completed", quest: "Laundry Expedition", xp: 300, time: "2h ago" },
                    { action: "Claimed", quest: "Conquer the Dish Mountain", xp: 150, time: "5h ago" },
                    { action: "Leveled Up", quest: "to Level 12", xp: 0, time: "1 day ago" },
                  ].map((activity, i) => (
                    <div key={i} className="flex justify-between items-start text-sm pb-3 border-b border-border last:border-b-0">
                      <div>
                        <p className="font-medium">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">{activity.quest}</p>
                      </div>
                      <div className="text-right">
                        {activity.xp > 0 && <p className="text-accent font-tech font-bold">+{activity.xp} XP</p>}
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
