import { useState } from "react";
import { Navigation } from "@/components/layout/Navigation";
import { AddQuestDialog } from "@/components/settings/AddQuestDialog";
import { QuestBoard } from "@/components/dashboard/QuestBoard";
import { TaskCard } from "@/components/dashboard/TaskCard";
import { Leaderboard } from "@/components/dashboard/Leaderboard";
import { motion } from "framer-motion";
import { Filter, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuests } from "@/lib/quests-context";
import generatedMap from "@assets/generated_images/topographic_map_pattern_texture.png";
import heroImage from "@assets/generated_images/adventure_enthusiasts_hero_image.png";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const [filter, setFilter] = useState<'all' | 'mountain' | 'ocean'>('all');
  const [showBoard, setShowBoard] = useState(true);
  const { tasks, completeQuest, claimQuest, addQuest, updateQuest, deleteQuest } = useQuests();
  const { toast } = useToast();

  const filteredTasks = tasks.filter(t => filter === 'all' || t.type === filter);

  const handleComplete = (id: number) => {
    const task = tasks.find(t => t.id === id);
    completeQuest(id);
    if (task) {
      toast({
        title: "Mission Complete! 🎉",
        description: `You've conquered "${task.title}" and earned ${task.xp} XP.`,
        className: "bg-primary text-primary-foreground border-none",
      });
    }
  };

  const handleClaim = (id: number) => {
     const task = tasks.find(t => t.id === id);
     claimQuest(id);
     if (task) {
      toast({
        title: "Quest Accepted ⚔️",
        description: `You are now assigned to "${task.title}". Good luck, Ranger.`,
      });
     }
  };

  const handleAddQuest = (newQuest: any) => {
    addQuest(newQuest);
  };

  const handleEditQuest = (updatedQuest: any) => {
    updateQuest(updatedQuest);
  };

  const handleDeleteQuest = (id: number) => {
    deleteQuest(id);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <Navigation />
      
      <main className="flex-1 md:ml-64 pb-20 md:pb-0 relative">
        {/* Background Texture */}
        <div 
          className="fixed inset-0 opacity-[0.03] pointer-events-none z-0 bg-repeat" 
          style={{ backgroundImage: `url(${generatedMap})`, backgroundSize: '400px' }}
        />
        
        <div className="relative z-10 max-w-5xl mx-auto p-4 md:p-8 space-y-8">
          
          {/* Hero Section */}
          <div className="relative rounded-3xl overflow-hidden bg-sidebar text-white shadow-2xl shadow-sidebar/20 min-h-[180px] flex items-center">
            <div className="absolute inset-0 z-0">
              <img src={heroImage} alt="Adventure Hero" className="w-full h-full object-cover opacity-40 mix-blend-overlay" />
              <div className="absolute inset-0 bg-gradient-to-r from-sidebar via-sidebar/80 to-transparent" />
            </div>
            
            <div className="relative z-10 p-8 max-w-lg">
              <div className="flex items-center gap-2 mb-2 text-accent font-bold font-tech uppercase tracking-wider text-xs">
                <Sparkles className="w-3 h-3" />
                Daily Briefing
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-2">
                Morning, Ranger.
              </h2>
              <p className="text-sidebar-foreground/80 leading-relaxed">
                The dish mountain is growing, but the laundry seas are calm. 
                Current household status: <span className="text-primary font-bold">Manageable</span>.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Quest Board */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <h3 className="text-xl font-display font-bold">Active Quests</h3>
                <div className="flex gap-2 flex-wrap">
                  <div className="flex gap-2 bg-card border p-1 rounded-lg">
                    <Button 
                      variant={showBoard ? 'secondary' : 'ghost'} 
                      size="sm" 
                      onClick={() => setShowBoard(true)}
                      className="h-7 text-xs"
                    >
                      📋 Board
                    </Button>
                    <Button 
                      variant={!showBoard ? 'secondary' : 'ghost'} 
                      size="sm" 
                      onClick={() => setShowBoard(false)}
                      className="h-7 text-xs"
                    >
                      📝 List
                    </Button>
                  </div>
                  <div className="flex gap-2 bg-card border p-1 rounded-lg">
                    <Button 
                      variant={filter === 'all' ? 'secondary' : 'ghost'} 
                      size="sm" 
                      onClick={() => setFilter('all')}
                      className="h-7 text-xs"
                    >
                      All
                    </Button>
                    <Button 
                      variant={filter === 'mountain' ? 'secondary' : 'ghost'} 
                      size="sm" 
                      onClick={() => setFilter('mountain')}
                      className="h-7 text-xs gap-1"
                    >
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      Land
                    </Button>
                    <Button 
                      variant={filter === 'ocean' ? 'secondary' : 'ghost'} 
                      size="sm" 
                      onClick={() => setFilter('ocean')}
                      className="h-7 text-xs gap-1"
                    >
                      <div className="w-2 h-2 rounded-full bg-secondary" />
                      Sea
                    </Button>
                  </div>
                </div>
              </div>

              {showBoard ? (
                <QuestBoard 
                  quests={filteredTasks}
                  onComplete={handleComplete}
                  onClaim={handleClaim}
                  onEdit={handleEditQuest}
                  onDelete={handleDeleteQuest}
                />
              ) : (
                <div className="space-y-4">
                  {filteredTasks.map((task) => (
                    <TaskCard 
                      key={task.id} 
                      task={task} 
                      onComplete={handleComplete}
                      onClaim={handleClaim}
                      onEdit={handleEditQuest}
                      onDelete={handleDeleteQuest}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar Widgets */}
            <div className="space-y-6">
              <AddQuestDialog onAddQuest={handleAddQuest} />
              
              <Leaderboard />
              
              <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-6 border border-primary/10">
                <h4 className="font-bold font-display text-lg mb-2">Weekly Challenge</h4>
                <p className="text-sm text-muted-foreground mb-4">Complete 20 tasks collectively to unlock the "Weekend Warrior" badge.</p>
                <div className="w-full bg-background h-3 rounded-full overflow-hidden border border-border">
                   <div className="bg-accent h-full w-[45%]" />
                </div>
                <p className="text-right text-xs font-bold mt-1 text-accent">9/20 Completed</p>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
