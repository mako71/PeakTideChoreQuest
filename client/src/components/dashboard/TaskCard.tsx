import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, Mountain, Waves, ChevronDown, ChevronUp, User, Zap, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { EditQuestDialog } from "@/components/settings/EditQuestDialog";
import { USERS } from "@/lib/data";

interface TaskCardProps {
  task: any;
  onComplete?: (id: number) => void;
  onClaim?: (id: number) => void;
  onEdit?: (updatedQuest: any) => void;
  onDelete?: (id: number) => void;
  dashboardMode?: boolean;
}

export function TaskCard({ task, onComplete, onClaim, onEdit, onDelete, dashboardMode }: TaskCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const toggleStep = (index: number) => {
    if (completedSteps.includes(index)) {
      setCompletedSteps(completedSteps.filter((i) => i !== index));
    } else {
      setCompletedSteps([...completedSteps, index]);
    }
  };

  const progress = task.steps.length > 0 
    ? (completedSteps.length / task.steps.length) * 100 
    : 0;

  const difficultyIcons = Array(5).fill(0).map((_, i) => (
    <div key={i} className={cn(
      "w-3 h-3 rounded-full border transition-colors duration-300",
      i < task.difficulty 
        ? task.type === 'mountain' ? "bg-primary border-primary" : "bg-secondary border-secondary"
        : "bg-transparent border-muted-foreground/30"
    )} />
  ));

  const assignee = USERS.find(u => u.id === task.assignee);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative"
    >
      <Card className={cn(
        "overflow-hidden border-2 transition-all duration-300 hover:shadow-lg",
        task.status === 'completed' ? "opacity-60 bg-muted/50 border-transparent" : "bg-card border-border hover:border-primary/50"
      )}>
        {/* Card Accent Line */}
        <div className={cn(
          "absolute top-0 left-0 w-1.5 h-full z-10",
          task.type === 'mountain' ? "bg-primary" : "bg-secondary"
        )} />

        <CardHeader className="pl-6 pb-2 pt-4">
          <div className="flex justify-between items-start">
            <div className="flex gap-2 items-center mb-1">
              <span className={cn(
                "text-xs font-tech font-bold px-2 py-0.5 rounded-full uppercase tracking-wider",
                task.type === 'mountain' ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary"
              )}>
                {task.type === 'mountain' ? "Basecamp" : "Offshore"}
              </span>
              <div className="flex gap-0.5">
                {difficultyIcons}
              </div>
            </div>
            <div className="flex items-center gap-3">
               <span className="text-sm font-bold text-accent flex items-center gap-1 font-tech">
                 <Zap className="w-3 h-3 fill-current" />
                 {task.xp} XP
               </span>
               {task.status !== 'completed' && (
                 <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                   {onEdit && <EditQuestDialog quest={task} onSaveQuest={onEdit} />}
                   {onDelete && (
                     <button
                       onClick={() => onDelete(task.id)}
                       className="hover:text-destructive transition-colors"
                       title="Delete quest"
                     >
                       <Trash2 className="w-4 h-4" />
                     </button>
                   )}
                 </div>
               )}
            </div>
          </div>
          <div className="flex justify-between items-center">
            <h3 className={cn("font-bold text-lg leading-none", task.status === 'completed' && "line-through text-muted-foreground")}>
              {task.title}
            </h3>
            {assignee && (
               <div className="flex items-center gap-1.5 bg-muted/50 pr-2 pl-1 py-0.5 rounded-full">
                 <img src={assignee.avatar} alt={assignee.name} className="w-5 h-5 rounded-full object-cover" />
                 <span className="text-xs font-medium text-muted-foreground">{assignee.name}</span>
               </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="pl-6 pb-3">
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{task.description}</p>
          
          {task.steps.length > 0 && (
            <div className="space-y-2">
               <div className="flex justify-between text-xs text-muted-foreground mb-1">
                 <span>Mission Progress</span>
                 <span>{Math.round(progress)}%</span>
               </div>
               <Progress value={progress} className="h-1.5 bg-muted" indicatorClassName={task.type === 'mountain' ? "bg-primary" : "bg-secondary"} />
            </div>
          )}
        </CardContent>

        <CardFooter className="pl-6 pt-0 pb-3 flex justify-between gap-2">
           {task.status === 'completed' ? (
             <Button variant="ghost" disabled className="w-full font-tech text-primary">
               <CheckCircle2 className="w-4 h-4 mr-2" />
               Mission Complete
             </Button>
           ) : dashboardMode ? (
             <>
               {task.steps.length > 0 ? (
                 <Button 
                   variant="outline" 
                   size="sm" 
                   className="w-full justify-between group-hover:bg-accent/5"
                   onClick={() => setIsExpanded(!isExpanded)}
                 >
                   <span>{isExpanded ? "Hide Steps" : "View Steps"}</span>
                   {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                 </Button>
              ) : (
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="w-full font-tech"
                  disabled={task.assignee}
                >
                  {task.assignee ? "Already Accepted" : "Accept Quest"}
                </Button>
              )}
             </>
           ) : (
             <>
              {task.steps.length > 0 ? (
                 <Button 
                   variant="outline" 
                   size="sm" 
                   className="w-full justify-between group-hover:bg-accent/5"
                   onClick={() => setIsExpanded(!isExpanded)}
                 >
                   <span>{isExpanded ? "Hide Steps" : "View Steps"}</span>
                   {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                 </Button>
              ) : (
                <div className="flex gap-2 w-full">
                   {!task.assignee && (
                     <Button variant="secondary" size="sm" className="flex-1 font-tech" onClick={() => onClaim && onClaim(task.id)}>
                       Claim Quest
                     </Button>
                   )}
                   <Button 
                    variant="default" 
                    size="sm" 
                    className={cn("flex-1 font-tech font-bold text-white", task.type === 'mountain' ? "bg-primary hover:bg-primary/90" : "bg-secondary hover:bg-secondary/90")}
                    onClick={() => onComplete && onComplete(task.id)}
                   >
                     Complete
                   </Button>
                </div>
              )}
             </>
           )}
        </CardFooter>

        {/* Expanded Steps Area */}
        {isExpanded && task.steps.length > 0 && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            className="bg-muted/30 border-t px-6 py-4 space-y-3"
          >
            {task.steps.map((step: string, idx: number) => (
              <div key={idx} className="flex items-center space-x-3">
                <Checkbox 
                  id={`task-${task.id}-step-${idx}`} 
                  checked={completedSteps.includes(idx)}
                  onCheckedChange={() => toggleStep(idx)}
                  className={task.type === 'mountain' ? "data-[state=checked]:bg-primary data-[state=checked]:border-primary" : "data-[state=checked]:bg-secondary data-[state=checked]:border-secondary"}
                />
                <label
                  htmlFor={`task-${task.id}-step-${idx}`}
                  className={cn(
                    "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer",
                    completedSteps.includes(idx) && "line-through text-muted-foreground"
                  )}
                >
                  {step}
                </label>
              </div>
            ))}
            
            {progress === 100 && (
               <Button 
                 className="w-full mt-4 bg-gradient-to-r from-primary to-secondary text-white font-bold font-tech animate-in fade-in slide-in-from-bottom-2"
                 onClick={() => onComplete && onComplete(task.id)}
               >
                 COMPLETE MISSION
               </Button>
            )}
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
}
