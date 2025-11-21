import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TaskCard } from "./TaskCard";
import { motion } from "framer-motion";

interface QuestBoardProps {
  quests: any[];
  onComplete: (id: number) => void;
  onClaim: (id: number) => void;
  onEdit: (updatedQuest: any) => void;
  onDelete: (id: number) => void;
  dashboardMode?: boolean;
}

export function QuestBoard({ quests, onComplete, onClaim, onEdit, onDelete, dashboardMode }: QuestBoardProps) {
  const columns = [
    { status: "open", label: "Available", icon: "✨", color: "bg-blue-500/10 border-blue-500/20" },
    { status: "in-progress", label: "In Progress", icon: "⚔️", color: "bg-amber-500/10 border-amber-500/20" },
    { status: "completed", label: "Completed", icon: "✅", color: "bg-green-500/10 border-green-500/20" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-display font-bold">Quest Board</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((col) => {
          const columnQuests = quests.filter(q => q.status === col.status);
          
          return (
            <motion.div key={col.status} layout>
              <Card className={`${col.color} border-2 h-full`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{col.icon}</span>
                    <div>
                      <CardTitle className="text-sm md:text-base">{col.label}</CardTitle>
                      <p className="text-xs text-muted-foreground mt-1">{columnQuests.length} {columnQuests.length === 1 ? 'quest' : 'quests'}</p>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3 max-h-[70vh] overflow-y-auto">
                  {columnQuests.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-sm text-muted-foreground">No quests here</p>
                    </div>
                  ) : (
                    columnQuests.map((quest) => (
                      <div key={quest.id} className="bg-background/50 rounded-lg p-3 border border-border/50 hover:border-border transition-colors">
                        <h4 className="font-bold text-sm mb-1 line-clamp-2">{quest.title}</h4>
                        <p className="text-xs text-muted-foreground mb-2 line-clamp-1">{quest.description}</p>
                        
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex gap-1">
                            {Array(5).fill(0).map((_, i) => (
                              <div key={i} className={`w-2 h-2 rounded-full ${i < quest.difficulty ? 'bg-accent' : 'bg-muted-foreground/20'}`} />
                            ))}
                          </div>
                          <span className="text-xs font-bold text-accent">{quest.xp} XP</span>
                        </div>

                        <div className="flex gap-2">
                          {dashboardMode ? (
                            <>
                              {quest.status === "open" && (
                                <button
                                  onClick={() => onClaim(quest.id)}
                                  className="flex-1 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-1.5 rounded transition-colors"
                                >
                                  Accept
                                </button>
                              )}
                              {quest.status !== "open" && (
                                <button
                                  disabled
                                  className="flex-1 text-xs bg-muted text-muted-foreground font-bold py-1.5 rounded opacity-50 cursor-not-allowed"
                                >
                                  {quest.status === "in-progress" ? "In Progress" : "Completed"}
                                </button>
                              )}
                            </>
                          ) : (
                            <>
                              {quest.status === "open" && (
                                <button
                                  onClick={() => onClaim(quest.id)}
                                  className="flex-1 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-1.5 rounded transition-colors"
                                >
                                  Accept
                                </button>
                              )}
                              {quest.status === "in-progress" && (
                                <button
                                  onClick={() => onComplete(quest.id)}
                                  className="flex-1 text-xs bg-accent hover:bg-accent/90 text-white font-bold py-1.5 rounded transition-colors"
                                >
                                  Complete
                                </button>
                              )}
                              <button
                                onClick={() => onEdit(quest)}
                                className="flex-1 text-xs bg-muted hover:bg-muted/80 text-muted-foreground font-bold py-1.5 rounded transition-colors"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => onDelete(quest.id)}
                                className="text-xs bg-destructive/10 hover:bg-destructive/20 text-destructive font-bold px-3 py-1.5 rounded transition-colors"
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
