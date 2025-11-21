import { useState } from "react";
import { Navigation } from "@/components/layout/Navigation";
import { TaskCard } from "@/components/dashboard/TaskCard";
import { TASKS } from "@/lib/data";
import { Plus, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import generatedMap from "@assets/generated_images/topographic_map_pattern_texture.png";

const QUEST_TYPES = ["All", "Land", "Sea"];
const QUEST_DIFFICULTY = ["Any", "Easy", "Medium", "Hard", "Extreme"];

export default function Quests() {
  const [tasks, setTasks] = useState(TASKS);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [difficultyFilter, setDifficultyFilter] = useState("Any");

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "All" || 
      (typeFilter === "Land" && task.type === "mountain") ||
      (typeFilter === "Sea" && task.type === "ocean");
    const matchesDifficulty = difficultyFilter === "Any" || 
      (difficultyFilter === "Easy" && task.difficulty <= 1) ||
      (difficultyFilter === "Medium" && task.difficulty === 2 || task.difficulty === 3) ||
      (difficultyFilter === "Hard" && task.difficulty === 4) ||
      (difficultyFilter === "Extreme" && task.difficulty === 5);
    return matchesSearch && matchesType && matchesDifficulty;
  });

  const handleComplete = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: 'completed' } : t));
  };

  const handleClaim = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, assignee: 1 } : t));
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <Navigation />
      
      <main className="flex-1 md:ml-64 pb-20 md:pb-0 relative">
        <div 
          className="fixed inset-0 opacity-[0.03] pointer-events-none z-0 bg-repeat" 
          style={{ backgroundImage: `url(${generatedMap})`, backgroundSize: '400px' }}
        />
        
        <div className="relative z-10 max-w-5xl mx-auto p-4 md:p-8 space-y-8">
          
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-display font-bold mb-1">Quest Board</h1>
              <p className="text-muted-foreground text-sm">All household expeditions</p>
            </div>
            <Button className="bg-accent hover:bg-accent/90 text-white font-bold gap-2">
              <Plus className="w-4 h-4" />
              Create Quest
            </Button>
          </div>

          {/* Filters */}
          <Card className="border-border bg-card">
            <CardContent className="pt-6 space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Search Quests</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input 
                    placeholder="Find a quest..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Type</label>
                  <div className="flex gap-2 flex-wrap">
                    {QUEST_TYPES.map(type => (
                      <button
                        key={type}
                        onClick={() => setTypeFilter(type)}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                          typeFilter === type
                            ? type === "Land" 
                              ? "bg-primary text-primary-foreground" 
                              : type === "Sea"
                              ? "bg-secondary text-secondary-foreground"
                              : "bg-foreground text-background"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Difficulty</label>
                  <div className="flex gap-2 flex-wrap">
                    {QUEST_DIFFICULTY.map(diff => (
                      <button
                        key={diff}
                        onClick={() => setDifficultyFilter(diff)}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                          difficultyFilter === diff
                            ? "bg-accent text-accent-foreground"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                      >
                        {diff}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total Quests", value: tasks.length, icon: "🎯" },
              { label: "Available", value: tasks.filter(t => t.status === "open").length, icon: "✨" },
              { label: "In Progress", value: tasks.filter(t => t.status === "in-progress").length, icon: "⚔️" },
              { label: "Completed", value: tasks.filter(t => t.status === "completed").length, icon: "✅" },
            ].map((stat, i) => (
              <Card key={i} className="border-border">
                <CardContent className="pt-4">
                  <p className="text-2xl font-bold mb-1">{stat.value}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <span>{stat.icon}</span>
                    {stat.label}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quests List */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold font-display">
              {filteredTasks.length} {filteredTasks.length === 1 ? 'Quest' : 'Quests'} Available
            </h2>
            
            {filteredTasks.length === 0 ? (
              <Card className="border-border bg-muted/20">
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground mb-2">No quests match your filters</p>
                  <p className="text-sm text-muted-foreground/60">Try adjusting your search criteria</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredTasks.map((task) => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    onComplete={handleComplete}
                    onClaim={handleClaim}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
